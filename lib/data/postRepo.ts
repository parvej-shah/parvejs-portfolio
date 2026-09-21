import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreatePost, UpdatePost } from "@/lib/types";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;

// Repository pattern: all Post Prisma access lives here. No business logic.
export function findAllPosts(includeArchived = false) {
  return prisma.post.findMany({
    where: includeArchived ? undefined : { status: { not: "ARCHIVED" } },
    orderBy: { createdAt: "desc" },
  });
}

export function findPostById(id: string, db: DatabaseClient = prisma) {
  return db.post.findUnique({ where: { id }, include: { coverImage: true } });
}

export function findPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export function findDueScheduledPosts() {
  return prisma.post.findMany({
    where: { status: "SCHEDULED", publishedAt: { lte: new Date() } },
    select: { id: true },
  });
}

export function publishPosts(ids: string[]) {
  return prisma.post.updateMany({ where: { id: { in: ids } }, data: { status: "PUBLISHED" } });
}

export function createPost(data: CreatePost, db: DatabaseClient = prisma) {
  return db.post.create({ data, include: { coverImage: true } });
}

export function updatePost(id: string, data: UpdatePost, db: DatabaseClient = prisma) {
  return db.post.update({
    where: { id },
    data: { ...data, version: { increment: 1 } },
    include: { coverImage: true },
  });
}

export async function updatePostIfVersion(
  id: string,
  expectedVersion: number,
  data: UpdatePost,
  db: DatabaseClient = prisma
) {
  const result = await db.post.updateMany({
    where: { id, version: expectedVersion },
    data: { ...data, version: { increment: 1 } },
  });
  if (result.count === 0) return null;
  return findPostById(id, db);
}

export async function upsertPostWithCover(data: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  publishedAt?: Date | null;
  coverImageUrl?: string | null;
}) {
  let coverImageId: string | undefined = undefined;

  if (data.coverImageUrl) {
    const assetKey = `blog-${data.slug}-cover`;
    const asset = await prisma.asset.upsert({
      where: { key: assetKey },
      update: {
        url: data.coverImageUrl,
        alt: data.title,
      },
      create: {
        key: assetKey,
        url: data.coverImageUrl,
        alt: data.title,
      },
    });
    coverImageId = asset.id;
  }

  return prisma.post.upsert({
    where: { slug: data.slug },
    update: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      status: data.status,
      publishedAt: data.publishedAt,
      ...(coverImageId !== undefined ? { coverImageId } : {}),
    },
    create: {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      status: data.status,
      publishedAt: data.publishedAt,
      ...(coverImageId !== undefined ? { coverImageId } : {}),
    },
  });
}
