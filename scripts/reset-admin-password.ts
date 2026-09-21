import "dotenv/config";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline";
import { prisma } from "@/lib/prisma";

// Matches the cost factor used by prisma/seed.ts, so a reset password verifies
// exactly like a seeded one.
const BCRYPT_COST = 10;
const MIN_LENGTH = 12;

/**
 * Reads the new password without echoing it. Accepts a pipe (so the caller can
 * use `read -s` and keep it out of shell history) and falls back to a masked
 * prompt when run interactively.
 */
async function readSecret(promptText: string): Promise<string> {
  if (!process.stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const asHidden = rl as unknown as { _writeToOutput: (value: string) => void };
  const original = asHidden._writeToOutput.bind(rl);
  asHidden._writeToOutput = (value: string) => {
    original(value.includes(promptText) ? promptText : "");
  };

  try {
    return await new Promise<string>((resolve) => {
      rl.question(promptText, (answer) => {
        process.stdout.write("\n");
        resolve(answer);
      });
    });
  } finally {
    rl.close();
  }
}

async function main() {
  const requestedEmail = process.argv[2] ?? process.env.ADMIN_EMAIL;

  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  if (!users.length) {
    throw new Error("No admin user exists. Run `npm run seed` to create one.");
  }

  const user = requestedEmail
    ? users.find((candidate) => candidate.email.toLowerCase() === requestedEmail.toLowerCase())
    : users.length === 1
      ? users[0]
      : undefined;

  if (!user) {
    throw new Error(
      requestedEmail
        ? `No admin user with that email. Known: ${users.map((u) => u.email).join(", ")}`
        : `Several admin users exist; pass one: ${users.map((u) => u.email).join(", ")}`
    );
  }

  console.log(`Resetting the password for ${user.email}`);
  const password = await readSecret("New password: ");
  if (password.length < MIN_LENGTH) {
    throw new Error(
      `Password must be at least ${MIN_LENGTH} characters. This one credential now guards both ` +
        "the admin dashboard and every MCP connection, so it is worth making long."
    );
  }

  if (process.stdin.isTTY) {
    const confirmation = await readSecret("Confirm password: ");
    if (confirmation !== password) throw new Error("The two entries did not match. Nothing changed.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(password, BCRYPT_COST) },
  });
  console.log("Password updated.");

  // The admin password is the root credential for MCP as well: approving a
  // connection only requires this session. A reset therefore invalidates the
  // access already derived from the old one.
  const revoked = await prisma.oAuthRefreshToken.updateMany({
    where: { revokedAt: null },
    data: { revokedAt: new Date() },
  });
  console.log(
    revoked.count
      ? `Revoked ${revoked.count} MCP refresh token(s). Reconnect each client with /mcp.`
      : "No active MCP refresh tokens to revoke."
  );
  console.log(
    "Access tokens already issued stay valid for up to 15 minutes. To cut them off now, " +
      "rotate MCP_JWT_PRIVATE_KEY (npm run mcp:keygen) and redeploy."
  );
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
