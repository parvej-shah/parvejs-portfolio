import "dotenv/config";
import { blogPosts } from "../prisma/posts-data";

interface SyndicateConfig {
  devToApiKey?: string;
  hashnodeToken?: string;
  hashnodePublicationId?: string;
  mediumToken?: string;
}

const config: SyndicateConfig = {
  devToApiKey: process.env.DEVTO_API_KEY,
  hashnodeToken: process.env.HASHNODE_TOKEN,
  hashnodePublicationId: process.env.HASHNODE_PUBLICATION_ID,
  mediumToken: process.env.MEDIUM_TOKEN,
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://parvejshah.com";

// Map slugs to tags for developer platforms
const TAG_MAP: Record<string, string[]> = {
  "architecting-sub-18s-voice-ai-pipelines": ["webdev", "ai", "nextjs", "typescript"],
  "defensive-webhook-engineering-payment-gateways": ["webdev", "javascript", "backend", "postgres"],
  "rendering-katex-formulas-nextjs-server-components": ["nextjs", "react", "webperf", "typescript"],
  "deterministic-multi-agent-systems-production": ["ai", "architecture", "typescript", "softwareengineering"],
  "engineering-precision-data-platforms-sft-rlhf": ["webdev", "nextjs", "architecture", "security"],
  "conversational-commerce-webhook-architecture": ["javascript", "backend", "webdev", "nodejs"],
  "building-manifest-v3-ai-chrome-extensions": ["webdev", "javascript", "react", "typescript"],
  "offline-first-pwa-emergency-volunteer-networks": ["webdev", "javascript", "pwa", "react"],
  "scaling-competitive-programming-lms-architectures": ["softwareengineering", "architecture", "database", "postgres"],
  "cryptographic-credential-verification-institutional-web": ["security", "webdev", "crypto", "typescript"],
  "nextjs-16-turbopack-deep-dive": ["nextjs", "react", "webdev", "javascript"],
  "craft-of-high-velocity-software-delivery": ["programming", "webdev", "productivity", "career"],
};

async function syndicateToDevTo() {
  if (!config.devToApiKey) {
    console.log("⏭️  [DEV.to] DEVTO_API_KEY not provided, skipping DEV.to sync.");
    return;
  }

  console.log("\n📡 [DEV.to] Checking existing articles...");
  try {
    const res = await fetch("https://dev.to/api/articles/me/all?per_page=1000", {
      headers: {
        "api-key": config.devToApiKey,
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`❌ [DEV.to] Failed to fetch articles: ${res.status} ${res.statusText}`);
      return;
    }

    const existingArticles = await res.json();
    const existingCanonicals = new Set(
      existingArticles.map((a: any) => a.canonical_url?.toLowerCase().trim())
    );
    const existingTitles = new Set(
      existingArticles.map((a: any) => a.title?.toLowerCase().trim())
    );

    for (const post of blogPosts) {
      const canonicalUrl = `${SITE_URL}/blog/${post.slug}`.toLowerCase().trim();
      const titleLower = post.title.toLowerCase().trim();

      if (existingCanonicals.has(canonicalUrl) || existingTitles.has(titleLower)) {
        console.log(`  ✅ Already on DEV.to: "${post.title}"`);
        continue;
      }

      console.log(`  🚀 Publishing to DEV.to: "${post.title}"...`);
      const coverImage = post.coverImage?.url
        ? post.coverImage.url.startsWith("http")
          ? post.coverImage.url
          : `${SITE_URL}${post.coverImage.url}`
        : `${SITE_URL}/og.jpg`;

      const markdownBody = `---
title: ${post.title}
published: true
tags: ${tags.join(", ")}
canonical_url: ${SITE_URL}/blog/${post.slug}
cover_image: ${coverImage}
---

> *Originally published at [parvejshah.com/blog/${post.slug}](${SITE_URL}/blog/${post.slug}) by [Parvej Shah](${SITE_URL}).*

${post.content}

---

*Parvej Shah is a Lead Full-Stack Web Developer & Platform Architect based in Dhaka, Bangladesh. Explore full architecture case studies and production code at [parvejshah.com](${SITE_URL}).*
`;

      let published = false;
      let attempts = 0;

      while (!published && attempts < 3) {
        attempts++;
        const publishRes = await fetch("https://dev.to/api/articles", {
          method: "POST",
          headers: {
            "api-key": config.devToApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article: {
              title: post.title,
              published: true,
              body_markdown: markdownBody,
              tags,
              canonical_url: `${SITE_URL}/blog/${post.slug}`,
              main_image: coverImage,
              description: post.excerpt,
            },
          }),
        });

        if (publishRes.ok) {
          const created = await publishRes.json();
          console.log(`     🎉 Published! URL: ${created.url}`);
          published = true;
        } else if (publishRes.status === 429) {
          console.log(`     ⏳ Rate limit hit. Waiting 32 seconds before retry...`);
          await new Promise((r) => setTimeout(r, 32000));
        } else {
          const err = await publishRes.text();
          console.error(`     ❌ Failed to publish: ${publishRes.status} ${err}`);
          break;
        }
      }

      // 5-second interval between publishes
      await new Promise((r) => setTimeout(r, 5000));
    }
  } catch (err) {
    console.error("❌ [DEV.to] Error during syndication:", err);
  }
}

async function syndicateToHashnode() {
  if (!config.hashnodeToken || !config.hashnodePublicationId) {
    console.log("⏭️  [Hashnode] HASHNODE_TOKEN or HASHNODE_PUBLICATION_ID not provided, skipping Hashnode sync.");
    return;
  }

  console.log("\n📡 [Hashnode] Syncing articles to publication...");
  for (const post of blogPosts) {
    const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
    const tags = (TAG_MAP[post.slug] || ["web-development", "javascript", "technology"]).map(
      (t) => ({ name: t, slug: t })
    );

    const markdownBody = `> *Originally published at [parvejshah.com/blog/${post.slug}](${canonicalUrl}) by [Parvej Shah](${SITE_URL}).*

${post.content}

---

*Parvej Shah is a Lead Full-Stack Web Developer & Platform Architect based in Dhaka, Bangladesh. Explore full architecture case studies and production code at [parvejshah.com](${SITE_URL}).*
`;

    const mutation = `
      mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post {
            id
            url
            title
          }
        }
      }
    `;

    try {
      const res = await fetch("https://gql.hashnode.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: config.hashnodeToken,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              title: post.title,
              subtitle: post.excerpt,
              publicationId: config.hashnodePublicationId,
              contentMarkdown: markdownBody,
              coverImageOptions: {
                coverImageURL: post.coverImage?.url
                  ? post.coverImage.url.startsWith("http")
                    ? post.coverImage.url
                    : `${SITE_URL}${post.coverImage.url}`
                  : `${SITE_URL}/og.jpg`,
              },
              originalArticleURL: canonicalUrl,
              tags,
            },
          },
        }),
      });

      const data = await res.json();
      if (data.errors) {
        console.log(`  ℹ️  [Hashnode] Note for "${post.title}": ${data.errors[0]?.message}`);
      } else if (data.data?.publishPost?.post) {
        console.log(`  🎉 [Hashnode] Published: ${data.data.publishPost.post.url}`);
      }
    } catch (err) {
      console.error(`  ❌ [Hashnode] Error publishing "${post.title}":`, err);
    }

    await new Promise((r) => setTimeout(r, 1500));
  }
}

async function main() {
  console.log("==========================================");
  console.log("🚀 Automated Blog Syndication Engine");
  console.log(`🌐 Base Canonical: ${SITE_URL}`);
  console.log(`📚 Total Articles to Process: ${blogPosts.length}`);
  console.log("==========================================");

  await syndicateToDevTo();
  await syndicateToHashnode();

  console.log("\n✨ Syndication run completed!");
}

main().catch(console.error);
