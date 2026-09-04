import { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Code2, Clock } from "lucide-react";
import Portfolio from "@/components/Portfolio";
import Stats from "@/components/Stats";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import { getPublishedProjects } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Full-Stack & AI Systems Architect | Upwork Proposal Partner",
  description:
    "Direct engineering partner for ambitious founders and agencies. Production AI voice pipelines, high-concurrency backends, and full-stack web platforms shipped without agency bloat.",
};

export default async function UpworkLandingPage() {
  const projects = await getPublishedProjects();

  return (
    <main className="min-h-screen">
      {/* Upwork Direct Intent Hero */}
      <section className="relative overflow-hidden border-b border-line py-20 lg:py-28 brand-glow">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
          <span className="eyebrow mb-5 inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            Direct Senior Engineering Partner
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
            You Need an Engineer Who Can <br className="hidden sm:block" />
            <span className="text-brand">Actually Ship the System.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Stop losing weeks to junior freelancers and inflated agency quotes. From production AI voice agents
            to high-concurrency SaaS applications, I engineer systems designed to survive real user traffic and scale.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)]"
            >
              Get Free Technical Architecture Review
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-line bg-ink-2 px-6 text-sm font-semibold text-white transition-colors hover:border-brand/40"
            >
              View Production Work & Metrics
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-white/90">
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-brand" /> Daily Async Updates & Loom Demos
            </span>
            <span className="flex items-center gap-2">
              <Code2 className="size-4 text-brand" /> 100% IP & Code Ownership
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand" /> 30-Day Post-Launch Warranty
            </span>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <Portfolio projects={projects} />

      {/* Impact Numbers */}
      <Stats />

      {/* Why Senior Partner */}
      <WhyUs />

      {/* Process */}
      <Process />

      {/* FAQ */}
      <Faq />

      {/* Contact */}
      <Contact />
    </main>
  );
}
