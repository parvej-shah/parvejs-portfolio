import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { installTestOAuthEnv, TEST_ISSUER, TEST_RESOURCE } from "../helpers/env";

process.env.DATABASE_URL ??= "postgresql://unused:unused@localhost:5432/unused";
installTestOAuthEnv();

const { getOAuthConfig, getAuthorizationServerMetadata, OAuthConfigurationError } = await import(
  "@/lib/oauth/config"
);

describe("authorization server configuration", () => {
  it("derives every endpoint from the one public origin", () => {
    const config = getOAuthConfig();
    assert.equal(config.issuer, TEST_ISSUER);
    assert.equal(config.resource, TEST_RESOURCE);
    assert.equal(config.authorizationEndpoint, `${TEST_ISSUER}/oauth/authorize`);
    assert.equal(config.tokenEndpoint, `${TEST_ISSUER}/oauth/token`);
    assert.equal(config.registrationEndpoint, `${TEST_ISSUER}/oauth/register`);
    assert.equal(config.jwksUri, `${TEST_ISSUER}/.well-known/jwks.json`);
  });

  it("tolerates a trailing slash without producing a double slash", () => {
    process.env.MCP_PUBLIC_URL = `${TEST_ISSUER}/`;
    try {
      assert.equal(getOAuthConfig().resource, TEST_RESOURCE);
    } finally {
      process.env.MCP_PUBLIC_URL = TEST_ISSUER;
    }
  });

  it("fails closed when the public URL is missing", () => {
    const url = process.env.MCP_PUBLIC_URL;
    delete process.env.MCP_PUBLIC_URL;
    try {
      assert.throws(() => getOAuthConfig(), OAuthConfigurationError);
      assert.throws(() => getOAuthConfig(), /MCP_PUBLIC_URL/);
    } finally {
      process.env.MCP_PUBLIC_URL = url;
    }
  });

  it("advertises only PKCE S256 and the authorization code flow", () => {
    const metadata = getAuthorizationServerMetadata();
    assert.deepEqual(metadata.code_challenge_methods_supported, ["S256"]);
    assert.deepEqual(metadata.response_types_supported, ["code"]);
    assert.deepEqual(metadata.grant_types_supported, ["authorization_code", "refresh_token"]);
    assert.equal(metadata.resource_indicators_supported, true);
  });
});
