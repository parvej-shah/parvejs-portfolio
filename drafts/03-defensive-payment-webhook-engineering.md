# Defensive Payment Engineering: Handling Aggregator IPN Webhooks, SSLCommerz Idempotency, and Multi-Installment Fulfillment

*By Parvej Shah · Lead Systems & Platform Engineer*

---

There is a distinct category of software defect that never surfaces in local development, evades mock unit test suites, and only detonates in production when real capital transacts across flaky mobile networks.

These are the bugs that live inside **Payment Gateway Instant Payment Notification (IPN) Webhook Handlers**.

When engineering the billing infrastructure for **MathPro Academy** (4,000+ students) and **CPRBD DU** (executive academic training programs), students pay for courses and certifications through Bangladesh's primary payment aggregator: **SSLCommerz** (which routes bKash, Nagad, Rocket, Upay, Visa, and Mastercard).

Unlike simple credit card checkouts, payment aggregators in emerging markets operate on a multi-stage asynchronous callback architecture:
1. Customer initiates payment on the merchant portal and completes the transaction on the gateway interface.
2. The gateway server issues a server-to-server HTTP POST **Instant Payment Notification (IPN)** to our webhook listener.
3. The gateway redirects the customer's browser to our `/payment/success` landing page.

In theory, this lifecycle is clean. In reality, the distributed nature of cellular networks creates race conditions: the customer's browser redirect often lands **before** the server IPN arrives, or the server IPN arrives **four times in 2 seconds** due to gateway retry storms.

This deep dive documents the defensive engineering patterns we deployed to ensure **100% idempotent fulfillment, atomic multi-installment reconciliation, and zero duplicate enrollments**.

```
+---------------------------------------------------------------------------------------------------+
| 💳 ASYNCHRONOUS IPN WEBHOOK & ORDER RECONCILIATION TOPOLOGY                                       |
|                                                                                                   |
|  [ Customer Browser ]         [ Payment Gateway (SSLCommerz) ]      [ Next.js / PostgreSQL Backend ] |
|         │                                    │                                    │               |
|         │── ① Initiates Payment ────────────>│                                    │               |
|         │   (Selects Installment 1: 5,000 BDT)│                                   │               |
|         │                                    │                                    │               |
|         │   [ Completes bKash/Card Pin ]     │                                    │               |
|         │                                    │                                    │               |
|         │<── ② Browser Redirect Landing ────│                                    │               |
|         │    (Redirect to /payment/success)  │                                    │               |
|         │                                    │                                    │               |
|         │────────────────────────────────────────────────────────────────────────>│               |
|         │    (Browser hits Success Page: Status still PENDING in DB)              │               |
|         │                                    │                                    │               |
|         │                                    │── ③ Server IPN Webhook (POST) ────>│               |
|         │                                    │   (Contains `val_id` & `tran_id`)  │               |
|         │                                    │                                    │               |
|         │                                    │<── ④ Gateway Verification Query ───│               |
|         │                                    │   (GET /validator/api/merchantTransIDValidation)   |
|         │                                    │                                    │               |
|         │                                    │── ⑤ Gateway Confirms VALIDATED ───>│               |
|         │                                    │                                    │               |
|         │                                    │                             [ BEGIN TX ]           |
|         │                                    │                             [ Lock Payment Row ]   |
|         │                                    │                             [ Mark COMPLETED ]     |
|         │                                    │                             [ Grant Module Access ]|
|         │                                    │                             [ Send Email Receipt ] |
|         │                                    │                             [ COMMIT TX ]          |
|         │                                    │                                    │               |
|         │                                    │<── ⑥ Return 200 OK to IPN ─────────│               |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. The Gateway Race Condition: The Redirect-vs-IPN Deadlock

The fundamental bug that breaks naive payment implementations is assuming the IPN webhook always arrives before the user's browser redirects to the success page.

### The Failure Mode:
1. Student pays 5,000 BDT for MathPro Academy.
2. The payment gateway redirects the student's mobile browser back to `https://mathpro.academy/payment/success?tran_id=TX9812` in **300ms**.
3. The gateway's backend IPN webhook queue is under regional traffic load, and its HTTP POST takes **2,500ms** to arrive.
4. The student's browser queries the database: `order.status` is still `PENDING`.
5. The student sees an error screen: *"Payment Pending or Failed"*, panics, and calls customer support—even though the money was successfully deducted.

### The Solution: Active Server-Side Validation Query

Instead of passively waiting for the IPN webhook, the `/payment/success` route and the IPN webhook handler share an **Active Verification Service**:

```typescript
// lib/services/paymentVerificationService.ts
import { prisma } from "@/lib/db";
import axios from "axios";

interface SSLCommerzValidationResponse {
  status: "VALID" | "VALIDATED" | "FAILED" | "CANCELLED";
  tran_id: string;
  val_id: string;
  amount: string;
  currency: string;
  card_type: string;
}

export async function verifyAndFulfillPayment(
  validationId: string,
  transactionId: string
) {
  // 1. Actively query SSLCommerz validation API to confirm authenticity
  const validatorUrl = `${process.env.SSLC_BASE_URL}/validator/api/merchantTransIDValidationAPI.php`;
  const response = await axios.get<SSLCommerzValidationResponse>(validatorUrl, {
    params: {
      val_id: validationId,
      store_id: process.env.SSLC_STORE_ID,
      store_passwd: process.env.SSLC_STORE_PASSWORD,
      format: "json",
    },
  });

  const verification = response.data;

  if (verification.status !== "VALID" && verification.status !== "VALIDATED") {
    throw new Error(`Payment gateway verification failed: ${verification.status}`);
  }

  // 2. Atomic Database Transaction with Row-Level Idempotency
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.paymentInstallment.findUnique({
      where: { transactionId },
      include: { application: true },
    });

    if (!payment) throw new Error(`Transaction ${transactionId} not found.`);

    // Idempotent Guard: If already marked complete by a prior IPN, exit immediately
    if (payment.paymentStatus === "complete") {
      return { success: true, alreadyProcessed: true };
    }

    // Verify amount integrity to prevent payload tampering
    if (Number(payment.amount) !== Number(verification.amount)) {
      throw new Error(`Amount mismatch: expected ${payment.amount}, received ${verification.amount}`);
    }

    // 3. Mark payment complete & store gateway validation proof
    await tx.paymentInstallment.update({
      where: { transactionId },
      data: {
        paymentStatus: "complete",
        validationId,
        gatewayStatus: verification.status,
        paidAt: new Date(),
      },
    });

    // 4. Update parent Application & Grant Course Module Access
    await tx.application.update({
      where: { id: payment.applicationId },
      data: { paymentStatus: "complete", status: "approved" },
    });

    // 5. Ensure Enrollment Record Exists
    await tx.enrollment.upsert({
      where: { applicationId: payment.applicationId },
      update: { status: "preparing" },
      create: {
        userId: payment.application.studentId,
        applicationId: payment.applicationId,
        batchId: payment.application.batchId,
        courseName: "Academic Mathematics Certification",
        status: "preparing",
      },
    });

    return { success: true, alreadyProcessed: false };
  });
}
```

---

## 2. Multi-Installment Tuition Architecture

For high-ticket professional programs at **CPRBD DU**, tuition fees of 25,000–50,000 BDT cannot be charged in a single transaction.

We designed a **Batch Installment Plan Engine**:
* A student's enrollment application is split into structured installment schedules (e.g., *Installment 1: 10,000 BDT upon acceptance*, *Installment 2: 15,000 BDT before Module 4*).
* Each installment carries an immutable `transactionId` and tracks its own `PaymentStatus` (`pending`, `complete`, `failed`).
* **Certificate Issuance Gate:** The certificate generator mathematically inspects all required installments for a batch; if any installment remains `pending`, certificate generation is hard-locked.

---

## 📚 Source & Inspiration Notes

* **Stripe Engineering Blog:** [*Designing robust and predictable APIs with idempotency*](https://stripe.com/blog/idempotency) — Theoretical model for distributed locks and active status queries.
* **SSLCommerz API V4 Documentation:** [*Merchant Transaction Validation and IPN Specification*](https://developer.sslcommerz.com/) — Dual-channel validation architecture.
