import { prisma } from "@/lib/prisma";
import type { CreateAsset } from "@/lib/types";

// Repository pattern: all Asset Prisma access lives here. No business logic.
export function createAsset(data: CreateAsset) {
  return prisma.asset.create({ data });
}

export function findAssetById(id: string) {
  return prisma.asset.findUnique({ where: { id } });
}

export function deleteAsset(id: string) {
  return prisma.asset.delete({ where: { id } });
}
