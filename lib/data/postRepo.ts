import { prisma } from "@/lib/prisma";
import type { CreatePost, UpdatePost } from "@/lib/types";

// Repository pattern: all Post Prisma access lives here. No business logic.
export function findAllPosts() {
  return prisma.post.findMany({ orderBy: { createdAt: "desc" } });
}

export function findPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export function findPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export function createPost(data: CreatePost) {
  return prisma.post.create({ data });
}

export function updatePost(id: string, data: UpdatePost) {
  return prisma.post.update({ where: { id }, data });
}

export function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
