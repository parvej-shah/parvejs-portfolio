import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getSectionSchema, sectionKeys, type SectionKey } from "../lib/validators/section";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const sectionContent: Record<SectionKey, unknown> = {
  hero: {
    eyebrow: "Software Engineer & AI Systems Developer",
    headlineLines: ["We Build AI Systems", "That Actually Run", "in Production."],
    description:
      "We turn ambitious AI ideas into production-ready software — from 24/7 AI voice agents and automated workflows to high-scale SaaS platforms without agency bloat or fragile prototypes.",
    primaryCta: { label: "Tell Us What You're Building", href: "#contact" },
    secondaryCta: { label: "See What We've Built", href: "#portfolio" },
    trustLabel: "Trusted by 5 clients",
    trustStats: [
      { value: "12", label: "projects shipped" },
      { value: "<24h", label: "response time" },
    ],
    portraitImage: "/assets/images/banner-cutout.webp",
    portraitAlt: "Parvej Shah — Software Engineer & AI Systems Developer",
    experienceBadge: { value: "12+", label: "projects shipped" },
  },
  services: {
    eyebrow: "My Core Expertise",
    heading: "From architecture to production, without the usual excuses.",
    description:
      "Every build is measured against three things: does it hold up under real usage, can it be trusted with real money and data, and can it grow without a rewrite. No bloat, no shortcuts, just work that lasts.",
    tagline: "Core Services Offered",
    items: [
      {
        icon: "Code2",
        title: "Full Stack Systems & Web Apps",
        desc: "Software that works the first time and every time. From payment flows to permission systems and admin tooling, I build backend architecture engineered to hold up under real usage — not just in the demo.",
      },
      {
        icon: "Sparkles",
        title: "Voice AI & LLM Infrastructure",
        desc: "AI that does real work, not party tricks. Voice agents that book real appointments, and automated pipelines built with hard limits so the AI never states something that isn't true.",
      },
      {
        icon: "Gauge",
        title: "Performance & Data Architecture",
        desc: "Speed people actually feel. Pages that load instantly and stay steady, search that understands intent instead of just keywords, and data systems built to hold up under real-world load.",
      },
    ],
  },
  stats: {
    items: [
      { value: "2", suffix: "+", label: "Years of hands-on full-stack development experience" },
      { value: "12", suffix: "", label: "Products & websites designed, built, and shipped" },
      { value: "10", suffix: "+", label: "Technologies mastered across the modern stack" },
      { value: "100", suffix: "%", label: "On-time delivery — and clients who come back" },
    ],
  },
  process: {
    eyebrow: "How It Works",
    heading: "A de-risked process with defined deliverables at every step.",
    description:
      "We eliminate perceived risk and scope creep. You always know what is being built, when it will be delivered, and what concrete artifacts you will receive at each milestone.",
    steps: [
      {
        icon: "Search",
        title: "Discover",
        description: "Turn your business idea into a buildable, de-risked plan with validated architecture and clear scope.",
        deliverable: "Architecture & Roadmap",
      },
      {
        icon: "LayoutGrid",
        title: "Design",
        description: "Know exactly what we're building before expensive development begins with high-fidelity UI and flows.",
        deliverable: "Interactive UI Prototype",
      },
      {
        icon: "Code2",
        title: "Build",
        description: "Production development with clean TypeScript, deterministic AI guardrails, and automated tests.",
        deliverable: "Production Code & Staging",
      },
      {
        icon: "Rocket",
        title: "Launch",
        description: "Zero-downtime deployment, telemetry monitoring, load testing, and a 30-day post-launch warranty.",
        deliverable: "Live Deployment & 100% IP",
      },
    ],
  },
  about: {
    eyebrow: "Founder & Lead Engineer",
    heading: "The engineering philosophy behind every build.",
    image: "/assets/images/aboutme.webp",
    imageAlt: "Parvej Shah",
    quote:
      "Great software isn't just shipped — it's engineered to survive production. Every decision, from the database query index to the user conversion flow, should serve the business outcome.",
    quoteAuthor: "Parvej Shah",
    quoteRole: "Software Engineer & AI Systems Developer · Worldwide Remote",
    points: [
      "Formal Software Engineering foundation in high-scale distributed architecture",
      "Production AI & Voice — Retell AI pipelines, n8n workflow orchestration, deterministic guardrails",
      "Full-stack architecture — Next.js 16 App Router, TypeScript, Python, PostgreSQL & Redis",
      "Direct senior partnership — no junior developer handoffs or bloated agency overhead",
    ],
    badgeValue: "5",
    badgeLabel: "people trust my work",
    ctaLabel: "Discuss Your Project",
    ctaHref: "#contact",
  },
  skills: {
    eyebrow: "Production Tech Stack",
    heading: "Battle-tested tooling. Zero speculative hype.",
    items: [
      { name: "Next.js 16", icon: "SiNextdotjs" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "Python", icon: "SiPython" },
      { name: "PostgreSQL", icon: "SiPostgresql" },
      { name: "Redis", icon: "SiRedis" },
      { name: "Docker", icon: "SiDocker" },
      { name: "Prisma ORM", icon: "SiPrisma" },
    ],
  },
  testimonials: {
    eyebrow: "Client Proof & Impact",
    heading: "Measurable outcomes from the founders we've built with.",
    items: [
      {
        metric: "100% On-Time · Over-Delivers on Scope",
        quote:
          "Parvej doesn't just build websites — he genuinely thinks about cost-efficiency from the client's perspective. Two things stand out: he always over-delivers beyond what he commits to, and he delivers ahead of schedule. For non-technical founders looking for someone you can 100% trust with your platform, I highly recommend Parvej.",
        name: "Abdul Aziz",
        role: "Founder & Head Instructor, MathPro Academy (11+ Years in EdTech)",
        initials: "AA",
        avatarUrl: "",
        rating: 5,
        href: "https://www.mathpro.academy",
      },
      {
        metric: "Technical Capability & Responsibility · CPRBD Website",
        quote:
          "I had the opportunity to work with Parvej and the website team during the development of the CPRBD website. Parvej was professional, responsive, and committed throughout the process. He and the team were receptive to feedback, handled website requirements effectively, and worked collaboratively to turn our ideas into a functional and professional web presence. What I particularly appreciated was their willingness to understand the programme’s needs and make improvements accordingly. Parvej was reliable in communication and contributed positively to the overall development process. I would gladly recommend him to anyone looking for someone who combines technical capability with a strong sense of teamwork and responsibility.",
        name: "Md. Seam Ali Ahammod Pramaniq",
        role: "Project Assistant at CPRBD, University of Dhaka",
        initials: "SA",
        avatarUrl: "/testimonials/seam-ali.jpg",
        rating: 5,
        href: "https://www.linkedin.com/in/md-seam-ali-ahammod-pramaniq/",
      },
    ],
    clients: ["CPRBD", "Minions.AI", "SellerVai", "MathPro Academy", "Codervai", "University of Dhaka", "GenMorphics AI", "Leadswave"],
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
    eyebrow: "Start Your Project",
    heading: "Tell us what you're building.",
    description:
      "No polished brief or formal RFP required. Just tell us your idea, what's currently stopping you, and your target launch date. We'll reply within 24 hours with a comprehensive technical assessment.",
    info: [
      {
        icon: "Mail",
        label: "Direct Email",
        value: "parvejshahlabib007@gmail.com",
        href: "mailto:parvejshahlabib007@gmail.com",
      },
      { icon: "Clock", label: "Guaranteed Response", value: "Within 24 hours", href: null },
      { icon: "MapPin", label: "Location", value: "Worldwide · Remote", href: null },
    ],
  },
  meeting: {
    eyebrow: "Set a Meeting",
    heading: "Want to talk it through live?",
    description:
      "Propose a date and time that works for you and I'll confirm by email. Once confirmed, you can add it straight to your Google Calendar.",
    durationLabel: "30 min call",
    notes: [
      "Available for calls across US, European, and global timezones.",
      "I'll reply within 8 hours to confirm or suggest another time.",
    ],
  },
  social: {
    links: [
      { icon: "FaGithub", label: "GitHub", href: "https://github.com/parvej-shah" },
      { icon: "FaLinkedinIn", label: "LinkedIn", href: "https://linkedin.com/in/parvej-shah" },
      { icon: "FaFacebookF", label: "Facebook", href: "https://facebook.com/parvejshah007" },
    ],
  },
  footer: {
    tagline: "Software Engineer & AI Systems Developer",
    email: "parvejshahlabib007@gmail.com",
    location: "Worldwide · Remote",
    newsletterHeading: "Stay in the loop",
    newsletterDescription: "Got an idea worth building? One message starts it — I reply within 24 hours.",
    ctaLabel: "Start a Project",
    ctaHref: "/#contact",
    copyrightName: "Parvej Shah",
    copyrightRole: "Software Engineer & AI Systems Developer",
  },
  seo: {
    title: "Parvej Shah — Software Engineer & AI Systems Developer",
    description:
      "Software Engineer & AI Systems Developer. We turn ambitious AI ideas into production-ready software — from 24/7 voice agents to scalable SaaS systems.",
    ogImage: "/og.jpg",
    siteUrl: "https://parvejshah.com",
  },
};

async function sync() {
  console.log("Syncing SiteContent to Neon DB...");
  for (const key of sectionKeys) {
    const data = getSectionSchema(key).parse(sectionContent[key]);
    await prisma.siteContent.upsert({
      where: { key },
      update: { data },
      create: { key, data },
    });
    console.log(`✓ Synced: ${key}`);
  }
  console.log("Done syncing sections!");
  await prisma.$disconnect();
}

sync().catch((err) => {
  console.error("Error syncing sections:", err);
  process.exit(1);
});
