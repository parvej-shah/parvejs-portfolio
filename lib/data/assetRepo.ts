import { prisma } from "@/lib/prisma";
import type { CreateAsset, UpdateAsset } from "@/lib/types";

// Repository pattern: all Asset Prisma access lives here. No business logic.
export function createAsset(data: CreateAsset) {
  return prisma.asset.create({ data });
}

export function findAssetById(id: string) {
  return prisma.asset.findUnique({ where: { id } });
}

export function updateAsset(id: string, data: UpdateAsset) {
  return prisma.asset.update({ where: { id }, data });
}

export function deleteAsset(id: string) {
  return prisma.asset.delete({ where: { id } });
}

export function upsertExternalPostCover(slug: string, title: string, url: string) {
  const key = `blog-${slug}-cover`;
  return prisma.asset.upsert({
    where: { key },
    update: { url, alt: title },
    create: { key, url, alt: title },
  });
}
