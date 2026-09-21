import { clientSecretMatches, findClient, readClientCredentials } from "@/lib/oauth/clients";
import { getOAuthConfig } from "@/lib/oauth/config";
import { handleConfigurationError, oauthError, oauthJson, preflight } from "@/lib/oauth/http";
import { revokeRefreshToken } from "@/lib/oauth/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * RFC 7009. Access tokens are self-contained and short lived, so revocation
 * targets the refresh token that would otherwise keep minting them.
 */
export async function POST(request: Request) {
  try {
    getOAuthConfig();
    const form = new URLSearchParams(await request.text());
    const { clientId, clientSecret } = readClientCredentials(request, form);
    if (!clientId) return oauthError("invalid_client", "client_id is required", 401);

    const client = await findClient(clientId);
    if (!client || !clientSecretMatches(client, clientSecret)) {
      return oauthError("invalid_client", "Client authentication failed", 401);
    }

    const token = form.get("token");
    if (token) await revokeRefreshToken(token, client.id);

    // RFC 7009 requires 200 even for an unknown token, so revocation cannot be
    // used to probe which tokens exist.
    return oauthJson({});
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    throw error;
  }
}

export const OPTIONS = preflight;
