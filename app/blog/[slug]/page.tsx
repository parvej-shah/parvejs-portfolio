import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import Reveal from "@/components/Reveal";
import MarkdownExcerpt from "@/components/MarkdownExcerpt";
import { getPostBySlug, getPublishedPosts, getSection } from "@/lib/data/public";
import { getReadingStats, markdownRemarkPlugins } from "@/lib/markdown";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const defaultSiteUrl = "https://parvejshah.vercel.app";

function formatDate(date: Date | null | undefined) {
  if (!date) return "Recently published";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Parvej Shah" };
  }

  return {
    title: `${post.title} | Blog | Parvej Shah`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage
        ? [{ url: post.coverImage.url, alt: post.coverImage.alt || post.title }]
        : undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const stats = getReadingStats(post.content);
  const seo = await getSection("seo");
  const siteUrl = seo?.siteUrl || defaultSiteUrl;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage.url] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: "Parvej Shah" },
    publisher: { "@type": "Person", name: "Parvej Shah" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
  };

  return (
    <main className="border-b border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Editorial hero: ambient brand glow behind the title, with a byline row.
          When there's no cover image the glow itself carries the header. */}
      <section className="relative overflow-hidden border-b border-line py-12 lg:py-14">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[130px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl px-5">
          <Reveal delay={70}>
            <span className="eyebrow mb-4 block">Article</span>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              {post.title}
            </h1>
            <MarkdownExcerpt className="mt-5 max-w-4xl text-lg leading-8 sm:text-xl">
              {post.excerpt}
            </MarkdownExcerpt>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-brand/30 bg-brand/10 font-mono text-sm font-bold text-brand">
                  PS
                </span>
                <span className="text-sm font-semibold text-white">Parvej Shah</span>
              </div>
              <span className="hidden h-4 w-px bg-line sm:block" aria-hidden />
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4 text-brand/70" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 text-brand/70" />
                {stats.text}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {post.coverImage ? (
        <section className="border-b border-line py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="relative aspect-[16/8] overflow-hidden rounded-[1.8rem] border border-line bg-ink-2">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal className="prose-portfolio prose-portfolio-lg">
            <ReactMarkdown remarkPlugins={markdownRemarkPlugins}>{post.content}</ReactMarkdown>
          </Reveal>

          <Reveal className="mt-16 flex flex-col gap-5 rounded-[1.6rem] border border-line bg-ink-2/60 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-white">Enjoyed the read?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Have a product idea worth building — let&apos;s talk.
              </p>
            </div>
            <a
              href="/#contact"
              className={cn(
                buttonVariants(),
                "h-11 w-fit shrink-0 rounded-full bg-brand px-5 text-sm font-semibold text-[#05140b] hover:bg-brand-dark"
              )}
            >
              Start a project
              <ArrowUpRight className="size-4" />
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
