import { prisma } from "@/lib/prisma";
import { parseScopes } from "@/lib/mcp/scopes";
import { findClient } from "@/lib/oauth/clients";
import { getOAuthConfig } from "@/lib/oauth/config";
import { buildGoogleAuthorizationUrl } from "@/lib/oauth/google";
import { authorizationErrorPage, handleConfigurationError } from "@/lib/oauth/http";
import { randomToken } from "@/lib/oauth/pkce";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AUTHORIZATION_TTL_MS = 10 * 60 * 1000;

function redirectWithError(
  redirectUri: string,
  error: string,
  description: string,
  state: string | null
) {
  const url = new URL(redirectUri);
  url.searchParams.set("error", error);
  url.searchParams.set("error_description", description);
  if (state) url.searchParams.set("state", state);
  return Response.redirect(url.toString(), 302);
}

export async function GET(request: Request) {
  try {
    const config = getOAuthConfig();
    const params = new URL(request.url).searchParams;
    const clientId = params.get("client_id");
    const redirectUri = params.get("redirect_uri");
    const state = params.get("state");

    if (!clientId || !redirectUri) {
      return authorizationErrorPage(
        "Invalid authorization request",
        "Both client_id and redirect_uri are required."
      );
    }

    // A bad client or redirect URI cannot be reported by redirecting — that is
    // exactly the open-redirect this check exists to prevent.
    const client = await findClient(clientId);
    if (!client) {
      return authorizationErrorPage("Unknown client", "This client_id is not registered.", 401);
    }
    if (!client.redirectUris.includes(redirectUri)) {
      return authorizationErrorPage(
        "Invalid redirect URI",
        "This redirect_uri is not registered for the client."
      );
    }

    if (params.get("response_type") !== "code") {
      return redirectWithError(
        redirectUri,
        "unsupported_response_type",
        "Only the authorization code flow is supported",
        state
      );
    }

    const codeChallenge = params.get("code_challenge");
    if (!codeChallenge || params.get("code_challenge_method") !== "S256") {
      return redirectWithError(
        redirectUri,
        "invalid_request",
        "PKCE with code_challenge_method=S256 is required",
        state
      );
    }

    const resource = params.get("resource");
    if (resource && resource.replace(/\/$/, "") !== config.resource) {
      return redirectWithError(
        redirectUri,
        "invalid_target",
        `This authorization server only issues tokens for ${config.resource}`,
        state
      );
    }

    const requested = parseScopes(params.get("scope"));
    const granted = requested.length
      ? requested.filter((scope) => client.scopes.includes(scope))
      : client.scopes;
    if (!granted.length) {
      return redirectWithError(
        redirectUri,
        "invalid_scope",
        "None of the requested scopes are registered for this client",
        state
      );
    }

    const googleVerifier = randomToken(48);
    const authorization = await prisma.oAuthAuthorization.create({
      data: {
        clientId: client.id,
        redirectUri,
        scopes: granted,
        resource: resource ?? config.resource,
        clientState: state,
        codeChallenge,
        codeChallengeMethod: "S256",
        googleVerifier,
        expiresAt: new Date(Date.now() + AUTHORIZATION_TTL_MS),
      },
    });

    return Response.redirect(
      buildGoogleAuthorizationUrl(config, authorization.id, googleVerifier),
      302
    );
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    throw error;
  }
}
