import { prisma } from "@/lib/prisma";
import type { CreateProject, UpdateProject } from "@/lib/types";

// Repository pattern: all Project Prisma access lives here. No business logic.
export function findAllProjects() {
  return prisma.project.findMany({ orderBy: { order: "asc" } });
}

export function findProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export function findProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export function createProject(data: CreateProject) {
  return prisma.project.create({ data });
}

export function updateProject(id: string, data: UpdateProject) {
  return prisma.project.update({ where: { id }, data });
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}
