import { createPublicKey } from "node:crypto";
import { calculateJwkThumbprint, exportJWK, importPKCS8, type JWK, type KeyObject } from "jose";
import { OAuthConfigurationError } from "@/lib/oauth/config";

export const MCP_JWT_ALGORITHM = "RS256";

type SigningKey = {
  privateKey: CryptoKey | KeyObject;
  publicKey: CryptoKey | KeyObject;
  publicJwk: JWK;
  kid: string;
};

let cached: { pem: string; key: SigningKey } | undefined;

/**
 * Accepts the PEM either literally, with escaped newlines (what most dashboards
 * produce when a multiline value is pasted), or base64-encoded.
 */
function normalizePem(raw: string): string {
  const unescaped = raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
  if (unescaped.includes("-----BEGIN")) return unescaped.trim();
  const decoded = Buffer.from(unescaped, "base64").toString("utf8");
  if (decoded.includes("-----BEGIN")) return decoded.trim();
  throw new OAuthConfigurationError("MCP_JWT_PRIVATE_KEY is not a PKCS#8 PEM private key");
}

export async function getSigningKey(): Promise<SigningKey> {
  const raw = process.env.MCP_JWT_PRIVATE_KEY;
  if (!raw) throw new OAuthConfigurationError("Missing required environment variable: MCP_JWT_PRIVATE_KEY");

  const pem = normalizePem(raw);
  if (cached?.pem === pem) return cached.key;

  const privateKey = await importPKCS8(pem, MCP_JWT_ALGORITHM, { extractable: true });
  const publicKey = createPublicKey({ key: pem, format: "pem" });
  const publicJwk = await exportJWK(publicKey);
  const kid = await calculateJwkThumbprint(publicJwk);

  const key: SigningKey = {
    privateKey,
    publicKey,
    publicJwk: { ...publicJwk, kid, alg: MCP_JWT_ALGORITHM, use: "sig" },
    kid,
  };
  cached = { pem, key };
  return key;
}

export async function getPublicJwks() {
  const { publicJwk } = await getSigningKey();
  return { keys: [publicJwk] };
}
