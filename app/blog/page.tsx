import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
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

  return (
    <main className="border-b border-line">
      <section className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="flex flex-col gap-6">
            <span className="eyebrow">Insights</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Writing about the systems behind strong digital products.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Notes from building, designing, and shipping on the web, with a bias toward
              pragmatic decisions over trend-chasing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.length === 0 ? (
            <div className="card-surface p-10 text-center text-muted-foreground md:col-span-2 xl:col-span-3">
              No published posts yet.
            </div>
          ) : (
            posts.map((post, index) => {
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
                          0{index + 1}
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
                      <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
                        Read article
                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

