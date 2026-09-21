import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { installTestOAuthEnv, TEST_ISSUER, TEST_OWNER_EMAIL, TEST_OWNER_SUBJECT, TEST_RESOURCE } from "../helpers/env";

process.env.DATABASE_URL ??= "postgresql://unused:unused@localhost:5432/unused";
installTestOAuthEnv();

const { mintAccessToken } = await import("@/lib/oauth/tokens");
const {
  authenticateMcpRequest,
  getMcpResourceMetadata,
  getMcpResourceMetadataUrl,
  McpAuthenticationError,
  McpAuthorizationError,
  requireMcpScope,
} = await import("@/lib/mcp/auth");

const OWNER = { subject: TEST_OWNER_SUBJECT, email: TEST_OWNER_EMAIL, name: "Site Owner" };

async function requestWithScopes(scopes: Parameters<typeof mintAccessToken>[2]) {
  const { token } = await mintAccessToken(OWNER, "claude-desktop", scopes);
  return new Request(TEST_RESOURCE, { headers: { authorization: `Bearer ${token}` } });
}

describe("MCP bearer authentication", () => {
  it("accepts a token this server issued and exposes the caller's identity", async () => {
    const identity = await authenticateMcpRequest(await requestWithScopes(["content:read"]));
    assert.equal(identity.subject, TEST_OWNER_SUBJECT);
    assert.equal(identity.email, TEST_OWNER_EMAIL);
    assert.equal(identity.authInfo.clientId, "claude-desktop");
    assert.deepEqual(identity.authInfo.scopes, ["content:read"]);
    assert.equal(identity.authInfo.resource?.toString(), TEST_RESOURCE);
  });

  it("accepts a lowercase bearer prefix, which some clients send", async () => {
    const { token } = await mintAccessToken(OWNER, "cli", ["content:read"]);
    const request = new Request(TEST_RESOURCE, { headers: { authorization: `bearer ${token}` } });
    const identity = await authenticateMcpRequest(request);
    assert.equal(identity.subject, TEST_OWNER_SUBJECT);
  });

  it("rejects a request with no Authorization header", async () => {
    await assert.rejects(
      () => authenticateMcpRequest(new Request(TEST_RESOURCE)),
      McpAuthenticationError
    );
  });

  it("rejects a non-bearer scheme", async () => {
    const request = new Request(TEST_RESOURCE, { headers: { authorization: "Basic abc" } });
    await assert.rejects(() => authenticateMcpRequest(request), McpAuthenticationError);
  });

  it("rejects a garbage token without leaking why", async () => {
    const request = new Request(TEST_RESOURCE, { headers: { authorization: "Bearer not-a-jwt" } });
    await assert.rejects(() => authenticateMcpRequest(request), (error: Error) => {
      assert.ok(error instanceof McpAuthenticationError);
      assert.equal(error.message, "The bearer access token is invalid or expired");
      return true;
    });
  });

  it("ignores scopes the server does not define", async () => {
    const { token } = await mintAccessToken(OWNER, "cli", ["content:read"]);
    const forged = token; // scopes are signed, so an unknown scope cannot be injected
    const identity = await authenticateMcpRequest(
      new Request(TEST_RESOURCE, { headers: { authorization: `Bearer ${forged}` } })
    );
    assert.deepEqual(identity.authInfo.scopes, ["content:read"]);
  });
});

describe("scope enforcement", () => {
  it("allows a tool whose scope was granted", async () => {
    const identity = await authenticateMcpRequest(await requestWithScopes(["blog:write"]));
    assert.doesNotThrow(() => requireMcpScope(identity, "blog:write"));
  });

  it("does not let blog:write imply blog:publish", async () => {
    const identity = await authenticateMcpRequest(await requestWithScopes(["blog:write"]));
    assert.throws(() => requireMcpScope(identity, "blog:publish"), (error: Error) => {
      assert.ok(error instanceof McpAuthorizationError);
      assert.equal((error as InstanceType<typeof McpAuthorizationError>).scope, "blog:publish");
      return true;
    });
  });

  it("denies every write scope to a read-only token", async () => {
    const identity = await authenticateMcpRequest(await requestWithScopes(["content:read"]));
    for (const scope of ["blog:write", "blog:publish", "project:write", "site:write"] as const) {
      assert.throws(() => requireMcpScope(identity, scope), McpAuthorizationError);
    }
  });
});

describe("protected resource metadata", () => {
  it("advertises this deployment as its own authorization server", () => {
    const metadata = getMcpResourceMetadata();
    assert.equal(metadata.resource, TEST_RESOURCE);
    assert.deepEqual(metadata.authorization_servers, [TEST_ISSUER]);
    assert.ok(metadata.scopes_supported.includes("blog:publish"));
  });

  it("places the metadata document at the RFC 9728 path for /mcp", () => {
    assert.equal(
      getMcpResourceMetadataUrl(),
      `${TEST_ISSUER}/.well-known/oauth-protected-resource/mcp`
    );
  });
});
