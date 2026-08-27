import { getPublishedProjects, getPublishedPosts, getSection } from "@/lib/data/public";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const [seoSection, projects, posts] = await Promise.all([
    getSection("seo"),
    getPublishedProjects(),
    getPublishedPosts(),
  ]);

  const siteUrl = seoSection?.siteUrl || "https://parvejshah.com";

  let content = `# Parvej Shah — Software Engineer & AI Systems Developer

> Parvej Shah is a software engineer and AI systems developer based in Dhaka, Bangladesh (University of Dhaka · CoderVai). He builds production AI voice pipelines, high-concurrency webhook infrastructure, local-first web applications, and full-stack systems with Next.js, TypeScript, PostgreSQL, and Redis.

## Professional Summary
- **Name**: Parvej Shah (Parvej Shah Labib)
- **Title**: Software Engineer & AI Systems Developer
- **Organization / Affiliation**: CoderVai · University of Dhaka (DU)
- **Location**: Dhaka, Bangladesh
- **Email**: parvejshahlabib007@gmail.com
- **Website**: ${siteUrl}
- **Core Stack**: Next.js (App Router, RSC, Turbopack), React 19, TypeScript, Node.js, Python, PostgreSQL, Prisma ORM, PGVector, Supabase RLS, Redis, BullMQ, Retell AI, n8n, Cloudflare R2, WebRTC/SIP.

## Notable Real-World Projects & Engineering Achievements
${projects
  .map(
    (p) => `### [${p.title}](${siteUrl}/projects/${p.slug})
- **Client/Affiliation**: ${p.client || "Independent Product"}
- **Role**: ${p.role || "Lead Full-Stack Developer"}
- **Tech Stack**: ${p.techStack.join(", ")}
- **Overview**: ${p.summary}
- **Key Metrics & Outcomes**: ${p.results || "Production-grade deployment"}`
  )
  .join("\n\n")}

## In-Depth Technical Articles & Publications
${posts
  .map(
    (p) => `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.excerpt}`
  )
  .join("\n")}

## Official Developer Profiles & Entity References
- **Portfolio Website**: ${siteUrl}
- **GitHub**: https://github.com/parvej-shah
- **LinkedIn**: https://www.linkedin.com/in/parvej-shah
- **DEV Community**: https://dev.to/parvejshah
- **Hashnode**: https://parvejshah.hashnode.dev
- **Medium**: https://medium.com/@parvejshah
- **Peerlist**: https://peerlist.io/parvejshah
- **Product Hunt**: https://www.producthunt.com/@parvejshah

## Engineering Specializations
1. **High-Throughput Web Applications**: Next.js App Router, React Server Components (RSC), SSR with sub-50ms TTFB.
2. **AI & Voice Engineering**: Sub-1.8s voice round-trip pipelines with WebRTC, SIP, Neural VAD, and deterministic multi-agent state machines.
3. **EdTech & Mathematical Rendering**: Zero-CLS KaTeX server-side rendering and high-concurrency learning platforms.
4. **FinTech & E-Commerce Webhooks**: Idempotent payment processing (bKash, Nagad), Redis deduplication, and BullMQ queue architectures.
5. **Offline-First Architectures**: IndexedDB and Service Worker caching for critical volunteer and emergency applications.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

