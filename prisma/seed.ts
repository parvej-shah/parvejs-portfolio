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
      title: "Minions.AI",
      summary:
        "A 24/7 AI voice front office and content engine for trade and service contractors. Handles inbound calls, books appointments, recovers missed leads via SMS, and runs a deterministic multi-agent editorial pipeline — all without a human picking up the phone.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Minions.AI",
      role: "Full-Stack & AI Voice Engineer",
      timeline: "2025 – Present",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "Web Voice SIP / Retell AI",
        "OpenAI & Claude LLMs",
        "Cloudflare R2",
        "PostgreSQL",
        "Supabase",
      ],
      keyFeatures: [
        "Sub-1.8s voice round-trip using overlapping STT → LLM → TTS streams with neural VAD barge-in detection",
        "Speculative tool pre-fetching: technician availability queried from interim transcript before the caller finishes speaking",
        "Missed-call SMS recovery fires within seconds of a dropped call with personalized follow-up context",
        "Deterministic FSM editorial pipeline: research → draft → critic → publish, with typed state contracts and hard retry limits",
        "Mission control dashboard with per-agent telemetry, inference cost tracking, and conversation replay",
        "Two-way calendar sync for live appointment booking during calls",
      ],
      problem: `Trade contractors — plumbers, HVAC technicians, electricians — lose a significant share of inbound leads simply because no one picks up the phone. They're on a job site. The call goes to voicemail. The prospective customer calls the next contractor on the list.

The second problem was content. Contractors need consistent, localized web content to rank in local search. Most don't have the time or staff to produce it regularly, and generic blog-writing tools produce content that's obviously templated and doesn't reflect local trade knowledge.`,
      approach: `The voice pipeline was redesigned from sequential to overlapping streams. Rather than waiting for a full transcription before starting LLM generation, and waiting for the full LLM response before synthesizing audio, each stage fires as soon as it has enough data. Neural Voice Activity Detection replaced fixed silence timers, dropping end-of-turn detection from 800ms to 280ms. The first synthesized audio chunk reaches the caller in roughly 1.4 seconds from the end of their sentence.

For the editorial pipeline, the key architectural decision was to move all control flow out of the LLMs and into TypeScript. Each agent — researcher, drafter, critic — is a pure function that takes a typed state object and returns a typed delta. The state machine in TypeScript decides sequencing, retry logic, and escalation. LLMs can't improvise next steps or get stuck in loops, because they're never asked to manage execution — only to transform content.`,
      solution: `The platform runs a fleet of voice agents that answer inbound contractor calls with natural conversational flow, qualify the caller's need, check technician availability via calendar API, and confirm bookings — without human involvement. Missed calls trigger an automated SMS within seconds containing a personalized follow-up.

The editorial engine runs on a scheduled basis, harvesting trade-specific customer pain points, generating structured drafts, running them through an independent critic agent that checks for banned clichés and unsupported claims, and publishing approved content to Cloudflare R2 for CMS staging. The mission control dashboard gives operators full visibility into which agents are active, what conversations are in flight, and what the per-inference cost is running at.`,
      results: `Contractors using Minions.AI handle inbound call volume without hiring additional front-office staff. The voice agents respond in under two seconds and maintain natural conversational flow across the full appointment booking workflow.

The editorial pipeline produces consistent, on-brand content across trade verticals without manual intervention. Every published article passes through the critic validation stage, which catches generic phrasing and unverifiable claims before anything goes live.`,
      liveUrl: "https://www.getminions.ai",
      gallery: [
        { url: "/projects/minions-landing.png", alt: "Minions.AI 24/7 AI Voice Dispatcher & Speed-to-Lead Platform" },
        { url: "/projects/minions-cockpit.png", alt: "Minions.AI Multi-Agent Mission Control Cockpit & Telemetry" },
        { url: "/projects/minions-crew.png", alt: "Minions Digital Crew Members & Voice Pipeline Architecture" },
        { url: "/projects/minions-blog.png", alt: "Autonomous Technical Content & Field Guide Engine" },
      ],
      order: 0,
    },
    {
      slug: "genmorphics-ai",
      title: "GenMorphics AI",
      summary:
        "Workforce management web platform for GenMorphics AI Solutions. Coordinates a global network of domain experts across structured task assignments with enterprise SSO, granular skill verification, and time-limited secure asset access.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "GenMorphics AI Solutions",
      role: "Full-Stack Web Developer",
      timeline: "2025 – Present",
      techStack: [
        "Next.js (App Router, Turbopack)",
        "TypeScript",
        "Tailwind CSS",
        "Supabase (Storage & Auth)",
        "OAuth 2.0 (Google & Microsoft SSO)",
        "React Query",
        "PostgreSQL",
        "Row Level Security (RLS)",
      ],
      keyFeatures: [
        "Multi-dimensional skill profiling: domain category, competency depth (Introductory / Proficient / Expert), and verified vs. self-reported status",
        "Task routing logic that only assigns verified-skill tasks to experts who hold verified badges in that subcategory",
        "RBAC with four distinct roles: Expert, Quality Reviewer, Project Manager, Platform Administrator",
        "Row Level Security enforced at the database layer — unauthorized queries return no data even if application code has a bug",
        "Short-lived signed URLs (300s TTL) for all task asset access, preventing hotlinking and post-session data exposure",
        "Google Workspace and Microsoft Azure AD SSO integration for the core team",
      ],
      problem: `Managing a distributed workforce of domain specialists is fundamentally different from managing a general-purpose team. The core requirement isn't just task assignment — it's verified routing. A task requiring expert-level TypeScript skills should never reach someone who self-reported "knows JavaScript." A project manager at one client should have no visibility into tasks belonging to a different client.

The previous process involved spreadsheets for tracking assignments and email for asset delivery. This didn't scale, created compliance risk around data access, and made it genuinely difficult to match the right expert to the right task quickly.`,
      approach: `Skill profiling was structured across three dimensions: domain category (Software Engineering, Mathematics, Legal, Scientific), competency depth (Introductory, Proficient, Expert), and verification status. Task routing checks all three — a task requiring verified Expert-level Linear Algebra skills won't route to someone with self-reported Introductory status in that subcategory.

Access control was implemented at two layers. Application-layer RBAC enforces role-based route protection in Next.js middleware. Database-layer Row Level Security in Supabase/PostgreSQL enforces ownership boundaries at the query level — a project manager query for tasks will return only rows where their user ID appears in the project_managers join table, regardless of what the application code requests.

For asset security, all task materials are stored in private Supabase buckets. Access is granted only after confirming active task assignment, and only as a signed URL with a 300-second TTL.`,
      solution: `The platform gives GenMorphics a structured operational foundation for coordinating expert work at scale. Experts see only their assigned tasks and their own performance history. Project managers have full visibility into their project portfolio. Administrators manage skill verification, user roles, and cross-project reporting.

Bulk operations — importing participant lists, batch-assigning tasks to qualified experts — reduced what was previously a multi-hour manual process to a few clicks. The skill verification workflow gives administrators a clear queue of self-reported skills awaiting review and a one-click verification action.`,
      results: `Expert onboarding time dropped substantially because SSO eliminates password setup friction for the core team. The skill routing rules have eliminated mismatched task assignments — tasks requiring specialist knowledge go to verified specialists.

The data access architecture holds up to the scrutiny GenMorphics's clients apply: no cross-client data leakage, no persistent asset URLs that outlive a work session, and a complete audit trail of who accessed what and when.`,
      liveUrl: "https://app.genmorphicsai.com",
      gallery: [
        { url: "/projects/genmorphics-app.png", alt: "GenMorphics AI Secure Google & Microsoft Enterprise SSO Sign In" },
        { url: "/projects/genmorphics-overview.png", alt: "GenMorphics AI Expert Dashboard & Task Management" },
        { url: "/projects/genmorphics-skills.png", alt: "Granular Skill Matrix & Software Specialization Manager" },
        { url: "/projects/genmorphics-home.png", alt: "GenMorphics AI Solutions Public Portal" },
      ],
      order: 1,
    },
    {
      slug: "sellervai",
      title: "SellerVai",
      summary:
        "Automated social commerce assistant for Bangladeshi online merchants. Handles product inquiries, order intake, and COD confirmation across WhatsApp, Facebook Messenger, Instagram, and Telegram — in Bengali, Banglish, and English — with zero message drops under flash sale traffic spikes.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "SellerVai Technologies",
      role: "Lead Full-Stack & AI Engineer",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Node.js",
        "BullMQ & Redis",
        "WhatsApp Business API",
        "Meta Messenger & Instagram Graph API",
        "Telegram Bot API",
        "PostgreSQL",
        "Tailwind CSS",
      ],
      keyFeatures: [
        "Stateless webhook ingestion layer that returns 200 OK in under 15ms — all processing runs asynchronously in BullMQ workers",
        "SHA-256 message fingerprinting with Redis SET NX deduplication preventing double-processing on Meta retries",
        "Two-tier Banglish/Bengali parsing: fast regex for structured data extraction, LLM for intent classification",
        "COD screening workflow that flags high-risk orders based on address patterns and order history",
        "Centralized merchant inbox unifying conversations across all four platforms",
        "Flash sale traffic absorbs into the queue without webhook failures or duplicate replies",
      ],
      problem: `Bangladeshi online sellers operate almost entirely through social media direct messages. A customer doesn't visit a website — they message the seller's Facebook page asking about availability and delivery. The seller manually reads every message, checks stock, replies with price and delivery info, collects the address, and confirms the order. For a seller handling 100+ messages a day during a promotion, this is physically unsustainable.

The second layer of complexity is reliability. Social commerce flash sales generate traffic spikes that are sudden and short. Meta's webhook delivery has a strict acknowledgment timeout, and if your handler is doing real work synchronously, you'll miss the window, trigger retry storms, and end up processing the same messages multiple times.`,
      approach: `The ingestion layer was designed to do exactly one thing: verify the webhook signature and push the raw payload to a BullMQ queue. It returns 200 OK to Meta's servers in under 15 milliseconds. All actual processing — intent parsing, inventory lookup, response generation, message delivery — happens in worker processes that consume from the queue asynchronously.

Deduplication uses SHA-256 fingerprints of the channel + sender ID + platform message ID, stored in Redis with a 5-minute TTL using SET NX semantics. If a fingerprint already exists, the worker skips processing. This handles Meta's retry behavior cleanly without any application-layer coordination.

The bilingual parsing uses a two-tier approach. A regex engine extracts structured data — phone numbers, numeric sizes, city names, specific product codes — in under 2ms. An LLM handles intent classification for the parts that require understanding colloquial Bengali-Banglish phrasing.`,
      solution: `SellerVai handles the full conversational sales workflow automatically. Incoming messages across all four platforms arrive in the queue, get deduplicated, classified by intent (stock check, price inquiry, order confirmation, COD request, delivery status), and routed to the appropriate response handler. The merchant sees a unified inbox with conversation history across channels.

COD orders — a significant fraud vector in Bangladeshi social commerce — go through an additional screening step that checks address completeness, order history, and behavioral signals before confirming.`,
      results: `During the first flash sale campaign after launch, traffic spiked to roughly 15x baseline over two hours. The queue absorbed the burst, webhook endpoints stayed responsive, and every message was processed exactly once. No duplicate orders, no missed confirmations.

Merchants using SellerVai eliminated the manual reply loop for routine inquiries. The bot handles stock checks, delivery queries, and COD confirmations without human involvement — escalating only messages that fall outside its confidence threshold.`,
      liveUrl: "https://www.sellervai.com",
      gallery: [
        { url: "/projects/sellervai-home.png", alt: "SellerVai AI Social Commerce Salesperson & Multichannel Platform" },
        { url: "/projects/sellervai-solutions.png", alt: "Omnichannel Support across WhatsApp, Messenger, Instagram & Telegram" },
        { url: "/projects/sellervai-pricing.png", alt: "SellerVai Merchant Subscription & Automation Packages" },
      ],
      order: 2,
    },
    {
      slug: "mathpro-academy",
      title: "MathPro Academy",
      summary:
        "Online mathematics coaching platform for JSC, SSC, and HSC students across Bangladesh. Server-side KaTeX formula rendering, bKash and Nagad payment integration with atomic enrollment fulfillment, and a mobile-first student dashboard serving 4,000+ students.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "MathPro Academic & Admission Care / Abdul Aziz",
      role: "Full-Stack Web Developer & Platform Architect",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router, Turbopack)",
        "TypeScript",
        "Tailwind CSS",
        "KaTeX (Server-Side RSC Rendering)",
        "Node.js",
        "bKash Checkout API",
        "Nagad Payment Gateway",
        "PostgreSQL",
        "Prisma ORM",
      ],
      keyFeatures: [
        "Server-side KaTeX formula rendering via React Server Components — zero client JS, zero layout shift, zero CLS penalty",
        "Idempotent bKash/Nagad webhook handler using Prisma atomic transactions: order update and enrollment creation succeed or fail as a single unit",
        "HMAC signature verification with timing-safe comparison on all payment callbacks before any database writes",
        "Structured course tracks for JSC General Math, SSC General & Higher Math (Bangla Medium and English Version), and HSC",
        "Student dashboard with chapter progress, recorded lecture access, and practice quiz results",
        "Mobile-first UI optimized for mid-range Android devices on 4G connections",
      ],
      problem: `The founder Abdul Aziz was teaching mathematics to secondary school students through video lectures. Students needed structured access to course materials organized by curriculum level — JSC, SSC, Higher Math — with the ability to enroll and pay immediately using the mobile banking apps they already had: bKash and Nagad.

The mathematical content presented a specific rendering challenge. Displaying formulas correctly on mobile browsers without layout shifts and without downloading a large client-side math library is non-trivial. Most platforms handle this poorly — students see raw LaTeX strings for a second before the renderer kicks in, which undermines confidence in the content.`,
      approach: `Math rendering was solved by moving KaTeX compilation entirely to the server. React Server Components run at build time for static course pages, calling katex.renderToString() and embedding the pre-calculated HTML directly in the page output. The browser receives fully-rendered formula markup with no JavaScript required — zero bundle overhead, zero layout shift.

Payment integration required careful idempotency design. bKash and Nagad will retry callbacks if your server doesn't respond quickly enough. Without deduplication, a retry can produce multiple enrollments for a single payment. The webhook handler verifies the HMAC signature first, then uses a Prisma transaction to atomically check the order status and write both the order completion and the enrollment record. If the order is already COMPLETED, it returns early without any writes.`,
      solution: `The platform launched with organized course tracks matching the Bangladeshi secondary curriculum structure. Students browse courses by level and medium (Bangla or English version), enroll with a single bKash or Nagad payment, and get immediate access to their course dashboard after payment confirmation.

Formula rendering across all course notes and practice problems is crisp and immediate — no loading state, no layout shift. This is particularly important for the higher mathematics content where complex calculus and trigonometry notation appears frequently.`,
      results: `The platform serves over 4,000 students with structured access to mathematics content aligned to their specific exam curriculum. Payment processing runs without manual intervention — the atomic webhook handler has processed thousands of transactions without producing a double enrollment.

Formula-heavy pages load without any visible reflow, and the absence of a math parser in the client bundle saves 180KB+ per page compared to client-side KaTeX rendering.`,
      liveUrl: "https://www.mathpro.academy",
      gallery: [
        { url: "/projects/mathpro-home.png", alt: "MathPro Academy Mathematics Coaching & Founder Overview" },
        { url: "/projects/mathpro-courses.png", alt: "JSC, SSC & HSC Specialized Mathematics Course Tracks" },
        { url: "/projects/mathpro-features.png", alt: "Interactive Math Learning Features & Automated Checkout" },
      ],
      order: 3,
    },
    {
      slug: "codervai-cp",
      title: "Codervai CP Platform",
      summary:
        "Competitive programming training platform for BUET CSE alumni and Googlers at Codervai. Timed module unlocking keeps 2,000+ students on a shared learning pace. Atomic PostgreSQL upserts handle streak tracking without race conditions when thousands of students submit near midnight.",
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
        "PostgreSQL",
        "Prisma ORM",
        "HLS Video Streaming",
      ],
      keyFeatures: [
        "Temporal module unlocking based on cohort schedule — calendar-driven pacing like a university course, not ability gating",
        "Atomic SQL UPSERT for streak tracking: check-yesterday, check-today, and compute-new-streak in a single database operation with no race conditions",
        "300+ curated algorithmic problems from C++ STL fundamentals through Dynamic Programming, Graphs, and Trees",
        "HLS video encoding profile tuned for code content: higher quantization limits for text regions, reduced temporal compression for sharp monospace fonts",
        "Student dashboard tracking module completion, learning streaks, and cohort ranking",
        "Problem solutions paired with video walkthroughs explaining the reasoning, not just the accepted code",
      ],
      problem: `Competitive programming has a well-known attrition problem: students get access to a large problem bank, attempt problems that are too advanced for their current level, get frustrated, and drop out. The knowledge dependency tree is real — you can't reason about graph algorithms if you're still shaky on recursion.

The Codervai team — BUET CSE alumni and Google engineers — wanted a structured training program that enforced the right learning sequence without feeling like a rigid lockdown. They also needed streak tracking that held up under concurrent midnight submissions, where thousands of students rushed to maintain streaks before the daily reset.`,
      approach: `The module unlock design uses temporal pacing rather than competency gating. Each cohort runs on a fixed schedule: module 1 from day 0, module 2 from day 7, and so on. All students see the same modules on the same calendar days — creating a shared experience that makes the Discord community useful rather than fractured across different curriculum points.

The streak concurrency problem required moving all logic to the database level. The naive approach — read the current streak, compute the new value, write it back — has a race condition when two submissions arrive for the same user within milliseconds. The fix was a single atomic SQL INSERT ON CONFLICT DO UPDATE with CASE logic: check whether yesterday was active, whether today has already been counted, or whether the streak needs to reset. No application code reads a value before writing.`,
      solution: `The platform launched with structured curriculum cohorts. Students enroll, receive access to day-0 modules immediately, and watch new modules unlock on the cohort schedule. Each module contains curated problems with in-depth video editorial walkthroughs that explain reasoning and trade-offs rather than just showing the accepted solution.

Video encoding was optimized specifically for code content — dark IDE backgrounds with monospace syntax need higher sharpness settings than natural scenes. The resulting quality keeps code text legible even at lower bitrates on mobile connections.`,
      results: `The platform enrolled over 2,000 students across training cohorts. The temporal module structure kept students on a shared learning pace, which showed up in the Discord community as genuine peer learning rather than isolated struggles.

Streak tracking runs correctly under concurrent midnight submissions without any duplicate increments or missed streaks — the atomic SQL implementation handles concurrency transparently at the database level.`,
      liveUrl: "https://cpnew.codervai.com",
      gallery: [
        { url: "/projects/codervai-courses.png", alt: "Codervai All Courses & Bundle Catalog" },
        { url: "/projects/codervai-module-dashboard.png", alt: "Codervai Student Learning Cockpit, Streaks & Module Progression" },
        { url: "/projects/codervai-mylearning.png", alt: "Enrolled Competitive Programming Courses & Course Bundles" },
        { url: "/projects/codervai-home.png", alt: "Codervai Competitive Programming Academy Homepage" },
      ],
      order: 4,
    },
    {
      slug: "cprbd-du",
      title: "CPR BDDU (University of Dhaka)",
      summary:
        "Institutional web portal for the Center for Policy Research on Business and Development at the University of Dhaka. Includes a public HMAC-based certificate verification engine, academic research repository, and bulk-issuance admin workflow that replaced a multi-day manual process.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Department of International Business, University of Dhaka",
      role: "Lead Full-Stack Developer & UI Architect",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "Radix UI",
        "Prisma ORM",
        "PostgreSQL",
        "HMAC-SHA256 Certificate Verification",
        "QR Code Generation",
        "PDF Document Viewer",
      ],
      keyFeatures: [
        "HMAC-SHA256 certificate verification: codes derived from certificate number + recipient name + program name, making forgery computationally infeasible without the server secret",
        "QR codes on physical certificates link to the public verification page — employers scan and see verified details in under 100ms",
        "Timing-safe comparison for verification code checks, preventing side-channel timing attacks",
        "Bulk certificate issuance: import CSV of cohort participants, generate and queue all verification codes in one action",
        "Academic research repository with structured metadata, full-text search, and embedded PDF viewing",
        "Faculty directory with academic profiles and publication history",
      ],
      problem: `CPRBD issues professional certificates to mid-career government officials and business professionals completing executive education cohorts. These certificates carry real weight in career advancement — used for government postings, international roles, and senior appointments. But there was no way for an employer to verify that a certificate was genuine.

The administrative burden was also significant. Managing 60 participants through a form-based interface one at a time, generating individual certificate records, and distributing credentials took days of coordinator time per cohort.`,
      approach: `The verification system uses HMAC-SHA256 rather than a blockchain or sequential ID. The trust anchor is CPRBD's public website. The verification code for each certificate is computed from the certificate number, the recipient's full name as it appears on the certificate, and the program name — signed with a secret key held only by the server. An employer submits the code and certificate number; the server recomputes the expected hash, runs a timing-safe comparison, and returns the verified recipient details.

Timing-safe comparison prevents an attacker from using response time to infer valid hash characters one at a time. The crypto.timingSafeEqual function takes the same time regardless of where two strings diverge.

The admin workflow was designed for bulk operations. Coordinators import a spreadsheet of cohort participants, review the list, and issue all certificates in a single action — generating verification codes, storing records, and outputting a print-ready PDF with embedded QR codes for each participant.`,
      solution: `The public portal presents CPRBD's research publications, program information, faculty profiles, and policy dialogues in a clean institutional design matching University of Dhaka branding. The certificate verification page is publicly accessible with no login required, resolving any valid certificate in under 100ms.

The research repository made CPRBD's publication catalog discoverable for the first time. Previously, research papers lived in a static Word document on the university website. The structured repository supports search by author, year, topic, and program type.`,
      results: `Employers can verify CPRBD credentials in seconds by scanning the QR code on a physical certificate. The verification endpoint processes lookups without false positives or false negatives.

The bulk certificate issuance workflow reduced coordinator time per cohort from multiple days to under an hour. The research repository surfaced CPRBD's intellectual output to a broader audience of policy practitioners and government stakeholders who previously had no way to find it.`,
      liveUrl: "https://cprbddu.org",
      gallery: [
        { url: "/projects/cprbd-home.png", alt: "Center for Policy Research on Business and Development Portal" },
        { url: "/projects/cprbd-programs.png", alt: "National Executive Training Cohorts & Certificate Verification" },
        { url: "/projects/cprbd-researches.png", alt: "National Policy Research & Academic Publications Repository" },
      ],
      order: 5,
    },
    {
      slug: "linkedin-brand-assistant",
      title: "LinkedIn Brand Assistant",
      summary:
        "Manifest V3 Chrome extension that injects an AI writing companion directly into the LinkedIn feed. Shadow DOM isolation prevents style conflicts with LinkedIn's CSS. All state persists to chrome.storage.local — never lost when the Manifest V3 service worker terminates between interactions.",
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
        "Shadow DOM",
        "OpenAI API",
      ],
      keyFeatures: [
        "Closed Shadow DOM widget isolation: extension styles can't bleed into LinkedIn's DOM and LinkedIn's styles can't override the widget",
        "Manifest V3 service worker state persisted to chrome.storage.local — never relies on in-memory module variables that reset on worker termination",
        "DOM text extraction: strips tracking attributes, SVG icons, and navigation noise before sending context to the LLM — 200-400 tokens of clean post text",
        "Tone-customizable generation: Insightful, Inquiring, and Supportive comment modes",
        "Client-side API key configuration for private, secure token management without a backend",
        "Published to the Chrome Web Store",
      ],
      problem: `Active LinkedIn professionals spend meaningful time reading posts and composing thoughtful replies. The challenge is that composing a genuinely engaged response requires understanding the post's content, matching the appropriate tone, and writing something that adds rather than echoes. This friction interrupts reading flow.

The technical challenge was injecting a usable UI into a third-party page without breaking it. LinkedIn's CSS is dense with high specificity. Naive injection of styled components causes either style collisions — where LinkedIn overrides your styles — or style leakage — where your styles break LinkedIn's layout.`,
      approach: `Style isolation required Shadow DOM. Every widget mount attaches a shadow root to a host container element, creating a DOM boundary completely separate from the main document's style cascade. LinkedIn's CSS cannot enter the shadow tree, and the extension's styles cannot leak out. The React tree mounts inside the shadow, with its stylesheet loaded as a link element appended to the shadow root itself.

Manifest V3's service worker lifecycle is aggressive — service workers terminate after short idle periods. Any state stored as module-level variables is lost on termination. All user settings, API keys, and authentication state are persisted to chrome.storage.local and read from storage on each use.

Context extraction walks only text nodes in the post body element, stripping tracking attributes, SVG paths, and nested navigation content. The resulting context is 200–400 tokens of clean, representative post text.`,
      solution: `The extension renders a compact AI companion button alongside each LinkedIn post in the feed. Clicking it opens a panel inside the Shadow DOM widget showing the extracted post summary and three tone-selectable comment drafts. Users can edit any draft before copying it to the LinkedIn comment box.

The companion web app at lnbrandassistant.xyz provides onboarding, API key configuration, and usage documentation.`,
      results: `Published to the Chrome Web Store with a clean, isolated UI that survives LinkedIn's frequent frontend deployments without breaking. The Shadow DOM architecture means LinkedIn's CSS updates don't affect the widget's appearance, and the extension's styles don't affect LinkedIn's layout.

The Manifest V3 service worker implementation handles the browser's aggressive termination behavior correctly — state is never lost between user interactions regardless of how long the browser has been idle.`,
      liveUrl: "https://lnbrandassistant.xyz",
      githubUrl: "https://chromewebstore.google.com/detail/linkedin-brand-assistant/liicmnighkinlpgaagipbjbjkokknjhi",
      gallery: [
        { url: "/projects/ln-assistant-home.png", alt: "LinkedIn Brand Assistant AI Companion Landing Page" },
        { url: "/projects/ln-assistant-store.png", alt: "Chrome Web Store Published Extension" },
        { url: "/projects/ln-assistant-features.png", alt: "AI Comment Tone Customization & Workflow Engine" },
      ],
      order: 6,
    },
    {
      slug: "badhan-blood-network",
      title: "Badhan Blood Donation (Amar Ekushey Hall Unit)",
      summary:
        "Offline-first PWA for the Badhan blood donation organization of Amar Ekushey Hall, University of Dhaka. Donor search runs against local IndexedDB in under 10ms regardless of network state — built specifically to work in hospital basements and emergency wards where mobile connectivity is unreliable.",
      status: "PUBLISHED" as const,
      featured: false,
      client: "Badhan — Amar Ekushey Hall Unit, University of Dhaka",
      role: "Lead Full-Stack Developer & Platform Architect",
      timeline: "2024 – 2025",
      techStack: [
        "Next.js",
        "React",
        "Prisma ORM",
        "PostgreSQL",
        "Tailwind CSS",
        "Workbox PWA",
        "IndexedDB",
      ],
      keyFeatures: [
        "All donor search runs locally against IndexedDB — results in under 10ms with no network request required",
        "Pre-computed donation eligibility flag: 90-day interval calculated at sync time, enabling instant filtering without date arithmetic on every query",
        "Workbox NetworkFirst strategy with 4-second timeout: fresh data when network is available, cached data when it isn't",
        "Installable PWA with home screen icon on Android — launches like a native app",
        "Donor records include name, phone, blood group, batch, hall, room number, last donation date, and referral source",
        "Export functionality for volunteer coordinators to pull filtered donor lists for emergency dispatch",
      ],
      problem: `Badhan volunteer coordinators at Amar Ekushey Hall need to match blood donors to patient requests quickly. The Dhaka Medical College Hospital — where most emergencies are handled — has poor mobile reception in many wards and the basement. A platform that requires network connectivity to show a donor list is useless exactly when it's most needed.

The previous system was a shared spreadsheet. Searching it on a phone during a stressful emergency was slow. There was no eligibility check, so coordinators sometimes contacted donors who had donated too recently.`,
      approach: `The offline-first design treats IndexedDB as the primary data source. Every read — donor search, blood group filter, eligibility check — hits IndexedDB directly. Network requests are used only to synchronize changes from the server, not to serve the user's immediate request.

Donation eligibility (90 days since last donation) is pre-computed and stored as a boolean flag during each sync. Rather than running date arithmetic on every search query for hundreds of records, it runs once per record per sync. The stored flag makes filtering instantaneous regardless of dataset size.

Workbox manages the service worker with a NetworkFirst strategy for API endpoints: attempt the network with a 4-second timeout, fall back to the cached response if the network is slow or unavailable. Static assets are pre-cached at install time.`,
      solution: `The platform is installed on volunteers' Android phones as a PWA. When a coordinator receives an emergency blood request, they open the app (which loads immediately from the service worker cache), enter the required blood group, and get an instant list of eligible donors sorted by last donation date.

The dashboard shows real-time donation statistics — total donations logged, blood group breakdown, monthly trends — giving the unit's leadership visibility into their operational capacity. The export function lets coordinators pull a filtered donor list for dispatch coordination.`,
      results: `The platform actively tracks over 590 total donations and 400+ unique donors for the Amar Ekushey Hall Unit. Search performance is consistent regardless of network state — the offline-first design means hospital basement reception doesn't affect usability.

The pre-computed eligibility flag has eliminated coordinator errors where donors were contacted too soon after a previous donation. The 90-day rule is enforced automatically in the filter results.`,
      liveUrl: "https://badhan.mathpro.academy",
      githubUrl: "https://github.com/parvej-shah/blood-update-badhan",
      gallery: [
        { url: "/projects/badhan-home.png", alt: "Badhan Amar Ekushey Hall Unit Dashboard & Live Blood Group Breakdown" },
        { url: "/projects/badhan-search.png", alt: "Real-time Donor Search & Multi-criteria Eligibility Filter" },
        { url: "/projects/badhan-records.png", alt: "Donor Records & Unit Donation Logs" },
      ],
      order: 7,
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
      order: 8,
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
  const validSlugs = blogPosts.map((p) => p.slug);
  await prisma.post.deleteMany({
    where: { slug: { notIn: validSlugs } },
  });

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
    eyebrow: "Full Stack Web Developer",
    headlineLines: ["From idea", "to product", "to profit."],
    description:
      "I design and build full-stack web products that load fast, feel effortless, and turn visitors into customers — from the first wireframe to the final deploy.",
    primaryCta: { label: "Get a Free Quote", href: "#contact" },
    secondaryCta: { label: "View My Work", href: "#portfolio" },
    trustLabel: "Trusted by 12+ clients",
    trustStats: [
      { value: "20+", label: "projects shipped" },
      { value: "<24h", label: "response time" },
    ],
    portraitImage: "/assets/images/banner-cutout.webp",
    portraitAlt: "Parvej Shah — Full Stack Web Developer",
    experienceBadge: { value: "3+", label: "years experience" },
  },
  services: {
    eyebrow: "My Core Expertise",
    heading: "I help founders and teams turn ideas into fast, scalable digital products.",
    description:
      "Every build is measured against three things: performance, clarity, and room to grow. No bloat, no shortcuts — just work that lasts.",
    tagline: "Core Services Offered",
    items: [
      {
        icon: "Code2",
        title: "Full Stack Development",
        desc: "End-to-end web applications — clean architecture, modern stacks, and code that stays maintainable long after launch.",
      },
      {
        icon: "Palette",
        title: "UI / UX Design",
        desc: "Interfaces that feel effortless. Clarity-first layouts that guide every visitor toward action, not confusion.",
      },
      {
        icon: "Gauge",
        title: "Performance & SEO",
        desc: "Speed, Core Web Vitals, and search visibility tuned until the experience feels instant — because slow sites lose customers.",
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
    quoteRole: "Full Stack Web Developer, IIT DU",
    points: [
      "Full-stack depth — React, Next.js, Node.js, Express & MongoDB",
      "Engineering foundation from IIT, University of Dhaka",
      "Trusted partner to startups, businesses, and personal brands",
    ],
    badgeValue: "12+",
    badgeLabel: "people trust my work",
    ctaLabel: "Let's Work Together",
    ctaHref: "#contact",
  },
  skills: {
    eyebrow: "Tech Stack",
    heading: "A battle-tested stack for the modern web.",
    items: [
      { name: "React", icon: "FaReact" },
      { name: "JavaScript", icon: "FaJs" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" },
      { name: "shadcn/ui", icon: "SiShadcnui" },
      { name: "Bootstrap", icon: "SiBootstrap" },
      { name: "Node.js", icon: "FaNodeJs" },
      { name: "Express.js", icon: "SiExpress" },
      { name: "MongoDB", icon: "SiMongodb" },
      { name: "Firebase", icon: "SiFirebase" },
      { name: "React Query", icon: "SiReactquery" },
      { name: "Axios", icon: "SiAxios" },
      { name: "JWT", icon: "SiJsonwebtokens" },
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
          "Working with Parvej was a great experience from start to finish. The project was delivered on time with excellent attention to detail. Communication was clear and professional throughout.",
        name: "Client Name",
        role: "Startup Founder, Zenvix",
        initials: "CN",
        avatarUrl: "",
        rating: 5,
        href: "",
      },
      {
        quote:
          "Clean code, thoughtful UX, and a genuine care for the end result. Parvej understood exactly what we needed and shipped it faster than we expected.",
        name: "Client Name",
        role: "Product Manager, Glovix",
        initials: "CN",
        avatarUrl: "",
        rating: 5,
        href: "",
      },
    ],
    clients: ["Minions.AI", "SellerVai", "MathPro Academy", "Codervai", "University of Dhaka", "GenMorphics AI"],
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
      "High-performance web products, built with clarity, care, and code that's made to last.",
    email: "parvejshahlabib007@gmail.com",
    location: "Dhaka, Bangladesh",
    newsletterHeading: "Let's stay in touch",
    newsletterDescription: "Got an idea worth building? One message starts it — I reply within 24 hours.",
    ctaLabel: "Start a Project",
    ctaHref: "/#contact",
    copyrightName: "Parvej Shah Labib",
    copyrightRole: "Full Stack Web Developer",
  },
  seo: {
    title: "Parvej Shah — Full Stack Web Developer | Dhaka, Bangladesh",
    description:
      "Full-stack developer building fast, scalable web products with React, Next.js, Node.js and MongoDB. Based in Dhaka — available for freelance projects worldwide.",
    ogImage: "/og.jpg",
    siteUrl: "https://parvejshah.vercel.app",
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
