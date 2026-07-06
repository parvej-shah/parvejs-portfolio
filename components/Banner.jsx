"use client";

import { ArrowUpRight, Star } from "lucide-react";
import bannerImg from "../assets/images/banner-cutout.webp";
import SocialLinks from "./SocialLinks";
import ParticleField from "./ParticleField";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const trust = [
  { value: "20+", label: "projects shipped" },
  { value: "<24h", label: "response time" },
];

export default function HeroSection() {
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

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pt-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20 lg:pb-24">
        {/* Left: headline */}
        <div className="max-w-2xl">
          <span className="hero-rise eyebrow mb-6" style={{ "--rise-delay": "0ms" }}>
            Full Stack Web Developer
          </span>

          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="hero-rise block" style={{ "--rise-delay": "80ms" }}>
              From idea
            </span>
            <span
              className="graffiti hero-rise my-1 text-5xl sm:text-6xl lg:text-7xl"
              style={{ "--rise-delay": "180ms" }}
            >
              to product
            </span>
            <span className="hero-rise block" style={{ "--rise-delay": "280ms" }}>
              to profit.
            </span>
          </h1>

          <p
            className="hero-rise mt-7 max-w-md text-base leading-relaxed text-muted-foreground"
            style={{ "--rise-delay": "380ms" }}
          >
            I design and build full-stack web products that load fast, feel
            effortless, and turn visitors into customers — from the first
            wireframe to the final deploy.
          </p>

          <div
            className="hero-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ "--rise-delay": "460ms" }}
          >
            <a
              href="#contact"
              className={cn(
                buttonVariants(),
                "group h-12 rounded-full bg-brand px-6 text-sm font-semibold text-[#05140b] shadow-[0_0_0_0_rgba(0,230,118,0.5)] transition-shadow hover:bg-brand-dark hover:shadow-[0_8px_30px_-4px_rgba(0,230,118,0.5)] [&_svg]:size-4"
              )}
            >
              Get a Free Quote
              <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#portfolio"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 rounded-full border-line bg-transparent px-6 text-sm font-semibold text-white hover:border-brand/50 hover:bg-ink-3"
              )}
            >
              View My Work
            </a>
          </div>

          {/* Conversion trust strip */}
          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
            style={{ "--rise-delay": "540ms" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-brand" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">Trusted by 12+ clients</span>
            </div>
            <div className="hidden h-8 w-px bg-line sm:block" />
            {trust.map((t) => (
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
            <SocialLinks />
          </div>
        </div>

        {/* Right: portrait — hero-rise on outer (owns opacity), portrait-float on inner */}
        <div
          className="hero-rise relative mx-auto w-full max-w-md"
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
              src={bannerImg.src}
              alt="Parvej Shah — Full Stack Web Developer"
              width={bannerImg.width}
              height={bannerImg.height}
              className="relative block h-auto w-full select-none object-cover brightness-[.94] [mask-image:linear-gradient(to_bottom,black_68%,transparent_98%)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              draggable={false}
            />

            {/* diagonal sheen that sweeps across on hover */}
            <div className="portrait-sheen pointer-events-none absolute inset-0" aria-hidden />

            {/* inner ring, brightens to brand on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/5 transition-colors duration-500 group-hover:ring-brand/25" />

            {/* experience chip — drifts up gently on hover */}
            <div className="absolute right-4 top-4 rounded-2xl border border-line bg-ink/85 px-4 py-2.5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
              <p className="text-xl font-extrabold leading-none text-brand">3+</p>
              <p className="mt-1 text-[11px] text-muted-foreground">years experience</p>
            </div>

            {/* availability bar */}
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-line bg-ink/85 px-4 py-3 transition-transform duration-500 ease-out group-hover:translate-y-1">
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
