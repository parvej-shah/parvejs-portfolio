import { MCP_SCOPES } from "@/lib/mcp/scopes";

export class OAuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OAuthConfigurationError";
  }
}

export type OAuthConfig = {
  /** Authorization server issuer — also the public origin of the MCP deployment. */
  issuer: string;
  /** Canonical resource identifier (RFC 8707) that access tokens are audienced to. */
  resource: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  registrationEndpoint: string;
  revocationEndpoint: string;
  jwksUri: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  allowedSubject?: string;
  allowedEmail?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new OAuthConfigurationError(`Missing required environment variable: ${name}`);
  return value;
}

/**
 * Every endpoint is derived from one public origin so a deployment cannot end up
 * advertising metadata that disagrees with the URLs it actually serves.
 */
export function getOAuthConfig(): OAuthConfig {
  const issuer = requireEnv("MCP_PUBLIC_URL").replace(/\/$/, "");
  const allowedSubject = process.env.MCP_ALLOWED_SUBJECT;
  const allowedEmail = process.env.MCP_ALLOWED_EMAIL;

  if (!allowedSubject && !allowedEmail) {
    throw new OAuthConfigurationError(
      "MCP OAuth must allowlist either MCP_ALLOWED_SUBJECT or MCP_ALLOWED_EMAIL"
    );
  }

  return {
    issuer,
    resource: `${issuer}/mcp`,
    authorizationEndpoint: `${issuer}/oauth/authorize`,
    tokenEndpoint: `${issuer}/oauth/token`,
    registrationEndpoint: `${issuer}/oauth/register`,
    revocationEndpoint: `${issuer}/oauth/revoke`,
    jwksUri: `${issuer}/.well-known/jwks.json`,
    googleClientId: requireEnv("MCP_GOOGLE_CLIENT_ID"),
    googleClientSecret: requireEnv("MCP_GOOGLE_CLIENT_SECRET"),
    googleRedirectUri: `${issuer}/oauth/callback`,
    allowedSubject,
    allowedEmail,
  };
}

export function getAuthorizationServerMetadata() {
  const config = getOAuthConfig();
  return {
    issuer: config.issuer,
    authorization_endpoint: config.authorizationEndpoint,
    token_endpoint: config.tokenEndpoint,
    registration_endpoint: config.registrationEndpoint,
    revocation_endpoint: config.revocationEndpoint,
    jwks_uri: config.jwksUri,
    scopes_supported: [...MCP_SCOPES],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
    revocation_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
    resource_indicators_supported: true,
    service_documentation: `${config.issuer}/docs/mcp`,
  };
}

export function getProtectedResourceMetadata() {
  const config = getOAuthConfig();
  return {
    resource: config.resource,
    authorization_servers: [config.issuer],
    scopes_supported: [...MCP_SCOPES],
    bearer_methods_supported: ["header"],
    resource_documentation: `${config.issuer}/docs/mcp`,
  };
}
