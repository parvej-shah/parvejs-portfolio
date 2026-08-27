# Parvej Shah

**Software Engineer & AI Systems Developer** · Dhaka, Bangladesh  
Building production AI systems, real-time infrastructure, and full-stack platforms.

📍 University of Dhaka · CoderVai  
🌐 [parvejshah.com](https://parvejshah.com) · 📝 [dev.to/parvejshah](https://dev.to/parvejshah) · 💼 [LinkedIn](https://www.linkedin.com/in/parvej-shah) · 🐦 [X](https://twitter.com/parvejshah)

---

## 🛠️ Production Systems

| System | Engineering Focus | Stack | Highlight |
|---|---|---|---|
| **[Minions.AI](https://parvejshah.com/projects/minions-ai)** | AI Voice & Telephony | Next.js · WebRTC/SIP · Neural VAD · TypeScript FSM · Cloudflare R2 | Sub-1.8s voice round-trip with streaming STT/TTS and deterministic FSM content engine |
| **[GenMorphics AI](https://parvejshah.com/projects/genmorphics-ai)** | Enterprise Platform | Next.js 15 · Turbopack · Supabase RLS · OAuth 2.0 (Azure AD/Google) | Workforce dashboard for AI data annotation companies with multi-tier RBAC and signed asset tokens |
| **[SellerVai](https://parvejshah.com/projects/sellervai)** | High-Concurrency Webhooks | Node.js · BullMQ · Redis · WhatsApp/Messenger APIs | Stateless webhook ingestion (<15ms 200 OK) with SHA-256 Redis deduplication absorbing 15× flash-sale spikes |
| **[MathPro Academy](https://parvejshah.com/projects/mathpro-academy)** | EdTech Infrastructure | Next.js RSC · KaTeX SSR · PostgreSQL · Prisma · bKash & Nagad APIs | Server-side KaTeX (0 kB client math parser) + idempotent payment webhooks for 4,000+ students |
| **[Badhan Blood Network](https://parvejshah.com/projects/badhan-blood-network)** | Offline-First PWA | Next.js · IndexedDB · Workbox · Prisma ORM | Sub-10ms local donor search across 590+ emergency donations — works with no internet connection |
| **[CPRBD DU](https://parvejshah.com/projects/cprbd-du)** | Credential Verification | Next.js App Router · PostgreSQL · HMAC-SHA256 | Timing-safe HMAC credential engine + bulk QR generation for University of Dhaka |

---

## 📚 Engineering Deep Dives

*Problem → architecture → tradeoff → measured result.*

**AI & Voice Systems**
* 🎙️ [How We Got Voice AI Response Times Under 1.8 Seconds on Real Phone Calls](https://parvejshah.com/blog/architecting-sub-18s-voice-ai-pipelines)
* ⚡ [Why We Stopped Using LLM Agents to Control LLM Agents — Deterministic Multi-Agent FSM](https://parvejshah.com/blog/deterministic-multi-agent-systems-production)
* 🤖 [What It Actually Takes to Build a Workforce Management Dashboard for an AI Company](https://parvejshah.com/blog/engineering-precision-data-platforms-sft-rlhf)

**Infrastructure & Backend**
* 💳 [Payment Webhook Mistakes You Only Make Once — bKash & Nagad Idempotency](https://parvejshah.com/blog/defensive-webhook-engineering-payment-gateways)
* 💬 [Building a Chat-Based Sales Bot That Doesn't Drop Messages During Flash Sales](https://parvejshah.com/blog/conversational-commerce-webhook-architecture)
* 🔒 [How We Made Academic Certificates Verifiable Without a Blockchain](https://parvejshah.com/blog/cryptographic-credential-verification-institutional-web)

**Frontend & Systems**
* 📐 [Rendering Math Formulas Without Making Students Wait — Server-Side KaTeX in RSC](https://parvejshah.com/blog/rendering-katex-formulas-nextjs-server-components)
* 🩸 [Building Software for Places Where the Internet Doesn't Work — Offline-First PWA](https://parvejshah.com/blog/offline-first-pwa-emergency-volunteer-networks)
* 🧩 [The Surprising Complexity of Injecting a UI into Someone Else's Web Page](https://parvejshah.com/blog/building-manifest-v3-ai-chrome-extensions)
* 🏆 [Designing the Learning Progression Engine Behind Codervai CP](https://parvejshah.com/blog/scaling-competitive-programming-lms-architectures)

**Engineering Craft**
* ⚛️ [What I Actually Had to Change When Moving to React Server Components](https://parvejshah.com/blog/nextjs-16-turbopack-deep-dive)
* 🛠️ [The Stack I Keep Coming Back To and Why I Stop Reconsidering It](https://parvejshah.com/blog/craft-of-high-velocity-software-delivery)

---

## 🧰 Core Stack

**Languages & Frameworks** — TypeScript · JavaScript · Next.js (App Router · RSC · Turbopack) · React 19 · Node.js · Tailwind CSS  
**Backend & Real-Time** — BullMQ · Redis · WebSockets · WebRTC/SIP Telephony · REST APIs  
**Databases** — PostgreSQL · Prisma ORM · Supabase (RLS · Auth) · MongoDB · IndexedDB  
**Infrastructure** — Vercel Edge Network · Cloudflare (DNS · R2 · Workers) · Docker · Workbox PWA  
**AI & Automation** — LLM orchestration · TypeScript FSM · Neural VAD · Streaming STT/TTS · Multi-agent systems
