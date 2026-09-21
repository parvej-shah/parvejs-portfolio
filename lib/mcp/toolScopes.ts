import type { McpScope } from "@/lib/mcp/scopes";

/**
 * Scope required by each tool. Enforced twice on purpose: here at the HTTP
 * boundary, so an unauthorized call fails with 403 and a WWW-Authenticate
 * challenge rather than a tool error, and again inside each tool handler.
 */
export const TOOL_SCOPES: Record<string, McpScope> = {
  get_connection_profile: "content:read",
  list_blogs: "content:read",
  get_blog: "content:read",
  list_projects: "content:read",
  get_project: "content:read",
  get_site_section: "content:read",
  get_change_history: "content:read",
  create_blog: "blog:write",
  update_blog: "blog:write",
  publish_blog: "blog:publish",
  unpublish_blog: "blog:publish",
  archive_blog: "blog:publish",
  create_project: "project:write",
  update_project: "project:write",
  publish_project: "project:write",
  unpublish_project: "project:write",
  archive_project: "project:write",
  update_site_section: "site:write",
};
