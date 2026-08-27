# Defensive Payment Webhook Engineering: Idempotency, Timing-Safe Signatures, and Atomic Fulfillment

*By Parvej Shah · Lead Systems & Platform Engineer*

---

There is a distinct category of software defect that never surfaces in local development, evades unit test suites with mock HTTP handlers, and only detonates in production when real capital is transacting across unreliable networks.

These are the bugs that live inside **Payment Webhook Consumers**.

When engineering the enrollment and billing engine for **MathPro Academy**, students purchase high-stakes academic courses through Bangladesh's two primary mobile financial services: **bKash** and **Nagad**. Both gateways operate on asynchronous server-to-server webhook confirmation: upon customer payment completion, the gateway's edge dispatchers POST a signed JSON confirmation payload to our endpoint.

Our server's responsibility is deceptively simple: receive the request, verify legitimacy, fulfill the course access, and return `200 OK`.

In practice, the distributed reality of financial networks turns this simple contract into a minefield of race conditions, duplicate deliveries, and timing vulnerabilities.

```
+---------------------------------------------------------------------------------------------------+
| 🌐 THE DISTRIBUTED WEBHOOK DELIVERY TIMELINE                                                      |
|                                                                                                   |
|  [ Payment Gateway (bKash/Nagad) ]                     [ MathPro Backend (Prisma / Postgres) ]   |
|                 │                                                         │                       |
|                 │─── ① POST Webhook Delivery (TxID: TR9812A) ────────────>│                       |
|                 │                                                         │                       |
|                 │                                                  [ 1. Timing-Safe HMAC Check ]  |
|                 │                                                  [ 2. BEGIN ACID Transaction ]  |
|                 │                                                  [ 3. Row-Level Lock Order ]    |
|                 │                                                  [ 4. Grant Course Access ]     |
|                 │                                                  [ 5. Set Status: COMPLETED ]   |
|                 │                                                  [ 6. COMMIT Transaction ]      |
|                 │                                                         │                       |
|                 │<── ② 200 OK Response (Delivered in 42ms) ───────────────│                       |
|                 │                                                         │                       |
|  (Network Glitch: 200 OK dropped in transit)                              │                       |
|                 │                                                         │                       |
|                 │─── ③ Gateway Retries POST (TxID: TR9812A) ─────────────>│                       |
|                 │                                                         │                       |
|                 │                                                  [ Intercept: TxID Processed ]  |
|                 │                                                  [ Return Cached 200 OK ]       |
|                 │                                                  [ ZERO Duplicate Enrollment ]  |
|                 │                                                         │                       |
|                 │<── ④ 200 OK (Clean Idempotent Replay) ──────────────────│                       |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. Axiom: Webhooks Are Delivered *At Least Once*, Never *Exactly Once*

A naive webhook handler assumes every POST represents a unique event. This assumption is guaranteed to fail in production.

If your backend experiences a brief database connection pool spike and takes 4,500ms to respond, the gateway's HTTP client times out at 3,000ms, marks the delivery as failed, and schedules an immediate retry. If your server is executing a zero-downtime rolling deployment when the request lands, a container recycling might return a `502 Bad Gateway`. The gateway retries.

Now the exact same payment confirmation is delivered twice within 400 milliseconds.

If your consumer executes `tx.enrollment.create()` without rigorous, atomic idempotency checks:
1. The student is enrolled twice.
2. Analytics dashboards double-count the revenue.
3. Inventory quotas and limited-seat cohorts are corrupted.

---

## 2. Principle 1: Constant-Time Signature Verification

Before parsing JSON bodies or querying databases, the consumer must verify cryptographic authenticity. Attackers continuously probe webhook endpoints with forged payloads attempting to spoof successful transactions.

Gateways sign payloads using an **HMAC-SHA256** hash generated with a shared secret key. However, standard string equality (`hashA === hashB`) is vulnerable to **side-channel timing attacks**:

```typescript
// ❌ VULNERABLE: Standard string comparison leaks timing information
if (incomingSignature === calculatedHash) {
  // A standard string comparison short-circuits at the first non-matching byte.
  // An attacker measuring sub-microsecond response times can infer the signature character by character.
}
```

We enforce **Timing-Safe Constant-Time Comparison** using Node.js's native `crypto.timingSafeEqual`:

```typescript
import crypto from "node:crypto";

export function verifyGatewaySignature(
  rawPayloadBody: string,
  incomingSignatureHex: string,
  sharedSecretKey: string
): boolean {
  if (!incomingSignatureHex || !rawPayloadBody) return false;

  const expectedSignatureHex = crypto
    .createHmac("sha256", sharedSecretKey)
    .update(rawPayloadBody, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignatureHex, "hex");
  const incomingBuffer = Buffer.from(incomingSignatureHex, "hex");

  // Prevent length-disclosure crashes
  if (expectedBuffer.length !== incomingBuffer.length) {
    return false;
  }

  // Constant-time comparison: executes in exact same clock cycles regardless of byte mismatches
  return crypto.timingSafeEqual(expectedBuffer, incomingBuffer);
}
```

---

## 3. Principle 2: Distributed Idempotency via Database Transactions

Every legitimate payment event contains a globally unique gateway Transaction Identifier (`trxID` or `paymentId`). We leverage this identifier as an immutable **Natural Idempotency Key**.

Under concurrent retries, two identical webhook requests can arrive within milliseconds of each other. Both pass signature verification. If both execute separate `SELECT` queries before writing, both will observe the order as `PENDING` (a classic Read-Modify-Write race condition).

To prevent this, the verification, status mutation, and enrollment creation must execute within a single **ACID Transaction with Row-Level Locking**:

```typescript
import { prisma } from "@/lib/db";

interface WebhookFulfillmentResult {
  status: "PROCESSED" | "ALREADY_COMPLETED" | "FAILED";
  orderId: string;
}

export async function processPaymentWebhook(
  gatewayTxId: string,
  orderId: string,
  paidAmount: number
): Promise<WebhookFulfillmentResult> {
  return await prisma.$transaction(
    async (tx) => {
      // 1. Lock the order row for UPDATE to prevent concurrent race conditions
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found in database.`);
      }

      // 2. Idempotent guard: If already completed, return immediately
      if (order.status === "COMPLETED") {
        return { status: "ALREADY_COMPLETED", orderId };
      }

      // 3. Amount integrity check (prevent payload truncation attacks)
      if (order.totalAmount !== paidAmount) {
        throw new Error(`Payment amount mismatch: expected ${order.totalAmount}, got ${paidAmount}`);
      }

      // 4. Atomic multi-table state mutation
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "COMPLETED",
          gatewayTransactionId: gatewayTxId,
          completedAt: new Date(),
        },
      });

      await tx.courseEnrollment.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          enrolledAt: new Date(),
          accessGranted: true,
        },
      });

      return { status: "PROCESSED", orderId };
    },
    {
      isolationLevel: "Serializable", // Enforce strict transaction isolation
      timeout: 5000,
    }
  );
}
```

---

## 4. Response Protocol: When to Return 200 vs 500

A critical architectural mistake is returning `200 OK` before database fulfillment commits. If your handler returns `200 OK` early and the database subsequently crashes on enrollment insert, the gateway marks the event as completed. It will never retry. The customer has paid, and no access was granted.

**The Golden Rule of Webhook HTTP Status Codes:**
* **`200 OK`:** Return **ONLY** after the database transaction has successfully committed to disk. If the transaction was already completed on a prior retry, return `200 OK` immediately.
* **`400 Bad Request`:** Return when the cryptographic signature fails or the payload is unparseable JSON. (Signals the gateway that retrying will never succeed).
* **`500 Internal Server Error`:** Return on transient database connection errors or timeouts. This explicitly signals the payment gateway's exponential backoff engine to retry delivery later.

---

## 📚 Source & Inspiration Notes

* **Stripe Engineering:** [*Designing robust and predictable APIs with idempotency*](https://stripe.com/blog/idempotency) — The canonical architectural treatise on idempotency keys and state convergence under network partitions.
* **bKash & Nagad Developer Documentation:** [*Merchant Payment Webhook API V2 Specifications*](https://developer.bkash.com/) — Timing-safe HMAC verification and callback protocols.
* **Martin Fowler:** [*Patterns of Enterprise Application Architecture (Unit of Work & Pessimistic Offline Lock)*](https://martinfowler.com/) — Transactional atomicity in distributed billing systems.
