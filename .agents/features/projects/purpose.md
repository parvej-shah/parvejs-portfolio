# Projects — Purpose

The portfolio's "Projects" are not simple cards — each one is a **case study**: a written
account of the problem, the approach taken, the solution built, and the results, alongside
the usual name/tags/links/cover image. This feature lets the site owner manage that content
from the admin panel instead of hardcoding it in `components/Portfolio.jsx`.

Two consumers of this data:
- **Admin** (`/admin/projects`) — create/edit/delete, upload images, draft/publish.
- **Public** (`/projects`, `/projects/[slug]`) — list of published projects + full case-study
  detail page. `components/Portfolio.jsx` (homepage) shows a curated/featured subset and
  links out to `/projects/[slug]`.

Non-goals: no multi-author projects, no commenting/reactions, no versioning/revision history.
