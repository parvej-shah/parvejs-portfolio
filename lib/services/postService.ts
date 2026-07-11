import { revalidateTag } from "next/cache";
import * as postRepo from "@/lib/data/postRepo";
import type { CreatePost, UpdatePost } from "@/lib/types";

export class PostNotFoundError extends Error {
  constructor(id: string) {
    super(`Post not found: ${id}`);
    this.name = "PostNotFoundError";
  }
}

export class DuplicateSlugError extends Error {
  constructor(slug: string) {
    super(`Slug already in use: ${slug}`);
    this.name = "DuplicateSlugError";
  }
}

export function listPosts() {
  return postRepo.findAllPosts();
}

// Promotes due SCHEDULED posts to PUBLISHED. Called by the cron endpoint; the
// publishedAt <= now filter in lib/data/public.ts keeps visibility correct even between runs.
export async function publishDueScheduled() {
  const due = await postRepo.findDueScheduledPosts();
  if (due.length === 0) return { publishedCount: 0 };

  await postRepo.publishPosts(due.map((post) => post.id));
  revalidateTag("posts", "max");
  return { publishedCount: due.length };
}

export async function getPost(id: string) {
  const post = await postRepo.findPostById(id);
  if (!post) throw new PostNotFoundError(id);
  return post;
}

export async function createPost(data: CreatePost) {
  const existing = await postRepo.findPostBySlug(data.slug);
  if (existing) throw new DuplicateSlugError(data.slug);

  const post = await postRepo.createPost({
    ...data,
    publishedAt: data.status === "PUBLISHED" ? new Date() : (data.publishedAt ?? null),
  });
  revalidateTag("posts", "max");
  return post;
}

export async function updatePost(id: string, data: UpdatePost) {
  const current = await getPost(id);

  if (data.slug) {
    const existing = await postRepo.findPostBySlug(data.slug);
    if (existing && existing.id !== id) throw new DuplicateSlugError(data.slug);
  }

  const isNewlyPublished = data.status === "PUBLISHED" && current.status !== "PUBLISHED";

  const post = await postRepo.updatePost(id, {
    ...data,
    publishedAt: isNewlyPublished ? new Date() : data.publishedAt,
  });
  revalidateTag("posts", "max");
  return post;
}

export async function deletePost(id: string) {
  await getPost(id);
  const post = await postRepo.deletePost(id);
  revalidateTag("posts", "max");
  return post;
}
