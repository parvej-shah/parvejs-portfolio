# Memory — current state & open decisions

Keep this short and current. Prune resolved items instead of just appending. This is not
a session log — `git log` is the log. This file is "what does an agent need to know right
now that isn't obvious from the code."

## Stack (confirmed)
- Next.js 16 / React 19 / Tailwind v4 / shadcn. Existing site code is `.jsx` — new CMS/admin
  code is TypeScript (`allowJs: true`, mixed codebase is intentional, not a migration target).
- DB: **Neon Postgres** via Prisma (pooled `DATABASE_URL` at runtime, direct `DIRECT_URL` for
  migrations).
- File storage: **Cloudflare R2** (S3-compatible) via `@aws-sdk/client-s3`, wrapped in
  `lib/storage.ts` as an Adapter — never import the S3 SDK elsewhere.
- Auth: NextAuth Credentials, single seeded admin user, no public signup.
- Content bodies (blog, case studies): **Markdown**, rendered via `react-markdown` +
  `remark-gfm`.

## Current initiative
Building an admin dashboard + CMS on top of the previously-static portfolio site. See
`TASKS.md` for the full wave-by-wave task breakdown and `.agents/features/` for per-feature
docs as they're built out.

Two-agent parallel split:
- **Agent A** — backend/infra: Prisma schema, auth, storage adapter, API routes, data/service layers.
- **Agent B** — frontend/UI: admin screens, public `/projects` + `/blog` pages, homepage CMS wiring.
File ownership boundary and wave sync points are defined in `TASKS.md` — check there before
touching a file outside your assigned area.

CMS has two surfaces:
1. **Content CMS** (Projects + Blog, full CRUD, Markdown + case studies) — Phase 1.
2. **Section CMS** (homepage sections as `SiteContent` key/value rows, Zod-typed per section)
   — Phase 2, deferred until Phase 1 ships.

## Open decisions / not yet started
- Prerequisites (Neon project, R2 bucket + API token, `NEXTAUTH_SECRET`, admin credentials)
  are to be provided by the repo owner before Agent A can run migrations/seed — see
  "Setup Prerequisites" in `TASKS.md`.
- No code has been written yet for this initiative as of this entry. Update this section
  once Wave 0 lands.
