import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { installTestOAuthEnv, TEST_OWNER_EMAIL, TEST_OWNER_SUBJECT, TEST_RESOURCE } from "../helpers/env";

process.env.DATABASE_URL ??= "postgresql://unused:unused@localhost:5432/unused";
installTestOAuthEnv();

const { createMcpServer } = await import("@/lib/mcp/server");
const { TOOL_SCOPES } = await import("@/lib/mcp/toolScopes");
const { MCP_SCOPES } = await import("@/lib/mcp/scopes");

const IDENTITY = {
  subject: TEST_OWNER_SUBJECT,
  email: TEST_OWNER_EMAIL,
  name: "Site Owner",
  authInfo: {
    token: "test-token",
    clientId: "test-client",
    scopes: [...MCP_SCOPES],
    resource: new URL(TEST_RESOURCE),
  },
};

describe("MCP tool surface", () => {
  let tools: { name: string; annotations?: Record<string, unknown>; inputSchema: { properties?: Record<string, unknown> } }[];

  before(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const server = createMcpServer(IDENTITY as never);
    const client = new Client({ name: "test-client", version: "1.0.0" });
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
    ({ tools } = (await client.listTools()) as never);
  });

  it("registers every tool the deployment documents", () => {
    assert.deepEqual(
      tools.map((tool) => tool.name).sort(),
      [
        "archive_blog",
        "archive_project",
        "create_blog",
        "create_project",
        "delete_media",
        "get_blog",
        "get_change_history",
        "get_connection_profile",
        "get_project",
        "get_site_section",
        "list_blogs",
        "list_media",
        "list_projects",
        "publish_blog",
        "publish_project",
        "unpublish_blog",
        "unpublish_project",
        "update_blog",
        "update_project",
        "update_site_section",
        "upload_image",
      ]
    );
  });

  it("gates every registered tool behind a scope at the HTTP boundary", () => {
    for (const tool of tools) {
      assert.ok(
        TOOL_SCOPES[tool.name],
        `${tool.name} has no entry in TOOL_SCOPES, so it would bypass the transport-level scope check`
      );
    }
  });

  it("maps no scope entry to a tool that does not exist", () => {
    const names = new Set(tools.map((tool) => tool.name));
    for (const name of Object.keys(TOOL_SCOPES)) {
      assert.ok(names.has(name), `TOOL_SCOPES references an unregistered tool: ${name}`);
    }
  });

  it("keeps publishing behind blog:publish, separate from blog:write", () => {
    assert.equal(TOOL_SCOPES.create_blog, "blog:write");
    assert.equal(TOOL_SCOPES.update_blog, "blog:write");
    assert.equal(TOOL_SCOPES.publish_blog, "blog:publish");
    assert.equal(TOOL_SCOPES.unpublish_blog, "blog:publish");
    assert.equal(TOOL_SCOPES.archive_blog, "blog:publish");
  });

  it("marks read tools read-only so clients need not prompt for them", () => {
    for (const tool of tools.filter((candidate) => TOOL_SCOPES[candidate.name] === "content:read")) {
      assert.notEqual(
        tool.annotations?.readOnlyHint,
        false,
        `${tool.name} is a read tool but is annotated as a mutation`
      );
    }
  });

  it("annotates destructive tools so clients ask before running them", () => {
    for (const name of ["archive_blog", "unpublish_blog", "archive_project", "unpublish_project"]) {
      const tool = tools.find((candidate) => candidate.name === name);
      assert.equal(tool?.annotations?.destructiveHint, true, `${name} must be flagged destructive`);
    }
  });

  it("requires an idempotency key on every mutation", () => {
    for (const tool of tools.filter((candidate) => TOOL_SCOPES[candidate.name] !== "content:read")) {
      assert.ok(
        tool.inputSchema.properties?.idempotency_key,
        `${tool.name} must accept an idempotency_key so a client retry cannot duplicate the change`
      );
    }
  });

  it("requires expected_version on tools that modify existing content", () => {
    // Exempt: tools that create rather than modify, and asset tools -- Asset
    // carries no version column, so delete_media is guarded by its in-use check
    // instead of optimistic concurrency.
    const unversioned = new Set([
      "create_blog",
      "create_project",
      "update_site_section",
      "upload_image",
      "delete_media",
    ]);
    for (const tool of tools.filter(
      (candidate) =>
        TOOL_SCOPES[candidate.name] !== "content:read" && !unversioned.has(candidate.name)
    )) {
      assert.ok(
        tool.inputSchema.properties?.expected_version,
        `${tool.name} must accept expected_version so it cannot silently overwrite an admin edit`
      );
    }
  });
});
