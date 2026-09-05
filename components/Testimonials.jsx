"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote, Star, Play, CheckCircle2, Subtitles } from "lucide-react";
import Reveal from "./Reveal";

const defaultSection = {
  eyebrow: "Client Proof & Impact",
  heading: "Measurable outcomes from the founders we've built with.",
  items: [
    {
      metric: "100% On-Time · Over-Delivers on Scope",
      quote:
        "Parvej doesn't just build websites — he genuinely thinks about cost-efficiency from the client's perspective. Two things stand out: he always over-delivers beyond what he commits to, and he delivers ahead of schedule. For non-technical founders looking for someone you can 100% trust with your platform, I highly recommend Parvej.",
      name: "Abdul Aziz",
      role: "Founder & Head Instructor, MathPro Academy (11+ Years in EdTech)",
      initials: "AA",
      avatarUrl: "",
      rating: 5,
      href: "https://www.mathpro.academy",
    },
    {
      metric: "Technical Capability & Responsibility · CPRBD Website",
      quote:
        "I had the opportunity to work with Parvej and the website team during the development of the CPRBD website. Parvej was professional, responsive, and committed throughout the process. He and the team were receptive to feedback, handled website requirements effectively, and worked collaboratively to turn our ideas into a functional and professional web presence. What I particularly appreciated was their willingness to understand the programme’s needs and make improvements accordingly. Parvej was reliable in communication and contributed positively to the overall development process. I would gladly recommend him to anyone looking for someone who combines technical capability with a strong sense of teamwork and responsibility.",
      name: "Md. Seam Ali Ahammod Pramaniq",
      role: "Project Assistant at CPRBD, University of Dhaka",
      initials: "SA",
      avatarUrl: "/testimonials/seam-ali.jpg",
      rating: 5,
      href: "https://www.linkedin.com/in/md-seam-ali-ahammod-pramaniq/",
    },
  ],
  clients: ["CPRBD", "Minions.AI", "SellerVai", "MathPro Academy", "Codervai", "University of Dhaka", "GenMorphics AI", "Leadswave"],
};

export default function Testimonials({ section = defaultSection }) {
  const content = { ...defaultSection, ...section };
  const track = [...content.clients, ...content.clients];
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="testimonials" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <span className="eyebrow mb-5">{content.eyebrow}</span>
          <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {content.heading}
          </h2>
        </Reveal>

        {/* 1. Featured Video Case Study (Abdul Aziz — MathPro Academy) */}
        <div className="mt-12">
          <Reveal delay={100} as="div">
            <div className="card-surface group relative overflow-hidden rounded-3xl border border-line p-6 sm:p-8 transition-all duration-300 hover:border-brand/30">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                {/* Video Player (7 cols) */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-2 lg:col-span-7">
                  {isPlaying ? (
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/MTt38ImF6ZU?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=en"
                      title="Client Review — MathPro Academy (Founder Abdul Aziz)"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 size-full border-0"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      className="group/btn relative size-full text-left"
                      aria-label="Play video review from MathPro Academy Founder Abdul Aziz"
                    >
                      <Image
                        src="/projects/mathpro-review-thumb.jpg"
                        alt="Client Review Thumbnail — MathPro Academy"
                        fill
                        sizes="(max-width: 1024px) 100vw, 700px"
                        className="object-cover transition-transform duration-700 ease-out group-hover/btn:scale-105"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

                      {/* Subtitles pill badge */}
                      <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                        <Subtitles className="size-3.5 text-brand" />
                        <span>English Subtitles (CC)</span>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex size-14 items-center justify-center rounded-full bg-brand text-ink shadow-[0_0_30px_rgba(0,230,118,0.4)] transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white">
                          <Play className="ml-0.5 size-6 fill-current" />
                        </div>
                      </div>

                      {/* Video Duration / Details */}
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                        <span className="font-semibold">Watch Founder Review</span>
                        <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[11px] text-white">2:07</span>
                      </div>
                    </button>
                  )}
                </div>

                {/* Right Side: Full Founder Review (5 cols) */}
                <div className="flex flex-col justify-between lg:col-span-5 lg:py-1">
                  <div>
                    <div className="flex items-center gap-1 text-brand">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-4 fill-brand" />
                      ))}
                    </div>

                    {/* Full Complete Quote from Abdul Aziz */}
                    <blockquote className="mt-4 text-base leading-relaxed text-white/95 sm:text-[17px] sm:leading-relaxed">
                      &ldquo;Parvej doesn&apos;t just build websites — he genuinely thinks about cost-efficiency from the client&apos;s perspective. Two things stand out: <span className="font-semibold text-brand">he always over-delivers</span> beyond what he commits to, and <span className="font-semibold text-brand">he delivers ahead of schedule</span>. For non-technical founders looking for someone you can 100% trust with your platform, I highly recommend Parvej.&rdquo;
                    </blockquote>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-5">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                        AA
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">Abdul Aziz</p>
                        <p className="text-xs text-muted-foreground">Founder & Head Instructor, MathPro Academy</p>
                      </div>
                    </div>

                    <a
                      href="https://www.mathpro.academy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 whitespace-nowrap text-xs font-semibold text-brand hover:underline"
                    >
                      Visit Platform ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 2. Full Written Recommendation (Md. Seam Ali Ahammod Pramaniq — CPRBD, University of Dhaka) */}
        <div className="mt-6">
          <Reveal delay={200} as="article">
            <div className="card-surface group relative rounded-3xl border border-line p-6 sm:p-8 transition-all duration-300 hover:border-brand/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-brand" />
                  ))}
                </div>
                <a
                  href="https://www.linkedin.com/in/md-seam-ali-ahammod-pramaniq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 whitespace-nowrap text-xs font-semibold text-brand hover:underline"
                >
                  LinkedIn Review ↗
                </a>
              </div>

              {/* Full Complete Quote from Md. Seam Ali */}
              <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-white/90 sm:text-base sm:leading-relaxed">
                <p>
                  &ldquo;I had the opportunity to work with Parvej and the website team during the development of the CPRBD website. Parvej was professional, responsive, and committed throughout the process. He and the team were receptive to feedback, handled website requirements effectively, and worked collaboratively to turn our ideas into a functional and professional web presence.&rdquo;
                </p>
                <p>
                  &ldquo;What I particularly appreciated was their willingness to understand the programme’s needs and make improvements accordingly. Parvej was reliable in communication and contributed positively to the overall development process. <span className="font-medium text-brand">I would gladly recommend him to anyone looking for someone who combines technical capability with a strong sense of teamwork and responsibility.</span>&rdquo;
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-5">
                <div className="flex items-center gap-3.5">
                  <Image
                    src="/testimonials/seam-ali.jpg"
                    alt="Md. Seam Ali Ahammod Pramaniq"
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover ring-2 ring-brand/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white sm:text-base">Md. Seam Ali Ahammod Pramaniq</p>
                    <p className="text-xs text-muted-foreground">Project Assistant at CPRBD, University of Dhaka</p>
                  </div>
                </div>

                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Data & Policy Research · Web Presence
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* logo marquee */}
      <div aria-hidden="true" className="relative mt-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-24" />
        <div className="flex w-max animate-marquee items-center gap-10 px-6 sm:gap-16 sm:px-8">
          {track.map((c, i) => (
            <span
              key={i}
              className="text-lg font-bold uppercase tracking-wide text-white/45 transition-colors hover:text-white/75 sm:text-xl"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
