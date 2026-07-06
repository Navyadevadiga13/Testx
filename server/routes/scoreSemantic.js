// server/routes/scoreSemantic.js
//
// POST /score/semantic  { essay, prompt, taskType: "task1" | "task2" }
// -> 200 {
//      taskAchievement: { band, note, offTopic },
//      coherence:       { band, note },
//      lexical:         { band, note },
//      grammar:         { band, note },
//      overallImpression: string
//    }
//
// Requires ANTHROPIC_API_KEY in the environment. Never expose this key
// to the client — this route is the only thing that should call
// api.anthropic.com directly.

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RUBRIC_PROMPT = (essay, prompt, taskType) => `
You are an experienced, strict IELTS Writing examiner marking under real exam
conditions. Score the following ${taskType === "task1" ? "Academic Task 1 report" : "Task 2 essay"}
using the official IELTS Writing band descriptors (bands 1-9, half-bands allowed).

TASK PROMPT:
"""${prompt}"""

CANDIDATE RESPONSE:
"""${essay}"""

Assess all four criteria independently and rigorously:

1. Task Achievement/Response
   - Is the response actually on-topic and answering what was asked? Set "offTopic": true
     if the response ignores the prompt, answers a different question, or is substantially
     irrelevant.
   ${taskType === "task1"
      ? "- Correct identification and selection of key features (not every number, the IMPORTANT ones). Appropriate grouping/comparison of data or process stages. Presence of a clear overview statement."
      : "- Clarity and consistency of the writer's position throughout. Whether ideas are actually developed (explained, justified) rather than just stated. Relevance and specificity of examples used to support points."}

2. Coherence & Cohesion
   - Logical progression of ideas both within and between paragraphs.
   - Paragraph unity: does each paragraph stick to one central idea, or does it wander?
   - Natural (not mechanical or overused) use of cohesive devices and referencing.

3. Lexical Resource
   - Range and precision of vocabulary for the topic.
   - Natural collocation vs. awkward or translated-sounding word choices.
   - Appropriateness of register (formal, impersonal for Task 1; appropriately formal for Task 2).

4. Grammatical Range & Accuracy
   - Range of structures actually attempted (not just error count) — simple sentences only
     vs. a mix of complex/compound structures, passive voice, conditionals, etc.
   - Accuracy of those structures.
   - Whether any errors actually impede communication, versus being minor slips.

Calibration guidance: be realistic, not generous. Most non-native adult candidates score in
the 5.5-7.0 range. Reserve 8+ for genuinely sophisticated, near-native control with only
occasional minor slips, and reserve 9 for exceptional, examiner-rare performance. A response
that is fluent but formulaic, generic, or clearly memorized should not receive a high
Task Achievement score even if the language is polished.

Respond with ONLY valid JSON in exactly this shape, no markdown fences, no commentary
outside the JSON:

{
  "taskAchievement": {"band": <number>, "note": "<1-2 sentence specific feedback>", "offTopic": <boolean>},
  "coherence": {"band": <number>, "note": "<1-2 sentence specific feedback>"},
  "lexical": {"band": <number>, "note": "<1-2 sentence specific feedback>"},
  "grammar": {"band": <number>, "note": "<1-2 sentence specific feedback>"},
  "overallImpression": "<one sentence holistic summary of the response>"
}
`;

export default async function scoreSemanticHandler(req, res) {
  const { essay, prompt, taskType } = req.body || {};

  if (!essay || typeof essay !== "string" || essay.trim().length < 20) {
    return res.status(400).json({ error: "invalid_essay", message: "Essay text is missing or too short to score." });
  }
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "invalid_prompt", message: "Task prompt is required." });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      messages: [{ role: "user", content: RUBRIC_PROMPT(essay, prompt, taskType) }]
    });

    const textBlock = response.content.find(b => b.type === "text");
    if (!textBlock) throw new Error("No text content in model response");

    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    for (const key of ["taskAchievement", "coherence", "lexical", "grammar"]) {
      if (typeof parsed?.[key]?.band !== "number") {
        throw new Error(`Malformed model output: missing numeric band for ${key}`);
      }
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("[/score/semantic] scoring failed:", err);
    return res.status(502).json({ error: "semantic_scoring_unavailable", message: err.message });
  }
}