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
          <p className="text-5xl font-extrabold tracking-tight text-foreground leading-[1.08] sm:text-6xl lg:text-7xl">
            Built to run in <span className="text-brand">production.</span>
          </p>
          <p className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg">
            From customer calls and payments to everyday operations, these products are built to
            stay reliable when your business depends on them.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
