import { Code2, Palette, Gauge, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { resolveServiceIcon } from "@/lib/section-rendering";

const defaultSection = {
  eyebrow: "My Core Expertise",
  heading: "From high-concurrency backends to polished interfaces — engineered without bloat.",
  description:
    "Every build is measured against three things: latency, reliability, and room to grow. No bloat, no shortcuts — just work that lasts.",
  tagline: "Core Services Offered",
  items: [
    {
      icon: "Code2",
      title: "Full Stack Systems & Web Apps",
      desc: "End-to-end web applications and high-concurrency backends — clean architecture, type-safe APIs, and code that stays maintainable long after launch.",
    },
    {
      icon: "Sparkles",
      title: "Voice AI & LLM Infrastructure",
      desc: "Sub-second WebRTC voice pipelines, deterministic multi-agent state machines, and low-latency RAG systems tailored to business workflows.",
    },
    {
      icon: "Gauge",
      title: "Performance & Data Architecture",
      desc: "Zero-CLS rendering, sub-15ms vector search, Redis caching, and resilient database design — tuned until every interaction feels instant.",
    },
  ],
};

export default function Services({ section = defaultSection }) {
  const content = { ...defaultSection, ...section };

  return (
    <section id="services" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          {/* Left intro */}
          <Reveal>
            <span className="eyebrow mb-5">{content.eyebrow}</span>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {content.heading}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{content.description}</p>
            <div className="graffiti mt-8 text-3xl sm:text-4xl">{content.tagline}</div>
          </Reveal>

          {/* Right cards */}
          <div className="grid gap-4 sm:grid-cols-1">
            {content.items.map(({ icon, title, desc }, i) => {
              const Icon = resolveServiceIcon(icon);
              return (
                <Reveal
                  key={title}
                  delay={i * 100}
                  className="card-surface group flex items-start gap-4 p-5 sm:gap-5 sm:p-7 max-[420px]:flex-col"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-ink-2 text-brand transition-colors group-hover:border-brand/40">
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-white">{title}</h3>
                      <ArrowUpRight className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:text-brand" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
