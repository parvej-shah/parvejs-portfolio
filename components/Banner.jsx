"use client";

import { ArrowUpRight, Star } from "lucide-react";
import bannerImg from "../assets/images/banner-cutout.webp";
import SocialLinks from "./SocialLinks";
import ParticleField from "./ParticleField";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { resolveSectionImage } from "@/lib/section-rendering";

const defaultHero = {
  eyebrow: "Full Stack Web Developer",
  headlineLines: ["From idea", "to product", "to profit."],
  description:
    "I design and build full-stack web products that load fast, feel effortless, and turn visitors into customers — from the first wireframe to the final deploy.",
  primaryCta: { label: "Get a Free Quote", href: "#contact" },
  secondaryCta: { label: "View My Work", href: "#portfolio" },
  trustLabel: "Trusted by 12+ clients",
  trustStats: [
    { value: "20+", label: "projects shipped" },
    { value: "<24h", label: "response time" },
  ],
  portraitImage: "/assets/images/banner-cutout.webp",
  portraitAlt: "Parvej Shah — Full Stack Web Developer",
  experienceBadge: { value: "3+", label: "years experience" },
};

export default function HeroSection({ section = defaultHero, socialLinks = [] }) {
  const content = { ...defaultHero, ...section };
  const portraitSrc = resolveSectionImage(content.portraitImage);

  return (
    <section
      id="top"
      className="brand-glow relative w-full overflow-hidden border-b border-line"
      aria-label="Hero"
    >
      {/* Layered background: dotted grid + interactive particles + soft glows */}
      <div className="dot-grid absolute inset-0 opacity-50" aria-hidden />
      <ParticleField className="absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand/5 blur-[120px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 pt-12 pb-16 sm:gap-12 sm:pt-14 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20 lg:pb-24">
        {/* Left: headline */}
        <div className="max-w-2xl">
          <span className="hero-rise eyebrow mb-6" style={{ "--rise-delay": "0ms" }}>
            {content.eyebrow}
          </span>

          <h1 className="text-4xl font-extrabold leading-[0.95] tracking-tight min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
            {content.headlineLines.map((line, index) => (
              <span
                key={`${line}-${index}`}
                className={cn(
                  "hero-rise block",
                  index === 1 && "graffiti my-1 text-4xl min-[420px]:text-5xl sm:text-6xl lg:text-7xl"
                )}
                style={{ "--rise-delay": `${80 + index * 100}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            className="hero-rise mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-7 sm:text-base"
            style={{ "--rise-delay": "420ms" }}
          >
            {content.description}
          </p>

          <div
            className="hero-rise mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            style={{ "--rise-delay": "500ms" }}
          >
            <a
              href={content.primaryCta.href}
              className={cn(
                buttonVariants(),
                "group h-12 w-full rounded-full bg-brand px-6 text-sm font-semibold text-[#05140b] shadow-[0_0_0_0_rgba(0,230,118,0.5)] transition-shadow hover:bg-brand-dark hover:shadow-[0_8px_30px_-4px_rgba(0,230,118,0.5)] sm:w-auto [&_svg]:size-4"
              )}
            >
              {content.primaryCta.label}
              <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={content.secondaryCta.href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 w-full rounded-full border-line bg-transparent px-6 text-sm font-semibold text-white hover:border-brand/50 hover:bg-ink-3 sm:w-auto"
              )}
            >
              {content.secondaryCta.label}
            </a>
          </div>

          {/* Conversion trust strip */}
          <div
            className="hero-rise mt-8 flex flex-col items-start gap-4 min-[420px]:mt-9 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center min-[420px]:gap-x-8"
            style={{ "--rise-delay": "540ms" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-brand" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{content.trustLabel}</span>
            </div>
            <div className="hidden h-8 w-px bg-line sm:block" />
            {content.trustStats.map((t) => (
              <div key={t.label}>
                <p className="text-lg font-bold leading-none text-white">{t.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.label}</p>
              </div>
            ))}
          </div>

          <div
            className="hero-rise mt-8"
            style={{ "--rise-delay": "620ms" }}
          >
            <SocialLinks links={socialLinks} />
          </div>
        </div>

        {/* Right: portrait — hero-rise on outer (owns opacity), portrait-float on inner */}
        <div
          className="hero-rise relative mx-auto w-full max-w-sm sm:max-w-md"
          style={{ "--rise-delay": "220ms" }}
        >
         <div className="portrait-float relative">
          {/* soft breathing halo behind the frame — calm, no rotation */}
          <div className="portrait-glow pointer-events-none absolute -inset-6 rounded-[3rem]" aria-hidden />

          {/* the portrait card */}
          <div className="portrait-frame group relative overflow-hidden rounded-[2rem] border border-line-strong bg-gradient-to-b from-[#1a1e1b] via-ink-2 to-ink">
            {/* backdrop behind the transparent cutout: dot texture + green rim light behind head/shoulders */}
            <div className="dot-grid absolute inset-0 opacity-50" aria-hidden />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_32%,rgba(0,230,118,0.24),transparent_70%)]"
              aria-hidden
            />

            {/* Plain img so height comes from the image's own aspect ratio —
                no dependency on parent height, no fill/absolute quirks. */}
            <img
              src={typeof portraitSrc === "string" ? portraitSrc : portraitSrc.src}
              alt={content.portraitAlt}
              width={typeof portraitSrc === "string" ? bannerImg.width : portraitSrc.width}
              height={typeof portraitSrc === "string" ? bannerImg.height : portraitSrc.height}
              className="relative block h-auto w-full select-none object-cover brightness-[.94] [mask-image:linear-gradient(to_bottom,black_68%,transparent_98%)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              draggable={false}
            />

            {/* diagonal sheen that sweeps across on hover */}
            <div className="portrait-sheen pointer-events-none absolute inset-0" aria-hidden />

            {/* inner ring, brightens to brand on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/5 transition-colors duration-500 group-hover:ring-brand/25" />

            {/* experience chip — drifts up gently on hover */}
            <div className="absolute right-3 top-3 rounded-2xl border border-line bg-ink/85 px-3 py-2 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:right-4 sm:top-4 sm:px-4 sm:py-2.5">
              <p className="text-xl font-extrabold leading-none text-brand">{content.experienceBadge.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{content.experienceBadge.label}</p>
            </div>

            {/* availability bar */}
            <div className="absolute inset-x-3 bottom-3 flex flex-col items-start gap-2 rounded-2xl border border-line bg-ink/85 px-4 py-3 transition-transform duration-500 ease-out group-hover:translate-y-1 min-[420px]:inset-x-4 min-[420px]:bottom-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Available for work</p>
                <p className="text-xs text-muted-foreground">Dhaka, Bangladesh · Remote</p>
              </div>
              <span className="relative flex size-3">
                <span className="soft-pulse absolute inline-flex h-full w-full rounded-full bg-brand" />
                <span className="relative inline-flex size-3 rounded-full bg-brand" />
              </span>
            </div>
          </div>
         </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="hero-rise pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        style={{ "--rise-delay": "800ms" }}
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-line p-1">
          <span className="float-y size-1.5 rounded-full bg-brand" />
        </span>
      </div>
    </section>
  );
}
