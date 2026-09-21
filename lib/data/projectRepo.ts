import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateProject, UpdateProject } from "@/lib/types";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;

const galleryInclude = { gallery: { orderBy: { createdAt: "asc" as const } } };

// Repository pattern: all Project Prisma access lives here. No business logic.
export function findAllProjects(includeArchived = false) {
  return prisma.project.findMany({
    where: includeArchived ? undefined : { status: { not: "ARCHIVED" } },
    orderBy: { order: "asc" },
    include: galleryInclude,
  });
}

export function findProjectById(id: string, db: DatabaseClient = prisma) {
  return db.project.findUnique({ where: { id }, include: galleryInclude });
}

export function findProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export function createProject(data: CreateProject, db: DatabaseClient = prisma) {
  return db.project.create({ data, include: galleryInclude });
}

export function updateProject(id: string, data: UpdateProject, db: DatabaseClient = prisma) {
  return db.project.update({
    where: { id },
    data: { ...data, version: { increment: 1 } },
    include: galleryInclude,
  });
}

export async function updateProjectIfVersion(
  id: string,
  expectedVersion: number,
  data: UpdateProject,
  db: DatabaseClient = prisma
) {
  const result = await db.project.updateMany({
    where: { id, version: expectedVersion },
    data: { ...data, version: { increment: 1 } },
  });
  if (result.count === 0) return null;
  return findProjectById(id, db);
}

export function reorderProjects(orderedIds: string[]) {
  return prisma.$transaction(
    orderedIds.map((id, order) => prisma.project.update({ where: { id }, data: { order } }))
  );
}
