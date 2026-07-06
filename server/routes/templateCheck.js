// server/routes/templateCheck.js
//
// POST /score/template-check  { essay }
// -> 200 { isTemplate: boolean, similarity: number (0-1), matchedSource?: string }
//
// Detects candidate responses that are recycled "band 9 model essay"
// templates from prep books/websites, which prompt-string matching
// against the CURRENT task prompt (getCopyRatio on the frontend) can't
// catch, because template essays are usually reworded to loosely fit
// whatever topic is given.
//
// Approach: maintain a corpus of known template/model essays, embed
// them once offline, store the vectors in a vector index (pgvector,
// Pinecone, etc.), then at request time embed the candidate response
// and compare via cosine similarity to the nearest corpus entries.
//
// This file shows the request-time comparison. See
// scripts/buildTemplateCorpus.js for the one-time corpus-embedding job.

import { embedText } from "../lib/embeddings.js"; // wraps your embeddings provider
import { queryNearestTemplates } from "../lib/vectorStore.js"; // wraps pgvector/Pinecone query

const SIMILARITY_FLAG_THRESHOLD = 0.90;

export default async function templateCheckHandler(req, res) {
  const { essay } = req.body || {};

  if (!essay || typeof essay !== "string" || essay.trim().length < 40) {
    return res.status(400).json({ error: "invalid_essay", message: "Essay text is missing or too short to check." });
  }

  try {
    const vector = await embedText(essay);
    const matches = await queryNearestTemplates(vector, { topK: 3 });

    if (!matches || matches.length === 0) {
      return res.status(200).json({ isTemplate: false, similarity: 0 });
    }

    const best = matches[0]; // { similarity: number, sourceId: string, sourceLabel?: string }

    return res.status(200).json({
      isTemplate: best.similarity >= SIMILARITY_FLAG_THRESHOLD,
      similarity: best.similarity,
      matchedSource: best.similarity >= SIMILARITY_FLAG_THRESHOLD ? (best.sourceLabel || best.sourceId) : undefined
    });
  } catch (err) {
    console.error("[/score/template-check] check failed:", err);
    // Fail open: never block submission on this check.
    return res.status(502).json({ error: "template_check_unavailable", message: err.message });
  }
}