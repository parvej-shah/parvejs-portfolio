import { getAuthorizationServerMetadata } from "@/lib/oauth/config";
import { handleConfigurationError, oauthJson, preflight } from "@/lib/oauth/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    return oauthJson(getAuthorizationServerMetadata(), 200, "public, max-age=300");
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    throw error;
  }
}

export const OPTIONS = preflight;
