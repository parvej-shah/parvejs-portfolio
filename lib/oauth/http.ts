import { OAuthConfigurationError } from "@/lib/oauth/config";

export const OAUTH_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, MCP-Protocol-Version",
};

export function oauthError(
  error: string,
  description: string,
  status = 400,
  headers?: HeadersInit
) {
  return Response.json(
    { error, error_description: description },
    {
      status,
      headers: { ...OAUTH_CORS_HEADERS, "Cache-Control": "no-store", ...headers },
    }
  );
}

export function oauthJson(body: unknown, status = 200, cache = "no-store") {
  return Response.json(body, {
    status,
    headers: { ...OAUTH_CORS_HEADERS, "Cache-Control": cache },
  });
}

/** Configuration gaps must fail closed and loudly rather than degrade to open access. */
export function handleConfigurationError(error: unknown) {
  if (error instanceof OAuthConfigurationError) {
    return oauthError("server_error", error.message, 503);
  }
  return undefined;
}

export function preflight() {
  return new Response(null, { status: 204, headers: OAUTH_CORS_HEADERS });
}

/** A browser-facing error page; used only when there is no safe redirect target. */
export function authorizationErrorPage(title: string, detail: string, status = 400) {
  const escape = (value: string) =>
    value.replace(/[&<>"]/g, (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character
    );
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>${escape(title)}</title>` +
      `<body style="font:16px/1.6 system-ui;margin:4rem auto;max-width:34rem;padding:0 1rem">` +
      `<h1 style="font-size:1.25rem">${escape(title)}</h1><p>${escape(detail)}</p></body>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}
