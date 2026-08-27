# Engineering High-Trust Workforce Data Platforms: Multi-Tier RBAC, Short-Lived Signed Tokens, and Postgres RLS

*By Parvej Shah · Lead Systems & Platform Engineer*

---

The bottleneck in training frontier AI models is no longer raw compute—it is high-quality, verified human reasoning data.

When building the core platform for **GenMorphics AI** (an enterprise workforce management dashboard coordinating domain specialists across chemistry, legal, mathematics, and code for LLM SFT and RLHF pipelines), the security and concurrency constraints were severe:
* **Intellectual Property Protection:** Unannotated enterprise customer datasets could not be leaked or bulk-downloaded by general annotators.
* **Role Separation:** Annotators, domain validators, and project managers required strictly partitioned permission boundaries.
* **Data Integrity:** Annotations needed consensus verification algorithms before being marked as eligible for model fine-tuning.

This post examines how we built a zero-trust enterprise workforce platform using **Next.js 15 App Router, Supabase PostgreSQL Row-Level Security (RLS), and ephemeral pre-signed Cloudflare R2 tokens**.

```
+---------------------------------------------------------------------------------------------------+
| 🔒 ZERO-TRUST WORKFORCE DATA PLATFORM ARCHITECTURE                                               |
|                                                                                                   |
|  [ Domain Specialist / Annotator Browser ]                                                        |
|                 │                                                                                 |
|                 ├─── ① JWT Auth Session (Role: `DOMAIN_ANNOTATOR`, Track: `QUANT_FINANCE`)        |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Next.js 15 App Router API Layer ]                                                              |
|                 │                                                                                 |
|                 ├─── ② Enforce Multi-Tier RBAC Middleware                                         |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ PostgreSQL with Row-Level Security (RLS) ]                                                     |
|                 │                                                                                 |
|                 ├─── ③ RLS Policy: Evaluates `auth.jwt() -> role` & `assigned_batch_id`            |
|                 │    (Annotator can ONLY read rows specifically locked to their active queue)     |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Ephemeral Signed Asset Engine ]                                                                |
|                 │                                                                                 |
|                 └─── ④ Mint 15-Minute Short-Lived HMAC Presigned URL (Cloudflare R2)              |
|                      (Raw dataset files are NEVER exposed via permanent public URLs)              |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. Zero-Leakage via Database Row-Level Security (RLS)

Application-level `WHERE` clauses are notoriously fragile: a developer forgetting `AND user_id = current_user` in a single API endpoint leaks customer data. 

We moved all authorization checks directly into the database engine via **PostgreSQL Row-Level Security**:

```sql
-- Enforce strict dataset isolation at the database kernel level
ALTER TABLE dataset_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Annotators can only view tasks explicitly assigned to them in their certified domain
CREATE POLICY annotator_task_isolation
ON dataset_tasks
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'role' = 'ANNOTATOR' AND assigned_to_user_id = auth.uid()) OR
  (auth.jwt() ->> 'role' = 'VALIDATOR' AND domain_track = (auth.jwt() ->> 'domain_track')) OR
  (auth.jwt() ->> 'role' = 'ORG_ADMIN')
);
```

Even if an attacker intercepts an internal API route, the PostgreSQL engine refuses to return unassigned task rows.

---

## 2. Ephemeral Asset Tokens via Cloudflare R2

Dataset attachments (PDF research papers, code repositories, audio transcripts) are stored in private Cloudflare R2 buckets with **zero public bucket access**.

When an annotator claims a task, the server generates an **HMAC pre-signed URL valid for exactly 15 minutes**:

```typescript
// Server-Side Presigned Token Generator
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function generateSecureAssetAccess(
  datasetKey: string,
  userRoleId: string
): Promise<string> {
  if (userRoleId === "SUSPENDED") {
    throw new Error("Unauthorized asset request.");
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: datasetKey,
  });

  // Short-lived URL expires automatically in 900 seconds (15 minutes)
  return await getSignedUrl(r2Client, command, { expiresIn: 900 });
}
```

---

## 📚 Source & Inspiration Notes

* **Stripe Security Engineering:** [*Building Secure Multi-Tenant Data Stores with PostgreSQL RLS*](https://stripe.com/blog/) — Core defense-in-depth authorization patterns.
* **Linear Method:** [*Workspaces, Roles, and Fine-Grained Permission Trees*](https://linear.app/method) — Role separation and batch queueing workflows.
