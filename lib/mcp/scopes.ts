/**
 * The MCP permission vocabulary. Kept in its own module so the OAuth
 * authorization server and the resource server share one source of truth
 * without importing each other.
 */
export const MCP_SCOPES = [
  "content:read",
  "blog:write",
  "blog:publish",
  "project:write",
  "media:write",
  "site:write",
] as const;

export type McpScope = (typeof MCP_SCOPES)[number];

export function isMcpScope(value: string): value is McpScope {
  return (MCP_SCOPES as readonly string[]).includes(value);
}

/** Parses an OAuth `scope` string, dropping anything this server does not define. */
export function parseScopes(raw: string | null | undefined): McpScope[] {
  if (!raw) return [];
  const unique = new Set(raw.split(/\s+/).filter(Boolean).filter(isMcpScope));
  return [...unique];
}
