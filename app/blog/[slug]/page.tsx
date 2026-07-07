import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/public";
import { getReadingStats, markdownRemarkPlugins } from "@/lib/markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const stats = getReadingStats(post.content);

  return (
    <main className="border-b border-line">
      <section className="border-b border-line py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to blog
            </Link>
          </Reveal>

          <Reveal delay={70} className="mt-8">
            <span className="eyebrow mb-4">Article</span>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {post.excerpt}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border border-line bg-ink-2 px-4 py-2">
                {formatDate(post.publishedAt)}
              </span>
              <span className="rounded-full border border-line bg-ink-2 px-4 py-2">
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
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal className="card-surface p-7 sm:p-10">
            <div className="prose-portfolio prose-portfolio-lg">
              <ReactMarkdown remarkPlugins={markdownRemarkPlugins}>{post.content}</ReactMarkdown>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
