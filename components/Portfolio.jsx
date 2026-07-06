import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import luxeory from "../assets/images/luxeory.webp";
import visasphere from "../assets/images/visasphere.webp";
import lingobingo from "../assets/images/lingobingo.webp";
import Reveal from "./Reveal";

const projects = [
  {
    name: "Luxeory",
    tagline: "Hotel booking platform",
    image: luxeory,
    tags: ["React", "Node.js", "MongoDB", "Firebase", "JWT"],
    liveLink: "https://luxeory-96d49.web.app",
    github: "https://github.com/parvej-shah/luxeory-hotel-booking",
  },
  {
    name: "VisaSphere",
    tagline: "Visa application navigator",
    image: visasphere,
    tags: ["React", "Node.js", "MongoDB", "Firebase"],
    liveLink: "https://visasphere-72d2e.web.app/",
    github: "https://github.com/parvej-shah/VisaSphere",
  },
  {
    name: "Lingo Bingo",
    tagline: "Japanese language learning",
    image: lingobingo,
    tags: ["React", "Firebase", "Tailwind CSS"],
    liveLink: "https://lingo-bingo-7af0a.web.app/",
    github: "https://github.com/parvej-shah/Lingo-Bingo-Japanese-Language-Learning-",
  },
];

export default function Portfolio() {
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
          <p className="max-w-xs text-sm text-muted-foreground">
            Real products with real users — each one pairing thoughtful UX with
            production-grade engineering that holds up in the wild.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal
              key={p.name}
              as="article"
              delay={(i % 2) * 120}
              className="project-card card-surface reveal-scale group overflow-hidden p-3"
            >
              {/* inset media frame */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] border border-line/60">
                <Image
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover object-top transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3/90 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-50" />
                <div className="card-sheen" aria-hidden />
                <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/70 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur transition-colors duration-300 group-hover:border-brand/40 group-hover:text-brand">
                  {p.tagline}
                </span>
              </div>

              {/* content */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-brand">
                    {p.name}
                  </h3>
                  <div className="flex gap-2">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.name} repository`}
                      className="grid size-10 place-items-center rounded-full border border-line text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-ink-2 hover:text-white"
                    >
                      <SiGithub className="size-4" />
                    </a>
                    <a
                      href={p.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.name} live site`}
                      className="group/live grid size-10 place-items-center rounded-full bg-brand text-[#05140b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_8px_24px_-6px_rgba(0,230,118,0.5)]"
                    >
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
                    </a>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted-foreground transition-colors duration-300 hover:border-brand/40 hover:text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          {/* 4th cell: conversion card — completes the 2×2 grid */}
          <Reveal
            delay={120}
            className="project-card card-surface reveal-scale group relative flex flex-col items-start justify-between overflow-hidden p-8 sm:p-10"
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
            <a
              href="#contact"
              className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)]"
            >
              Start the Conversation
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
