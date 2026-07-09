import { revalidateTag } from "next/cache";
import * as projectRepo from "@/lib/data/projectRepo";
import type { CreateProject, UpdateProject } from "@/lib/types";

export class ProjectNotFoundError extends Error {
  constructor(id: string) {
    super(`Project not found: ${id}`);
    this.name = "ProjectNotFoundError";
  }
}

export class DuplicateSlugError extends Error {
  constructor(slug: string) {
    super(`Slug already in use: ${slug}`);
    this.name = "DuplicateSlugError";
  }
}

export function listProjects() {
  return projectRepo.findAllProjects();
}

export async function getProject(id: string) {
  const project = await projectRepo.findProjectById(id);
  if (!project) throw new ProjectNotFoundError(id);
  return project;
}

export async function createProject(data: CreateProject) {
  const existing = await projectRepo.findProjectBySlug(data.slug);
  if (existing) throw new DuplicateSlugError(data.slug);
  const project = await projectRepo.createProject(data);
  revalidateTag("projects", "max");
  return project;
}

export async function updateProject(id: string, data: UpdateProject) {
  await getProject(id);

  if (data.slug) {
    const existing = await projectRepo.findProjectBySlug(data.slug);
    if (existing && existing.id !== id) throw new DuplicateSlugError(data.slug);
  }

  const project = await projectRepo.updateProject(id, data);
  revalidateTag("projects", "max");
  return project;
}

export async function deleteProject(id: string) {
  await getProject(id);
  const project = await projectRepo.deleteProject(id);
  revalidateTag("projects", "max");
  return project;
}

export async function reorderProjects(orderedIds: string[]) {
  await projectRepo.reorderProjects(orderedIds);
  revalidateTag("projects", "max");
}
