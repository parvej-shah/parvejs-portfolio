import { Quote, Star } from "lucide-react";
import Reveal from "./Reveal";

const defaultSection = {
  eyebrow: "Client Feedback",
  heading: "Kind words from the people I've built with.",
  items: [
    {
      quote:
        "Working with Parvej was a great experience from start to finish. The project was delivered on time with excellent attention to detail. Communication was clear and professional throughout.",
      name: "Client Name",
      role: "Startup Founder",
      initials: "CN",
    },
    {
      quote:
        "Clean code, thoughtful UX, and a genuine care for the end result. Parvej understood exactly what we needed and shipped it faster than we expected.",
      name: "Client Name",
      role: "Product Manager",
      initials: "CN",
    },
  ],
  clients: ["Zenvix", "Glovix", "Crevox", "Markon", "Brandex", "Nexora"],
};

export default function Testimonials({ section = defaultSection }) {
  const content = { ...defaultSection, ...section };
  const track = [...content.clients, ...content.clients];

  return (
    <section className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <span className="eyebrow mb-5">{content.eyebrow}</span>
          <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {content.heading}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {content.items.map((t, i) => (
            <Reveal key={i} delay={i * 100} className="card-surface p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <Quote className="size-7 text-brand" />
                <div className="flex gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-3.5 fill-brand" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* logo marquee */}
      <div className="relative mt-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-24" />
        <div className="flex w-max animate-marquee items-center gap-10 px-6 sm:gap-16 sm:px-8">
          {track.map((c, i) => (
            <span
              key={i}
              className="text-lg font-bold uppercase tracking-wide text-white/25 transition-colors hover:text-white/60 sm:text-xl"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
