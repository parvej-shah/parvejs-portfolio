import { getPublishedPosts, getSection } from "@/lib/data/public";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [seoSection, posts] = await Promise.all([
    getSection("seo"),
    getPublishedPosts(),
  ]);

  const siteUrl = seoSection?.siteUrl || "https://parvejshah.com";
  const blogTitle = "Parvej Shah — Engineering & Architecture Blog";
  const blogDescription =
    "Technical deep dives on Next.js App Router, real-time telephony voice AI pipelines, deterministic multi-agent state machines, and high-concurrency backend architectures.";

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date(post.createdAt).toUTCString();

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>parvejshahlabib007@gmail.com (Parvej Shah)</author>
      ${post.coverImage ? `<enclosure url="${siteUrl}${post.coverImage.url}" length="0" type="image/png" />` : ""}
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(blogTitle)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(blogDescription)}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/og.jpg</url>
      <title>${escapeXml(blogTitle)}</title>
      <link>${siteUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
