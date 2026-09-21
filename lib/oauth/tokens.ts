import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { prisma } from "@/lib/prisma";
import type { McpScope } from "@/lib/mcp/scopes";
import { getOAuthConfig } from "@/lib/oauth/config";
import { getSigningKey, MCP_JWT_ALGORITHM } from "@/lib/oauth/keys";
import { hashToken, randomToken } from "@/lib/oauth/pkce";

export const ACCESS_TOKEN_TTL_SECONDS = 900;
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

export type TokenSubject = {
  subject: string;
  email?: string | null;
  name?: string | null;
};

export type AccessTokenClaims = JWTPayload & {
  sub: string;
  client_id: string;
  scope: string;
  email?: string;
  name?: string;
};

export async function mintAccessToken(
  identity: TokenSubject,
  clientId: string,
  scopes: McpScope[]
): Promise<{ token: string; expiresIn: number }> {
  const config = getOAuthConfig();
  const { privateKey, kid } = await getSigningKey();

  const token = await new SignJWT({
    client_id: clientId,
    scope: scopes.join(" "),
    ...(identity.email ? { email: identity.email } : {}),
    ...(identity.name ? { name: identity.name } : {}),
  })
    .setProtectedHeader({ alg: MCP_JWT_ALGORITHM, kid, typ: "at+jwt" })
    .setIssuer(config.issuer)
    .setAudience(config.resource)
    .setSubject(identity.subject)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .setJti(randomToken(16))
    .sign(privateKey);

  return { token, expiresIn: ACCESS_TOKEN_TTL_SECONDS };
}

export async function verifyAccessToken(token: string): Promise<AccessTokenClaims> {
  const config = getOAuthConfig();
  const { publicKey } = await getSigningKey();
  const { payload } = await jwtVerify(token, publicKey, {
    issuer: config.issuer,
    audience: config.resource,
    algorithms: [MCP_JWT_ALGORITHM],
  });
  if (!payload.sub) throw new Error("The access token has no subject");
  return payload as AccessTokenClaims;
}

export async function issueRefreshToken(
  identity: TokenSubject,
  clientId: string,
  scopes: McpScope[],
  resource: string | null
) {
  const token = randomToken();
  await prisma.oAuthRefreshToken.create({
    data: {
      clientId,
      tokenHash: hashToken(token),
      subject: identity.subject,
      email: identity.email ?? null,
      name: identity.name ?? null,
      scopes,
      resource,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    },
  });
  return token;
}

export async function consumeRefreshToken(token: string, clientId: string) {
  const record = await prisma.oAuthRefreshToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!record || record.clientId !== clientId) return null;

  // Rotation: a replayed refresh token is treated as compromise and revokes the
  // whole family for that subject rather than silently issuing a second token.
  if (record.revokedAt || record.expiresAt <= new Date()) {
    await prisma.oAuthRefreshToken.updateMany({
      where: { subject: record.subject, clientId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return null;
  }

  await prisma.oAuthRefreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  });
  return record;
}

export async function revokeRefreshToken(token: string, clientId: string) {
  await prisma.oAuthRefreshToken.updateMany({
    where: { tokenHash: hashToken(token), clientId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
