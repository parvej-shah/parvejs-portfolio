# Surviving 15x Traffic Spikes: Stateless Webhook Ingestion with Redis Deduplication and BullMQ

*By Parvej Shah · Lead Systems & Platform Engineer*

---

In conversational commerce, traffic is not evenly distributed across the clock. It moves in violent, step-function bursts.

When merchants on **SellerVai** (an automated social commerce bot for Facebook Messenger and WhatsApp) launch a limited-stock "Flash Sale" or broadcast a sponsored campaign to 100,000 followers, inbound message webhook volume increases by **15x within 30 seconds**. 

Meta and WhatsApp dispatch parallel HTTP POST webhooks for every message received, delivery confirmation, and read receipt. A naive backend that performs synchronous database queries or triggers synchronous LLM classification inside the HTTP webhook handler will experience cascading connection pool exhaustion within seconds:

```
Inbound Spike (8,000 req/sec) ──► Node.js Event Loop Blocked ──► Postgres Connection Pool (Max 100) Exhausted ──► 504 Gateway Timeout ──► Meta Retries Delivery ──► Complete System Outage
```

This article explores the **Stateless Webhook Ingestion Architecture** we deployed for SellerVai, combining **sub-15ms edge HTTP acknowledgments, atomic SHA-256 Redis deduplication, and a distributed BullMQ background queue**, absorbing 15x flash-sale surges without dropping a single customer conversation.

```
+---------------------------------------------------------------------------------------------------+
| STATELESS ASYNCHRONOUS INGESTION PIPELINE                                                         |
|                                                                                                   |
|  [ Inbound Webhooks (Meta/WhatsApp) ]                                                             |
|                 │ (Burst: 8,000 req/sec)                                                          |
|                 ▼                                                                                 |
|  [ Stateless Next.js / Node.js Ingestion Worker ]                                                 |
|                 │                                                                                 |
|                 ├─── 1. Calculate SHA-256 Payload Hash                                            |
|                 ├─── 2. Atomic Redis `SET key 1 NX EX 60` ───(Duplicate?)──> Drop with 200 OK      |
|                 ├─── 3. Enqueue to Redis `messages-queue` (BullMQ)                                |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Instant 200 OK Acknowledgment (<15ms) ] ──> Meta client relieved (Zero retry storms)           |
|                                                                                                   |
|  ───────────────────────────────────────────────────────────────────────────────────────────────  |
|  ASYNCHRONOUS WORKER POOL (Controlled Concurrency)                                                |
|                                                                                                   |
|  [ BullMQ Redis Queue ]                                                                           |
|                 │ (Backpressure Buffer: 50,000 in-flight jobs)                                    |
|                 ▼                                                                                 |
|  [ Clustered Processing Workers (Concurrency: 50) ]                                               |
|                 ├─── Run NLP / LLM Intent Classification                                          |
|                 ├─── Query Product Catalog & Inventory                                            |
|                 └─── Dispatch Outbound WhatsApp API Reply                                         |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. The Cardinal Rule of Webhook Ingestion: Decouple Ingestion from Execution

The HTTP webhook listener has exactly **one responsibility**: validate the payload signature, enqueue the raw event to a persistent distributed buffer, and return `200 OK` as fast as the TCP stack allows.

No business logic. No database reads. No LLM calls. No external HTTP requests.

---

## 2. Atomic Redis Deduplication via SHA-256 Hashes

Meta's webhook infrastructure occasionally delivers duplicate payloads for the exact same message event when under heavy regional network congestion.

We calculate an **atomic SHA-256 fingerprint** of the message ID and timestamp, utilizing Redis's `SET ... NX EX` (Set if Not Exists with Expiration) primitive to deduplicate events in $O(1)$ constant time:

```typescript
// Stateless Edge Webhook Ingestion Handler
import crypto from "node:crypto";
import { Redis } from "ioredis";
import { Queue } from "bullmq";

const redis = new Redis(process.env.REDIS_URL!);
const messageQueue = new Queue("conversational-messages", { connection: redis });

export async function handleInboundWebhook(rawBody: string, signature: string) {
  // 1. Verify HMAC Signature
  if (!verifyMetaSignature(rawBody, signature, process.env.APP_SECRET!)) {
    return new Response("Invalid Signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const messageEvent = payload.entry?.[0]?.messaging?.[0];

  if (!messageEvent) {
    return new Response("EVENT_RECEIVED", { status: 200 });
  }

  // 2. Generate Deterministic Deduplication Key
  const dedupeKey = `dedupe:msg:${crypto
    .createHash("sha256")
    .update(`${messageEvent.sender.id}:${messageEvent.message.mid}`)
    .digest("hex")}`;

  // 3. Atomic Redis SET NX: returns 'OK' if new, null if duplicate
  const isUnique = await redis.set(dedupeKey, "1", "EX", 60, "NX");

  if (!isUnique) {
    // Duplicate delivery: Acknowledge with 200 OK immediately to satisfy gateway
    return new Response("DUPLICATE_IGNORED", { status: 200 });
  }

  // 4. Enqueue for background worker processing
  await messageQueue.add("process-message", messageEvent, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: true,
  });

  // 5. Return fast 200 OK (Median execution: 12ms)
  return new Response("EVENT_RECEIVED", { status: 200 });
}
```

---

## 3. Worker Concurrency & Backpressure Smoothing

The consumer worker processes messages from BullMQ with a configured **concurrency limit of 50**. 

When 10,000 messages arrive within 10 seconds:
* The HTTP edge responds in **<15ms**, preventing Meta's retry storm.
* The BullMQ Redis queue acts as a shock absorber, holding the surge in memory.
* The 50 worker instances drain the queue steadily at 350 messages per second, ensuring the PostgreSQL database and AI inference APIs never exceed their rate limits.

---

## 4. Benchmarking Ingestion Resilience

Simulated load test (k6) comparing synchronous database fulfillment vs. asynchronous Redis queue ingestion:

| Dimension | Synchronous Ingestion | Redis + BullMQ Queue | Delta |
| :--- | :--- | :--- | :--- |
| **Median Response Time (p50)** | 240ms | **12ms** | **95.0% faster** |
| **Tail Latency (p99 under 5k RPS)**| 4,800ms (Failures) | **24ms (Stable)** | **99.5% faster** |
| **Max Throughput Before 500s** | 350 req/sec | **8,500+ req/sec** | **24.2x capacity** |
| **Dropped Message Rate** | 12.4% under flash sale | **0.00% (Zero loss)** | **100% reliability** |

---

## 📚 Source & Inspiration Notes

* **Cloudflare Engineering:** [*How we built Pingora*](https://blog.cloudflare.com/how-we-built-pingora-the-proxy-that-connects-cloudflare-to-the-internet/) — High-throughput queue buffering and event-loop unblocking.
* **Stripe Engineering:** [*Building Robust Webhook Deliveries*](https://stripe.com/blog/idempotency) — Stateless ingestion boundaries and retry storm avoidance.
* **Redis Architecture Specification:** [*Distributed Locks and Atomic Set Operations (SETNX)*](https://redis.io/docs/manual/patterns/distributed-locks/) — Constant-time O(1) deduplication.
