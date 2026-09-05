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
  if (sentence.length <= 130) return sentence;
  const truncated = sentence.slice(0, 127);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 80 ? `${truncated.slice(0, lastSpace)}…` : `${truncated}…`;
}

// Clip a plain-text summary at a word boundary for supporting cards.
function summaryClip(text, max = 120) {
  if (!text || text.length <= max) return text;
  const truncated = text.slice(0, max);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 70 ? `${truncated.slice(0, lastSpace)}…` : `${truncated}…`;
}

// Clean verbose tech tags by stripping parentheticals and extra descriptors.
function cleanTechTag(tech) {
  if (!tech) return "";
  const cleaned = tech
    .replace(/\s*\(.*?\)/g, "")
    .replace(/Workflow Automation/i, "")
    .replace(/Rich-Text Editor/i, "")
    .replace(/& Google Calendar/i, "")
    .split("/")[0]
    .trim();
  return cleaned || tech;
}

/**
 * @param {{ projects?: Array<any> }} props
 */
export default function Portfolio({ projects = [] }) {
  // Projects arrive ordered (featured → order → recency), so the first is the flagship.
  const [flagship, ...supportingProjects] = projects;

  return (
    <section id="portfolio" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-4">Case Studies</span>
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-white">
              Built for real businesses. Measured in real outcomes.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            No toy projects or weekend prototypes. Systems deployed in production holding up under real users,
            real money, and measurable efficiency gains.
          </p>
        </Reveal>

        {flagship ? (
          <Reveal
            as="article"
            className="project-card card-surface reveal-scale group mb-8 grid gap-8 overflow-hidden p-4 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
          >
            <div className="relative min-h-[18rem] overflow-hidden rounded-[1.1rem] border border-line/60 bg-ink-2 sm:min-h-[22rem] lg:min-h-[26rem]">
              {flagship.gallery?.[0] ? (
                <Image
                  src={flagship.gallery[0].url}
                  alt={flagship.gallery[0].alt || flagship.title}
                  fill
                  quality={100}
                  unoptimized
                  sizes="100vw"
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
                Flagship Case Study
              </span>
            </div>

            <div className="flex flex-col justify-between gap-5 py-2">
              <div className="flex flex-wrap gap-2">
                {flagship.techStack?.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line/70 bg-ink-2 px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {cleanTechTag(tech)}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {flagship.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {flagship.summary}
                </p>
              </div>

              {proofLine(flagship.results) ? (
                <div className="flex items-center gap-2.5 rounded-xl border border-brand/20 bg-brand/5 px-3.5 py-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-brand" />
                  <span className="line-clamp-1 text-xs font-medium text-white/95 sm:text-sm">{proofLine(flagship.results)}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between border-t border-line/60 pt-4 text-xs">
                <span className="text-muted-foreground">Client: <strong className="font-semibold text-white">{flagship.client || "Minions.AI"}</strong></span>
                <span className="text-muted-foreground">Timeline: <strong className="font-semibold text-white">{flagship.timeline || "2025 – Present"}</strong></span>
              </div>

              <Link
                href={`/projects/${flagship.slug}`}
                className="mt-1 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-brand px-5 text-xs font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)]"
              >
                Read Case Study
                <ArrowUpRight className="size-3.5" />
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
                className="project-card card-surface reveal-scale group flex flex-col justify-between overflow-hidden p-3"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] border border-line/60">
                  {heroImage ? (
                    <Image
                      src={heroImage.url}
                      alt={heroImage.alt || project.title}
                      fill
                      quality={100}
                      unoptimized
                      sizes="100vw"
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
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-brand">
                        {project.title}
                      </h3>
                      <Link
                        href={`/projects/${project.slug}`}
                        aria-label={`${project.title} case study`}
                        className="group/live grid size-9 shrink-0 place-items-center rounded-full bg-brand text-[#05140b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_8px_24px_-6px_rgba(0,230,118,0.5)]"
                      >
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
                      </Link>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {project.summary}
                    </p>

                    {proofLine(project.results) ? (
                      <div className="mt-3.5 flex items-center gap-2 text-xs font-medium text-white/90">
                        <CheckCircle2 className="size-3.5 shrink-0 text-brand" />
                        <span className="line-clamp-1">{proofLine(project.results)}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-line/60 pt-4">
                    {project.techStack?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line bg-ink-2 px-2.5 py-0.5 text-xs text-muted-foreground transition-colors duration-300 hover:border-brand/40 hover:text-white"
                      >
                        {cleanTechTag(tech)}
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
                    Browse All Case Studies
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
