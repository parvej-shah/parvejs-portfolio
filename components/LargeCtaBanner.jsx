import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const defaultContent = {
  headline: "Let's Build Systems That Scale with Confidence",
  description:
    "If you're looking for technical leadership, architectural clarity, and disciplined execution, I'm open to discussing your next product or platform.",
  ctaLabel: "Start a Conversation",
  ctaHref: "#contact",
};

export default function LargeCtaBanner({ content = defaultContent }) {
  const data = { ...defaultContent, ...content };

  return (
    <section className="relative overflow-hidden bg-brand py-20 lg:py-28 text-[#05140b]">
      {/* Dark dot grid texture on bright brand background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#05140b 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#05140b] min-[420px]:text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
            {data.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-[#05140b]/85 font-medium leading-relaxed sm:text-lg">
            {data.description}
          </p>
          <div className="mt-8 sm:mt-10">
            <a
              href={data.ctaHref}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0a0b0a] px-8 py-4 text-xs sm:text-sm font-bold tracking-wider uppercase text-brand transition-all duration-300 hover:scale-[1.03] hover:bg-black hover:shadow-2xl hover:shadow-black/40 active:scale-[0.98]"
            >
              <span>{data.ctaLabel}</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
