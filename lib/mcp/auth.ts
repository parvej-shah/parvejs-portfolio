import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { MCP_SCOPES, type McpScope } from "@/lib/mcp/scopes";
import { getOAuthConfig, getProtectedResourceMetadata, OAuthConfigurationError } from "@/lib/oauth/config";
import { verifyAccessToken } from "@/lib/oauth/tokens";

export { MCP_SCOPES } from "@/lib/mcp/scopes";

/** Re-exported under the resource server's name so callers keep one import. */
export class McpAuthConfigurationError extends OAuthConfigurationError {}
export class McpAuthenticationError extends Error {}
export class McpAuthorizationError extends Error {
  constructor(
    message: string,
    readonly scope?: string
  ) {
    super(message);
  }
}

export type McpIdentity = {
  authInfo: AuthInfo;
  subject: string;
  email?: string;
  name?: string;
};

function scopesFrom(scope: string | undefined): McpScope[] {
  if (!scope) return [];
  return scope
    .split(/\s+/)
    .filter(Boolean)
    .filter((value): value is McpScope => (MCP_SCOPES as readonly string[]).includes(value));
}

/**
 * Validates a bearer token issued by this deployment's own authorization server:
 * signature, issuer, audience (the MCP resource identifier), and expiry.
 */
export async function authenticateMcpRequest(request: Request): Promise<McpIdentity> {
  const config = getOAuthConfig();
  const authorization = request.headers.get("authorization");
  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    throw new McpAuthenticationError("A bearer access token is required");
  }

  const token = authorization.slice("Bearer ".length).trim();
  try {
    const claims = await verifyAccessToken(token);
    return {
      subject: claims.sub,
      email: claims.email,
      name: claims.name,
      authInfo: {
        token,
        clientId: claims.client_id ?? "unknown-mcp-client",
        scopes: scopesFrom(claims.scope),
        expiresAt: claims.exp,
        resource: new URL(config.resource),
        extra: { sub: claims.sub, email: claims.email, name: claims.name },
      },
    };
  } catch (error) {
    if (error instanceof OAuthConfigurationError) throw error;
    throw new McpAuthenticationError("The bearer access token is invalid or expired");
  }
}

export function requireMcpScope(identity: McpIdentity, scope: McpScope) {
  if (!identity.authInfo.scopes.includes(scope)) {
    throw new McpAuthorizationError(`Missing required OAuth scope: ${scope}`, scope);
  }
}

export function getMcpResourceMetadata() {
  return getProtectedResourceMetadata();
}

/**
 * RFC 9728 locates a resource's metadata by inserting the well-known path before
 * the resource path, so `/mcp` is advertised at `…/oauth-protected-resource/mcp`.
 */
export function getMcpResourceMetadataUrl() {
  const { resource } = getOAuthConfig();
  const { pathname, origin } = new URL(resource);
  return `${origin}/.well-known/oauth-protected-resource${pathname}`;
}
