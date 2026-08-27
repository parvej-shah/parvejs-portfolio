# Designing Progression Engines for Competitive Programming: Live Contests, Automated Evaluation, and Streak Architecture

*By Parvej Shah · Lead Systems & Platform Engineer*

---

Competitive programming is one of the most demanding pedagogical disciplines in computer science. Unlike standard web development tutorials where students can click through videos passively, mastering algorithms—dynamic programming, Dijkstra's shortest path, segment trees, and bitmask optimizations—requires active, continuous problem-solving under strict time constraints.

When architecting the learning and progression engine for **CoderVai CP** (a specialized competitive programming platform built for computer science students in Bangladesh), our objective was to solve the three primary failure modes of self-taught programmers:

1. **The Blank Canvas Paradox:** Beginners given access to Codeforces or LeetCode get overwhelmed by thousands of unsorted problems and give up within two weeks.
2. **The Progression Void:** Students lack a guided, prerequisite-locked curriculum that systematically elevates them from basic C++ syntax to complex graph theory.
3. **The Motivation Drop-off:** Without live contest leaderboards, daily streak tracking, and cohort peer visibility, consistent practice decays rapidly.

This post examines the **Competitive Programming Progression Architecture** we engineered, combining **automated problem evaluation, prerequisite-locked curriculum graphs, live contest leaderboards, and streak preservation mechanics**.

```
+---------------------------------------------------------------------------------------------------+
| 🏆 CODERVAI COMPETITIVE PROGRAMMING PROGRESSION ARCHITECTURE                                      |
|                                                                                                   |
|  [ Student Submits Code (C++ / Python) ]                                                          |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Real-Time Evaluation & Sandbox Judge Engine ]                                                  |
|                 │                                                                                 |
|                 ├─── ① Run Hidden Test Cases under Strict Limits (Time: 1.0s, Memory: 256MB)      |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Evaluation Result: ACCEPTED (AC) ]                                                             |
|                 │                                                                                 |
|                 ├─── ② Update User Submission History & Recalculate Rating                        |
|                 ├─── ③ Increment Daily Activity Streak (Redis atomic counter)                     |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Topic Prerequisite Graph Unlocked ]                                                            |
|     (e.g., Solving 8/10 "Binary Search" problems unlocks "Ternary Search & Monotonic Queues")    |
|                 │                                                                                 |
|  ───────────────┼───────────────────────────────────────────────────────────────────────────────  |
|  LIVE TIMED CONTESTS & DYNAMIC LEADERBOARDS                                                       |
|                 │                                                                                 |
|                 ▼                                                                                 |
|  [ Scheduled Weekend Contest (2-Hour Window) ]                                                    |
|                 ├─── ④ Real-time penalty-time scoring (ICPC Rules: Time + 20min per Wrong Answer)|
|                 └─── ⑤ Live Leaderboard Updates with Fast SSE Broadcast                           |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. The Prerequisite-Locked Curriculum Graph

Rather than presenting problems in an unorganized list, the curriculum is modeled as a **Directed Acyclic Graph (DAG)** where advanced topics remain locked until mastery of foundational algorithms is demonstrated:

```typescript
// lib/services/curriculumProgressionService.ts
import { prisma } from "@/lib/db";

export interface TopicNode {
  id: string;
  title: string;
  prerequisiteTopicIds: string[];
  requiredSolvedCount: number;
}

export async function evaluateStudentUnlocks(userId: string, targetTopicId: string): Promise<boolean> {
  const targetTopic = await prisma.cpTopic.findUnique({
    where: { id: targetTopicId },
    include: { prerequisites: true },
  });

  if (!targetTopic || targetTopic.prerequisites.length === 0) {
    return true; // Root topic (e.g., C++ Basics) -> always unlocked
  }

  for (const prereq of targetTopic.prerequisites) {
    const solvedCountInPrereq = await prisma.cpSubmission.count({
      where: {
        userId,
        problem: { topicId: prereq.id },
        verdict: "ACCEPTED",
      },
    });

    if (solvedCountInPrereq < prereq.requiredSolvedCount) {
      return false; // Prerequisite requirement not satisfied
    }
  }

  return true;
}
```

---

## 2. ICPC-Style Live Contest Scoring

During live timed contests, the scoring engine implements **ICPC Penalty Scoring**:
* Total Score = Number of Accepted Problems.
* Penalty = Total minutes elapsed from contest start to each successful submission, plus **20 penalty minutes** for every rejected attempt on that problem.

Leaderboard queries are cached in **Redis Sorted Sets (`ZADD` / `ZREVRANGE`)**, ensuring sub-5ms leaderboard reads under high concurrent student refreshes.

---

## 📚 Source & Inspiration Notes

* **Codeforces & ICPC Contest Rules:** [*International Collegiate Programming Contest Scoring Guidelines*](https://icpc.global/) — Penalty calculation algorithms.
* **Pragmatic Engineer (Gergely Orosz):** [*Designing Gamified Progression Systems for Developer Education*](https://blog.pragmaticengineer.com/) — Streak and cohort mechanics.
