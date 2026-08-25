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
        "Service contractors frequently miss inbound customer calls while on active job sites or after business hours, leading to lost inquiries and delayed responses.",
      approach:
        "Engineered a low-latency voice pipeline integrated with SIP voice agents and LLMs. Built a deterministic multi-agent state machine to automate industry signal research, drafting, critic validation, and asset publishing to Cloudflare R2.",
      solution:
        "Delivered Minions.AI featuring automated voice answering, rapid SMS lead follow-ups, and a central mission control dashboard for agent orchestration.",
      results:
        "Delivered 24/7 call and message coverage with automated booking scheduling and consistent multi-agent content drafting.",
      liveUrl: "https://www.getminions.ai",
      gallery: [
        {
          url: "/projects/minions-landing.png",
          alt: "Minions.AI 24/7 AI Voice Dispatcher & Speed-to-Lead Platform",
        },
        {
          url: "/projects/minions-cockpit.png",
          alt: "Minions.AI Multi-Agent Mission Control Cockpit & Telemetry",
        },
        {
          url: "/projects/minions-crew.png",
          alt: "Minions Digital Crew Members & Voice Pipeline Architecture",
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
        "Enterprise workforce management and annotation platform for domain-specific LLM data collection, fine-tuning, and evaluation.",
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
        "Multi-tier role-based access control for annotators, review leads, and administrators",
        "Granular skill profiling matrix categorizing expertise across Coding, STEM, Linguistics, and Technical domains",
        "Enterprise single sign-on supporting Google Workspace and Microsoft Azure SSO",
        "Task assignment workflow, quality evaluation tracking, and earnings dashboard",
        "Supabase-backed secure asset storage for datasets and multi-modal annotation tasks",
      ],
      problem:
        "Managing distributed pools of specialized subject-matter experts for AI data annotation requires secure enterprise authentication, granular skill categorization, and structured task assignments.",
      approach:
        "Architected a Next.js and Supabase web portal with role-based access control, dynamic skill assessment profiles, and OAuth integration.",
      solution:
        "Built an intuitive dashboard enabling annotators to manage profiles, complete skill assessments, and work on structured data annotation projects.",
      results:
        "Streamlined domain expert onboarding with zero authentication friction and centralized skill verification.",
      liveUrl: "https://app.genmorphicsai.com",
      gallery: [
        {
          url: "/projects/genmorphics-app.png",
          alt: "GenMorphics AI Secure Google & Microsoft Enterprise SSO Sign In",
        },
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
      ],
      order: 1,
    },
    {
      slug: "sellervai",
      title: "SellerVai",
      summary:
        "AI-powered conversational social commerce sales and customer support assistant for online merchants.",
      status: "PUBLISHED" as const,
      featured: true,
      client: "SellerVai Technologies",
      role: "Lead Full-Stack & AI Engineer",
      timeline: "2025 – 2026",
      techStack: [
        "Next.js (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "WhatsApp Business API",
        "Meta Messenger API",
        "Instagram Graph API",
        "Telegram Bot API",
        "PostgreSQL",
      ],
      keyFeatures: [
        "Conversational AI automated customer messaging across WhatsApp, Facebook Messenger, Instagram, and Telegram",
        "Bilingual Bengali and English product recommendations, FAQ answering, and order assistance",
        "Order intake and Cash on Delivery (COD) confirmation workflow",
        "Centralized merchant inbox for managing customer inquiries across connected social channels",
      ],
      problem:
        "Online sellers on social media spend hours manually replying to repetitive product inquiries, price checks, and delivery questions.",
      approach:
        "Built a multi-platform chatbot integration connecting to social messaging APIs with conversational LLM responses tailored for local e-commerce queries.",
      solution:
        "Shipped SellerVai to automate 24/7 customer chat support, order capture, and multichannel message handling.",
      results:
        "Reduced customer waiting times, automated routine order inquiries, and provided a unified messaging dashboard for merchants.",
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
        {
          url: "/projects/sellervai-pricing.png",
          alt: "SellerVai Merchant Subscription & Automation Packages",
        },
      ],
      order: 2,
    },
    {
      slug: "mathpro-academy",
      title: "MathPro Academy",
      summary:
        "Online mathematics coaching and exam preparation web platform for JSC, SSC, and HSC students with automated bKash/Nagad checkout.",
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
        "Structured course tracks for General Math and Higher Math (Bangla Medium and English Version)",
        "KaTeX mathematical notation rendering for formulas, proofs, and practice problems",
        "Automated mobile checkout integration supporting bKash and Nagad payment gateways",
        "Student dashboard with chapter progress tracking, recorded lectures, and practice quizzes",
      ],
      problem:
        "Math students need structured online access to video lectures, mathematical notes, and instant automated course enrollment.",
      approach:
        "Built a responsive Next.js application with fast server rendering, client-side KaTeX formula formatting, and secure mobile financial service (MFS) payment callbacks.",
      solution:
        "Delivered a complete student learning portal with categorized video lessons, chapter tests, and automated enrollment verification.",
      results:
        "Supports registered math students with seamless automated course unlocking upon payment confirmation.",
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
        {
          url: "/projects/mathpro-features.png",
          alt: "Interactive Math Learning Features & Automated Checkout",
        },
      ],
      order: 3,
    },
    {
      slug: "codervai-cp",
      title: "Codervai CP Platform",
      summary:
        "Competitive programming and algorithmic problem-solving training academy featuring 300+ problem sets, video editorials, and progress tracking.",
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
      ],
      keyFeatures: [
        "300+ curated algorithmic problems with in-depth video solution walkthroughs",
        "Structured topic progression covering C++ STL, Dynamic Programming, Graphs, and Trees",
        "Student dashboard tracking module completion, learning streaks, and rankings",
        "Scheduled batch progression and dynamic lesson unlock mechanism",
      ],
      problem:
        "Students preparing for coding contests and technical interviews need a structured learning roadmap with localized video explanations and tracked progress.",
      approach:
        "Engineered a gamified learning platform with module-by-module video streaming, progress milestones, and algorithmic practice sets.",
      solution:
        "Created a comprehensive learning portal guiding students from foundational algorithms to advanced competitive programming techniques.",
      results:
        "Enrolled over 2,000 students across training cohorts with high course completion and engagement rates.",
      liveUrl: "https://cpnew.codervai.com",
      gallery: [
        {
          url: "/projects/codervai-courses.png",
          alt: "Codervai All Courses & Bundle Catalog",
        },
        {
          url: "/projects/codervai-module-dashboard.png",
          alt: "Codervai Student Learning Cockpit, Streaks & Module Progression",
        },
        {
          url: "/projects/codervai-mylearning.png",
          alt: "Enrolled Competitive Programming Courses & Course Bundles",
        },
        {
          url: "/projects/codervai-home.png",
          alt: "Codervai Competitive Programming Academy Homepage",
        },
      ],
      order: 4,
    },
    {
      slug: "cprbd-du",
      title: "CPR BDDU (University of Dhaka)",
      summary:
        "Institutional portal, policy research catalog, and executive education platform for the Center for Policy Research on Business and Development, University of Dhaka.",
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
        "Certificate Verification Engine",
        "PDF Document Viewer",
      ],
      keyFeatures: [
        "Online certificate verification tool for executive training cohort participants",
        "Academic publication and research paper repository with embedded document viewing",
        "Executive education cohort directory and program details",
        "Faculty and scholar directory with academic profiles",
      ],
      problem:
        "The policy research center needed a dignified digital presence to showcase publications, announce executive cohorts, and provide online certificate verification.",
      approach:
        "Built a server-side rendered institutional web portal adhering to academic branding standards with secure verification lookups.",
      solution:
        "Delivered a clean portal organizing research papers, policy dialogues, and training programs with instant public certificate lookup.",
      results:
        "Centralizes research publications, institutional events, and provides verified credential lookups for program graduates.",
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
        {
          url: "/projects/cprbd-researches.png",
          alt: "National Policy Research & Academic Publications Repository",
        },
      ],
      order: 5,
    },
    {
      slug: "linkedin-brand-assistant",
      title: "LinkedIn Brand Assistant",
      summary:
        "AI-powered Manifest V3 Chrome extension and companion web app for LinkedIn post summarization and context-aware comment drafting.",
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
        "In-feed post summarization directly inside the LinkedIn web interface",
        "Tone-customizable smart comment generator (Insightful, Inquiring, Supportive)",
        "Native DOM injection styled to match LinkedIn's light and dark UI",
        "Client-side API key configuration for private and secure token management",
      ],
      problem:
        "Active LinkedIn creators and professionals spend significant time reading long posts and drafting thoughtful, contextual responses.",
      approach:
        "Engineered a Chrome extension using Manifest V3 content scripts, background workers, and structured OpenAI API prompts.",
      solution:
        "Created a lightweight browser companion that generates relevant comment drafts directly alongside posts.",
      results:
        "Published to the Chrome Web Store with fast, in-browser comment drafting.",
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
        {
          url: "/projects/ln-assistant-features.png",
          alt: "AI Comment Tone Customization & Workflow Engine",
        },
      ],
      order: 6,
    },
    {
      slug: "badhan-blood-network",
      title: "Badhan Blood Donation (Amar Ekushey Hall Unit)",
      summary:
        "Emergency blood donor directory, donation logging, and volunteer management platform built for the Badhan Amar Ekushey Hall Unit.",
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
      ],
      keyFeatures: [
        "Unit-specific donor registry with real-time donation logging and blood group breakdown (A+, B+, O+, AB+)",
        "Searchable donor database with name, phone, batch, and referral tracking",
        "Calculated donation eligibility intervals ensuring health compliance before dispatch",
        "PWA offline caching for volunteer access in hospital wards and low-connectivity zones",
      ],
      problem:
        "Student volunteers at the Amar Ekushey Hall Unit of Badhan manage hundreds of voluntary blood donations annually, requiring an accurate, instantly searchable registry to match patients with eligible hall donors during urgent emergencies.",
      approach:
        "Architected a dedicated Next.js and Prisma platform with relational indexing on blood groups, donation timestamps, and member batches, paired with offline PWA support.",
      solution:
        "Shipped a mobile-friendly dashboard displaying monthly donation totals, blood group breakdowns, and quick-search donor contact records for hall volunteers.",
      results:
        "Actively tracks over 590+ total donations and 400+ unique donors for the Amar Ekushey Hall Unit with live reporting and search.",
      liveUrl: "https://badhan.mathpro.academy",
      githubUrl: "https://github.com/parvej-shah/badhan-blood-update",
      gallery: [
        {
          url: "/projects/badhan-home.png",
          alt: "Badhan Amar Ekushey Hall Unit Dashboard & Live Blood Group Breakdown",
        },
        {
          url: "/projects/badhan-search.png",
          alt: "Real-time Donor Search & Multi-criteria Eligibility Filter",
        },
        {
          url: "/projects/badhan-records.png",
          alt: "Donor Records & Unit Donation Logs",
        },
      ],
      order: 7,
    },
    {
      slug: "luxeory",
      title: "Luxeory",
      summary:
        "Full-stack hotel and room booking platform with property discovery, date availability selection, and authenticated guest workflows.",
      status: "PUBLISHED" as const,
      featured: false,
      client: "Independent Product",
      role: "Full-Stack Developer",
      timeline: "2024",
      techStack: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
      keyFeatures: [
        "JWT-based user authentication and protected booking routes",
        "Searchable hotel and suite listings with price and amenity filters",
        "End-to-end room reservation flow with date selection",
        "Relational data modeling for properties, rooms, users, and reservations",
      ],
      problem:
        "Independent hospitality properties need a dedicated online booking flow to manage reservations directly without complex third-party systems.",
      approach:
        "Developed a full-stack MERN application with clear MongoDB data models for rooms, bookings, and user accounts.",
      solution:
        "Built an end-to-end booking application with responsive property exploration and secure checkout steps.",
      results:
        "Completed functional property discovery and reservation pipeline with mobile-first UI.",
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
        {
          url: "/projects/luxeory-booking.jpg",
          alt: "Luxeory Guarded Checkout & Room Selection",
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
