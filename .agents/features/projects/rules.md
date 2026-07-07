# Projects — Rules

- Model, service, repo, and Zod schema live at: `prisma/schema.prisma` (Project model),
  `lib/validators/project.ts`, `lib/services/projectService.ts`, `lib/data/projectRepo.ts`.
- Case-study fields (`problem`, `approach`, `solution`, `results`) are Markdown text, rendered
  via `lib/markdown.ts` on the public detail page — never render raw/unsanitized HTML.
- `slug` is unique, derived from `name` on create, editable pre-publish only (see
  `.agents/invariants.md` on slug immutability post-publish).
- `status` gates visibility: only `PUBLISHED` projects appear in `getPublishedProjects` /
  `getProjectBySlug` (in `lib/data/`). Admin list shows both DRAFT and PUBLISHED.
- `featured` + `order` control which projects surface on the homepage
  (`components/Portfolio.jsx`) and in what sequence — homepage shows featured only, capped
  at a small count (match current 3-project layout unless told otherwise).
- Images go through `lib/storage.ts` (R2 adapter) → `Asset` records; a project's `coverImage`
  and `gallery` reference `Asset` rows, not raw URLs typed by hand.
- Admin CRUD routes: `app/api/projects/route.ts` + `[id]/route.ts`. Public reads never go
  through these routes — they use the `lib/data/projectRepo.ts` helpers directly (server
  components), keeping public pages fast and not dependent on an HTTP round-trip to self.
