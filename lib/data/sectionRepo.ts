import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SectionKey } from "@/lib/validators/section";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;

// Repository pattern: all SiteContent Prisma access lives here. No business logic.
export function findSectionByKey(key: SectionKey) {
  return prisma.siteContent.findUnique({ where: { key } });
}

export function upsertSection(key: SectionKey, data: unknown, db: DatabaseClient = prisma) {
  return db.siteContent.upsert({
    where: { key },
    update: { data: data as never },
    create: { key, data: data as never },
  });
}
