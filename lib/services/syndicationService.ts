export async function triggerPostSyndication(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: { url: string } | null;
}) {
  const results: Array<{
    provider: "DEVTO" | "HASHNODE";
    status: "SKIPPED" | "SUCCEEDED" | "FAILED";
    httpStatus?: number;
  }> = [];
  const devToApiKey = process.env.DEVTO_API_KEY;
  const hashnodeToken = process.env.HASHNODE_TOKEN;
  const hashnodePublicationId = process.env.HASHNODE_PUBLICATION_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://parvejshah.com";
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

  // 1. Sync to DEV.to if API key is present
  if (devToApiKey) {
    try {
      const resolvedContent = post.content.replace(
        /!\[(.*?)\]\(\/(.*?)\)/g,
        `![$1](${siteUrl}/$2)`
      );
      const coverImage = post.coverImage ? `${siteUrl}${post.coverImage.url}` : `${siteUrl}/og.jpg`;
      const markdownBody = `> *Originally published at [parvejshah.com/blog/${post.slug}](${canonicalUrl}) by [Parvej Shah](${siteUrl}).*

${resolvedContent}

---

*Parvej Shah is a Lead Full-Stack Web Developer & Platform Architect based in Dhaka, Bangladesh. Explore full architecture case studies and production code at [parvejshah.com](${siteUrl}).*
`;

      const response = await fetch("https://dev.to/api/articles", {
        method: "POST",
        headers: {
          "api-key": devToApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article: {
            title: post.title,
            published: true,
            body_markdown: markdownBody,
            tags: ["webdev", "programming", "tech"],
            canonical_url: canonicalUrl,
            main_image: coverImage,
            description: post.excerpt,
          },
        }),
      });
      results.push({
        provider: "DEVTO",
        status: response.ok ? "SUCCEEDED" : "FAILED",
        httpStatus: response.status,
      });
    } catch {
      results.push({ provider: "DEVTO", status: "FAILED" });
    }
  } else {
    results.push({ provider: "DEVTO", status: "SKIPPED" });
  }

  // 2. Sync to Hashnode if token is present
  if (hashnodeToken && hashnodePublicationId) {
    try {
      const resolvedContent = post.content.replace(
        /!\[(.*?)\]\(\/(.*?)\)/g,
        `![$1](${siteUrl}/$2)`
      );
      const markdownBody = `> *Originally published at [parvejshah.com/blog/${post.slug}](${canonicalUrl}) by [Parvej Shah](${siteUrl}).*

${resolvedContent}

---

*Parvej Shah is a Lead Full-Stack Web Developer & Platform Architect based in Dhaka, Bangladesh. Explore full architecture case studies and production code at [parvejshah.com](${siteUrl}).*
`;

      const mutation = `
        mutation PublishPost($input: PublishPostInput!) {
          publishPost(input: $input) {
            post { id url title }
          }
        }
      `;

      const response = await fetch("https://gql.hashnode.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: hashnodeToken,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              title: post.title,
              subtitle: post.excerpt,
              publicationId: hashnodePublicationId,
              contentMarkdown: markdownBody,
              coverImageOptions: {
                coverImageURL: post.coverImage ? `${siteUrl}${post.coverImage.url}` : `${siteUrl}/og.jpg`,
              },
              originalArticleURL: canonicalUrl,
              tags: [{ name: "web-development", slug: "web-development" }],
            },
          },
        }),
      });
      results.push({
        provider: "HASHNODE",
        status: response.ok ? "SUCCEEDED" : "FAILED",
        httpStatus: response.status,
      });
    } catch {
      results.push({ provider: "HASHNODE", status: "FAILED" });
    }
  } else {
    results.push({ provider: "HASHNODE", status: "SKIPPED" });
  }

  return results;
}
