import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { getSectionSchema, sectionKeys, type SectionKey } from "../lib/validators/section";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin user.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword },
  });
}

async function seedProjects() {
  const projects = [
    {
      slug: "minions-ai",
      title: "Minions.AI Voice",
      summary:
        "AI voice receptionist for trade contractors, built on Retell AI + n8n. Books real appointments end-to-end (Google Calendar + EspoCRM), with a multi-slot conversational intake and an in-memory availability cache that replaced a 1,272ms cold Google Calendar lookup with a <50ms cache hit. Live for a pest-control client (Ironclad Pest Solutions) and a real-estate variant (Horizon Realty).",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Minions.AI",
      role: "Full-Stack & AI Voice Engineer",
      timeline: "2025 – Present",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Retell AI (Conversation Flow + WebRTC/SIP telephony)",
        "Gemini 2.0 Flash / Gemini 3.1 Flash Lite",
        "n8n Workflow Automation (self-hosted)",
        "EspoCRM & Google Calendar",
      ],
      keyFeatures: [
        "Real end-to-end booking, not just a calendar write: one n8n workflow checks slot conflicts, creates the Google Calendar event, finds-or-creates the EspoCRM Contact, then creates a linked Opportunity (stage: 'Appointment Booked')",
        "5-minute in-memory availability cache (n8n staticData, no external cache service): cuts the check-availability webhook from a ~1,272ms cold Google Calendar round-trip to a <50ms cache-hit response",
        "Multi-slot conversational intake: redesigned from 5 rigid sequential questions to a single extraction pass that skips anything the caller already said, cutting average call length from ~3m40s to ~2m18s",
        "Deployed for a real pest-control client (Ironclad Pest Solutions) with a parallel real-estate variant (Horizon Realty), unified under a shared Multi-Industry Demo Switchboard agent architecture",
        "Real-estate variant adds automated lead scoring (0-100) and tier assignment (Tier 1 Hot / Tier 2 Warm) synced to EspoCRM on every showing booked",
        "19/19 automated regression suite covering agent config, webhook latency, Calendar CRUD, and EspoCRM sync — run before every deploy",
      ],
      problem: `Trade contractors miss inbound calls while on job sites, and an answering machine loses the lead. Early versions of the booking agent solved the "always answers" problem but introduced a new one: a five-question rigid intake and a live, uncached calendar lookup on every call made bookings slow enough (~3m40s average) that the automation cost more in call-minutes than it saved in staff time.`,
      approach: `The agent runs on Retell AI's conversation-flow engine, wired to n8n over webhook tool calls for checking availability, booking, finding, modifying, and canceling appointments. The first version averaged 3m40s per call — a five-question rigid intake, plus a live 1,272ms Google Calendar round-trip on every single availability check. Two fixes addressed both: the intake was rebuilt as a single multi-slot extraction pass that only asks for information the caller hasn't already given, and n8n's own in-memory workflow state (staticData) now caches computed availability slots for 5 minutes, so most checks return in under 50ms instead of hitting the calendar cold.

Booking itself does real CRM work inside one n8n workflow: check for slot conflicts, create the Calendar event, look up or create the EspoCRM Contact, then create an Opportunity linked to both. The same architecture now runs a second agent variant for a real-estate client (Horizon Realty), unified under a shared "Multi-Industry Demo Switchboard" Retell agent, with its own automated lead scoring and 19-test regression suite validating the Calendar/CRM integration end to end.`,
      solution: `A Retell-based voice receptionist qualifies callers and books real appointments end-to-end — a Google Calendar event plus a linked EspoCRM Contact and Opportunity — through a cache-optimized, multi-slot intake flow. It's live for a real pest-control client (Ironclad Pest Solutions) and a parallel real-estate variant (Horizon Realty) with automated lead scoring, proving the same agent architecture generalizes across industries rather than being a single-purpose script.`,
      results: `The multi-slot intake redesign cut average call length from ~3m40s to ~2m18s (measured across the most recent 45 live calls on the pest-control booking agent). The 5-minute in-memory cache turned the check-availability webhook's cold-path latency — a live 1,272ms Google Calendar round-trip — into a <50ms cache-hit response for repeat lookups within the same window; the real-estate variant's own regression suite independently confirms a 92.5ms cache-hit / 846.5ms cold-booking latency profile. Every completed booking creates a fully linked record — Calendar event, EspoCRM Contact, and EspoCRM Opportunity — with no manual re-entry required.`,
      liveUrl: "https://www.getminions.ai",
      gallery: [
        { url: "/projects/minions-landing.png", alt: "Minions.AI 24/7 AI Voice Dispatcher & Speed-to-Lead Platform" },
        { url: "/projects/minions-crew.png", alt: "Minions Digital Crew Members & Voice Pipeline Architecture" },
      ],
      order: 0,
    },
    {
      slug: "minions-content-engine",
      title: "Minions.AI Content Engine",
      summary:
        "Automated content pipeline for trade-contractor marketing: a 4-stage Qwen (DashScope) workflow drafts, edits, and reformats blog and social copy, gated by a claims-checking step before anything publishes. The gate blocks any unsourced claim outright — including a hardcoded rule against fabricating customer results, since there are no paying clients yet to attribute them to.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Minions.AI",
      role: "Full-Stack & AI Platform Engineer",
      timeline: "2025 – Present",
      techStack: [
        "n8n Workflow Automation (self-hosted)",
        "Qwen via DashScope (Alibaba Cloud)",
        "Next.js (Minions Cockpit review dashboard)",
        "TypeScript",
        "Supabase (PostgreSQL) + Prisma ORM",
        "Cloudflare R2",
      ],
      keyFeatures: [
        "4-stage Qwen pipeline sized per task: Strategist (qwen3.7-max, flagship reasoning for angle/positioning) → Writer (qwen-plus, long-form draft) → Editor (qwen3.7-flash, tightens prose + extracts/classifies claims) → Variants (qwen-flash, reformats for LinkedIn/Facebook)",
        "A claims gate classifies every extracted claim (STATISTIC/FACT/MARKET_CLAIM/PRODUCT_CLAIM/OPINION/CUSTOMER_RESULT) and checks it for a source URL before anything can publish",
        "Hardcoded rule: any CUSTOMER_RESULT claim is blocked outright, since the business has zero paying clients as of writing and any such claim would be fabricated by definition",
        "Enforcement runs in two places, not just at draft time: inline during generation (blocks immediate auto-publish) and again in a review-publisher workflow that catches anything a human approves later in the Cockpit",
        "Self-serve multi-tenant onboarding: a 4-step wizard (company snapshot → LinkedIn voice connect → 3-question brand interview → review & launch) backed by a 16-model Prisma schema (Client, ClientChannel, ToneExample, Subscription, UsageEvent, etc.) with full per-tenant data isolation, tested end-to-end with a real second tenant",
        "Real LinkedIn voice import on connect: pulls a tenant's actual recent post text via the LinkedIn API (OAuth token from Supabase Vault) into a ToneExample table used to calibrate the Writer stage's voice — with a graceful single-exemplar fallback if the read scope isn't granted",
        "Every generated hero image is uploaded to Cloudflare R2 before its URL is stored anywhere permanent — the image-gen provider's signed URLs expire in ~24h and are never persisted directly",
      ],
      problem: `Trade contractors need a steady stream of local SEO content to rank, but have neither the staff to write it nor a reliable way to keep an automated writer from confidently publishing claims nobody can back up — the actual risk with unattended content generation isn't bad prose, it's a system that states a customer result or a statistic that was never true.`,
      approach: `A scheduled harvester proposes content ideas twice a week from RSS and brand context. A webhook-triggered pipeline then runs each one through four Qwen model calls, each sized to the task rather than running a flagship model for everything — a flagship model only for the high-leverage strategy pass, progressively cheaper models for drafting, editing, and social reformatting. The Editor stage also extracts and classifies every factual claim in the draft. Before anything can publish, a claims gate checks each claim for a source: any claim it can't verify is blocked, and any claim that reports a customer result is blocked unconditionally, since the business doesn't have paying clients yet to attribute results to. The gate is enforced twice — once inline during generation, and again in a separate workflow that polls for anything a human approves later in the review dashboard — so a claim can't slip through either path.

A new tenant onboards through a 4-step self-serve wizard: a company snapshot (URL + name, auto-inferred), a one-click LinkedIn OAuth connect that pulls real recent post text into a voice sample, a 3-question brand interview that runs one LLM call to draft brand directives, and a review-and-launch step that provisions the tenant's channels and fires the first content harvest in the background. Underneath it, the tenancy model is real: a 16-model Prisma schema (Client, ClientChannel, ToneExample, Subscription, UsageEvent, and others) with full per-tenant data isolation, tested end-to-end with a real second tenant.`,
      solution: `A Qwen-powered content pipeline drafts, edits, and formats trade-specific marketing copy end to end, gated by a claims-checking step before anything publishes live to the blog or Facebook Page. Content that fails the gate — unsourced claims, or the customer-result claims the business can't yet make — stays behind human review in the Minions Cockpit dashboard rather than shipping automatically. It's the one part of the system built specifically to stop the AI from overstating what's actually been achieved.`,
      results: `The claims gate enforces itself in production: it has already blocked assets carrying unsourced statistics and fabricated customer-result claims from auto-publishing, routing them to human review instead of letting them ship. The pipeline runs on a fixed schedule (twice weekly harvest) plus on-demand drafting, publishing approved posts to the blog and Facebook Page without manual formatting or re-entry. Onboarding a new tenant is designed as a fast, self-serve 4-step flow with real per-tenant data isolation, verified end to end against a real second tenant.`,
      liveUrl: "https://minions.getminions.ai",
      gallery: [
        { url: "/projects/minions-cockpit.png", alt: "Minions.AI Multi-Agent Mission Control Cockpit & Telemetry" },
        { url: "/projects/minions-blog.png", alt: "Autonomous Technical Content & Field Guide Engine" },
      ],
      order: 1,
    },
    {
      slug: "genmorphics-ai",
      title: "GenMorphics AI",
      summary:
        "Full-lifecycle enterprise workforce management platform for GenMorphics AI Solutions. A single system of record replacing spreadsheets — covering domain-expert onboarding, skill-based task routing, a custom-built NDA lifecycle engine, database-driven access control, and automated payroll for a global contractor base.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "GenMorphics AI Solutions",
      role: "Full-Stack Web Developer & Platform Architect",
      timeline: "2025 – Present",
      techStack: [
        "Next.js (App Router, Turbopack)",
        "TypeScript",
        "NextAuth.js (Azure AD & Google SSO)",
        "PostgreSQL (Prisma ORM — 28-model schema)",
        "Supabase Storage",
        "TipTap Rich-Text Editor",
        "Radix UI / shadcn",
        "React Query",
      ],
      keyFeatures: [
        "Database-driven RBAC: roles and their permission sets (resource.action.scope) live in the database as JSON, not hardcoded enums — new roles ship without a deploy",
        "Custom NDA lifecycle engine: a TipTap-based legal document editor with a purpose-built variable-interpolation node, versioned templates, cryptographic document hashing, and bulk admin actions (void, expire, counter-sign, revert, extend)",
        "Skill taxonomy driving task routing: a categorized skill matrix (language-specific software engineering tracks, math sub-disciplines, legal, scientific writing) scopes which specialists are eligible for which task batches",
        "Enterprise SSO via NextAuth.js integrating Microsoft Azure AD (Entra ID) and Google OAuth, with verified-email account auto-linking across providers",
        "Bulk workforce operations spanning batch task assignment and batch admin actions across the contractor lifecycle",
        "Automated payroll engine computing per-assignment earnings from logged hours (hourly vs. salaried roles) plus bonuses",
      ],
      problem: `Frontier AI labs need high-precision human reasoning data from vetted domain experts — lawyers, mathematicians, software engineers, scientists. GenMorphics was coordinating all of this manually: spreadsheets for task and contractor tracking, no system-enforced compliance step before someone got access to a client's proprietary task data, and payroll reconciled by hand across a global contractor base.`,
      approach: `We built a single system of record spanning the entire contractor lifecycle. Specialists build categorized skill profiles that scope which task batches they're eligible for. Before any client asset is unlocked, a mandatory NDA has to be executed through a purpose-built e-signature engine — not a third-party service, but a TipTap-based editor that lets admins template legal documents with recipient-specific variables.

Access control isn't hardcoded into the app's role checks — permissions are rows in the database, so the org's structure can change without a code change. Payroll rules were built to match how GenMorphics actually pays people: hourly for operational work, salaried with hourly fallback for managerial roles.`,
      solution: `GenMorphics AI operates as the operating system for its entire contractor workforce. Enterprise clients get task batches worked by specialists who've cleared skill and NDA gates for that specific engagement. Admins manage roles and permissions as data, review and bulk-action NDA instances at scale, and run payroll from the same platform that tracks the work.`,
      results: `GenMorphics moved from ad hoc spreadsheets and manual paperwork to one platform governing the full contractor lifecycle — skill-scoped task routing, a system-enforced NDA gate instead of a trust-based process, role and permission changes that ship as data instead of deploys, and payroll generated from the same records as the work itself.`,
      liveUrl: "https://app.genmorphicsai.com",
      gallery: [
        { url: "/projects/genmorphics-app.png", alt: "GenMorphics AI Secure Google & Microsoft Enterprise SSO Sign In" },
        { url: "/projects/genmorphics-overview.png", alt: "GenMorphics AI Expert Dashboard & Task Management" },
        { url: "/projects/genmorphics-skills.png", alt: "Granular Skill Matrix & Software Specialization Manager" },
      ],
      order: 2,
    },
    {
      slug: "sellervai",
      title: "SellerVai",
      summary:
        "Conversational commerce platform for online merchants in Bangladesh. A per-conversation message debouncer, hybrid product search, and a DeepSeek-powered sales agent handle customer chat across Messenger, Instagram, WhatsApp, and Telegram, backed by a merchant analytics dashboard and automated follow-up nudges.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "SellerVai",
      role: "Lead Full-Stack & AI Engineer",
      timeline: "2025 – 2026",
      techStack: [
        "FastAPI (Python, Async)",
        "Next.js (App Router)",
        "PostgreSQL + PGVector (RAG fallback search)",
        "FastEmbed (multilingual-e5-small)",
        "Gemini Vision API (merchant marketing-post generation)",
        "DeepSeek via LangChain (hand-rolled tool-calling agent)",
        "Meta Graph API (Messenger, Instagram, WhatsApp)",
        "Telegram Bot API",
        "SQLAlchemy (Async)",
        "APScheduler (offline analysis & follow-up dispatch)",
      ],
      keyFeatures: [
        "Per-conversation message debouncer: an in-memory 7-second quiet-window buffer merges rapid-fire multi-message bursts into one prompt — single-process by design, with the Redis migration path already scoped in code comments for when it needs to scale past one worker",
        "Gemini Vision-powered marketing content: merchants upload product photos and Gemini Vision extracts attributes to auto-draft social posts — a merchant tool, not customer-facing recognition",
        "Hybrid product search: SQL ILIKE match first, with PGVector semantic search as a fallback over merchant-uploaded catalogs and documents for Banglish queries ILIKE misses",
        "Deterministic intent-qualification scoring: the LLM reports only observed signals (unprompted contact info, prior delivered orders, price-only questions, hard haggling) — it never assigns the score itself — and a low score nudges the agent toward requesting advance bKash payment instead of blind COD",
        "Merchant analytics suite fed by a scheduled offline conversation analyzer: conversion funnel, lost-reason analysis with estimated taka lost, demand-gap detection, and stockout cost estimation — WON outcomes are read directly from the order record, the LLM only classifies the ambiguous LOST/NO_RESPONSE cases",
        "Staged follow-up nudges (1h/24h/72h) after a buying-intent signal goes quiet, with platform-aware compliance — only the first-stage nudge is allowed on Messenger under its 24-hour messaging-window policy, later stages are cancelled there automatically",
        "Omnichannel webhook ingestion across Messenger, Instagram, WhatsApp, and Telegram, processed asynchronously per request",
        "Order creation with per-store daily follow-up caps and instant cancellation on any customer reply, order, or opt-out",
      ],
      problem: `In Bangladeshi social commerce, customers don't use search bars or SKU codes — they send screenshots and rapid-fire Banglish texts (*"ei design ta ache? dam koto?"*) straight to a seller's Facebook page or WhatsApp. Naive bots fire a completion per message, producing chaotic duplicate replies.

Separately, merchants had no visibility into why conversations weren't converting — a customer who asked about price and vanished looked identical, from the merchant's side, to one who was never going to buy.`,
      approach: `Inbound webhooks from all four channels are debounced per-conversation — a 7-second in-memory quiet window merges rapid-fire messages into one prompt before the agent sees them. Product lookups run SQL ILIKE first, falling back to PGVector semantic search over merchant-uploaded catalogs and documents when a Banglish query doesn't match literally. A hand-rolled DeepSeek tool-calling loop handles the conversation, and every order it creates carries a deterministic intent score built from signals the LLM reports but never scores itself — low-intent orders get nudged toward advance payment instead of blind COD.

Underneath the live conversation, a scheduled analyzer classifies each idle conversation for the merchant dashboard — but only the ambiguous outcomes go through an LLM; whether an order actually converted is read straight from the database, not inferred. That feeds a real insights dashboard (funnel, lost-reasons, demand gaps, stockout cost) and a staged follow-up system that nudges quiet-but-interested customers back, respecting each platform's own messaging-window rules.`,
      solution: `SellerVai runs as a single AI salesperson across a merchant's Messenger, Instagram, WhatsApp, and Telegram, replying with price, stock, and delivery info from an evolving product catalog and knowledge base. Merchants get a dashboard that explains why conversations are being lost, not just how many closed, and a follow-up system that re-engages the ones that went quiet without crossing platform messaging policies.`,
      results: `Rapid-fire message bursts get one coherent reply instead of several duplicate ones, by construction — the debouncer makes duplicate bot replies structurally impossible, not just less frequent. Merchants get lost-reason, demand-gap, and stockout-cost visibility they didn't have before, computed from real order and conversation data rather than guesswork. The follow-up system re-engages buying-intent conversations that went quiet, without violating Messenger's 24-hour messaging window.`,
      liveUrl: "https://www.sellervai.com",
      gallery: [
        { url: "/projects/sellervai-home.png", alt: "SellerVai AI Social Commerce Salesperson & Multichannel Platform" },
        { url: "/projects/sellervai-solutions.png", alt: "Omnichannel Support across WhatsApp, Messenger, Instagram & Telegram" },
        { url: "/projects/sellervai-pricing.png", alt: "SellerVai Merchant Subscription & Automation Packages" },
      ],
      order: 3,
    },
    {
      slug: "mathpro-academy",
      title: "MathPro Academy",
      summary:
        "Full-stack coaching platform for 4,000+ JSC, SSC, and HSC students across Bangladesh. Course delivery, a Lexical-based curriculum editor with inline LaTeX, SSLCommerz/MFS checkout with coupons and bundles, and an admin backend spanning analytics, fine-grained course access control, live classes, and LLM-assisted quiz import.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "MathPro Academic & Admission Care / Abdul Aziz",
      role: "Full-Stack Developer & Platform Architect",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Lexical Rich-Text Editor",
        "KaTeX (client-side, runtime LaTeX detection)",
        "SSLCommerz Payment Gateway (bKash/Nagad)",
        "PostgreSQL (raw SQL, no ORM)",
        "Express.js",
        "Tailwind CSS",
      ],
      keyFeatures: [
        "Runtime LaTeX rendering that auto-detects legacy plain-text vs. new Lexical HTML records, then walks the mounted DOM to render $...$/$$...$$ spans with KaTeX — necessary because course content is actively edited, not fixed at build time",
        "Server-verified SSLCommerz checkout: every IPN re-queries SSLCommerz's own validation API by transaction ID rather than trusting the webhook payload, cross-checks the paid amount, and inspects SSLCommerz's own fraud risk score",
        "Idempotent, audited fulfillment: every webhook attempt is logged to a payment_audit_log table; re-delivered IPNs are caught via SSLCommerz's own VALID/VALIDATED status, and duplicate enrollment attempts are treated as a non-error",
        "Course-level access control for shareholders: managerial users can be scoped to specific courses only, so a partner instructor manages their own course without seeing the rest of the platform",
        "Coupons, multi-course bundles, and standalone book purchases in one checkout path, with server-side pricing and shipping fulfillment tracking",
        "Atomic PostgreSQL UPSERT-with-CASE streak tracking that increments, resets, or holds a student's daily streak in one round trip",
        "LLM-assisted quiz import: admins convert a teacher's raw questions into the platform's JSON import schema via a documented LLM prompt",
        "Analytics V2 covering revenue, user, course, learning, and payment analytics, plus live class scheduling and role-based permissions fetched from the backend",
      ],
      problem: `Displaying LaTeX-heavy math content on the web is genuinely awkward: a client-side math library flashes raw LaTeX source before it renders, and the platform's own content history compounds it — years of plain-text course records exist alongside newer, richly-formatted Lexical HTML, so there's no single format to render ahead of time.

Separately, mobile financial service payments in Bangladesh (bKash, Nagad via SSLCommerz) are notoriously flaky: webhook retries and out-of-order delivery meant a naive "trust the webhook, write the enrollment" handler would eventually double-enroll a student or enroll one who never actually paid.`,
      approach: `For content, an earlier build-time rendering attempt didn't survive contact with a database holding two generations of content format — the fix was a runtime renderer that first normalizes legacy plain text and new Lexical HTML into one sanitized shape, then walks the DOM after mount to find and render LaTeX spans with KaTeX.

For payments, instead of trusting the webhook payload, every IPN triggers an active server-to-server query back to SSLCommerz's own validation API, cross-checked against the amount recorded at checkout and SSLCommerz's own risk score, with every attempt logged to an audit table for reconciliation.`,
      solution: `Students get formula rendering that degrades gracefully across a decade of content history instead of requiring a one-time content migration. Payments are enrolled exactly once per real transaction, with a paper trail for every webhook delivery whether it succeeded or not. On the admin side, coordinators and partner instructors operate within a permission system scoped to the courses they actually own, plus tooling built for people running cohorts day to day, not just engineers.`,
      results: `4,000+ students across JSC, SSC, and HSC tracks use the platform. Payment fulfillment has produced zero duplicate enrollments in production — caught by SSLCommerz's own validation-status check plus a duplicate-safe enrollment write, not a custom signature scheme SSLCommerz doesn't require.`,
      liveUrl: "https://www.mathpro.academy",
      gallery: [
        { url: "/projects/mathpro-home.png", alt: "MathPro Academy Mathematics Coaching & Founder Overview" },
        { url: "/projects/mathpro-courses.png", alt: "JSC, SSC & HSC Specialized Mathematics Course Tracks" },
        { url: "/projects/mathpro-features.png", alt: "Interactive Math Learning Features & Automated Checkout" },
      ],
      order: 4,
    },
    {
      slug: "codervai-cp",
      title: "Codervai CP Platform",
      summary:
        "Competitive programming training platform for BUET CSE alumni and Googlers at Codervai. An admin-triggered chapter-publishing flow keeps 4,000+ students moving through curated modules. Atomic PostgreSQL upserts handle streak tracking without race conditions when thousands of students submit near midnight.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Codervai / BUET CSE Alumni & Googlers",
      role: "Full-Stack Developer",
      timeline: "2024 – 2025",
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "PostgreSQL (raw SQL via node-postgres)",
        "HLS Video Streaming (BunnyCDN Stream + YouTube)",
      ],
      keyFeatures: [
        "Admin-triggered chapter publishing: instructors flip a chapter live from the CMS, which immediately notifies every enrolled student — a simple, reliable release mechanism instead of the more failure-prone cron-scheduled pacing it was pitched as",
        "Atomic SQL UPSERT for streak tracking: a single INSERT ON CONFLICT DO UPDATE with CASE logic decides same-day/consecutive-day/reset in one database round-trip, with same-day idempotency and anti-backdating built into the WHERE clause",
        "300+ curated algorithmic problems from C++ STL fundamentals through Dynamic Programming, Graphs, and Trees",
        "Live cohort leaderboard ranking students by problems solved and streak, backed by the same streak-tracking data",
        "Video walkthroughs delivered via BunnyCDN Stream (HLS) or YouTube embeds — no custom encoding pipeline, because reinventing video infrastructure wasn't worth the engineering cost for this platform",
        "Student dashboard tracking module completion, learning streaks, and leaderboard position",
        "Problem solutions paired with video walkthroughs explaining the reasoning, not just the accepted code",
      ],
      problem: `Competitive programming has a well-known attrition problem: students get access to a large problem bank, attempt problems that are too advanced for their current level, get frustrated, and drop out. The knowledge dependency tree is real — you can't reason about graph algorithms if you're still shaky on recursion.

The Codervai team — BUET CSE alumni and Google engineers — wanted a structured training program that enforced the right learning sequence without feeling like a rigid lockdown. Engagement mechanics like daily streaks only work if they're trustworthy — a burst of near-midnight submissions, all racing to protect a streak before the day resets, will silently corrupt a naively-implemented counter under concurrent load.`,
      approach: `Course content ships as chapters that instructors publish explicitly from the admin CMS rather than on a fixed cohort calendar — a chapter goes live the moment it's ready, and every enrolled student is notified immediately. That's a deliberate trade: less "shared pacing" theater, more reliability, since a publish button doesn't silently fail the way a cron-scheduled unlock can.

The streak concurrency problem required moving all logic to the database level. The naive approach — read the current streak, compute the new value, write it back — has a race condition when two submissions arrive for the same user within milliseconds. The fix is a single atomic SQL INSERT ON CONFLICT DO UPDATE with CASE logic: check whether yesterday was active, whether today has already been counted, or whether the streak needs to reset, all inside one WHERE-guarded statement so a stale write can't clobber a newer one.

For video, we deliberately didn't build a custom encoding pipeline. Editorial walkthroughs are delivered through BunnyCDN Stream (HLS) or plain YouTube embeds — proven infrastructure for the actual problem, rather than an in-house transcoding stack that would mostly duplicate what a CDN already does well.`,
      solution: `The platform runs as a structured curriculum with a live problem bank and an admin-controlled publishing flow: students get access to a chapter the moment an instructor marks it live, with an immediate notification. Each module pairs curated problems with in-depth video editorial walkthroughs — delivered via a CDN, not custom video infrastructure — that explain reasoning and trade-offs rather than just showing the accepted solution. A cohort leaderboard, driven by the same streak-tracking data, gives students a live sense of where they stand.`,
      results: `The platform has enrolled 4,000+ students across training cohorts, working through a bank of 300+ curated algorithmic problems. Streak tracking runs correctly under concurrent midnight submissions without duplicate increments or missed streaks — the atomic SQL implementation handles concurrency transparently at the database level, with same-day idempotency and anti-backdating guards built into the query itself.`,
      liveUrl: "https://cpnew.codervai.com",
      gallery: [
        { url: "/projects/codervai-courses.png", alt: "Codervai All Courses & Bundle Catalog" },
        { url: "/projects/codervai-module-dashboard.png", alt: "Codervai Student Learning Cockpit, Streaks & Module Progression" },
        { url: "/projects/codervai-mylearning.png", alt: "Enrolled Competitive Programming Courses & Course Bundles" },
        { url: "/projects/codervai-home.png", alt: "Codervai Competitive Programming Academy Homepage" },
      ],
      order: 5,
    },
    {
      slug: "cprbd-du",
      title: "CPR BDDU (University of Dhaka)",
      summary:
        "Institutional credentialing and executive education platform for the Center for Policy Research on Business and Development at University of Dhaka. Replaces manual Canva certificate generation with a template-driven engine, reconciles multi-installment tuition through SSLCommerz, and lets non-technical staff run program pages, cohort announcements, and a policy research repository without a developer.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Department of International Business, University of Dhaka",
      role: "Lead Full-Stack Developer & UI Architect",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "PostgreSQL (Prisma ORM — 23-model schema across 38 migrations)",
        "SSLCommerz Multi-Installment Gateway",
        "pdf-lib (visual-coordinate certificate rendering)",
        "Docker & Docker Compose",
        "Tailwind CSS",
      ],
      keyFeatures: [
        "Dynamic visual-coordinate certificate designer: pdf-lib renders certificates server-side from an admin-configured template of X/Y positioned text segments and QR placement",
        "SSLCommerz multi-installment tuition gateway with per-installment status tracking and automated balance reconciliation",
        "Payment-gated bulk certificate issuance: only enrollments with a completed application payment status are issued; unpaid students are skipped and reported back to the admin",
        "Structured, sequential certificate IDs (CPRBD-YYYY-PROGRAMCODE-BATCHCODE-NNN) verified via a rate-limited public database lookup — no HMAC or blockchain",
        "Block-based CMS: nine reusable section types that CPRBD staff reorder, toggle, and edit directly without a developer",
        "Batch-scoped announcements with automatic email fanout to enrolled students",
        "Private-by-construction class materials: stored outside public/, served only through an authenticated download route gated on enrollment, application approval, and a completed installment",
        "Dynamic per-program application forms layered on a fixed set of required profile fields",
        "Separate institutional news module and policy research repository (structured metadata + PDFs), plus a unified student dashboard gated behind email verification",
      ],
      problem: `CPRBD issues professional credentials to government officials and business executives through cohort-based executive education programs. Before this platform: certificates were built one-by-one in Canva/Photoshop by copying names into a template; nothing on the physical certificate was independently verifiable by an employer or embassy; tuition was paid in installments reconciled manually against bank slips; and every routine update to a program's public page (FAQ, pricing, testimonials) required a developer. Requirements themselves were hard to pin down — the people who actually knew how the institution ran a cohort (program coordinators, department staff) were busy university administrators, not always available for structured discovery sessions, so the user stories underlying this platform were built up through repeated, shorter interviews rather than one clean requirements phase.`,
      approach: `We built a single institutional platform spanning tuition, credentialing, and public-facing content. Tuition runs through a structured SSLCommerz installment gateway that tracks each payment against the batch fee. Certificates are generated from an admin-configured visual template — coordinates for name, course, and QR placement — rendered server-side as a PDF, and issued in bulk once a student's payment status is complete. Each issued certificate gets a structured, sequential ID that resolves at a public, rate-limited verification URL. Separately, program pages, cohort announcements, and institutional news are all editable by CPRBD staff through purpose-built admin screens, not code changes.`,
      solution: `CPRBD operates the platform end-to-end: coordinators manage cohorts and tuition, the certificate engine replaces manual design work, employers and embassies verify credentials via a public URL, and non-technical staff maintain program pages, cohort communication, and the research/news sections without engineering involvement.`,
      results: `Certificate generation moved from a manual, per-student Canva workflow to a templated, bulk, payment-gated issuance flow. Every issued certificate is publicly and instantly verifiable by ID. Program-page updates, cohort announcements, and institutional news no longer require a developer in the loop.`,
      liveUrl: "https://cprbddu.org",
      gallery: [
        { url: "/projects/cprbd-home.png", alt: "Center for Policy Research on Business and Development Portal" },
        { url: "/projects/cprbd-programs.png", alt: "National Executive Training Cohorts & Certificate Verification" },
        { url: "/projects/cprbd-researches.png", alt: "National Policy Research & Academic Publications Repository" },
      ],
      order: 6,
    },
    {
      slug: "linkedin-brand-assistant",
      title: "LinkedIn Brand Assistant",
      summary:
        "Manifest V3 Chrome extension that injects an AI comment assistant into the LinkedIn feed. Built and shipped a self-healing DOM injection system — an AI-driven strategy generator that re-derives selectors when LinkedIn's markup shifts — to survive LinkedIn's obfuscated, hashed-class DOM. Published to the Chrome Web Store; development is now paused after LinkedIn's anti-automation defenses outpaced what the self-healing system could keep up with.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Leadswave / Chrome Web Store",
      role: "Full-Stack & Chrome Extension Developer",
      timeline: "2025 – 2026",
      techStack: [
        "React",
        "TypeScript",
        "Vite",
        "Chrome Extension API (Manifest V3)",
        "Tailwind CSS",
        "Google Gemini (via Supabase Edge Functions)",
        "Supabase (auth, subscriptions, edge functions)",
      ],
      keyFeatures: [
        "AI comment generation with tone selection (Insightful, Inquiring, Supportive), grounded in extracted post text",
        "Manifest V3 service worker state persisted to chrome.storage.local — survives worker termination between interactions",
        "Self-healing DOM injection: a privacy-pruned DOM snapshot (PII stripped, ~3,000-token budget) is sent to an AI strategy generator, which returns fresh CSS selectors when LinkedIn's markup changes",
        "5-step fallback chain per page load: cached AI strategy → re-validate against live DOM → regenerate via AI (rate-limited to once per 30 min) → hardcoded fallback selector bank → legacy heuristic parser",
        "Corrupted-DOM detection: LinkedIn periodically ships builds with every semantic class name replaced by a hashed token; the extension detects this and falls back to data-view-name attribute anchors and text-content heuristics",
        "Full Supabase-backed account system: login, subscription tiers, and usage tracking — not a bring-your-own-API-key tool",
        "Published to the Chrome Web Store",
      ],
      problem: `Active LinkedIn professionals spend meaningful time reading posts and composing thoughtful replies. Composing a genuinely engaged response takes understanding the post's content and matching an appropriate tone — friction that interrupts reading flow. The harder problem, though, wasn't the AI part. It was staying alive inside a page you don't control: LinkedIn's DOM structure shifts across deployments, and periodically ships fully obfuscated builds where every semantic class name is replaced with a hashed token, breaking any extension built against fixed selectors.`,
      approach: `The extension renders an AI companion button next to each post, generating tone-selectable comment drafts from extracted post text. To survive LinkedIn's shifting DOM, later development moved from hardcoded selectors to a self-healing system: a background script periodically snapshots a pruned, privacy-safe representation of the feed DOM (PII stripped, structural attributes and short text previews only) and sends it to an AI model, which returns a JSON strategy describing where to find posts, post text, and the right injection point. That strategy is cached, validated against the live DOM on each load, and regenerated (rate-limited to avoid runaway calls) when validation fails. If the AI path is unavailable, the extension falls back to a bank of hardcoded selectors, and if that also fails, to text-content heuristics that specifically target LinkedIn's obfuscated-class builds.`,
      solution: `A working self-healing Chrome extension: AI-driven selector generation as the primary defense against DOM changes, with two layers of deterministic fallback beneath it so a failed AI call never fully breaks injection. Authentication and AI calls run through a Supabase backend with real subscription tiers, not a client-managed API key.`,
      results: `Shipped and published to the Chrome Web Store. The self-healing system is real, working engineering — but LinkedIn's DOM obfuscation and anti-automation measures kept escalating faster than a single-developer side project could track, and active development stopped after the last self-healing iteration landed. The extension remains live on the store; it isn't under active maintenance.`,
      liveUrl: "https://lnbrandassistant.xyz",
      githubUrl: "https://chromewebstore.google.com/detail/linkedin-brand-assistant/liicmnighkinlpgaagipbjbjkokknjhi",
      gallery: [
        { url: "/projects/ln-assistant-home.png", alt: "LinkedIn Brand Assistant AI Companion Landing Page" },
        { url: "/projects/ln-assistant-store.png", alt: "Chrome Web Store Published Extension" },
        { url: "/projects/ln-assistant-features.png", alt: "AI Comment Tone Customization & Workflow Engine" },
      ],
      order: 7,
    },
    {
      slug: "badhan-blood-network",
      title: "Badhan Blood Donation (Amar Ekushey Hall Unit)",
      summary:
        "AI-parsed Telegram bot for Badhan's student blood donor network at Amar Ekushey Hall, University of Dhaka. Coordinators post free-text donor submissions in a Telegram group; Gemini extracts structured records with a regex fallback, and a blood-group-indexed search surfaces eligible donors past their 4-month cooldown — 407 tracked donors, 599 logged donations.",
      status: "PUBLISHED" as const,
      featured: false,
      client: "Badhan — Amar Ekushey Hall Unit, University of Dhaka",
      role: "Lead Full-Stack Developer & Platform Architect",
      timeline: "2024 – 2025",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Prisma 7 (driver adapter)",
        "PostgreSQL (Supabase)",
        "Google Gemini (gemini-flash-latest)",
        "Telegram Bot API (Webhooks)",
        "next-pwa / Workbox",
        "Tailwind CSS",
      ],
      keyFeatures: [
        "Two donor-entry paths for two different workflows: a Telegram bot that parses donor info posted straight into the group chat with a deterministic regex/pattern engine, and a web \"Submit\" page where messier freeform paste-ins go through a Gemini AI parser first",
        "Telegram path: coordinators post donor info as free text (strict line format or comma-separated), the bot pattern-matches it into structured fields (name, blood group, phone, date, batch, hall) with zero AI dependency, and replies with a per-donor confirmation",
        "Web path: a three-tier parser chain — Gemini AI first, a fixed-format block parser, then a plain regex parser — so a single point of failure never blocks a submission",
        "Multi-key rotation with per-key cooldown (10 min) for the Gemini parser, so exhausted rate limits degrade to the fallback chain instead of failing outright",
        "Batch submission support: multiple donor blocks in one message, separated by blank lines, each parsed and confirmed independently",
        "Blood-group indexed donor search with a 4-month eligibility window computed at query time, sorted by longest-since-last-donation",
        "Human-in-the-loop correction logging (UserFeedback + an internal review page) lets coordinators flag AI mis-parses for later review",
        "Installable PWA with Workbox asset caching",
      ],
      problem: `Historically, Badhan coordinators at Amar Ekushey Hall (University of Dhaka) tracked student donors in physical paper spiral ledgers, then in ad-hoc spreadsheets. Adding a new donor meant someone manually typing structured fields into a form — a bottleneck when submissions came in fast across Telegram threads full of unstructured donor info from multiple volunteers, and error-prone when done by hand.`,
      approach: `We moved data entry into the tool volunteers already use: Telegram. A message posted in the group is scanned for donor-shaped text and parsed by a deterministic pattern engine — no AI call, no rate limit to worry about, no API cost per message. For the messier case (someone pasting a half-formatted list from a spreadsheet), a separate web "Submit" page runs the same text through Gemini first, with a fixed-block parser and a plain regex parser as fallbacks if the AI step has a bad moment. Search stays simple: an indexed lookup by blood group, filtered in-app to donors past a 4-month cooldown, sorted so the longest-idle eligible donor surfaces first.`,
      solution: `Coordinators post donor details into Telegram exactly as they'd naturally write them — no app switching, no form. A deterministic parser turns that into a structured record, with an AI-backed web form available for messier paste-ins. Duplicate and validation errors are caught before they pollute the ledger. When someone needs a donor, blood-group search plus the cooldown filter surfaces exactly who's eligible right now.`,
      results: `407 donors and 599 donation records tracked for the Amar Ekushey Hall Unit, entered almost entirely through Telegram messages rather than a form — the bot absorbed the actual workflow volunteers were already using instead of forcing a new one.`,
      liveUrl: "https://badhan.mathpro.academy",
      githubUrl: "https://github.com/parvej-shah/blood-update-badhan",
      gallery: [
        { url: "/projects/badhan-home.png", alt: "Badhan Amar Ekushey Hall Unit Dashboard & Live Blood Group Breakdown" },
        { url: "/projects/badhan-search.png", alt: "Real-time Donor Search & Multi-criteria Eligibility Filter" },
        { url: "/projects/badhan-records.png", alt: "Donor Records & Unit Donation Logs" },
      ],
      order: 8,
    },
    {
      slug: "luxeory",
      title: "Luxeory",
      summary:
        "Full-stack hotel and room booking platform with JWT authentication, date-range availability checking, and relational data modeling across properties, rooms, users, and reservations.",
      status: "PUBLISHED" as const,
      featured: false,
      client: "Independent Product",
      role: "Full-Stack Developer",
      timeline: "2024",
      techStack: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
      keyFeatures: [
        "JWT-based authentication with protected booking routes",
        "Searchable hotel and suite listings with price and amenity filters",
        "End-to-end room reservation flow with date-range selection and availability conflict checking",
        "Relational data modeling for properties, rooms, users, and reservations in MongoDB",
      ],
      problem:
        "Built as a full-stack portfolio project to practice end-to-end MERN development with real-world data modeling requirements — specifically the relationship between properties, available rooms, booking date ranges, and user accounts.",
      approach:
        "Designed the MongoDB data model to represent the booking domain correctly: hotels with multiple room types, room availability tracked against confirmed reservations with date-range overlap checking, and users with reservation history. JWT authentication protects all booking routes.",
      solution:
        "A responsive booking application with hotel discovery, room filtering, date-range selection, and a guarded checkout flow. Users can browse properties, view room details and pricing, select available dates, and confirm reservations with their authenticated account.",
      results:
        "Completed a functional full-stack booking pipeline with correct availability logic, authenticated user flows, and a mobile-friendly UI. The project demonstrated practical MERN stack proficiency before transitioning to Next.js-first development.",
      githubUrl: "https://github.com/parvej-shah",
      gallery: [
        { url: "/projects/luxeory-hero.jpg", alt: "Luxeory Full-Stack Hotel Booking Platform Hero" },
        { url: "/projects/luxeory-preview.jpg", alt: "Luxeory Reservation & Property Management Overview" },
        { url: "/projects/luxeory-booking.jpg", alt: "Luxeory Guarded Checkout & Room Selection" },
      ],
      order: 9,
    },
  ];

  for (const projectData of projects) {
    const { gallery, ...projectFields } = projectData;
    const project = await prisma.project.upsert({
      where: { slug: projectFields.slug },
      update: projectFields,
      create: projectFields,
    });

    if (gallery && gallery.length > 0) {
      await prisma.asset.deleteMany({
        where: { projectId: project.id },
      });

      for (let i = 0; i < gallery.length; i++) {
        const item = gallery[i];
        await prisma.asset.create({
          data: {
            key: `project-${project.slug}-${i + 1}`,
            url: item.url,
            alt: item.alt,
            projectId: project.id,
          },
        });
      }
    }
  }
}

import { blogPosts } from "./posts-data";

async function seedPosts() {
  for (const postData of blogPosts) {
    const { coverImage, ...postFields } = postData;

    let coverAssetId: string | undefined = undefined;

    if (coverImage) {
      const assetKey = `post-cover-${postFields.slug}`;
      const asset = await prisma.asset.upsert({
        where: { key: assetKey },
        update: {
          url: coverImage.url,
          alt: coverImage.alt,
        },
        create: {
          key: assetKey,
          url: coverImage.url,
          alt: coverImage.alt,
        },
      });
      coverAssetId = asset.id;
    }

    await prisma.post.upsert({
      where: { slug: postFields.slug },
      update: {
        ...postFields,
        status: "PUBLISHED",
        coverImageId: coverAssetId,
      },
      create: {
        ...postFields,
        status: "PUBLISHED",
        coverImageId: coverAssetId,
      },
    });
  }
}

const sectionContent: Record<SectionKey, unknown> = {
  hero: {
    eyebrow: "Software Engineer & AI Systems Developer",
    headlineLines: ["From architecture", "to production", "to scale."],
    description:
      "I design and build production AI voice pipelines, high-concurrency backend infrastructure, and full-stack web products that load fast and feel effortless.",
    primaryCta: { label: "Start a Project", href: "#contact" },
    secondaryCta: { label: "View My Work", href: "#portfolio" },
    trustLabel: "Trusted by 12+ clients",
    trustStats: [
      { value: "20+", label: "projects shipped" },
      { value: "<24h", label: "response time" },
    ],
    portraitImage: "/assets/images/banner-cutout.webp",
    portraitAlt: "Parvej Shah — Software Engineer & AI Systems Developer",
    experienceBadge: { value: "3+", label: "years experience" },
  },
  services: {
    eyebrow: "My Core Expertise",
    heading: "From high-concurrency backends to polished interfaces — engineered without bloat.",
    description:
      "Every build is measured against three things: latency, reliability, and room to grow. No bloat, no shortcuts — just work that lasts.",
    tagline: "Core Services Offered",
    items: [
      {
        icon: "Code2",
        title: "Full Stack Systems & Web Apps",
        desc: "End-to-end web applications and high-concurrency backends — clean architecture, type-safe APIs, and code that stays maintainable long after launch.",
      },
      {
        icon: "Sparkles",
        title: "Voice AI & LLM Infrastructure",
        desc: "Retell AI voice agents with n8n workflow orchestration, automated multi-stage content pipelines, and low-latency RAG systems tailored to business workflows.",
      },
      {
        icon: "Gauge",
        title: "Performance & Data Architecture",
        desc: "Zero-CLS rendering, sub-15ms vector search, Redis caching, and resilient database design — tuned until every interaction feels instant.",
      },
    ],
  },
  stats: {
    items: [
      { value: "3", suffix: "+", label: "Years of hands-on full-stack development experience" },
      { value: "20", suffix: "+", label: "Products & websites designed, built, and shipped" },
      { value: "10", suffix: "+", label: "Technologies mastered across the modern stack" },
      { value: "100", suffix: "%", label: "On-time delivery — and clients who come back" },
    ],
  },
  process: {
    eyebrow: "How I Work",
    heading: "A clear path from first idea to launched product.",
    description:
      "A focused process keeps the work calm, fast, and measurable: first we clarify what matters, then we design, build, and launch without losing sight of the business goal.",
    steps: [
      {
        icon: "Search",
        title: "Discover",
        description: "Define the audience, product goal, must-have flows, and the smallest scope worth launching.",
        deliverable: "Scope & roadmap",
      },
      {
        icon: "LayoutGrid",
        title: "Design",
        description: "Shape the experience with clear content hierarchy, conversion paths, and responsive interface details.",
        deliverable: "UI & prototype",
      },
      {
        icon: "Code2",
        title: "Build",
        description: "Develop the product with maintainable architecture, fast pages, and practical admin workflows.",
        deliverable: "Production code",
      },
      {
        icon: "Rocket",
        title: "Launch",
        description: "Ship with QA, deployment support, performance checks, and a clear plan for the next iteration.",
        deliverable: "Live product",
      },
    ],
  },
  about: {
    eyebrow: "About Me",
    heading: "Developer driven by purpose and precision.",
    image: "/assets/images/aboutme.webp",
    imageAlt: "Parvej Shah",
    quote:
      "Great software isn't just shipped — it's considered. Every decision, from the database to the last pixel, should serve the people using it.",
    quoteAuthor: "Parvej Shah",
    quoteRole: "Software Engineer & AI Systems Developer, IIT DU",
    points: [
      "AI & Automation — Retell AI voice agents, n8n workflow orchestration, automated content pipelines",
      "Full-stack depth — Next.js App Router, TypeScript, Python FastAPI, PostgreSQL & Redis",
      "Engineering foundation from IIT, University of Dhaka",
    ],
    badgeValue: "12+",
    badgeLabel: "people trust my work",
    ctaLabel: "Let's Work Together",
    ctaHref: "#contact",
  },
  skills: {
    eyebrow: "Tech Stack",
    heading: "A battle-tested stack for production systems.",
    items: [
      { name: "Next.js", icon: "SiNextdotjs" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "React", icon: "FaReact" },
      { name: "Python", icon: "SiPython" },
      { name: "Node.js", icon: "FaNodeJs" },
      { name: "PostgreSQL", icon: "SiPostgresql" },
      { name: "Prisma", icon: "SiPrisma" },
      { name: "Redis", icon: "SiRedis" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" },
      { name: "shadcn/ui", icon: "SiShadcnui" },
      { name: "Docker", icon: "SiDocker" },
      { name: "Vercel", icon: "SiVercel" },
      { name: "Git", icon: "FaGit" },
      { name: "Figma", icon: "FaFigma" },
    ],
  },
  testimonials: {
    eyebrow: "Client Feedback",
    heading: "Kind words from the people I've built with.",
    items: [
      {
        quote:
          "Parvej engineered our entire online coaching platform — from LaTeX formula rendering to payment gateway integration. The performance is flawless and our 4,000+ students love the speed.",
        name: "Abdul Aziz",
        role: "Founder, MathPro Academy",
        initials: "AA",
        avatarUrl: "",
        rating: 5,
        href: "https://www.mathpro.academy",
      },
      {
        quote:
          "Parvej built our sub-1.4s voice pipeline and Redis slot cache. His architectural choices dropped our CRM latency from 850ms to 24ms and cut our telephony costs by over 70%.",
        name: "Minions.AI Team",
        role: "Engineering Lead, Minions.AI",
        initials: "MA",
        avatarUrl: "",
        rating: 5,
        href: "https://www.getminions.ai",
      },
    ],
    clients: ["Minions.AI", "SellerVai", "MathPro Academy", "Codervai", "University of Dhaka", "GenMorphics AI", "Leadswave"],
  },
  cta: {
    rating: "4.9",
    ratingLabel: "Trusted feedback from real clients",
    heading: "Ready to build something people remember?",
    description:
      "Bring a polished brief or a napkin sketch — both work. Tell me where you want to go, and I'll map the fastest route to a product your users will love.",
    ctaLabel: "Start Your Project",
    ctaHref: "#contact",
  },
  contact: {
    eyebrow: "Let's Work Together",
    heading: "Let's turn your idea into something real.",
    description:
      "Tell me a little about what you're building — scope, timeline, or just the rough shape of it — and I'll reply within 24 hours with clear next steps.",
    info: [
      {
        icon: "Mail",
        label: "Email",
        value: "parvejshahlabib007@gmail.com",
        href: "mailto:parvejshahlabib007@gmail.com",
      },
      { icon: "MapPin", label: "Location", value: "Dhaka, Bangladesh", href: null },
      { icon: "Clock", label: "Response time", value: "Within 24 hours", href: null },
    ],
  },
  meeting: {
    eyebrow: "Set a Meeting",
    heading: "Want to talk it through live?",
    description:
      "Propose a date and time that works for you and I'll confirm by email. Once confirmed, you can add it straight to your Google Calendar.",
    durationLabel: "30 min call",
    notes: [
      "I'm based in Dhaka, Bangladesh (GMT+6) — mention your timezone if different.",
      "I'll reply within 8 hours to confirm or suggest another time.",
    ],
  },
  social: {
    links: [
      { icon: "FaGithub", label: "Github", href: "https://github.com/parvej-shah" },
      {
        icon: "FaLinkedinIn",
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/parvej-shah",
      },
      {
        icon: "FaFacebookF",
        label: "Facebook",
        href: "https://facebook.com/parvej.shahlabib",
      },
    ],
  },
  footer: {
    tagline:
      "Production AI systems and high-performance web products, built with precision, speed, and code made to last.",
    email: "parvejshahlabib007@gmail.com",
    location: "Dhaka, Bangladesh",
    newsletterHeading: "Let's stay in touch",
    newsletterDescription: "Got an idea worth building? One message starts it — I reply within 24 hours.",
    ctaLabel: "Start a Project",
    ctaHref: "/#contact",
    copyrightName: "Parvej Shah Labib",
    copyrightRole: "Software Engineer & AI Systems Developer",
  },
  seo: {
    title: "Parvej Shah — Software Engineer & AI Systems Developer",
    description:
      "Software Engineer & AI Systems Developer based at University of Dhaka, Bangladesh. I build production AI voice pipelines, high-concurrency webhook infrastructure, and full-stack systems.",
    ogImage: "/og.jpg",
    siteUrl: "https://parvejshah.com",
  },
};

async function seedSections() {
  for (const key of sectionKeys) {
    const data = getSectionSchema(key).parse(sectionContent[key]);
    await prisma.siteContent.upsert({
      where: { key },
      update: { data },
      create: { key, data },
    });
  }
}

async function main() {
  await seedAdmin();
  await seedProjects();
  await seedPosts();
  await seedSections();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
