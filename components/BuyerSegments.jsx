"use client";

import { ArrowUpRight, Bot, Rocket, Cpu } from "lucide-react";
import Reveal from "./Reveal";

const segments = [
  {
    id: "ai-automation",
    icon: Bot,
    track: "AI Automation",
    title: "Voice Agents & Workflow Automation",
    description:
      "Deploy 24/7 AI voice receptionists and n8n pipelines that qualify leads, book appointments, and sync your CRM — with zero added headcount.",
    outcome: "24/7 lead capture. Zero manual intake overhead.",
    cta: "See AI work",
    href: "#portfolio",
    categoryParam: "AI Automation & Voice Agents",
  },
  {
    id: "saas-product",
    icon: Rocket,
    track: "SaaS Product",
    title: "SaaS & Web Product Engineering",
    description:
      "Turn your concept into a launch-ready platform. Full-stack Next.js 16 + TypeScript, clean SQL schemas, payment flows, and high-conversion UI.",
    outcome: "Production MVP shipped in 3–6 weeks.",
    cta: "See product work",
    href: "#portfolio",
    categoryParam: "SaaS / Web Product",
  },
  {
    id: "scale-optimize",
    icon: Cpu,
    track: "Scale & Integration",
    title: "Existing System Scale & AI Integration",
    description:
      "Latency bottlenecks, database re-architecture, custom LLM pipelines, and peak-load stability — on codebases that already have real users.",
    outcome: "Sub-50ms cache hits. Zero-downtime rewrites.",
    cta: "Fix my system",
    href: "#contact",
    categoryParam: "Existing System & Scaling",
  },
];

export default function BuyerSegments() {
  const handleSelectTrack = (categoryParam) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("select-project-category", {
        detail: { category: categoryParam },
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <section id="solutions" className="border-b border-line py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="max-w-2xl">
          <span className="eyebrow mb-4">What Are You Trying to Build?</span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
            Pick your outcome. We engineer the rest.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((seg, i) => {
            const Icon = seg.icon;
            return (
              <Reveal
                key={seg.id}
                delay={i * 100}
                className="card-surface group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-brand/40"
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-brand/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                  aria-hidden
                />

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl border border-line bg-ink-2 text-brand transition-colors group-hover:border-brand/40">
                      <Icon className="size-6" />
                    </span>
                    <span className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs font-medium text-muted-foreground">
                      {seg.track}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white tracking-tight">
                    {seg.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {seg.description}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-brand">
                    {seg.outcome}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-line/60">
                  <a
                    href={seg.href}
                    onClick={() => handleSelectTrack(seg.categoryParam)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-all group-hover:text-white"
                  >
                    <span>{seg.cta}</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
