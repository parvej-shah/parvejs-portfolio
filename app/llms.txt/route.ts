import { getPublishedProjects, getPublishedPosts, getSection } from "@/lib/data/public";
import { NextResponse } from "next/server";

export async function GET() {
  const [seoSection, projects, posts] = await Promise.all([
    getSection("seo"),
    getPublishedProjects(),
    getPublishedPosts(),
  ]);

  const siteUrl = seoSection?.siteUrl || "https://parvejshah.com";
  const title = seoSection?.title || "Parvej Shah — Portfolio";
  const description = seoSection?.description || "Full-stack developer building fast, scalable web products with React, Next.js, Node.js and MongoDB.";

  let content = `# ${title}\n\n`;
  content += `> ${description}\n\n`;

  if (projects.length > 0) {
    content += `## Projects & Case Studies\n\n`;
    projects.forEach(project => {
      content += `- [${project.title}](${siteUrl}/projects/${project.slug}): ${project.summary}\n`;
    });
    content += `\n`;
  }

  if (posts.length > 0) {
    content += `## Blog & Insights\n\n`;
    posts.forEach(post => {
      content += `- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.excerpt}\n`;
    });
    content += `\n`;
  }

  content += `## Contact & Links\n\n`;
  content += `- [Portfolio Home](${siteUrl}/)\n`;
  content += `- [LinkedIn](https://www.linkedin.com/in/parvej-shah)\n`;
  content += `- [GitHub](https://github.com/parvej-shah)\n`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
