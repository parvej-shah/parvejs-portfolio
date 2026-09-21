import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** Opaque credentials are only ever stored as a digest, never in the clear. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function s256Challenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

/**
 * OAuth 2.1 requires PKCE and this server only accepts S256 — `plain` offers no
 * protection against an intercepted authorization code.
 */
export function verifyPkce(verifier: string, challenge: string, method: string): boolean {
  if (method !== "S256") return false;
  const expected = Buffer.from(s256Challenge(verifier));
  const actual = Buffer.from(challenge);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function constantTimeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
