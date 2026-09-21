import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { installTestOAuthEnv } from "../helpers/env";

/**
 * Exercises the token endpoint against a real Postgres, because the guarantees
 * under test — single-use authorization codes, refresh rotation, replay
 * detection — are enforced by database writes, not by application logic.
 *
 * Point TEST_DATABASE_URL at a throwaway database with the migrations applied:
 *   TEST_DATABASE_URL=postgresql://... npm run test:integration
 */
const databaseUrl = process.env.TEST_DATABASE_URL;
const skip = databaseUrl ? false : "TEST_DATABASE_URL is not set";

if (databaseUrl) process.env.DATABASE_URL = databaseUrl;
installTestOAuthEnv();

describe("OAuth token endpoint", { skip }, async () => {
  const { prisma } = await import("@/lib/prisma");
  const { POST } = await import("@/app/oauth/token/route");
  const { hashToken, randomToken, s256Challenge } = await import("@/lib/oauth/pkce");
  const { verifyAccessToken } = await import("@/lib/oauth/tokens");

  const REDIRECT_URI = "https://claude.ai/api/mcp/auth_callback";
  let clientId: string;

  async function seedClient() {
    const client = await prisma.oAuthClient.create({
      data: {
        name: "integration-test-client",
        redirectUris: [REDIRECT_URI],
        grantTypes: ["authorization_code", "refresh_token"],
        scopes: ["content:read", "blog:write", "blog:publish"],
        tokenEndpointAuthMethod: "none",
      },
    });
    return client.id;
  }

  async function seedAuthorization(verifier: string, scopes = ["content:read", "blog:write"]) {
    const code = randomToken();
    await prisma.oAuthAuthorization.create({
      data: {
        clientId,
        redirectUri: REDIRECT_URI,
        scopes,
        resource: `${process.env.MCP_PUBLIC_URL}/mcp`,
        codeChallenge: s256Challenge(verifier),
        codeChallengeMethod: "S256",
        approvalNonce: randomToken(),
        approvedAt: new Date(),
        codeHash: hashToken(code),
        subject: "admin-user-id-123",
        email: "owner@example.test",
        name: "Site Owner",
        expiresAt: new Date(Date.now() + 600_000),
      },
    });
    return code;
  }

  function tokenRequest(form: Record<string, string>) {
    return POST(
      new Request(`${process.env.MCP_PUBLIC_URL}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form).toString(),
      })
    );
  }

  before(async () => {
    clientId = await seedClient();
  });

  beforeEach(async () => {
    await prisma.oAuthAuthorization.deleteMany({ where: { clientId } });
    await prisma.oAuthRefreshToken.deleteMany({ where: { clientId } });
  });

  after(async () => {
    await prisma.oAuthClient.deleteMany({ where: { name: "integration-test-client" } });
    await prisma.$disconnect();
  });

  it("exchanges a valid code for an access token carrying the granted scopes", async () => {
    const verifier = randomToken(48);
    const code = await seedAuthorization(verifier);

    const response = await tokenRequest({
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      code_verifier: verifier,
      redirect_uri: REDIRECT_URI,
    });
    assert.equal(response.status, 200);

    const body = (await response.json()) as Record<string, string>;
    assert.equal(body.token_type, "Bearer");
    assert.equal(body.scope, "content:read blog:write");
    assert.ok(body.refresh_token);

    const claims = await verifyAccessToken(body.access_token);
    assert.equal(claims.sub, "admin-user-id-123");
    assert.equal(claims.client_id, clientId);
  });

  it("refuses a second exchange of the same authorization code", async () => {
    const verifier = randomToken(48);
    const code = await seedAuthorization(verifier);
    const form = {
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      code_verifier: verifier,
      redirect_uri: REDIRECT_URI,
    };

    assert.equal((await tokenRequest(form)).status, 200);

    const replay = await tokenRequest(form);
    assert.equal(replay.status, 400);
    assert.equal(((await replay.json()) as { error: string }).error, "invalid_grant");
  });

  it("refuses a code presented with the wrong PKCE verifier", async () => {
    const verifier = randomToken(48);
    const code = await seedAuthorization(verifier);

    const response = await tokenRequest({
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      code_verifier: randomToken(48),
      redirect_uri: REDIRECT_URI,
    });
    assert.equal(response.status, 400);
    assert.match(((await response.json()) as { error_description: string }).error_description, /PKCE/);
  });

  it("refuses a code redeemed against a different redirect_uri", async () => {
    const verifier = randomToken(48);
    const code = await seedAuthorization(verifier);

    const response = await tokenRequest({
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      code_verifier: verifier,
      redirect_uri: "https://attacker.test/callback",
    });
    assert.equal(response.status, 400);
  });

  it("refuses a code belonging to another client", async () => {
    const verifier = randomToken(48);
    const code = await seedAuthorization(verifier);
    const otherClientId = await seedClient();

    const response = await tokenRequest({
      grant_type: "authorization_code",
      client_id: otherClientId,
      code,
      code_verifier: verifier,
      redirect_uri: REDIRECT_URI,
    });
    assert.equal(response.status, 400);
    await prisma.oAuthClient.delete({ where: { id: otherClientId } });
  });

  it("refuses an unknown client", async () => {
    const response = await tokenRequest({ grant_type: "authorization_code", client_id: "nope" });
    assert.equal(response.status, 401);
  });

  it("refuses a token request aimed at a different resource", async () => {
    const response = await tokenRequest({
      grant_type: "authorization_code",
      client_id: clientId,
      resource: "https://someone-elses-server.test/mcp",
    });
    assert.equal(response.status, 400);
    assert.equal(((await response.json()) as { error: string }).error, "invalid_target");
  });

  it("rotates the refresh token and revokes the family when one is replayed", async () => {
    const verifier = randomToken(48);
    const code = await seedAuthorization(verifier);
    const first = (await (
      await tokenRequest({
        grant_type: "authorization_code",
        client_id: clientId,
        code,
        code_verifier: verifier,
        redirect_uri: REDIRECT_URI,
      })
    ).json()) as Record<string, string>;

    const refreshed = await tokenRequest({
      grant_type: "refresh_token",
      client_id: clientId,
      refresh_token: first.refresh_token,
    });
    assert.equal(refreshed.status, 200);
    const second = (await refreshed.json()) as Record<string, string>;
    assert.notEqual(second.refresh_token, first.refresh_token);
    assert.equal(second.scope, "content:read blog:write");

    // Replaying the rotated-out token is treated as compromise.
    const replay = await tokenRequest({
      grant_type: "refresh_token",
      client_id: clientId,
      refresh_token: first.refresh_token,
    });
    assert.equal(replay.status, 400);

    const afterReplay = await tokenRequest({
      grant_type: "refresh_token",
      client_id: clientId,
      refresh_token: second.refresh_token,
    });
    assert.equal(afterReplay.status, 400, "the whole refresh family must be revoked after a replay");
  });

  it("rejects an unsupported grant type", async () => {
    const response = await tokenRequest({ grant_type: "password", client_id: clientId });
    assert.equal(response.status, 400);
    assert.equal(
      ((await response.json()) as { error: string }).error,
      "unauthorized_client"
    );
  });
});
