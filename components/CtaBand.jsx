import { Star, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const defaultSection = {
  rating: "4.9",
  ratingLabel: "Trusted feedback from real clients",
  heading: "Ready to build something people remember?",
  description:
    "Bring a polished brief or a napkin sketch — both work. Tell me where you want to go, and I'll map the fastest route to a product your users will love.",
  ctaLabel: "Start Your Project",
  ctaHref: "#contact",
};

export default function CtaBand({ section = defaultSection }) {
  const content = { ...defaultSection, ...section };

  return (
    <section className="border-b border-line py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="brand-glow relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-6 sm:p-8 lg:p-12">
          <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.6fr_1fr]">
            {/* Rating card */}
            <Reveal className="rounded-2xl border border-line bg-ink-3 p-5 sm:p-6">
              <div className="flex gap-1 text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-brand" />
                ))}
              </div>
              <p className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">{content.rating}</p>
              <p className="mt-1 text-sm text-muted-foreground">{content.ratingLabel}</p>
            </Reveal>

            {/* Copy */}
            <Reveal delay={120}>
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {content.heading}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">{content.description}</p>
              <a
                href={content.ctaHref}
                className={cn(
                  buttonVariants(),
                  "mt-7 h-12 w-full rounded-full bg-brand px-6 text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)] sm:w-auto [&_svg]:size-4"
                )}
              >
                {content.ctaLabel}
                <ArrowUpRight />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
