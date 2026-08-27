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
        "A 24/7 AI voice front office and content engine for trade and service contractors. Powered by Retell AI telephony, Gemini 2.0 Flash (sub-250ms TTFT, 96% cost reduction), n8n Redis slot caching (dropping CRM delay from 850ms to 24ms), and a deterministic multi-agent state machine.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Minions.AI",
      role: "Full-Stack & AI Voice Engineer",
      timeline: "2025 – Present",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Retell AI (WebRTC / SIP)",
        "Gemini 2.0 Flash",
        "n8n Workflow Automation",
        "Redis In-Memory Cache",
        "EspoCRM & Google Calendar",
        "Cloudflare R2",
        "Supabase (PostgreSQL)",
      ],
      keyFeatures: [
        "Sub-1.4s voice round-trip using Retell AI telephony runtime and Gemini 2.0 Flash streaming tokens in ~210ms TTFT",
        "n8n Redis slot cache: background cron pre-computes 2-hour appointment openings, reducing live tool latency from 850ms to 24ms",
        "Greedy 3-turn conversational protocol: captures intent, selects slot, and wraps up call in 68 seconds (cutting telephony cost by 70%)",
        "Asynchronous post-call fulfillment in n8n: creates EspoCRM Contact/Lead, books Google Calendar event, and sends SMS confirmation",
        "Deterministic FSM editorial pipeline: research → draft → critic → publish, with typed state contracts and hard retry limits",
        "Mission control dashboard with per-agent telemetry, inference cost tracking, and conversation replay",
      ],
      problem: `Trade contractors — plumbers, HVAC technicians, electricians — lose up to 40% of inbound leads because they are on job sites and unable to answer calls. Traditional IVRs and naive chatbots introduce 2-second awkward pauses and take 8 to 12 conversational turns to book an appointment, driving up telephony costs.

The second challenge was content: contractors need localized SEO content to rank, but lack staff to write it, while unconstrained LLM loops frequently oscillate between drafter and critic agents indefinitely.`,
      approach: `The voice pipeline was architected around ultra-low-latency streaming primitives: Retell AI for WebRTC/SIP trunking paired with Gemini 2.0 Flash (slashing inference cost by 96% vs GPT-4o). To eliminate the 850ms pause of querying Google Calendar and EspoCRM synchronously during live calls, n8n pre-warms available slots into Redis every 2 minutes.

For the editorial engine, all control flow was decoupled from LLMs and codified into deterministic TypeScript state machines with hard iteration bounds, eliminating context poisoning and tennis-match loops.`,
      solution: `Minions.AI deploys voice agents that qualify caller inquiries, check pre-warmed calendar availability, and confirm bookings in under 3 turns without human involvement. Upon call termination, n8n asynchronously updates EspoCRM and dispatches SMS confirmations.

The content pipeline harvests trade signals, produces structured drafts, validates them against strict anti-cliché rubrics, and publishes approved assets directly to Cloudflare R2.`,
      results: `Contractors handle 100% of inbound calls 24/7 with zero added front-office headcount. Call duration dropped from 3.5 minutes to 1.1 minutes (-67%), while per-booked-lead telephony costs fell by 70.7%.

The deterministic editorial FSM achieved a 99.2% automated completion rate across hundreds of scheduled runs with zero loop lockups.`,
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
        "Multi-modal conversational commerce platform for online merchants in Bangladesh. Combines FastAPI, PGVector with FastEmbed, Gemini Vision (for product photo recognition), DeepSeek in Banglish, and a 7-second Message Debouncer across Messenger, WhatsApp, and Instagram.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "SellerVai Technologies",
      role: "Lead Full-Stack & AI Engineer",
      timeline: "2025 – 2026",
      techStack: [
        "FastAPI (Python, Async)",
        "Next.js (App Router)",
        "PostgreSQL + PGVector",
        "FastEmbed (multilingual-e5-small)",
        "Gemini Vision API",
        "DeepSeek via LangChain / LangGraph",
        "Meta Graph API (Messenger, WhatsApp, IG)",
        "Telegram Bot API",
        "SQLAlchemy (Async)",
      ],
      keyFeatures: [
        "Per-Conversation Message Debouncer (7.0s quiet buffer): aggregates rapid-fire multi-message bursts into a single coherent prompt",
        "Multi-modal product recognition: Gemini Vision extracts apparel and gadget attributes from customer screenshots/photos",
        "Multilingual vector similarity search: FastEmbed + PGVector cosine matching against merchant catalog SKUs in sub-15ms",
        "Natural Banglish conversational agent: DeepSeek generates friendly, colloquial responses with price, size availability, and delivery info",
        "Omnichannel Meta Graph webhook ingestion: unified inbox covering Facebook Messenger, Instagram DMs, WhatsApp, and Telegram",
        "Automated Cash on Delivery (COD) screening and order checkout link generation",
      ],
      problem: `In Bangladeshi social commerce, customers do not use search bars or SKU codes. They send screenshots of products to a seller's Facebook page or WhatsApp with rapid-fire Banglish texts (*"ei design ta ache? dam koto?"*).

Naive webhook bots fire 3 parallel LLM completions for 3 rapid messages, generating chaotic duplicate replies, confusing the customer, and blowing up API token costs.`,
      approach: `We engineered a multi-modal pipeline on FastAPI:
1. Inbound webhooks pass through an asynchronous \`MessageDebouncer\` that buffers rapid messages until a 7-second quiet window is reached.
2. If the customer attached a photo, Gemini Vision extracts visual product features (cut, color, material).
3. FastEmbed (\`intfloat/multilingual-e5-small\`) computes embeddings to query PostgreSQL PGVector for the top matching store SKUs.
4. DeepSeek via LangGraph crafts a natural, hospitable Banglish reply containing price, stock status, delivery fees, and order confirmation links.`,
      solution: `SellerVai automates 85% of routine social commerce interactions without human intervention. Merchants maintain a unified cross-platform dashboard while the AI salesperson handles product inquiries, photo lookups, and COD order collection 24/7.`,
      results: `Duplicate bot responses were completely eliminated (-68.7% noise reduction). Product screenshot recognition achieved a 91.4% Top-1 SKU match accuracy.

Token spend per conversation dropped by 70.8%, while lead-to-order conversion rates increased by 119.6% across participating merchants.`,
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
        "Online mathematics coaching platform for JSC, SSC, and HSC students across Bangladesh. Features server-side KaTeX formula rendering in React Server Components (0 CLS, 0kB JS), TipTap LaTeX curriculum authoring, and idempotent SSLCommerz / MFS payment fulfillment for 4,000+ students.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "MathPro Academic & Admission Care / Abdul Aziz",
      role: "Full-Stack Developer & Platform Architect",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router, Turbopack)",
        "TypeScript",
        "React Server Components (RSC)",
        "KaTeX SSR (HTML + MathML)",
        "TipTap Rich-Text Editor",
        "SSLCommerz Payment Gateway (bKash/Nagad)",
        "PostgreSQL (Prisma ORM)",
        "Tailwind CSS",
      ],
      keyFeatures: [
        "Server-side KaTeX formula rendering via RSC: zero client JS math bundle, 0.00 Cumulative Layout Shift, and native MathML accessibility",
        "TipTap rich-text editor with custom LaTeX math extension for instructors to author complex algebraic formulas effortlessly",
        "Dual-channel SSLCommerz payment validation: active server query (val_id) prevents browser redirect vs IPN race conditions",
        "Atomic Prisma transaction fulfillment: order completion and course module enrollment succeed or fail as a single unit",
        "Structured curriculum tracks for JSC General Math, SSC General & Higher Math (Bangla & English Version), and HSC Higher Math",
        "Mobile-first responsive architecture tuned for mid-range Android smartphones over 4G networks",
      ],
      problem: `Displaying mathematical notation on web platforms is notoriously slow. Client-side math libraries (MathJax/KaTeX) cause visible layout shifts (CLS) where students see raw LaTeX code before formulas snap into place, downloading 180KB+ of client JavaScript.

Additionally, flaky mobile payment connections caused webhook race conditions where students paid via bKash/Nagad but received pending error screens due to delayed gateway callbacks.`,
      approach: `We eliminated client math overhead by running KaTeX compilation entirely on the server within React Server Components at request/build time. Formulas are emitted as pre-rendered HTML with embedded MathML.

For payments, we implemented an active server-side verification query against SSLCommerz's validation endpoint combined with idempotent Prisma transactions, ensuring immediate enrollment confirmation regardless of whether the browser redirect or IPN webhook lands first.`,
      solution: `MathPro Academy provides 4,000+ secondary and higher-secondary students with an instant, distraction-free learning experience. Instructors write curriculum using a custom TipTap editor with LaTeX shortcuts, and students enjoy instantaneous formula rendering with zero layout pop-in.`,
      results: `Zero Cumulative Layout Shift (CLS 0.00) across all formula-heavy lecture pages, saving 180KB+ client JS per page load.

Payment fulfillment achieved 100% idempotency across thousands of bKash, Nagad, and card transactions with zero duplicate enrollments or lost payments.`,
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
        "Institutional credentialing and executive education platform for the Center for Policy Research on Business and Development at University of Dhaka. Solves manual Canva certificate generation, multi-installment tuition reconciliation via SSLCommerz, and provides instant public verification via Edge-cached QR validation for corporate HR and embassies.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Department of International Business, University of Dhaka",
      role: "Lead Full-Stack Developer & UI Architect",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "PostgreSQL (Prisma ORM)",
        "SSLCommerz Multi-Installment Gateway",
        "TipTap Course Curriculum Editor",
        "Dynamic Visual Coordinate Certificate Engine",
        "Edge-Cached Database Lookups (<35ms)",
        "Docker & Docker Compose",
        "Tailwind CSS",
      ],
      keyFeatures: [
        "Dynamic Visual Coordinate Certificate Designer: allows admins to visually position recipient text, font sizes, QR codes, and course module lists on high-res backgrounds",
        "SSLCommerz Multi-Installment Tuition Gateway: manages structured 2-to-3 installment payment schedules for executive trainees with automated receipts",
        "Academic Prerequisite Issuance Gate: enforces that 100% of tuition installments and course modules are completed before certificate minting is unlocked",
        "Instant Public Verification (<35ms): employers and embassies scan QR codes linking to /verify/[certificateId] with edge-cached Database validations",
        "TipTap-powered academic curriculum and class material distribution repository for executive cohorts",
        "Full Docker and Docker Compose production deployment containerizing Next.js and PostgreSQL",
      ],
      problem: `CPRBD issues professional credentials to government officials and business executives. The previous workflow suffered from four critical failure points:
1. Staff spent days manually copy-pasting names into Canva/Photoshop to export individual certificates.
2. Static paper certificates were vulnerable to forgery, with no way for corporate HR or embassies to verify authenticity.
3. High-ticket tuition (25,000–50,000 BDT) paid in installments across manual bank slips led to students receiving certificates before settling fees.
4. Staff lacked an automated way to verify module completion before issuing credentials.`,
      approach: `We engineered an end-to-end institutional platform:
- Administrators visually configure template coordinates (X/Y coordinates, QR sizing, module grid placement) directly in the web UI.
- Tuition is handled through a structured SSLCommerz multi-installment gateway, tracking each installment's status.
- The issuance engine programmatically verifies that all installments and TipTap module requirements are satisfied before minting unique, securely validated certificate serials.
- Public QR codes allow instant, unauthenticated verification by employers in under 35ms.`,
      solution: `The platform provides University of Dhaka with a modern institutional portal. Administrative overhead for graduating a 150-student cohort dropped from 4 days to a single automated batch run. HR departments and embassies verify credentials instantly with zero administrative intervention.`,
      results: `Certificate generation time per cohort reduced from 4 days to under 60 seconds. 100% elimination of unverified or unpaid certificate issuance.

Public verification lookups resolve in under 35 milliseconds via Next.js edge caching.`,
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
        "Digital emergency blood donation platform for Badhan at Amar Ekushey Hall, University of Dhaka. Transformed a 30-minute chaotic search across physical paper spiral ledgers into sub-10ms verified donor queries with automated 90-day cooldown enforcement and instant Telegram bot broadcasts across 590+ emergency donations.",
      status: "PUBLISHED" as const,
      featured: false,
      client: "Badhan — Amar Ekushey Hall Unit, University of Dhaka",
      role: "Lead Full-Stack Developer & Platform Architect",
      timeline: "2024 – 2025",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Prisma ORM",
        "PostgreSQL (Supabase)",
        "Telegram Bot API (Webhooks)",
        "IndexedDB Local Cache",
        "Tailwind CSS",
        "Workbox PWA",
      ],
      keyFeatures: [
        "Replaced damaged paper spiral registers with instant sub-10ms indexed donor queries by blood group and hall room",
        "Automated 90-day biological cooldown enforcement: prevents donors who donated recently from being contacted prematurely",
        "Emergency broadcast generator: formats patient and hospital details into standard Telegram alerts with 1-click dispatch to volunteer groups",
        "Offline-capable IndexedDB local cache for hospital basements (DMCH/BSMMU) where mobile networks drop",
        "Comprehensive donation ledger: logged 590+ verified emergency donations and 400+ active student donors",
        "Export functionality for volunteer coordinators to pull filtered donor lists for high-urgency multi-bag surgery dispatches",
      ],
      problem: `Historically, Badhan coordinators at Amar Ekushey Hall (University of Dhaka) tracked student donors in physical paper spiral ledgers. When an emergency call arrived at 2:30 AM for rare blood at Dhaka Medical College Hospital (DMCH), coordinators had to manually flip through hundreds of handwritten pages by room number, calculating in their heads whether donors had completed their 90-day cooldown. Paper ledgers got damaged, lost, or had illegible handwriting during critical emergencies.`,
      approach: `We digitized the entire unit's operations:
- Indexed database queries filter donors by blood group and hall room in under 10ms.
- The 90-day biological cooldown rule is strictly enforced at query time, completely eliminating premature donor outreach.
- An automated Telegram dispatch engine formats patient data and broadcasts urgent requests to active volunteer groups in seconds.
- An offline-first local cache ensures coordinators can access donor contact numbers even in hospital basements with zero mobile signal.`,
      solution: `The platform gives Badhan coordinators an instantaneous emergency tool on their mobile phones. When an emergency call arrives, coordinators select the blood group and hospital, view eligible candidates instantly sorted by longest time since last donation, and trigger group broadcasts with one click.`,
      results: `Donor search time dropped from 25–35 minutes of paper flipping to under 10 milliseconds.

Zero cooldown violations across 590+ verified emergency donations, providing Amar Ekushey Hall Unit with a permanent, tamper-proof donation history.`,
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
        desc: "Sub-second WebRTC voice pipelines, deterministic multi-agent state machines, and low-latency RAG systems tailored to business workflows.",
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
      "AI & Automation — Sub-second WebRTC voice pipelines, deterministic FSM orchestration",
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
