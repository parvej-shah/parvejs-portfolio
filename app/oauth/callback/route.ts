import { prisma } from "@/lib/prisma";
import { getOAuthConfig } from "@/lib/oauth/config";
import { exchangeGoogleCode, GoogleIdentityError, isSiteOwner } from "@/lib/oauth/google";
import { authorizationErrorPage, handleConfigurationError } from "@/lib/oauth/http";
import { hashToken, randomToken } from "@/lib/oauth/pkce";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectToClient(
  redirectUri: string,
  params: Record<string, string | null | undefined>
) {
  const url = new URL(redirectUri);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return Response.redirect(url.toString(), 302);
}

/** Google redirects here after the owner signs in; `state` is the pending authorization id. */
export async function GET(request: Request) {
  try {
    const config = getOAuthConfig();
    const params = new URL(request.url).searchParams;
    const state = params.get("state");
    if (!state) {
      return authorizationErrorPage("Invalid sign-in response", "Google returned no state value.");
    }

    const authorization = await prisma.oAuthAuthorization.findUnique({ where: { id: state } });
    if (!authorization || authorization.consumedAt || authorization.expiresAt <= new Date()) {
      return authorizationErrorPage(
        "Authorization expired",
        "This sign-in request is no longer valid. Start the connection again from your MCP client."
      );
    }

    const googleError = params.get("error");
    if (googleError) {
      return redirectToClient(authorization.redirectUri, {
        error: "access_denied",
        error_description: `Google sign-in failed: ${googleError}`,
        state: authorization.clientState,
      });
    }

    const code = params.get("code");
    if (!code) {
      return redirectToClient(authorization.redirectUri, {
        error: "access_denied",
        error_description: "Google returned no authorization code",
        state: authorization.clientState,
      });
    }

    const identity = await exchangeGoogleCode(config, code, authorization.googleVerifier);
    if (!isSiteOwner(identity, config)) {
      await prisma.oAuthAuthorization.update({
        where: { id: authorization.id },
        data: { consumedAt: new Date() },
      });
      return redirectToClient(authorization.redirectUri, {
        error: "access_denied",
        error_description: "This Google account is not allowed to manage the site",
        state: authorization.clientState,
      });
    }

    const authorizationCode = randomToken();
    await prisma.oAuthAuthorization.update({
      where: { id: authorization.id },
      data: {
        codeHash: hashToken(authorizationCode),
        subject: identity.subject,
        email: identity.email ?? null,
        name: identity.name ?? null,
      },
    });

    return redirectToClient(authorization.redirectUri, {
      code: authorizationCode,
      state: authorization.clientState,
    });
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    if (error instanceof GoogleIdentityError) {
      return authorizationErrorPage("Google sign-in failed", error.message, 401);
    }
    throw error;
  }
}
