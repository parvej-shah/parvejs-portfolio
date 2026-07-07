# Sections (Section CMS) — Rules

- One `SiteContent` row per section, keyed by `key` (`hero`, `services`, `stats`, `about`,
  `skills`, `testimonials`, `cta`, `contact`, `social`, `footer`, `seo`), `value` as
  validated Json.
- Each section key has its own Zod shape in `lib/validators/section.ts` — a Strategy-style
  dispatch by key, not one giant catch-all schema.
- API: `app/api/content/[key]/route.ts` (GET/PUT), admin-guarded.
- Read helper: `getSection(key)` in `lib/data/` — used by the homepage `.jsx` components at
  render time.
- When wiring a section component to the DB (e.g. `components/Portfolio.jsx`,
  `components/Insights.jsx`), only change how it sources data — do not redesign its markup
  or styling as part of this migration (see Surgical Changes in `CLAUDE.md`).
