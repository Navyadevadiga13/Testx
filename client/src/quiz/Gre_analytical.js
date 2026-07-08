import React, { useState, useEffect, useRef } from "react";
import getApiBaseUrl from "../utils/api";
import { FaClock } from "react-icons/fa";

/* ────────────────────────────────────────────────────────────────
   RUBRIC CONFIG
   Each criterion is scored independently on a 0–6 scale using text
   heuristics, then combined using the weights below (sums to 100%).
   ──────────────────────────────────────────────────────────────── */
const WEIGHTS = {
  addresses: 0.20,     // Addresses the issue/task (incl. off-topic check)
  reasoning: 0.25,     // Quality of reasoning (incl. meaningful arguments)
  organization: 0.20,  // Organization & coherence
  grammar: 0.15,       // Grammar & sentence structure
  vocabulary: 0.10,    // Vocabulary (incl. diversity + repetition)
  style: 0.05,         // Style & transitions
  spelling: 0.05,      // Minor spelling/punctuation
};

const CRITERIA_LABELS = {
  addresses: "Addresses the Issue",
  reasoning: "Quality of Reasoning",
  organization: "Organization & Coherence",
  grammar: "Grammar & Sentence Structure",
  vocabulary: "Vocabulary",
  style: "Style & Transitions",
  spelling: "Spelling & Punctuation",
};

const TOPIC_KEYWORDS = [
  "econom", "growth", "cultur", "social", "well-being", "wellbeing",
  "society", "societ", "priorit", "value", "develop", "progress",
];

const STANCE_WORDS = [
  "agree", "disagree", "believe", "argue", "contend", "in my opinion",
  "i think", "i believe", "this essay will", "this statement",
];

const REASONING_CONNECTORS = [
  "because", "since", "therefore", "thus", "as a result", "due to",
  "consequently", "this shows", "this demonstrates", "this suggests",
  "for example", "for instance", "such as", "specifically", "which means",
  "as evidenced by", "given that", "so that",
];

const EXAMPLE_MARKERS = ["for example", "for instance", "such as", "e.g.", "consider", "take the case of"];

const CONCLUSION_MARKERS = ["in conclusion", "to conclude", "in summary", "overall", "to sum up", "ultimately"];

const TRANSITION_WORDS = [
  "however", "moreover", "furthermore", "in addition", "on the other hand",
  "in contrast", "nevertheless", "consequently", "similarly", "likewise",
  "additionally", "conversely", "meanwhile", "in fact", "notably",
];

const ACADEMIC_WORDS = [
  "significant", "substantial", "fundamental", "inherent", "prioritize",
  "undermine", "sustainable", "ultimately", "furthermore", "consequently",
  "perspective", "framework", "implication", "phenomenon", "mitigate",
  "facilitate", "paradigm", "empirical", "coherent", "nuanced",
];

const COMMON_MISSPELLINGS = [
  "recieve", "occured", "seperate", "definately", "alot", "wich", "teh",
  "thier", "becuase", "arguement", "goverment", "enviroment", "acheive",
  "concious", "existance", "independant", "neccessary", "priviledge",
];

const COUNTERARGUMENT_MARKERS = [
  "although", "while some", "critics", "admittedly", "on the other hand",
  "some might argue", "some may argue", "opponents", "one could argue",
  "it could be argued", "conversely",
];

const STOPWORDS = new Set([
  "the","a","an","and","or","but","is","are","was","were","of","in","on",
  "at","to","for","with","as","by","that","this","these","those","it",
  "its","be","been","being","from","which","who","whom","their","them",
  "they","he","she","we","you","i","not","no","so","if","than","then",
  "also","can","could","should","would","will","shall","may","might",
  "do","does","did","have","has","had","such","because","about","into",
  "over","under","more","most","much","many","some","any","other","own",
  "same","too","very","just","only","there","here","when","where","how",
]);

function countOccurrences(text, phrase) {
  const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const matches = text.match(re);
  return matches ? matches.length : 0;
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function getContentWords(str) {
  return str.toLowerCase().split(/\W+/).filter(w => w.length > 4 && !STOPWORDS.has(w));
}

/* ── Repetition & vocabulary diversity ───────────────────────── */

function analyzeRepetition(words) {
  const content = words
    .map(w => w.toLowerCase().replace(/[^a-z']/g, ""))
    .filter(w => w.length > 3 && !STOPWORDS.has(w));

  const freq = {};
  content.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  let topWord = null, topCount = 0;
  Object.entries(freq).forEach(([w, c]) => {
    if (c > topCount) { topCount = c; topWord = w; }
  });
  const ratio = content.length ? topCount / content.length : 0;

  // repeated 3-word phrases (near-verbatim reuse)
  const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z']/g, ""));
  const trigramCounts = {};
  for (let i = 0; i < lowerWords.length - 2; i++) {
    const tri = lowerWords.slice(i, i + 3).join(" ");
    if (tri.trim().length < 8) continue;
    trigramCounts[tri] = (trigramCounts[tri] || 0) + 1;
  }
  const repeatedPhrases = Object.entries(trigramCounts)
    .filter(([, c]) => c >= 3)
    .map(([p]) => p);

  return { topWord, topCount, ratio, repeatedPhrases };
}

// Moving-Average Type-Token Ratio: measures lexical diversity without
// being unfairly penalized/rewarded just because of essay length.
function computeMATTR(words, window = 40) {
  const cleaned = words.map(w => w.toLowerCase().replace(/[^a-z']/g, "")).filter(Boolean);
  if (cleaned.length === 0) return 0;
  if (cleaned.length <= window) {
    return new Set(cleaned).size / cleaned.length;
  }
  let sum = 0, count = 0;
  for (let i = 0; i + window <= cleaned.length; i += 5) {
    const slice = cleaned.slice(i, i + window);
    sum += new Set(slice).size / window;
    count++;
  }
  return count ? sum / count : new Set(cleaned).size / cleaned.length;
}

/* ── Argument quality (specificity + counterargument) ────────── */

function analyzeArgumentQuality(text) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  let properNouns = 0;
  sentences.forEach(s => {
    const sw = s.trim().split(/\s+/);
    sw.forEach((w, idx) => {
      const clean = w.replace(/[^a-zA-Z]/g, "");
      if (idx > 0 && clean.length > 1 && clean[0] === clean[0].toUpperCase()
          && clean !== clean.toUpperCase() && clean.toLowerCase() !== "i") {
        properNouns++;
      }
    });
  });
  const numberMatches = (text.match(/\b\d+([.,]\d+)?%?\b/g) || []).length;
  const lower = text.toLowerCase();
  const counterArgHits = COUNTERARGUMENT_MARKERS.filter(p => lower.includes(p)).length;
  return { properNouns, numberMatches, counterArgHits };
}

/* ── Coherence: paragraph-to-thesis + sentence-to-sentence flow ─ */

function analyzeCoherence(text) {
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return { overlapScore: 0, flowScore: 0 };

  const thesisWords = new Set(getContentWords(paragraphs[0]));
  let overlapSum = 0, overlapCount = 0;
  for (let i = 1; i < paragraphs.length; i++) {
    const pw = new Set(getContentWords(paragraphs[i]));
    if (pw.size === 0) continue;
    let shared = 0;
    pw.forEach(w => { if (thesisWords.has(w)) shared++; });
    overlapSum += shared / pw.size;
    overlapCount++;
  }
  const overlapScore = overlapCount ? overlapSum / overlapCount : 0;

  let flowSum = 0, flowCount = 0;
  paragraphs.forEach(p => {
    const sents = p.split(/(?<=[.!?])\s+/).filter(Boolean);
    for (let i = 1; i < sents.length; i++) {
      const a = new Set(getContentWords(sents[i - 1]));
      const b = new Set(getContentWords(sents[i]));
      if (a.size === 0 || b.size === 0) continue;
      let shared = 0;
      b.forEach(w => { if (a.has(w)) shared++; });
      flowSum += shared / Math.max(1, Math.min(a.size, b.size));
      flowCount++;
    }
  });
  const flowScore = flowCount ? flowSum / flowCount : 0;

  return { overlapScore, flowScore };
}

/* ── Duplicate / copy-pasted content detection ───────────────── */
// Catches essays that pad length by repeating the same sentence(s) or
// block(s) verbatim — a case pure local-window diversity checks miss,
// since each individual copy still looks "diverse" on its own.
function analyzeDuplicateContent(text) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " "))
    .filter(s => s.length > 12);

  if (sentences.length === 0) return { duplicateRatio: 0, duplicateSentenceCount: 0, totalSentences: 0 };

  const freq = {};
  sentences.forEach(s => { freq[s] = (freq[s] || 0) + 1; });

  const duplicateEntries = Object.entries(freq).filter(([, c]) => c > 1);
  const duplicateSentenceCount = duplicateEntries.reduce((sum, [, c]) => sum + (c - 1), 0);
  const duplicateRatio = duplicateSentenceCount / sentences.length;
  const topDuplicate = duplicateEntries.sort((a, b) => b[1] - a[1])[0];

  return {
    duplicateRatio,
    duplicateSentenceCount,
    totalSentences: sentences.length,
    topDuplicateCount: topDuplicate ? topDuplicate[1] : 0,
  };
}

/* ── Off-topic detection ──────────────────────────────────────── */

function analyzeOffTopic(text) {
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return { onTopicRatio: 0 };
  let onTopicCount = 0;
  paragraphs.forEach(p => {
    const lower = p.toLowerCase();
    if (TOPIC_KEYWORDS.some(k => lower.includes(k))) onTopicCount++;
  });
  return { onTopicRatio: onTopicCount / paragraphs.length };
}

/* ── Individual criterion scorers — each returns {score, diagnostics} ── */

function scoreAddressesIssue(text, words) {
  const diagnostics = [];
  const lower = text.toLowerCase();
  let score = 0;

  const opening = words.slice(0, 60).join(" ").toLowerCase();
  const hasStance = STANCE_WORDS.some(w => opening.includes(w));
  score += hasStance ? 2.5 : 0.5;
  diagnostics.push(hasStance
    ? "✓ Clear thesis/stance stated early."
    : "⚠️ No clear stance detected in the opening — state your position early.");

  const hits = TOPIC_KEYWORDS.filter(k => lower.includes(k)).length;
  score += clamp((hits / TOPIC_KEYWORDS.length) * 3, 0, 3);

  const offTopic = analyzeOffTopic(text);
  score += clamp(offTopic.onTopicRatio * 1.5, 0, 1.5);
  if (offTopic.onTopicRatio < 0.5) {
    score -= 1;
    diagnostics.push(`⚠️ About ${Math.round((1 - offTopic.onTopicRatio) * 100)}% of paragraphs don't reference the topic — some content may be off-topic.`);
  } else {
    diagnostics.push("✓ Content stays on-topic throughout.");
  }

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreReasoning(text, wordCount) {
  const diagnostics = [];
  const lower = text.toLowerCase();
  const connectorHits = REASONING_CONNECTORS.reduce((s, c) => s + countOccurrences(lower, c), 0);
  const exampleHits = EXAMPLE_MARKERS.reduce((s, c) => s + countOccurrences(lower, c), 0);
  const density = (connectorHits / Math.max(wordCount, 1)) * 100;

  let score = clamp(density * 2.2, 0, 3.5);
  score += clamp(exampleHits * 1.0, 0, 1.5);

  const arg = analyzeArgumentQuality(text);
  score += clamp(arg.properNouns * 0.15, 0, 0.5);
  score += clamp(arg.numberMatches * 0.15, 0, 0.5);
  score += arg.counterArgHits > 0 ? 1 : 0;

  diagnostics.push(connectorHits >= 2
    ? "✓ Reasoning is supported with logical connectors (because, therefore...)."
    : "⚠️ Very few logical connectors found — reasoning may feel unsupported.");

  diagnostics.push(exampleHits > 0
    ? `✓ ${exampleHits} concrete example(s) used to support the argument.`
    : "⚠️ No concrete examples found — add specific examples to strengthen your argument.");

  diagnostics.push(arg.counterArgHits > 0
    ? "✓ Acknowledges an opposing viewpoint (stronger analytical writing)."
    : "⚠️ No counterargument acknowledged — addressing the opposing view strengthens the essay.");

  diagnostics.push((arg.properNouns + arg.numberMatches) > 2
    ? "✓ Argument includes specific, concrete details."
    : "⚠️ Argument leans generic — add specific names, data, or scenarios.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreOrganization(text, paragraphs) {
  const diagnostics = [];
  const lower = text.toLowerCase();
  let score = 0;

  if (paragraphs >= 4) score += 2.5;
  else if (paragraphs === 3) score += 1.75;
  else if (paragraphs === 2) score += 0.75;
  else score += 0.25;
  diagnostics.push(paragraphs >= 4
    ? "✓ Well-structured with intro, body, and conclusion paragraphs."
    : "⚠️ Consider 4+ paragraphs (intro, 2+ body, conclusion) for clearer structure.");

  const hasConclusion = CONCLUSION_MARKERS.some(m => lower.includes(m));
  score += hasConclusion ? 1 : 0;
  diagnostics.push(hasConclusion
    ? "✓ Clear concluding statement."
    : "⚠️ No clear concluding statement found.");

  const transitionHits = TRANSITION_WORDS.filter(t => lower.includes(t)).length;
  score += clamp(transitionHits * 0.3, 0, 1);

  const coherence = analyzeCoherence(text);
  score += clamp(coherence.overlapScore * 1.2, 0, 1.2);
  score += clamp(coherence.flowScore * 0.8, 0, 0.8);

  diagnostics.push(coherence.overlapScore >= 0.15
    ? "✓ Paragraphs relate clearly back to the central thesis."
    : "⚠️ Body paragraphs don't clearly connect back to your thesis — coherence could improve.");

  diagnostics.push(coherence.flowScore >= 0.12
    ? "✓ Sentences flow logically from one to the next."
    : "⚠️ Sentence-to-sentence flow feels disjointed in places.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreGrammar(text) {
  const diagnostics = [];
  const rawSentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  if (rawSentences.length === 0) return { score: 0, diagnostics: ["⚠️ No sentences detected."] };

  const lengths = rawSentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((s, l) => s + Math.pow(l - avgLen, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  let score = 6;

  if (avgLen < 8 || avgLen > 35) {
    score -= 2;
    diagnostics.push("⚠️ Average sentence length is extreme (too short or too long).");
  } else if (avgLen < 12 || avgLen > 28) {
    score -= 1;
  }

  if (stdDev < 2) {
    score -= 1;
    diagnostics.push("⚠️ Sentences are monotonous in length — vary sentence structure.");
  }

  const runOns = lengths.filter(l => l > 45).length;
  if (runOns > 0) {
    score -= clamp(runOns, 0, 2);
    diagnostics.push(`⚠️ ${runOns} likely run-on sentence(s) detected (45+ words).`);
  }

  const repeatMatches = text.match(/\b(\w+)\s+\1\b/gi);
  const repCount = repeatMatches ? repeatMatches.length : 0;
  if (repCount > 0) {
    score -= clamp(repCount * 0.5, 0, 1.5);
    diagnostics.push(`⚠️ Immediate word repetition found (e.g. "${repeatMatches[0]}").`);
  }

  const badCaps = rawSentences.filter(s => s.length > 0 && s[0] !== s[0].toUpperCase()).length;
  if (badCaps > 0) {
    score -= clamp(badCaps * 0.25, 0, 1.5);
    diagnostics.push(`⚠️ ${badCaps} sentence(s) don't start with a capital letter.`);
  }

  if (diagnostics.length === 0) diagnostics.push("✓ Sentence structure is clear and varied.");
  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreVocabulary(words) {
  const diagnostics = [];
  if (words.length === 0) return { score: 0, diagnostics: ["⚠️ No text to evaluate."] };

  const cleaned = words.map(w => w.toLowerCase().replace(/[^a-z']/g, "")).filter(Boolean);
  const mattr = computeMATTR(words);
  const avgWordLen = cleaned.reduce((sum, w) => sum + w.length, 0) / cleaned.length;
  const unique = new Set(cleaned);
  const academicHits = ACADEMIC_WORDS.filter(w => unique.has(w)).length;
  const rep = analyzeRepetition(words);

  let score = 0;
  score += clamp(mattr * 7, 0, 3.5);
  score += clamp((avgWordLen - 3.5) * 1.2, 0, 1.5);
  score += clamp(academicHits * 0.3, 0, 1);

  if (rep.ratio > 0.06) {
    score -= 1.5;
    diagnostics.push(`⚠️ The word "${rep.topWord}" is overused (${rep.topCount}× ) — vary your word choice.`);
  } else if (rep.ratio > 0.04) {
    score -= 0.75;
    diagnostics.push(`⚠️ The word "${rep.topWord}" appears frequently (${rep.topCount}× ) — consider synonyms.`);
  }

  if (rep.repeatedPhrases.length > 0) {
    score -= clamp(rep.repeatedPhrases.length * 0.5, 0, 1.5);
    diagnostics.push(`⚠️ Repeated phrase detected: "${rep.repeatedPhrases[0]}..."`);
  }

  diagnostics.push(mattr >= 0.5
    ? "✓ Good lexical diversity — limited word repetition."
    : "⚠️ Vocabulary diversity is low — the same words are reused often.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreStyle(text) {
  const diagnostics = [];
  const lower = text.toLowerCase();
  const distinctTransitions = new Set(TRANSITION_WORDS.filter(t => lower.includes(t))).size;

  let score = clamp(distinctTransitions * 1.1, 0, 5.5);
  const totalHits = TRANSITION_WORDS.reduce((s, t) => s + countOccurrences(lower, t), 0);
  if (totalHits > distinctTransitions) score += 0.5;

  diagnostics.push(distinctTransitions >= 3
    ? `✓ Uses ${distinctTransitions} different transition words for variety.`
    : "⚠️ Limited variety of transition words — try mixing in however, moreover, in contrast, etc.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreSpelling(text) {
  const diagnostics = [];
  let score = 6;
  const lower = text.toLowerCase();

  const misspellHits = COMMON_MISSPELLINGS.filter(w => new RegExp(`\\b${w}\\b`, "i").test(lower)).length;
  if (misspellHits > 0) {
    score -= clamp(misspellHits * 1, 0, 3);
    diagnostics.push(`⚠️ ${misspellHits} common misspelling(s) detected.`);
  }

  const doubleSpaces = (text.match(/ {2,}/g) || []).length;
  if (doubleSpaces > 0) { score -= clamp(doubleSpaces * 0.25, 0, 1); diagnostics.push("⚠️ Extra spaces found between words."); }

  const doublePunct = (text.match(/[,.;:]{2,}/g) || []).length;
  if (doublePunct > 0) { score -= clamp(doublePunct * 0.5, 0, 1); diagnostics.push("⚠️ Repeated punctuation marks found."); }

  const trimmed = text.trim();
  if (trimmed.length > 0 && !/[.!?]$/.test(trimmed)) {
    score -= 1;
    diagnostics.push("⚠️ Essay doesn't end with proper terminal punctuation.");
  }

  if (diagnostics.length === 0) diagnostics.push("✓ No spelling or punctuation issues detected.");
  return { score: clamp(score, 0, 6), diagnostics };
}

/* ── Master analysis function ─────────────────────────────────── */
function analyzeEssay(essayText) {
  const text = essayText || "";
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean).length;

  const criteria = {
    addresses: scoreAddressesIssue(text, words),
    reasoning: scoreReasoning(text, wordCount),
    organization: scoreOrganization(text, paragraphs),
    grammar: scoreGrammar(text),
    vocabulary: scoreVocabulary(words),
    style: scoreStyle(text),
    spelling: scoreSpelling(text),
  };

  let weighted = 0;
  Object.keys(WEIGHTS).forEach(key => {
    weighted += criteria[key].score * WEIGHTS[key];
  });

  // Length guardrails — mirrors how real raters penalize severe under/over length
  let lengthCapPenalty = 0;
  if (wordCount < 150) lengthCapPenalty = 2.5;
  else if (wordCount < 200) lengthCapPenalty = 1;
  else if (wordCount > 500) lengthCapPenalty = 1;
  else if (wordCount > 450) lengthCapPenalty = 0.5;

  // Duplicate-content guardrail: an essay padded with repeated/copy-pasted
  // sentences shows no real elaboration, no matter how the one original
  // paragraph scores on its own — so it gets a hard ceiling, not just a
  // point deduction.
  const duplicateInfo = analyzeDuplicateContent(text);
  let duplicateCap = 6;
  let duplicatePenalty = 0;
  if (duplicateInfo.duplicateRatio >= 0.5) duplicateCap = 1.5;
  else if (duplicateInfo.duplicateRatio >= 0.3) duplicateCap = 2.5;
  else if (duplicateInfo.duplicateRatio >= 0.15) duplicatePenalty = 1.5;

  let finalScore = clamp(weighted - lengthCapPenalty - duplicatePenalty, 0, 6);
  finalScore = Math.min(finalScore, duplicateCap);
  finalScore = Math.round(finalScore * 2) / 2; // half-point increments, GRE-style

  const warnings = [];
  if (duplicateInfo.duplicateRatio >= 0.15) {
    warnings.push(
      `⚠️ Duplicate content detected: ${duplicateInfo.duplicateSentenceCount} of ${duplicateInfo.totalSentences} sentences are repeated verbatim` +
      (duplicateInfo.topDuplicateCount > 1 ? ` (one sentence appears ${duplicateInfo.topDuplicateCount}× )` : "") +
      `. Repeating content instead of elaborating with new reasoning significantly lowers your score.`
    );
  }

  return { wordCount, paragraphs, criteria, finalScore, warnings, duplicateInfo };
}

/* ────────────────────────────────────────────────────────────── */

function Gre_analytical() {

  const topRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const API_URL = getApiBaseUrl();
  const totalTime = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [essay, setEssay] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (showResult) window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [showResult]);

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); finishEssay(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);

  }, [showResult]);

  const finishEssay = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const result = analyzeEssay(essay);
    setAnalysis(result);
    try {
      const token = localStorage.getItem("token");
      const breakdown = {};
      Object.keys(result.criteria).forEach(key => {
        breakdown[key] = {
          score: result.criteria[key].score,
          diagnostics: result.criteria[key].diagnostics,
        };
      });
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          testName: "GRE Analytical Writing",
          result: {
            wordCount: result.wordCount,
            essay,
            score: result.finalScore,
            breakdown,
            warnings: result.warnings,
          }
        })
      });
    } catch (err) { console.error("Error saving essay:", err); }
    setShowResult(true);
  };

  /* ── RESULT SCREEN ─────────────────────────────────────────── */
  if (showResult && analysis) {
    return (
      <div style={{
        minHeight: "100vh", background: "#ffffff",
        paddingTop: "90px", paddingBottom: "40px",
        paddingLeft: "20px", paddingRight: "20px",
        display: "flex", justifyContent: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "820px", textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", color: "#166534", fontWeight: "900", marginBottom: "4px" }}>
            GRE Analytical
          </h1>
          <h2 style={{ fontSize: "16px", color: "#4b5563", marginBottom: "24px", fontWeight: "600" }}>
            Writing Test
          </h2>
          <div style={{
            background: "#ffffff", border: "1px solid #d1d5db",
            borderRadius: "18px", padding: "35px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ color: "#111827", fontSize: "24px", fontWeight: "800" }}>
              Your Essay Submitted
            </h2>
            <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#166534", marginTop: "18px" }}>
              Word Count: {analysis.wordCount}
            </div>
            <div style={{ fontSize: "2.4rem", fontWeight: "900", color: "#166534", marginTop: "14px" }}>
              GRE Score: {analysis.finalScore} / 6
            </div>

            {analysis.warnings && analysis.warnings.length > 0 && (
              <div style={{
                marginTop: "18px", textAlign: "left", background: "#fef2f2",
                border: "1px solid #fecaca", borderRadius: "12px", padding: "14px 16px"
              }}>
                {analysis.warnings.map((w, i) => (
                  <p key={i} style={{ margin: i === 0 ? 0 : "8px 0 0 0", color: "#991b1b", fontSize: "13.5px", fontWeight: "600", lineHeight: "1.6" }}>
                    {w}
                  </p>
                ))}
              </div>
            )}

            {/* CRITERIA BREAKDOWN */}
            <div style={{ marginTop: "28px", textAlign: "left" }}>
              <h3 style={{ color: "#166534", fontSize: "16px", fontWeight: "800", marginBottom: "14px" }}>
                Score Breakdown
              </h3>
              {Object.keys(WEIGHTS).map(key => {
                const { score, diagnostics } = analysis.criteria[key];
                const pct = (score / 6) * 100;
                return (
                  <div key={key} style={{
                    marginBottom: "18px", background: "#f9fafb",
                    border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px"
                  }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: "14px", color: "#111827", fontWeight: "700", marginBottom: "6px"
                    }}>
                      <span>{CRITERIA_LABELS[key]} <span style={{ color: "#6b7280", fontWeight: "500" }}>({Math.round(WEIGHTS[key] * 100)}%)</span></span>
                      <span>{score.toFixed(1)} / 6</span>
                    </div>
                    <div style={{
                      height: "8px", background: "#e5e7eb",
                      borderRadius: "999px", overflow: "hidden", marginBottom: "10px"
                    }}>
                      <div style={{
                        width: `${pct}%`, background: "#166534",
                        height: "100%", transition: "0.3s"
                      }} />
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#374151", lineHeight: "1.7" }}>
                      {diagnostics.map((d, i) => (
                        <li key={i} style={{ listStyle: "none", marginLeft: "-18px" }}>{d}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "18px", color: "#111827", fontWeight: "500" }}>
              ✅ Complete result stored in profile
            </div>
            <button
              style={{
                padding: "12px 28px", background: "#166534", color: "#ffffff",
                border: "none", borderRadius: "10px", cursor: "pointer",
                fontWeight: "700", fontSize: "15px", marginTop: "24px"
              }}
              onClick={() => window.location.href = "/profile"}
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── TEST SCREEN ───────────────────────────────────────────── */
  return (
    <div ref={topRef} style={{
      minHeight: "100vh", background: "#ffffff",
      display: "flex", justifyContent: "center",
      paddingTop: "80px",
      paddingBottom: "40px",
      paddingLeft: "15px", paddingRight: "15px"
    }}>
      <div style={{ width: "100%", maxWidth: "900px", color: "#111827" }}>

        <h1 style={{
          textAlign: "center", color: "#166534",
          fontSize: "26px",
          fontWeight: "900", marginBottom: "2px"
        }}>
          GRE Analytical
        </h1>
        <h2 style={{
          textAlign: "center", color: "#4b5563",
          fontSize: "15px",
          fontWeight: "600", marginBottom: "14px"
        }}>
          Writing — Issue Task
        </h2>

        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "10px"
        }}>
          <p style={{ color: "#111827", fontSize: "16px", fontWeight: "700", margin: 0 }}>
            <FaClock style={{ verticalAlign: "middle", marginRight: "6px" }} />
            {minutes}:{seconds < 10 ? "0" : ""}{seconds}
          </p>
          <span style={{ fontWeight: "700", color: "#166534", fontSize: "15px" }}>
            Words: {wordCount}
          </span>
        </div>

        <div style={{
          height: "8px", background: "#e5e7eb",
          borderRadius: "999px", marginBottom: "20px", overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`, background: "#166534",
            height: "100%", transition: "0.3s"
          }} />
        </div>

        <div style={{
          background: "#ffffff", border: "1px solid #d1d5db",
          borderRadius: "18px", padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
        }}>

          <h3 style={{ color: "#166534", fontSize: "18px", fontWeight: "800" }}>
            Directions
          </h3>
          <p style={{ lineHeight: "1.8", marginTop: "10px", color: "#111827", fontSize: "15px" }}>
            Write an essay explaining whether you agree or disagree with the statement below.
            Support your opinion with reasons and examples.
          </p>
          <p style={{ marginTop: "8px", color: "#111827", fontSize: "14px" }}>
            Recommended length: <b>250–400 words</b>.
          </p>

          <h3 style={{ marginTop: "24px", color: "#166534", fontSize: "18px", fontWeight: "800" }}>
            Issue Topic
          </h3>
          <blockquote style={{
            fontStyle: "italic", fontSize: "16px", marginTop: "12px",
            color: "#111827", lineHeight: "1.8", background: "#f9fafb",
            padding: "18px", borderLeft: "5px solid #166534", borderRadius: "12px"
          }}>
            "Societies that prioritize economic growth above all other goals
            inevitably weaken their cultural values and social well-being."
          </blockquote>

          <h3 style={{ marginTop: "24px", color: "#166534", fontSize: "18px", fontWeight: "800" }}>
            Your Response
          </h3>
          <textarea
            style={{
              width: "100%", height: "260px", marginTop: "12px",
              padding: "16px", fontSize: "15px", borderRadius: "12px",
              border: "1px solid #d1d5db", background: "#ffffff",
              color: "#111827", resize: "none", outline: "none",
              lineHeight: "1.8", boxSizing: "border-box"
            }}
            placeholder="Start writing your essay here..."
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
          />

          {wordCount > 400 && (
            <p style={{ color: "#dc2626", marginTop: "8px", fontWeight: "600", fontSize: "14px" }}>
              Essay exceeds the GRE recommended limit of 400 words.
            </p>
          )}
          {wordCount > 0 && wordCount < 150 && (
            <p style={{ color: "#dc2626", marginTop: "8px", fontWeight: "600", fontSize: "14px" }}>
              Essay is too short. Minimum 150 words required.
            </p>
          )}

          <div style={{ textAlign: "center" }}>
            <button
              onClick={finishEssay}
              disabled={wordCount < 150 || wordCount > 400 || isSubmitted}
              style={{
                background: wordCount >= 150 && wordCount <= 400 ? "#166534" : "#9ca3af",
                color: "#ffffff", border: "none", padding: "13px 36px",
                borderRadius: "10px", fontWeight: "700",
                cursor: wordCount >= 150 && wordCount <= 400 ? "pointer" : "not-allowed",
                marginTop: "22px", fontSize: "15px", transition: "0.3s"
              }}
            >
              Submit Essay
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
export default Gre_analytical;