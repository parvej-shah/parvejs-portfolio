import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Reveal from "./Reveal";

export default function Portfolio({ projects = [] }) {
  const featuredProjects = projects;

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

        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, i) => {
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
                    <div className="dot-grid flex h-full w-full items-center justify-center bg-ink-2 text-4xl font-black text-white/10">
                      0{i + 1}
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

          {/* 4th cell: conversion card — completes the 2×2 grid */}
          <Reveal
            delay={120}
            className="project-card card-surface reveal-scale group relative flex flex-col items-start justify-between overflow-hidden p-6 sm:p-8 lg:p-10"
          >
            <div
              className="dot-grid absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-brand/15"
              aria-hidden
            />
            <div className="relative">
              <span className="eyebrow mb-5">Next Project</span>
              <h3 className="max-w-sm text-2xl font-bold leading-snug text-white sm:text-3xl">
                This spot is reserved for{" "}
                <span className="text-brand">your product</span>.
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Have an idea that deserves to be built properly? Let&apos;s scope
                it together — free, no strings attached.
              </p>
            </div>
            <Link
              href="/projects"
              className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)]"
            >
              Browse All Projects
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
