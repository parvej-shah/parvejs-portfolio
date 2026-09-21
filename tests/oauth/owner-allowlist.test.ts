import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { installTestOAuthEnv, TEST_OWNER_EMAIL, TEST_OWNER_SUBJECT } from "../helpers/env";

process.env.DATABASE_URL ??= "postgresql://unused:unused@localhost:5432/unused";
installTestOAuthEnv();

const { isSiteOwner } = await import("@/lib/oauth/google");
const { getOAuthConfig, OAuthConfigurationError } = await import("@/lib/oauth/config");

describe("single-owner allowlist", () => {
  it("admits the allowlisted email regardless of case", () => {
    const config = getOAuthConfig();
    assert.equal(isSiteOwner({ subject: "any", email: TEST_OWNER_EMAIL }, config), true);
    assert.equal(isSiteOwner({ subject: "any", email: TEST_OWNER_EMAIL.toUpperCase() }, config), true);
  });

  it("rejects any other Google account, even a valid one", () => {
    const config = getOAuthConfig();
    assert.equal(isSiteOwner({ subject: "other", email: "stranger@gmail.com" }, config), false);
  });

  it("rejects an identity with no email when only an email is allowlisted", () => {
    const config = getOAuthConfig();
    assert.equal(isSiteOwner({ subject: "other" }, config), false);
  });

  it("admits by stable Google subject when one is configured", () => {
    const config = { ...getOAuthConfig(), allowedEmail: undefined, allowedSubject: TEST_OWNER_SUBJECT };
    assert.equal(isSiteOwner({ subject: TEST_OWNER_SUBJECT }, config), true);
    assert.equal(isSiteOwner({ subject: "someone-else" }, config), false);
  });

  it("fails closed when no owner is allowlisted at all", () => {
    const email = process.env.MCP_ALLOWED_EMAIL;
    delete process.env.MCP_ALLOWED_EMAIL;
    try {
      assert.throws(() => getOAuthConfig(), OAuthConfigurationError);
    } finally {
      process.env.MCP_ALLOWED_EMAIL = email;
    }
  });

  it("fails closed when the public URL is missing", () => {
    const url = process.env.MCP_PUBLIC_URL;
    delete process.env.MCP_PUBLIC_URL;
    try {
      assert.throws(() => getOAuthConfig(), /MCP_PUBLIC_URL/);
    } finally {
      process.env.MCP_PUBLIC_URL = url;
    }
  });
});
