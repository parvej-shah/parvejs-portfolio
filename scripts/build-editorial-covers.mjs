import fs from "fs";
import path from "path";
import sharp from "sharp";

const covers = [
  {
    filename: "voice-ai-sub-18s.png",
    category: "VOICE AI & WEBRTC",
    title: "Sub-1.8s Voice AI Pipelines",
    subtitle: "Real-Time Audio Streaming, VAD & LLM Turn-Taking",
    accent: "#00E676",
    codeSnippet: `// 20ms audio frame stream chunking
const vad = new NeuralVAD({
  frameSizeMs: 20,
  positiveThreshold: 0.65,
  silenceTimeoutMs: 320,
});
sipStream.on("audio", (chunk) => vad.process(chunk));`,
  },
  {
    filename: "multi-agent-state-machines.png",
    category: "DISTRIBUTED SYSTEMS",
    title: "Deterministic Multi-Agent State Machines",
    subtitle: "Why Open-Ended LLM Chains Fail in Production",
    accent: "#A855F7",
    codeSnippet: `// Typed deterministic state transition
export async function step(state: EditorialState) {
  const verified = await runCriticValidation(state.draft);
  if (!verified.ok) return { ...state, status: "REVISE" };
  return { ...state, status: "PUBLISHED" };
}`,
  },
  {
    filename: "precision-data-sft-rlhf.png",
    category: "AI WORKFORCE PLATFORMS",
    title: "Building LLM Workforce Platforms",
    subtitle: "Web Systems for Domain-Expert Data Management",
    accent: "#3B82F6",
    codeSnippet: `// Enterprise SSO and Skill Matrix Routing
const annotator = await prisma.user.findUnique({
  where: { email: session.user.email },
  include: { verifiedSkills: true },
});`,
  },
  {
    filename: "conversational-commerce-webhooks.png",
    category: "COMMERCE INFRASTRUCTURE",
    title: "Conversational Commerce at Scale",
    subtitle: "Resilient Multi-Channel Webhook Architecture",
    accent: "#10B981",
    codeSnippet: `// Idempotent webhook event ingestion
const hash = generateFingerprint(channel, senderId, msgId);
const isNew = await redis.set(hash, "1", "NX", "EX", 300);
if (!isNew) return res.status(200).send("DUPLICATE");`,
  },
  {
    filename: "katex-math-server-components.png",
    category: "FRONTEND & PERFORMANCE",
    title: "Rendering KaTeX at Scale",
    subtitle: "Zero CLS Math Pre-Compilation with Server Components",
    accent: "#F59E0B",
    codeSnippet: `// Server-side LaTeX compilation (0kB JS)
const html = katex.renderToString(equation, {
  displayMode: true,
  output: "htmlAndMathml",
});`,
  },
  {
    filename: "defensive-webhook-engineering.png",
    category: "FINTECH & SECURITY",
    title: "Defensive Webhook Engineering",
    subtitle: "Securing Payment Callbacks with Cryptographic Idempotency",
    accent: "#6366F1",
    codeSnippet: `// Timing-safe HMAC verification
const valid = crypto.timingSafeEqual(
  Buffer.from(signatureHeader, "utf-8"),
  Buffer.from(computedHash, "utf-8")
);`,
  },
  {
    filename: "manifest-v3-ai-extensions.png",
    category: "BROWSER EXTENSIONS",
    title: "Building Manifest V3 AI Extensions",
    subtitle: "Shadow DOM Isolation, Service Workers & Prompt Budgets",
    accent: "#EC4899",
    codeSnippet: `// Shadow DOM style isolation
const shadow = container.attachShadow({ mode: "open" });
shadow.appendChild(createScopedStyleSheet());
shadow.appendChild(assistantRoot);`,
  },
  {
    filename: "offline-first-pwa-networks.png",
    category: "OFFLINE PWA & RESILIENCE",
    title: "Offline-First PWA Architecture",
    subtitle: "Workbox, IndexedDB & Mission-Critical Volunteer Networks",
    accent: "#EF4444",
    codeSnippet: `// Stale-While-Revalidate with IndexedDB
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/donors"),
  new StaleWhileRevalidate({ cacheName: "donor-cache" })
);`,
  },
  {
    filename: "competitive-programming-lms.png",
    category: "EDTECH ARCHITECTURE",
    title: "Scaling Algorithmic Training Systems",
    subtitle: "Dynamic Release Queues, Streak Concurrency & Video Delivery",
    accent: "#06B6D4",
    codeSnippet: `// Atomic daily streak increment
await prisma.$executeRaw\`
  INSERT INTO "UserStreak" ("userId", "streak")
  VALUES (\${id}, 1) ON CONFLICT DO UPDATE ...\`;`,
  },
  {
    filename: "cryptographic-credential-verification.png",
    category: "INSTITUTIONAL WEB",
    title: "Cryptographic Credential Verification",
    subtitle: "Tamper-Proof Academic Certificates & Accessible Repositories",
    accent: "#14B8A6",
    codeSnippet: `// Certificate hash verification
const hash = crypto
  .createHmac("sha256", secret)
  .update(\`\${certNo}:\${name}:\${date}\`)
  .digest("hex").slice(0, 16);`,
  },
  {
    filename: "nextjs-16-turbopack-deep-dive.png",
    category: "MODERN NEXT.JS",
    title: "Next.js 16 & Turbopack Deep Dive",
    subtitle: "Server Components Boundaries & High-Fidelity Static Delivery",
    accent: "#00E676",
    codeSnippet: `// Static generation and edge caching
export const dynamic = "force-static";
export async function generateStaticParams() {
  return (await getPublishedPosts()).map(p => ({ slug: p.slug }));
}`,
  },
  {
    filename: "craft-high-velocity-software.png",
    category: "ENGINEERING CRAFT",
    title: "The Craft of High-Velocity Delivery",
    subtitle: "Boring Stacks, Tight Feedback Loops & Unshipped Simplicity",
    accent: "#E2E8F0",
    codeSnippet: `// Simplicity beats novelty
const stack = {
  db: "PostgreSQL",
  types: "TypeScript",
  ui: "Next.js + Tailwind",
}; // Zero 2 AM pages`,
  },
];

const outDir = path.resolve("./public/blog");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function xmlEscape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function buildEditorialCovers() {
  for (const item of covers) {
    const escapedCategory = xmlEscape(item.category);
    const escapedTitle = xmlEscape(item.title);
    const escapedSubtitle = xmlEscape(item.subtitle);

    const escapedSnippet = item.codeSnippet
      .split("\n")
      .map((line, idx) => {
        const safeLine = xmlEscape(line);
        const color = line.trim().startsWith("//") ? "#64748b" : "#cbd5e1";
        return `<tspan x="32" dy="${idx === 0 ? 0 : 28}" fill="${color}">${safeLine}</tspan>`;
      })
      .join("");

    const svg = `
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow-${item.filename}" cx="75%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${item.accent}" stop-opacity="0.16" />
      <stop offset="60%" stop-color="#0b1016" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#06090d" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="cardBg-${item.filename}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#11161f" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#080c10" stop-opacity="0.98" />
    </linearGradient>
    <linearGradient id="codeBg-${item.filename}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0c1218" />
      <stop offset="100%" stop-color="#06090d" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1600" height="900" fill="#06090d"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <circle cx="1150" cy="300" r="600" fill="url(#glow-${item.filename})"/>

  <rect x="70" y="70" width="1460" height="760" rx="28" fill="url(#cardBg-${item.filename})" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>

  <g transform="translate(130, 160)">
    <rect width="260" height="34" rx="17" fill="rgba(255, 255, 255, 0.03)" stroke="${item.accent}" stroke-opacity="0.4" stroke-width="1"/>
    <circle cx="18" cy="17" r="4" fill="${item.accent}"/>
    <text x="32" y="22" fill="${item.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">${escapedCategory}</text>

    <text x="0" y="110" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="800" letter-spacing="-1.5">
      ${escapedTitle}
    </text>

    <text x="0" y="165" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="400" letter-spacing="-0.2">
      ${escapedSubtitle}
    </text>
  </g>

  <g transform="translate(860, 200)">
    <rect width="580" height="360" rx="16" fill="url(#codeBg-${item.filename})" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
    
    <circle cx="28" cy="26" r="5" fill="#EF4444" fill-opacity="0.7"/>
    <circle cx="44" cy="26" r="5" fill="#F59E0B" fill-opacity="0.7"/>
    <circle cx="60" cy="26" r="5" fill="#10B981" fill-opacity="0.7"/>
    <text x="90" y="30" fill="#475569" font-family="ui-monospace, monospace" font-size="12" font-weight="500">production.ts</text>
    <line x1="0" y1="48" x2="580" y2="48" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>

    <text y="88" font-family="ui-monospace, monospace" font-size="14" font-weight="400" xml:space="preserve">
      ${escapedSnippet}
    </text>
  </g>

  <g transform="translate(130, 750)">
    <line x1="0" y1="-30" x2="1340" y2="-30" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>
    <text x="0" y="10" fill="#64748B" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" letter-spacing="0.5">
      PARVEJ SHAH &#x2022; SYSTEMS &amp; FULL-STACK ENGINEERING
    </text>
    <text x="1340" y="10" fill="#64748B" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" text-anchor="end">
      READING TIME: 4-6 MIN
    </text>
  </g>
</svg>
`;

    const dest = path.join(outDir, item.filename);
    await sharp(Buffer.from(svg)).png({ quality: 100 }).toFile(dest);
    console.log(`Generated editorial cover for ${item.filename}`);
  }
}

buildEditorialCovers();
