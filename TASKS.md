# Portfolio Admin Dashboard + CMS — Agent Task List

> **Read `CLAUDE.md` first** (repo root) — it's the operating contract for how to work in
> this repo. Then check `.agents/invariants.md` (hard constraints) and `.agents/memory.md`
> (current state) before starting. When working inside a specific feature, also read that
> feature's `.agents/features/<feature>/purpose.md` + `rules.md`.

Two AI agents work in parallel:
- **Agent A — Backend / Infra** (DB, Prisma, auth, storage, API, data helpers)
- **Agent B — Frontend / UI** (admin panel screens, public pages, forms, editors)

Tasks are grouped into **waves**. Give them **top-to-bottom**. Do not start a task until
its **Blocked by** is complete. Within a wave, A and B never edit the same files.

---

## 🔑 SETUP PREREQUISITES (owner provides BEFORE Agent A starts Wave 0)

Agent A cannot run migrations, seed, or file uploads until these exist. Create them in
Neon and Cloudflare R2, then fill a local `.env` (NOT committed — only `.env.example` is committed).

1. **Neon Postgres project** — create at neon.tech. From the project's Connection Details:
   - `DATABASE_URL` — the **pooled** connection string (host contains `-pooler`), used by
     the app at runtime.
   - `DIRECT_URL` — the **direct** (non-pooled) connection string, used by Prisma Migrate.
   - Both include `?sslmode=require`.
2. **Cloudflare R2 bucket** (S3-compatible) — create a bucket (e.g. `portfolio-assets`) in
   the Cloudflare dashboard → R2. Create an **R2 API Token** (Object Read & Write).
   - `R2_ACCOUNT_ID` — Cloudflare account ID.
   - `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` — from the R2 API token.
   - `R2_BUCKET` — the bucket name above.
   - `R2_ENDPOINT` — `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`.
   - `R2_PUBLIC_URL` — the bucket's **public** base URL (enable a public r2.dev domain or a
     custom domain), used to build image `src` URLs for `next/image`.
   All server-only; never expose the secret key to the client.
3. **NextAuth secret** — `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`),
   and `NEXTAUTH_URL` = `http://localhost:3000` for local dev.
4. **Admin credentials for seeding** — `ADMIN_EMAIL` and `ADMIN_PASSWORD` (the single
   admin login; seed script hashes the password with bcrypt).

**Checklist for owner:** `[ ] Neon project  [ ] pooled + direct URLs  [ ] R2 bucket + API token
[ ] R2 account/keys/endpoint/public URL  [ ] NEXTAUTH_SECRET  [ ] ADMIN_EMAIL/PASSWORD`
→ paste into `.env`.

> Agent A: after `.env` is provided, confirm connectivity with `npx prisma migrate dev`
> before proceeding past A0.2. If any var is missing, stop and request it — do not hardcode.

---

## ⭐ ENGINEERING STANDARDS — apply to EVERY task below

(Full rationale in `CLAUDE.md` at repo root — this is the condensed, task-specific version
plus the file-ownership map for this initiative.)

Every agent, on every task, MUST:

1. **Follow MVC / layered architecture.** Keep concerns separated:
   - **Model** = Prisma models + `lib/validators` (Zod) + `lib/data` (data access). No HTTP here.
   - **Controller** = `app/api/**/route.ts` handlers — thin: parse → validate → call service/data → respond. No business logic inline.
   - **View** = React components / pages. No direct DB or fetch logic inside JSX; call services/hooks.
   - **Service layer** (`lib/services/*`) holds business logic shared by controllers. Routes stay skinny.
2. **Use design patterns where they fit** (and name them in code comments):
   Repository (data access), Singleton (Prisma/R2 clients), Factory/Builder for complex
   objects, Strategy for interchangeable behavior, Adapter around 3rd-party SDKs (R2 S3 SDK/NextAuth).
   Do not over-engineer — pattern must earn its place.
3. **Avoid code smells.** No duplication (DRY), no God functions/files, no magic numbers/strings
   (use constants/enums), no deep nesting (early returns), small single-responsibility functions,
   meaningful names, no dead code, no `any` (use inferred Zod types from `lib/types.ts`).
4. **Clean code hygiene:** consistent formatting, small PR-sized commits with clear messages,
   handle errors explicitly (never swallow), validate all input at the boundary (Zod),
   never leak secrets/service keys to the client, guard every admin route.
5. **Reuse before you build.** Use existing `cn()` (`lib/utils.js`), shadcn `ui/*`,
   `buttonVariants`, `Reveal`, the `@/*` alias, and A's `lib/validators`/`lib/types` — do not
   duplicate types or re-declare shapes.
6. **TypeScript for all new code** (`.ts`/`.tsx`). Existing `.jsx` stays. `allowJs: true`.
7. **Respect file ownership** (below) to avoid merge conflicts.

**File ownership (hard boundary):**
- **Agent A only:** `prisma/`, `lib/` (all), `app/api/`, `middleware.ts`,
  `app/(admin)/layout.tsx`, `app/(admin)/login/`, `package.json`, `.env.example`,
  `tsconfig.json`, `next.config.mjs`.
- **Agent B only:** `components/admin/`, `app/(admin)/**/page.tsx` (screens except login/layout),
  `app/projects/`, `app/blog/`, and the homepage component swaps (`Portfolio.jsx`, `Insights.jsx`).
- **Shared, A-authored then read-only for B:** `lib/validators/*`, `lib/types.ts`.

---

## WAVE 0 — Agent A only (Agent B waits for the SYNC POINT)

**A0.1 — Project setup & dependencies**
Install: `prisma @prisma/client next-auth @auth/prisma-adapter zod bcryptjs
react-hook-form @hookform/resolvers react-markdown remark-gfm @aws-sdk/client-s3
@aws-sdk/s3-request-presigner reading-time`.
Dev: `typescript @types/node @types/bcryptjs`. Add `tsconfig.json` with `allowJs: true`,
`strict: true`, `@/*` paths. Create `.env.example` with `DATABASE_URL, DIRECT_URL,
NEXTAUTH_SECRET, NEXTAUTH_URL, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
R2_BUCKET, R2_ENDPOINT, R2_PUBLIC_URL, ADMIN_EMAIL, ADMIN_PASSWORD`.
Add the R2 public host to `next.config.mjs` `images.remotePatterns`.
*Standards: keep deps minimal; no unused packages.*

**A0.2 — Prisma schema + migration**
Model `User, Project, Post, Asset, SiteContent` + enums `Status(DRAFT|PUBLISHED)`.
Project includes case-study fields (`problem, approach, solution, results` as Markdown,
`client, role, timeline, techStack[]`, `gallery` → Asset relation, `order, featured, slug`).
Run `prisma migrate dev`. *Standards: enums not magic strings; explicit relations; indexes on `slug`.*

**A0.3 — Client singletons (Singleton pattern)**
`lib/prisma.ts` (global-cached PrismaClient), `lib/storage.ts` (server-side R2 client via the
AWS S3 SDK — `S3Client` configured for the R2 endpoint — wrapped in an **Adapter** exposing
`uploadObject(key, body, contentType)` / `getPublicUrl(key)` so the rest of the app never
imports the S3 SDK directly). This keeps storage swappable (Strategy) later.

**A0.4 — Validators + shared types ← CONTRACT FILE (freeze after)**
`lib/validators/{project,post,asset,section}.ts` (Zod schemas). `lib/types.ts` exports
`z.infer` types. This is the single source of truth both agents build against.
*Standards: one schema per model; reuse via `.extend()`/`.pick()`, no duplication.*

**A0.5 — Auth + middleware**
`lib/auth.ts` NextAuth Credentials, admin-only, bcrypt compare (wrap NextAuth as an Adapter).
`app/api/auth/[...nextauth]/route.ts`. `middleware.ts` guards `/admin/*`, redirect to `/login`.
*Standards: never trust client; guard is server-side; no credentials in logs.*

**A0.6 — Admin shell + login (View skeleton)**
`app/(admin)/layout.tsx` server-side auth guard + shell (sidebar: Dashboard/Projects/Posts/
Sections, sign-out). `app/(admin)/login/page.tsx`. Reuse `cn`, `ui/*`, theme.

**A0.7 — Seed script**
`prisma/seed.ts`: seed admin user (env creds, hashed), migrate existing hardcoded projects
+ create `SiteContent` rows from current JSX sections. *Standards: idempotent upserts.*

**✋ SYNC POINT — A announces: validators/types frozen + API route signatures documented.
Agent B may now start.**

---

## WAVE 1 — Agent A and Agent B in parallel

### Agent A
**A1.1 — Projects API (thin controller + service + repository)**
`lib/services/projectService.ts` (business logic) + `lib/data/projectRepo.ts` (Prisma access).
`app/api/projects/route.ts` (GET list, POST) + `[id]/route.ts` (GET/PATCH/DELETE).
Admin-guarded, Zod-validated, consistent JSON error shape. *Blocked by A0.4, A0.5.*
*Standards: route handler ≤ ~15 lines; logic in service; DB in repo.*

**A1.2 — Posts API** — same layered pattern as A1.1.

**A1.3 — Upload API** `app/api/upload/route.ts` → uploads to Cloudflare R2 via the
`lib/storage.ts` adapter (`uploadObject`), persists an `Asset` record with the public URL
(`getPublicUrl`). Validate file type/size; generate a unique object key. *Standards: R2 secret
key stays server-only; Strategy-ready for future storage providers.*

### Agent B
**B1.1 — Admin UI primitives (reusable, DRY)**
`components/admin/`: `DataTable`, `FormField`, `MarkdownEditor` (textarea + `react-markdown`
live preview), `ImageUploader` (posts to `/api/upload` contract — stub response until A1.3),
`StatusBadge`, `SlugInput`. *Blocked by A0.4, A0.6. Standards: presentational, prop-driven,
no fetch logic inside — accept handlers via props.*

**B1.2 — Admin Projects screens** (list + new + edit) with `react-hook-form` +
`@hookform/resolvers/zod` using A's schema. Wire to typed **mock data** for now.
*Blocked by B1.1. Standards: form logic in a custom hook (`useProjectForm`), not in JSX.*

**B1.3 — Admin Posts screens** — same pattern as B1.2.

---

## WAVE 2 — parallel

### Agent A
**A2.1 — Public data helpers (Repository, published-only, cached)**
`lib/data/`: `getPublishedProjects`, `getProjectBySlug`, `getPublishedPosts`, `getPostBySlug`.
*Blocked by A0.2. Standards: never expose drafts; single query per call; cache with `unstable_cache`.*

**A2.2 — Markdown service** `lib/markdown.ts`: render Markdown→HTML (react-markdown/remark-gfm)
+ reading-time. Centralized so views don't re-implement.

### Agent B
**B2.1 — Wire admin screens to live API** — replace mocks in B1.2/B1.3 with real fetches to
A1.1–A1.3. Use a small typed API client (`lib/api-client.ts` on B's side, or a fetch hook).
*Blocked by A1.1–A1.3, A0.4.*

**B2.2 — Public Projects pages** `app/projects/page.tsx` (list) + `[slug]/page.tsx`
(case-study detail: problem/approach/solution/results + gallery), SSR via `lib/data`,
`generateMetadata`, reuse `Reveal`/`cn`/section styling. *Blocked by A2.1, A2.2.*

**B2.3 — Public Blog pages** `app/blog/page.tsx` + `[slug]/page.tsx`, SSR + Markdown render +
`generateMetadata`. Point existing "View Insights" CTA at `/blog`. *Blocked by A2.1, A2.2.*

---

## WAVE 3 — parallel (full section CMS — Phase 2)

### Agent A
**A3.1 — Section content API** `app/api/content/[key]/route.ts` GET/PUT + per-section Zod
shapes in `lib/validators/section.ts`. Admin-guarded. *Standards: Strategy pattern — one
validator per section key, dispatched by key.*

**A3.2 — Section data helper + seed** `getSection(key)` + extend seed to cover all sections.

### Agent B
**B3.1 — Admin Section editors** — one typed form per homepage section + a global **SEO**
editor, wired to A3.1. *Blocked by A3.1. Standards: generate forms from a config map, not
copy-paste per section (DRY).*

**B3.2 — Swap homepage to DB** — `Portfolio.jsx` → `getPublishedProjects`,
`Insights.jsx` → `getPublishedPosts`, other sections → `getSection`. *Blocked by A3.2, A2.1.*

---

## Definition of Done (every task)
- Compiles (`npm run build`), lint clean (`npm run lint`), types sound (no `any`).
- MVC boundaries respected; route handlers thin; logic in services; DB in repos.
- No duplication, no magic values, functions single-responsibility, errors handled.
- Input validated with Zod at the boundary; admin routes guarded; no secret leaks.
- Reused existing utils/components; committed in small, clearly-messaged commits.
