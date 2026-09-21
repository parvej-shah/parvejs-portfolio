import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { SignJWT } from "jose";
import {
  installTestOAuthEnv,
  TEST_ISSUER,
  TEST_OWNER_EMAIL,
  TEST_OWNER_SUBJECT,
  TEST_RESOURCE,
} from "../helpers/env";

process.env.DATABASE_URL ??= "postgresql://unused:unused@localhost:5432/unused";
installTestOAuthEnv();

const { mintAccessToken, verifyAccessToken } = await import("@/lib/oauth/tokens");
const { getSigningKey } = await import("@/lib/oauth/keys");
const { decodeProtectedHeader, decodeJwt } = await import("jose");

const OWNER = { subject: TEST_OWNER_SUBJECT, email: TEST_OWNER_EMAIL, name: "Site Owner" };

describe("MCP access tokens", () => {
  let token: string;

  before(async () => {
    ({ token } = await mintAccessToken(OWNER, "client-abc", ["content:read", "blog:write"]));
  });

  it("round-trips through verification with the issuer's own key", async () => {
    const claims = await verifyAccessToken(token);
    assert.equal(claims.sub, TEST_OWNER_SUBJECT);
    assert.equal(claims.client_id, "client-abc");
    assert.equal(claims.scope, "content:read blog:write");
    assert.equal(claims.email, TEST_OWNER_EMAIL);
  });

  it("is audienced to the MCP resource and issued by this deployment", async () => {
    const claims = decodeJwt(token);
    assert.equal(claims.iss, TEST_ISSUER);
    assert.equal(claims.aud, TEST_RESOURCE);
  });

  it("is signed RS256 and carries the published key id", async () => {
    const header = decodeProtectedHeader(token);
    const { kid } = await getSigningKey();
    assert.equal(header.alg, "RS256");
    assert.equal(header.typ, "at+jwt");
    assert.equal(header.kid, kid);
  });

  it("rejects a token whose payload was tampered with", async () => {
    const [header, payload, signature] = token.split(".");
    const forged = JSON.parse(Buffer.from(payload, "base64url").toString());
    forged.scope = "content:read blog:write blog:publish";
    const tampered = [
      header,
      Buffer.from(JSON.stringify(forged)).toString("base64url"),
      signature,
    ].join(".");
    await assert.rejects(() => verifyAccessToken(tampered));
  });

  it("rejects a token minted for a different audience", async () => {
    const { privateKey, kid } = await getSigningKey();
    const wrongAudience = await new SignJWT({ client_id: "client-abc", scope: "content:read" })
      .setProtectedHeader({ alg: "RS256", kid })
      .setIssuer(TEST_ISSUER)
      .setAudience("https://someone-elses-server.test/mcp")
      .setSubject(TEST_OWNER_SUBJECT)
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(privateKey);
    await assert.rejects(() => verifyAccessToken(wrongAudience), /"aud"/);
  });

  it("rejects a token from a different issuer", async () => {
    const { privateKey, kid } = await getSigningKey();
    const wrongIssuer = await new SignJWT({ client_id: "client-abc", scope: "content:read" })
      .setProtectedHeader({ alg: "RS256", kid })
      .setIssuer("https://evil.test")
      .setAudience(TEST_RESOURCE)
      .setSubject(TEST_OWNER_SUBJECT)
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(privateKey);
    await assert.rejects(() => verifyAccessToken(wrongIssuer), /"iss"/);
  });

  it("rejects an expired token", async () => {
    const { privateKey, kid } = await getSigningKey();
    const expired = await new SignJWT({ client_id: "client-abc", scope: "content:read" })
      .setProtectedHeader({ alg: "RS256", kid })
      .setIssuer(TEST_ISSUER)
      .setAudience(TEST_RESOURCE)
      .setSubject(TEST_OWNER_SUBJECT)
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
      .sign(privateKey);
    await assert.rejects(() => verifyAccessToken(expired), /"exp"/);
  });

  it("expires access tokens within an hour", async () => {
    const claims = decodeJwt(token);
    assert.ok(claims.exp && claims.iat);
    assert.equal(claims.exp - claims.iat, 3600);
  });
});
