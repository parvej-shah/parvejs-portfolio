import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import MarkdownExcerpt from "./MarkdownExcerpt";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { getReadingStats } from "@/lib/markdown";

export default function Insights({ posts = [] }) {
  const featuredPosts = posts;

  if (!featuredPosts || featuredPosts.length === 0) return null;

  return (
    <section id="insights" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-4">Insights &amp; Articles</span>
            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-foreground">
              Ideas &amp; insights on building for the web.
            </h2>
          </div>
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 self-start rounded-full border-line bg-transparent px-5 text-sm font-semibold text-foreground hover:border-brand/50 hover:bg-brand/10 hover:text-brand md:self-auto"
            )}
          >
            View All Articles
            <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredPosts.map((post, i) => {
            const reading = getReadingStats(post.content);
            const dateLabel = post.publishedAt
              ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                  new Date(post.publishedAt)
                )
              : "Recently published";

            return (
              <Reveal
                key={post.slug}
                delay={i * 100}
                as="article"
                className="card-surface group flex flex-col overflow-hidden rounded-2xl border border-line transition-all duration-300 hover:border-brand/30 hover:shadow-lg"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-ink-2">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="dot-grid flex size-full items-center justify-center">
                        <span className="text-4xl font-black text-muted-foreground/20">0{i + 1}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute left-3.5 top-3.5 rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-xs font-medium text-brand backdrop-blur-md">
                      {reading.text}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
                      {post.title}
                    </h3>
                    <MarkdownExcerpt className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </MarkdownExcerpt>
                    <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4">
                      <span className="text-xs text-muted-foreground">{dateLabel}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand group-hover:underline">
                        Read Article
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
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
