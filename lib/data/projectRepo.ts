import { prisma } from "@/lib/prisma";
import type { CreateProject, UpdateProject } from "@/lib/types";

const galleryInclude = { gallery: { orderBy: { createdAt: "asc" as const } } };

// Repository pattern: all Project Prisma access lives here. No business logic.
export function findAllProjects() {
  return prisma.project.findMany({ orderBy: { order: "asc" }, include: galleryInclude });
}

export function findProjectById(id: string) {
  return prisma.project.findUnique({ where: { id }, include: galleryInclude });
}

export function findProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export function createProject(data: CreateProject) {
  return prisma.project.create({ data, include: galleryInclude });
}

export function updateProject(id: string, data: UpdateProject) {
  return prisma.project.update({ where: { id }, data, include: galleryInclude });
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export function reorderProjects(orderedIds: string[]) {
  return prisma.$transaction(
    orderedIds.map((id, order) => prisma.project.update({ where: { id }, data: { order } }))
  );
}
