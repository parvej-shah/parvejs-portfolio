import Image from "next/image";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Reveal from "./Reveal";

// Pull a short, plain-text proof line from a project's markdown `results` field.
function proofLine(results) {
  if (!results) return null;
  const firstLine = results
    .split("\n")
    .map((line) => line.replace(/^[#>\-*\s]+/, "").trim())
    .find((line) => line.length > 0);
  if (!firstLine) return null;
  const sentence = firstLine.split(/(?<=[.!?])\s/)[0];
  return sentence.length > 120 ? `${sentence.slice(0, 117)}…` : sentence;
}

export default function Portfolio({ projects = [] }) {
  // Projects arrive ordered (featured → order → recency), so the first is the flagship.
  const [flagship, ...supportingProjects] = projects;

  return (
    <section id="portfolio" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-4">Selected Projects</span>
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Crafting scalable digital products that perform.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Real products with real users — each one pairing thoughtful UX with
            production-grade engineering that holds up in the wild.
          </p>
        </Reveal>

        {flagship ? (
          <Reveal
            as="article"
            className="project-card card-surface reveal-scale group mb-6 grid gap-6 overflow-hidden p-3 lg:grid-cols-[1.25fr_0.75fr]"
          >
            <div className="relative min-h-[18rem] overflow-hidden rounded-[1.1rem] border border-line/60 bg-ink-2 sm:min-h-[24rem] lg:min-h-[30rem]">
              {flagship.gallery?.[0] ? (
                <Image
                  src={flagship.gallery[0].url}
                  alt={flagship.gallery[0].alt || flagship.title}
                  fill
                  className="object-cover object-top transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              ) : (
                <div className="dot-grid flex h-full w-full flex-col items-center justify-center gap-3 bg-ink-2">
                  <span className="text-6xl font-black text-white/10">01</span>
                  <span className="text-sm font-medium text-white/25">{flagship.title}</span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3/90 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-50" />
              <div className="card-sheen" aria-hidden />
              <span className="absolute left-4 top-4 rounded-full border border-brand/30 bg-ink/75 px-3 py-1 text-xs font-semibold text-brand backdrop-blur">
                Flagship case study
              </span>
            </div>

            <div className="flex flex-col justify-center gap-6 p-2 sm:p-5">
              <div className="flex flex-wrap gap-2">
                {flagship.techStack.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {flagship.title}
                </h3>
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
                className="mt-1 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)]"
              >
                Read case study
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          {supportingProjects.map((project, i) => {
            const heroImage = project.gallery?.[0] ?? null;

            return (
              <Reveal
                key={project.slug}
                as="article"
                delay={(i % 2) * 120}
                className="project-card card-surface reveal-scale group overflow-hidden p-3"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] border border-line/60">
                  {heroImage ? (
                    <Image
                      src={heroImage.url}
                      alt={heroImage.alt || project.title}
                      fill
                      className="object-cover object-top transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="dot-grid flex h-full w-full flex-col items-center justify-center gap-2 bg-ink-2">
                      <span className="text-4xl font-black text-white/10">0{i + 2}</span>
                      <span className="text-xs font-medium text-white/25">{project.title}</span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3/90 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-50" />
                  <div className="card-sheen" aria-hidden />
                  <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full border border-line bg-ink/70 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur transition-colors duration-300 group-hover:border-brand/40 group-hover:text-brand">
                    {project.summary}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-brand">
                      {project.title}
                    </h3>
                    <Link
                      href={`/projects/${project.slug}`}
                      aria-label={`${project.title} case study`}
                      className="group/live grid size-10 place-items-center rounded-full bg-brand text-[#05140b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_8px_24px_-6px_rgba(0,230,118,0.5)]"
                    >
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
                    </Link>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
                  {proofLine(project.results) ? (
                    <p className="mt-3 flex items-start gap-2 text-sm font-medium text-white">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                      {proofLine(project.results)}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted-foreground transition-colors duration-300 hover:border-brand/40 hover:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}

          {/* Conversion card — always present, closes out the supporting grid.
              Spans both columns when the supporting count is even, so it never
              sits alone next to an empty cell. When spanning, its content lays
              out as a row to fill the extra width. */}
          {(() => {
            const spans = supportingProjects.length % 2 === 0;
            return (
              <Reveal
                delay={120}
                className={`project-card card-surface reveal-scale group relative overflow-hidden p-6 sm:p-8 lg:p-10 ${
                  spans ? "md:col-span-2" : ""
                }`}
              >
                <div
                  className="dot-grid absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-brand/15"
                  aria-hidden
                />
                <div
                  className={`relative flex h-full flex-col justify-between gap-8 ${
                    spans ? "lg:flex-row lg:items-end" : ""
                  }`}
                >
                  <div>
                    <span className="eyebrow mb-5">Next Project</span>
                    <h3 className="max-w-md text-2xl font-bold leading-snug text-white sm:text-3xl">
                      This spot is reserved for{" "}
                      <span className="text-brand">your product</span>.
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                      Have an idea that deserves to be built properly? Let&apos;s scope
                      it together — free, no strings attached.
                    </p>
                  </div>
                  <Link
                    href="/projects"
                    className="inline-flex h-12 w-fit shrink-0 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)]"
                  >
                    Browse All Projects
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Reveal>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
