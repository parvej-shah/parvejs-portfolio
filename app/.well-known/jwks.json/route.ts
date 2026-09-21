import { handleConfigurationError, oauthJson } from "@/lib/oauth/http";
import { getPublicJwks } from "@/lib/oauth/keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return oauthJson(await getPublicJwks(), 200, "public, max-age=300");
  } catch (error) {
    const configurationError = handleConfigurationError(error);
    if (configurationError) return configurationError;
    throw error;
  }
}
