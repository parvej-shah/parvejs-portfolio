import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import MarkdownExcerpt from "@/components/MarkdownExcerpt";
import { getPublishedPosts } from "@/lib/data/public";
import { getReadingStats } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Blog | Parvej Shah",
  description:
    "Published writing on product thinking, front-end engineering, and practical lessons from shipping web products.",
  alternates: { canonical: "/blog" },
};

function formatDate(date: Date | null | undefined) {
  if (!date) return "Recently published";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  // Posts arrive ordered (featured → recency), so the first is the lead article.
  const [featured, ...rest] = posts;

  return (
    <main className="border-b border-line">
      <section className="border-b border-line py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Insights</span>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Writing about the systems behind strong digital products.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Notes from building, designing, and shipping on the web, with a bias toward
              pragmatic decisions over trend-chasing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 pt-12 lg:pb-28 lg:pt-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5">
          {posts.length === 0 ? (
            <div className="card-surface p-10 text-center text-muted-foreground">
              No published posts yet.
            </div>
          ) : null}

          {featured ? (
            <Reveal
              as="article"
              className="card-surface group grid gap-6 overflow-hidden p-4 lg:grid-cols-[1.15fr_0.85fr]"
            >
              <Link
                href={`/blog/${featured.slug}`}
                className="relative flex min-h-[16rem] items-end overflow-hidden rounded-[1.4rem] border border-line/60 bg-ink-2 sm:min-h-[22rem]"
              >
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage.url}
                    alt={featured.coverImage.alt || featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    priority
                  />
                ) : (
                  <div className="dot-grid flex h-full w-full items-center justify-center text-6xl font-black text-white/10">
                    01
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3 via-transparent to-transparent opacity-80" />
                <div className="card-sheen" aria-hidden />
                <span className="absolute left-4 top-4 rounded-full border border-brand/30 bg-ink/75 px-3 py-1 text-xs font-semibold text-brand backdrop-blur">
                  Featured article
                </span>
              </Link>

              <div className="flex flex-col justify-center gap-5 p-2 sm:p-5">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span className="size-1 rounded-full bg-muted-foreground/50" />
                  <span>{getReadingStats(featured.content).text}</span>
                </div>
                <h2 className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
                  <Link href={`/blog/${featured.slug}`} className="transition-colors hover:text-brand">
                    {featured.title}
                  </Link>
                </h2>
                <MarkdownExcerpt className="text-sm leading-7 sm:text-base">
                  {featured.excerpt}
                </MarkdownExcerpt>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-brand"
                >
                  Read article
                  <ArrowUpRight className="size-4 text-brand" />
                </Link>
              </div>
            </Reveal>
          ) : null}

          {rest.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((post, index) => {
                const stats = getReadingStats(post.content);

                return (
                  <Reveal
                    key={post.id}
                    delay={(index % 3) * 90}
                    as="article"
                    className="card-surface group flex flex-col overflow-hidden"
                  >
                    <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
                      <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-ink-2">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage.url}
                            alt={post.coverImage.alt || post.title}
                            fill
                            sizes="(max-width: 1280px) 100vw, 33vw"
                            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                          />
                        ) : (
                          <div className="dot-grid flex h-full w-full items-center justify-center text-5xl font-black text-white/10">
                            0{index + 2}
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3 via-transparent to-transparent opacity-85" />
                        <div className="card-sheen" aria-hidden />
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>{stats.text}</span>
                        </div>
                        <h2 className="mt-4 text-xl font-semibold leading-snug text-white transition-colors group-hover:text-brand">
                          {post.title}
                        </h2>
                        <MarkdownExcerpt className="mt-3 flex-1 text-sm leading-7">
                          {post.excerpt}
                        </MarkdownExcerpt>
                        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
                          Read article
                          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
