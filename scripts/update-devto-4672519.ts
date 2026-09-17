import "dotenv/config";
import { blogPosts } from "../prisma/posts-data";

async function updateDevTo() {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    throw new Error("DEVTO_API_KEY is not defined in environment");
  }

  const post = blogPosts.find((p) => p.slug === "rapid-software-development-user-experience");
  if (!post) {
    throw new Error("Post 'rapid-software-development-user-experience' not found in blogPosts!");
  }

  const articleId = "4672519";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://parvejshah.com";
  const coverImage = "https://pub-13629069dfd74891bffc487ab4e135f5.r2.dev/blog/rapid-software-development-user-experience.png";
  const tags = ["webdev", "ai", "ux", "softwareengineering"];

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

  console.log(`📡 Updating Dev.to article ${articleId}...`);
  console.log(`Cover image: ${coverImage}`);
  console.log(`Includes Diagram 1:`, post.content.includes("https://pub-13629069dfd74891bffc487ab4e135f5.r2.dev/blog/rapid-software-development-two-perspectives.png"));
  console.log(`Includes Diagram 2:`, post.content.includes("https://pub-13629069dfd74891bffc487ab4e135f5.r2.dev/blog/why-rapid-prototyping-matters.png"));

  const res = await fetch(`https://dev.to/api/articles/${articleId}`, {
    method: "PUT",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      article: {
        title: post.title,
        published: true,
        body_markdown: markdownBody,
        main_image: coverImage,
        description: post.excerpt,
        canonical_url: `${SITE_URL}/blog/${post.slug}`,
        tags,
      },
    }),
  });

  console.log(`Response Status: ${res.status} ${res.statusText}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`DEV.to update failed: ${res.status} ${errorText}`);
  }

  const updated = await res.json();
  console.log("\n✅ Successfully updated DEV.to article!");
  console.log("ID:", updated.id);
  console.log("Title:", updated.title);
  console.log("Main image:", updated.main_image);
  console.log("URL:", updated.url);

  // Re-fetch to double check
  const verifyRes = await fetch(`https://dev.to/api/articles/${articleId}`, {
    headers: {
      "api-key": apiKey,
      "Accept": "application/json",
    },
  });

  const verifiedData = await verifyRes.json();
  console.log("\n🔍 Verified on DEV.to:");
  console.log("Main image verified:", verifiedData.main_image);
  console.log("Has Diagram 1 in markdown:", verifiedData.body_markdown?.includes("rapid-software-development-two-perspectives.png"));
  console.log("Has Diagram 2 in markdown:", verifiedData.body_markdown?.includes("why-rapid-prototyping-matters.png"));
}

updateDevTo().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
