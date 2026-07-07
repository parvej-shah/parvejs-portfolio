# Auth — Rules

- NextAuth Credentials provider only — no OAuth providers unless explicitly requested.
- Config lives in `lib/auth.ts`; route handler at `app/api/auth/[...nextauth]/route.ts`.
- Password check uses bcrypt (`bcryptjs`) against `User.passwordHash`. Never store or log
  plaintext passwords.
- `middleware.ts` protects `/admin/*` (except `/admin/login`) at the edge — redirect
  unauthenticated requests to `/login`. This is the enforcement point; individual pages/routes
  should not re-implement redirect logic, but API routes that mutate data still must verify
  the session server-side (defense in depth — see `.agents/invariants.md`).
- Exactly one `User` row is expected (seeded via `prisma/seed.ts` from `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` env vars). Do not build a registration flow.
