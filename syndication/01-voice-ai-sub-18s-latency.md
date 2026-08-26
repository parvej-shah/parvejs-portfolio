---
title: "How We Got Voice AI Response Times Under 1.8 Seconds on Real Phone Calls"
published: true
description: "Building the telephony dispatcher for Minions.AI meant confronting a hard constraint: human patience. On a phone call, two seconds of silence feels like a dropped connection. Here's how we redesigned the audio pipeline from the ground up."
tags: ["webdev","ai","nextjs","typescript"]
canonical_url: https://parvejshah.com/blog/architecting-sub-18s-voice-ai-pipelines
cover_image: https://parvejshah.com/blog/voice-ai-sub-18s.png
---

> *Originally published at [parvejshah.com/blog/architecting-sub-18s-voice-ai-pipelines](https://parvejshah.com/blog/architecting-sub-18s-voice-ai-pipelines) by [Parvej Shah](https://parvejshah.com).*

There's a specific type of frustration that's hard to explain unless you've experienced it. You call a business. An automated voice picks up. You ask your question. And then — silence. Not a brief pause. A real silence. Long enough that you start wondering if the call dropped, long enough that you pull the phone away from your ear to check the signal bars.

That silence is what we were trying to eliminate when building the telephony dispatcher for **Minions.AI**, a voice-based service dispatch platform for trade contractors.

In human conversation, the natural gap between one person finishing a sentence and the other beginning a response is around 200 to 300 milliseconds. Anything beyond 600ms starts to feel awkward. At 2,500ms — which was where the original prototype sat — callers would repeat themselves, raise their voice, or hang up. The call experience was technically functional and practically unusable.

## The Sequential Pipeline Problem

The first design was a completely natural one: record audio, run transcription, generate a response, synthesize speech, play it back. Each stage waited for the previous one to finish. The latency budget looked like this:

| Stage | Time |
| :--- | :--- |
| Voice Activity Detection (end-of-turn) | 800ms |
| Speech-to-Text transcription | 400ms |
| LLM generation (full response) | 1,200ms |
| Text-to-Speech synthesis | 500ms |
| **Total** | **~2,900ms** |

That math is catastrophic for a phone call. And it gets worse in real conditions: cellular networks introduce jitter, LLM response times have variance, TTS output buffering adds overhead.

The solution wasn't to make each stage faster in isolation. It was to stop treating them as stages at all.

## Replacing Stages with Streams

The rewrite changed the mental model from a sequential pipeline to an overlapping set of event-driven streams. Nothing waits for anything it doesn't strictly have to.

**Neural VAD instead of silence timers.** The original design waited for 800ms of audio silence before assuming the caller had finished speaking. We replaced this with a WebRTC-compatible neural Voice Activity Detection model running on 20ms audio frames. It detects speech completion at the prosodic level — reading the natural falling intonation of a completed sentence — rather than just measuring decibels.

```typescript
interface VADConfig {
  frameSizeMs: 20;
  positiveSpeechThreshold: 0.65;
  negativeSpeechThreshold: 0.35;
  minSilenceDurationMs: 280;    // down from 800ms
  prefixPaddingFrames: 3;
}

function handleIncomingAudioFrame(frame: Buffer, vad: NeuralVAD) {
  const isSpeech = vad.process(frame);

  // Immediate barge-in handling
  if (isSpeech && currentAgentState === "SPEAKING") {
    audioOutputBuffer.clear();
    llmAbortController.abort();
    transitionToState("LISTENING");
  }
}
```

**Interim transcription triggers LLM start.** We don't wait for a complete transcription. The moment the STT engine emits an interim result with reasonable confidence — typically at 120ms — the LLM starts generating. By the time transcription finalizes, the LLM has already produced the first clause of its response.

**Clause-level audio synthesis.** The TTS engine doesn't wait for the LLM to finish the full response. We parse the LLM output stream for sentence terminators — periods, commas mid-clause, question marks. When the first natural breakpoint arrives, that clause goes to TTS immediately. While the caller hears the first four words, the LLM is generating the rest in parallel.

```typescript
async function* streamToTTS(
  llmStream: AsyncIterable<string>
): AsyncIterable<Buffer> {
  let clauseBuffer = "";

  for await (const token of llmStream) {
    clauseBuffer += token;

    // Flush at natural speech breakpoints
    if (/[.!?,]/.test(token) && clauseBuffer.trim().length > 12) {
      yield await synthesizeAudioChunk(clauseBuffer.trim());
      clauseBuffer = "";
    }
  }

  if (clauseBuffer.trim()) {
    yield await synthesizeAudioChunk(clauseBuffer.trim());
  }
}
```

## The Unexpected Hard Part: Cellular Jitter

The networking layer was where we lost the most unexpected time. Cellular SIP networks routinely have 40ms to 80ms of packet jitter. When you're streaming audio frames at 20ms intervals, jitter means frames arrive out of order or in bursts.

Without buffering, jitter translates directly into audio clipping — the robotic, choppy voice quality that immediately destroys caller trust. We added a small jitter buffer at the SIP gateway ingestion layer, accepting 50ms of added latency in exchange for smooth, consistent audio playback.

50ms on a phone call is inaudible. Robotic audio clipping is not.

## Speculative Tool Pre-fetching

The dispatcher doesn't just answer questions — it needs to check technician availability and book service appointments. That involves HTTP calls to third-party calendar APIs, which add 400ms to 800ms of latency if triggered synchronously during the LLM turn.

We solve this with speculative pre-fetching. The interim transcription stream is analyzed in real time for location signals: zip codes, neighborhood names, street references. The moment a location is detected — even mid-sentence, before the caller has finished — a background request for technician availability in that zone is initiated.

```typescript
function onInterimTranscript(partialText: string) {
  const zip = extractZipCode(partialText);
  if (zip && !availabilityCache.has(zip)) {
    // Fire and cache — result will be ready before we need it
    prefetchTechnicianSlots(zip).then(slots => {
      availabilityCache.set(zip, slots);
    });
  }
}
```

By the time the caller has finished their sentence and the LLM needs to respond with availability, the data is already in memory. The tool call that would have added 600ms takes 0ms.

## Where We Landed

With the overlapping streams, neural VAD, clause-level synthesis, and speculative prefetching combined, round-trip latency stabilized between 1,400ms and 1,800ms on residential and cellular connections.

The real measure wasn't the latency number. It was what callers stopped doing: they stopped repeating themselves, stopped raising their voices, stopped hanging up before the interaction completed.

A conversational AI system isn't "working" until humans forget it isn't human. Latency is the first and most important part of that illusion.

---

*Parvej Shah is a Lead Full-Stack Web Developer & Platform Architect based in Dhaka, Bangladesh. Explore full architecture case studies and production code at [parvejshah.com](https://parvejshah.com).*
