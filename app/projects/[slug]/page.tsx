import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  ArrowUpRight,
  Code2,
  CircleHelp,
  Compass,
  Hammer,
  Trophy,
  Sparkles,
  Briefcase,
  UserRound,
  CalendarClock,
  Layers,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import ProjectGallery from "@/components/ProjectGallery";
import { buttonVariants } from "@/components/ui/button";
import { getProjectBySlug, getPublishedProjects, getSection } from "@/lib/data/public";
import { getReadingStats, markdownRemarkPlugins } from "@/lib/markdown";
import Mermaid from "@/components/Mermaid";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const defaultSiteUrl = "https://parvejshah.com";

const projectMetaTitleMap: Record<string, string> = {
  "genmorphics-ai": "GenMorphics AI Case Study: Workforce Management Platform | Parvej Shah",
  "cprbd-du": "CPRBD DU Case Study: Certification & Tuition Platform | Parvej Shah",
  "mathpro-academy": "MathPro Academy Case Study: EdTech Platform with KaTeX | Parvej Shah",
  "sellervai": "SellerVai Case Study: Conversational Commerce Platform | Parvej Shah",
};

// The DB summary is written for the on-page intro paragraph and runs 300-400
// chars — too long for a SERP snippet, which Google truncates around ~155-160.
// Shorter, meta-only descriptions for the case studies verified against source.
const projectMetaDescriptionMap: Record<string, string> = {
  "genmorphics-ai":
    "Enterprise workforce platform for GenMorphics AI: skill-based task routing, a custom NDA lifecycle engine, database-driven RBAC, and automated payroll.",
  "cprbd-du":
    "Credentialing platform for CPRBD at University of Dhaka: template-driven certificates, SSLCommerz multi-installment tuition, and a no-code staff CMS.",
  "mathpro-academy":
    "EdTech platform for 4,000+ Bangladeshi students: client-side KaTeX rendering, SSLCommerz/MFS checkout with bundles, and a no-code admin backend.",
  "sellervai":
    "Conversational commerce agent for Bangladeshi merchants: message debouncing, hybrid product search, intent scoring, and a merchant analytics dashboard.",
};

const caseStudySections = [
  { key: "problem", label: "Problem", step: "01", icon: CircleHelp },
  { key: "approach", label: "Approach", step: "02", icon: Compass },
  { key: "solution", label: "Solution", step: "03", icon: Hammer },
  { key: "results", label: "Results", step: "04", icon: Trophy },
] as const;

const projectKeywordsMap: Record<string, string[]> = {
  "minions-ai": [
    "Voice AI telephony",
    "Retell AI",
    "n8n automation",
    "Gemini 2.0 Flash",
    "EspoCRM",
    "Google Calendar integration",
    "WebRTC SIP pipeline",
    "trade contractor dispatch bot",
    "AI voice latency",
  ],
  "genmorphics-ai": [
    "AI data annotation platform",
    "RLHF SFT workforce management",
    "Azure AD Entra ID SSO",
    "PostgreSQL Row Level Security",
    "NextAuth.js",
    "Cloudflare R2",
    "enterprise AI dashboard",
  ],
  "mathpro-academy": [
    "EdTech coaching platform",
    "client-side KaTeX rendering",
    "Lexical rich-text editor",
    "SSLCommerz payment gateway",
    "bKash Nagad tuition",
    "course access control",
    "quiz import LLM",
  ],
  "badhan-blood-network": [
    "Badhan blood donation network",
    "Amar Ekushey Hall University of Dhaka",
    "emergency blood transfusion",
    "donor eligibility cooldown",
    "Telegram bot emergency alert",
    "IndexedDB PWA",
  ],
  "sellervai": [
    "SellerVai",
    "conversational commerce bot",
    "FastAPI DeepSeek agent",
    "PGVector FastEmbed hybrid search",
    "Gemini Vision marketing content",
    "Meta Graph API WhatsApp Messenger",
    "message debouncing",
    "intent qualification scoring",
  ],
  "cprbd-du": [
    "CPRBD DU",
    "University of Dhaka certificate verification",
    "structured certificate ID",
    "SSLCommerz multi-installment",
    "visual certificate designer",
    "block-based CMS",
  ],
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found | Parvej Shah" };
  }

  const keywords = projectKeywordsMap[slug] || [
    "software engineering",
    "full-stack project",
    "Next.js",
    "TypeScript",
    "Parvej Shah",
    "University of Dhaka",
  ];

  const absoluteImageUrl = project.gallery[0]
    ? project.gallery[0].url.startsWith("http")
      ? project.gallery[0].url
      : `${defaultSiteUrl}${project.gallery[0].url}`
    : `${defaultSiteUrl}/og.jpg`;

  const pageTitle = projectMetaTitleMap[slug] || `${project.title} — Case Study | Parvej Shah`;
  const pageDescription = projectMetaDescriptionMap[slug] || project.summary;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: pageTitle,
      description: pageDescription,
      url: `/projects/${project.slug}`,
      images: [
        {
          url: absoluteImageUrl,
          alt: project.gallery[0]?.alt || project.title,
        },
      ],
      modifiedTime: project.updatedAt.toISOString(),
      section: "Software Engineering Case Studies",
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [absoluteImageUrl],
      creator: "@parvejshah",
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const metaItems = [
    { label: "Client", value: project.client || "Independent product", icon: Briefcase },
    { label: "Role", value: project.role || "Full-stack development", icon: UserRound },
    { label: "Timeline", value: project.timeline || "Ongoing", icon: CalendarClock },
    {
      label: "Stack",
      value: project.techStack.length > 0 ? `${project.techStack.length} technologies` : "Modern web",
      icon: Layers,
    },
  ];

  const seo = await getSection("seo");
  const siteUrl = seo?.siteUrl || defaultSiteUrl;

  const keywords = projectKeywordsMap[slug] || [
    "software engineering",
    "full-stack development",
    "Next.js",
    "TypeScript",
  ];

  const absoluteImageUrl = project.gallery[0]
    ? project.gallery[0].url.startsWith("http")
      ? project.gallery[0].url
      : `${siteUrl}${project.gallery[0].url}`
    : `${siteUrl}/og.jpg`;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.summary,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    keywords: keywords.join(", "),
    image: absoluteImageUrl,
    dateCreated: project.createdAt.toISOString(),
    dateModified: project.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Parvej Shah",
      jobTitle: "Software Engineer & AI Systems Developer",
      url: siteUrl,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Dhaka",
      },
      worksFor: {
        "@type": "Organization",
        name: "CoderVai",
      },
      sameAs: [
        "https://github.com/parvej-shah",
        "https://www.linkedin.com/in/parvej-shah",
        "https://dev.to/parvejshah",
        "https://hashnode.com/@parvejshah",
        "https://medium.com/@parvejshah",
        "https://peerlist.io/parvejshah",
        "https://producthunt.com/@parvejshah",
      ],
    },
    url: `${siteUrl}/projects/${project.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${siteUrl}/projects/${project.slug}`,
      },
    ],
  };

  return (
    <main className="border-b border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-line py-16 lg:py-24">
        {/* Ambient brand glow to fill the negative space behind the header */}
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand/10 blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand/5 blur-[100px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-stretch">
            <Reveal className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">Case Study</span>
                {project.featured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                    <Sparkles className="size-3" />
                    Featured
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink-2/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <CalendarClock className="size-3" />
                  Last updated: {new Date(project.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {project.summary}
              </p>

              {project.techStack.length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 8).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-ink-2/70 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              {project.liveUrl || project.githubUrl ? (
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants(),
                        "h-10 rounded-full bg-brand px-4 text-sm font-semibold text-[#05140b] hover:bg-brand-dark"
                      )}
                    >
                      Live site
                      <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants(),
                        "h-10 rounded-full border border-line bg-transparent px-4 text-sm font-semibold text-white hover:border-brand/50"
                      )}
                    >
                      <Code2 className="size-4" />
                      Source
                    </a>
                  ) : null}
                </div>
              ) : null}
            </Reveal>

            <Reveal delay={90} className="flex flex-col justify-center">
              <dl className="grid gap-px overflow-hidden rounded-[1.6rem] border border-line bg-line sm:grid-cols-2">
                {metaItems.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-3 bg-ink-3 p-6 transition-colors duration-300 hover:bg-ink-2"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="size-4 text-brand" />
                      <dt className="text-xs uppercase tracking-[0.18em]">{label}</dt>
                    </div>
                    <dd className="text-base font-medium leading-6 text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {project.gallery.length > 0 ? (
        <section className="border-b border-line py-14 lg:py-20">
          <Reveal className="mx-auto mb-8 flex max-w-7xl flex-wrap items-end justify-between gap-4 px-5">
            <div>
              <span className="eyebrow">Gallery</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                A closer look
              </h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {project.gallery.length} {project.gallery.length === 1 ? "shot" : "shots"} · click to expand
            </span>
          </Reveal>
          <ProjectGallery assets={project.gallery} projectTitle={project.title} />
        </section>
      ) : null}

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal className="space-y-6">
            <div className="card-surface p-6">
              <span className="eyebrow mb-5">Stack</span>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {project.keyFeatures.length > 0 ? (
              <div className="card-surface p-6">
                <span className="eyebrow mb-5">Key Features</span>
                <ul className="space-y-2.5">
                  {project.keyFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="card-surface p-6">
              <span className="eyebrow mb-5">Working Together</span>
              <p className="text-sm leading-7 text-muted-foreground">
                Need a similar delivery process for your product? I can help shape the scope and
                ship the implementation end to end.
              </p>
              <a
                href="/#contact"
                className={cn(
                  buttonVariants(),
                  "mt-6 h-11 w-fit rounded-full bg-brand px-5 text-sm font-semibold text-[#05140b] hover:bg-brand-dark"
                )}
              >
                Start a project
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>

          <div className="relative space-y-10">
            <div
              className="absolute left-6 top-2 bottom-2 hidden w-px bg-gradient-to-b from-brand/50 via-line to-transparent sm:block"
              aria-hidden
            />
            {caseStudySections.map((section, index) => {
              const value = project[section.key];

              if (!value) return null;
              const Icon = section.icon;

              return (
                <Reveal
                  key={section.key}
                  delay={index * 70}
                  className="relative card-surface p-7 sm:ml-16 sm:p-8"
                >
                  <div className="absolute -left-16 top-7 hidden size-12 items-center justify-center rounded-full border border-line bg-ink-2 sm:flex">
                    <Icon className="size-5 text-brand" />
                  </div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground/70">{section.step}</span>
                    <span className="eyebrow">{section.label}</span>
                  </div>
                  <div className="prose-portfolio">
                    <ReactMarkdown 
                      remarkPlugins={markdownRemarkPlugins}
                      components={{
                        code(props: any) {
                          const { children, className, node, ...rest } = props;
                          const match = /language-(\w+)/.exec(className || "");
                          if (match && match[1] === "mermaid") {
                            return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                          }
                          return <code {...rest} className={className}>{children}</code>;
                        }
                      }}
                    >
                      {value}
                    </ReactMarkdown>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

