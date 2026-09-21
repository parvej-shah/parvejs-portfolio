import { generateKeyPairSync } from "node:crypto";

export const TEST_ISSUER = "https://mcp.example.test";
export const TEST_RESOURCE = `${TEST_ISSUER}/mcp`;
export const TEST_OWNER_EMAIL = "owner@example.test";
export const TEST_OWNER_SUBJECT = "google-subject-123";

/**
 * The OAuth modules read configuration from the environment on every call, so
 * tests install a complete, self-consistent configuration before using them.
 */
export function installTestOAuthEnv() {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

  process.env.MCP_PUBLIC_URL = TEST_ISSUER;
  process.env.MCP_JWT_PRIVATE_KEY = Buffer.from(pem).toString("base64");
  process.env.MCP_GOOGLE_CLIENT_ID = "test-google-client-id";
  process.env.MCP_GOOGLE_CLIENT_SECRET = "test-google-client-secret";
  process.env.MCP_ALLOWED_EMAIL = TEST_OWNER_EMAIL;
  delete process.env.MCP_ALLOWED_SUBJECT;
  return { pem };
}
