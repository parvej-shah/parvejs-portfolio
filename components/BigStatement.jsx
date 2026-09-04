import Reveal from "./Reveal";

export default function BigStatement() {
  return (
    <section className="border-b border-line py-20 lg:py-28 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-brand/[0.025]"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <p className="text-5xl font-extrabold tracking-tight text-white leading-[1.08] sm:text-6xl lg:text-7xl">
            12+ production systems <span className="text-brand">shipped.</span>
          </p>
          <p className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg">
            Not demos. Not prototypes. Live systems with real users, real money, and real SLAs.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
