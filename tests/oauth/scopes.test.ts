import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isMcpScope, MCP_SCOPES, parseScopes } from "@/lib/mcp/scopes";

describe("MCP scopes", () => {
  it("parses a space-delimited scope string", () => {
    assert.deepEqual(parseScopes("content:read blog:write"), ["content:read", "blog:write"]);
  });

  it("drops scopes this server does not define", () => {
    assert.deepEqual(parseScopes("content:read admin:everything"), ["content:read"]);
  });

  it("de-duplicates repeated scopes", () => {
    assert.deepEqual(parseScopes("blog:write blog:write"), ["blog:write"]);
  });

  it("treats empty and missing scope strings as no scopes", () => {
    assert.deepEqual(parseScopes(""), []);
    assert.deepEqual(parseScopes(null), []);
    assert.deepEqual(parseScopes(undefined), []);
  });

  it("keeps write and publish as separate permissions", () => {
    assert.ok(isMcpScope("blog:write"));
    assert.ok(isMcpScope("blog:publish"));
    assert.equal(MCP_SCOPES.includes("blog:write"), true);
    assert.deepEqual(parseScopes("blog:write"), ["blog:write"]);
  });
});
