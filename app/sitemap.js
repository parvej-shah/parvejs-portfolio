import { getPublishedPosts, getPublishedProjects, getSection } from "@/lib/data/public";

const defaultSiteUrl = "https://parvejshah.vercel.app";

export default async function sitemap() {
  const [seo, projects, posts] = await Promise.all([
    getSection("seo"),
    getPublishedProjects(),
    getPublishedPosts(),
  ]);
  const baseUrl = seo?.siteUrl || defaultSiteUrl;

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
