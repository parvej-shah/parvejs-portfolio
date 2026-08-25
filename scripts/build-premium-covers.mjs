import fs from "fs";
import path from "path";
import sharp from "sharp";

const covers = [
  {
    filename: "voice-ai-sub-18s.png",
    kicker: "SYSTEMS ARCHITECTURE",
    title: "Sub-1.8s Voice AI Pipelines",
    subtitle: "Real-Time Audio Streaming, VAD & Overlapping Turn-Taking",
    accent: "#10B981",
    metric: "< 1.8s",
    metricLabel: "Round-trip telephony latency",
  },
  {
    filename: "multi-agent-state-machines.png",
    kicker: "DISTRIBUTED WORKFLOWS",
    title: "Deterministic Multi-Agent State Machines",
    subtitle: "Why Open-Ended Prompt Loops Collapse in Production",
    accent: "#8B5CF6",
    metric: "0% Loops",
    metricLabel: "Strict finite state transitions",
  },
  {
    filename: "precision-data-sft-rlhf.png",
    kicker: "ENTERPRISE PLATFORMS",
    title: "Building LLM Workforce Platforms",
    subtitle: "Architecting Web Dashboards for Domain-Expert Data Operations",
    accent: "#3B82F6",
    metric: "RBAC + SSO",
    metricLabel: "Granular skill matrix routing",
  },
  {
    filename: "conversational-commerce-webhooks.png",
    kicker: "HIGH-THROUGHPUT INFRASTRUCTURE",
    title: "Conversational Commerce at Scale",
    subtitle: "Handling Multi-Channel Webhooks with Zero Message Drops",
    accent: "#06B6D4",
    metric: "100% Delivery",
    metricLabel: "Redis deduplication & BullMQ",
  },
  {
    filename: "katex-math-server-components.png",
    kicker: "PERFORMANCE & EDTECH",
    title: "Rendering KaTeX at Scale",
    subtitle: "Zero CLS Math Pre-Compilation with React Server Components",
    accent: "#F59E0B",
    metric: "0.00 CLS",
    metricLabel: "0kB client runtime math bundle",
  },
  {
    filename: "defensive-webhook-engineering.png",
    kicker: "PAYMENTS & SECURITY",
    title: "Defensive Webhook Engineering",
    subtitle: "Securing MFS & Card Callbacks with Idempotency Locks",
    accent: "#6366F1",
    metric: "Idempotent",
    metricLabel: "HMAC timing-safe verification",
  },
  {
    filename: "manifest-v3-ai-extensions.png",
    kicker: "BROWSER EXTENSIONS",
    title: "Building Manifest V3 AI Extensions",
    subtitle: "Shadow DOM Isolation, Ephemeral Workers & Token Economics",
    accent: "#EC4899",
    metric: "Isolated",
    metricLabel: "Zero host DOM style bleed",
  },
  {
    filename: "offline-first-pwa-networks.png",
    kicker: "PWA & EMERGENCY HEALTHCARE",
    title: "Offline-First PWA Architecture",
    subtitle: "Workbox, IndexedDB & Low-Connectivity Donor Directories",
    accent: "#EF4444",
    metric: "< 10ms",
    metricLabel: "Local IndexedDB query speed",
  },
  {
    filename: "competitive-programming-lms.png",
    kicker: "EDTECH ARCHITECTURE",
    title: "Scaling Algorithmic Training Systems",
    subtitle: "Dynamic Module Queues, Streak Concurrency & Video Delivery",
    accent: "#14B8A6",
    metric: "Atomic",
    metricLabel: "PostgreSQL streak transactions",
  },
  {
    filename: "cryptographic-credential-verification.png",
    kicker: "INSTITUTIONAL WEB",
    title: "Cryptographic Credential Verification",
    subtitle: "Tamper-Proof Diplomas & Accessible Academic Registries",
    accent: "#38BDF8",
    metric: "Sub-100ms",
    metricLabel: "Public HMAC checksum validation",
  },
  {
    filename: "nextjs-16-turbopack-deep-dive.png",
    kicker: "MODERN WEB ARCHITECTURE",
    title: "Next.js 16 & Turbopack Deep Dive",
    subtitle: "Server Components Boundaries & High-Fidelity Static Generation",
    accent: "#10B981",
    metric: "100/100",
    metricLabel: "Core Web Vitals compliance",
  },
  {
    filename: "craft-high-velocity-software.png",
    kicker: "ENGINEERING PHILOSOPHY",
    title: "The Craft of High-Velocity Delivery",
    subtitle: "Boring Technology Stacks, Tight Loops & Unshipped Simplicity",
    accent: "#E2E8F0",
    metric: "Pragmatic",
    metricLabel: "Postgres + TypeScript + Next.js",
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

async function buildPremiumCovers() {
  for (const item of covers) {
    const kicker = xmlEscape(item.kicker);
    const title = xmlEscape(item.title);
    const subtitle = xmlEscape(item.subtitle);
    const metric = xmlEscape(item.metric);
    const metricLabel = xmlEscape(item.metricLabel);

    const svg = `
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="meshGrad-${item.filename}" cx="85%" cy="20%" r="70%">
      <stop offset="0%" stop-color="${item.accent}" stop-opacity="0.22" />
      <stop offset="50%" stop-color="#0f172a" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#05070a" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="cardSurface-${item.filename}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#05070a" stop-opacity="0.95" />
    </linearGradient>
    <pattern id="dotPattern" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.05)" />
    </pattern>
  </defs>

  <!-- Deep Obsidian Slate Background -->
  <rect width="1600" height="900" fill="#040608"/>
  <rect width="1600" height="900" fill="url(#dotPattern)"/>
  <circle cx="1200" cy="200" r="650" fill="url(#meshGrad-${item.filename})"/>

  <!-- Outer Glass Frame (Linear / Apple style) -->
  <rect x="60" y="60" width="1480" height="780" rx="24" fill="url(#cardSurface-${item.filename})" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>

  <!-- Subtle Top Ambient Hairline -->
  <line x1="120" y1="60" x2="600" y2="60" stroke="${item.accent}" stroke-width="2" stroke-opacity="0.6"/>

  <!-- Left: Typographic Editorial Layout -->
  <g transform="translate(140, 160)">
    <!-- Minimal Monogram & Kicker -->
    <g>
      <text x="0" y="24" fill="${item.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="2.5">${kicker}</text>
    </g>

    <!-- Main Title (Apple / Stripe Display Type) -->
    <g transform="translate(0, 110)">
      <text x="0" y="0" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.8">
        ${title}
      </text>
      <text x="0" y="64" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="400" letter-spacing="-0.3">
        ${subtitle}
      </text>
    </g>
  </g>

  <!-- Right: Minimalist Precision Architecture Card -->
  <g transform="translate(1000, 260)">
    <rect width="440" height="260" rx="18" fill="#090d14" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1"/>
    
    <g transform="translate(44, 75)">
      <text x="0" y="0" fill="${item.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" letter-spacing="-1">
        ${metric}
      </text>
      <text x="0" y="42" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500">
        ${metricLabel}
      </text>
      <line x1="0" y1="75" x2="352" y2="75" stroke="rgba(255, 255, 255, 0.06)" stroke-width="1"/>
      <text x="0" y="105" fill="#475569" font-family="ui-monospace, monospace" font-size="12" font-weight="600" letter-spacing="1">
        VERIFIED ENGINEERING BENCHMARK
      </text>
    </g>
  </g>

  <!-- Bottom Metadata Row -->
  <g transform="translate(140, 750)">
    <line x1="0" y1="-30" x2="1320" y2="-30" stroke="rgba(255, 255, 255, 0.06)" stroke-width="1"/>
    <text x="0" y="10" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" letter-spacing="1">
      PARVEJ SHAH &#x2022; SYSTEMS &amp; FULL-STACK RETROSPECTIVE
    </text>
    <text x="1320" y="10" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" text-anchor="end">
      READ ARTICLE
    </text>
  </g>
</svg>
`;

    const dest = path.join(outDir, item.filename);
    await sharp(Buffer.from(svg)).png({ quality: 100 }).toFile(dest);
    console.log(`Rendered premium cover for ${item.filename}`);
  }
}

buildPremiumCovers();
