import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowUpRight, CircleHelp, Compass, Hammer, Trophy } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProjectGallery from "@/components/ProjectGallery";
import { buttonVariants } from "@/components/ui/button";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/public";
import { markdownRemarkPlugins } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
      title: project.title,
      description: project.summary,
      images: project.gallery[0]
        ? [{ url: project.gallery[0].url, alt: project.gallery[0].alt || project.title }]
        : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="border-b border-line">
      <section className="border-b border-line py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <Reveal>
              <span className="eyebrow mb-4">Case Study</span>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {project.summary}
              </p>
            </Reveal>

            <Reveal delay={90} className="grid gap-4 sm:grid-cols-3">
              <div className="card-surface p-5">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Client
                </span>
                <p className="mt-3 text-sm leading-6 text-white">
                  {project.client || "Independent product"}
                </p>
              </div>
              <div className="card-surface p-5">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Role
                </span>
                <p className="mt-3 text-sm leading-6 text-white">
                  {project.role || "Full-stack development"}
                </p>
              </div>
              <div className="card-surface p-5">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Timeline
                </span>
                <p className="mt-3 text-sm leading-6 text-white">
                  {project.timeline || "Ongoing"}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {project.gallery.length > 0 ? (
        <section className="border-b border-line py-12 lg:py-16">
          <Reveal className="mx-auto mb-8 max-w-7xl px-5">
            <span className="eyebrow">Gallery</span>
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

