import { prisma } from "@/lib/prisma";
import type { CreateAsset } from "@/lib/types";

// Repository pattern: all Asset Prisma access lives here. No business logic.
export function createAsset(data: CreateAsset) {
  return prisma.asset.create({ data });
}
