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

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  "content:read": "Read your posts, projects, sections and change history",
  "blog:write": "Create and edit drafts (cannot publish them)",
  "blog:publish": "Publish, unpublish and archive posts on your live site",
  "project:write": "Create, edit, publish and archive projects",
  "site:write": "Edit your homepage sections",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character
  );
}

/**
 * The owner's explicit consent step. Without it, any page could send a signed-in
 * owner to /oauth/authorize and have a code minted silently.
 */
export function approvalPage(options: {
  action: string;
  authorizationId: string;
  nonce: string;
  clientName: string;
  redirectUri: string;
  scopes: readonly string[];
  accountLabel: string;
}) {
  const scopeItems = options.scopes
    .map(
      (scope) =>
        `<li><code>${escapeHtml(scope)}</code><span>${escapeHtml(
          SCOPE_DESCRIPTIONS[scope] ?? "Access this capability"
        )}</span></li>`
    )
    .join("");

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Authorize ${escapeHtml(options.clientName)}</title>
<style>
  :root { color-scheme: light dark; --bg:#f4f5f7; --card:#fff; --ink:#15181d; --soft:#5b6572; --line:#dfe3e8; --accent:#8a4f0f; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#10141a; --card:#181d25; --ink:#e6eaef; --soft:#98a3b0; --line:#2a323c; --accent:#e0a560; }
  }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink);
    font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;
    display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px 16px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:10px;
    max-width:30rem; width:100%; padding:1.75rem; }
  h1 { font-size:1.2rem; margin:0 0 .4rem; line-height:1.3; }
  .sub { color:var(--soft); font-size:.9rem; margin:0 0 1.25rem; }
  ul { list-style:none; margin:0 0 1.25rem; padding:0; display:grid; gap:.6rem; }
  li { display:grid; gap:.1rem; border-left:3px solid var(--accent); padding:.4rem 0 .4rem .7rem; }
  code { font-family:ui-monospace,Menlo,monospace; font-size:.83rem; color:var(--accent); }
  li span { font-size:.87rem; color:var(--soft); }
  .meta { font-size:.8rem; color:var(--soft); border-top:1px solid var(--line);
    padding-top:.9rem; margin-bottom:1.25rem; word-break:break-all; }
  .row { display:flex; gap:.6rem; flex-wrap:wrap; }
  button { font:inherit; font-size:.92rem; padding:.6rem 1.1rem; border-radius:6px; cursor:pointer; border:1px solid var(--line); }
  .approve { background:var(--accent); border-color:var(--accent); color:#fff; font-weight:600; flex:1; }
  .deny { background:transparent; color:var(--ink); }
  button:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
</style>
<div class="card">
  <h1>Allow ${escapeHtml(options.clientName)} to manage parvejshah.com?</h1>
  <p class="sub">Signed in as ${escapeHtml(options.accountLabel)}. This grants:</p>
  <ul>${scopeItems}</ul>
  <p class="meta">Tokens will be sent to <code>${escapeHtml(options.redirectUri)}</code></p>
  <form method="POST" action="${escapeHtml(options.action)}">
    <input type="hidden" name="authorization_id" value="${escapeHtml(options.authorizationId)}">
    <input type="hidden" name="nonce" value="${escapeHtml(options.nonce)}">
    <div class="row">
      <button class="approve" type="submit" name="decision" value="approve">Allow access</button>
      <button class="deny" type="submit" name="decision" value="deny">Cancel</button>
    </div>
  </form>
</div>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      // The approval form must never be embeddable; clickjacking it would be
      // equivalent to stealing a token.
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
    },
  });
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
