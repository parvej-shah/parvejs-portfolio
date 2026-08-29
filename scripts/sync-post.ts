import { prisma as portfolioPrisma } from "../lib/prisma";
import { upsertPostFromWebhook } from "../lib/services/postService";

async function syncPost() {
  const assetPayload = {
    title: "Why Browser Agents Fail in Production Without Semantic Layers",
    slug: "why-browser-agents-fail-in-production-without-semantic-layers",
    excerpt: "Browser agents do not fail because the model is bad. They fail because modern web applications render complex DOM trees with opaque elements and unstable class names that are hostile to machine parsers.",
    content: `## The Fragility of Machine Vision in Modern DOMs

Maybe the next evolution of frontend engineering isn't just designing interfaces for humans. It is designing interfaces that machines can reliably understand too.

Browser agents don't always fail because the AI model is bad. Often, the web page itself is fundamentally hostile to machine parsers. Modern single-page applications (SPAs) render deeply nested \`<div>\` trees with ephemeral, auto-generated class names (such as Tailwind or CSS-in-JS hashes). While this provides fluid visual rendering for human users, it strips away semantic meaning for automated agents.

\`\`\`mermaid
graph TD
  A[AI Browser Agent] -->|Fragile Visual OCR / Coordinate Guessing| B[Opaque Div Hierarchy]
  B -->|Frontend Code Deploy / CSS Hash Shift| C[Broken Automation & Flaky Selectors]
  A -->|Direct Deterministic Query| D[Semantic Schema & data-agent Attributes]
  D -->|Refactor-Proof Contract| E[Deterministic Task Execution]
\`\`\`

---

## Moving Beyond Ephemeral Selectors

We already treat accessibility (a11y) as a non-negotiable contract between the frontend and assistive technologies through ARIA attributes. Why not extend that exact engineering rigor to AI agents?

Imagine components exposing explicit, stable machine intent:

\`\`\`typescript
// The machine contract: deterministic, testable, refactor-proof
<button 
  data-agent="checkout-submit-button"
  data-agent-action="complete-transaction"
  className="btn-primary"
>
  Confirm & Pay
</button>
\`\`\`

With explicit semantic attributes:
1. **Zero Layout Guesswork:** The agent does not need to guess which button to click based on pixel coordinates or fragile CSS selectors.
2. **Deterministic Interaction Paths:** Continuous integration (CI) test suites can validate machine contracts alongside accessibility audits.
3. **Reduced Latency & Token Costs:** Vision-language models (VLMs) introduce non-deterministic latency and high token costs when inspecting DOM trees. Semantic annotations impose near-zero runtime overhead while guaranteeing parse stability.

---

## Machine Intent as a First-Class Frontend Concern

Frontend development is expanding beyond human visual presentation. Treating machine intent as a first-class citizen transforms web applications into programmable, resilient interfaces that AI agents can navigate with 100% precision.`,
    coverImageUrl: "https://pub-13629069dfd74891bffc487ab4e135f5.r2.dev/assets/bab02951-9cb5-4e46-b056-635c35b42c8c-hero-1787836780942.png",
    status: "PUBLISHED" as const,
    publishedAt: new Date("2026-08-27T17:31:00.373Z")
  };

  console.log("Upserting post to portfolio database...");
  const post = await upsertPostFromWebhook(assetPayload);
  console.log("Successfully published post to portfolio!", {
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    publishedAt: post.publishedAt,
    url: "https://parvejshah.com/blog/" + post.slug
  });
}

syncPost()
  .catch(console.error)
  .finally(() => portfolioPrisma.$disconnect());
