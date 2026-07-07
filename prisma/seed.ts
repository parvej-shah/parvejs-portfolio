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
      slug: "luxeory",
      title: "Luxeory",
      summary: "Hotel booking platform",
      status: "PUBLISHED" as const,
      featured: true,
      techStack: ["React", "Node.js", "MongoDB", "Firebase", "JWT"],
      order: 0,
    },
    {
      slug: "visasphere",
      title: "VisaSphere",
      summary: "Visa application navigator",
      status: "PUBLISHED" as const,
      featured: true,
      techStack: ["React", "Node.js", "MongoDB", "Firebase"],
      order: 1,
    },
    {
      slug: "lingo-bingo",
      title: "Lingo Bingo",
      summary: "Japanese language learning",
      status: "PUBLISHED" as const,
      featured: true,
      techStack: ["React", "Firebase", "Tailwind CSS"],
      order: 2,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
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
        role: "Startup Founder",
        initials: "CN",
      },
      {
        quote:
          "Clean code, thoughtful UX, and a genuine care for the end result. Parvej understood exactly what we needed and shipped it faster than we expected.",
        name: "Client Name",
        role: "Product Manager",
        initials: "CN",
      },
    ],
    clients: ["Zenvix", "Glovix", "Crevox", "Markon", "Brandex", "Nexora"],
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
    ctaHref: "#contact",
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
