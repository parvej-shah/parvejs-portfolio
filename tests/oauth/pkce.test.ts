import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { describe, it } from "node:test";
import {
  constantTimeEquals,
  hashToken,
  randomToken,
  s256Challenge,
  verifyPkce,
} from "@/lib/oauth/pkce";

describe("PKCE", () => {
  it("derives the S256 challenge exactly as RFC 7636 specifies", () => {
    const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    const expected = createHash("sha256").update(verifier).digest("base64url");
    assert.equal(s256Challenge(verifier), expected);
    assert.equal(s256Challenge(verifier), "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });

  it("accepts a matching verifier", () => {
    const verifier = randomToken(48);
    assert.equal(verifyPkce(verifier, s256Challenge(verifier), "S256"), true);
  });

  it("rejects a mismatched verifier", () => {
    const verifier = randomToken(48);
    assert.equal(verifyPkce(randomToken(48), s256Challenge(verifier), "S256"), false);
  });

  it("rejects the plain method, which OAuth 2.1 forbids", () => {
    const verifier = randomToken(48);
    assert.equal(verifyPkce(verifier, verifier, "plain"), false);
  });

  it("hashes tokens rather than storing them, and hashes deterministically", () => {
    const token = randomToken();
    assert.notEqual(hashToken(token), token);
    assert.equal(hashToken(token), hashToken(token));
    assert.notEqual(hashToken(token), hashToken(randomToken()));
  });

  it("compares equal-length secrets in constant time and rejects different lengths", () => {
    const secret = randomBytes(16).toString("hex");
    assert.equal(constantTimeEquals(secret, secret), true);
    assert.equal(constantTimeEquals(secret, secret.slice(0, -1)), false);
    assert.equal(constantTimeEquals(secret, randomBytes(16).toString("hex")), false);
  });
});
