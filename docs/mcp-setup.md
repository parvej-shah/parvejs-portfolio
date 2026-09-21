# Content Management MCP Setup

The application exposes an authenticated Streamable HTTP MCP endpoint at:

```text
https://mcp.parvejshah.com/mcp
```

Any MCP client that speaks OAuth 2.1 can connect — ChatGPT, Claude, Cursor, Antigravity,
the MCP Inspector. Nothing in the server is client-specific.

## Architecture

This deployment is **both** the OAuth authorization server and the MCP resource server.
Google is only the login step; it never issues the tokens that MCP clients present.

```text
MCP client ──1. register──▶ /oauth/register        (RFC 7591 dynamic registration)
           ──2. authorize─▶ /oauth/authorize       (PKCE S256)
                            └─▶ Google Sign-In ──▶ /oauth/callback
           ──3. token─────▶ /oauth/token           (code + verifier → RS256 access token)
           ──4. call──────▶ /mcp                   (Bearer, aud=https://mcp.parvejshah.com/mcp)
```

Google cannot serve as the authorization server directly: it issues tokens for its own
audience with its own scopes, and it does not support dynamic client registration. Signing
in with Google proves *who* someone is; the owner allowlist decides whether that identity
may manage the site.

Because the flow only requests the `openid email profile` scopes, the Google OAuth app
needs **no verification review** — those scopes are non-sensitive. Testing status works
too; the usual 7-day refresh-token expiry for testing apps does not apply here, since no
Google refresh token is ever stored.

## 1. Create the Google OAuth client

In Google Cloud Console → *Google Auth Platform* → *Clients*, create an **OAuth client ID**
of type *Web application* with:

```text
Authorized redirect URI: https://mcp.parvejshah.com/oauth/callback
```

On the *Audience* page, either publish the app or add the owner's Google account as a test
user. Keep the account used here consistent with `MCP_ALLOWED_EMAIL` below.

## 2. Generate the token signing key

Access tokens are RS256 JWTs signed by this deployment:

```bash
npm run mcp:keygen
```

Copy the printed `MCP_JWT_PRIVATE_KEY` value. Rotating the key invalidates every
outstanding MCP access token, which is the intended way to cut off all clients at once.

## 3. Configure deployment variables

```dotenv
MCP_PUBLIC_URL=https://mcp.parvejshah.com
MCP_JWT_PRIVATE_KEY=<base64 PKCS#8 PEM from npm run mcp:keygen>
MCP_GOOGLE_CLIENT_ID=<from step 1>
MCP_GOOGLE_CLIENT_SECRET=<from step 1>
MCP_ALLOWED_EMAIL=you@example.com
MCP_ALLOWED_SUBJECT=<Google `sub`, once known>
```

Every OAuth endpoint, the JWT issuer, and the token audience (`<MCP_PUBLIC_URL>/mcp`) are
derived from `MCP_PUBLIC_URL`, so metadata cannot drift from the URLs actually served.

`MCP_ALLOWED_EMAIL` is the setup-friendly allowlist; the immutable Google subject is the
preferred production value and is visible in the `AuditLog.actorId` column after the first
successful connection. If OAuth configuration or the owner allowlist is missing, every
OAuth and MCP endpoint deliberately returns `503` and performs no operation.

Scopes, and why `blog:publish` is separate from `blog:write`:

```text
content:read    read blogs, projects, sections, change history
blog:write      create and edit drafts
blog:publish    publish, unpublish, archive
project:write   create, edit, publish, archive projects
site:write      edit website sections
```

A token holding `blog:write` cannot publish. Grant a client only what it needs.

## 4. Route the MCP domain

Point `mcp.parvejshah.com` at the same deployment as the website. These URLs must be
reachable over HTTPS:

```text
GET  /.well-known/oauth-protected-resource
GET  /.well-known/oauth-protected-resource/mcp
GET  /.well-known/oauth-authorization-server
GET  /.well-known/jwks.json
GET  /oauth/authorize
GET  /oauth/callback
POST /oauth/register
POST /oauth/token
POST /oauth/revoke
GET|POST|DELETE /mcp
```

## 5. Apply the additive database migrations

Two migrations are required. The first adds archival status, optimistic versions, and the
append-only audit table; the second adds the OAuth client, authorization, and refresh
token tables. Review the SQL, then run the production migration command:

```text
prisma/migrations/20260920000000_harden_content_mutations/migration.sql
prisma/migrations/20260921000000_add_oauth_authorization_server/migration.sql
```

```bash
npx prisma migrate deploy
```

## 6. Connect a client

Add `https://mcp.parvejshah.com/mcp` as a custom MCP connector. The client discovers the
authorization server, registers itself, and opens a Google sign-in window. Approve with
the allowlisted account.

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
- A Google account outside the allowlist is rejected at `/oauth/callback`.
- Repeating a mutation with the same idempotency key does not repeat the write.
- A stale `expected_version` fails instead of overwriting a newer admin/MCP change.
- Draft and archived content never appears on public pages.
- Every mutation appears in `get_change_history` and the `AuditLog` table.
