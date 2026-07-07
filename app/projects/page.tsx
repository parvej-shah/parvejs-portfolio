import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getPublishedProjects } from "@/lib/data/public";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects | Parvej Shah",
  description:
    "Published case studies covering product strategy, engineering decisions, and measurable project outcomes.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main className="border-b border-line">
      <section className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="flex flex-col gap-6">
            <span className="eyebrow">Projects</span>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
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

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-5">
          {projects.length === 0 ? (
            <div className="card-surface p-10 text-center text-muted-foreground">
              No published projects yet.
            </div>
          ) : (
            projects.map((project, index) => {
              const heroImage = project.gallery[0] ?? null;

              return (
                <Reveal
                  key={project.id}
                  as="article"
                  delay={(index % 3) * 90}
                  className="project-card card-surface grid gap-6 overflow-hidden p-4 lg:grid-cols-[1.15fr_0.85fr]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-line/60 bg-ink-2">
                    {heroImage ? (
                      <Image
                        src={heroImage.url}
                        alt={heroImage.alt || project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="dot-grid flex h-full items-center justify-center bg-ink-2 text-6xl font-black text-white/10">
                        0{index + 1}
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3 via-transparent to-transparent opacity-80" />
                    <div className="card-sheen" aria-hidden />
                    <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/70 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                      {project.featured ? "Featured case study" : "Case study"}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between gap-6 p-2 sm:p-4">
                    <div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.techStack.slice(0, 5).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {project.title}
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                        {project.summary}
                      </p>
                    </div>

                    <div className="grid gap-4 border-y border-line py-5 text-sm sm:grid-cols-3">
                      <div>
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Client
                        </span>
                        <p className="mt-2 text-white">{project.client || "Independent build"}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Role
                        </span>
                        <p className="mt-2 text-white">{project.role || "Full-stack development"}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Timeline
                        </span>
                        <p className="mt-2 text-white">{project.timeline || "In progress"}</p>
                      </div>
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className={cn(
                        buttonVariants(),
                        "h-11 w-fit rounded-full bg-brand px-5 text-sm font-semibold text-[#05140b] hover:bg-brand-dark"
                      )}
                    >
                      Read case study
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </Reveal>
              );
            })
          )}

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

