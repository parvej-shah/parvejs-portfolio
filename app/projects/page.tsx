import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getPublishedProjects } from "@/lib/data/public";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const projectsTitle = "Projects & Case Studies | Parvej Shah";
const projectsDescription =
  "Real products, not concept decks — case studies covering the problem, the build approach, and the measurable outcomes behind each project.";

export const metadata: Metadata = {
  title: projectsTitle,
  description: projectsDescription,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: "/projects",
    title: projectsTitle,
    description: projectsDescription,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: projectsTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: projectsTitle,
    description: projectsDescription,
    images: ["/og.jpg"],
  },
};

// Pull a short, plain-text proof line from a project's markdown `results` field.
function proofLine(results: string | null): string | null {
  if (!results) return null;
  const firstLine = results
    .split("\n")
    .map((line) => line.replace(/^[#>\-*\s]+/, "").trim())
    .find((line) => line.length > 0);
  if (!firstLine) return null;
  const sentence = firstLine.split(/(?<=[.!?])\s/)[0];
  return sentence.length > 120 ? `${sentence.slice(0, 117)}…` : sentence;
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  // Projects arrive ordered (featured → order → recency), so the first is the flagship.
  const [flagship, ...rest] = projects;

  return (
    <main className="border-b border-line">
      <section className="border-b border-line py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Projects</span>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Case studies that show how strategy and engineering meet.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Every project here shipped as a real product, not a concept deck. The focus is
                  on the problem, the build approach, and the outcomes that mattered.
                </p>
              </div>
              <div className="rounded-3xl border border-line bg-ink-2/70 px-5 py-4 text-sm text-muted-foreground backdrop-blur">
                {projects.length} published {projects.length === 1 ? "project" : "projects"}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 pt-12 lg:pb-28 lg:pt-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5">
          {projects.length === 0 ? (
            <div className="card-surface p-10 text-center text-muted-foreground">
              No published projects yet.
            </div>
          ) : null}

          {flagship ? (
            <Reveal
              as="article"
              className="project-card card-surface grid gap-6 overflow-hidden p-4 lg:grid-cols-[1.25fr_0.75fr]"
            >
              <div className="relative min-h-[18rem] overflow-hidden rounded-[1.4rem] border border-line/60 bg-ink-2 sm:min-h-[24rem] lg:min-h-[30rem]">
                {flagship.gallery[0] ? (
                  <Image
                    src={flagship.gallery[0].url}
                    alt={flagship.gallery[0].alt || flagship.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 62vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    priority
                  />
                ) : (
                  <div className="dot-grid flex h-full flex-col items-center justify-center gap-3 bg-ink-2">
                    <span className="text-7xl font-black text-white/10">01</span>
                    <span className="text-sm font-medium text-white/25">{flagship.title}</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3 via-transparent to-transparent opacity-80" />
                <div className="card-sheen" aria-hidden />
                <span className="absolute left-4 top-4 rounded-full border border-brand/30 bg-ink/75 px-3 py-1 text-xs font-semibold text-brand backdrop-blur">
                  Flagship case study
                </span>
              </div>

              <div className="flex flex-col justify-center gap-6 p-2 sm:p-5">
                <div className="flex flex-wrap gap-2">
                  {flagship.techStack.slice(0, 6).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {flagship.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    {flagship.summary}
                  </p>
                </div>

                {proofLine(flagship.results) ? (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span className="text-sm font-medium text-white">{proofLine(flagship.results)}</span>
                  </div>
                ) : null}

                <dl className="border-t border-line pt-2 text-sm">
                  <div className="flex items-baseline justify-between gap-4 border-b border-line/60 py-3">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Client</dt>
                    <dd className="text-right font-medium text-white">
                      {flagship.client || "Independent build"}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line/60 py-3">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Role</dt>
                    <dd className="text-right font-medium text-white">
                      {flagship.role || "Full-stack development"}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Timeline</dt>
                    <dd className="text-right font-medium text-white">
                      {flagship.timeline || "In progress"}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/projects/${flagship.slug}`}
                  className={cn(
                    buttonVariants(),
                    "mt-1 h-11 w-fit rounded-full bg-brand px-5 text-sm font-semibold text-[#05140b] hover:bg-brand-dark"
                  )}
                >
                  Read case study
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          ) : null}

          {rest.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {rest.map((project, index) => {
                const heroImage = project.gallery[0] ?? null;

                return (
                  <Reveal
                    key={project.id}
                    as="article"
                    delay={(index % 2) * 90}
                    className="project-card card-surface flex flex-col overflow-hidden p-4"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-line/60 bg-ink-2">
                      {heroImage ? (
                        <Image
                          src={heroImage.url}
                          alt={heroImage.alt || project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="dot-grid flex h-full flex-col items-center justify-center gap-2 bg-ink-2">
                          <span className="text-5xl font-black text-white/10">0{index + 2}</span>
                          <span className="text-xs font-medium text-white/25">{project.title}</span>
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3 via-transparent to-transparent opacity-80" />
                      <div className="card-sheen" aria-hidden />
                      <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/70 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                        Case study
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-5 p-2 pt-5 sm:p-4">
                      <div>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {project.techStack.slice(0, 4).map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted-foreground"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                          {project.title}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {project.summary}
                        </p>
                        {proofLine(project.results) ? (
                          <p className="mt-3 flex items-start gap-2 text-sm font-medium text-white">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                            {proofLine(project.results)}
                          </p>
                        ) : null}
                      </div>

                      <div className="border-t border-line pt-5">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-brand"
                        >
                          Read case study
                          <ArrowUpRight className="size-4 text-brand" />
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ) : null}

          <Reveal className="card-surface brand-glow relative overflow-hidden p-8 sm:p-10">
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="eyebrow mb-4">Have a product to build?</span>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  The next case study can start with your roadmap.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  If you need a product partner who can shape the UX and ship the implementation,
                  let&apos;s talk scope, constraints, and timing.
                </p>
              </div>
              <a
                href="/#contact"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 rounded-full border-line bg-transparent px-5 text-sm font-semibold text-white hover:border-brand/50 hover:bg-ink-3"
                )}
              >
                Start a conversation
                <ArrowRight className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

