"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Reveal from "./Reveal";

const faqs = [
  {
    question: "How do you charge for projects? (Fixed price vs. Retainer)",
    answer:
      "For defined projects like an MVP launch or an AI voice agent deployment, we work on transparent, fixed-price milestones — you know the exact cost and scope before we write a line of code. For ongoing platform development or system scaling, we offer dedicated weekly sprint retainers with zero long-term lock-in.",
  },
  {
    question: "How fast can we launch an MVP or AI Voice Agent?",
    answer:
      "Most AI voice agents and production MVPs launch in 2 to 4 weeks. You will receive a working staging environment preview within the first 7 business days, so you can test real progress and provide feedback well before public launch.",
  },
  {
    question: "How do we communicate and handle timezone overlap?",
    answer:
      "We operate with daily overlap across US, European, and Asian working hours (GMT+6 base). We use private Slack or WhatsApp channels for real-time messaging, Loom videos for asynchronous feature walkthroughs, and guarantee a sub-24-hour response to every inquiry.",
  },
  {
    question: "What stops the AI from hallucinating or making mistakes?",
    answer:
      "We do not rely on naive, open-ended prompt templates. We engineer deterministic finite state machines, multi-slot entity extraction, and automated claims-validation gates that hard-block unsourced statements or invalid calendar bookings before they ever reach a user.",
  },
  {
    question: "Do I own 100% of the code and intellectual property?",
    answer:
      "Yes, completely. All source code, database architectures, API integrations, and AI workflow blueprints belong 100% to you. We set up everything in your own GitHub, AWS/Cloudflare, and Supabase/Neon accounts with zero proprietary lock-in.",
  },
  {
    question: "What happens after launch? Do you offer post-launch support?",
    answer:
      "Every project includes a 30-day post-launch warranty covering bug fixes, edge-case tuning, and error telemetry monitoring. Afterward, we offer flexible monthly maintenance retainers to support new feature rollouts and infrastructure scaling.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <section id="faq" className="border-b border-line py-20 lg:py-28 relative">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow mb-4">Frequently Asked Questions</span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
            Common questions, answered transparently.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Everything you need to know about working together, intellectual property, communication cadence, and production guarantees.
          </p>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal
                key={faq.question}
                delay={i * 60}
                className="card-surface overflow-hidden rounded-2xl border border-line transition-all duration-300 hover:border-brand/30"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3 text-base sm:text-lg font-semibold text-white">
                    <HelpCircle className="size-5 shrink-0 text-brand" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-brand" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-sm sm:text-base leading-relaxed text-muted-foreground border-t border-line/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200} className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Have a question not listed here?{" "}
            <a href="#contact" className="font-semibold text-brand underline underline-offset-4 hover:text-white">
              Ask directly — we reply within 24 hours.
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
