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
import { markdownRemarkPlugins } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const defaultSiteUrl = "https://parvejshah.vercel.app";

const caseStudySections = [
  { key: "problem", label: "Problem", step: "01", icon: CircleHelp },
  { key: "approach", label: "Approach", step: "02", icon: Compass },
  { key: "solution", label: "Solution", step: "03", icon: Hammer },
  { key: "results", label: "Results", step: "04", icon: Trophy },
] as const;

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

  return {
    title: `${project.title} | Projects | Parvej Shah`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      images: project.gallery[0]
        ? [{ url: project.gallery[0].url, alt: project.gallery[0].alt || project.title }]
        : undefined,
      modifiedTime: project.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: project.gallery[0] ? [project.gallery[0].url] : undefined,
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

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: project.gallery[0] ? project.gallery[0].url : undefined,
    dateCreated: project.createdAt.toISOString(),
    dateModified: project.updatedAt.toISOString(),
    creator: { "@type": "Person", name: "Parvej Shah" },
    url: `${siteUrl}/projects/${project.slug}`,
  };

  return (
    <main className="border-b border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
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
                    <ReactMarkdown remarkPlugins={markdownRemarkPlugins}>{value}</ReactMarkdown>
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

