import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiClock, FiAlertTriangle, FiInfo } from "react-icons/fi";
import getApiBaseUrl from "../utils/api";

const IELTS_DATA_WRITING = {
  title: "Academic Writing Practice Test 1",
  tasks: [
    {
      id: "task1",
      title: "Task 1: Report (20 min)",
      prompt:
        "The diagram below shows how bricks are manufactured for the building industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      image: "/bricks.png",
      minWords: 150,
      keywords: ["brick", "manufactur", "process", "clay", "kiln", "produc", "stage", "diagram", "compar"],
      diagramType: "process" // "process" | "line" | "bar" | "pie" | "table" | "mixed"
    },
    {
      id: "task2",
      title: "Task 2: Essay (40 min)",
      prompt:
        "Compared to the past, more people are now trying to learn a foreign language to increase their chances of landing a better job in their native country or having better opportunities to work abroad. To what extent do you agree with this point of view? Give specific reasons and examples to support your opinion.",
      minWords: 250,
      keywords: ["language", "job", "work", "career", "opportunit", "abroad", "agree", "disagree", "learn"]
    }
  ]
};

const LINKING_WORDS = [
  "however", "moreover", "furthermore", "in addition", "therefore", "consequently",
  "for example", "for instance", "in conclusion", "on the other hand", "as a result",
  "in contrast", "similarly", "although", "despite", "nevertheless", "thus", "hence",
  "firstly", "secondly", "finally", "overall", "in summary", "to conclude", "meanwhile"
];

const STOPWORDS = new Set([
  "the","a","an","is","are","was","were","and","or","but","of","to","in","on","for",
  "with","as","by","at","from","that","this","it","be","have","has","had","not","i",
  "you","they","we","he","she","their","its","his","her","my","your","our","which",
  "will","would","can","could","should","been","being","do","does","did","so","if",
  "than","then","there","these","those","also","into","about","more","most","other"
]);

const OVERVIEW_MARKERS = ["overall", "in general", "it is clear that", "it can be seen that", "as can be seen", "in summary"];
const COMPARISON_MARKERS = ["compared to", "compared with", "whereas", "while", "in contrast", "on the other hand", "than", "similarly", "likewise"];
const OPINION_MARKERS = ["i believe", "i think", "in my opinion", "i agree", "i disagree", "from my perspective", "i would argue", "it is my view", "my view is"];
const EXAMPLE_MARKERS = ["for example", "for instance", "such as", "e.g.", "namely", "a good example"];
const CONCLUSION_MARKERS = ["in conclusion", "to conclude", "to summarise", "to summarize", "in summary", "overall,"];
const REFERENCING_MARKERS = ["this shows", "this means", "these factors", "such a", "this suggests", "this indicates", "this trend"];
const MODAL_VERBS = ["would", "could", "might", "should", "must", "may", "can"];

const ELABORATION_MARKERS = [
  "this means", "this shows", "this suggests", "this indicates", "which means",
  "for example", "for instance", "as a result", "this is because", "specifically",
  "in other words", "this is due to", "as a consequence", "this leads to", "this results in"
];

const PROCESS_SEQUENCING_MARKERS = [
  "first,", "firstly", "second,", "secondly", "third,", "thirdly", "then,", "next,",
  "after that", "after this", "following this", "once", "subsequently", "finally",
  "at this stage", "at the final stage", "the first stage", "the next stage"
];

// ---- Position/stance markers (Task 2 — feeds Position Consistency) ----
const STANCE_AGREE_MARKERS = [
  "i agree", "i support", "in favour of", "in favor of", "i am convinced",
  "i strongly agree", "i concur", "this view is correct", "i side with"
];
const STANCE_DISAGREE_MARKERS = [
  "i disagree", "i do not agree", "i don't agree", "i oppose", "against this view",
  "not convinced", "i strongly disagree", "this view is incorrect", "i cannot agree"
];

// ---- Key-feature / data-grouping / trend language (Task 1) ----
const KEY_FEATURE_MARKERS = [
  "highest", "lowest", "largest", "smallest", "majority", "minority",
  "significant proportion", "notably", "most notably", "in particular",
  "the most striking", "stands out", "by far", "the biggest", "the greatest"
];
const DATA_GROUPING_MARKERS = [
  "both", "the remaining", "in contrast", "unlike", "similarly", "whereas",
  "the other", "on the other hand", "respectively", "meanwhile", "conversely",
  "the rest of", "the majority of the remaining"
];
const TREND_MARKERS = [
  "increase", "increased", "increasing", "decrease", "decreased", "decreasing",
  "rise", "rose", "rising", "fall", "fell", "falling", "fluctuate", "fluctuated",
  "peak", "peaked", "plummet", "plummeted", "steadily", "dramatically", "sharply",
  "gradually", "remained stable", "remained constant", "level off", "levelled off",
  "surge", "surged", "decline", "declined", "climb", "climbed", "drop", "dropped"
];

// ---- Synonym groups (feeds Lexical: synonym variety / paraphrase skill) ----
const SYNONYM_GROUPS = [
  ["important", "significant", "crucial", "vital", "essential", "key"],
  ["increase", "rise", "grow", "climb", "surge", "escalate"],
  ["decrease", "decline", "drop", "fall", "plummet", "diminish"],
  ["show", "demonstrate", "indicate", "reveal", "illustrate", "highlight"],
  ["big", "large", "huge", "substantial", "considerable", "significant"],
  ["small", "minor", "slight", "negligible", "minimal"],
  ["believe", "think", "feel", "argue", "contend", "maintain"],
  ["problem", "issue", "challenge", "difficulty", "obstacle"],
  ["cause", "lead to", "result in", "bring about", "trigger"],
  ["many", "numerous", "a great many", "a large number of", "countless"],
  ["good", "beneficial", "advantageous", "favourable", "favorable"],
  ["bad", "harmful", "detrimental", "damaging", "adverse"],
  ["change", "shift", "transform", "alter", "modify"],
  ["help", "assist", "aid", "support", "facilitate"]
];

const ALL_PROMPTS_TEXT = IELTS_DATA_WRITING.tasks.map(t => t.prompt).join(" ");

const roundToHalfBand = (score) => Math.round(score * 2) / 2;
const clampBand = (score) => Math.max(1, Math.min(9, score));

const roundOverallBand = (score) => {
  const floor = Math.floor(score);
  const decimal = Number((score - floor).toFixed(2));
  if (decimal < 0.25) return floor;
  if (decimal < 0.75) return floor + 0.5;
  return floor + 1;
};

const normalizeForCompare = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const getNgrams = (tokens, n) => {
  const grams = new Set();
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.add(tokens.slice(i, i + n).join(" "));
  }
  return grams;
};

const getCopyRatio = (responseText, sourceText) => {
  const responseTokens = normalizeForCompare(responseText);
  if (responseTokens.length < 5) return 0;

  const sourceTokens = normalizeForCompare(sourceText);
  const n = 5;
  const responseGrams = getNgrams(responseTokens, n);
  const sourceGrams = getNgrams(sourceTokens, n);
  if (responseGrams.size === 0) return 0;

  let matches = 0;
  responseGrams.forEach(g => { if (sourceGrams.has(g)) matches++; });
  return matches / responseGrams.size;
};

const jaccard = (setA, setB) => {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach(x => { if (setB.has(x)) intersection++; });
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

const contentWordSet = (text) => {
  const words = (text.toLowerCase().match(/[a-z']+/g) || []).filter(w => !STOPWORDS.has(w));
  return new Set(words);
};

const splitSentences = (text) => text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

// ============================================================================
// CRITERION 4 (real): GRAMMATICAL RANGE & ACCURACY via LanguageTool,
// with SEVERITY WEIGHTING instead of a flat error count.
// ============================================================================
const LANGUAGETOOL_ENDPOINT = "https://api.languagetool.org/v2/check";

const GRAMMAR_CATEGORY_WEIGHTS = {
  GRAMMAR: 1.5,
  CONFUSED_WORDS: 1.3,
  COLLOCATIONS: 1.2,
  SEMANTICS: 1.0,
  TYPOS: 1.0,
  COMPOUNDING: 0.7,
  REDUNDANCY: 0.6,
  PUNCTUATION: 0.5,
  CASING: 0.5
};

const checkGrammarWithLanguageTool = async (text) => {
  if (!text || text.trim().length === 0) return [];

  try {
    const response = await fetch(LANGUAGETOOL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text, language: "en-US", enabledOnly: "false" })
    });

    if (!response.ok) throw new Error(`LanguageTool API responded with status ${response.status}`);

    const data = await response.json();
    return Array.isArray(data.matches) ? data.matches : [];
  } catch (err) {
    console.error("LanguageTool grammar check failed, falling back to heuristic scoring", err);
    return null;
  }
};

const scoreGrammarFromLanguageTool = (matches, text, getWordCountFn) => {
  const words = getWordCountFn(text);
  if (words === 0) return { band: 4, note: "No content to assess.", source: "languagetool" };

  const relevantErrors = matches.filter(
    m => m.rule && GRAMMAR_CATEGORY_WEIGHTS[m.rule.category?.id] !== undefined
  );

  const weightedErrorSum = relevantErrors.reduce(
    (sum, m) => sum + (GRAMMAR_CATEGORY_WEIGHTS[m.rule.category?.id] || 1),
    0
  );

  const weightedErrorsPer100Words = (weightedErrorSum / words) * 100;

  let band;
  if (weightedErrorsPer100Words === 0) band = 8.5;
  else if (weightedErrorsPer100Words < 1) band = 8;
  else if (weightedErrorsPer100Words < 2) band = 7.5;
  else if (weightedErrorsPer100Words < 3.5) band = 7;
  else if (weightedErrorsPer100Words < 5.5) band = 6.5;
  else if (weightedErrorsPer100Words < 8) band = 6;
  else if (weightedErrorsPer100Words < 11) band = 5.5;
  else if (weightedErrorsPer100Words < 15) band = 5;
  else if (weightedErrorsPer100Words < 20) band = 4.5;
  else band = 4;

  band = roundToHalfBand(Math.min(band, 8.5));

  const grammarCount = relevantErrors.filter(m => m.rule.category?.id === "GRAMMAR").length;
  const typoCount = relevantErrors.filter(m => m.rule.category?.id === "TYPOS").length;
  const punctCount = relevantErrors.filter(m => m.rule.category?.id === "PUNCTUATION").length;
  const confusedCount = relevantErrors.filter(m => m.rule.category?.id === "CONFUSED_WORDS").length;

  let note;
  if (relevantErrors.length === 0) {
    note = "No grammar, spelling, or punctuation errors detected by automated checking.";
  } else {
    const parts = [];
    if (grammarCount) parts.push(`${grammarCount} grammar issue${grammarCount > 1 ? "s" : ""} (high severity)`);
    if (confusedCount) parts.push(`${confusedCount} confused word${confusedCount > 1 ? "s" : ""} (high severity)`);
    if (typoCount) parts.push(`${typoCount} spelling issue${typoCount > 1 ? "s" : ""}`);
    if (punctCount) parts.push(`${punctCount} punctuation issue${punctCount > 1 ? "s" : ""} (low severity)`);
    const otherCount = relevantErrors.length - grammarCount - typoCount - punctCount - confusedCount;
    if (otherCount > 0) parts.push(`${otherCount} other mechanical issue${otherCount > 1 ? "s" : ""}`);
    note = `Detected ${relevantErrors.length} error(s), severity-weighted to ~${weightedErrorsPer100Words.toFixed(1)} per 100 words: ${parts.join(", ")}.`;
  }

  return { band, note: `${note} Checked automatically via LanguageTool with severity weighting.`, source: "languagetool" };
};

const scoreGrammarHeuristic = (text) => {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return { band: 4, note: "No sentences to assess.", source: "heuristic" };

  const lengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avgLen, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  let varietyScore;
  if (stdDev < 3) varietyScore = 5;
  else if (stdDev < 6) varietyScore = 6.5;
  else varietyScore = 7.5;

  const punctuationScore = /[;:]/.test(text) ? 7 : 5.5;

  const band = roundToHalfBand((varietyScore + punctuationScore) / 2);
  return {
    band,
    note: "⚠️ Automated grammar checking was unavailable, so this is a rough estimate from sentence structure only (not real error detection).",
    source: "heuristic"
  };
};

// ============================================================================
// NEW — GRAMMAR RANGE DETECTION (structure diversity)
// ============================================================================
// Distinct from error-weighting above: LanguageTool judges ACCURACY, not
// RANGE. A candidate with zero errors but only ever writing simple
// sentences shouldn't get the same range credit as one who correctly
// varies structures. This always runs (even when LanguageTool succeeds)
// as a supplementary signal into the Grammar band.
const GRAMMAR_STRUCTURES = {
  complexClauses: /\b(because|although|though|since|while|whereas|if|unless|when|whenever|which|who|whom|that)\b/gi,
  passiveVoice: /\b(is|are|was|were|been|being)\s+\w+ed\b/gi,
  perfectTense: /\b(has|have|had)\s+(been\s+)?\w+ed\b/gi,
  modals: /\b(would|could|might|should|must|may|can)\b/gi,
  conditionals: /\bif\s+.+?,.+?(would|will|could|might)\b/gi,
  gerundsInfinitives: /\b(to \w+ing|by \w+ing|\w+ing\s+to)\b/gi,
  comparatives: /\b(\w+er than|more \w+ than|less \w+ than|the most \w+|the \w+est)\b/gi,
  relativeClausesNonDefining: /,\s*(which|who|whom)\b/gi
};

const scoreGrammarRange = (text) => {
  if (!text || text.trim().length === 0) {
    return { band: 4, note: "No content to assess for grammatical range.", structuresUsed: [] };
  }

  const structuresUsed = Object.entries(GRAMMAR_STRUCTURES)
    .filter(([, pattern]) => (text.match(pattern) || []).length > 0)
    .map(([name]) => name);

  const count = structuresUsed.length;
  let band;
  if (count === 0) band = 4.5;
  else if (count <= 2) band = 5.5;
  else if (count <= 4) band = 6.5;
  else if (count <= 6) band = 7.5;
  else band = 8.5;

  const note = count === 0
    ? "Only simple sentence structures detected — try adding complex sentences (because/although/which clauses), passives, or conditionals."
    : `Detected ${count} distinct structure type(s) in use (e.g. ${structuresUsed.slice(0, 3).join(", ")}), showing ${count >= 5 ? "strong" : count >= 3 ? "moderate" : "limited"} grammatical range.`;

  return { band: roundToHalfBand(band), note, structuresUsed };
};

// ============================================================================
// NEW — COMPLEX SENTENCE DETECTION
// ============================================================================
// Ratio of sentences that contain a subordinating conjunction/relative
// pronoun or more than one comma-separated clause, vs. simple sentences.
const SUBORDINATORS = /\b(because|although|though|since|while|whereas|if|unless|when|whenever|which|who|that|as|after|before|until)\b/i;

const scoreComplexSentenceRatio = (text) => {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return { band: 4, note: "No sentences to assess.", ratio: 0 };

  const complexCount = sentences.filter(s => SUBORDINATORS.test(s) || (s.match(/,/g) || []).length >= 2).length;
  const ratio = complexCount / sentences.length;

  let band;
  if (ratio < 0.15) band = 5;
  else if (ratio < 0.3) band = 6;
  else if (ratio < 0.5) band = 7;
  else if (ratio < 0.7) band = 7.5;
  else band = 6.5; // too many complex sentences with no simple ones can hurt clarity/naturalness

  const note = ratio < 0.3
    ? `Only ~${Math.round(ratio * 100)}% of sentences use a complex structure — mix in more subordinate clauses for a higher grammar band.`
    : ratio > 0.7
    ? `Almost every sentence (${Math.round(ratio * 100)}%) is complex — some simple sentences for contrast/emphasis would read more naturally.`
    : `Good mix: ~${Math.round(ratio * 100)}% of sentences use complex structures.`;

  return { band: roundToHalfBand(band), note, ratio: Number(ratio.toFixed(2)) };
};

// ============================================================================
// COLLOCATION & VOCABULARY PRECISION ANALYSIS
// ============================================================================
const COMMON_MISCOLLOCATIONS = [
  { pattern: /\bmake (a |an )?research\b/gi, fix: "do research" },
  { pattern: /\bdiscuss about\b/gi, fix: "discuss (no preposition needed)" },
  { pattern: /\baccording to me\b/gi, fix: "in my opinion / I believe" },
  { pattern: /\bpay attention on\b/gi, fix: "pay attention to" },
  { pattern: /\bcapable to\b/gi, fix: "capable of" },
  { pattern: /\bdepend of\b/gi, fix: "depend on" },
  { pattern: /\bin the other hand\b/gi, fix: "on the other hand" },
  { pattern: /\bincrease day by day\b/gi, fix: "increase steadily / continually" },
  { pattern: /\bnowadays days\b/gi, fix: "nowadays" },
  { pattern: /\bmore and more increase\b/gi, fix: "increase steadily / rise" },
  { pattern: /\bmake a big role\b/gi, fix: "play a big/significant role" },
  { pattern: /\bincrease the number of\b.*\bday by day\b/gi, fix: "a growing/increasing number of" }
];

const ACADEMIC_COLLOCATIONS = [
  /\bplay(s|ed)? a (crucial|significant|vital|key|major) role\b/gi,
  /\bhave a (profound|significant|positive|negative|detrimental) (impact|effect) on\b/gi,
  /\bdraw(s|n)? a conclusion\b/gi,
  /\bgive(s)? rise to\b/gi,
  /\bin light of\b/gi,
  /\bshed(s)? light on\b/gi,
  /\ba wide range of\b/gi,
  /\ba significant (number|proportion) of\b/gi,
  /\bon the whole\b/gi,
  /\bfar outweigh(s)?\b/gi,
  /\bgive(s)? priority to\b/gi,
  /\bstrike(s)? a balance\b/gi,
  /\bbridge(s)? the gap\b/gi,
  /\ba double-edged sword\b/gi,
  /\bcontribut(e|es|ed) (significantly |greatly )?to\b/gi
];

const scoreCollocations = (text) => {
  if (!text || text.trim().length === 0) {
    return { band: 4, note: "No content to assess.", miscollocations: [], goodCollocations: 0 };
  }

  const miscollocationHits = [];
  COMMON_MISCOLLOCATIONS.forEach(({ pattern, fix }) => {
    const matches = text.match(pattern);
    if (matches) miscollocationHits.push({ found: matches[0], fix });
  });

  const goodCollocationCount = ACADEMIC_COLLOCATIONS.reduce(
    (count, pattern) => count + (text.match(pattern)?.length || 0),
    0
  );

  let band = 6;
  band += Math.min(goodCollocationCount, 4) * 0.3;
  band -= miscollocationHits.length * 0.4;
  band = roundToHalfBand(clampBand(band));

  let note;
  if (miscollocationHits.length > 0) {
    const examples = miscollocationHits.slice(0, 3).map(h => `"${h.found.trim()}" → ${h.fix}`).join("; ");
    note = `${miscollocationHits.length} unnatural word pairing(s) detected, e.g. ${examples}.`;
  } else if (goodCollocationCount > 0) {
    note = `Uses ${goodCollocationCount} natural academic collocation(s), which supports a higher lexical band.`;
  } else {
    note = "No strong collocation errors or standout academic collocations detected.";
  }

  return { band, note, miscollocations: miscollocationHits, goodCollocations: goodCollocationCount };
};

// ============================================================================
// NEW — SYNONYM VARIETY / PARAPHRASE SKILL
// ============================================================================
// Checks whether the candidate reuses the exact same word for a recurring
// concept, or varies it using near-synonyms — a key band 7+ discriminator.
const scoreSynonymVariety = (text) => {
  const lower = text.toLowerCase();
  let groupsUsed = 0;
  let groupsVaried = 0;
  const flatWords = [];

  SYNONYM_GROUPS.forEach(group => {
    const membersUsed = group.filter(w => new RegExp(`\\b${w}\\b`, "i").test(lower));
    if (membersUsed.length > 0) {
      groupsUsed++;
      if (membersUsed.length >= 2) groupsVaried++;
      else {
        // used, but always the same single word from the group — check repeat count
        const count = (lower.match(new RegExp(`\\b${membersUsed[0]}\\b`, "gi")) || []).length;
        if (count >= 3) flatWords.push(membersUsed[0]);
      }
    }
  });

  const varietyRatio = groupsUsed > 0 ? groupsVaried / groupsUsed : 0;

  let band;
  if (groupsUsed === 0) band = 6; // neutral — topic just didn't trigger tracked concepts
  else if (varietyRatio < 0.2) band = 5;
  else if (varietyRatio < 0.4) band = 6;
  else if (varietyRatio < 0.6) band = 7;
  else band = 8;

  let note;
  if (flatWords.length > 0) {
    note = `Repeats the same word (${flatWords.slice(0, 3).join(", ")}) multiple times where a synonym would show more range — e.g. alternate "increase" with "rise"/"grow", or "important" with "significant"/"crucial".`;
  } else if (groupsUsed === 0) {
    note = "Not enough recurring concepts detected to assess paraphrase/synonym variety.";
  } else {
    note = `Good paraphrase variety — ${groupsVaried}/${groupsUsed} recurring concept group(s) used more than one synonym.`;
  }

  return { band: roundToHalfBand(band), note, groupsUsed, groupsVaried };
};

// ============================================================================
// IDEA DEVELOPMENT DETECTION
// ============================================================================
const scoreIdeaDevelopment = (text) => {
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  if (paragraphs.length === 0) {
    return { band: 4, note: "No paragraphs to assess for idea development.", avgSentencesPerParagraph: 0, elaborationRatio: 0 };
  }

  const bodyParagraphs = paragraphs.length >= 3 ? paragraphs.slice(1, -1) : paragraphs;
  const paragraphsToScore = bodyParagraphs.length > 0 ? bodyParagraphs : paragraphs;

  const sentenceCounts = paragraphsToScore.map(p => splitSentences(p).length);
  const avgSentences = sentenceCounts.reduce((a, b) => a + b, 0) / sentenceCounts.length;

  const elaboratedCount = paragraphsToScore.filter(p => {
    const lower = p.toLowerCase();
    return ELABORATION_MARKERS.some(m => lower.includes(m));
  }).length;
  const elaborationRatio = elaboratedCount / paragraphsToScore.length;

  let lengthScore;
  if (avgSentences < 2) lengthScore = 4.5;
  else if (avgSentences < 3) lengthScore = 5.5;
  else if (avgSentences < 4) lengthScore = 6.5;
  else if (avgSentences < 5) lengthScore = 7.5;
  else lengthScore = 8;

  let elaborationScore;
  if (elaborationRatio < 0.3) elaborationScore = 4.5;
  else if (elaborationRatio < 0.6) elaborationScore = 6;
  else if (elaborationRatio < 0.9) elaborationScore = 7.5;
  else elaborationScore = 8.5;

  const band = roundToHalfBand((lengthScore + elaborationScore) / 2);

  let note;
  if (lengthScore <= 5.5 && elaborationScore <= 6) {
    note = "Ideas are underdeveloped — most paragraphs state a point without explaining it, giving a reason, or an example.";
  } else if (lengthScore <= 5.5) {
    note = "Paragraphs are quite short — try adding a sentence of explanation or an example after each main point.";
  } else if (elaborationScore <= 6) {
    note = "Points are reasonably long but often not explicitly linked to a reason or example — add phrases like 'this is because' or 'for example'.";
  } else {
    note = "Ideas are well extended with explanation and examples, not just stated.";
  }

  return { band, note, avgSentencesPerParagraph: Number(avgSentences.toFixed(1)), elaborationRatio: Number(elaborationRatio.toFixed(2)) };
};

// ============================================================================
// NEW — EXAMPLE QUALITY (Task 2 — feeds Task Achievement)
// ============================================================================
// Presence of "for example" is cheap to fake. This checks whether what
// FOLLOWS the marker is actually specific (numbers, named entities,
// concrete nouns) rather than another vague generalisation.
const scoreExampleQuality = (text) => {
  const lower = text.toLowerCase();
  const foundMarkers = EXAMPLE_MARKERS.filter(m => lower.includes(m));

  if (foundMarkers.length === 0) {
    return { band: 4.5, note: "No examples detected — support your points with specific, concrete examples.", exampleCount: 0, specificCount: 0 };
  }

  let specificCount = 0;
  foundMarkers.forEach(marker => {
    const idx = lower.indexOf(marker);
    const window = text.slice(idx, idx + 140);
    const hasNumber = /\d/.test(window);
    const hasProperNoun = /\b[A-Z][a-z]{2,}\b/.test(window.slice(marker.length));
    const hasConcreteNoun = /\b(company|country|study|report|survey|government|university|city|percent|per cent)\b/i.test(window);
    if (hasNumber || hasProperNoun || hasConcreteNoun) specificCount++;
  });

  const specificityRatio = specificCount / foundMarkers.length;

  let band;
  if (specificityRatio === 0) band = 5;
  else if (specificityRatio < 0.5) band = 6;
  else if (specificityRatio < 1) band = 7;
  else band = 8;

  const note = specificityRatio < 0.5
    ? `${foundMarkers.length} example marker(s) found, but most are followed by vague statements rather than concrete details (names, numbers, specific situations).`
    : `${specificCount}/${foundMarkers.length} example(s) include concrete, specific detail rather than generic statements.`;

  return { band: roundToHalfBand(band), note, exampleCount: foundMarkers.length, specificCount };
};

// ============================================================================
// NEW — POSITION CONSISTENCY (Task 2 — feeds Task Achievement)
// ============================================================================
// Checks that the stance stated early in the essay matches the stance
// in the conclusion. A response that agrees in the intro and disagrees
// in the conclusion (or hedges into "both sides are equally valid" after
// promising a clear position) loses Task Response marks in real IELTS.
const scorePositionConsistency = (text) => {
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) {
    return { band: 5, note: "No content to assess for position consistency.", consistent: null };
  }

  const introText = paragraphs[0].toLowerCase();
  const conclusionText = (paragraphs.length > 1 ? paragraphs[paragraphs.length - 1] : paragraphs[0]).toLowerCase();

  const stanceOf = (t) => {
    const agree = STANCE_AGREE_MARKERS.some(m => t.includes(m));
    const disagree = STANCE_DISAGREE_MARKERS.some(m => t.includes(m));
    if (agree && !disagree) return "agree";
    if (disagree && !agree) return "disagree";
    if (agree && disagree) return "mixed";
    return "none";
  };

  const introStance = stanceOf(introText);
  const conclusionStance = stanceOf(conclusionText);

  let band, note, consistent;

  if (introStance === "none" && conclusionStance === "none") {
    band = 5;
    note = "No clear, explicit position detected in the introduction or conclusion — state your opinion directly (e.g. 'I agree that...').";
    consistent = null;
  } else if (introStance === "none" || conclusionStance === "none") {
    band = 5.5;
    note = "A position is stated in only one part of the essay (introduction or conclusion, not both) — restate your position clearly in both.";
    consistent = null;
  } else if (introStance === conclusionStance && introStance !== "mixed") {
    band = 7.5;
    note = "Position is stated clearly and held consistently from introduction to conclusion.";
    consistent = true;
  } else {
    band = 4;
    note = "The position in the conclusion appears to contradict (or blur) the position stated in the introduction — keep your stance consistent throughout.";
    consistent = false;
  }

  return { band: roundToHalfBand(band), note, consistent };
};

// ============================================================================
// NEW — TOPIC SENTENCES (feeds Coherence & Cohesion)
// ============================================================================
// For each body paragraph, checks whether the first sentence shares
// enough content vocabulary with the rest of the paragraph to function
// as a genuine topic sentence (vs. an unrelated opener).
const scoreTopicSentences = (text) => {
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const body = paragraphs.length >= 3 ? paragraphs.slice(1, -1) : paragraphs;

  if (body.length === 0) {
    return { band: 5, note: "No body paragraphs to assess for topic sentences.", ratio: 0 };
  }

  let goodTopicSentences = 0;
  body.forEach(p => {
    const sentences = splitSentences(p);
    if (sentences.length < 2) return;
    const first = contentWordSet(sentences[0]);
    const rest = contentWordSet(sentences.slice(1).join(" "));
    if (jaccard(first, rest) > 0.08) goodTopicSentences++;
  });

  const ratio = goodTopicSentences / body.length;

  let band;
  if (ratio < 0.3) band = 5;
  else if (ratio < 0.6) band = 6.5;
  else band = 7.5;

  const note = ratio < 0.5
    ? "Some paragraphs don't open with a sentence that clearly signals what the paragraph is about — start each body paragraph with a sentence stating its main point."
    : "Most paragraphs open with a clear topic sentence that previews the paragraph's content.";

  return { band: roundToHalfBand(band), note, ratio: Number(ratio.toFixed(2)) };
};

// ============================================================================
// NEW — PARAGRAPH UNITY (feeds Coherence & Cohesion)
// ============================================================================
// Measures lexical cohesion WITHIN each paragraph (average sentence-to-
// sentence content-word overlap). A paragraph that drifts between
// unrelated ideas will show low overlap even if it uses linking words.
const scoreParagraphUnity = (text) => {
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) {
    return { band: 5, note: "No paragraphs to assess for unity.", avgOverlap: 0 };
  }

  const paragraphScores = paragraphs.map(p => {
    const sentences = splitSentences(p);
    if (sentences.length < 2) return null;
    let total = 0;
    let pairs = 0;
    for (let i = 0; i < sentences.length - 1; i++) {
      const a = contentWordSet(sentences[i]);
      const b = contentWordSet(sentences[i + 1]);
      total += jaccard(a, b);
      pairs++;
    }
    return pairs > 0 ? total / pairs : null;
  }).filter(s => s !== null);

  if (paragraphScores.length === 0) {
    return { band: 5, note: "Paragraphs too short (single sentence) to assess unity.", avgOverlap: 0 };
  }

  const avgOverlap = paragraphScores.reduce((a, b) => a + b, 0) / paragraphScores.length;

  let band;
  if (avgOverlap < 0.04) band = 5;
  else if (avgOverlap < 0.09) band = 6.5;
  else band = 7.5;

  const note = avgOverlap < 0.06
    ? "Sentences within paragraphs sometimes feel loosely connected — make sure every sentence in a paragraph clearly relates back to that paragraph's main idea."
    : "Sentences within each paragraph stay on-topic and connect well to each other.";

  return { band: roundToHalfBand(band), note, avgOverlap: Number(avgOverlap.toFixed(3)) };
};

// ============================================================================
// TASK 1-SPECIFIC ANALYSIS — process stages, key features, data grouping, trends
// ============================================================================
const scoreTask1Specific = (text, task) => {
  const lower = text.toLowerCase();
  const notes = [];
  let adjustment = 0;

  // --- Process stage detection (process diagrams) ---
  if (task.diagramType === "process") {
    const seqHits = PROCESS_SEQUENCING_MARKERS.filter(m => lower.includes(m)).length;
    const hasOpinion = OPINION_MARKERS.some(m => lower.includes(m));
    const passiveMatches = lower.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/g) || [];

    if (seqHits === 0) {
      adjustment -= 0.5;
      notes.push("No process sequencing language detected (first, then, next, after this, finally) — a process diagram needs clear stage markers.");
    } else if (seqHits >= 3) {
      adjustment += 0.5;
      notes.push("Good use of sequencing language to mark stages of the process.");
    }

    if (hasOpinion) {
      adjustment -= 1;
      notes.push("Personal opinion language detected — Task 1 is a factual report and should not include your opinion.");
    }

    if (passiveMatches.length >= 2) {
      adjustment += 0.3;
      notes.push("Good use of the passive voice, appropriate for describing a manufacturing process.");
    } else {
      notes.push("Consider using more passive voice (e.g. 'the clay is shaped') — it's standard for describing processes.");
    }
  }

  // --- Trend analysis (line/bar/mixed charts showing change over time) ---
  if (["line", "bar", "mixed"].includes(task.diagramType)) {
    const trendHits = TREND_MARKERS.filter(m => lower.includes(m)).length;
    if (trendHits === 0) {
      adjustment -= 0.5;
      notes.push("No trend/change language detected (increase, decrease, fluctuate, peak, steadily...) — describe how values change, not just their final state.");
    } else if (trendHits >= 4) {
      adjustment += 0.5;
      notes.push(`Good use of trend language (${trendHits} instance(s)) to describe how the data changes.`);
    }
  }

  // --- Key feature selection (applies to all Task 1 chart types) ---
  const keyFeatureHits = KEY_FEATURE_MARKERS.filter(m => lower.includes(m)).length;
  if (keyFeatureHits === 0) {
    adjustment -= 0.3;
    notes.push("No language highlighting standout/key features detected (highest, lowest, majority, notably...) — Task 1 should select and emphasise the MAIN features, not describe every data point equally.");
  } else {
    adjustment += 0.3;
    notes.push(`Highlights ${keyFeatureHits} standout feature(s) rather than listing all data points equally.`);
  }

  // --- Data grouping (comparing/contrasting categories) ---
  const groupingHits = DATA_GROUPING_MARKERS.filter(m => lower.includes(m)).length;
  if (groupingHits === 0) {
    adjustment -= 0.2;
    notes.push("Little evidence of grouping similar data points together (e.g. 'both X and Y', 'unlike Z') — grouping related figures makes the report more analytical than a simple list.");
  } else {
    adjustment += 0.2;
    notes.push("Groups related data points together rather than listing them one by one.");
  }

  return {
    adjustment,
    note: notes.join(" "),
    keyFeatures: keyFeatureHits,
    dataGrouping: groupingHits
  };
};

// ============================================================================
// LLM / SEMANTIC SCORING — primary signal for all four criteria, now also
// requesting richer sub-feedback (idea development, example quality,
// position consistency, topic sentences, paragraph unity) for display.
// ============================================================================
const SEMANTIC_TIMEOUT_MS = 15000;

const scoreSemanticWithLLM = async (text, task, apiUrl) => {
  if (!text || text.trim().length < 20) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SEMANTIC_TIMEOUT_MS);

  try {
    const res = await fetch(`${apiUrl}/score/semantic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ essay: text, prompt: task.prompt, taskType: task.id }),
      signal: controller.signal
    });

    if (!res.ok) throw new Error(`Semantic scoring endpoint responded ${res.status}`);

    const data = await res.json();

    for (const key of ["taskAchievement", "coherence", "lexical", "grammar"]) {
      if (typeof data?.[key]?.band !== "number") {
        throw new Error(`Malformed semantic scoring response: missing ${key}.band`);
      }
    }

    return {
      taskAchievement: {
        band: roundToHalfBand(clampBand(data.taskAchievement.band)),
        note: data.taskAchievement.note || "Content/argument quality assessed automatically.",
        offTopic: !!data.taskAchievement.offTopic,
        positionConsistency: data.taskAchievement.positionConsistency || null,
        exampleQuality: data.taskAchievement.exampleQuality || null,
        ideaDevelopment: data.taskAchievement.ideaDevelopment || null
      },
      coherence: {
        band: roundToHalfBand(clampBand(data.coherence.band)),
        note: data.coherence.note || "Logical flow assessed automatically.",
        topicSentences: data.coherence.topicSentences || null,
        paragraphUnity: data.coherence.paragraphUnity || null
      },
      lexical: {
        band: roundToHalfBand(clampBand(data.lexical.band)),
        note: data.lexical.note || "Vocabulary range and precision assessed automatically.",
        synonymVariety: data.lexical.synonymVariety || null
      },
      grammar: {
        band: roundToHalfBand(clampBand(data.grammar.band)),
        note: data.grammar.note || "Grammatical range assessed automatically.",
        grammarRange: data.grammar.grammarRange || null
      },
      overallImpression: data.overallImpression || "",
      source: "llm"
    };
  } catch (err) {
    console.error("Semantic/LLM scoring unavailable, falling back to regex-based signals only", err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

// ============================================================================
// ORIGINALITY: template-match check + embedding-based plagiarism check
// ============================================================================
// Two related but distinct checks, both backed by embedding similarity
// against different corpora:
//  - Template check: compares against known prep-book "model essay" corpus.
//  - Plagiarism check: compares against a broader corpus (web sources,
//    other candidates' past submissions) to catch essays lifted from
//    somewhere other than a known template bank.
// Both fail open (return null) so neither can block submission.
const TEMPLATE_SIMILARITY_THRESHOLD = 0.90;
const PLAGIARISM_SIMILARITY_THRESHOLD = 0.85;

const checkTemplateSimilarity = async (text, apiUrl) => {
  if (!text || text.trim().length < 40) return null;
  try {
    const res = await fetch(`${apiUrl}/score/template-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ essay: text })
    });
    if (!res.ok) throw new Error(`Template-check endpoint responded ${res.status}`);
    const data = await res.json();
    if (typeof data?.similarity !== "number") throw new Error("Malformed template-check response");
    return {
      isTemplate: !!data.isTemplate || data.similarity >= TEMPLATE_SIMILARITY_THRESHOLD,
      similarity: data.similarity,
      matchedSource: data.matchedSource || null
    };
  } catch (err) {
    console.warn("Template-similarity check unavailable, skipping", err);
    return null;
  }
};

const checkEmbeddingPlagiarism = async (text, apiUrl) => {
  if (!text || text.trim().length < 40) return null;
  try {
    const res = await fetch(`${apiUrl}/score/plagiarism-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ essay: text })
    });
    if (!res.ok) throw new Error(`Plagiarism-check endpoint responded ${res.status}`);
    const data = await res.json();
    if (typeof data?.similarity !== "number") throw new Error("Malformed plagiarism-check response");
    return {
      isPlagiarized: !!data.isPlagiarized || data.similarity >= PLAGIARISM_SIMILARITY_THRESHOLD,
      similarity: data.similarity,
      matchedSource: data.matchedSource || null
    };
  } catch (err) {
    console.warn("Embedding-based plagiarism check unavailable, skipping", err);
    return null;
  }
};

// ============================================================================
// HUMAN-SCORED CALIBRATION HOOK
// ============================================================================
const fetchScoringCalibration = async (apiUrl) => {
  try {
    const res = await fetch(`${apiUrl}/scoring/calibration`);
    if (!res.ok) throw new Error(`Calibration endpoint responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("No scoring calibration available, using raw auto-scores", err);
    return null;
  }
};

const applyCalibrationOffset = (band, offset) => {
  if (!offset) return band;
  return roundToHalfBand(clampBand(band + offset));
};

// ============================================================================
// NEW — CONFIDENCE SCORE
// ============================================================================
// A meta-signal telling the user (and your product analytics) how much
// to trust a given auto-score. Higher when: the LLM was available, the
// LLM and the rule-based signals broadly agree, LanguageTool succeeded,
// the essay meets the minimum word count, and no originality flags fired
// (originality flags don't lower confidence in the SCORE itself, but a
// flagged essay is inherently a less "normal" case, so it's weighted in).
const computeConfidence = ({ semantic, taBase, ccBase, lrBase, graFallback, grammarSource, wordCount, minWords, copied, template, plagiarism }) => {
  let points = 0;
  const maxPoints = 100;
  const reasons = [];

  if (semantic) {
    points += 35;
    reasons.push("AI examiner scoring available");
  } else {
    reasons.push("AI examiner unavailable — relying on rule-based heuristics only");
  }

  if (grammarSource === "languagetool" || (grammarSource || "").startsWith("llm+languagetool")) {
    points += 20;
    reasons.push("Real grammar error-checking succeeded");
  } else {
    reasons.push("Grammar checking fell back to a rough estimate");
  }

  if (semantic) {
    const diffs = [
      Math.abs(semantic.taskAchievement.band - taBase.band),
      Math.abs(semantic.coherence.band - ccBase.band),
      Math.abs(semantic.lexical.band - lrBase.band),
      Math.abs(semantic.grammar.band - graFallback.band)
    ];
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    if (avgDiff <= 0.75) { points += 25; reasons.push("AI and rule-based scores largely agree"); }
    else if (avgDiff <= 1.5) { points += 12; reasons.push("AI and rule-based scores show some disagreement"); }
    else { reasons.push("AI and rule-based scores disagree significantly"); }
  } else {
    points += 10; // small credit since heuristics are internally consistent
  }

  if (wordCount >= minWords) { points += 10; reasons.push("Meets minimum word count"); }
  else { reasons.push("Below minimum word count — score is less reliable at this length"); }

  if (copied || template?.isTemplate || plagiarism?.isPlagiarized) {
    points = Math.min(points, 40);
    reasons.push("Originality flag reduces confidence in a standard band interpretation");
  } else {
    points += 10;
  }

  const pct = Math.max(5, Math.min(100, Math.round((points / maxPoints) * 100)));
  const label = pct >= 80 ? "High" : pct >= 50 ? "Medium" : "Low";

  return { pct, label, reasons };
};

export default function IeltsWriting() {

  const navigate = useNavigate();

  const [activeTask, setActiveTask] = useState(0);
  const [responses, setResponses] = useState({ task1: "", task2: "" });
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [writingScore, setWritingScore] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [copyWarnings, setCopyWarnings] = useState({ task1: false, task2: false });
  const [templateWarnings, setTemplateWarnings] = useState({ task1: null, task2: null });
  const [plagiarismWarnings, setPlagiarismWarnings] = useState({ task1: null, task2: null });
  const [offTopicWarnings, setOffTopicWarnings] = useState({ task1: false, task2: false });
  const [taskDetails, setTaskDetails] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const [saveStatus, setSaveStatus] = useState("idle");
  const [wasAutoSubmitted, setWasAutoSubmitted] = useState(false);
  const [grammarSource, setGrammarSource] = useState(null);
  const [semanticAvailable, setSemanticAvailable] = useState(false);
  const [calibrationApplied, setCalibrationApplied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);

  const API_URL = getApiBaseUrl();

  const latestRef = useRef({ activeTask, responses, submitted });
  useEffect(() => {
    latestRef.current = { activeTask, responses, submitted };
  }, [activeTask, responses, submitted]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            const { responses: currentResponses, submitted: alreadySubmitted } = latestRef.current;
            if (!alreadySubmitted) {
              setWasAutoSubmitted(true);
              finalizeAndSave(currentResponses, { force: true });
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const currentTask = IELTS_DATA_WRITING.tasks[activeTask];
  const wordCount = getWordCount(responses[currentTask.id] || "");

  // ---------- CRITERION 1: TASK ACHIEVEMENT / RESPONSE (fallback signal) ----------
  const scoreTaskAchievement = (text, task) => {
    const words = getWordCount(text);
    const lower = text.toLowerCase();

    let lengthScore;
    if (words < task.minWords * 0.6) lengthScore = 4;
    else if (words < task.minWords * 0.8) lengthScore = 5;
    else if (words < task.minWords) lengthScore = 5.5;
    else if (words < task.minWords * 1.6) lengthScore = 7;
    else lengthScore = 6.5;

    const hits = task.keywords.filter(k => lower.includes(k)).length;
    const relevance = hits / task.keywords.length;
    let relevanceScore;
    if (relevance < 0.2) relevanceScore = 4;
    else if (relevance < 0.4) relevanceScore = 5;
    else if (relevance < 0.6) relevanceScore = 6;
    else if (relevance < 0.8) relevanceScore = 7;
    else relevanceScore = 8;

    let structureScore, structureNote;

    if (task.id === "task1") {
      const hasOverview = OVERVIEW_MARKERS.some(m => lower.includes(m));
      const hasComparison = COMPARISON_MARKERS.some(m => lower.includes(m));
      const hasData = /\d/.test(text) || lower.includes("per cent") || lower.includes("percent");
      const featuresPresent = [hasOverview, hasComparison, hasData].filter(Boolean).length;
      structureScore = featuresPresent === 3 ? 8 : featuresPresent === 2 ? 6.5 : featuresPresent === 1 ? 5 : 4;
      structureNote = !hasOverview
        ? "No clear overview statement detected — Task 1 needs one sentence summarising the main trend before the details."
        : !hasComparison
        ? "Few comparisons detected — contrast the data points, don't just list them."
        : "Includes an overview and comparisons, as required for Task 1.";
    } else {
      const hasPosition = OPINION_MARKERS.some(m => lower.includes(m));
      const hasExamples = EXAMPLE_MARKERS.some(m => lower.includes(m));
      const hasConclusion = CONCLUSION_MARKERS.some(m => lower.includes(m));
      const featuresPresent = [hasPosition, hasExamples, hasConclusion].filter(Boolean).length;
      structureScore = featuresPresent === 3 ? 8 : featuresPresent === 2 ? 6.5 : featuresPresent === 1 ? 5 : 4;
      structureNote = !hasPosition
        ? "No clear position detected — state your opinion explicitly and keep it consistent throughout."
        : !hasExamples
        ? "Few concrete examples detected — support your ideas with specific examples."
        : !hasConclusion
        ? "No conclusion detected — end with a clear closing statement."
        : "Clear position, examples, and conclusion all present.";
    }

    const band = roundToHalfBand((lengthScore + relevanceScore + structureScore) / 3);
    return { band, note: `${relevance < 0.4 ? "Response may not fully address the prompt topic. " : ""}${structureNote}` };
  };

  // ---------- CRITERION 2: COHERENCE & COHESION (fallback signal) ----------
  const scoreCoherence = (text) => {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const lower = text.toLowerCase();

    const linkerCounts = LINKING_WORDS.map(w => {
      const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      return { word: w, count: (lower.match(re) || []).length };
    }).filter(l => l.count > 0);

    const distinctLinkers = linkerCounts.length;
    const maxSingleUse = linkerCounts.reduce((max, l) => Math.max(max, l.count), 0);
    const isMechanical = maxSingleUse >= 4 && distinctLinkers <= 2;

    let paragraphScore;
    if (paragraphs.length <= 1) paragraphScore = 4;
    else if (paragraphs.length === 2) paragraphScore = 5.5;
    else if (paragraphs.length >= 3 && paragraphs.length <= 5) paragraphScore = 7.5;
    else paragraphScore = 6.5;

    let linkerScore;
    if (distinctLinkers === 0) linkerScore = 4.5;
    else if (distinctLinkers <= 2) linkerScore = 6;
    else if (distinctLinkers <= 5) linkerScore = 7.5;
    else linkerScore = 6;
    if (isMechanical) linkerScore = Math.max(4.5, linkerScore - 1.5);

    const hasReferencing = REFERENCING_MARKERS.some(m => lower.includes(m));
    const referencingScore = hasReferencing ? 7 : 5.5;

    const band = roundToHalfBand((paragraphScore + linkerScore + referencingScore) / 3);
    return {
      band,
      note: isMechanical
        ? "Cohesive devices are overused/repetitive — vary your linking words instead of reusing the same one."
        : distinctLinkers === 0
        ? "Consider using linking words (however, therefore, furthermore) to connect ideas."
        : !hasReferencing
        ? "Good linking words, but try referencing earlier ideas too (e.g. 'this shows', 'these factors')."
        : "Good use of paragraphing, varied linking words, and referencing."
    };
  };

  // ---------- CRITERION 3: LEXICAL RESOURCE (fallback signal) ----------
  const scoreLexical = (text) => {
    const words = text.toLowerCase().match(/[a-z']+/g) || [];
    if (words.length === 0) return { band: 4, note: "No content to assess." };

    const contentWords = words.filter(w => !STOPWORDS.has(w));
    const uniqueWords = new Set(contentWords);
    const typeTokenRatio = uniqueWords.size / words.length;
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;

    const freq = {};
    contentWords.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const maxFreq = Object.values(freq).length ? Math.max(...Object.values(freq)) : 0;
    const repetitionRatio = contentWords.length ? maxFreq / contentWords.length : 0;
    const advancedWordRatio = words.filter(w => w.length >= 8).length / words.length;

    let diversityScore;
    if (typeTokenRatio < 0.35) diversityScore = 4.5;
    else if (typeTokenRatio < 0.45) diversityScore = 5.5;
    else if (typeTokenRatio < 0.55) diversityScore = 6.5;
    else if (typeTokenRatio < 0.65) diversityScore = 7.5;
    else diversityScore = 8;

    let complexityScore;
    if (avgWordLength < 3.8) complexityScore = 5;
    else if (avgWordLength < 4.3) complexityScore = 6;
    else if (avgWordLength < 4.8) complexityScore = 7;
    else complexityScore = 7.5;

    let precisionScore;
    if (advancedWordRatio < 0.05) precisionScore = 5;
    else if (advancedWordRatio < 0.10) precisionScore = 6.5;
    else if (advancedWordRatio < 0.16) precisionScore = 7.5;
    else precisionScore = 8;
    if (repetitionRatio > 0.08) precisionScore = Math.max(4.5, precisionScore - 1.5);

    const band = roundToHalfBand((diversityScore + complexityScore + precisionScore) / 3);
    return {
      band,
      note: repetitionRatio > 0.08
        ? "Noticeable repetition of the same word(s) — try paraphrasing instead of reusing key terms."
        : typeTokenRatio < 0.45
        ? "Try varying vocabulary more — avoid repeating the same words."
        : "Reasonable vocabulary range detected.",
      repetitionRatio: Number(repetitionRatio.toFixed(3))
    };
  };

  // Per-task overall band.
  const scoreEssay = async (text, task) => {
    const copyRatioOwn = getCopyRatio(text, task.prompt);
    const copyRatioAny = getCopyRatio(text, ALL_PROMPTS_TEXT);
    const copyRatio = Math.max(copyRatioOwn, copyRatioAny);

    if (copyRatio >= 0.5) {
      const note = "This response is copied from the task prompt/question rather than being original writing. Copied or memorised answers are not creditable under real IELTS marking rules.";
      return {
        overall: 1,
        taskAchievement: { band: 1, note, offTopic: false },
        coherence: { band: 1, note },
        lexical: { band: 1, note },
        grammar: { band: 1, note, source: "n/a" },
        copied: true,
        template: null,
        plagiarism: null,
        confidence: { pct: 95, label: "High", reasons: ["Exact copy of the prompt — trivially confident this is not creditable"] }
      };
    }

    // ---- Fallback/supplementary heuristic signals (fast, synchronous) ----
    const taBase = scoreTaskAchievement(text, task);
    const ccBase = scoreCoherence(text);
    const lrBase = scoreLexical(text);
    const collocation = scoreCollocations(text);
    const ideaDev = scoreIdeaDevelopment(text);
    const synonymVariety = scoreSynonymVariety(text);
    const grammarRange = scoreGrammarRange(text);
    const complexSentences = scoreComplexSentenceRatio(text);
    const topicSentences = scoreTopicSentences(text);
    const paragraphUnity = scoreParagraphUnity(text);

    let exampleQuality = null;
    let positionConsistency = null;
    if (task.id === "task2") {
      exampleQuality = scoreExampleQuality(text);
      positionConsistency = scorePositionConsistency(text);
    }

    let task1Note = "";
    let task1Adjustment = 0;
    let task1Details = null;
    if (task.id === "task1") {
      const task1Result = scoreTask1Specific(text, task);
      task1Adjustment = task1Result.adjustment;
      task1Note = task1Result.note;
      task1Details = task1Result;
      taBase.band = roundToHalfBand(clampBand(taBase.band + task1Result.adjustment));
    }

    // ---- Independent async calls, all in parallel ----
    const [ltMatches, semantic, templateResult, plagiarismResult] = await Promise.all([
      checkGrammarWithLanguageTool(text),
      scoreSemanticWithLLM(text, task, API_URL),
      checkTemplateSimilarity(text, API_URL),
      checkEmbeddingPlagiarism(text, API_URL)
    ]);

    const graFallback = ltMatches !== null
      ? scoreGrammarFromLanguageTool(ltMatches, text, getWordCount)
      : scoreGrammarHeuristic(text);

    // ---- Blend each criterion: LLM-dominant when available, else fallback ----
    let ta, cc, lr, gra;

    if (semantic) {
      // Task Achievement: LLM + regex relevance + idea development +
      // (Task 2 only) example quality & position consistency + (Task 1
      // only) key-feature/grouping/trend/stage adjustment.
      let taSupportBand = (taBase.band + ideaDev.band) / 2;
      let supportWeight = 0.3;
      const extraNotes = [];

      if (task.id === "task2") {
        taSupportBand = (taSupportBand + exampleQuality.band + positionConsistency.band) / 3;
        extraNotes.push(exampleQuality.note, positionConsistency.note);
      }

      const taBlended = roundToHalfBand(clampBand(
        semantic.taskAchievement.band * (1 - supportWeight) +
        taSupportBand * supportWeight +
        (task.id === "task1" ? task1Adjustment * 0.5 : 0)
      ));

      ta = {
        band: taBlended,
        note: `${semantic.taskAchievement.note} ${task1Note}`.trim(),
        offTopic: semantic.taskAchievement.offTopic,
        ideaDevelopment: ideaDev,
        exampleQuality,
        positionConsistency,
        task1Specific: task1Note,
        task1Details,
        semantic: semantic.taskAchievement,
        supportingNotes: extraNotes
      };

      cc = {
        band: roundToHalfBand(clampBand(
          semantic.coherence.band * 0.6 + ccBase.band * 0.15 + topicSentences.band * 0.125 + paragraphUnity.band * 0.125
        )),
        note: semantic.coherence.note,
        heuristicNote: ccBase.note,
        topicSentences,
        paragraphUnity
      };

      lr = {
        band: roundToHalfBand(clampBand(
          semantic.lexical.band * 0.55 + lrBase.band * 0.15 + collocation.band * 0.15 + synonymVariety.band * 0.15
        )),
        note: semantic.lexical.note,
        collocation,
        synonymVariety,
        repetitionRatio: lrBase.repetitionRatio
      };

      gra = {
        band: roundToHalfBand(clampBand(
          semantic.grammar.band * 0.5 + graFallback.band * 0.25 + grammarRange.band * 0.15 + complexSentences.band * 0.1
        )),
        note: `${semantic.grammar.note} ${graFallback.note}`,
        source: `llm+${graFallback.source}`,
        grammarRange,
        complexSentences
      };
    } else {
      // No LLM available — pure rule-based pipeline, all new signals
      // still contribute so the fallback path is meaningfully better
      // than before, not just the old four-criterion heuristic.
      let taBand = (taBase.band * 0.5 + ideaDev.band * 0.3);
      let taWeightUsed = 0.8;
      const extraNotes = [];
      if (task.id === "task2") {
        taBand += exampleQuality.band * 0.1 + positionConsistency.band * 0.1;
        taWeightUsed = 1.0;
        extraNotes.push(exampleQuality.note, positionConsistency.note);
      } else {
        taBand = taBand / taWeightUsed; // renormalize since task1 doesn't use the extra 0.2
      }

      ta = {
        band: roundToHalfBand(clampBand(taBand)),
        note: `${taBase.note}${task1Note ? " " + task1Note : ""}`,
        offTopic: false,
        ideaDevelopment: ideaDev,
        exampleQuality,
        positionConsistency,
        task1Specific: task1Note,
        task1Details,
        semantic: null,
        supportingNotes: extraNotes
      };

      cc = {
        band: roundToHalfBand(clampBand(ccBase.band * 0.6 + topicSentences.band * 0.2 + paragraphUnity.band * 0.2)),
        note: ccBase.note,
        topicSentences,
        paragraphUnity
      };

      lr = {
        band: roundToHalfBand(clampBand(lrBase.band * 0.5 + collocation.band * 0.3 + synonymVariety.band * 0.2)),
        note: lrBase.note,
        collocation,
        synonymVariety,
        repetitionRatio: lrBase.repetitionRatio
      };

      gra = {
        band: roundToHalfBand(clampBand(graFallback.band * 0.6 + grammarRange.band * 0.25 + complexSentences.band * 0.15)),
        note: `${graFallback.note} ${grammarRange.note}`,
        source: graFallback.source,
        grammarRange,
        complexSentences
      };
    }

    if (ta.offTopic) {
      ta.band = Math.min(ta.band, 3.5);
      ta.note = `This response does not appear to address the task prompt. ${ta.note}`;
    }

    if (copyRatio >= 0.2) {
      ta.band = Math.max(1, roundToHalfBand(ta.band - 3));
      ta.note = "Significant portions of this response are copied from the prompt — this substantially limits Task Achievement even though some original writing is present.";
    }

    if (templateResult?.isTemplate) {
      ta.band = Math.max(1, roundToHalfBand(ta.band - 2.5));
      ta.note = `This response closely matches a known template/model essay pattern (similarity ${(templateResult.similarity * 100).toFixed(0)}%). ${ta.note}`;
    }

    if (plagiarismResult?.isPlagiarized) {
      ta.band = Math.max(1, roundToHalfBand(ta.band - 2.5));
      ta.note = `This response closely matches other existing text found via similarity search (similarity ${(plagiarismResult.similarity * 100).toFixed(0)}%). ${ta.note}`;
    }

    const overall = roundOverallBand((ta.band + cc.band + lr.band + gra.band) / 4);

    const conf = computeConfidence({
      semantic, taBase, ccBase, lrBase, graFallback,
      grammarSource: gra.source, wordCount: getWordCount(text), minWords: task.minWords,
      copied: false, template: templateResult, plagiarism: plagiarismResult
    });

    return {
      overall,
      taskAchievement: ta,
      coherence: cc,
      lexical: lr,
      grammar: gra,
      copied: false,
      template: templateResult,
      plagiarism: plagiarismResult,
      confidence: conf
    };
  };

  const finalizeAndSave = async (responsesSnapshot, { force = false } = {}) => {
    if (latestRef.current.submitted) return;

    const words1 = getWordCount(responsesSnapshot.task1);
    const words2 = getWordCount(responsesSnapshot.task2);

    if (!force && (words1 < 20 || words2 < 20)) {
      alert("Please complete both tasks before submitting the test.");
      return;
    }

    setSaveStatus("scoring");

    const [result1, result2, calibration] = await Promise.all([
      scoreEssay(responsesSnapshot.task1 || "", IELTS_DATA_WRITING.tasks[0]),
      scoreEssay(responsesSnapshot.task2 || "", IELTS_DATA_WRITING.tasks[1]),
      fetchScoringCalibration(API_URL)
    ]);

    setCopyWarnings({ task1: !!result1.copied, task2: !!result2.copied });
    setTemplateWarnings({ task1: result1.template, task2: result2.template });
    setPlagiarismWarnings({ task1: result1.plagiarism, task2: result2.plagiarism });
    setOffTopicWarnings({
      task1: !!result1.taskAchievement?.offTopic,
      task2: !!result2.taskAchievement?.offTopic
    });
    setTaskDetails({ task1: result1, task2: result2 });

    const anySemantic = !!(result1.taskAchievement?.semantic || result2.taskAchievement?.semantic);
    setSemanticAvailable(anySemantic);

    const sources = [result1.grammar.source, result2.grammar.source].filter(s => s && s !== "n/a");
    const isFallback = (s) => s === "heuristic";
    if (sources.length === 0) setGrammarSource(null);
    else if (sources.every(isFallback)) setGrammarSource("heuristic");
    else if (sources.every(s => !isFallback(s))) setGrammarSource("languagetool");
    else setGrammarSource("mixed");

    // Combined confidence: weighted the same way as the overall band (Task 2 x2)
    const combinedConfidencePct = Math.round((result1.confidence.pct + 2 * result2.confidence.pct) / 3);
    const combinedConfidenceLabel = combinedConfidencePct >= 80 ? "High" : combinedConfidencePct >= 50 ? "Medium" : "Low";
    setConfidence({
      pct: combinedConfidencePct,
      label: combinedConfidenceLabel,
      task1: result1.confidence,
      task2: result2.confidence
    });

    let combined = {
      taskAchievement: roundToHalfBand((result1.taskAchievement.band + 2 * result2.taskAchievement.band) / 3),
      coherence: roundToHalfBand((result1.coherence.band + 2 * result2.coherence.band) / 3),
      lexical: roundToHalfBand((result1.lexical.band + 2 * result2.lexical.band) / 3),
      grammar: roundToHalfBand((result1.grammar.band + 2 * result2.grammar.band) / 3)
    };

    if (calibration) {
      combined = {
        taskAchievement: applyCalibrationOffset(combined.taskAchievement, calibration.taOffset),
        coherence: applyCalibrationOffset(combined.coherence, calibration.ccOffset),
        lexical: applyCalibrationOffset(combined.lexical, calibration.lrOffset),
        grammar: applyCalibrationOffset(combined.grammar, calibration.graOffset)
      };
      setCalibrationApplied(true);
    } else {
      setCalibrationApplied(false);
    }

    const finalScore = roundOverallBand(
      (combined.taskAchievement + combined.coherence + combined.lexical + combined.grammar) / 4
    );

    setWritingScore(finalScore);
    setBreakdown(combined);
    setSubmitted(true);

    const token = localStorage.getItem("token");
    if (!token) { setSaveStatus("no-auth"); return; }

    setSaveStatus("saving");

    try {
      const res = await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          testName: "IELTS Writing",
          result: {
            score: finalScore,
            task1Band: result1.overall,
            task2Band: result2.overall,
            breakdown: combined,
            confidence: combinedConfidencePct,
            copied: { task1: !!result1.copied, task2: !!result2.copied },
            template: { task1: result1.template?.isTemplate || false, task2: result2.template?.isTemplate || false },
            plagiarism: { task1: result1.plagiarism?.isPlagiarized || false, task2: result2.plagiarism?.isPlagiarized || false },
            offTopic: { task1: !!result1.taskAchievement?.offTopic, task2: !!result2.taskAchievement?.offTopic },
            essayTask1: responsesSnapshot.task1,
            essayTask2: responsesSnapshot.task2,
            wordCountTask1: words1,
            wordCountTask2: words2,
            usedSemanticScoring: anySemantic,
            calibrationApplied: !!calibration
          }
        })
      });

      if (!res.ok) throw new Error(`Save failed with status ${res.status}`);
      setSaveStatus("saved");
    } catch (err) {
      console.error("Save failed", err);
      setSaveStatus("error");
    }
  };

  const handleManualSubmit = () => {
    if (submitted) return;
    if (activeTask === 0) { setActiveTask(1); return; }
    finalizeAndSave(responses, { force: false });
  };

  const retrySave = () => {
    finalizeAndSave(responses, { force: true });
    setSubmitted(false);
  };

  const isScoring = saveStatus === "scoring";

  return (
    <div className="ielts-container">

      {isScoring && !submitted && (
        <div style={{
          maxWidth: "650px", margin: "0 auto 30px auto", background: "#f0fdf4",
          border: "1px solid #bbf7d0", borderRadius: "16px", padding: "20px 30px",
          textAlign: "center", color: "#166534", fontWeight: 600
        }}>
          Analyzing your writing with our IELTS examiner model — checking content, logical flow, vocabulary, and grammar…
        </div>
      )}

      {submitted && (
        <div style={{
          maxWidth: "650px", margin: "0 auto 30px auto", background: "#ffffff",
          border: "1px solid #bbf7d0", borderRadius: "16px", padding: "30px",
          textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}>

          <div style={{ fontSize: "40px", marginBottom: "10px" }}>
            {copyWarnings.task1 || copyWarnings.task2 ? "🚫" : "🎉"}
          </div>

          <h2 style={{ fontSize: "36px", color: "#16a34a", marginBottom: "4px", fontWeight: "bold" }}>
            Band {writingScore}/9
          </h2>

          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "8px" }}>
            Task 2 counts twice as much as Task 1 toward your final band, as in the real IELTS exam.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
            <Badge active={semanticAvailable} activeText="AI examiner scoring used" inactiveText="AI examiner unavailable (rule-based fallback)" />
            <Badge active={calibrationApplied} activeText="Calibrated against human scores" inactiveText="No human-score calibration available" />
          </div>

          {confidence && (
            <div style={{ marginBottom: "16px" }}>
              <button
                onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "0.75rem", fontWeight: 700, padding: "5px 12px", borderRadius: "999px",
                  border: "1px solid #e5e7eb", background: "#f9fafb", color: "#374151", cursor: "pointer"
                }}
              >
                <FiInfo /> Confidence: {confidence.label} ({confidence.pct}%)
              </button>

              {showConfidenceDetails && (
                <div style={{ textAlign: "left", maxWidth: "450px", margin: "10px auto 0 auto", fontSize: "0.75rem", color: "#6b7280", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 14px" }}>
                  This reflects how much to trust this specific auto-score (not your writing ability). Task 1: {confidence.task1?.reasons?.join("; ")}. Task 2: {confidence.task2?.reasons?.join("; ")}.
                </div>
              )}
            </div>
          )}

          {!semanticAvailable && (
            <Notice text="Our AI examiner model was unavailable for this attempt, so scoring relied on rule-based checks only, which are less accurate at judging argument quality, logical flow, and off-topic responses." />
          )}

          {grammarSource === "heuristic" && (
            <Notice text="Automated grammar checking was unavailable, so the Grammatical Range & Accuracy band is a rough estimate rather than a real error check." />
          )}
          {grammarSource === "mixed" && (
            <Notice text="Automated grammar checking succeeded for one task but not the other, so the Grammatical Range & Accuracy band is partly a rough estimate." />
          )}

          {(offTopicWarnings.task1 || offTopicWarnings.task2) && (
            <WarningBox>
              {offTopicWarnings.task1 && offTopicWarnings.task2
                ? "Both responses appear to be off-topic relative to their task prompts."
                : offTopicWarnings.task1
                ? "Your Task 1 response appears to be off-topic relative to the prompt."
                : "Your Task 2 response appears to be off-topic relative to the prompt."}
              {" "}This substantially limits the Task Achievement band regardless of writing quality.
            </WarningBox>
          )}

          {(templateWarnings.task1?.isTemplate || templateWarnings.task2?.isTemplate) && (
            <Notice text={
              (templateWarnings.task1?.isTemplate && templateWarnings.task2?.isTemplate
                ? "Both responses closely match known template/model essays"
                : templateWarnings.task1?.isTemplate
                ? "Your Task 1 response closely matches a known template/model essay"
                : "Your Task 2 response closely matches a known template/model essay") +
              " rather than appearing to be original writing for this specific prompt. This limits your Task Achievement band."
            } />
          )}

          {(plagiarismWarnings.task1?.isPlagiarized || plagiarismWarnings.task2?.isPlagiarized) && (
            <WarningBox>
              {plagiarismWarnings.task1?.isPlagiarized && plagiarismWarnings.task2?.isPlagiarized
                ? "Both responses closely match other existing text found via similarity search."
                : plagiarismWarnings.task1?.isPlagiarized
                ? "Your Task 1 response closely matches other existing text found via similarity search."
                : "Your Task 2 response closely matches other existing text found via similarity search."}
              {" "}This substantially limits Task Achievement.
            </WarningBox>
          )}

          {(copyWarnings.task1 || copyWarnings.task2) && (
            <WarningBox>
              {copyWarnings.task1 && copyWarnings.task2
                ? "Both responses appear to be copied from the task prompts rather than original writing."
                : copyWarnings.task1
                ? "Your Task 1 response appears to be copied from the task prompt rather than original writing."
                : "Your Task 2 response appears to be copied from the task prompt rather than original writing."}
              {" "}Copied or memorised text isn't creditable under real IELTS rules, so this score reflects that.
            </WarningBox>
          )}

          {wasAutoSubmitted && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
              background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412",
              borderRadius: "8px", padding: "10px 14px", fontSize: "0.85rem", marginBottom: "16px"
            }}>
              <FiAlertTriangle /> Time ran out — this was auto-submitted with whatever you had written.
            </div>
          )}

          {saveStatus === "saving" && <p style={{ color: "#6b7280", marginBottom: "20px" }}>Saving your result…</p>}
          {saveStatus === "saved" && <p style={{ color: "#374151", marginBottom: "20px" }}>Your writing test has been successfully saved.</p>}

          {saveStatus === "no-auth" && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "12px 16px", fontSize: "0.85rem", marginBottom: "20px", textAlign: "left" }}>
              ⚠️ You're not logged in, so this score was <strong>not</strong> saved to your profile. Log in and retake the test to keep a record of it.
            </div>
          )}

          {saveStatus === "error" && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "12px 16px", fontSize: "0.85rem", marginBottom: "20px", textAlign: "left" }}>
              ⚠️ We calculated your score, but saving it to your profile failed (network or server error).
              <div style={{ marginTop: "10px" }}>
                <button onClick={retrySave} style={{ background: "#dc2626", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem" }}>
                  Retry Save
                </button>
              </div>
            </div>
          )}

          {breakdown && (
            <div style={{ textAlign: "left", margin: "0 auto 10px auto", maxWidth: "450px" }}>
              <BreakdownRow label="Task Achievement" value={breakdown.taskAchievement} />
              <BreakdownRow label="Coherence & Cohesion" value={breakdown.coherence} />
              <BreakdownRow label="Lexical Resource" value={breakdown.lexical} />
              <BreakdownRow label="Grammatical Range & Accuracy" value={breakdown.grammar} />
            </div>
          )}

          {taskDetails && (
            <div style={{ margin: "0 auto 20px auto", maxWidth: "450px", textAlign: "left" }}>
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{ background: "none", border: "none", color: "#16a34a", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", padding: "6px 0" }}
              >
                <FiInfo /> {showDetails ? "Hide" : "Show"} detailed feedback
              </button>

              {showDetails && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
                  <TaskFeedback title="Task 1 Feedback" result={taskDetails.task1} />
                  <TaskFeedback title="Task 2 Feedback" result={taskDetails.task2} />
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <button
              onClick={() => navigate("/profile")}
              style={{ background: "#16a34a", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              Go to Profile
            </button>
          </div>

        </div>
      )}

      <style jsx>{`
.ielts-container{min-height:100vh;background:#ffffff;padding:2rem;padding-top:180px;color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
.header-container{position:relative;display:flex;align-items:center;justify-content:center;max-width:1500px;margin:0 auto 40px auto;border-bottom:1px solid #d1fae5;padding-bottom:15px;}
.test-title{position:absolute;left:50%;transform:translateX(-50%);font-size:2rem;font-weight:800;color:#111827;}
.tabs{position:absolute;left:0;display:flex;gap:12px;}
.tab-btn{background:#ffffff;border:1px solid #bbf7d0;color:#15803d;padding:0.6rem 1.4rem;border-radius:10px;cursor:pointer;font-weight:600;transition:0.3s;}
.tab-btn:hover{background:#dcfce7;}
.tab-btn.active{background:#16a34a;border-color:#16a34a;color:white;}
.timer-box{position:absolute;right:0;display:flex;align-items:center;gap:8px;font-family:monospace;font-size:1.3rem;font-weight:800;padding:8px 18px;border-radius:12px;border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;}
.timer-warning{background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;}
.main-container{display:grid;grid-template-columns:${currentTask.image ? "1fr 1fr" : "1fr"};gap:2.5rem;height:calc(100vh - 180px);max-width:1500px;margin:0 auto;}
.image-container{background:#ffffff;border:1px solid #bbf7d0;border-radius:20px;padding:2rem;box-shadow:0 4px 15px rgba(0,0,0,0.05);display:flex;flex-direction:column;}
.image-content{flex:1;display:flex;align-items:center;justify-content:center;background:#f0fdf4;border-radius:12px;padding:1.2rem;}
.image-content img{max-width:100%;max-height:100%;object-fit:contain;}
.prompt-container{background:#ffffff;border:1px solid #bbf7d0;border-radius:20px;padding:2rem;box-shadow:0 4px 15px rgba(0,0,0,0.05);}
.response-container{background:#ffffff;border:1px solid #bbf7d0;border-radius:20px;padding:2rem;flex:1;display:flex;flex-direction:column;box-shadow:0 4px 15px rgba(0,0,0,0.05);}
.editor-area{background:#f9fafb;border:1px solid #d1d5db;border-radius:12px;color:#111827;padding:1.4rem;width:100%;flex:1;resize:none;font-family:'Courier New',monospace;font-size:1.05rem;line-height:1.6;outline:none;transition:0.3s;}
.editor-area:focus{border-color:#16a34a;box-shadow:0 0 0 3px rgba(34,197,94,0.2);}
.editor-area::placeholder{color:#6b7280;}
.primary-btn{background:#16a34a;color:white;font-weight:700;border:none;border-radius:10px;padding:0.85rem 2rem;cursor:pointer;display:flex;align-items:center;gap:.6rem;margin-top:20px;transition:0.3s;}
.primary-btn:hover{background:#15803d;}
.primary-btn:disabled{opacity:0.6;cursor:not-allowed;}
@media (max-width:900px){.main-container{grid-template-columns:1fr;height:auto;}.editor-area{min-height:250px;}}
@media (max-width:600px){.ielts-container{padding:1rem;padding-top:140px;}.header-container{flex-direction:column;align-items:center;gap:10px;position:static;}.test-title{position:static;transform:none;font-size:1.4rem;text-align:center;}.tabs{position:static;justify-content:center;}.timer-box{position:static;font-size:1rem;padding:6px 10px;}.tab-btn{padding:0.4rem 0.9rem;font-size:0.9rem;}}
`}</style>

      {!submitted && (
        <div className="header-container">
          <div className="tabs">
            <button onClick={() => setActiveTask(0)} className={`tab-btn ${activeTask === 0 ? "active" : ""}`}>Task 1</button>
            <button
              disabled={getWordCount(responses.task1) < 20}
              style={{ opacity: getWordCount(responses.task1) < 20 ? 0.5 : 1, cursor: getWordCount(responses.task1) < 20 ? "not-allowed" : "pointer" }}
              onClick={() => {
                if (getWordCount(responses.task1) < 20) { alert("Please complete Task 1 before moving to Task 2."); return; }
                setActiveTask(1);
              }}
              className={`tab-btn ${activeTask === 1 ? "active" : ""}`}
            >
              Task 2
            </button>
          </div>

          <h1 className="test-title">IELTS Academic Writing</h1>

          <div className={`timer-box ${timeLeft < 300 ? "timer-warning" : ""}`}>
            <FiClock /> Time Left: {formatTime(timeLeft)}
          </div>
        </div>
      )}

      {!submitted && (
        <div className="main-container">
          {currentTask.image && (
            <div className="image-container">
              <h3 className="text-xl font-bold text-green-700 mb-4">Visual Information</h3>
              <div className="image-content"><img src={currentTask.image} alt="Task Visual" /></div>
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="prompt-container">
              <h2 className="text-2xl font-bold mb-3">{currentTask.title}</h2>
              <div className="text-gray-700 whitespace-pre-line">{currentTask.prompt}</div>
            </div>

            <div className="response-container">
              <span style={{ color: wordCount >= currentTask.minWords ? "#16a34a" : "#6b7280" }}>
                Words: {wordCount} / {currentTask.minWords}
              </span>

              {wordCount < currentTask.minWords && (
                <span style={{ color: "#dc2626", fontSize: "13px" }}>
                  Recommended minimum: {currentTask.minWords} words
                </span>
              )}

              <textarea
                className="editor-area"
                placeholder={`Type your ${activeTask === 0 ? "report" : "essay"} here...`}
                value={responses[currentTask.id] || ""}
                onChange={(e) => setResponses({ ...responses, [currentTask.id]: e.target.value })}
              />

              <button onClick={handleManualSubmit} className="primary-btn" disabled={wordCount < 5 || submitted || isScoring}>
                {isScoring ? "Scoring…" : activeTask === 0 ? " Go to Task 2" : "Submit Writing Test"}
                <FiSave />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function BreakdownRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#374151", fontWeight: 500 }}>{label}</span>
      <span style={{ color: "#16a34a", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function Badge({ active, activeText, inactiveText }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: "999px",
      background: active ? "#dcfce7" : "#f3f4f6",
      color: active ? "#166534" : "#6b7280",
      border: `1px solid ${active ? "#bbf7d0" : "#e5e7eb"}`
    }}>
      {active ? "✓" : "–"} {active ? activeText : inactiveText}
    </span>
  );
}

function Notice({ text }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "8px", textAlign: "left",
      background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412",
      borderRadius: "8px", padding: "10px 14px", fontSize: "0.8rem", marginBottom: "16px"
    }}>
      <FiAlertTriangle style={{ marginTop: "2px", flexShrink: 0 }} />
      <span>{text}</span>
    </div>
  );
}

function WarningBox({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "8px", textAlign: "left",
      background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
      borderRadius: "8px", padding: "12px 16px", fontSize: "0.85rem", marginBottom: "16px"
    }}>
      <FiAlertTriangle style={{ marginTop: "2px", flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}

function TaskFeedback({ title, result }) {
  if (!result) return null;

  const notes = [
    result.taskAchievement?.offTopic
      ? { label: "⚠ Off-Topic", text: "This response does not appear to fully address the task prompt." }
      : null,
    { label: "Task Achievement", text: result.taskAchievement?.note },
    result.taskAchievement?.ideaDevelopment
      ? { label: "Idea Development", text: result.taskAchievement.ideaDevelopment.note }
      : null,
    result.taskAchievement?.exampleQuality
      ? { label: "Example Quality", text: result.taskAchievement.exampleQuality.note }
      : null,
    result.taskAchievement?.positionConsistency
      ? { label: "Position Consistency", text: result.taskAchievement.positionConsistency.note }
      : null,
    result.taskAchievement?.task1Details
      ? { label: "Task 1 Analysis (key features / grouping / trends / stages)", text: result.taskAchievement.task1Specific }
      : null,
    { label: "Coherence & Cohesion", text: result.coherence?.note },
    result.coherence?.topicSentences
      ? { label: "Topic Sentences", text: result.coherence.topicSentences.note }
      : null,
    result.coherence?.paragraphUnity
      ? { label: "Paragraph Unity", text: result.coherence.paragraphUnity.note }
      : null,
    { label: "Lexical Resource", text: result.lexical?.note },
    result.lexical?.collocation
      ? { label: "Collocation & Precision", text: result.lexical.collocation.note }
      : null,
    result.lexical?.synonymVariety
      ? { label: "Synonym Variety", text: result.lexical.synonymVariety.note }
      : null,
    { label: "Grammatical Range & Accuracy", text: result.grammar?.note },
    result.grammar?.grammarRange
      ? { label: "Grammar Range (structure variety)", text: result.grammar.grammarRange.note }
      : null,
    result.grammar?.complexSentences
      ? { label: "Complex Sentences", text: result.grammar.complexSentences.note }
      : null,
    result.template?.isTemplate
      ? { label: "⚠ Template Match", text: `Closely matches a known template essay (${(result.template.similarity * 100).toFixed(0)}% similarity).` }
      : null,
    result.plagiarism?.isPlagiarized
      ? { label: "⚠ Plagiarism Match", text: `Closely matches other existing text (${(result.plagiarism.similarity * 100).toFixed(0)}% similarity) found via embedding search.` }
      : null
  ].filter(n => n && n.text);

  return (
    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px 16px" }}>
      <h4 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#111827", fontWeight: 700 }}>{title}</h4>
      <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {notes.map((n, i) => (
          <li key={i} style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.4 }}>
            <strong>{n.label}:</strong> {n.text}
          </li>
        ))}
      </ul>
    </div>
  );
}