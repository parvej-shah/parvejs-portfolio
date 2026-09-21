import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { approvalPage } from "@/lib/oauth/http";

function render(overrides: Partial<Parameters<typeof approvalPage>[0]> = {}) {
  return approvalPage({
    action: "https://mcp.example.test/oauth/authorize",
    authorizationId: "auth-123",
    nonce: "nonce-abc",
    clientName: "Claude Code",
    redirectUri: "http://localhost:57400/callback",
    scopes: ["content:read", "blog:publish"],
    accountLabel: "owner@example.test",
    ...overrides,
  });
}

describe("approval screen", () => {
  it("carries the authorization id and nonce the POST handler requires", async () => {
    const html = await render().text();
    assert.match(html, /name="authorization_id" value="auth-123"/);
    assert.match(html, /name="nonce" value="nonce-abc"/);
    assert.match(html, /method="POST"/);
  });

  it("offers an explicit approve and an explicit deny", async () => {
    const html = await render().text();
    assert.match(html, /name="decision" value="approve"/);
    assert.match(html, /name="decision" value="deny"/);
  });

  it("names the client, the account and where tokens will be sent", async () => {
    const html = await render().text();
    assert.match(html, /Claude Code/);
    assert.match(html, /owner@example\.test/);
    assert.match(html, /localhost:57400/);
  });

  it("spells out what each scope actually permits", async () => {
    const html = await render().text();
    assert.match(html, /content:read/);
    assert.match(html, /blog:publish/);
    assert.match(html, /Publish, unpublish and archive posts on your live site/);
  });

  it("cannot be framed, so the approve button cannot be clickjacked", () => {
    const response = render();
    assert.equal(response.headers.get("X-Frame-Options"), "DENY");
    assert.match(response.headers.get("Content-Security-Policy") ?? "", /frame-ancestors 'none'/);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  });

  it("escapes a hostile client name instead of injecting it as markup", async () => {
    const html = await render({ clientName: '<img src=x onerror="alert(1)">' }).text();
    assert.ok(!html.includes("<img src=x"), "client name must not render as live markup");
    assert.match(html, /&lt;img src=x/);
  });

  it("escapes a hostile redirect URI", async () => {
    const html = await render({ redirectUri: 'http://x/"><script>bad()</script>' }).text();
    assert.ok(!html.includes("<script>bad()"), "redirect URI must not break out of the attribute");
  });
});
