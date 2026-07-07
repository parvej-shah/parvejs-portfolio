import Reveal from "./Reveal";

const defaultSection = {
  items: [
    { value: "3", suffix: "+", label: "Years of hands-on full-stack development experience" },
    { value: "20", suffix: "+", label: "Products & websites designed, built, and shipped" },
    { value: "10", suffix: "+", label: "Technologies mastered across the modern stack" },
    { value: "100", suffix: "%", label: "On-time delivery — and clients who come back" },
  ],
};

export default function Stats({ section = defaultSection }) {
  const content = { ...defaultSection, ...section };

  return (
    <section className="border-b border-line py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-8 px-5 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {content.items.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="border-l border-line pl-5">
            <div className="flex items-baseline gap-0.5">
              <span className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {s.value}
              </span>
              <span className="text-2xl font-bold text-brand sm:text-3xl lg:text-4xl">{s.suffix}</span>
            </div>
            <p className="mt-3 max-w-[16rem] text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
