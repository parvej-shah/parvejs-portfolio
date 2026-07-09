import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSectionSchema, type SectionKey } from "@/lib/validators/section";
import type { SectionData } from "@/lib/types";

const publishedProjectSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  status: true,
  problem: true,
  approach: true,
  solution: true,
  results: true,
  client: true,
  role: true,
  timeline: true,
  techStack: true,
  keyFeatures: true,
  liveUrl: true,
  githubUrl: true,
  order: true,
  featured: true,
  createdAt: true,
  updatedAt: true,
  gallery: {
    orderBy: { createdAt: "asc" as const },
  },
} as const;

const publishedPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  status: true,
  featured: true,
  coverImageId: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  coverImage: true,
} as const;

// Repository-style public readers: published-only and cached for SSR consumers.
const getPublishedProjectsCached = unstable_cache(
  async () =>
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { updatedAt: "desc" }],
      select: publishedProjectSelect,
    }),
  ["published-projects"],
  { tags: ["projects"] }
);

const getPublishedPostsCached = unstable_cache(
  async () =>
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      select: publishedPostSelect,
    }),
  ["published-posts"],
  { tags: ["posts"] }
);

// unstable_cache round-trips values through JSON, so Date fields come back as strings —
// restore them to real Date instances to match the Prisma-inferred return types.
function revivePostDates<T extends { publishedAt: Date | string | null; createdAt: Date | string; updatedAt: Date | string }>(
  post: T
) {
  return {
    ...post,
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  };
}

function reviveProjectDates<T extends { createdAt: Date | string; updatedAt: Date | string }>(project: T) {
  return {
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  };
}

export async function getPublishedProjects() {
  const projects = await getPublishedProjectsCached();
  return projects.map(reviveProjectDates);
}

const getProjectBySlugCached = unstable_cache(
  async (slug: string) =>
    prisma.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: publishedProjectSelect,
    }),
  ["published-project-by-slug"],
  { tags: ["projects"] }
);

export const getProjectBySlug = cache(async (slug: string) => {
  const project = await getProjectBySlugCached(slug);
  return project ? reviveProjectDates(project) : null;
});

export async function getPublishedPosts() {
  const posts = await getPublishedPostsCached();
  return posts.map(revivePostDates);
}

const getPostBySlugCached = unstable_cache(
  async (slug: string) =>
    prisma.post.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: publishedPostSelect,
    }),
  ["published-post-by-slug"],
  { tags: ["posts"] }
);

export const getPostBySlug = cache(async (slug: string) => {
  const post = await getPostBySlugCached(slug);
  return post ? revivePostDates(post) : null;
});

const getSectionCached = unstable_cache(
  async (key: SectionKey) => {
    const section = await prisma.siteContent.findUnique({ where: { key } });
    if (!section) return null;
    return getSectionSchema(key).parse(section.data);
  },
  ["section-by-key"],
  { tags: ["sections"] }
);

export const getSection = cache(async <K extends SectionKey>(key: K) => {
  return (await getSectionCached(key)) as SectionData<K> | null;
});

