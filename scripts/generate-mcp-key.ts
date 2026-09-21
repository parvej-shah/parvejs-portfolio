import { generateKeyPairSync } from "node:crypto";

// One-off helper for provisioning MCP_JWT_PRIVATE_KEY. The key never leaves the
// operator's hands — this script only prints it.
const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

console.log("Add this to your environment (single line, base64-encoded PEM):\n");
console.log(`MCP_JWT_PRIVATE_KEY=${Buffer.from(pem).toString("base64")}\n`);
console.log("Rotating this key invalidates every outstanding MCP access token.");
