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
import Mermaid from "@/components/Mermaid";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const defaultSiteUrl = "https://parvejshah.com";

function formatDate(date: Date | null | undefined) {
  if (!date) return "Recently published";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const postKeywordsMap: Record<string, string[]> = {
  "architecting-sub-18s-voice-ai-pipelines": [
    "voice AI latency",
    "Retell AI",
    "n8n workflow caching",
    "Gemini 2.0 Flash",
    "EspoCRM telephony integration",
    "Google Calendar free busy cache",
    "WebRTC SIP voice pipeline",
    "telephony cost optimization",
    "neural VAD",
    "conversational turn reduction",
    "streaming STT TTS",
    "telephony dispatch bot",
  ],
  "deterministic-multi-agent-systems-production": [
    "multi agent orchestration",
    "deterministic state machine",
    "TypeScript FSM",
    "LLM loop oscillation",
    "context poisoning",
    "structured outputs Zod",
    "AI content engine",
    "agentic workflows",
    "Minions.AI architecture",
  ],
  "defensive-webhook-engineering-payment-gateways": [
    "bKash payment gateway",
    "Nagad webhook",
    "SSLCommerz IPN",
    "payment idempotency",
    "timing-safe HMAC",
    "crypto.timingSafeEqual",
    "ACID database transaction",
    "multi-installment tuition",
    "Prisma PostgreSQL payment",
  ],
  "offline-first-pwa-emergency-volunteer-networks": [
    "offline first PWA",
    "IndexedDB cursor index",
    "Badhan blood network",
    "emergency blood donation system",
    "University of Dhaka Amar Ekushey Hall",
    "90-day cooldown filter",
    "Telegram bot webhook",
    "sub-10ms local search",
  ],
  "rendering-katex-formulas-nextjs-server-components": [
    "Server-side KaTeX",
    "React Server Components math",
    "0 CLS formula rendering",
    "MathML accessibility",
    "TipTap LaTeX extension",
    "MathPro Academy",
    "Next.js 15 math rendering",
    "Cumulative Layout Shift",
  ],
  "conversational-commerce-webhook-architecture": [
    "SellerVai",
    "conversational commerce bot",
    "FastAPI LangGraph",
    "PGVector FastEmbed",
    "Gemini Vision product search",
    "message debouncer",
    "Banglish NLP",
    "Meta Graph API Messenger WhatsApp",
  ],
  "cryptographic-credential-verification-institutional-web": [
    "CPRBD DU",
    "academic credential verification",
    "University of Dhaka certificate",
    "tamper proof QR code",
    "HMAC-SHA256 signature",
    "visual coordinate certificate designer",
    "SSLCommerz multi-installment",
    "blockchain alternative",
  ],
  "building-manifest-v3-ai-chrome-extensions": [
    "Chrome Extension Manifest V3",
    "Shadow DOM isolation",
    "CSS stylesheet bleed",
    "service worker keep alive",
    "long-lived port messaging",
    "LinkedIn AI assistant",
    "content script React 19",
  ],
  "engineering-precision-data-platforms-sft-rlhf": [
    "GenMorphics AI",
    "workforce management AI data",
    "RLHF SFT annotation",
    "Azure AD Entra ID SSO",
    "electronic NDA compliance",
    "PostgreSQL Row Level Security",
    "Cloudflare R2 presigned URL",
    "consensus QA",
  ],
  "scaling-competitive-programming-lms-architectures": [
    "CoderVai CP",
    "competitive programming LMS",
    "ICPC contest scoring",
    "Redis streak counter",
    "DAG prerequisite curriculum",
    "University of Dhaka BSSE",
    "automated code judge",
  ],
  "nextjs-16-turbopack-deep-dive": [
    "Next.js 16 Turbopack",
    "React Server Components migration",
    "React 19 actions",
    "unstable_cache tag revalidation",
    "streaming SSR",
    "web performance",
  ],
  "craft-of-high-velocity-software-delivery": [
    "modern web stack",
    "PostgreSQL Prisma Redis",
    "Next.js App Router",
    "boring technology",
    "developer velocity",
    "high throughput architecture",
  ],
};

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

  const keywords = postKeywordsMap[slug] || [
    "software engineering",
    "AI systems developer",
    "Next.js",
    "TypeScript",
    "Parvej Shah",
    "University of Dhaka",
  ];

  let ogImageUrl = `${defaultSiteUrl}/blog/${post.slug}.jpg`;
  if (post.coverImage?.url) {
    if (post.coverImage.url.startsWith("/blog/")) {
      ogImageUrl = `${defaultSiteUrl}${post.coverImage.url}`;
    } else if (post.coverImage.url.startsWith("http")) {
      ogImageUrl = post.coverImage.url;
    }
  }

  return {
    title: `${post.title} | Parvej Shah`,
    description: post.excerpt,
    keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      siteName: "Parvej Shah",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/jpeg",
        },
      ],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      section: "Software Engineering",
      tags: keywords,
      authors: ["https://parvejshah.com"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
      creator: "@parvejshah",
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

  const keywords = postKeywordsMap[slug] || [
    "software engineering",
    "AI systems",
    "Next.js",
    "TypeScript",
  ];

  const absoluteImageUrl = post.coverImage
    ? post.coverImage.url.startsWith("http")
      ? post.coverImage.url
      : `${siteUrl}${post.coverImage.url}`
    : `${siteUrl}/og.jpg`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    keywords: keywords.join(", "),
    articleSection: "Software Engineering",
    inLanguage: "en-US",
    wordCount: stats.words,
    image: [absoluteImageUrl],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Parvej Shah",
      jobTitle: "Software Engineer & AI Systems Developer",
      url: siteUrl,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Dhaka",
      },
      worksFor: {
        "@type": "Organization",
        name: "CoderVai",
      },
      sameAs: [
        "https://github.com/parvej-shah",
        "https://www.linkedin.com/in/parvej-shah",
        "https://dev.to/parvejshah",
        "https://hashnode.com/@parvejshah",
        "https://medium.com/@parvejshah",
        "https://peerlist.io/parvejshah",
        "https://producthunt.com/@parvejshah",
      ],
    },
    publisher: {
      "@type": "Person",
      name: "Parvej Shah",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="border-b border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
              {post.updatedAt && post.updatedAt.getTime() > (post.publishedAt?.getTime() || 0) + 86400000 ? (
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  · Last updated: {formatDate(post.updatedAt)}
                </span>
              ) : null}
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
                quality={100}
                unoptimized
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
          <div className="prose-portfolio prose-portfolio-lg">
            <ReactMarkdown 
              remarkPlugins={markdownRemarkPlugins}
              components={{
                code(props: any) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "");
                  if (match && match[1] === "mermaid") {
                    return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                  }
                  return <code {...rest} className={className}>{children}</code>;
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

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
