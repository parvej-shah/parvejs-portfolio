import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getSectionSchema, sectionKeys, type SectionKey } from "../lib/validators/section";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const sectionContent: Record<SectionKey, unknown> = {
  hero: {
    eyebrow: "Software Engineer & AI Systems Developer",
    headlineLines: [
      "AI Automation and",
      "Web Products",
      "Built Around Your Business.",
    ],
    description: "You have the idea. What you don't have is someone you trust to actually ship it. Work directly with Parvej to automate the workflows eating your team's time — planned, built, and shipped to hold up in production.",
    primaryCta: { href: "#contact", label: "Discuss Your Project" },
    secondaryCta: { href: "#portfolio", label: "Explore Client Work" },
    trustLabel: "Trusted by clients worldwide",
    trustStats: [
      { label: "years shipping production systems", value: "2+" },
      { label: "response time", value: "<24h" },
    ],
    portraitImage: "/assets/images/banner-cutout.webp",
    portraitAlt: "Parvej Shah — Software Engineer & AI Systems Developer",
    experienceBadge: { label: "projects shipped", value: "12+" },
  },
  services: {
    eyebrow: "My Core Expertise",
    heading: "From architecture to production, without the usual excuses.",
    description: "Every build is measured against three things: does it hold up under real usage, can it be trusted with real money and data, and can it grow without a rewrite. No bloat, no shortcuts, just work that lasts.",
    tagline: "Core Services Offered",
    items: [
      {
        desc: "Software that works the first time and every time. From payment flows to permission systems and admin tooling, I build backend architecture engineered to hold up under real usage — not just in the demo.",
        icon: "Code2",
        title: "Full Stack Systems & Web Apps",
      },
      {
        desc: "AI that does real work, not party tricks. Voice agents that book real appointments, and automated pipelines built with hard limits so the AI never states something that isn't true.",
        icon: "Sparkles",
        title: "Voice AI & LLM Infrastructure",
      },
      {
        desc: "Speed people actually feel. Pages that load instantly and stay steady, search that understands intent instead of just keywords, and data systems built to hold up under real-world load.",
        icon: "Gauge",
        title: "Performance & Data Architecture",
      },
    ],
  },
  stats: {
    items: [
      { label: "Years of hands-on full-stack development experience", value: "2", suffix: "+" },
      { label: "Products & websites designed, built, and shipped", value: "12", suffix: "" },
      { label: "Technologies mastered across the modern stack", value: "10", suffix: "+" },
      { label: "On-time delivery — and clients who come back", value: "100", suffix: "%" },
    ],
  },
  process: {
    eyebrow: "How It Works",
    heading: "A de-risked process with defined deliverables at every step.",
    description: "We eliminate perceived risk and scope creep. You always know what is being built, when it will be delivered, and what concrete artifacts you will receive at each milestone.",
    steps: [
      {
        icon: "Search",
        title: "Discover",
        deliverable: "Architecture & Roadmap",
        description: "Turn your business idea into a buildable, de-risked plan with validated architecture and clear scope.",
      },
      {
        icon: "LayoutGrid",
        title: "Design",
        deliverable: "Interactive UI Prototype",
        description: "Know exactly what we're building before expensive development begins with high-fidelity UI and flows.",
      },
      {
        icon: "Code2",
        title: "Build",
        deliverable: "Production Code & Staging",
        description: "Production development with clean TypeScript, deterministic AI guardrails, and automated tests.",
      },
      {
        icon: "Rocket",
        title: "Launch",
        deliverable: "Live Deployment & 100% IP",
        description: "Zero-downtime deployment, telemetry monitoring, load testing, and a 30-day post-launch warranty.",
      },
    ],
  },
  about: {
    eyebrow: "Founder & Lead Engineer",
    heading: "An engineering partner who thinks beyond launch.",
    image: "/assets/images/aboutme.webp",
    imageAlt: "Parvej Shah",
    quote: "I care about what happens after launch: whether your team can use the product confidently, whether it can adapt as the business grows, and whether the technology earns its place in the workflow.",
    quoteAuthor: "Parvej Shah",
    quoteRole: "Software Engineer & Platform Architect · University of Dhaka",
    points: [
      "Formal Software Engineering foundation from IIT, University of Dhaka",
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
      { icon: "SiNextdotjs", name: "Next.js 16" },
      { icon: "SiTypescript", name: "TypeScript" },
      { icon: "SiPython", name: "Python" },
      { icon: "SiPostgresql", name: "PostgreSQL" },
      { icon: "SiRedis", name: "Redis" },
      { icon: "SiDocker", name: "Docker" },
      { icon: "SiPrisma", name: "Prisma ORM" },
    ],
  },
  testimonials: {
    eyebrow: "Client Proof & Impact",
    heading: "Measurable outcomes from the founders we've built with.",
    items: [
      {
        href: "https://www.mathpro.academy",
        name: "Abdul Aziz",
        role: "Founder & Head Instructor, MathPro Academy (11+ Years in EdTech)",
        quote: "Parvej doesn't just build websites — he genuinely thinks about cost-efficiency from the client's perspective. Two things stand out: he always over-delivers beyond what he commits to, and he delivers ahead of schedule. For non-technical founders looking for someone you can 100% trust with your platform, I highly recommend Parvej.",
        metric: "100% On-Time · Over-Delivers on Scope",
        rating: 5,
        initials: "AA",
        avatarUrl: "",
      },
      {
        href: "https://www.linkedin.com/in/parvejshah/details/recommendations/?detailScreenTabIndex=2",
        name: "Nafis Sajid",
        role: "Lead Engineer at Samsung R&D · Co-founder, GenMorphics AI Solutions",
        quote: "I worked with Parvej and he's the kind of engineer you can just hand something to and stop worrying about it. He knows web development well, and not just the surface of it. He's comfortable with databases, and deployment as well.",
        metric: "Full-Stack Architecture · GenMorphics AI Solutions",
        rating: 5,
        initials: "NS",
        avatarUrl: "/testimonials/nafis-sajid.png",
      },
      {
        href: "https://www.linkedin.com/in/md-seam-ali-ahammod-pramaniq/",
        name: "Md. Seam Ali Ahammod Pramaniq",
        role: "Project Assistant at CPRBD, University of Dhaka",
        quote: "I had the opportunity to work with Parvej and the website team during the development of the CPRBD website. Parvej was professional, responsive, and committed throughout the process. He and the team were receptive to feedback, handled website requirements effectively, and worked collaboratively to turn our ideas into a functional and professional web presence. What I particularly appreciated was their willingness to understand the programme’s needs and make improvements accordingly. Parvej was reliable in communication and contributed positively to the overall development process. I would gladly recommend him to anyone looking for someone who combines technical capability with a strong sense of teamwork and responsibility.",
        metric: "Technical Capability & Responsibility · CPRBD Website",
        rating: 5,
        initials: "SA",
        avatarUrl: "/testimonials/seam-ali.jpg",
      },
    ],
    clients: [
      "CPRBD",
      "Minions.AI",
      "SellerVai",
      "MathPro Academy",
      "Codervai",
      "University of Dhaka",
      "GenMorphics AI",
      "Leadswave",
    ],
  },
  cta: {
    rating: "4.9",
    ratingLabel: "Trusted feedback from real clients",
    heading: "Ready to build something people remember?",
    description: "Bring a polished brief or a napkin sketch — both work. Tell me where you want to go, and I'll map the fastest route to a product your users will love.",
    ctaLabel: "Start Your Project",
    ctaHref: "#contact",
  },
  contact: {
    eyebrow: "Start Your Project",
    heading: "Tell us what you're building.",
    description: "No polished brief or formal RFP required. Just tell us your idea, what is currently stopping you, and your target launch date. I will reply within 24 hours with an initial feasibility read, the questions needed to scope it, and a suggested next step.",
    info: [
      {
        href: "mailto:parvejshahlabib007@gmail.com",
        icon: "Mail",
        label: "Direct Email",
        value: "parvejshahlabib007@gmail.com",
      },
      { href: null, icon: "Clock", label: "Response Time", value: "Within 24 hours" },
      { href: null, icon: "MapPin", label: "Location", value: "Worldwide · Remote" },
    ],
  },
  meeting: {
    eyebrow: "Set a Meeting",
    heading: "Want to talk it through live?",
    description: "Propose a date and time that works for you and I'll confirm by email. Once confirmed, you can add it straight to your Google Calendar.",
    durationLabel: "30 min call",
    notes: [
      "Available for calls across US, European, and global timezones.",
      "I will reply within 24 hours to confirm or suggest another time.",
    ],
  },
  social: {
    links: [
      { href: "https://github.com/parvej-shah", icon: "FaGithub", label: "Github" },
      { href: "https://www.linkedin.com/in/parvej-shah", icon: "FaLinkedinIn", label: "LinkedIn" },
      { href: "https://facebook.com/parvej.shahlabib", icon: "FaFacebookF", label: "Facebook" },
    ],
  },
  footer: {
    tagline: "Production AI systems and high-performance web products, built with precision, speed, and code made to last.",
    email: "parvejshahlabib007@gmail.com",
    location: "Worldwide · Remote",
    newsletterHeading: "Let's stay in touch",
    newsletterDescription: "Got an idea worth building? One message starts it — I reply within 24 hours.",
    ctaLabel: "Start a Project",
    ctaHref: "/#contact",
    copyrightName: "Parvej Shah",
    copyrightRole: "Software Engineer & AI Systems Developer",
  },
  seo: {
    title: "Parvej Shah — Software Engineer & AI Systems Developer",
    description: "Software Engineer & AI Systems Developer. I build production AI voice pipelines, reliable payment webhook infrastructure, and full-stack systems.",
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
