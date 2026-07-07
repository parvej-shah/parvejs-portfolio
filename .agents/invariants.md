# Invariants — must never be violated

These hold regardless of how a task is framed. If a request conflicts with one of these,
stop and ask rather than comply silently.

## Security
- The admin panel (`/admin/*`) is single-user. Never add public signup, multi-role auth,
  or open registration without explicit instruction.
- Server-only secrets (`R2_SECRET_ACCESS_KEY`, `DATABASE_URL`, `NEXTAUTH_SECRET`,
  `ADMIN_PASSWORD`, DB connection strings) must never reach client bundles, logs, or
  committed files. Only `.env.example` (with placeholder values) is committed.
- Every `app/api/**` route that mutates data must verify an authenticated admin session
  server-side (via `middleware.ts` / session check) — never trust a client-supplied role.
- All external input (form submissions, API bodies, file uploads) is validated with Zod
  at the boundary before touching the database.

## Data
- Public pages (`/projects`, `/blog`, homepage) must only ever render `PUBLISHED` content.
  Draft rows are never exposed outside `/admin`.
- Never run a destructive Prisma migration (drop column/table) without explicit confirmation
  — flag it and ask first.
- Slugs are unique and immutable once a project/post is published (changing a live slug
  breaks external links/SEO) — if a slug must change post-publish, ask first.

## Architecture
- Respect the MVC/layered split (Model / Service / Controller / View) defined in
  `CLAUDE.md`. Do not put business logic directly in `app/api/**/route.ts` handlers or
  database queries directly in React components.
- `lib/validators/*` and `lib/types.ts` are the single source of truth for data shapes.
  Never redeclare a type or schema that already exists there.
- Existing `.jsx` components are not migrated to `.tsx` opportunistically — only migrate
  a file when the task specifically requires editing it for CMS wiring.

## Process
- Never delete or overwrite another agent's in-progress work on file paths outside your
  assigned ownership (see the active task doc's file-ownership section).
- Never commit without being asked to.
- Never bypass git hooks, lint, or type errors to "get it green."
