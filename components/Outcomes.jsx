import { Zap, TrendingUp, DollarSign, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

const outcomes = [
  {
    icon: Zap,
    metric: "24/7 Intake",
    badge: "Operational Leverage",
    title: "Automate Repetitive Work & Lead Capture",
    description:
      "Eliminate repetitive manual scheduling, call intake, and CRM data re-entry. Voice agents and automated back-office pipelines capture and qualify inbound leads around the clock.",
  },
  {
    icon: TrendingUp,
    metric: "3–6 Weeks",
    badge: "Speed to Market",
    title: "Launch Production MVPs Faster",
    description:
      "Avoid bloated agency timelines and junior handoffs. Move from validated architecture to a live, production-grade web application with real users in weeks — not quarters.",
  },
  {
    icon: DollarSign,
    metric: "Cost Efficient",
    badge: "Margin Expansion",
    title: "Lower LLM & Infrastructure Costs",
    description:
      "By replacing naive LLM calls with right-sized model pipelines and in-memory caching, we cut unnecessary call-minutes, token burn, and excessive cloud compute spend.",
  },
  {
    icon: ShieldCheck,
    metric: "High Concurrency",
    badge: "Enterprise Stability",
    title: "Engineered to Survive Real Load",
    description:
      "Systems that hold up under genuine customer traffic and peak surges. Clean relational schemas, robust indexing, and deterministic guardrails so your software stays reliable.",
  },
];

export default function Outcomes() {
  return (
    <section id="outcomes" className="border-b border-line py-20 lg:py-28 relative bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="max-w-3xl">
          <span className="eyebrow mb-4">Commercial Value</span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
            What we help companies achieve.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            We don&apos;t sell abstract code or technology for its own sake. Every system we architect is
            engineered to deliver measurable speed, lower operating costs, and revenue leverage.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={i * 80}
                className="card-surface group relative flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:border-brand/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl border border-line bg-ink text-brand transition-colors group-hover:border-brand/40">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-semibold text-brand/90 uppercase tracking-wide">
                      {item.badge}
                    </span>
                  </div>

                  <p className="mt-6 text-2xl font-black text-white tracking-tight">
                    {item.metric}
                  </p>

                  <h3 className="mt-2 text-base font-bold text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
