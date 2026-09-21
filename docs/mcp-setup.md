# Content Management MCP Setup

The application exposes an authenticated Streamable HTTP MCP endpoint at:

```text
https://mcp.parvejshah.com/mcp
```

Any MCP client that speaks OAuth 2.1 can connect — ChatGPT, Claude, Cursor, Antigravity,
the MCP Inspector. Nothing in the server is client-specific.

## Architecture

This deployment is **both** the OAuth authorization server and the MCP resource
server. The owner approves connections with the same admin session that guards
`/admin`.

```text
MCP client ──1. register──▶ /oauth/register        (RFC 7591 dynamic registration)
           ──2. authorize─▶ /oauth/authorize       (PKCE S256)
                            └─▶ admin session ──▶ approval screen ──▶ you click Allow
           ──3. token─────▶ /oauth/token           (code + verifier → RS256 access token)
           ──4. call──────▶ /mcp                   (Bearer, aud=https://mcp.parvejshah.com/mcp)
```

There is no third-party identity provider, by design. `/admin` is already
protected by this login and can already do everything the MCP tools expose, so
putting a separate provider in front of MCP would add a dependency without
adding authority — an attacker with the admin password would simply use
`/admin`. Raising the bar (passkeys, 2FA) on the admin login raises it for both
surfaces at once.

What a third party *did* provide was an unavoidable human interaction. That is
replaced by an explicit approval screen: being signed in is not enough, you must
click **Allow** for each connection. The approval form carries a per-request
nonce that is only ever rendered to the signed-in owner on this origin, so a
cross-site form cannot approve a connection on your behalf, and the page is
served with `frame-ancestors 'none'` so it cannot be clickjacked.

## 1. Generate the token signing key

Access tokens are RS256 JWTs signed by this deployment:

```bash
npm run mcp:keygen
```

Copy the printed `MCP_JWT_PRIVATE_KEY` value. Rotating the key invalidates every
outstanding MCP access token, which is the intended way to cut off all clients at once.

## 2. Configure deployment variables

```dotenv
MCP_PUBLIC_URL=https://mcp.parvejshah.com
MCP_JWT_PRIVATE_KEY=<base64 PKCS#8 PEM from npm run mcp:keygen>
```

Two variables, and everything else is derived from the first — so advertised metadata
cannot drift from the URLs actually served. If either is missing, every OAuth and MCP
endpoint deliberately returns `503` and performs no operation.

The owner's identity is the admin `User` row, not an environment value. `AuditLog.actorId`
records that user id for every MCP-driven change.

Scopes, and why `blog:publish` is separate from `blog:write`:

```text
content:read    read blogs, projects, sections, change history
blog:write      create and edit drafts
blog:publish    publish, unpublish, archive
project:write   create, edit, publish, archive projects
site:write      edit website sections
```

A token holding `blog:write` cannot publish. Grant a client only what it needs.

## 3. Route the MCP domain

Point `mcp.parvejshah.com` at the same deployment as the website. These URLs must be
reachable over HTTPS:

```text
GET  /.well-known/oauth-protected-resource
GET  /.well-known/oauth-protected-resource/mcp
GET  /.well-known/oauth-authorization-server
GET  /.well-known/jwks.json
GET  /oauth/authorize
POST /oauth/authorize
POST /oauth/register
POST /oauth/token
POST /oauth/revoke
GET|POST|DELETE /mcp
```

## 4. Apply the database migrations

Review the SQL, then run the production migration command:

```text
prisma/migrations/20260920000000_harden_content_mutations/migration.sql
prisma/migrations/20260921000000_add_oauth_authorization_server/migration.sql
prisma/migrations/20260921120000_owner_session_authorization/migration.sql
```

```bash
npx prisma migrate deploy
```

## 5. Connect a client

Add `https://mcp.parvejshah.com/mcp` as a custom MCP connector. The client discovers the
authorization server, registers itself, and opens a browser. Sign in with your admin
credentials if you are not already signed in, then review the requested scopes and click
**Allow access**.

Test with draft creation first — publishing is always a separate `publish_blog` call.

## Running the tests

```bash
npm test                 # unit tests, no database required
TEST_DATABASE_URL=postgresql://... npm run test:integration
```

The integration suite exercises single-use authorization codes, PKCE mismatch, redirect
URI binding, resource-indicator enforcement, and refresh token rotation/replay against a
real Postgres. Point it at a throwaway database with the migrations applied — a Neon
branch or a local container — never at production.

## Operational checks

- Missing/invalid bearer token returns `401` with OAuth resource discovery metadata.
- Valid token with insufficient scope returns `403` with the required scope.
- An authorization code cannot be redeemed twice.
- A replayed refresh token revokes the whole family for that client.
- An unauthenticated visitor to `/oauth/authorize` is sent to `/login`, not issued a code.
- No code is issued until the owner clicks **Allow access**.
- The approval form cannot be submitted cross-site or embedded in a frame.
- Repeating a mutation with the same idempotency key does not repeat the write.
- A stale `expected_version` fails instead of overwriting a newer admin/MCP change.
- Draft and archived content never appears on public pages.
- Every mutation appears in `get_change_history` and the `AuditLog` table.
