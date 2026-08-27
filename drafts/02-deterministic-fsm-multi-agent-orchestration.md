# Why We Stopped Using LLM Agents to Control LLM Agents: Deterministic State Machines in Production

*By Parvej Shah · Lead Systems & Platform Engineer*

---

The prevailing mental model for multi-agent systems in 2025–2026 is the **Orchestrator Agent**: a central LLM that receives an ambiguous top-level prompt, dynamically reasons about which specialized sub-agents to invoke, manages a shared conversational memory, and decides when the task has met its definition of done.

In early 2025, we built this exact pattern for **Minions.AI**'s automated technical content and dispatch intelligence engine. A central orchestrator LLM coordinated a signal research agent, an architecture drafting agent, a strict critique agent, and a CMS formatter.

It worked in 70% of runs. In the other 30%, it failed in creative, expensive, and non-deterministic ways.

This post documents why we completely eliminated LLM-driven orchestration in favor of a **Deterministic Finite State Machine (FSM) written in TypeScript**, dropping our pipeline failure rate from 28.4% to 0.8% while cutting token consumption by 64%.

```
+---------------------------------------------------------------------------------------------------+
| ❌ FLAWED: LLM PROMPT-DRIVEN ORCHESTRATION (30% Failure Rate)                                     |
|                                                                                                   |
|                 [ LLM Orchestrator (Prompt Decision) ]                                            |
|                                   │                                                               |
|        ┌──────────────────────────┼──────────────────────────┐                                    |
|        ▼                          ▼                          ▼                                    |
|  [ Research Agent ]       [ Drafting Agent ]         [ Critic Agent ]                             |
|        │                          │                          │                                    |
|        └──────────────────────────┴──────────────────────────┘                                    |
|                                   │                                                               |
|             Shared Conversational Context (Context Poisoning)                                     |
|             Oscillating Loops / Non-deterministic Token Exhaustion                                |
+---------------------------------------------------------------------------------------------------+
                                                 │
                                                 ▼
+---------------------------------------------------------------------------------------------------+
| ✅ ROBUST: DETERMINISTIC TYPESCRIPT FSM (99.2% Completion Rate)                                   |
|                                                                                                   |
|   [ HARVEST_SIGNALS ]                                                                             |
|            │ (signals.length > 0)                                                                 |
|            ▼                                                                                      |
|   [ DRAFT_CONTENT ]                                                                               |
|            │ (stateless prompt execution)                                                         |
|            ▼                                                                                      |
|   [ CRITIC_REVIEW ] ──(score < 85 && revisions < 2)──> [ REVISE_DRAFT ]                          |
|            │                                                    │                                 |
|            │ (score >= 85)                                      └───────┐                         |
|            ▼                                                            ▼                         |
|   [ STAGE_CMS ]                                                 [ CRITIC_REVIEW ]                 |
|            │                                                            │ (revisions >= 2)        |
|            ▼                                                            ▼                         |
|    Production Release                                            [ ESCALATE_HUMAN ]               |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. The Three Failure Modes of LLM Control Planes

When you ask an LLM to serve as a routing control plane, you are misapplying a probabilistic text completion engine to a deterministic state problem. We observed three systemic pathologies:

### Pathology 1: Loop Oscillation (The Critic-Writer Tennis Match)
The critic agent would reject a technical draft for lacking specific database benchmarks. The writer agent would add the benchmarks but alter the introductory tone. The critic agent would then reject the revised draft for "tone drift," instructing the writer to simplify the language. The writer would revert the text, deleting the benchmarks. 

Because the orchestrator LLM lacked strict mathematical termination bounds, the two agents would oscillate until hitting the maximum context limit ($128\text{k tokens}$).

### Pathology 2: Context Poisoning
In a shared conversational thread, every intermediate thought, hallucination, tool call failure, and apology is appended to the message history. By turn 8:
* 40% of the active context was consumed by orchestration chatter ("I apologize for the confusion, let me re-evaluate").
* The drafting agent suffered severe attention degradation, ignoring primary instructions in the system prompt due to the recency bias of flawed intermediate turns.

### Pathology 3: Non-Deterministic Convergence
The exact same technical topic with identical input signals would complete in 4 turns on Tuesday (costing \$0.12) and 19 turns on Wednesday (costing \$1.48), producing inferior output due to context exhaustion.

---

## 2. The Solution: Hard State Transitions in TypeScript

Our architectural rule is simple: **LLMs are exceptional at content transformation, extraction, synthesis, and scoring against a rubric. They are terrible at state machine transitions, termination detection, and error routing.**

We moved the entire control plane into strongly-typed TypeScript:

```typescript
// Deterministic Multi-Agent State Machine
import { z } from "zod";

export type PipelineState =
  | "HARVEST_SIGNALS"
  | "DRAFT_CONTENT"
  | "CRITIC_REVIEW"
  | "REVISE_DRAFT"
  | "STAGE_CMS"
  | "ESCALATE_HUMAN";

export interface PipelineContext {
  topicId: string;
  signals: string[];
  currentDraft?: string;
  critiqueScore?: number;
  actionableFeedback?: string[];
  revisionCount: number;
  maxRevisions: 2; // Hard invariant
}

// Zod Schema for Structured Evaluation Output
export const CritiqueSchema = z.object({
  score: z.number().min(0).max(100),
  passedRubric: z.boolean(),
  actionableFeedback: z.array(z.string()).max(3),
  technicalAccuracyConfirmed: z.boolean(),
});

export async function executeDeterministicPipeline(
  ctx: PipelineContext
): Promise<PipelineState> {
  let state: PipelineState = "HARVEST_SIGNALS";

  while (state !== "STAGE_CMS" && state !== "ESCALATE_HUMAN") {
    switch (state) {
      case "HARVEST_SIGNALS": {
        ctx.signals = await runSignalHarvester(ctx.topicId);
        state = ctx.signals.length > 0 ? "DRAFT_CONTENT" : "ESCALATE_HUMAN";
        break;
      }

      case "DRAFT_CONTENT": {
        // Stateless prompt execution: receives ONLY the raw signals
        ctx.currentDraft = await runDraftingAgent(ctx.signals);
        state = "CRITIC_REVIEW";
        break;
      }

      case "CRITIC_REVIEW": {
        // Stateless evaluation: receives ONLY the draft and strict rubric
        const evaluation = await runCriticAgent(ctx.currentDraft!);
        ctx.critiqueScore = evaluation.score;
        ctx.actionableFeedback = evaluation.actionableFeedback;

        if (evaluation.score >= 85 && evaluation.technicalAccuracyConfirmed) {
          state = "STAGE_CMS";
        } else if (ctx.revisionCount < ctx.maxRevisions) {
          ctx.revisionCount++;
          state = "REVISE_DRAFT";
        } else {
          // Hard deterministic exit: Never loop infinitely
          state = "ESCALATE_HUMAN";
        }
        break;
      }

      case "REVISE_DRAFT": {
        ctx.currentDraft = await runRevisionAgent(
          ctx.currentDraft!,
          ctx.actionableFeedback!
        );
        state = "CRITIC_REVIEW";
        break;
      }
    }
  }

  return state;
}
```

---

## 3. The 3 Invariant Architectural Rules

1. **Stateless Agent Contexts:** No agent receives another agent's conversational transcript. The drafting agent receives only raw source signals. The critic receives only the draft and the rubric. Context poisoning is mathematically impossible.
2. **Hard Iteration Bounds:** No loop condition executes without an explicit integer increment. If a draft fails critic evaluation twice, the system does not "try harder"—it escalates to a human editor with the critique payload attached.
3. **Structured Outputs via Schema Validation:** Agent responses are strictly parsed through Zod schemas with JSON-mode enforcement. If an LLM returns unparseable JSON, the TypeScript driver retries the single isolated call rather than contaminating the pipeline.

---

## 4. Production Metrics & Cost Analysis

Compared across 450 technical content generation workflows:

| Performance Metric | LLM-Orchestrated Multi-Agent | Deterministic TypeScript FSM | Improvement |
| :--- | :--- | :--- | :--- |
| **Completion Reliability** | 71.6% | **99.2%** | **+27.6%** |
| **Loop Oscillations** | 18.2% of runs | **0.0%** | **Eliminated** |
| **Median Token Usage** | 42,800 tokens / run | **15,400 tokens / run** | **-64.0%** |
| **Inference Cost Variance**| $\pm 140\%$ | $\mathbf{\pm 8\%}$ | **Predictable spend** |
| **p95 Pipeline Duration** | 184 seconds | **48 seconds** | **-73.9%** |

---

## 📚 Source & Inspiration Notes

* **Linear Engineering ("Now"):** [*Rebuilding Linear’s delta sync read path*](https://linear.app/now/rebuilding-delta-sync-read-path) — Stole the discipline of mathematical set bounds and decoupled state evaluation.
* **Dan Abramov (*Overreacted.io*):** [*Goodbye, Clean Code*](https://overreacted.io/goodbye-clean-code/) — The core philosophy of dismantling unnecessary indirection in favor of direct, local, explicit control flow.
* **Mitchell Hashimoto:** [*Building Ghostty with Typed State Primitives*](https://mitchellh.com/) — Framing state transitions as formal finite automata rather than dynamic runtime inferences.
