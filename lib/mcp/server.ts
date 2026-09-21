import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as auditRepo from "@/lib/data/auditRepo";
import * as postService from "@/lib/services/postService";
import * as projectService from "@/lib/services/projectService";
import * as sectionService from "@/lib/services/sectionService";
import type { MutationContext } from "@/lib/services/mutationContext";
import { requireMcpScope, type McpIdentity } from "@/lib/mcp/auth";
import { sectionKeys } from "@/lib/validators/section";

const idSchema = z.string().min(1);
const versionSchema = z.number().int().positive();
const idempotencyKeySchema = z.string().min(8).max(200);

const blogContentSchema = {
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(240),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  featured: z.boolean().optional(),
  coverImageId: z.string().nullable().optional(),
};

const projectContentSchema = {
  slug: z.string().min(1).max(200).optional(),
  title: z.string().min(1).max(240).optional(),
  summary: z.string().min(1).max(500).optional(),
  problem: z.string().nullable().optional(),
  approach: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  results: z.string().nullable().optional(),
  outcome: z.string().max(140).nullable().optional(),
  outcomeContext: z.string().max(200).nullable().optional(),
  client: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  timeline: z.string().nullable().optional(),
  techStack: z.array(z.string()).optional(),
  keyFeatures: z.array(z.string()).optional(),
  liveUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  order: z.number().int().optional(),
  featured: z.boolean().optional(),
};

function serializable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toolResult(value: unknown, message: string) {
  const data = serializable(value) as Record<string, unknown>;
  return {
    content: [{ type: "text" as const, text: message }],
    structuredContent: data,
  };
}

function collectionResult(key: string, values: unknown[], message: string) {
  return toolResult({ [key]: serializable(values) }, message);
}

function mutationContext(
  identity: McpIdentity,
  toolName: string,
  idempotencyKey: string
): MutationContext {
  return {
    actorId: identity.subject,
    actorType: "MCP_CLIENT",
    clientId: identity.authInfo.clientId,
    toolName,
    requestId: `${identity.subject}:${toolName}:${idempotencyKey}`,
  };
}

async function priorMutationResult(context: MutationContext) {
  const audit = await auditRepo.findAuditByRequestId(context.requestId);
  return audit?.after ?? null;
}

function siteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://parvejshah.com";
  return new URL(path, base).toString();
}

export function createMcpServer(identity: McpIdentity) {
  const server = new McpServer({ name: "parvejshah-content-manager", version: "1.0.0" });

  server.registerTool(
    "get_connection_profile",
    {
      title: "Get connected account",
      description: "Returns the authenticated site owner account for this MCP connection.",
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
      _meta: { "openai/profile": true },
    },
    async () => {
      requireMcpScope(identity, "content:read");
      return toolResult(
        {
          id: identity.subject,
          name: identity.name ?? "Parvej Shah",
          email: identity.email,
        },
        `Connected as ${identity.name ?? identity.email ?? identity.subject}`
      );
    }
  );

  server.registerTool(
    "list_blogs",
    {
      title: "List blogs",
      description: "Lists blog posts, including drafts, scheduled posts, published posts, and archives.",
      inputSchema: { limit: z.number().int().min(1).max(100).default(50) },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async ({ limit }) => {
      requireMcpScope(identity, "content:read");
      const posts = (await postService.listPosts(true)).slice(0, limit);
      return collectionResult("blogs", posts, `Found ${posts.length} blog posts.`);
    }
  );

  server.registerTool(
    "get_blog",
    {
      title: "Get blog",
      description: "Gets one blog post by its internal ID.",
      inputSchema: { blog_id: idSchema },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async ({ blog_id }) => {
      requireMcpScope(identity, "content:read");
      const post = await postService.getPost(blog_id);
      return toolResult(post, `Loaded blog “${post.title}”.`);
    }
  );

  server.registerTool(
    "create_blog",
    {
      title: "Create blog draft",
      description: "Creates a blog as a draft. This tool never publishes content.",
      inputSchema: { ...blogContentSchema, idempotency_key: idempotencyKeySchema },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async ({ idempotency_key, ...input }) => {
      requireMcpScope(identity, "blog:write");
      const context = mutationContext(identity, "create_blog", idempotency_key);
      const prior = await priorMutationResult(context);
      if (prior) return toolResult(prior, "This draft was already created by the same request.");

      const post = await postService.createDraft(
        {
          ...input,
          featured: input.featured ?? false,
          coverImageId: input.coverImageId ?? null,
          publishedAt: null,
        },
        context
      );
      return toolResult(
        { ...post, preview_url: siteUrl(`/admin/posts/${post.id}`) },
        `Created draft “${post.title}”. Review it before publishing.`
      );
    }
  );

  server.registerTool(
    "update_blog",
    {
      title: "Update blog content",
      description: "Updates blog fields without changing its publication status.",
      inputSchema: {
        blog_id: idSchema,
        expected_version: versionSchema,
        idempotency_key: idempotencyKeySchema,
        ...Object.fromEntries(
          Object.entries(blogContentSchema).map(([key, schema]) => [key, schema.optional()])
        ),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async ({ blog_id, expected_version, idempotency_key, ...input }) => {
      requireMcpScope(identity, "blog:write");
      const context = mutationContext(identity, "update_blog", idempotency_key);
      const prior = await priorMutationResult(context);
      if (prior) return toolResult(prior, "This blog update was already applied.");
      const post = await postService.updateContent(blog_id, input, context, expected_version);
      return toolResult(post, `Updated “${post.title}” without changing publication status.`);
    }
  );

  server.registerTool(
    "publish_blog",
    {
      title: "Publish blog",
      description: "Explicitly publishes a reviewed blog post and makes it publicly visible.",
      inputSchema: {
        blog_id: idSchema,
        expected_version: versionSchema,
        idempotency_key: idempotencyKeySchema,
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ blog_id, expected_version, idempotency_key }) => {
      requireMcpScope(identity, "blog:publish");
      const context = mutationContext(identity, "publish_blog", idempotency_key);
      const prior = await priorMutationResult(context);
      if (prior) return toolResult(prior, "This blog was already published by the same request.");
      const post = await postService.publishPost(blog_id, context, expected_version);
      return toolResult(
        { ...post, public_url: siteUrl(`/blog/${post.slug}`) },
        `Published “${post.title}”.`
      );
    }
  );

  for (const [toolName, title, description, action] of [
    ["unpublish_blog", "Unpublish blog", "Removes a blog from the public site and returns it to draft.", postService.unpublishPost],
    ["archive_blog", "Archive blog", "Archives a blog without permanently deleting its audit history.", postService.archivePost],
  ] as const) {
    server.registerTool(
      toolName,
      {
        title,
        description,
        inputSchema: {
          blog_id: idSchema,
          expected_version: versionSchema,
          idempotency_key: idempotencyKeySchema,
        },
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true },
      },
      async ({ blog_id, expected_version, idempotency_key }) => {
        requireMcpScope(identity, "blog:publish");
        const context = mutationContext(identity, toolName, idempotency_key);
        const prior = await priorMutationResult(context);
        if (prior) return toolResult(prior, `The ${toolName} request was already applied.`);
        const post = await action(blog_id, context, expected_version);
        return toolResult(post, `${title} completed for “${post.title}”.`);
      }
    );
  }

  server.registerTool(
    "get_site_section",
    {
      title: "Get website section",
      description: "Gets the editable structured content for one website section.",
      inputSchema: { key: z.enum(sectionKeys) },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async ({ key }) => {
      requireMcpScope(identity, "content:read");
      const data = await sectionService.getSectionContent(key);
      return toolResult({ key, data }, `Loaded the “${key}” website section.`);
    }
  );

  server.registerTool(
    "update_site_section",
    {
      title: "Update website section",
      description:
        "Replaces one website section after validating its section-specific content schema.",
      inputSchema: {
        key: z.enum(sectionKeys),
        data: z.record(z.string(), z.unknown()),
        idempotency_key: idempotencyKeySchema,
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async ({ key, data, idempotency_key }) => {
      requireMcpScope(identity, "site:write");
      const context = mutationContext(identity, "update_site_section", idempotency_key);
      const prior = await priorMutationResult(context);
      if (prior) {
        const priorSection = prior as { data?: unknown };
        return toolResult(
          { key, data: priorSection.data ?? prior },
          "This section update was already applied."
        );
      }
      const section = await sectionService.updateSectionContent(key, data, context);
      return toolResult({ key, data: section }, `Updated the “${key}” website section.`);
    }
  );

  server.registerTool(
    "list_projects",
    {
      title: "List projects",
      description: "Lists portfolio projects, including unpublished and archived entries.",
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async () => {
      requireMcpScope(identity, "content:read");
      const projects = await projectService.listProjects(true);
      return collectionResult("projects", projects, `Found ${projects.length} projects.`);
    }
  );

  server.registerTool(
    "get_project",
    {
      title: "Get project",
      description: "Gets one portfolio project by its internal ID.",
      inputSchema: { project_id: idSchema },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async ({ project_id }) => {
      requireMcpScope(identity, "content:read");
      const project = await projectService.getProject(project_id);
      return toolResult(project, `Loaded project “${project.title}”.`);
    }
  );

  server.registerTool(
    "update_project",
    {
      title: "Update project",
      description: "Updates project content without publishing or unpublishing it.",
      inputSchema: {
        project_id: idSchema,
        expected_version: versionSchema,
        idempotency_key: idempotencyKeySchema,
        ...projectContentSchema,
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async ({ project_id, expected_version, idempotency_key, ...input }) => {
      requireMcpScope(identity, "project:write");
      const context = mutationContext(identity, "update_project", idempotency_key);
      const prior = await priorMutationResult({
        ...context,
        requestId: `${context.requestId}:update`,
      });
      if (prior) return toolResult(prior, "This project update was already applied.");
      const project = await projectService.updateProject(
        project_id,
        input,
        context,
        expected_version
      );
      return toolResult(project, `Updated project “${project.title}”.`);
    }
  );

  server.registerTool(
    "create_project",
    {
      title: "Create project draft",
      description: "Creates a portfolio project as a draft. This tool never publishes it.",
      inputSchema: {
        slug: z.string().min(1).max(200),
        title: z.string().min(1).max(240),
        summary: z.string().min(1).max(500),
        techStack: z.array(z.string()).default([]),
        keyFeatures: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        order: z.number().int().default(0),
        idempotency_key: idempotencyKeySchema,
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async ({ idempotency_key, ...input }) => {
      requireMcpScope(identity, "project:write");
      const context = mutationContext(identity, "create_project", idempotency_key);
      const prior = await priorMutationResult({ ...context, requestId: `${context.requestId}:create` });
      if (prior) return toolResult(prior, "This project draft was already created.");
      const project = await projectService.createProject(
        {
          ...input,
          status: "DRAFT",
          problem: null,
          approach: null,
          solution: null,
          results: null,
          outcome: null,
          outcomeContext: null,
          client: null,
          role: null,
          timeline: null,
          liveUrl: null,
          githubUrl: null,
        },
        context
      );
      return toolResult(
        { ...project, preview_url: siteUrl(`/admin/projects/${project.id}`) },
        `Created project draft “${project.title}”.`
      );
    }
  );

  for (const [toolName, title, description, action] of [
    ["publish_project", "Publish project", "Makes a reviewed project publicly visible.", projectService.publishProject],
    ["unpublish_project", "Unpublish project", "Removes a project from the public site and returns it to draft.", projectService.unpublishProject],
    ["archive_project", "Archive project", "Archives a project without permanently deleting its audit history.", projectService.archiveProject],
  ] as const) {
    server.registerTool(
      toolName,
      {
        title,
        description,
        inputSchema: {
          project_id: idSchema,
          expected_version: versionSchema,
          idempotency_key: idempotencyKeySchema,
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: toolName !== "publish_project",
          idempotentHint: true,
          openWorldHint: toolName === "publish_project",
        },
      },
      async ({ project_id, expected_version, idempotency_key }) => {
        requireMcpScope(identity, "project:write");
        const context = mutationContext(identity, toolName, idempotency_key);
        const prior = await priorMutationResult(context);
        if (prior) return toolResult(prior, `The ${toolName} request was already applied.`);
        const project = await action(project_id, context, expected_version);
        return toolResult(project, `${title} completed for “${project.title}”.`);
      }
    );
  }

  server.registerTool(
    "get_change_history",
    {
      title: "Get content change history",
      description: "Returns recent audited content mutations made by admins, automations, and MCP clients.",
      inputSchema: { limit: z.number().int().min(1).max(100).default(25) },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async ({ limit }) => {
      requireMcpScope(identity, "content:read");
      const changes = await auditRepo.listAudits(limit);
      return collectionResult("changes", changes, `Loaded ${changes.length} audited changes.`);
    }
  );

  return server;
}
