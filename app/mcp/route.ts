import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import {
  authenticateMcpRequest,
  getMcpResourceMetadataUrl,
  McpAuthConfigurationError,
  McpAuthenticationError,
  McpAuthorizationError,
} from "@/lib/mcp/auth";
import { createMcpServer } from "@/lib/mcp/server";
import { TOOL_SCOPES } from "@/lib/mcp/toolScopes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authChallenge(scope?: string) {
  const scopeParameter = scope ? `, scope="${scope}"` : "";
  return `Bearer resource_metadata="${getMcpResourceMetadataUrl()}"${scopeParameter}`;
}

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ error: message }, { status, headers });
}

async function requiredToolScope(request: Request) {
  if (request.method !== "POST") return undefined;
  try {
    const body = (await request.clone().json()) as {
      method?: string;
      params?: { name?: string };
    };
    if (body.method !== "tools/call" || !body.params?.name) return undefined;
    return TOOL_SCOPES[body.params.name];
  } catch {
    return undefined;
  }
}

async function handleMcpRequest(request: Request) {
  try {
    const identity = await authenticateMcpRequest(request);
    const requiredScope = await requiredToolScope(request);
    if (requiredScope && !identity.authInfo.scopes.includes(requiredScope)) {
      throw new McpAuthorizationError(`Missing required OAuth scope: ${requiredScope}`, requiredScope);
    }
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    const server = createMcpServer(identity);
    await server.connect(transport);
    return transport.handleRequest(request, { authInfo: identity.authInfo });
  } catch (error) {
    if (error instanceof McpAuthConfigurationError) {
      return jsonError(error.message, 503);
    }
    if (error instanceof McpAuthenticationError) {
      return jsonError(error.message, 401, { "WWW-Authenticate": authChallenge() });
    }
    if (error instanceof McpAuthorizationError) {
      return jsonError(error.message, 403, {
        "WWW-Authenticate": authChallenge(error.scope),
      });
    }
    throw error;
  }
}

export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
export const DELETE = handleMcpRequest;

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Authorization, Content-Type, Last-Event-ID, MCP-Protocol-Version, MCP-Session-Id",
      "Access-Control-Expose-Headers": "MCP-Protocol-Version, MCP-Session-Id",
    },
  });
}
