import Image from "next/image";
import { Check, Quote, ArrowUpRight } from "lucide-react";
import aboutme from "../assets/images/aboutme.webp";
import Reveal from "./Reveal";

const points = [
  "Full-stack depth — React, Next.js, Node.js, Express & MongoDB",
  "Engineering foundation from IIT, University of Dhaka",
  "Trusted partner to startups, businesses, and personal brands",
];

export default function AboutMe() {
  return (
    <section id="about" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <span className="eyebrow mb-5">About Me</span>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left: images */}
          <Reveal className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-line lg:aspect-[5/6]">
              <Image
                src={aboutme}
                alt="Parvej Shah"
                className="h-full w-full object-cover object-[center_30%]"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 flex items-center gap-3 rounded-2xl border border-line bg-ink-3 px-5 py-3 shadow-xl sm:right-6">
              <span className="text-2xl font-extrabold text-brand">12+</span>
              <span className="max-w-[7rem] text-xs text-muted-foreground">
                people trust my work
              </span>
            </div>
          </Reveal>

          {/* Right: content */}
          <Reveal delay={120}>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Developer driven by purpose and precision.
            </h2>

            <div className="mt-6 rounded-2xl border border-line bg-ink-2 p-6">
              <Quote className="size-6 text-brand" />
              <p className="mt-3 text-lg font-medium leading-relaxed text-white">
                Great software isn&apos;t just shipped — it&apos;s considered.
                Every decision, from the database to the last pixel, should
                serve the people using it.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-white">Parvej Shah</span> — Full Stack
                Web Developer, IIT DU
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
                    <Check className="size-3.5" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-line bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:border-brand/50 hover:bg-ink-3"
            >
              Let&apos;s Work Together
              <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
