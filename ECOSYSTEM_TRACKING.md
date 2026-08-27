# 🌐 Parvej Shah — Engineering Ecosystem & Brand Registry

**Last Updated:** August 27, 2026  
**Primary Domain:** [https://parvejshah.com](https://parvejshah.com)  
**Primary Email:** `parvejshahlabib007@gmail.com`  
**GitHub:** [https://github.com/parvej-shah](https://github.com/parvej-shah)  
**DEV.to Profile:** [https://dev.to/parvejshah](https://dev.to/parvejshah)  

---

## 📌 Executive Summary of Accomplished Work

1. **Portfolio Technical Overhaul**:
   - Upgraded Next.js App Router codebase with 12 senior-grade architecture deep dives and 8 detailed project case studies (no AI fluff, no overclaims, grounded in real production constraints).
   - Replaced all typography and prose CSS (`globals.css`) for readability.
   - Built 12 minimalist 1600x900 editorial covers (`public/blog/`).

2. **Custom Domain & DNS Infrastructure**:
   - Configured custom apex domain `parvejshah.com` on Cloudflare using **CNAME Flattening** pointing to Vercel's dedicated Edge CNAME (`fc56188c7b2b2e3e.vercel-dns-017.com`).
   - Configured **308 Permanent Redirects** from `www.parvejshah.com` and `parvejshah.vercel.app` to apex `parvejshah.com`.

3. **SEO & Search Console Verification**:
   - Updated PostgreSQL database `siteUrl` configuration to `https://parvejshah.com`.
   - Verified domain ownership in **Google Search Console** under `sc-domain:parvejshah.com`.
   - Submitted `https://parvejshah.com/sitemap.xml` with **24 discovered pages and 0 errors**.

4. **Generative Engine Optimization (GEO) & Machine Discovery**:
   - Deployed ultra-fast statically prerendered `/llms.txt` (`https://parvejshah.com/llms.txt`) with sub-20ms TTFB for OpenAI `GPTBot`, Perplexity, and Claude.
   - Implemented rich Schema.org JSON-LD graph (`Person`, `WebSite`, `ProfessionalService`, `FAQPage`) in `app/layout.jsx`.

5. **Syndication Engine & Multi-Platform Distribution**:
   - Built dynamic RSS 2.0 feed generator at `https://parvejshah.com/rss.xml`.
   - Built automated syndication engine (`scripts/syndicate.ts`) with retry and rate-limit backoff.
   - Hooked auto-syndication directly into the Next.js admin panel publishing workflow (`lib/services/syndicationService.ts`).
   - Created GitHub Actions CI/CD workflow (`.github/workflows/syndicate.yml`).
   - Published all 12 flagship articles live to **DEV.to** with canonical backlinks.
   - Overhauled the **GitHub Profile README** at `https://github.com/parvej-shah`.

---

## 🔑 Account & Identity Registry

| Platform | Handle / Identifier | URL / Location | Credentials / Notes |
|---|---|---|---|
| **Primary Domain** | `parvejshah.com` | [Cloudflare Dashboard](https://dash.cloudflare.com) | Account ID: `bb80ba9f42ced995154109f99e20310f`<br>Registrant: `parvejshahlabib007@gmail.com` |
| **Vercel Hosting** | `parvejshah` (`parvejs-portfolio`) | [Vercel Dashboard](https://vercel.com/dashboard) | Primary Production Domain: `parvejshah.com`<br>Vercel Account: `parvejshahlabib007@gmail.com` |
| **Google Account** | `parvejshahlabib007@gmail.com` | [Google Account](https://myaccount.google.com) | Primary Google Identity |
| **Google Search Console** | `sc-domain:parvejshah.com` | [GSC Dashboard](https://search.google.com/search-console) | Domain Property Verified<br>Sitemap: `https://parvejshah.com/sitemap.xml` |
| **Typo Gmail (Bridge)** | `parvejshalabib007@gmail.com` | [Gmail](https://mail.google.com) | Created as recovery bridge for initial Cloudflare domain registration typo |
| **GitHub** | `@parvej-shah` | [https://github.com/parvej-shah](https://github.com/parvej-shah) | Main code repository: `parvejs-portfolio`<br>Profile README: `parvej-shah/parvej-shah` |
| **DEV.to** | `@parvejshah` | [https://dev.to/parvejshah](https://dev.to/parvejshah) | API Key configured: `KMc1FxYpHEA4GRRCDdA9arD9`<br>Bio: `Software Engineer & AI Systems Developer \| University of Dhaka · CoderVai · Bangladesh` |
| **Hashnode** | `@parvej-shah` | [https://hashnode.com/@parvejshah](https://hashnode.com/@parvejshah) / [parvejshah.hashnode.dev](https://parvejshah.hashnode.dev) | Bio: `Software Engineer & AI Systems Developer \| University of Dhaka · CoderVai`<br>Location: `Dhaka, Bangladesh`<br>Website: `https://parvejshah.com` |
| **Peerlist** | `@parvejshah` | [https://peerlist.io/parvejshah](https://peerlist.io/parvejshah) | Bio: `Software Engineer & AI Systems Developer \| University of Dhaka · CoderVai`<br>Location: `Dhaka, BD`<br>Website: `https://parvejshah.com` |
| **Medium** | `@parvejshah` | [https://parvejshah.medium.com](https://parvejshah.medium.com) | Bio: `Software Engineer & AI Systems Developer. University of Dhaka · CoderVai. Building AI voice pipelines, real-time infra & Next.js systems. parvejshah.com` |
| **Product Hunt** | `@parvejshah` | [https://www.producthunt.com/@parvejshah](https://www.producthunt.com/@parvejshah) | Headline: `Software Engineer & AI Systems Developer`<br>About: `Building production AI voice pipelines, high-concurrency webhook infrastructure, and full-stack platforms...`<br>Website: `https://parvejshah.com`<br>LinkedIn: `https://www.linkedin.com/in/parvej-shah` |
| **LinkedIn** | `parvej-shah` | [https://www.linkedin.com/in/parvej-shah](https://www.linkedin.com/in/parvej-shah) | Linked in JSON-LD `sameAs` graph |

---

## 🔐 Environment Variables & Secrets Configuration

### Local Environment (`.env`):
```ini
DATABASE_URL=postgresql://neondb_owner:npg_YfIa5dJPcO6C@ep-wandering-glitter-ao18o0n3-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://neondb_owner:npg_YfIa5dJPcO6C@ep-wandering-glitter-ao18o0n3.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

ADMIN_EMAIL=parvejshahlabib007@gmail.com
ADMIN_PASSWORD=@Parvej@2026@Portfolio

R2_ACCOUNT_ID=1f53ec1fd1cecae820c14938b7831ab3
R2_BUCKET=mathpro
R2_ACCESS_KEY_ID=96ac01ae27d9198aac38ac87b1fee998
R2_SECRET_ACCESS_KEY=44189b51fd1eb68614a792ecb7d891c23d8ae68cc3e85465260b0727f29f0235
R2_ENDPOINT=https://1f53ec1fd1cecae820c14938b7831ab3.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://cdn.mathpro.academy

DEVTO_API_KEY=KMc1FxYpHEA4GRRCDdA9arD9
NEXT_PUBLIC_SITE_URL=https://parvejshah.com
```

### Vercel Production Environment:
* `DEVTO_API_KEY`: `KMc1FxYpHEA4GRRCDdA9arD9` (Saved across Production, Preview, Development)
* `NEXT_PUBLIC_SITE_URL`: `https://parvejshah.com`

---

## 📚 Complete Syndication & Live Blog Registry

All 12 articles are live on both the **Canonical Portfolio** and **DEV.to**:

| # | Article Title | Canonical URL (Portfolio) | Live DEV.to URL |
|---|---|---|---|
| 1 | **How We Got Voice AI Response Times Under 1.8 Seconds on Real Phone Calls** | [`/blog/architecting-sub-18s-voice-ai-pipelines`](https://parvejshah.com/blog/architecting-sub-18s-voice-ai-pipelines) | [DEV.to Link](https://dev.to/parvejshah/how-we-got-voice-ai-response-times-under-18-seconds-on-real-phone-calls-1m8k) |
| 2 | **Why We Stopped Using LLM Agents to Control LLM Agents** | [`/blog/deterministic-multi-agent-systems-production`](https://parvejshah.com/blog/deterministic-multi-agent-systems-production) | [DEV.to Link](https://dev.to/parvejshah/why-we-stopped-using-llm-agents-to-control-llm-agents-deterministic-multi-agent-fsm-4jpj) |
| 3 | **What It Actually Takes to Build a Workforce Management Dashboard for an AI Company** | [`/blog/engineering-precision-data-platforms-sft-rlhf`](https://parvejshah.com/blog/engineering-precision-data-platforms-sft-rlhf) | [DEV.to Link](https://dev.to/parvejshah/what-it-actually-takes-to-build-a-workforce-management-dashboard-for-an-ai-company-4pja) |
| 4 | **Building a Chat-Based Sales Bot That Doesn't Drop Messages During Flash Sales** | [`/blog/conversational-commerce-webhook-architecture`](https://parvejshah.com/blog/conversational-commerce-webhook-architecture) | [DEV.to Link](https://dev.to/parvejshah/building-a-chat-based-sales-bot-that-doesnt-drop-messages-during-flash-sales-2i77) |
| 5 | **Rendering Math Formulas Without Making Students Wait** | [`/blog/rendering-katex-formulas-nextjs-server-components`](https://parvejshah.com/blog/rendering-katex-formulas-nextjs-server-components) | [DEV.to Link](https://dev.to/parvejshah/rendering-math-formulas-without-making-students-wait-server-side-katex-in-rsc-26ik) |
| 6 | **Payment Webhook Mistakes You Only Make Once** | [`/blog/defensive-webhook-engineering-payment-gateways`](https://parvejshah.com/blog/defensive-webhook-engineering-payment-gateways) | [DEV.to Link](https://dev.to/parvejshah/payment-webhook-mistakes-you-only-make-once-bkash-nagad-idempotency-3j05) |
| 7 | **The Surprising Complexity of Injecting a UI into Someone Else's Web Page** | [`/blog/building-manifest-v3-ai-chrome-extensions`](https://parvejshah.com/blog/building-manifest-v3-ai-chrome-extensions) | [DEV.to Link](https://dev.to/parvejshah/the-surprising-complexity-of-injecting-a-ui-into-someone-elses-web-page-32p) |
| 8 | **Building Software for Places Where the Internet Doesn't Work** | [`/blog/offline-first-pwa-emergency-volunteer-networks`](https://parvejshah.com/blog/offline-first-pwa-emergency-volunteer-networks) | [DEV.to Link](https://dev.to/parvejshah/building-software-for-places-where-the-internet-doesnt-work-43ec) |
| 9 | **Designing the Learning Progression Engine Behind Codervai CP** | [`/blog/scaling-competitive-programming-lms-architectures`](https://parvejshah.com/blog/scaling-competitive-programming-lms-architectures) | [DEV.to Link](https://dev.to/parvejshah/designing-the-learning-progression-engine-behind-codervai-cp-4i1p) |
| 10 | **How We Made Academic Certificates Verifiable Without a Blockchain** | [`/blog/cryptographic-credential-verification-institutional-web`](https://parvejshah.com/blog/cryptographic-credential-verification-institutional-web) | [DEV.to Link](https://dev.to/parvejshah/how-we-made-academic-certificates-verifiable-without-a-blockchain-3gd9) |
| 11 | **What I Actually Had to Change When Moving to React Server Components** | [`/blog/nextjs-16-turbopack-deep-dive`](https://parvejshah.com/blog/nextjs-16-turbopack-deep-dive) | [DEV.to Link](https://dev.to/parvejshah/what-i-actually-had-to-change-when-moving-to-react-server-components-1ee0) |
| 12 | **The Stack I Keep Coming Back To and Why I Stop Reconsidering It** | [`/blog/craft-of-high-velocity-software-delivery`](https://parvejshah.com/blog/craft-of-high-velocity-software-delivery) | [DEV.to Link](https://dev.to/parvejshah/the-stack-i-keep-coming-back-to-and-why-i-stop-reconsidering-it-1kb9) |

---

## 🛠️ Verified Production Projects Matrix

1. **[Minions.AI](https://parvejshah.com/projects/minions-ai)** — AI Voice Dispatcher & Telephony Platform (Sub-1.8s response, WebRTC/SIP, FSM Content Engine).
2. **[GenMorphics AI](https://parvejshah.com/projects/genmorphics-ai)** — Workforce Management Dashboard for AI Data Annotation (Next.js 15, Supabase RLS, SSO).
3. **[SellerVai](https://parvejshah.com/projects/sellervai)** — Multi-channel conversational commerce bot (BullMQ, Redis deduplication, 15x spike absorption).
4. **[MathPro Academy](https://parvejshah.com/projects/mathpro-academy)** — EdTech Math Coaching Platform (Server-side KaTeX, bKash/Nagad Idempotency, 4,000+ students).
5. **[Codervai CP Platform](https://parvejshah.com/projects/codervai-cp)** — Competitive Programming LMS (Atomic PostgreSQL streaks, timed cohort unlocks).
6. **[CPRBD DU](https://parvejshah.com/projects/cprbd-du)** — Center for Policy Research on Business and Development, University of Dhaka (HMAC credential verification).
7. **[LinkedIn Brand Assistant](https://parvejshah.com/projects/linkedin-brand-assistant)** — Manifest V3 AI Chrome Extension (Shadow DOM isolation, chrome.storage.local).
8. **[Badhan Blood Network](https://parvejshah.com/projects/badhan-blood-network)** — Emergency Blood Donor PWA for Amar Ekushey Hall Unit, University of Dhaka (IndexedDB offline-first).

---

## ⚡ Useful CLI Commands for Future Tasks

* **Run Local Dev Server**: `npm run dev`
* **Compile & Build App**: `npm run build`
* **Seed Database**: `npm run seed`
* **Sync & Syndicate Blog Posts to DEV.to**: `npm run syndicate`
* **Deploy to Production**: `git push origin main` (Automatic Vercel Build & Deploy)
