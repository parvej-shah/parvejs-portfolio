# Blog — Purpose

Lets the site owner publish articles ("Insights") from the admin panel. Replaces the
placeholder posts currently hardcoded in `components/Insights.jsx` ("Coming soon").

Two consumers:
- **Admin** (`/admin/posts`) — create/edit/delete, Markdown body with live preview,
  cover image upload, draft/publish.
- **Public** (`/blog`, `/blog/[slug]`) — list of published posts + full article page.
  `components/Insights.jsx` (homepage) shows a recent/curated subset and its "View Insights"
  CTA links to `/blog`.

Non-goals: no comments, no multi-author, no tagging taxonomy beyond a single `category`
string, no scheduled/future publishing (publish is immediate on status change) unless
asked for later.
