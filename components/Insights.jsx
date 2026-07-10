import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Reveal from "./Reveal";
import MarkdownExcerpt from "./MarkdownExcerpt";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { getReadingStats } from "@/lib/markdown";

export default function Insights({ posts = [] }) {
  const featuredPosts = posts;

  return (
    <section id="insights" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-4">Insights</span>
            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Ideas &amp; insights on building for the web.
            </h2>
          </div>
          <a
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 self-start rounded-full border-line bg-transparent px-5 text-sm font-semibold text-white hover:border-brand/50 hover:bg-ink-3 md:self-auto"
            )}
          >
            View Insights
          </a>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredPosts.map((post, i) => {
            const reading = getReadingStats(post.content);
            const dateLabel = post.publishedAt
              ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
                  new Date(post.publishedAt)
                )
              : "Draft";

            return (
              <Reveal
                key={post.slug}
                delay={i * 100}
                as="article"
                className="card-surface group flex flex-col overflow-hidden"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
                  <div className="dot-grid relative flex aspect-[16/10] items-center justify-center bg-ink-2">
                    <span className="text-4xl font-black text-white/10">0{i + 1}</span>
                    <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/70 px-3 py-1 text-xs font-medium text-brand backdrop-blur">
                      {reading.text}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-brand">
                      {post.title}
                    </h3>
                    <MarkdownExcerpt className="mt-2 flex-1 text-sm leading-relaxed">
                      {post.excerpt}
                    </MarkdownExcerpt>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <span className="text-xs text-muted-foreground">{dateLabel}</span>
                      <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:text-brand" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
