import { ClientRegistrationError, registerClient } from "@/lib/oauth/clients";
import { getOAuthConfig } from "@/lib/oauth/config";
import { handleConfigurationError, oauthError, oauthJson, preflight } from "@/lib/oauth/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * RFC 7591 dynamic client registration. Registration is open because MCP clients
 * self-register; authority comes from the Google owner allowlist at the
 * authorization step, never from possession of a client_id.
 */
export async function POST(request: Request) {
  try {
    getOAuthConfig();
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return oauthError("invalid_client_metadata", "A JSON registration body is required");
    }
    const { response } = await registerClient(body);
    return oauthJson(response, 201);
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    if (error instanceof ClientRegistrationError) {
      return oauthError(error.code, error.message);
    }
    throw error;
  }
}

export const OPTIONS = preflight;
