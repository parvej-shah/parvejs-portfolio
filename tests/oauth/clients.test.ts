import assert from "node:assert/strict";
import { describe, it } from "node:test";

process.env.DATABASE_URL ??= "postgresql://unused:unused@localhost:5432/unused";

const { assertUsableRedirectUri, ClientRegistrationError, readClientCredentials } = await import(
  "@/lib/oauth/clients"
);

describe("redirect URI validation", () => {
  it("accepts an https redirect for a remote client", () => {
    assert.doesNotThrow(() => assertUsableRedirectUri("https://claude.ai/api/mcp/auth_callback"));
    assert.doesNotThrow(() => assertUsableRedirectUri("https://chatgpt.com/connector_platform_oauth_redirect"));
  });

  it("accepts loopback http for desktop clients", () => {
    assert.doesNotThrow(() => assertUsableRedirectUri("http://localhost:33418/callback"));
    assert.doesNotThrow(() => assertUsableRedirectUri("http://127.0.0.1:6274/oauth/callback"));
  });

  it("accepts a private-use scheme, which native clients register", () => {
    assert.doesNotThrow(() => assertUsableRedirectUri("antigravity://mcp/callback"));
    assert.doesNotThrow(() => assertUsableRedirectUri("cursor://anysphere.cursor-mcp/oauth/callback"));
  });

  it("rejects plaintext http to a remote host", () => {
    assert.throws(
      () => assertUsableRedirectUri("http://evil.example.com/callback"),
      ClientRegistrationError
    );
  });

  it("rejects a redirect URI carrying a fragment", () => {
    assert.throws(() => assertUsableRedirectUri("https://client.test/cb#token"), ClientRegistrationError);
  });

  it("rejects a relative URI", () => {
    assert.throws(() => assertUsableRedirectUri("/callback"), ClientRegistrationError);
  });
});

describe("client credential parsing", () => {
  it("reads credentials from HTTP Basic auth", () => {
    const basic = Buffer.from("client-1:secret-1").toString("base64");
    const request = new Request("https://mcp.example.test/oauth/token", {
      headers: { authorization: `Basic ${basic}` },
    });
    assert.deepEqual(readClientCredentials(request, new URLSearchParams()), {
      clientId: "client-1",
      clientSecret: "secret-1",
    });
  });

  it("falls back to the form body", () => {
    const request = new Request("https://mcp.example.test/oauth/token");
    const form = new URLSearchParams({ client_id: "client-2", client_secret: "secret-2" });
    assert.deepEqual(readClientCredentials(request, form), {
      clientId: "client-2",
      clientSecret: "secret-2",
    });
  });

  it("reports a public client with no secret", () => {
    const request = new Request("https://mcp.example.test/oauth/token");
    const form = new URLSearchParams({ client_id: "public-client" });
    assert.deepEqual(readClientCredentials(request, form), {
      clientId: "public-client",
      clientSecret: undefined,
    });
  });
});
