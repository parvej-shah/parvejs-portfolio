import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

// Placeholder posts — replace href/content when you publish real articles.
const posts = [
  {
    category: "Business Growth",
    title: "Scaling online businesses with modern web technology",
    excerpt:
      "How a well-built front-end becomes a growth lever — not just a cost — for small teams.",
    date: "Coming soon",
  },
  {
    category: "Product Design",
    title: "Balancing aesthetics and usability in interface design",
    excerpt:
      "Practical patterns for keeping designs beautiful without sacrificing clarity or speed.",
    date: "Coming soon",
  },
  {
    category: "Web Development",
    title: "Modern front-end trends developers should know",
    excerpt:
      "A quick tour of the tools and techniques shaping the way we ship on the web this year.",
    date: "Coming soon",
  },
];

export default function Insights() {
  return (
    <section id="insights" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-4">Insights</span>
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Ideas &amp; insights on building for the web.
            </h2>
          </div>
          <a
            href="#contact"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 self-start rounded-full border-line bg-transparent px-5 text-sm font-semibold text-white hover:border-brand/50 hover:bg-ink-3 md:self-auto"
            )}
          >
            View Insights
          </a>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 100}
              as="article"
              className="card-surface group flex flex-col overflow-hidden"
            >
              <div className="dot-grid relative flex aspect-[16/10] items-center justify-center bg-ink-2">
                <span className="text-4xl font-black text-white/10">0{i + 1}</span>
                <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/70 px-3 py-1 text-xs font-medium text-brand backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-brand">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:text-brand" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
