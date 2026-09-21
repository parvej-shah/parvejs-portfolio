import type { OAuthClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MCP_SCOPES, parseScopes, type McpScope } from "@/lib/mcp/scopes";
import { constantTimeEquals, hashToken, randomToken } from "@/lib/oauth/pkce";

export class ClientRegistrationError extends Error {
  constructor(
    message: string,
    readonly code = "invalid_client_metadata"
  ) {
    super(message);
    this.name = "ClientRegistrationError";
  }
}

const SUPPORTED_AUTH_METHODS = ["none", "client_secret_post", "client_secret_basic"] as const;

export type ClientAuthMethod = (typeof SUPPORTED_AUTH_METHODS)[number];

/**
 * OAuth 2.1 mandates exact redirect URI matching, so the only thing validated at
 * registration is the transport: TLS for remote clients, and loopback or a
 * private-use scheme for the desktop clients (Claude, Cursor, Antigravity).
 */
export function assertUsableRedirectUri(value: string): void {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ClientRegistrationError(`redirect_uris entry is not an absolute URI: ${value}`);
  }
  if (url.hash) {
    throw new ClientRegistrationError("redirect_uris entries must not contain a fragment");
  }
  if (url.protocol === "https:") return;
  if (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return;
  if (url.protocol !== "http:") return; // private-use scheme, e.g. claude://
  throw new ClientRegistrationError(`redirect_uris entry must use https or loopback: ${value}`);
}

type RegistrationRequest = {
  client_name?: unknown;
  redirect_uris?: unknown;
  grant_types?: unknown;
  token_endpoint_auth_method?: unknown;
  scope?: unknown;
};

export async function registerClient(body: RegistrationRequest) {
  const redirectUris = Array.isArray(body.redirect_uris)
    ? body.redirect_uris.filter((uri): uri is string => typeof uri === "string")
    : [];
  if (!redirectUris.length) {
    throw new ClientRegistrationError("redirect_uris is required and must list at least one URI");
  }
  redirectUris.forEach(assertUsableRedirectUri);

  const authMethod = typeof body.token_endpoint_auth_method === "string"
    ? body.token_endpoint_auth_method
    : "none";
  if (!SUPPORTED_AUTH_METHODS.includes(authMethod as ClientAuthMethod)) {
    throw new ClientRegistrationError(
      `token_endpoint_auth_method must be one of: ${SUPPORTED_AUTH_METHODS.join(", ")}`
    );
  }

  const grantTypes = Array.isArray(body.grant_types)
    ? body.grant_types.filter((grant): grant is string => typeof grant === "string")
    : ["authorization_code", "refresh_token"];
  const unsupported = grantTypes.filter(
    (grant) => grant !== "authorization_code" && grant !== "refresh_token"
  );
  if (unsupported.length) {
    throw new ClientRegistrationError(
      `Unsupported grant_types: ${unsupported.join(", ")}`,
      "invalid_client_metadata"
    );
  }

  const requested = typeof body.scope === "string" ? parseScopes(body.scope) : [];
  const scopes: McpScope[] = requested.length ? requested : [...MCP_SCOPES];
  const secret = authMethod === "none" ? undefined : randomToken();

  const client = await prisma.oAuthClient.create({
    data: {
      name: typeof body.client_name === "string" && body.client_name.trim()
        ? body.client_name.trim().slice(0, 120)
        : "Unnamed MCP client",
      secretHash: secret ? hashToken(secret) : null,
      redirectUris,
      grantTypes: grantTypes.length ? grantTypes : ["authorization_code", "refresh_token"],
      scopes,
      tokenEndpointAuthMethod: authMethod,
    },
  });

  return {
    client,
    response: {
      client_id: client.id,
      ...(secret ? { client_secret: secret, client_secret_expires_at: 0 } : {}),
      client_id_issued_at: Math.floor(client.createdAt.getTime() / 1000),
      client_name: client.name,
      redirect_uris: client.redirectUris,
      grant_types: client.grantTypes,
      response_types: ["code"],
      token_endpoint_auth_method: client.tokenEndpointAuthMethod,
      scope: client.scopes.join(" "),
    },
  };
}

export function findClient(clientId: string) {
  return prisma.oAuthClient.findUnique({ where: { id: clientId } });
}

/** Reads client credentials from either Basic auth or the form body. */
export function readClientCredentials(
  request: Request,
  form: URLSearchParams
): { clientId?: string; clientSecret?: string } {
  const header = request.headers.get("authorization");
  if (header?.toLowerCase().startsWith("basic ")) {
    const decoded = Buffer.from(header.slice(6).trim(), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator > 0) {
      return {
        clientId: decodeURIComponent(decoded.slice(0, separator)),
        clientSecret: decodeURIComponent(decoded.slice(separator + 1)),
      };
    }
  }
  return {
    clientId: form.get("client_id") ?? undefined,
    clientSecret: form.get("client_secret") ?? undefined,
  };
}

export function clientSecretMatches(client: OAuthClient, secret: string | undefined): boolean {
  if (client.tokenEndpointAuthMethod === "none") return true;
  if (!client.secretHash || !secret) return false;
  return constantTimeEquals(hashToken(secret), client.secretHash);
}
