---
title: "Payment Webhook Mistakes You Only Make Once"
published: true
description: "Double enrollments, missed payments, and replay attacks: the ways payment webhook handlers go wrong in production are specific and preventable. This is what we built for MathPro Academy's bKash and Nagad integrations."
tags: ["webdev","javascript","backend","postgres"]
canonical_url: https://parvejshah.com/blog/defensive-webhook-engineering-payment-gateways
cover_image: https://parvejshah.com/blog/defensive-webhook-engineering.png
---

> *Originally published at [parvejshah.com/blog/defensive-webhook-engineering-payment-gateways](https://parvejshah.com/blog/defensive-webhook-engineering-payment-gateways) by [Parvej Shah](https://parvejshah.com).*

There's a class of bug that only appears in production, under real network conditions, with real money. You can't reproduce it in development. You can't catch it in a staging environment with predictable network responses. The first time you encounter it, it's already caused a problem — either a student received course access they didn't pay for, or a student paid and didn't receive access.

These are the bugs that live inside payment webhook handlers.

For **MathPro Academy**, students purchase course enrollments through bKash and Nagad — Bangladesh's two dominant mobile financial services. Both platforms use webhook-based payment confirmation: after a successful transaction, their servers POST a confirmation payload to your registered endpoint. Your job is to receive that POST, verify it's legitimate, fulfill the order, and respond with a success status.

The failure modes are more numerous and more subtle than they appear.

## The Network Doesn't Behave Itself

The fundamental assumption that breaks naive webhook handlers is that the POST will be delivered exactly once. It won't be.

If your server takes too long to respond, bKash or Nagad marks the delivery as failed and retries. If your server has a deployment in progress when the POST arrives, it might receive a 503. The payment gateway retries. Now the same payment confirmation has been delivered twice.

If your handler's first act is to write the enrollment to the database without checking whether it was already written — you've enrolled the student twice. The student has two active enrollments for the same course, your finance reconciliation is off by one transaction, and your per-course analytics are measuring a ghost.

## The Three Properties Every Payment Handler Needs

**Signature verification.** Before touching the database or any application logic, verify that the incoming request actually came from the payment gateway. Both bKash and Nagad include an HMAC signature header that can be validated against your shared secret key.

```typescript
function verifyPaymentSignature(
  rawBody: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  const expectedHash = crypto
    .createHmac("sha256", secretKey)
    .update(rawBody)
    .digest("hex");

  // Timing-safe comparison prevents side-channel timing attacks
  // where an attacker can infer characters of your secret by measuring
  // how long the comparison takes
  return crypto.timingSafeEqual(
    Buffer.from(expectedHash, "utf-8"),
    Buffer.from(signatureHeader, "utf-8")
  );
}
```

The timing-safe comparison is worth calling out explicitly. A naive string comparison short-circuits at the first mismatched character — slightly faster for strings that differ early. An attacker with precise timing measurements can use this to infer the hash value one character at a time. crypto.timingSafeEqual always takes the same amount of time regardless of where the strings diverge.

**Idempotency.** Every transaction has a unique transaction ID assigned by the payment gateway. Use it as a natural idempotency key. Before processing any fulfillment, check whether that transaction ID has already been processed.

```typescript
async function fulfillCourseOrder(
  transactionId: string,
  orderId: string
): Promise<{ status: "SUCCESS" | "ALREADY_PROCESSED" }> {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error(`Order ${orderId} not found`);

    if (order.status === "COMPLETED") {
      return { status: "ALREADY_PROCESSED" };
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        transactionId,
        completedAt: new Date(),
      },
    });

    await tx.enrollment.create({
      data: {
        userId: order.userId,
        courseId: order.courseId,
        enrolledAt: new Date(),
      },
    });

    return { status: "SUCCESS" };
  });
}
```

**Atomicity.** The order status update and the enrollment creation need to succeed or fail together. If the order update succeeds but the enrollment creation fails — database connectivity, constraint violation, application crash — you now have a paid order with no course access. The student is frustrated, your support queue gets a ticket, and you have to handle a manual correction.

Prisma's $transaction wraps both operations in a single database transaction. If anything in the callback throws, the entire transaction rolls back.

## Idempotency Under Concurrent Retries

There's a subtle race condition worth thinking through. Imagine the payment gateway delivers the webhook twice in very quick succession — close enough that both requests arrive before either has fully processed. Both requests pass signature verification. Both check the order status and find it as PENDING. Both proceed to the fulfillment logic.

The $transaction call handles this. Prisma issues a SELECT FOR UPDATE under the hood when you access the row inside a transaction, which acquires a row-level lock. The second concurrent request will wait at the findFirst call until the first transaction commits. By the time the second transaction proceeds, the order status has already been set to COMPLETED, and the early return fires.

## Responding to the Payment Gateway

Return a success status only after successful processing. If your handler returns success before confirming the enrollment, and then your enrollment write fails, the payment gateway considers its job done. There's no retry. The student paid and got nothing.

Return a server error code if your handler can't process the request. This signals the gateway to retry. Your idempotency logic ensures the retry is safe.

---

*Parvej Shah is a Lead Full-Stack Web Developer & Platform Architect based in Dhaka, Bangladesh. Explore full architecture case studies and production code at [parvejshah.com](https://parvejshah.com).*
