# Building Enterprise Workforce Platforms for AI: NDA Compliance, Azure AD SSO, Consensus QA, and Automated Payroll

*By Parvej Shah · Lead Systems & Platform Engineer*

---

The bottleneck in training frontier AI models is no longer raw compute—it is high-precision, verified human reasoning data.

When building the platform for **GenMorphics AI** (an enterprise workforce management system coordinating specialized domain experts across chemistry, legal, medicine, mathematics, and software engineering for LLM Supervised Fine-Tuning [SFT] and Reinforcement Learning from Human Feedback [RLHF]), the engineering challenges spanned the **entire operational lifecycle**:

1. **Recruitment & Certified Domain Onboarding:** Specialists must be tested and certified in specific domain tracks before being permitted to touch customer prompts.
2. **Strict Legal & NDA Enforcement:** Proprietary enterprise datasets cannot be viewed until the specialist has signed an immutable electronic Non-Disclosure Agreement (NDA).
3. **Enterprise Identity & Multi-Tier RBAC:** Seamless enterprise authentication via **Microsoft Azure AD (Entra ID)** and Google OAuth with strict role boundaries (Annotator vs. Validator vs. Org Admin).
4. **Consensus Quality Assurance:** Multi-specialist annotation with automated disagreement flags for senior validators to ensure high-accuracy training data.
5. **Automated Time Tracking & Payroll Engine:** Calculating compensation based on task complexity, verification passes, and hourly tracking for hundreds of global contractors.

This post breaks down the **Full-Lifecycle Workforce Platform Architecture** we engineered with **Next.js App Router, TypeScript, Prisma with PostgreSQL, NextAuth.js enterprise SSO, and Cloudflare R2**.

```
+---------------------------------------------------------------------------------------------------+
| 👥 GENMORPHICS AI FULL-LIFECYCLE WORKFORCE PIPELINE                                               |
|                                                                                                   |
|  [ Domain Expert (e.g. Biochemist / Lawyer) ]                                                     |
|                 │                                                                                 |
|                 ├─── ① Onboarding & Domain Competence Certification Exam                          |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Electronic NDA & Compliance Gate ]                                                             |
|                 │                                                                                 |
|                 ├─── ② Digital Signature Recorded with Timestamp & IP Hash                        |
|                 │    (System hard-locks all dataset access until NDA is verified)                 |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Enterprise SSO: NextAuth.js + Microsoft Azure AD (Entra ID) ]                                  |
|                 │                                                                                 |
|                 ├─── ③ Issues Session JWT with Role (`ANNOTATOR`) & Domain Track (`LEGAL_CORPUS`) |
|                 │                                                                                 |
|  ───────────────┼───────────────────────────────────────────────────────────────────────────────  |
|  TASK DISPATCH & CONSENSUS QA                                                                     |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ SFT / RLHF Task Dispatcher ]                                                                   |
|                 │                                                                                 |
|                 ├─── ④ Annotator labels multi-turn reasoning steps with time tracking             |
|                 ├─── ⑤ Senior Validator audits accuracy against ground-truth rubric               |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Verified Dataset Batch Export (JSONL Format) ] ──► Delivered to Enterprise Client               |
|                 │                                                                                 |
|  ───────────────┼───────────────────────────────────────────────────────────────────────────────  |
|  AUTOMATED COMPENSATION & PAYROLL DISTRIBUTION                                                    |
|                 │                                                                                 |
|                 └─── ⑥ Computes verified hours & task bounty ──► Generates Automated Payroll DTO |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. Enterprise SSO with NextAuth.js & Azure AD

Enterprise AI customers frequently mandate that annotators authenticate through corporate identity providers. We configured **NextAuth.js with Microsoft Azure AD (Entra ID) and Google OAuth**:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, domainTrack: true, ndaSignedAt: true },
        });

        session.user.id = token.sub;
        session.user.role = user?.role || "ANNOTATOR";
        session.user.domainTrack = user?.domainTrack || "UNSPECIFIED";
        session.user.hasSignedNda = !!user?.ndaSignedAt;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 2. The NDA Compliance Middleware Gate

Before any annotator can view task queues or download proprietary research papers from Cloudflare R2, Next.js Server Components enforce an **NDA Verification Gate**:

```typescript
// app/tasks/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function TaskLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Hard Compliance Invariant: Redirect to NDA signing if not signed
  if (!session.user.hasSignedNda) {
    redirect("/compliance/nda-signing");
  }

  return <section className="max-w-7xl mx-auto p-6">{children}</section>;
}
```

---

## 3. Automated Quality Scoring & Payroll Generation

When tasks are completed, the system calculates payroll compensation by joining time logs with quality approval rates:

$$\text{Specialist Payout} = (\text{Verified Tasks} \times \text{Task Bounty}) + (\text{Hourly Tracking} \times \text{Hourly Rate}) \times \text{Quality Multiplier}$$

If an annotator maintains a **>95% validator consensus score**, the system automatically applies quality bonuses and exports the payroll batch for financial distribution.

---

## 📚 Source & Inspiration Notes

* **NextAuth.js Enterprise Documentation:** [*Azure AD & Multi-Tenant OAuth Providers*](https://next-auth.js.org/) — Enterprise authentication architecture.
* **Linear Method:** [*Workspaces, Roles, and Permission Hierarchies*](https://linear.app/method) — RBAC design for high-velocity teams.
