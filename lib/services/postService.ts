import { revalidateTag } from "next/cache";
import * as auditRepo from "@/lib/data/auditRepo";
import * as assetRepo from "@/lib/data/assetRepo";
import * as postRepo from "@/lib/data/postRepo";
import { triggerPostSyndication } from "@/lib/services/syndicationService";
import type { MutationContext } from "@/lib/services/mutationContext";
import type { CreatePost, UpdatePost } from "@/lib/types";

type DraftPostInput = Omit<CreatePost, "status">;
type PostContentUpdate = Omit<UpdatePost, "status" | "publishedAt">;

export class PostNotFoundError extends Error {
  constructor(id: string) {
    super(`Post not found: ${id}`);
    this.name = "PostNotFoundError";
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
    super("A published post slug cannot be changed");
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
    super("The post changed since it was read; reload it before trying again");
    this.name = "ContentVersionConflictError";
  }
}

function childContext(context: MutationContext, action: string): MutationContext {
  return { ...context, requestId: `${context.requestId}:${action}` };
}

export function listPosts(includeArchived = false) {
  return postRepo.findAllPosts(includeArchived);
}

export async function getPost(id: string) {
  const post = await postRepo.findPostById(id);
  if (!post) throw new PostNotFoundError(id);
  return post;
}

export async function createDraft(data: DraftPostInput, context: MutationContext) {
  const existing = await postRepo.findPostBySlug(data.slug);
  if (existing) throw new DuplicateSlugError(data.slug);

  const post = await auditRepo.runAuditedMutation(
    context,
    { action: "CREATE_DRAFT", targetType: "POST" },
    (tx) => postRepo.createPost({ ...data, status: "DRAFT" }, tx),
    (created) => created.id
  );
  revalidateTag("posts", "max");
  return post;
}

export async function updateContent(
  id: string,
  data: PostContentUpdate,
  context: MutationContext,
  expectedVersion?: number
) {
  const current = await getPost(id);
  if (current.status === "ARCHIVED") throw new ArchivedContentError();
  if (data.slug && data.slug !== current.slug && current.status === "PUBLISHED") {
    throw new PublishedSlugImmutableError();
  }
  if (data.slug) {
    const existing = await postRepo.findPostBySlug(data.slug);
    if (existing && existing.id !== id) throw new DuplicateSlugError(data.slug);
  }

  const post = await auditRepo.runAuditedMutation(
    context,
    { action: "UPDATE_CONTENT", targetType: "POST", targetId: id, before: current },
    async (tx) => {
      if (expectedVersion === undefined) return postRepo.updatePost(id, data, tx);
      const updated = await postRepo.updatePostIfVersion(id, expectedVersion, data, tx);
      if (!updated) throw new ContentVersionConflictError();
      return updated;
    },
    (updated) => updated.id
  );
  revalidateTag("posts", "max");
  return post;
}

async function transitionPost(
  id: string,
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED",
  action: string,
  data: UpdatePost,
  context: MutationContext,
  expectedVersion?: number
) {
  const current = await getPost(id);
  if (current.status === "ARCHIVED" && status !== "ARCHIVED") throw new ArchivedContentError();

  const post = await auditRepo.runAuditedMutation(
    context,
    { action, targetType: "POST", targetId: id, before: current },
    async (tx) => {
      const update = { ...data, status };
      if (expectedVersion === undefined) return postRepo.updatePost(id, update, tx);
      const updated = await postRepo.updatePostIfVersion(id, expectedVersion, update, tx);
      if (!updated) throw new ContentVersionConflictError();
      return updated;
    },
    (updated) => updated.id
  );
  revalidateTag("posts", "max");
  return post;
}

export async function publishPost(id: string, context: MutationContext, expectedVersion?: number) {
  const current = await getPost(id);
  if (current.status === "PUBLISHED") return current;
  const post = await transitionPost(
    id,
    "PUBLISHED",
    "PUBLISH",
    { publishedAt: new Date() },
    context,
    expectedVersion
  );
  const syndication = await triggerPostSyndication(post);
  await auditRepo.createAudit(childContext(context, "syndication"), {
    action: "SYNDICATION",
    targetType: "POST",
    targetId: post.id,
    after: syndication,
  });
  return post;
}

export function unpublishPost(id: string, context: MutationContext, expectedVersion?: number) {
  return transitionPost(id, "DRAFT", "UNPUBLISH", {}, context, expectedVersion);
}

export function schedulePost(
  id: string,
  publishedAt: Date,
  context: MutationContext,
  expectedVersion?: number
) {
  if (publishedAt <= new Date()) throw new Error("Scheduled posts require a future publish date");
  return transitionPost(id, "SCHEDULED", "SCHEDULE", { publishedAt }, context, expectedVersion);
}

export function archivePost(id: string, context: MutationContext, expectedVersion?: number) {
  return transitionPost(id, "ARCHIVED", "ARCHIVE", {}, context, expectedVersion);
}

// Compatibility orchestrator for the admin UI. Status changes still go through the
// explicit transition commands above instead of a generic repository update.
export async function createPost(data: CreatePost, context: MutationContext) {
  const { status, ...content } = data;
  const draft = await createDraft(content, childContext(context, "create"));
  if (status === "PUBLISHED") {
    return publishPost(draft.id, childContext(context, "publish"), draft.version);
  }
  if (status === "SCHEDULED" && data.publishedAt) {
    return schedulePost(draft.id, data.publishedAt, childContext(context, "schedule"), draft.version);
  }
  return draft;
}

export async function updatePost(id: string, data: UpdatePost, context: MutationContext) {
  const current = await getPost(id);
  const { status, publishedAt, ...content } = data;
  const updated = Object.keys(content).length
    ? await updateContent(id, content, childContext(context, "update"), current.version)
    : current;

  if (!status || status === updated.status) return updated;
  if (status === "PUBLISHED") {
    return publishPost(id, childContext(context, "publish"), updated.version);
  }
  if (status === "SCHEDULED" && publishedAt) {
    return schedulePost(id, publishedAt, childContext(context, "schedule"), updated.version);
  }
  if (status === "ARCHIVED") {
    return archivePost(id, childContext(context, "archive"), updated.version);
  }
  return unpublishPost(id, childContext(context, "unpublish"), updated.version);
}

export async function publishDueScheduled(context: MutationContext) {
  const due = await postRepo.findDueScheduledPosts();
  for (const post of due) {
    await publishPost(post.id, childContext(context, post.id));
  }
  return { publishedCount: due.length };
}

export async function upsertPostFromWebhook(
  data: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
    publishedAt?: Date | null;
    coverImageUrl?: string | null;
  },
  context: MutationContext
) {
  const coverImage = data.coverImageUrl
    ? await assetRepo.upsertExternalPostCover(data.slug, data.title, data.coverImageUrl)
    : null;
  const existing = await postRepo.findPostBySlug(data.slug);
  if (!existing) {
    return createPost(
      {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        publishedAt: data.publishedAt,
        coverImageId: coverImage?.id ?? null,
        featured: false,
      },
      context
    );
  }

  return updatePost(
    existing.id,
    {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      status: data.status,
      publishedAt: data.publishedAt,
      ...(coverImage ? { coverImageId: coverImage.id } : {}),
    },
    context
  );
}
