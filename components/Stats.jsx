import Reveal from "./Reveal";

const stats = [
  { value: "3", suffix: "+", label: "Years of hands-on full-stack development experience" },
  { value: "20", suffix: "+", label: "Products & websites designed, built, and shipped" },
  { value: "10", suffix: "+", label: "Technologies mastered across the modern stack" },
  { value: "100", suffix: "%", label: "On-time delivery — and clients who come back" },
];

export default function Stats() {
  return (
    <section className="border-b border-line py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="border-l border-line pl-5">
            <div className="flex items-baseline gap-0.5">
              <span className="text-5xl font-extrabold tracking-tight text-white lg:text-6xl">
                {s.value}
              </span>
              <span className="text-3xl font-bold text-brand lg:text-4xl">{s.suffix}</span>
            </div>
            <p className="mt-3 max-w-[16rem] text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
