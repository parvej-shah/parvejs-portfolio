import { prisma } from "@/lib/prisma";
import type { McpScope } from "@/lib/mcp/scopes";
import { clientSecretMatches, findClient, readClientCredentials } from "@/lib/oauth/clients";
import { getOAuthConfig } from "@/lib/oauth/config";
import { handleConfigurationError, oauthError, oauthJson, preflight } from "@/lib/oauth/http";
import { hashToken, verifyPkce } from "@/lib/oauth/pkce";
import {
  consumeRefreshToken,
  issueRefreshToken,
  mintAccessToken,
  type TokenSubject,
} from "@/lib/oauth/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function tokenResponse(
  identity: TokenSubject,
  clientId: string,
  scopes: McpScope[],
  resource: string | null
) {
  const [access, refresh] = await Promise.all([
    mintAccessToken(identity, clientId, scopes),
    issueRefreshToken(identity, clientId, scopes, resource),
  ]);
  return oauthJson({
    access_token: access.token,
    token_type: "Bearer",
    expires_in: access.expiresIn,
    refresh_token: refresh,
    scope: scopes.join(" "),
  });
}

export async function POST(request: Request) {
  try {
    const config = getOAuthConfig();
    const form = new URLSearchParams(await request.text());
    const { clientId, clientSecret } = readClientCredentials(request, form);
    if (!clientId) return oauthError("invalid_client", "client_id is required", 401);

    const client = await findClient(clientId);
    if (!client || !clientSecretMatches(client, clientSecret)) {
      return oauthError("invalid_client", "Client authentication failed", 401);
    }

    const requestedResource = form.get("resource");
    if (requestedResource && requestedResource.replace(/\/$/, "") !== config.resource) {
      return oauthError("invalid_target", `Tokens are only issued for ${config.resource}`);
    }

    const grantType = form.get("grant_type");
    if (!client.grantTypes.includes(grantType ?? "")) {
      return oauthError("unauthorized_client", `This client may not use grant_type=${grantType}`);
    }

    if (grantType === "authorization_code") {
      const code = form.get("code");
      const verifier = form.get("code_verifier");
      const redirectUri = form.get("redirect_uri");
      if (!code || !verifier) {
        return oauthError("invalid_request", "code and code_verifier are required");
      }

      const authorization = await prisma.oAuthAuthorization.findUnique({
        where: { codeHash: hashToken(code) },
      });
      if (!authorization || authorization.clientId !== client.id) {
        return oauthError("invalid_grant", "The authorization code is not valid");
      }
      // A replayed code means the first exchange may have been intercepted, so the
      // authorization is burned rather than reused.
      if (authorization.consumedAt || authorization.expiresAt <= new Date()) {
        return oauthError("invalid_grant", "The authorization code is expired or already used");
      }
      if (redirectUri && redirectUri !== authorization.redirectUri) {
        return oauthError("invalid_grant", "redirect_uri does not match the authorization request");
      }
      if (!verifyPkce(verifier, authorization.codeChallenge, authorization.codeChallengeMethod)) {
        return oauthError("invalid_grant", "The PKCE code_verifier does not match");
      }
      if (!authorization.subject) {
        return oauthError("invalid_grant", "The authorization was never completed by the owner");
      }

      const consumed = await prisma.oAuthAuthorization.updateMany({
        where: { id: authorization.id, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      if (consumed.count !== 1) {
        return oauthError("invalid_grant", "The authorization code is expired or already used");
      }

      return tokenResponse(
        { subject: authorization.subject, email: authorization.email, name: authorization.name },
        client.id,
        authorization.scopes as McpScope[],
        authorization.resource
      );
    }

    if (grantType === "refresh_token") {
      const refreshToken = form.get("refresh_token");
      if (!refreshToken) return oauthError("invalid_request", "refresh_token is required");

      const record = await consumeRefreshToken(refreshToken, client.id);
      if (!record) return oauthError("invalid_grant", "The refresh token is not valid");

      return tokenResponse(
        { subject: record.subject, email: record.email, name: record.name },
        client.id,
        record.scopes as McpScope[],
        record.resource
      );
    }

    return oauthError("unsupported_grant_type", `Unsupported grant_type: ${grantType}`);
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    throw error;
  }
}

export const OPTIONS = preflight;
