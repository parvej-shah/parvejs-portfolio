# Blog — Rules

- Model, service, repo, and Zod schema live at: `prisma/schema.prisma` (Post model),
  `lib/validators/post.ts`, `lib/services/postService.ts`, `lib/data/postRepo.ts`.
- `body` is Markdown, rendered via `lib/markdown.ts` (shared with the Projects case-study
  renderer — don't duplicate the render logic).
- `readingTime` is computed server-side at save time (via the `reading-time` package in
  `lib/markdown.ts`), not recomputed on every page render.
- `slug` unique, derived from `title` on create, immutable post-publish (see
  `.agents/invariants.md`).
- `status` gates visibility exactly like Projects: only `PUBLISHED` posts appear via
  `getPublishedPosts` / `getPostBySlug`. `publishedAt` is set the first time status flips
  to PUBLISHED (don't overwrite it on subsequent edits).
- `category` is a plain string field for now (matches the existing `Insights.jsx` mock
  data shape: "Business Growth", "Product Design", etc.) — not a separate taxonomy model
  unless explicitly requested.
- Admin CRUD routes: `app/api/posts/route.ts` + `[id]/route.ts`. Public pages read via
  `lib/data/postRepo.ts` directly, same reasoning as Projects.
