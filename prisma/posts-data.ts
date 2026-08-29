export interface PostSeedData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    alt: string;
  };
  featured: boolean;
  publishedAt: Date;
}

export const blogPosts: PostSeedData[] = [
  {
    slug: "why-browser-agents-fail-in-production-without-semantic-layers",
    title: "Why Browser Agents Fail in Production Without Semantic Layers",
    excerpt:
      "Browser agents do not fail because the model is bad. They fail because modern web applications render complex DOM trees with opaque elements and unstable class names that are hostile to machine parsers.",
    coverImage: {
      url: "/og/why-browser-agents-fail-in-production-without-semantic-layers.jpg",
      alt: "Why Browser Agents Fail in Production Without Semantic Layers Cover",
    },
    featured: true,
    publishedAt: new Date("2026-08-27T17:31:00.000Z"),
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
  },
  {
    slug: "architecting-sub-18s-voice-ai-pipelines",
    title: "What a 1,272ms Calendar Check Taught Us About Voice AI Latency",
    excerpt:
      "The fabricated version of this story used a single made-up model and an 850ms→24ms Redis cache. The real one: two different Flash-tier models across two live agents, n8n's built-in staticData cache, and a 5-question intake that was quietly adding two minutes to every call.",
    coverImage: {
      url: "/blog/voice-ai-sub-18s.png",
      alt: "Sub-1.8s Voice AI Pipelines Architecture Cover",
    },
    featured: true,
    publishedAt: new Date("2026-02-15T09:00:00.000Z"),
    content: `In the enterprise Voice AI space, there is a vast gulf between high-level architectural whitepapers and what actually runs on production telephony lines when real customers call in.

When building conversational booking agents for service contractors using **Retell AI**, **n8n**, **EspoCRM**, and **Google Calendar**, the technical challenge is rarely about getting a model to understand English.

The real engineering challenge is the vicious intersection of **round-trip latency, external CRM tool execution overhead, and per-minute telephony economics**. Here's what that actually looked like in production, and what it took to fix.

## 1. Two Agents, Two Models

There isn't one voice agent here — there are two live deployments, running two different models. The Horizon Realty (real estate) agent runs **\`gemini-2.0-flash\`** as its response engine. The Ironclad Pest (pest control) agent runs **Gemini 3.1 Flash Lite**. Both are Flash-tier models, chosen specifically over flagship models like GPT-4o for lower Time-To-First-Token (TTFT) and lower per-token cost on high-volume telephony — a real engineering call, even without pretending we benchmarked this project's actual cost against models we never ran in production.

## 2. The Real Latency Budget

Every external tool call — checking Google Calendar, touching EspoCRM — pauses the voice pipeline. Our own component-level benchmark table, honestly labeled by source: the n8n rows are measured directly by this project's regression suite, the STT/TTFT/TTS rows are cited industry and vendor benchmarks, not something our own tooling instrumented.

| Component | Target SLA | Benchmark |
| :--- | :--- | :--- |
| STT (Deepgram Nova-2) | < 180ms | ~140ms |
| LLM TTFT (Gemini 2.0 Flash) | < 300ms | ~220ms |
| TTS first packet (Cartesia Brian) | < 180ms | ~120ms |
| n8n cache check | < 150ms | **92.5ms** (measured) |
| n8n calendar booking | < 1000ms | **846.5ms** (measured) |
| Total conversational turn | < 800ms | ~600ms |

## 3. The Actual Bottleneck Wasn't the Model

The pest-control agent's real production data told a different story than the latency table above. Reading the actual call transcripts, the problem wasn't model speed — it was conversation shape. The original Emergency Intake flow had **5 mandatory sequential nodes**, each asking exactly one question, regardless of what the caller had already said in their opening statement. Add fee disclosure, time preference, a live **1,272ms** Google Calendar round-trip for every single availability check, and confirmation, and a booking call needed 10-12 agent turns minimum — well past the 4-6 turns a well-designed intake needs.

## 4. Caching Without Redis

The fix for the 1,272ms calendar round-trip wasn't an external cache service — it's n8n's own workflow state. Here's the actual deployed node, pulled directly from the live n8n instance:

\`\`\`javascript
// Actual deployed check_availability Code node (n8n)
const staticData = $getWorkflowStaticData('global');
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const now = Date.now();

if (
  staticData.slotsCache &&
  staticData.slotsCachedAt &&
  (now - staticData.slotsCachedAt) < CACHE_TTL_MS
) {
  // Cache hit: <50ms, no Google Calendar call at all
  const cachedSlots = staticData.slotsCache;
  return [{ json: { available_slots: cachedSlots.slice(0, 5), cache_hit: true } }];
}

// Cache miss: compute from live Google Calendar data, then store for next time
const allFreeSlots = computeFreeSlotsFromCalendarEvents($input.all());
staticData.slotsCache = allFreeSlots;
staticData.slotsCachedAt = now;
return [{ json: { available_slots: allFreeSlots.slice(0, 5), cache_hit: false } }];
\`\`\`

No Redis, no external cache service — just n8n's own \`staticData\` global object with a 5-minute TTL. A cold lookup (Google Calendar API round-trip) costs **1,272ms**; a cache hit inside that window costs **under 50ms**.

## 5. Rebuilding the Intake as Multi-Slot Extraction

The second fix targeted turn count directly: replacing the 5 rigid sequential questions with a single extraction pass that reads what the caller already said and only asks for what's actually missing — "Got it — can I grab your name, phone, and address?" instead of five separate one-at-a-time prompts.

## 6. What Actually Moved

Average call duration on the pest-control agent dropped from an internal ~3m40s baseline to **~2m18s**, measured across the most recent 45 live calls. The availability cache turned a 1,272ms cold path into a sub-50ms cache hit for repeat lookups. No manufactured comparison table against GPT-4o or Claude, no invented per-1,000-call cost figure — those numbers don't correspond to anything this project ever measured.`,
  },
  {
    slug: "deterministic-multi-agent-systems-production",
    title: "The Claims Gate: How We Stopped an AI Content Pipeline From Inventing Customer Results",
    excerpt:
      "The original version of this post described a TypeScript state machine controlling research → draft → critic → publish agents. That system doesn't exist. What's actually running is a 4-stage Qwen pipeline with one safety mechanism worth writing about: a gate that blocks any AI-generated claim it can't source — including a hard rule against fabricating customer results, because there aren't paying clients to attribute them to yet.",
    coverImage: {
      url: "/blog/multi-agent-state-machines.png",
      alt: "Deterministic Multi-Agent State Machines Architecture Cover",
    },
    featured: true,
    publishedAt: new Date("2026-02-10T10:30:00.000Z"),
    content: `The interesting engineering problem in an automated content pipeline for **Minions.AI** — a trade-contractor content engine — turned out not to be agent orchestration. It's not really about "researcher" and "writer" agents arguing in a loop, or a fragile hand-off protocol between them. The problem that actually mattered in production was narrower and more dangerous: stopping the pipeline from confidently publishing something false.

## The Real Pipeline

Every draft moves through four Qwen (DashScope) model calls, each sized to what the stage actually needs rather than running a flagship model end to end:

| Stage | Model | Why |
| :--- | :--- | :--- |
| Strategist | \`qwen3.7-max\` | Highest-leverage reasoning step — angle, audience fit, positioning. Errors here propagate through the whole draft, and the output is short, so flagship cost is negligible. |
| Writer | \`qwen-plus\` | Long-form generation (700–1000 words). Highest token volume of the four calls, so this is where cost tier matters most. |
| Editor | \`qwen3.7-flash\` | A bounded task — tighten prose, enforce style, and extract + classify every factual claim in the draft. |
| Variants | \`qwen-flash\` | Reformatting already-finished copy for LinkedIn and Facebook — no new reasoning needed. |

This runs as an n8n workflow, not a hand-rolled orchestrator: a scheduled harvester proposes ideas twice a week, and a webhook-triggered pipeline runs each one through the four stages above, generates a hero image, uploads it to Cloudflare R2 before the image host's signed URL expires, and either publishes or gates the result.

## The Claims Gate

The Editor stage doesn't just tighten prose — it extracts every factual claim in the draft and classifies it: \`STATISTIC\`, \`FACT\`, \`MARKET_CLAIM\`, \`PRODUCT_CLAIM\`, \`OPINION\`, or \`CUSTOMER_RESULT\`. Each claim then needs a source URL to pass.

One rule is hardcoded, not a judgment call: **any claim classified \`CUSTOMER_RESULT\` is blocked outright.** Not "flagged for review" — blocked. The reasoning is stated plainly in the pipeline's own documentation: the business has zero paying clients as of this writing, so any claim about a customer result would be fabricated by definition. There's no result to attribute yet, so the gate doesn't let the pipeline invent one.

Unsourced statistics, facts, and market claims are blocked too, unless they carry a real source URL. Opinion claims pass without a source — they're not verifiable by nature and aren't gate-relevant.

## Enforcement, Not Just Reporting

The gate isn't a lint warning that a human can shrug off — it runs in two places:

1. **Inline, during generation.** If the claims gate doesn't pass, the asset skips straight past the auto-publish step instead of going live to the blog and Facebook Page.
2. **Again in a separate review-publisher workflow**, which polls the database every 5 minutes for anything a human has since approved manually in the review dashboard, and republishes it through the same gated path — so a claim can't sneak through by a human reviewer overriding the wrong field.

Either path leaves anything that isn't cleanly passed in a \`BLOCKED_PENDING_REVIEW\` state rather than live on the site.

## What This Buys

This doesn't solve "AI agents coordinating AI agents" in some general sense — there's no elaborate retry protocol or critic-agent handshake here, and there doesn't need to be. It solves the one failure mode that actually matters for a marketing content pipeline running largely unattended: don't let the system say something happened for a customer when nothing has happened yet. Everything else — tone, structure, formatting — can be imperfect and get caught in review. A fabricated customer result is the one mistake that isn't safe to publish and fix later.`,
  },
  {
    slug: "engineering-precision-data-platforms-sft-rlhf",
    title: "What It Actually Takes to Build a Workforce Management Platform for an AI Company",
    excerpt:
      "When GenMorphics AI Solutions needed a platform to coordinate their global team of domain experts, the hard part wasn't the AI — it was compliance, access control, and building tools flexible enough to match how the org actually runs.",
    coverImage: {
      url: "/blog/precision-data-sft-rlhf.png",
      alt: "Building LLM Workforce Platforms Cover",
    },
    featured: true,
    publishedAt: new Date("2026-02-02T14:00:00.000Z"),
    content: `The initial brief from **GenMorphics AI Solutions** sounded straightforward: build a dashboard to help their team coordinate work across a global network of domain experts. As we got into the details, "dashboard" turned out to be underselling it — this became a systems-architecture problem touching compliance, access control, and payroll as much as task management.

## Skill-Scoped Task Routing

GenMorphics works with specialists across software engineering, mathematics, legal reasoning, and scientific writing. Routing doesn't try to auto-score someone's expertise — a specialist holds skills within categories, and eligibility for a task comes down to whether they hold the named skill in the required category.

The real design problem wasn't the matching logic — it was making the categories specific enough to mean something. "Knows Python" is close to useless as a routing signal. Splitting software engineering into language-specific tracks, and mathematics into calculus, linear algebra, and discrete math as separate categories rather than one "math" bucket, is what actually made routing reliable. The hard part of this system was taxonomy design, not algorithms.

## Access Control as Data, Not Code

The platform serves people with fundamentally different access needs — domain experts who should see only their own tasks, project managers scoped to their own client portfolios, admins with full reach. Instead of hardcoding role checks scattered through the app, permissions live in the database: each role is a row with a set of \`resource.action.scope\` permissions — \`payment.read.own\`, \`nda.manage.all\`, and so on.

That decision paid off the first time GenMorphics needed a new role with a slightly different permission mix. It didn't need a deploy — it needed a database row. For an app that has to keep pace with how a growing team actually organizes itself, that flexibility mattered more than a marginally simpler hardcoded system would have.

## Building an NDA Engine Instead of Buying One

Client task data — code, documents, domain material — can't reach a specialist until they've signed an NDA specific to that engagement. Rather than bolt on a third-party e-signature product, we built the NDA lifecycle inside the platform: a TipTap-based rich text editor with a custom node type for inserting recipient-specific variables into a legal template, template versioning so a signed document stays tied to the exact terms it was signed under, and a cryptographic hash of the final document for tamper-evidence.

Because NDA volume scales with contractor headcount, admins also needed to act on instances in bulk — voiding, expiring, counter-signing, reverting, or extending many at once rather than one dialog at a time. Building this in-house meant the NDA gate could be wired directly into task access instead of living as a disconnected compliance checkbox.

## Payroll That Matches How the Org Actually Pays People

Payroll logic isn't one formula — it mirrors two different employment models in the same system. Operational roles (annotators, reviewers) are paid hourly against logged, effective time. Managerial roles are paid a fixed salary unless they have an hourly rate set, in which case hourly wins. Bonuses layer on top of either. None of this is generic timesheet-software logic — it's a direct encoding of how GenMorphics structures compensation across two different kinds of contributors.

## What We Learned

The technical complexity here was never really about AI — it was a direct translation of how GenMorphics organizes people, compliance, and money. The skill taxonomy, the data-driven permission model, the in-house NDA engine, the dual payroll model — each one exists because encoding the org's actual structure mattered more than reaching for the nearest off-the-shelf pattern. A schema that's grown to 28 models across 61 migrations without a rewrite is really a record of that structure evolving over time, and the platform evolving with it.`,
  },
  {
    slug: "conversational-commerce-webhook-architecture",
    title: "A Debouncer That Doesn't Scale Past One Worker (On Purpose, For Now)",
    excerpt:
      "SellerVai merges rapid-fire customer messages into one reply using an in-memory buffer that explicitly can't run on more than one process. Here's why that's the right call today, and what the code already says about the day it isn't.",
    coverImage: {
      url: "/blog/conversational-commerce-webhooks.png",
      alt: "Conversational Commerce Webhook Architecture Cover",
    },
    featured: false,
    publishedAt: new Date("2026-01-28T11:15:00.000Z"),
    content: `In Bangladesh and much of South and Southeast Asia, e-commerce doesn't look like what a Silicon Valley product manager pictures. Buyers don't browse a catalog and check out with a saved card. They send a message on Facebook or WhatsApp, ask if an item is in stock, negotiate slightly, confirm their address, and pay cash on delivery or by mobile banking transfer. The entire purchase funnel is a conversation.

**SellerVai** is built for exactly this reality — a sales agent that handles order inquiries across WhatsApp, Facebook Messenger, and Instagram, in Bengali and Banglish. The first engineering problem it has to solve isn't the AI. It's that customers don't send one message — they send four.

## The Problem With Multi-Message Bursts

A real customer message looks less like a single query and more like this, sent as three separate texts twenty seconds apart:

> *"vai ei sneaker ta ki size 42 ache?"*
> *"cash on delivery hobe?"*
> *"dhaka te koto din lagbe?"*

A webhook handler that reacts to each message independently fires three separate completions for what is, semantically, one question. The customer gets three overlapping replies instead of one coherent answer, and the token bill triples for no benefit.

## The Debouncer, As It Actually Runs

SellerVai's fix is a per-conversation buffer that waits for a customer to actually finish typing before generating a reply — not a fixed delay, a *quiet window*. Every new message from the same conversation resets the timer; the buffered messages only get flushed to the agent once 7 seconds pass with nothing new arriving.

\`\`\`python
# Simplified from the real handler — one buffer per conversation ID,
# reset on every new message, flushed after 7.0s of silence.
class MessageDebouncer:
    def __init__(self, delay: float = 7.0):
        self.delay = delay
        self.buffers: dict[str, list[str]] = {}
        self.timers: dict[str, asyncio.TimerHandle] = {}

    async def add_message(self, conversation_id: str, text: str, on_flush):
        self.buffers.setdefault(conversation_id, []).append(text)
        if conversation_id in self.timers:
            self.timers[conversation_id].cancel()

        async def flush():
            messages = self.buffers.pop(conversation_id, [])
            self.timers.pop(conversation_id, None)
            await on_flush(conversation_id, "\\n".join(messages))

        loop = asyncio.get_event_loop()
        self.timers[conversation_id] = loop.call_later(
            self.delay, lambda: asyncio.ensure_future(flush())
        )
\`\`\`

Three messages in twenty seconds become one joined prompt, and the agent replies once.

## Why In-Memory, Why Now

This buffer lives entirely in process memory, keyed by conversation ID — there's no Redis, no external store. That's a deliberate, scoped tradeoff, not an oversight, and the code says so directly: this design only works correctly with a single running worker. Run two workers behind a load balancer and a customer's messages could land on different processes, each with no idea the other is buffering the same conversation — the debounce would silently stop working.

For SellerVai's current traffic, one worker handling this path is genuinely fine — no infrastructure dependency, no network hop, no serialization cost, and a buffer that's trivial to reason about because it's just a dict. The migration path is already scoped for the day that stops being true: move the buffer and its timers into Redis, keyed the same way, so any worker can pick up any conversation. That's a known, deliberate future change, not a bug waiting to be found in production.

## Async Without a Queue

The webhook handlers themselves don't push work onto a job queue — they hand off to FastAPI's \`BackgroundTasks\`, which runs the debounce-and-reply logic after the HTTP response has already gone back to Meta or Telegram. That buys simplicity: no queue to operate, no broker to keep alive, no separate worker deployment. What it doesn't buy is durability — a task that's in flight when the process restarts is gone, the same way the debounce buffer is. Both tradeoffs point the same direction: this is a single-process design, made once, applied consistently, not different pieces of the system quietly disagreeing about how much reliability they promise.

## What We'd Tell the Next Team

Single-process-first isn't a shortcut you apologize for — it's a legitimate starting point when your actual load doesn't yet justify the operational cost of a queue and a distributed buffer. The mistake isn't choosing it. The mistake is choosing it silently, so nobody knows it's there until two workers get deployed and debouncing quietly breaks. Say it once, in the code, in plain language, and the tradeoff stops being a hidden bug and starts being a decision someone made on purpose.`,
  },
  {
    slug: "rendering-katex-formulas-nextjs-server-components",
    title: "Rendering Math Formulas When Your Content Has Two Different Pasts",
    excerpt:
      "MathPro Academy's course database holds years of plain-text content next to newly authored Lexical HTML. An earlier attempt at server-rendered LaTeX didn't survive that mix — here's the runtime renderer that replaced it, and why client-side was the right call, not a compromise.",
    coverImage: {
      url: "/blog/katex-math-server-components.png",
      alt: "Rendering KaTeX Formulas at Scale Cover",
    },
    featured: false,
    publishedAt: new Date("2026-01-20T16:45:00.000Z"),
    content: `**MathPro Academy** teaches JSC, SSC, and HSC mathematics to secondary students across Bangladesh. Formula rendering — quadratic formulas, trigonometric identities, the full range of secondary-school algebra — is not a cosmetic detail here; it's most of what the product actually shows a student.

## What Build-Time Rendering Assumes

Pre-rendering LaTeX to HTML at build time (or on the server per-request, ahead of sending anything to the browser) works cleanly when content is fixed and known in advance. MathPro's content isn't: instructors edit course material continuously through the admin panel, and — because the platform migrated its editor from plain text to Lexical in December 2025 — the database holds a permanent mix of both formats side by side, not a one-time migration that finished and left a single clean shape behind.

An earlier version of this rendering path leaned toward doing more of that work ahead of time. It didn't hold up against that mix: a renderer that assumes one content shape breaks the moment it meets the other.

## What Actually Ships

The real renderer, \`SafeHtmlRenderer\`, runs entirely client-side and does two jobs in sequence:

1. **Format detection.** It checks whether a record contains HTML tags. If not, it's legacy plain text — escaped and wrapped for consistent display. If it does, it's Lexical-authored HTML, sanitized through a fixed allowlist of tags and attributes before it ever touches the DOM.
2. **LaTeX rendering.** After the sanitized content mounts, a \`useEffect\` walks the container's text nodes looking for \`$...$\` (inline) and \`$$...$$\` (block) spans, and replaces each one with KaTeX-rendered markup — the same delimiter-matching logic the admin editor's own LaTeX plugin uses, so what an instructor sees while writing matches what a student sees while reading.

\`\`\`typescript
// Runs after mount, not on the server — the content it walks
// isn't known until the sanitized HTML is actually in the DOM.
useEffect(() => {
  if (processedContent?.type !== "html") return;
  renderLatexInElement(containerRef.current);
}, [processedContent]);
\`\`\`

This is a real trade-off, not a free win: KaTeX ships to the browser, and rendering happens after mount rather than being baked into the HTML response. What it buys back is correctness across every record in the database, old and new, without a migration project or a format the renderer has to assume in advance.

## The Sanitization Boundary Matters More Than the Renderer

The more interesting design decision isn't the KaTeX call — it's what happens before it. New content is run through a fixed allowlist of tags and attributes (\`DOMPurify\`) before \`dangerouslySetInnerHTML\` ever sees it. KaTeX's own markup is deliberately *not* pushed through that same sanitizer — its output relies on precise inline styles, MathML, and SVG that would need a much larger, riskier allowlist to preserve faithfully. Instead, KaTeX renders into the DOM directly, after the surrounding content has already been sanitized. Getting that boundary right — sanitize the untrusted parts, trust the library you control — is the part of this that would have been easy to get wrong.

## What We'd Tell the Next Team Doing This

If your content has one shape and it's fixed at build time, server-side pre-rendering is the better call — no argument. But "server-side" isn't automatically the more sophisticated choice. When the actual constraint is "the data has two generations mixed together and keeps changing," a runtime renderer that normalizes format first and renders second is the simpler, more honest design — even though it costs a client-side bundle and a post-mount pass that a cleaner dataset wouldn't need.`,
  },
  {
    slug: "defensive-webhook-engineering-payment-gateways",
    title: "What SSLCommerz Actually Gives You for Webhook Security (It's Not a Signature)",
    excerpt:
      "Payment webhook handlers fail in ways you only discover in production. For MathPro Academy's SSLCommerz integration, the fix wasn't HMAC signature verification — SSLCommerz doesn't sign its IPN payloads that way. It was an active server-to-server validation query, an amount cross-check, and a fraud score the gateway hands you for free.",
    coverImage: {
      url: "/blog/defensive-webhook-engineering.png",
      alt: "Defensive Webhook Engineering Cover",
    },
    featured: false,
    publishedAt: new Date("2026-01-14T08:20:00.000Z"),
    content: `There's a class of bug that only appears in production, under real network conditions, with real money. A webhook gets delivered twice. A deploy is mid-rollout when the POST arrives and the gateway retries. The first time you see it, a student has either paid without getting access, or has two enrollments for a course they bought once.

For **MathPro Academy**, students pay through SSLCommerz — the gateway that fronts bKash, Nagad, and card payments in Bangladesh. Its confirmation model is a webhook POST (the IPN), and the mistake most integrations make is trusting that POST's body as-is.

## SSLCommerz Doesn't Sign the Payload — So Don't Verify a Signature That Isn't There

Some payment gateways attach an HMAC signature to their webhook payload, and the correct move there is a timing-safe comparison against your own computed hash. SSLCommerz's IPN doesn't work that way. What it gives you instead is a validation API: given the transaction ID from the webhook, you query SSLCommerz's own server directly and it tells you, authoritatively, whether that transaction is real and in what state.

\`\`\`javascript
// Simplified from the real handler: never trust the IPN body directly —
// query SSLCommerz's own validation API for the transaction's true state.
const validationUrl =
  \`\${baseUrl}/validator/api/merchantTransIDvalidationAPI.php\` +
  \`?tran_id=\${encodeURIComponent(tranId)}\` +
  \`&store_id=\${storeId}&store_passwd=\${storePassword}&v=1&format=json\`;

const result = await fetchJson(validationUrl);
const transaction = result.element?.[0];

if (transaction?.status !== "VALID" && transaction?.status !== "VALIDATED") {
  // Reject — the gateway itself doesn't vouch for this transaction.
  return;
}
\`\`\`

The trust anchor isn't a shared secret compared byte-for-byte; it's a live round trip to a server SSLCommerz controls. That's a different shape of guarantee than HMAC, but not a weaker one for this use case — an attacker can't spoof a \`VALIDATED\` response from SSLCommerz's own infrastructure.

## The Amount Has to Match What You Actually Charged

The validation response includes the amount SSLCommerz actually processed. The handler compares that against the price recorded at checkout time — not the price in the IPN body, which a forged or replayed request could carry stale or altered. A mismatch fails the transaction outright, logged for manual reconciliation rather than silently fulfilled.

## Fraud Scoring You Don't Have to Build

SSLCommerz's validation response also includes a \`risk_level\` field — its own assessment of whether a transaction looks fraudulent. The handler checks it and flags risky transactions rather than treating every \`VALID\` status as equally trustworthy. This is fraud detection MathPro didn't have to build from scratch; it's already sitting in a field on a response the handler was querying anyway.

## Idempotency Without a Row Lock

The validation response itself distinguishes \`VALID\` (first time seen) from \`VALIDATED\` (already processed) — so a re-delivered IPN is caught by asking SSLCommerz "have I already told you this succeeded?" rather than by locking a row in MathPro's own database. On the enrollment write itself, a duplicate is handled as an expected, logged outcome — not a failure — since a retried webhook that's already been fulfilled shouldn't error the second time it arrives.

Every attempt — successful, rejected, or errored — is written to a payment audit log with the raw IPN payload, so a support ticket about "I paid but didn't get access" has a full trail to check rather than a guess.

## What We Learned

The instinct to reach for HMAC and \`crypto.timingSafeEqual\` is a reasonable one — it's the right tool for gateways that actually sign their payloads. But defensive webhook engineering isn't about applying the strongest-sounding cryptographic primitive available; it's about matching the guarantee you build to the guarantee the gateway actually offers. SSLCommerz offers a query-back validation API and a risk score, not a signature — and building around what's actually there turned out to need less custom cryptography, not more.`,
  },
  {
    slug: "building-manifest-v3-ai-chrome-extensions",
    title: "The Surprising Complexity of Injecting a UI into Someone Else's Web Page",
    excerpt:
      "Building a Chrome extension that injects a UI component into LinkedIn's feed seems simple. It isn't. Shadow DOM isolation, Manifest V3 service worker constraints, and host page style conflicts all need deliberate solutions.",
    coverImage: {
      url: "/blog/manifest-v3-ai-extensions.png",
      alt: "Building Manifest V3 AI Extensions Cover",
    },
    featured: false,
    publishedAt: new Date("2026-01-08T12:00:00.000Z"),
    content: `When we started building **Leadswave** — a LinkedIn brand assistant Chrome extension — the plan seemed straightforward. Detect LinkedIn post elements in the feed, attach a small AI companion button to each one, let users generate engagement responses without leaving the page. A week's work, maybe two.

Three weeks later we were still fighting style collisions, service worker lifecycle bugs, and a Manifest V3 API constraint we hadn't anticipated. This is what we learned.

## Why Injecting into a Third-Party Page Is Complicated

When your content script injects HTML into LinkedIn's document, you're working inside a page you don't control, with styles you didn't write, against a DOM structure that changes in LinkedIn's deployments without your knowledge.

The first version of Leadswave simply appended a styled div to each post element and mounted a React component inside it. It worked locally. On the actual LinkedIn feed, our Tailwind utility classes either had no effect (because LinkedIn's CSS specificity was higher) or caused unintended effects in LinkedIn's own components (because our styles bled into their DOM nodes).

The fix is Shadow DOM. Every modern browser supports the ability to attach a shadow root to a host element, creating an isolated DOM subtree that is completely separate from the main document's style cascade.

\`\`\`typescript
function mountAssistantWidget(hostElement: HTMLElement): HTMLElement {
  const container = document.createElement("div");
  container.id = "lw-assistant-root";

  // Attach a shadow root — this creates the style isolation boundary
  const shadow = container.attachShadow({ mode: "open" });

  // Our styles live inside the shadow — they can't bleed out,
  // and LinkedIn's styles can't bleed in
  const styleSheet = document.createElement("link");
  styleSheet.rel = "stylesheet";
  styleSheet.href = chrome.runtime.getURL("content/styles.css");
  shadow.appendChild(styleSheet);

  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  hostElement.appendChild(container);
  return mountPoint;
}
\`\`\`

## Manifest V3 Service Workers: Assume Nothing Persists

Manifest V2 allowed persistent background pages — JavaScript modules that stayed alive indefinitely and could hold state in memory. Manifest V3 replaced this with service workers. Service workers can be terminated by the browser at any point when they appear idle.

This is easy to forget when developing locally, because Chrome is less aggressive about terminating service workers during active development. In production, with a real user who opens LinkedIn once, reads through their feed over 20 minutes, and then triggers the assistant widget — the service worker has almost certainly been terminated in the interim.

\`\`\`typescript
// Don't rely on module-level variables for persistent state
// This will be undefined after the service worker restarts:
// let cachedApiKey: string | null = null; // BAD

// Instead, always read from storage:
async function getApiKey(): Promise<string | null> {
  const result = await chrome.storage.local.get(["apiKey"]);
  return result.apiKey ?? null;
}

async function saveUserSettings(settings: UserSettings): Promise<void> {
  await chrome.storage.local.set({ userSettings: settings });
}
\`\`\`

For the assistant response generation — which requires sending post context to an API and streaming back a response — the content script makes the API call directly rather than routing through the service worker. This avoids the service worker lifecycle problem entirely for latency-sensitive operations.

## Extracting Clean Context from LinkedIn's DOM

The AI generation requires understanding the content of the LinkedIn post the user is looking at. Passing raw innerHTML is wasteful and noisy — LinkedIn embeds tracking attributes, SVG icon paths, interaction counters, and other noise that consumes tokens without contributing to useful context.

\`\`\`typescript
function extractPostContext(postElement: HTMLElement): PostContext {
  const authorElement = postElement.querySelector(
    ".update-components-actor__name"
  );
  const author = authorElement?.textContent?.trim() ?? "Unknown";

  const bodyElement = postElement.querySelector(
    ".update-components-text"
  );

  const bodyText = extractTextNodes(bodyElement)
    .filter(text => text.trim().length > 0)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return { author, bodyText, extractedAt: Date.now() };
}

function extractTextNodes(el: Element | null): string[] {
  if (!el) return [];
  const texts: string[] = [];

  el.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      texts.push(node.textContent ?? "");
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      texts.push(...extractTextNodes(node as Element));
    }
  });

  return texts;
}
\`\`\`

The extracted context is typically 200 to 400 tokens — clean, structured, and representative of what the post actually says. This keeps API costs predictable and response generation fast.

## The LinkedIn DOM Changes Problem

There's no way to make a content script robustly stable against DOM changes in a host page you don't control. LinkedIn deploys frontend changes regularly, and CSS class names can shift.

We partially mitigate this with attribute-based selectors where possible — data-* attributes tend to be more stable than utility class names — and by maintaining a small compatibility shim that detects structural changes and reports them. When the extension breaks on a LinkedIn update, we want to know within hours, not days.

The real answer is humility: DOM scraping is inherently fragile, and the architecture needs to be designed with that fragility in mind rather than pretending it won't happen.`,
  },
  {
    slug: "offline-first-pwa-emergency-volunteer-networks",
    title: "Building Software for Places Where the Internet Doesn't Work",
    excerpt:
      "Badhan's blood donor platform for Amar Ekushey Hall needed to work in hospital basements, rural clinics, and emergency wards with no connectivity. Offline-first isn't a feature — it's an architecture decision made early.",
    coverImage: {
      url: "/blog/offline-first-pwa-networks.png",
      alt: "Offline-First PWA Architecture Cover",
    },
    featured: false,
    publishedAt: new Date("2026-01-02T09:30:00.000Z"),
    content: `Blood donor matching is time-sensitive in a way most software problems aren't. When a patient needs a specific blood type during a critical procedure, the medical team is working with a narrow window. The volunteer coordinator needs to identify available donors, contact them, and arrange a donation quickly.

**Badhan** is the blood donation organization of the Amar Ekushey Hall unit at the University of Dhaka, operating a volunteer donor network for the Dhaka Medical College Hospital. The donor management platform needed to be fast, usable by volunteers with varying technical experience, and — critically — functional in hospital environments where network connectivity is unreliable.

Anyone who has been inside a large hospital building knows the problem: thick concrete walls, basement floors, and dense building infrastructure create mobile dead zones. A web application that requires network connectivity to display a list of blood donors is simply not useful in these environments.

## Offline-First vs. Offline-Capable

There's an important distinction between applications that are offline-capable and applications that are offline-first.

An offline-capable application handles the absence of network connectivity gracefully — it shows a cached version of content it previously loaded, or displays a "you're offline" message without crashing. This is the baseline minimum.

An offline-first application treats local storage as the primary data source. All reads come from local storage first. Network requests are used to synchronize local data with the server, not to serve the request. The application is fully functional without a network connection, not just tolerable.

For Badhan's use case, offline-capable was insufficient. If a volunteer could only search the donor directory online, the application would fail exactly when it was needed most.

## The Data Synchronization Architecture

All donor records, blood group data, and volunteer contact information are stored in the browser's IndexedDB. When the application loads with a network connection, it syncs any changes from the server to local IndexedDB. When the volunteer searches for donors, the query runs against local IndexedDB with zero network involvement.

\`\`\`typescript
interface LocalDonorRecord {
  id: string;
  name: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  contactNumber: string;
  lastDonationDate: Date | null;
  isEligible: boolean;   // pre-computed flag
  hallName: string;
  roomNumber: string;
  lastSyncedAt: Date;
}

async function syncDonorRecords(): Promise<void> {
  const lastSync = await getLastSyncTimestamp();
  
  const updates = await fetch(\`/api/donors?updatedSince=\${lastSync.toISOString()}\`)
    .then(r => r.json());

  const db = await openLocalDB();
  const tx = db.transaction("donors", "readwrite");

  for (const donor of updates) {
    const isEligible = donor.lastDonationDate
      ? daysSince(donor.lastDonationDate) >= 90
      : true;

    await tx.store.put({ ...donor, isEligible, lastSyncedAt: new Date() });
  }

  await tx.done;
  await setLastSyncTimestamp(new Date());
}
\`\`\`

We pre-compute the isEligible boolean flag on dataset sync. Blood donation guidelines require a minimum 90-day gap between donations. Pre-computing it means the calculation happens once at sync time, not on every search query, enabling instant filtering in the critical search flow.

## Service Worker Caching Strategy

Workbox handles the service worker layer, managing pre-caching for static assets and runtime caching strategies for API responses.

\`\`\`javascript
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/donors"),
  new NetworkFirst({
    cacheName: "donor-api-cache",
    networkTimeoutSeconds: 4,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);
\`\`\`

The NetworkFirst strategy with a 4-second timeout means: try the network first. If the network responds within 4 seconds, use that response and update the cache. If not, serve the cached response. This gives volunteers fresh data when the network is marginal but usable, and cached data when it's completely unavailable.

## The Offline-First Side Effect: Speed

The most practical aspect of the offline-first approach turned out to be speed rather than connectivity. IndexedDB queries for blood group filtering across hundreds of records return in under 10 milliseconds consistently. This is faster than any network request and faster than most server-side database queries when you account for round-trip time.

The offline-first architecture that we built for connectivity resilience also produced a noticeably snappier search experience under normal conditions.

That's usually how it works: designing for the hard constraint improves performance under the easy conditions too.`,
  },
  {
    slug: "scaling-competitive-programming-lms-architectures",
    title: "Streaks Without Race Conditions: What Actually Runs Behind Codervai CP",
    excerpt:
      "The 'cohort pacing' story behind Codervai CP's module unlocking was cleaner than what's actually in production — a simple admin-publish flow. Here's what's real: the publish flow, the atomic streak upsert that survives a midnight submission storm, and why we didn't build a custom video pipeline.",
    coverImage: {
      url: "/blog/competitive-programming-lms.png",
      alt: "Scaling Algorithmic Training Systems Cover",
    },
    featured: false,
    publishedAt: new Date("2025-12-24T14:10:00.000Z"),
    content: `Competitive programming requires building a specific kind of knowledge: algorithms and data structures that compose with each other. You can't understand dynamic programming without first being solid on recursion. You can't reason about graph traversal without understanding how to implement a queue. The dependency tree is real, and the order in which concepts are introduced matters.

**Codervai CP** is a structured competitive programming learning platform. Separately, its daily-streak mechanic has to survive a predictable concurrency problem: a burst of submissions near midnight, all racing to protect a streak before the day resets.

## Publishing, Not Pacing

The original plan for content release was a cohort calendar — module 1 from day 0, module 2 from day 7, and so on, mirroring how a university course paces itself. That's not what's actually running. The real mechanism is simpler: an instructor flips a chapter's \`is_live\` flag from the admin CMS, and every enrolled student is notified the moment it happens.

That ended up being the better call, not a fallback. A publish button doesn't have timezone edge cases, doesn't need a scheduler that has to stay correct forever, and gives instructors a real escape hatch — a chapter that isn't ready yet just doesn't get published, instead of unlocking on schedule whether it's ready or not.

## The Streak Concurrency Problem

Daily streaks are one of the most effective engagement mechanics in learning platforms. At Codervai CP, streaks are awarded for solving at least one problem per day. A student who maintains a 30-day streak has real motivation to protect it.

The concurrency issue is predictable: a significant fraction of streak activity happens near midnight, as students rush to maintain their streak before the day resets. This creates a burst of simultaneous database writes, and the naive implementation of streak tracking breaks under concurrent load.

Consider the naive approach:

\`\`\`typescript
// BROKEN: race condition when two submissions arrive simultaneously
async function updateStreak(userId: string): Promise<void> {
  const { rows } = await pool.query(
    'SELECT * FROM "UserStreak" WHERE "userId" = $1',
    [userId]
  );
  const streak = rows[0];
  const today = new Date().toDateString();

  if (streak && new Date(streak.lastActiveDate).toDateString() === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasActiveYesterday =
    streak && new Date(streak.lastActiveDate).toDateString() === yesterday.toDateString();

  const newStreak = wasActiveYesterday ? streak.currentStreak + 1 : 1;
  await pool.query(
    \`INSERT INTO "UserStreak" ("userId", "currentStreak", "lastActiveDate")
     VALUES ($1, $2, NOW())
     ON CONFLICT ("userId") DO UPDATE SET "currentStreak" = $2, "lastActiveDate" = NOW()\`,
    [userId, newStreak]
  );
}
\`\`\`

If two problem submissions from the same user arrive within milliseconds of each other, both queries execute the SELECT before either has written. Both see the streak as needing an update. Both write. The streak increments by 2 instead of 1.

The actual fix is an atomic upsert at the database level, in one parameterized query, with no application-code read-then-write step at all:

\`\`\`typescript
async function recordActivityAndUpdateStreak(userId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  await pool.query(
    \`INSERT INTO "UserStreak" ("userId", "lastActiveDate", "currentStreak", "updatedAt")
     VALUES ($1, $2::date, 1, NOW())
     ON CONFLICT ("userId") DO UPDATE SET
       "currentStreak" = CASE
         WHEN "UserStreak"."lastActiveDate" = ($2::date - INTERVAL '1 day')
           THEN "UserStreak"."currentStreak" + 1
         WHEN "UserStreak"."lastActiveDate" = $2::date
           THEN "UserStreak"."currentStreak"
         ELSE 1
       END,
       "lastActiveDate" = $2::date,
       "updatedAt" = NOW()
     WHERE "UserStreak"."lastActiveDate" < $2::date OR "UserStreak"."userId" IS NULL\`,
    [userId, today]
  );
}
\`\`\`

The entire logic — check yesterday, check today, compute new streak — is a single atomic database operation, guarded by the trailing WHERE clause: it doubles as same-day idempotency (a second submission the same day is a no-op, not a second increment) and as anti-backdating (a write can't apply against a date older than what's already stored). No application code reads a value and then writes a derived value. Concurrent calls for the same user serialize at the database lock level without corrupting the streak count.

## Video: Buy, Don't Build

Editorial code walkthroughs on a competitive programming platform have a specific quality challenge: the content is code on a dark background, and standard video compression optimized for natural scenes tends to blur the fine syntax details that make code legible.

The instinct is to reach for a custom encoding profile — tuned quantization, reduced temporal compression, all the FFmpeg knobs. We didn't build that. Walkthroughs are delivered through BunnyCDN Stream, which handles HLS segmentation and adaptive bitrate on its own, or a plain YouTube embed where that's simpler. Legible video-of-code at reasonable cost is a solved problem one layer up the stack; building a custom transcoding pipeline would have meant maintaining infrastructure that mostly re-implements what a CDN already does well, for a marginal quality gain that never got prioritized against actual product work.

## What Held Up, What Didn't

The streak upsert design held up exactly as built — it's still the atomic, single-round-trip operation described above, running unmodified under real midnight traffic. The "cohort pacing" idea didn't survive contact with actual instructors using the platform; a manual publish flow turned out to be both simpler to build and easier for content creators to reason about than a scheduler would have been.`,
  },
  {
    slug: "high-speed-edge-verification-institutional-credentials",
    title: "How We Made Academic Certificates Verifiable Without a Blockchain (or HMAC)",
    excerpt:
      "CPRBD at the University of Dhaka needed employers and embassies to verify that a professional certificate was real. The actual solution was less exotic than the platform's own docs once claimed: a structured certificate ID, a plain database lookup, and rate limiting.",
    coverImage: {
      url: "/blog/cryptographic-credential-verification.png",
      alt: "Cryptographic Credential Verification Cover",
    },
    featured: false,
    publishedAt: new Date("2025-12-18T10:00:00.000Z"),
    content: `When the **Center for Policy Research on Business and Development (CPRBD)** at the University of Dhaka approached us about their institutional web portal, certificate verification stood out immediately. CPRBD runs executive education cohorts for mid-career government officials and business professionals, who receive physical certificates used as credentials for government postings and senior roles — and nothing on the physical certificate had ever been independently verifiable.

## Why a Structured ID Beats a Cryptographic Scheme

Every certificate gets an ID of the form \`CPRBD-2025-EXEC-B1-001\` — year, program code, batch code, and a per-batch serial minted atomically when a certificate is issued. That ID is what's printed on the certificate and encoded in its QR code.

Verification is a direct database lookup: given the ID, look up the enrollment record and return whether it exists and is still valid (not archived, not un-issued). No cryptographic signature, no HMAC, no blockchain. The reason this is enough: CPRBD controls both the issuing authority and the verification endpoint. The trust anchor is CPRBD's own server, not a distributed ledger or a shared secret — an attacker can't mint a valid-looking ID because the serials are sequential and tied to real enrollment rows, not derived from a formula they could reverse-engineer.

What *does* protect the endpoint is more mundane than cryptography: it's rate-limited to 20 requests per minute per IP, and responses are explicitly marked \`no-store\` so nothing caches a stale "valid" or "not found" result.

## Payment-Gated, Not Module-Gated (Yet)

Certificates are only issued in bulk to students whose tuition is marked complete — the endpoint filters candidates down to \`paymentStatus === "complete"\` before minting anything, and reports back how many were skipped as unpaid. Course-module completion is tracked and shown to admins as a reference count, but it isn't currently enforced before issuance — that's a gap in the platform we're aware of, not a feature we're claiming.

## Tuition That Matches How Executive Programs Actually Get Paid

Executive cohorts don't pay tuition in one lump sum. The platform tracks payments as a sequence of installments against SSLCommerz, each with its own status — pending, complete, failed, refunded — and computes the remaining balance as batch fee minus the sum of completed installments. A student's material access and certificate eligibility both key off that same installment ledger, so there's one source of truth for "has this person paid," not a synced copy of it.

## Materials Are Private Because They're Never Public

The same "one ledger, two gates" idea shows up again in how class materials are shared. Uploaded files live in a \`data/\` directory outside \`public/\`, so there's no static URL Next.js could accidentally serve — the only path to a file's bytes is an authenticated download route. That route re-runs the same check used for material access generally: enrolled, application approved, at least one completed installment. No signed URLs, no expiring tokens — just "don't put it somewhere the framework will serve for free, and check on every request instead."

Each program can also extend its application form with its own questions — beyond the fixed profile fields (contact details, qualifications, nationality, and so on) every applicant fills in once, a program admin can add a text question, a file upload, a date picker, whatever that specific cohort's intake needs — without a code change or a deploy.

## A CMS Built for People Who Don't Want to Touch Code

The less visible, more used part of the platform: CPRBD staff maintain their own program pages. Each program's public page is assembled from nine section types — hero, a "why this program" block, stats, testimonials, FAQ, a course outline pulled live from the actual module list, and a few others — that staff can reorder, toggle on or off, and edit inline. Updating a program's pricing blurb or adding a new FAQ entry used to mean a code change; now it's a form.

The same philosophy extends to communication and content: coordinators post batch-scoped announcements that automatically email every enrolled student in that cohort, and a separate news/media module lets CPRBD publish institutional press posts independent of both the CMS and the academic research repository — which itself replaced a static list of published papers buried in a Word document on the university website with structured, searchable entries and attached PDFs.

## What We Learned

The interesting engineering here wasn't cryptographic — it was matching the platform's guarantees to what actually needed guaranteeing. A structured, sequential ID plus a rate-limited lookup is enough when you control the whole trust chain; reaching for HMAC or a blockchain would have added complexity without adding real security here. The harder, more valuable work was elsewhere: an installment ledger that's the single source of truth for two different gates (materials and certificates), and enough non-technical surface area — CMS, announcements, news — that CPRBD can run the platform day-to-day without opening a ticket.

None of that came from a tidy requirements document. The people who understood how CPRBD actually ran a cohort were busy university staff, available in short bursts, not for a single upfront discovery phase — so the real user stories got built the same way the platform's admin surfaces did: incrementally, from repeated short conversations rather than one clean spec.`,
  },
  {
    slug: "nextjs-16-turbopack-deep-dive",
    title: "What I Actually Had to Change When Moving to React Server Components",
    excerpt:
      "React Server Components aren't just a build optimization — they change how you think about where code runs and why. Here's what the migration looked like on a real project and where the component boundary decisions were non-obvious.",
    coverImage: {
      url: "/blog/nextjs-16-turbopack-deep-dive.png",
      alt: "Next.js 16 and Turbopack Deep Dive Cover",
    },
    featured: false,
    publishedAt: new Date("2025-12-10T15:30:00.000Z"),
    content: `When Next.js introduced the App Router with React Server Components, the mental model shift was more significant than the API change. The API changes are well-documented. The mental model shift is harder to articulate and easier to get wrong.

This is a practical account of what changed when building this portfolio site on Next.js 16 with Turbopack — which pages ended up as Server Components, which needed to be Client Components, and what the non-obvious boundary decisions looked like.

## The Instinctive Wrong Move

The instinct when you hit a component that seems "complex" is to add "use client" to the top of the file. This works — the component now runs in the browser like it always did — but it often carries a hidden cost.

When you mark a parent component as a Client Component, every component it imports transitively becomes part of the client bundle too. If you've put "use client" on a layout component that imports your navigation, your blog post renderer, and your analytics component, you've just made all of those things client-side JavaScript even if none of them need interactivity.

The correct question isn't "does this component need to be a Client Component?" It's "what is the smallest leaf component that actually needs to run in the browser?"

## The Actual Split on This Portfolio

Going through each section of the portfolio site with this question produced a clear pattern:

**Everything in the blog system stayed as a Server Component.** Blog posts fetch their content from PostgreSQL through Prisma. Markdown gets parsed and rendered. Cover images are served from the public directory. None of this involves user interaction. None of it changes based on client-side state. All of it is better handled on the server.

\`\`\`typescript
// This is a Server Component — no "use client"
// It runs at build time for static pages, at request time for dynamic ones

async function BlogPost({ slug }: { slug: string }) {
  const post = await db.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { coverImage: true },
  });

  if (!post) notFound();

  return (
    <article>
      <PostHeader post={post} />
      <MarkdownContent content={post.content} />
    </article>
  );
}
\`\`\`

**The navigation required a hybrid approach.** The navbar is mostly static HTML, but it needs to highlight the active route — which requires knowing the current pathname, a client-side concern. The solution is to keep the navbar structure as a Server Component and extract only the active-state logic into a small Client Component.

\`\`\`typescript
// nav-link.tsx — Client Component (needs usePathname)
"use client";

import { usePathname } from "next/navigation";

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <a href={href} className={isActive ? "text-emerald-400" : "text-slate-400"}>
      {children}
    </a>
  );
}
\`\`\`

**Forms are Client Components.** The contact form and the admin dashboard forms require useState, onChange handlers, and submission logic. These are genuinely client-side concerns. Making them Client Components is correct.

## Static Generation with Database Content

The blog posts and project pages are statically generated at build time. Next.js calls generateStaticParams to enumerate all the slugs, then pre-renders each page to static HTML.

\`\`\`typescript
export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });

  return posts.map(post => ({ slug: post.slug }));
}
\`\`\`

When a new blog post is published through the admin interface, it triggers a Vercel deployment. The new build runs generateStaticParams, discovers the new slug, generates its static HTML, and deploys. The post goes live without any runtime database queries for future visitors.

## One Actual Gotcha

There's a subtle issue with unstable_cache in Next.js when combined with static generation. The cache is keyed by the arguments you pass to it, but if you change the data in the database without triggering a new deployment, the cache will serve stale data indefinitely.

For content that changes through the admin interface, the admin routes that write to the database call revalidatePath or revalidateTag after each write, which purges the relevant cache entries. Without this, editing a blog post would update the database but leave the static HTML unchanged until the next deployment.

\`\`\`typescript
import { revalidatePath } from "next/cache";

async function updateBlogPost(id: string, data: PostUpdateData) {
  await db.post.update({ where: { id }, data });

  // Purge the static cache for this post's page
  revalidatePath(\`/blog/\${data.slug}\`);

  // Purge the blog index page too
  revalidatePath("/blog");
}
\`\`\`

This is the part that takes the most deliberate thought — not the Server/Client boundary, but the cache invalidation strategy. Get it right and content updates feel instant. Get it wrong and editors wonder why their changes aren't appearing.`,
  },
  {
    slug: "craft-of-high-velocity-software-delivery",
    title: "The Stack I Keep Coming Back To and Why I Stop Reconsidering It",
    excerpt:
      "Every few months a new framework or runtime promises to fix problems I don't have. Here's the case for PostgreSQL, TypeScript, and Next.js — and more importantly, the case for stopping the search.",
    coverImage: {
      url: "/blog/craft-high-velocity-software.png",
      alt: "The Craft of High-Velocity Software Delivery Cover",
    },
    featured: false,
    publishedAt: new Date("2025-12-01T11:00:00.000Z"),
    content: `There's a specific state of mind that a developer can get into where evaluating new tools feels productive. You read release notes, benchmark comparisons, and Twitter threads from early adopters. You build proof-of-concepts. You track GitHub stars and Hacker News reception. This can occupy a significant fraction of your available thinking time.

The output from this activity is rarely a better product. It's usually a well-informed decision to continue using what you were already using.

I've been building full-stack web applications across projects ranging from EdTech platforms to enterprise workforce dashboards to real-time telephony systems. I've done this primarily with PostgreSQL, TypeScript, and Next.js. I keep coming back to this combination — not because I haven't evaluated alternatives, but because I've evaluated enough alternatives to understand what I'd actually be trading.

## What "Boring Technology" Means in Practice

The phrase "boring technology" gets misread as a preference for old or unsophisticated tools. That's not the point. The point is familiarity depth.

When I encounter a bug in a Prisma query at 11pm during a client deployment, I know where to look. I understand how Prisma generates SQL, what its transaction semantics are, how connection pooling behaves under load. This knowledge was accumulated across dozens of projects and hours of debugging. When I encounter a problem with an ORM I've used for three weeks, my diagnostic path is much longer.

**PostgreSQL** covers an enormous surface area of what applications actually need. Full-text search, JSON document storage, relational joins, atomic transactions, row-level security, triggers, recursive CTEs. Every application I've built eventually needed something that Postgres had native support for.

For MathPro Academy, we use PostgreSQL for course data, enrollments, payments, and streak tracking. The streak tracking required a SQL UPSERT with CASE logic that would have been genuinely awkward to implement correctly in most NoSQL databases. PostgreSQL handled it cleanly with a single atomic statement.

**TypeScript** is a net-positive before you're familiar with it and an unmistakable productivity multiplier after you are. The upfront cost — writing types for your data structures, understanding generics, configuring the compiler — is real. The payoff — catching a null access error at compile time instead of at 3am in a production error log — is also real.

The strictness setting matters. Running TypeScript with strict: false gives you type annotations without most of the safety. strict: true is uncomfortable initially and significantly better in practice.

**Next.js** solves the API/frontend split that used to require running and coordinating two separate development servers. API routes live in the same codebase as UI components. Server-side rendering and static generation are first-class primitives rather than configurations. The App Router's Server Components model — when you understand it — eliminates entire categories of client-side data fetching patterns that were always the wrong abstraction anyway.

## The Real Velocity Driver: Short Feedback Loops

The biggest predictor of delivery speed on any project isn't the language or framework — it's the feedback loop length. How long does it take to go from writing code to knowing whether it works?

In a fast feedback environment:
- The development server reflects file changes in under 500ms.
- Type errors appear in the editor as you type, not on the next build.
- Database schema changes are applied with a single command.
- Deployment to staging takes under three minutes.

In a slow feedback environment:
- Build times over 30 seconds create cognitive context loss between iterations.
- Manual testing steps are required to verify basic functionality.
- Deployment pipelines take 15 minutes, so you batch changes instead of shipping incrementally.

The specific tools matter less than whether you've configured them to minimize feedback latency. Turbopack's fast HMR, TypeScript's language server integration with VS Code, Prisma's db push for rapid schema iteration during development — these are the practical affordances that compound into meaningful time savings across a project.

## Knowing What to Leave Out

The hardest and most valuable engineering skill is deciding not to build something.

Every feature you build is code that must be maintained, bugs that can occur, edge cases that must be handled, and cognitive load for future developers (often yourself). The features that get cut are free. The features that get built carry ongoing costs.

This applies to infrastructure choices too. Distributed message queues are powerful and complex. For a project where a single Postgres instance is adequate, the complexity of Redis and BullMQ is pure overhead. Microservices offer genuine benefits at scale. For a team of one to three developers building a product for a few hundred users, they introduce deployment complexity that serves no one.

The right time to add architectural complexity is when you have clear evidence that you need it. The evidence is usually a specific bottleneck, a specific scale requirement, or a specific capability gap — not a theoretical concern about future scale.

I've seen more projects slow down from premature architectural complexity than from inadequate infrastructure. A well-designed monolith on a managed Postgres database has shipped and maintained more valuable software than any number of elaborate distributed systems built for scale problems that never materialized.

The stack I keep coming back to isn't remarkable. It's just familiar, capable, and well-understood. That turns out to be enough.`,
  }
];
