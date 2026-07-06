import { Star, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function CtaBand() {
  return (
    <section className="border-b border-line py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="brand-glow relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-8 sm:p-12">
          <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.6fr_1fr]">
            {/* Rating card */}
            <Reveal className="rounded-2xl border border-line bg-ink-3 p-6">
              <div className="flex gap-1 text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-brand" />
                ))}
              </div>
              <p className="mt-4 text-5xl font-extrabold text-white">4.9</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Trusted feedback from real clients
              </p>
            </Reveal>

            {/* Copy */}
            <Reveal delay={120}>
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Ready to build something people remember?
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Bring a polished brief or a napkin sketch — both work. Tell me
                where you want to go, and I&apos;ll map the fastest route to a
                product your users will love.
              </p>
              <a
                href="#contact"
                className={cn(
                  buttonVariants(),
                  "mt-7 h-12 rounded-full bg-brand px-6 text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)] [&_svg]:size-4"
                )}
              >
                Start Your Project
                <ArrowUpRight />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
