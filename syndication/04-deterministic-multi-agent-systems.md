---
title: "Why We Stopped Using LLM Agents to Control LLM Agents"
published: true
description: "Open-ended multi-agent loops sound powerful in demos. In production, they produce inconsistent outputs, accumulate context garbage, and are nearly impossible to debug. Here's what we built instead."
tags: ["ai", "architecture", "typescript", "softwareengineering"]
canonical_url: https://parvejshah.com/blog/deterministic-multi-agent-systems-production
cover_image: https://parvejshah.com/blog/multi-agent-state-machines.png
---

> *Originally published at [parvejshah.com/blog/deterministic-multi-agent-systems-production](https://parvejshah.com/blog/deterministic-multi-agent-systems-production) by [Parvej Shah](https://parvejshah.com).*

The demo worked perfectly. We had an "orchestrator" agent that would receive a blog topic, instruct a "researcher" agent to gather information, pass the findings to a "writer" agent, then route the draft to a "critic" agent for review. On stage, it produced a polished article in under 90 seconds.

Then we ran it 200 times and tracked the outputs. The results ranged from excellent to incoherent. About 30% of runs would get stuck in argument loops between the writer and critic. Another 15% would produce outputs that confidently violated our brand guidelines in ways the critic agent never flagged. Debugging any individual failure was nearly impossible because the failure state was embedded somewhere inside a 40,000-token chat transcript.

This was the pipeline we were building for **Minions.AI** — an automated editorial system for trade contractor content. The promise of autonomous agent loops was appealing. The operational reality wasn't.

## The Root Problem with Open-Ended Agent Loops

When you instruct one LLM to coordinate other LLMs using natural language messages, you've introduced the same class of problems that plague microservices with verbal contracts: the coordination protocol is untyped, unvalidated, and brittle at the edges.

Three failure modes showed up immediately in production:

**Looping deadlock.** The critic agent would return vague feedback like "the introduction needs more specificity." The writer would revise. The critic would give nearly identical feedback on the new draft. They would iterate until the token budget was exhausted, producing no output at all.

**Context poisoning.** As the multi-turn conversation grew, the orchestrator's effective understanding of its original goal would degrade. Early conversation turns — where the core constraints and formatting requirements lived — would be pushed toward the edges of the context window or summarized away. The outputs from late-stage retries would drift from the original specification.

**Uncatchable hallucination.** The critic was supposed to verify factual claims. But the critic and writer shared similar base model training, which meant they shared similar confident misconceptions. The critic would approve claims that were wrong but stated with appropriate confidence.

## The Fix: TypeScript Controls the Graph

The redesign had one core principle: LLMs are transformation functions, not control flow. We write the control flow in TypeScript.

Instead of an orchestrator agent deciding what happens next, we define the execution graph explicitly. Every valid state is enumerated. Every transition is typed. An LLM cannot invent a new state or skip a required step.

```typescript
type EditorialStatus =
  | "INGESTED"
  | "RESEARCHING"
  | "DRAFTING"
  | "CRITIQUE"
  | "APPROVED"
  | "PUBLISHED";

interface EditorialState {
  id: string;
  topic: {
    keyword: string;
    trade: "Plumbing" | "HVAC" | "Electrical" | "General";
    targetReadingLevel: "Homeowner" | "Technician";
  };
  researchSummary: string | null;
  draft: {
    markdownContent: string;
    wordCount: number;
    version: number;
  } | null;
  criticResult: {
    score: number;
    passed: boolean;
    issues: string[];
    bannedPhrases: string[];
  } | null;
  status: EditorialStatus;
  retryCount: number;
  maxRetries: 2;
}
```

Every agent receives a validated snapshot of this state and returns a deterministic delta. The runner function in TypeScript reads the current status, determines which agent to invoke, validates the output schema, applies the delta, and persists.

```typescript
async function runEditorialPipeline(state: EditorialState): Promise<EditorialState> {
  switch (state.status) {
    case "INGESTED":
      return applyDelta(state, await runResearchAgent(state.topic));

    case "RESEARCHING":
      return applyDelta(state, await runDraftingAgent(state.researchSummary!));

    case "DRAFTING": {
      const result = await runCriticAgent(state.draft!.markdownContent);

      if (result.passed) {
        return applyDelta(state, { status: "APPROVED", criticResult: result });
      }

      if (state.retryCount >= state.maxRetries) {
        return applyDelta(state, { status: "INGESTED", retryCount: 0 });
      }

      return applyDelta(state, {
        status: "DRAFTING",
        draft: { ...state.draft!, version: state.draft!.version + 1 },
        criticResult: result,
        retryCount: state.retryCount + 1,
      });
    }

    case "APPROVED":
      await publishToContentAPI(state);
      return applyDelta(state, { status: "PUBLISHED" });

    default:
      throw new Error(`Unexpected pipeline status: ${state.status}`);
  }
}
```

## Decoupling the Critic

The most important structural decision was making the critic agent completely independent of the drafting context. In the original design, the critic received the full conversation history including the initial brief. This meant it shared anchoring bias with the drafter — it had "seen" the intent and was therefore unlikely to question fundamental assumptions.

The redesigned critic receives exactly two things: the raw draft text and a structured evaluation rubric. It has no access to the original brief, no knowledge of which agent produced it, and runs at temperature 0.1. Its job is narrow and its output is a JSON schema.

```typescript
const CRITIC_SYSTEM_PROMPT = `
You are a strict quality evaluator. You will be given a draft article and a rubric.
Return a JSON object with: score (0.0-1.0), passed (boolean), issues (string[]), bannedPhrases (string[]).

Fail the article if:
- Any claim is unsupported or vague without specific detail
- Any of these phrases appear: "in today's world", "in conclusion", "it's important to note", "leverage", "utilize"
- Word count is below 600
- Technical claims are internally inconsistent
`;

async function runCriticAgent(draft: string): Promise<CriticResult> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.1,
    messages: [
      { role: "system", content: CRITIC_SYSTEM_PROMPT },
      { role: "user", content: draft },
    ],
  });

  return JSON.parse(completion.choices[0].message.content!) as CriticResult;
}
```

## What Changed

The state machine design gave us three things we couldn't have with open-ended loops:

**Reproducibility.** Any run can be replayed by restoring its state snapshot and re-running the pipeline from the stored status. Debugging a failure means reading a JSON object, not unwinding a 40,000-token chat transcript.

**Observable failures.** When the critic rejects a draft, we log the specific issues array. We can see exactly which banned phrases appeared, which claims failed verification, and what the score was. This data improved the drafter's system prompt iteratively.

**Reliable retries.** The retry limit is enforced in TypeScript, not left to an agent's judgment. When retries are exhausted, the pipeline resets cleanly and alerts a human reviewer rather than continuing to generate increasingly deranged content.

The broader lesson is a simple one: LLMs are powerful tools for transforming text. They are not reliable architects of multi-step processes. Write the architecture yourself.

---

*Parvej Shah is a Lead Full-Stack Web Developer & Platform Architect based in Dhaka, Bangladesh. Explore full architecture case studies and production code at [parvejshah.com](https://parvejshah.com).*
