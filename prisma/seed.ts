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
        "An enterprise-grade 24/7 AI voice front office, speed-to-lead dispatcher, and multi-agent content engine built for trade and service contractors.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "Minions.AI / GenMorphics AI Solutions",
      role: "Co-Founder & Full-Stack / AI Voice Engineer",
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
        "ServiceTitan / Jobber APIs",
      ],
      keyFeatures: [
        "Under 1.8-second low-latency voice answering with natural conversational pacing",
        "Multi-agent autonomous state machine for signal harvesting, drafting, critic verification, and CMS broadcast",
        "Instant 4-second automated missed-call recovery via SMS",
        "Two-way calendar & CRM synchronization (Google Calendar, ServiceTitan, Jobber, Housecall Pro)",
        "Noise-filtering trained on real job sites and active power tools",
        "Real-time unit-cost inference telemetry dashboard ($0.041 per generated asset)",
      ],
      problem:
        "Trade and home service contractors lose thousands of dollars in high-margin emergency jobs whenever incoming calls hit voicemail while technicians are on roofs, under sinks, or off-hours. Over 40% of callers never leave a message and simply hire the first competitor who picks up.",
      approach:
        "We engineered an ultra-low-latency voice agent pipeline capable of answering calls in under 1.8 seconds with natural pacing and real job-site noise filtering. For operations, we built a deterministic multi-agent state machine that scrapes industry signals, drafts technical content, runs automated critic verification, and stages multi-channel assets directly to Cloudflare R2 and live web properties.",
      solution:
        "Delivered Minions.AI featuring 5 specialized digital crew members: Rex (24/7 Voice Dispatcher), Zip (4s SMS lead recovery), Pip (Grounded Web Chat), Gia (Review & Follow-up Automation), and Otto (Client Intake Automation). Backed by a full executive mission control cockpit with real-time multi-agent orchestration and telemetry.",
      results:
        "Achieved 100% 24/7 inbound call coverage, sub-1.8s voice response latency, under 4-second SMS recovery speed, and zero double-bookings across connected client calendars.",
      liveUrl: "https://www.getminions.ai",
      gallery: [
        {
          url: "/projects/minions-cockpit.png",
          alt: "Minions.AI Multi-Agent Mission Control Cockpit & Telemetry",
        },
        {
          url: "/projects/minions-landing.png",
          alt: "24/7 AI Voice Dispatcher & Speed-to-Lead Platform",
        },
        {
          url: "/projects/minions-blog.png",
          alt: "Autonomous Technical Content & Field Guide Engine",
        },
      ],
      order: 0,
    },
    {
      slug: "genmorphics-ai",
      title: "GenMorphics AI",
      summary:
        "Enterprise LLM precision data platform, RLHF, supervised fine-tuning (SFT), and STEM expert annotation workforce management system.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "GenMorphics AI Solutions",
      role: "AI Platform & Full-Stack Systems Engineer",
      timeline: "2025 – Present",
      techStack: [
        "Next.js (App Router, Turbopack)",
        "TypeScript",
        "Tailwind CSS",
        "Supabase (Storage & Auth)",
        "OAuth (Google & Microsoft SSO)",
        "React Query",
        "PostgreSQL",
        "Role-Based Access Control (RBAC)",
      ],
      keyFeatures: [
        "Multi-tier role-based access control and onboarding for Software Engineers, AI Engineers, and STEM Experts",
        "Granular skill profiling matrix (General, Coding, STEM, HSS, BEM, Arts, TVET) and software capabilities",
        "Seamless enterprise authentication supporting Google Workspace and Microsoft Azure SSO",
        "Automated task dispatching, quality assurance scoring, and worker verification telemetry",
        "Supabase-backed secure asset storage for datasets, audio transcription, and image/video bounding box annotations",
      ],
      problem:
        "Frontier AI model developers require high-accuracy domain-expert datasets (code generation, mathematics, advanced reasoning), but struggle with unverified annotators, fragmented tools, and complex enterprise SSO security.",
      approach:
        "Engineered an enterprise data workforce platform featuring multi-tier skill profiling, strict verification benchmarks, automated task routing, and seamless Google and Microsoft single sign-on.",
      solution:
        "Shipped GenMorphics AI with an intuitive dark-mode dashboard for domain annotators, real-time benchmark testing, automated weekly payout tracking, and centralized project assignment workflows.",
      results:
        "Accelerated model training data delivery by 3x, onboarded thousands of specialized STEM annotators, and maintained 99.9% pipeline reliability.",
      liveUrl: "https://app.genmorphicsai.com",
      gallery: [
        {
          url: "/projects/genmorphics-overview.png",
          alt: "GenMorphics AI Annotator & STEM Expert Dashboard",
        },
        {
          url: "/projects/genmorphics-skills.png",
          alt: "Granular Skill Matrix & Software Specialization Manager",
        },
        {
          url: "/projects/genmorphics-home.png",
          alt: "GenMorphics AI Solutions Public Portal & Data Training Suite",
        },
        {
          url: "/projects/genmorphics-app.png",
          alt: "Secure Google & Microsoft Enterprise SSO Sign In",
        },
      ],
      order: 1,
    },
    {
      slug: "sellervai",
      title: "SellerVai",
      summary:
        "Multi-platform AI-powered social commerce automation and conversational sales system empowering 5,000+ local merchants across Bangladesh.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "SellerVai Technologies",
      role: "Lead Full-Stack & AI Engineer",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "Conversational AI / LLM",
        "Node.js",
        "WhatsApp Business API",
        "Meta Messenger API",
        "Instagram Graph API",
        "Telegram Bot API",
        "PostgreSQL",
      ],
      keyFeatures: [
        "Omnichannel conversational AI answering customer messages in seconds across WhatsApp, Facebook, Instagram, and Telegram",
        "Automated Cash on Delivery (COD) phone verification and fake order screening",
        "Natural conversational order taking and stock verification in bilingual Bengali and English",
        "Instant online storefront generator with subdomains and ready product catalogs in under 24 hours",
        "Unified merchant inbox managing multi-channel conversations in a single calm dashboard",
      ],
      problem:
        "Social commerce sellers in Bangladesh lose up to 40% of interested buyers when inquiries go unanswered for more than 5 minutes, especially during peak midnight hours. Additionally, fake COD orders cause significant return logistics losses.",
      approach:
        "Developed an omnichannel AI salesperson that connects directly into WhatsApp, Messenger, Instagram, and Telegram APIs. Built natural language understanding tailored for Bangladeshi conversational shopping habits (Banglish & Bengali) and implemented algorithmic risk scoring for COD order validation.",
      solution:
        "Shipped SellerVai as a complete social commerce suite that operates 24/7, handles customer objections, confirms deliveries, screens fraudulent orders, and synchronizes inventory across channels without requiring human intervention.",
      results:
        "Empowered 5,000+ merchants across Bangladesh, recovered 50,000+ orders, reduced message response times by 2x, and maintained 99% always-on platform uptime.",
      liveUrl: "https://www.sellervai.com",
      gallery: [
        {
          url: "/projects/sellervai-home.png",
          alt: "SellerVai AI Social Commerce Salesperson & Multichannel Platform",
        },
        {
          url: "/projects/sellervai-solutions.png",
          alt: "Omnichannel Support across WhatsApp, Messenger, Instagram & Telegram",
        },
      ],
      order: 2,
    },
    {
      slug: "mathpro-academy",
      title: "MathPro Academy",
      summary:
        "Comprehensive online mathematics coaching and exam preparation platform for JSC, SSC, and HSC students with automated bKash/Nagad payments.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "MathPro Academic & Admission Care / Abdul Aziz",
      role: "Full-Stack Web Developer & Platform Architect",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "KaTeX Math Engine",
        "Node.js",
        "bKash Checkout API",
        "Nagad Payment Gateway",
        "PostgreSQL",
        "Prisma ORM",
      ],
      keyFeatures: [
        "Dual-curriculum tracks customized for both Bangla Medium and English Version mathematical syllabi",
        "High-performance client/server KaTeX mathematical formula rendering and proof formatting",
        "Automated 1-minute mobile payment checkout with instant course unlocking (bKash & Nagad)",
        "Interactive student dashboard with chapter progress tracking, daily MCQ/CQ quizzes, and leaderboard rankings",
        "24/7 dedicated Telegram mentor doubt-solving integration",
      ],
      problem:
        "Math students across Bangladesh struggle with memorization-focused teaching and lack access to structured video archives, instant doubt-solving, and automated payment/enrollment systems.",
      approach:
        "Engineered a responsive Next.js web platform optimized for fast Core Web Vitals and seamless mobile browsing. Built custom mathematical notation rendering with KaTeX and integrated direct webhooks with Bangladesh's leading mobile financial services (MFS).",
      solution:
        "Created an end-to-end EdTech portal featuring live classes, unlimited recorded HD revision lectures, chapter-wise model tests, and an automated payment-to-enrollment workflow.",
      results:
        "Platform actively mentors 4,000+ students, hosts 1,000+ interactive classes, and maintains a 98% positive rating from students and parents nationwide.",
      liveUrl: "https://www.mathpro.academy",
      gallery: [
        {
          url: "/projects/mathpro-home.png",
          alt: "MathPro Academy Mathematics Coaching & Founder Overview",
        },
        {
          url: "/projects/mathpro-courses.png",
          alt: "JSC, SSC & HSC Specialized Mathematics Course Tracks",
        },
      ],
      order: 3,
    },
    {
      slug: "codervai-cp",
      title: "Codervai CP Platform",
      summary:
        "Competitive programming and ACM ICPC training academy featuring 300+ problem archives, student module dashboards, and automated batch unlock systems.",
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
        "RESTful APIs",
        "Video Streaming Engine",
        "Dynamic Course Unlock Engine",
      ],
      keyFeatures: [
        "300+ custom curated algorithmic problems with in-depth video solution walkthroughs",
        "50+ hours of studio-grade video lectures taught by BUET CSE alumni and Googlers",
        "Automated scheduled batch timeline and module unlock mechanics to build consistent daily coding habits",
        "Student ranking system, learning streaks, and peer comparison leaderboard",
        "Comprehensive curriculum spanning C++ STL, Dynamic Programming, Graph Theory, and Tree Algorithms",
      ],
      problem:
        "Aspiring programmers preparing for competitive programming contests (ACM ICPC) and tech giant interviews often struggle with unstructured resources and a lack of high-quality localized video editorials.",
      approach:
        "Designed and implemented a gamified learning portal with structured progression tiers, time-released problem sets, and seamless video streaming infrastructure.",
      solution:
        "Shipped a specialized competitive programming platform that guides students systematically from fundamental syntax to advanced algorithmic problem solving.",
      results:
        "Over 2,000+ active software engineering students enrolled across 3 consecutive batches with an average 4.9/5 student rating.",
      liveUrl: "https://cpnew.codervai.com",
      gallery: [
        {
          url: "/projects/codervai-module-dashboard.png",
          alt: "Codervai Student Learning Cockpit, Streaks & Module Progression",
        },
        {
          url: "/projects/codervai-mylearning.png",
          alt: "Enrolled Competitive Programming Courses & Course Bundles",
        },
        {
          url: "/projects/codervai-courses.png",
          alt: "300+ Algorithmic Problems and Video Solution Catalog",
        },
      ],
      order: 4,
    },
    {
      slug: "cprbd-du",
      title: "CPR BDDU (University of Dhaka)",
      summary:
        "Official institutional portal, policy research repository, and executive education platform for the University of Dhaka's think tank.",
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
        "Prisma",
        "PostgreSQL",
        "Certificate Verification Engine",
        "PDF Document Viewer",
      ],
      keyFeatures: [
        "Public online certificate verification engine for executive training cohorts (such as ICII Certification)",
        "Searchable academic publication catalog with interactive PDF reading capabilities",
        "Institutional training cohort and batch management directories",
        "Governing body and academic leadership directory with comprehensive scholar profiles",
        "Institutional typography and responsive, accessible university branding",
      ],
      problem:
        "The Center for Policy Research on Business and Development needed a modern digital home to publish research papers, engage international partners, and provide instantaneous public verification for executive program graduates.",
      approach:
        "Built a high-performance web platform adhering to University of Dhaka aesthetic standards, featuring server-side rendered publication catalogs and a secure cryptographic certificate verification system.",
      solution:
        "Delivered a portal that centralizes research projects, executive education cohorts, media releases, and partner collaborations in an accessible architecture.",
      results:
        "Showcases 12+ major national research initiatives, 30+ institutional partners, 20+ policy dialogues, and hundreds of verified certified professionals.",
      liveUrl: "https://cprbddu.org",
      gallery: [
        {
          url: "/projects/cprbd-home.png",
          alt: "Center for Policy Research on Business and Development Portal",
        },
        {
          url: "/projects/cprbd-programs.png",
          alt: "National Executive Training Cohorts & Certificate Verification",
        },
      ],
      order: 5,
    },
    {
      slug: "linkedin-brand-assistant",
      title: "LinkedIn Brand Assistant",
      summary:
        "AI-powered Chrome extension and companion dashboard for automated post summarization and high-converting comment generation.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "LinkedIn Brand Assistant / Chrome Web Store",
      role: "Full-Stack & Chrome Extension Developer",
      timeline: "2025 – 2026",
      techStack: [
        "React",
        "TypeScript",
        "Vite",
        "Chrome Extension API (Manifest V3)",
        "Tailwind CSS",
        "OpenAI API",
      ],
      keyFeatures: [
        "One-click intelligent post summarization directly in the LinkedIn feed",
        "Tone-customizable smart comment generator (Insightful, Inquiring, Supportive, Contrarian)",
        "Seamless DOM injection matching LinkedIn's native dark and light design themes",
        "Privacy-focused local credential storage and token-efficient prompt pipeline",
      ],
      problem:
        "Founders, creators, and professionals spend hours drafting thoughtful comments to grow their presence on LinkedIn, but lack tools that integrate natively into their browser with custom brand voice presets.",
      approach:
        "Engineered a Manifest V3 browser extension using content script injection, background service workers, and structured prompt engineering with the OpenAI API.",
      solution:
        "Created an intuitive in-feed assistant that helps professionals craft engaging, context-aware comments in seconds while preserving authenticity.",
      results:
        "Published to the Chrome Web Store and deployed live companion landing page with sub-second comment generation response times.",
      liveUrl: "https://lnbrandassistant.xyz",
      githubUrl: "https://chromewebstore.google.com/detail/linkedin-brand-assistant/liicmnighkinlpgaagipbjbjkokknjhi",
      gallery: [
        {
          url: "/projects/ln-assistant-home.png",
          alt: "LinkedIn Brand Assistant AI Companion Landing Page",
        },
        {
          url: "/projects/ln-assistant-store.png",
          alt: "Chrome Web Store Published Extension",
        },
      ],
      order: 6,
    },
    {
      slug: "badhan-blood-network",
      title: "Badhan Blood Donation Network",
      summary:
        "Real-time emergency blood donor locator, eligibility tracking, and volunteer dispatch platform with offline-capable PWA support.",
      status: "PUBLISHED" as const,
      featured: false,
      client: "Voluntary Blood Donor Community",
      role: "Creator & Lead Full-Stack Architect",
      timeline: "2024 – 2025",
      techStack: [
        "Next.js",
        "React",
        "Prisma ORM",
        "PostgreSQL",
        "Tailwind CSS",
        "Workbox PWA",
        "Twilio SMS API",
      ],
      keyFeatures: [
        "Multi-district and blood group query filtering with instant eligibility date calculation",
        "One-tap emergency WhatsApp and SMS dispatch triggers for rapid volunteer mobilization",
        "Offline-capable PWA caching allowing hospital field volunteers to look up donor records in weak connectivity areas",
        "Strict health donation interval tracking (90/120 days) and verified donor badge system",
      ],
      problem:
        "During critical medical emergencies, finding compatible blood donors often relies on chaotic social media messages with long response delays and unverified donor availability.",
      approach:
        "Architected a relational database schema in Prisma with indexed eligibility queries, offline-first PWA caching, and direct contact dispatch triggers.",
      solution:
        "Built a fast, mobile-first web app that connects patients and hospitals with eligible, verified donors across Bangladesh in seconds.",
      results:
        "Successfully deployed with hundreds of verified volunteer donors and active community usage across multiple districts.",
      liveUrl: "https://badhan.mathpro.academy",
      githubUrl: "https://github.com/parvej-shah/badhan-blood-update",
      gallery: [
        {
          url: "/projects/badhan-home.png",
          alt: "Badhan Blood Donation Live Statistics & Blood Group Breakdown",
        },
        {
          url: "/projects/badhan-search.png",
          alt: "Real-time Donor Search & Multi-criteria Eligibility Filter",
        },
      ],
      order: 7,
    },
    {
      slug: "luxeory",
      title: "Luxeory",
      summary:
        "A full-stack hotel booking platform with property discovery, secure authentication, booking workflows, and admin-ready data management.",
      status: "PUBLISHED" as const,
      featured: false,
      client: "Independent Product",
      role: "Full-Stack Developer",
      timeline: "2024",
      techStack: ["React", "Node.js", "MongoDB", "Firebase", "JWT", "Tailwind CSS"],
      keyFeatures: [
        "Secure JWT-based authentication",
        "End-to-end booking flow with date range selection",
        "Searchable hotel and suite listings with price filters",
        "Protected routes for guest and admin views",
        "Database-backed content management",
      ],
      problem:
        "Independent hotels and small property owners rely on generic listing sites or manual booking processes that make it hard to manage availability, take bookings reliably, or present properties well online.",
      approach:
        "Built Luxeory as a full MERN-stack application, starting with the data model: hotels, rooms, bookings, and users as distinct collections in MongoDB with clear relationships and JWT authorization.",
      solution:
        "The result is a working platform covering the full guest journey: browse and search hotels, view detailed property pages, and complete a booking through a guarded checkout flow.",
      results:
        "Implemented end-to-end booking flow from search to confirmation with responsive mobile-first UI and role-based route protection.",
      githubUrl: "https://github.com/parvej-shah",
      gallery: [
        {
          url: "/projects/luxeory-hero.jpg",
          alt: "Luxeory Full-Stack Hotel Booking Platform Hero",
        },
        {
          url: "/projects/luxeory-preview.jpg",
          alt: "Luxeory Reservation & Property Management Overview",
        },
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

async function seedPosts() {
  const posts = [
    {
      slug: "shipping-fast-without-breaking-things",
      title: "Shipping Fast Without Breaking Things",
      excerpt:
        "A practical look at the habits that let small teams move quickly — tight feedback loops, boring infrastructure, and knowing what not to build.",
      content: `Speed gets treated like a personality trait — some teams "just move fast" and others don't. In practice, speed is a byproduct of a few boring habits repeated consistently.

## Tight feedback loops

The biggest speed tax on any project is the gap between writing code and finding out if it works. Local dev servers, fast test suites, and preview deployments aren't nice-to-haves — they're the difference between shipping ten times a day and shipping once a week.

## Boring infrastructure

Novel infrastructure is a tax you pay on every future feature. Postgres, a standard ORM, a well-known auth pattern — none of it is exciting, but none of it will page you at 2am either. Save the creativity for the product, not the plumbing.

## Knowing what not to build

Every feature you don't build is a feature you don't have to maintain, test, or explain to a confused user. The fastest teams are ruthless about scope — not because they lack ambition, but because they know unshipped simplicity beats shipped complexity.

None of this is groundbreaking. It's just consistently applied discipline, and that's usually enough.`,
      status: "PUBLISHED" as const,
      featured: true,
    },
    {
      slug: "the-case-for-boring-frontend-architecture",
      title: "The Case for Boring Frontend Architecture",
      excerpt:
        "Server components, a thin client layer, and clear data boundaries — why the least exciting architecture is usually the one that scales with a team.",
      content: `Frontend architecture discourse loves novelty — new state managers, new rendering strategies, new ways to fetch data. Most of it is solving problems that a smaller, more boring architecture never has in the first place.

## Push logic to the server

Every piece of business logic that lives in a server component is a piece of logic that doesn't need to be tested across browsers, doesn't ship extra JavaScript, and can't drift from what the database actually contains. Client components should be reserved for genuine interactivity — forms, toggles, anything that needs a browser event.

## Keep the client layer thin

A thin client layer means less state to reason about. Fetch what you need, validate it at the boundary, and let the UI be a straightforward function of that data. The fewer places state can live, the fewer places it can go stale.

## Clear data boundaries

A typed contract between the API and the UI — a Zod schema, a generated type, anything that fails loudly at build time — removes an entire category of runtime bugs. It's not glamorous, but it's the reason a team of two can maintain a codebase that feels like it was built by ten.

Boring architecture doesn't make headlines. It just means fewer 2am incidents and a codebase new teammates can understand in an afternoon.`,
      status: "PUBLISHED" as const,
      featured: true,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { ...post, publishedAt: new Date() },
      create: { ...post, publishedAt: new Date() },
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
