import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bot, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Portfolio from "@/components/Portfolio";
import Stats from "@/components/Stats";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import { getPublishedProjects } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "AI Automation & Voice Agents | Parvej Shah",
  description:
    "Automate repetitive front-office operations, phone intake, and back-office workflows with 24/7 production AI voice agents and deterministic n8n automation.",
};

export default async function AiAutomationLandingPage() {
  const projects = await getPublishedProjects();
  const automationProjects = projects.filter(
    (p) => p.slug === "minions-ai" || p.slug === "minions-content-engine" || p.featured
  );

  return (
    <main className="min-h-screen">
      {/* Targeted Hero */}
      <section className="relative overflow-hidden border-b border-line py-20 lg:py-28 brand-glow">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
          <span className="eyebrow mb-5 inline-flex items-center gap-2">
            <Bot className="size-4 text-brand" />
            AI Automation & Voice Pipeline Engineering
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.05]">
            Automate the Work Your Team <br className="hidden sm:block" />
            <span className="text-brand">Shouldn&apos;t Be Doing.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Deploy 24/7 AI voice receptionists, deterministic workflow pipelines, and automated CRM sync
            built around the way your business actually operates. Zero added headcount, zero hallucinations.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)]"
            >
              Get Free Automation Assessment
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href="#proof"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-line bg-ink-2 px-6 text-sm font-semibold text-white transition-colors hover:border-brand/40"
            >
              See Real Live Case Studies
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-white/90">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-brand" /> Sub-50ms Cache Lookups
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-brand" /> 24/7 Lead Capture
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-brand" /> Deterministic Guardrails
            </span>
          </div>
        </div>
      </section>

      {/* Case Study Proof */}
      <div id="proof">
        <Portfolio projects={automationProjects} />
      </div>

      {/* Impact Benchmark Numbers */}
      <Stats />

      {/* Why Us - Production vs Demos */}
      <WhyUs />

      {/* How It Works with Deliverables */}
      <Process />

      {/* FAQ */}
      <Faq />

      {/* Low-Friction Assessment Form */}
      <Contact />
    </main>
  );
}
