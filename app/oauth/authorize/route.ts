import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseScopes, type McpScope } from "@/lib/mcp/scopes";
import { findClient } from "@/lib/oauth/clients";
import { getOAuthConfig } from "@/lib/oauth/config";
import { approvalPage, authorizationErrorPage, handleConfigurationError } from "@/lib/oauth/http";
import { constantTimeEquals, hashToken, randomToken } from "@/lib/oauth/pkce";

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

/**
 * Renders the approval screen for the signed-in owner.
 *
 * The owner signs in with the same admin session that guards /admin, which can
 * already do everything the MCP tools expose, so a separate identity provider
 * would add a dependency without adding authority. What it would have added is
 * an unavoidable human interaction -- so this endpoint asks for one explicitly
 * rather than minting a code for whoever happens to be signed in.
 */
export async function GET(request: Request) {
  try {
    const config = getOAuthConfig();
    const requestUrl = new URL(request.url);
    const params = requestUrl.searchParams;
    const clientId = params.get("client_id");
    const redirectUri = params.get("redirect_uri");
    const state = params.get("state");

    if (!clientId || !redirectUri) {
      return authorizationErrorPage(
        "Invalid authorization request",
        "Both client_id and redirect_uri are required."
      );
    }

    // A bad client or redirect URI cannot be reported by redirecting -- that is
    // exactly the open redirect this check exists to prevent.
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
    const granted: McpScope[] = requested.length
      ? requested.filter((scope) => client.scopes.includes(scope))
      : (client.scopes as McpScope[]);
    if (!granted.length) {
      return redirectWithError(
        redirectUri,
        "invalid_scope",
        "None of the requested scopes are registered for this client",
        state
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      const target = `/login?callbackUrl=${encodeURIComponent(requestUrl.pathname + requestUrl.search)}`;
      return Response.redirect(new URL(target, config.issuer).toString(), 302);
    }

    const approvalNonce = randomToken(32);
    const authorization = await prisma.oAuthAuthorization.create({
      data: {
        clientId: client.id,
        redirectUri,
        scopes: granted,
        resource: resource ?? config.resource,
        clientState: state,
        codeChallenge,
        codeChallengeMethod: "S256",
        approvalNonce,
        expiresAt: new Date(Date.now() + AUTHORIZATION_TTL_MS),
      },
    });

    return approvalPage({
      action: config.authorizationEndpoint,
      authorizationId: authorization.id,
      nonce: approvalNonce,
      clientName: client.name,
      redirectUri,
      scopes: granted,
      accountLabel: session.user.email ?? session.user.name ?? "the site owner",
    });
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    throw error;
  }
}

/** Receives the owner's decision from the approval screen. */
export async function POST(request: Request) {
  try {
    getOAuthConfig();
    const session = await auth();
    if (!session?.user?.id) {
      return authorizationErrorPage(
        "Session expired",
        "Sign in again and restart the connection from your MCP client.",
        401
      );
    }

    const form = new URLSearchParams(await request.text());
    const authorizationId = form.get("authorization_id");
    const nonce = form.get("nonce");
    if (!authorizationId || !nonce) {
      return authorizationErrorPage("Invalid approval", "The approval form was incomplete.");
    }

    const authorization = await prisma.oAuthAuthorization.findUnique({
      where: { id: authorizationId },
    });
    if (
      !authorization ||
      authorization.approvedAt ||
      authorization.consumedAt ||
      authorization.expiresAt <= new Date()
    ) {
      return authorizationErrorPage(
        "Authorization expired",
        "This request is no longer valid. Start the connection again from your MCP client."
      );
    }

    // The nonce was only ever rendered into the approval page served to the
    // signed-in owner on this origin, so a cross-site form cannot reproduce it.
    if (!constantTimeEquals(nonce, authorization.approvalNonce)) {
      return authorizationErrorPage("Invalid approval", "The approval token did not match.", 403);
    }

    if (form.get("decision") !== "approve") {
      await prisma.oAuthAuthorization.update({
        where: { id: authorization.id },
        data: { consumedAt: new Date() },
      });
      return redirectWithError(
        authorization.redirectUri,
        "access_denied",
        "The site owner denied this connection",
        authorization.clientState
      );
    }

    const code = randomToken();
    await prisma.oAuthAuthorization.update({
      where: { id: authorization.id },
      data: {
        codeHash: hashToken(code),
        subject: session.user.id,
        email: session.user.email ?? null,
        name: session.user.name ?? null,
        approvedAt: new Date(),
      },
    });

    const url = new URL(authorization.redirectUri);
    url.searchParams.set("code", code);
    if (authorization.clientState) url.searchParams.set("state", authorization.clientState);
    return Response.redirect(url.toString(), 302);
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    throw error;
  }
}
