import { revalidateTag } from "next/cache";
import * as auditRepo from "@/lib/data/auditRepo";
import * as projectRepo from "@/lib/data/projectRepo";
import type { MutationContext } from "@/lib/services/mutationContext";
import type { CreateProject, UpdateProject } from "@/lib/types";

type ProjectContentUpdate = Omit<UpdateProject, "status">;

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

export class PublishedSlugImmutableError extends Error {
  constructor() {
    super("A published project slug cannot be changed");
    this.name = "PublishedSlugImmutableError";
  }
}

export class ArchivedContentError extends Error {
  constructor() {
    super("Archived content cannot be modified or published");
    this.name = "ArchivedContentError";
  }
}

export class ContentVersionConflictError extends Error {
  constructor() {
    super("The project changed since it was read; reload it before trying again");
    this.name = "ContentVersionConflictError";
  }
}

function childContext(context: MutationContext, action: string): MutationContext {
  return { ...context, requestId: `${context.requestId}:${action}` };
}

export function listProjects(includeArchived = false) {
  return projectRepo.findAllProjects(includeArchived);
}

export async function getProject(id: string) {
  const project = await projectRepo.findProjectById(id);
  if (!project) throw new ProjectNotFoundError(id);
  return project;
}

export async function createProject(data: CreateProject, context: MutationContext) {
  const existing = await projectRepo.findProjectBySlug(data.slug);
  if (existing) throw new DuplicateSlugError(data.slug);

  const { status, ...content } = data;
  const project = await auditRepo.runAuditedMutation(
    childContext(context, "create"),
    { action: "CREATE_DRAFT", targetType: "PROJECT" },
    (tx) => projectRepo.createProject({ ...content, status: "DRAFT" }, tx),
    (created) => created.id
  );

  if (status === "PUBLISHED") {
    return transitionProject(
      project.id,
      "PUBLISHED",
      "PUBLISH",
      childContext(context, "publish")
    );
  }
  revalidateTag("projects", "max");
  return project;
}

export async function updateProject(
  id: string,
  data: UpdateProject,
  context: MutationContext,
  expectedVersion?: number
) {
  const current = await getProject(id);
  if (current.status === "ARCHIVED") throw new ArchivedContentError();

  const { status, ...content } = data;
  if (content.slug && content.slug !== current.slug && current.status === "PUBLISHED") {
    throw new PublishedSlugImmutableError();
  }
  if (content.slug) {
    const existing = await projectRepo.findProjectBySlug(content.slug);
    if (existing && existing.id !== id) throw new DuplicateSlugError(content.slug);
  }

  const updated = Object.keys(content).length
    ? await auditRepo.runAuditedMutation(
        childContext(context, "update"),
        { action: "UPDATE_CONTENT", targetType: "PROJECT", targetId: id, before: current },
        async (tx) => {
          if (expectedVersion === undefined) return projectRepo.updateProject(id, content, tx);
          const result = await projectRepo.updateProjectIfVersion(id, expectedVersion, content, tx);
          if (!result) throw new ContentVersionConflictError();
          return result;
        },
        (result) => result.id
      )
    : current;

  if (!status || status === updated.status) {
    revalidateTag("projects", "max");
    return updated;
  }
  if (status === "PUBLISHED") {
    return transitionProject(id, status, "PUBLISH", childContext(context, "publish"), updated.version);
  }
  if (status === "ARCHIVED") {
    return transitionProject(id, status, "ARCHIVE", childContext(context, "archive"), updated.version);
  }
  return transitionProject(id, "DRAFT", "UNPUBLISH", childContext(context, "unpublish"), updated.version);
}

async function transitionProject(
  id: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
  action: string,
  context: MutationContext,
  expectedVersion?: number
) {
  const current = await getProject(id);
  if (current.status === "ARCHIVED" && status !== "ARCHIVED") throw new ArchivedContentError();

  const project = await auditRepo.runAuditedMutation(
    context,
    { action, targetType: "PROJECT", targetId: id, before: current },
    async (tx) => {
      if (expectedVersion === undefined) return projectRepo.updateProject(id, { status }, tx);
      const result = await projectRepo.updateProjectIfVersion(id, expectedVersion, { status }, tx);
      if (!result) throw new ContentVersionConflictError();
      return result;
    },
    (updated) => updated.id
  );
  revalidateTag("projects", "max");
  return project;
}

export function publishProject(id: string, context: MutationContext, expectedVersion?: number) {
  return transitionProject(id, "PUBLISHED", "PUBLISH", context, expectedVersion);
}

export function unpublishProject(id: string, context: MutationContext, expectedVersion?: number) {
  return transitionProject(id, "DRAFT", "UNPUBLISH", context, expectedVersion);
}

export function archiveProject(id: string, context: MutationContext, expectedVersion?: number) {
  return transitionProject(id, "ARCHIVED", "ARCHIVE", context, expectedVersion);
}

export async function reorderProjects(orderedIds: string[], context: MutationContext) {
  await projectRepo.reorderProjects(orderedIds);
  await auditRepo.createAudit(context, {
    action: "REORDER",
    targetType: "PROJECT_COLLECTION",
    targetId: "projects",
    after: { orderedIds },
  });
  revalidateTag("projects", "max");
}
