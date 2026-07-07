import Reveal from "./Reveal";
import { resolveProcessIcon } from "@/lib/section-rendering";

const defaultSection = {
  eyebrow: "How I Work",
  heading: "A clear path from first idea to launched product.",
  description:
    "A focused process keeps the work calm, fast, and measurable: first we clarify what matters, then we design, build, and launch without losing sight of the business goal.",
  steps: [
    {
      icon: "Search",
      title: "Discover",
      description: "Define the audience, product goal, must-have flows, and the smallest scope worth launching.",
      deliverable: "Scope & roadmap",
    },
    {
      icon: "LayoutGrid",
      title: "Design",
      description: "Shape the experience with clear content hierarchy, conversion paths, and responsive interface details.",
      deliverable: "UI & prototype",
    },
    {
      icon: "Code2",
      title: "Build",
      description: "Develop the product with maintainable architecture, fast pages, and practical admin workflows.",
      deliverable: "Production code",
    },
    {
      icon: "Rocket",
      title: "Launch",
      description: "Ship with QA, deployment support, performance checks, and a clear plan for the next iteration.",
      deliverable: "Live product",
    },
  ],
};

export default function Process({ section = defaultSection }) {
  const content = { ...defaultSection, ...section };

  return (
    <section id="process" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="eyebrow mb-4">{content.eyebrow}</span>
            <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {content.heading}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground lg:ml-auto sm:text-base">
            {content.description}
          </p>
        </Reveal>

        {/* Steps read as a connected journey (Discover → Launch), not four parallel
            boxes: a timeline spine links the numbered nodes, and a brand accent bar
            on each card's top edge fades from step 1 → 4 to signal forward motion. */}
        <div className="relative mt-14">
          {/* horizontal timeline spine — desktop only, sits behind the step nodes */}
          <div
            className="pointer-events-none absolute inset-x-[12%] top-11 hidden h-px bg-gradient-to-r from-brand/40 via-line to-line xl:block"
            aria-hidden
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.steps.map(({ icon, title, description, deliverable }, index) => {
              const Icon = resolveProcessIcon(icon);
              const isLast = index === content.steps.length - 1;

              return (
                <Reveal
                  key={`${title}-${index}`}
                  delay={index * 80}
                  className="card-surface group relative flex flex-col overflow-hidden p-6"
                >
                  {/* progressive brand accent: brightest on step 1, fading toward the last */}
                  <span
                    className="absolute inset-x-0 top-0 h-px bg-brand transition-opacity duration-500 group-hover:opacity-100"
                    style={{ opacity: 0.55 - index * 0.12 }}
                    aria-hidden
                  />
                  <div className="dot-grid pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-40" />

                  <div className="relative flex flex-1 flex-col">
                    <div className="flex items-center justify-between gap-4">
                      <span className="relative grid size-12 place-items-center rounded-2xl border border-line bg-ink-2 text-brand transition-all duration-300 group-hover:border-brand/50 group-hover:shadow-[0_0_0_4px_rgba(0,230,118,0.08)]">
                        <Icon className="size-5" />
                      </span>
                      <span className="text-2xl font-black leading-none text-white/[0.08] transition-colors duration-300 group-hover:text-brand/20">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-6 flex items-center gap-2 text-xl font-semibold text-white">
                      {title}
                      {!isLast && (
                        <span className="text-brand/30 transition-colors duration-300 group-hover:text-brand/60" aria-hidden>
                          →
                        </span>
                      )}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>

                    {deliverable && (
                      <div className="mt-6 flex items-center gap-2 border-t border-line pt-4">
                        <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                          Deliverable
                        </span>
                        <span className="ml-auto rounded-full border border-brand/20 bg-brand/[0.07] px-2.5 py-1 text-xs font-medium text-brand">
                          {deliverable}
                        </span>
                      </div>
                    )}
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
