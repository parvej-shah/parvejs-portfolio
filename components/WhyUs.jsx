import { Shield, Sparkles, UserCheck, Target } from "lucide-react";
import Reveal from "./Reveal";

const advantages = [
  {
    icon: Shield,
    tag: "Reliable by Design",
    title: "Ready for the Work Ahead",
    description:
      "Deterministic guardrails, multi-stage claims gates, in-memory caching. Built to handle real edge cases under real customer traffic.",
  },
  {
    icon: Sparkles,
    tag: "Commercial Leverage",
    title: "Business-First Architecture",
    description:
      "We never force AI where a SQL query performs 100× faster. Every architectural choice is justified by business leverage and operating cost.",
  },
  {
    icon: UserCheck,
    tag: "Direct Senior Partnership",
    title: "A Senior Lead Who Stays on Your Project",
    description:
      "Parvej leads every engagement end to end, backed by a small senior team. You talk to the engineer who owns discovery, code, and deployment — no junior handoffs, no project managers playing telephone.",
  },
  {
    icon: Target,
    tag: "Quantifiable Impact",
    title: "Measured in Outcomes, Not Features",
    description:
      "We measure by hard numbers — intake times cut, latency reduced, leads stopped from dropping — not by features shipped.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="border-b border-line py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="max-w-3xl">
          <span className="eyebrow mb-4">The Difference</span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
            Built for the moment your product goes live.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Your software should keep working as customers arrive, workflows grow, and the business changes.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {advantages.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="card-surface group relative flex flex-col justify-between p-7 sm:p-9 transition-all duration-300 hover:border-brand/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl border border-line bg-ink-2 text-brand transition-colors group-hover:border-brand/40">
                      <Icon className="size-6" />
                    </span>
                    <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-white tracking-tight sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
