// export default ToeflWriting;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

const writingTask = {
  id: "essay",
  title: "Essay Writing",
  time: 1800, // 30 minutes
  minWords: 250,
  prompt: `Do you agree or disagree with the following statement?

Some people prefer to live in a small town, while others prefer to live in a large city.

Which do you prefer?

Use specific reasons and examples to support your answer.`,
};

/* ────────────────────────────────────────────────────────────────
   RUBRIC CONFIG — mirrors the official TOEFL independent-writing
   rubric dimensions. Each criterion is scored 0–6 with heuristics,
   then combined with the weights below (sum to 100%) into a 0–6
   composite, which is scaled to an approximate 0–30 TOEFL score.
   This is a heuristic approximation, not ETS's actual algorithm.
   ──────────────────────────────────────────────────────────────── */
const WEIGHTS = {
  task: 0.19,             // Task fulfillment
  development: 0.19,      // Development of ideas
  organization: 0.14,     // Organization
  grammar: 0.14,          // Grammar (incl. articles, prepositions, tense, agreement)
  vocabulary: 0.09,       // Vocabulary
  sentenceVariety: 0.07,  // Sentence variety
  coherence: 0.06,        // Coherence
  accuracy: 0.06,         // Accuracy (mechanics / usage errors)
  formality: 0.06,        // Formality / academic register
};

const CRITERIA_LABELS = {
  task: "Task Fulfillment",
  development: "Development of Ideas",
  organization: "Organization",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  sentenceVariety: "Sentence Variety",
  coherence: "Coherence",
  accuracy: "Accuracy",
  formality: "Formality / Register",
};

const TOPIC_KEYWORDS = [
  "town", "city", "cities", "towns", "urban", "rural", "live", "living",
  "community", "neighbor", "transport", "job", "opportunit", "quiet",
  "crowd", "convenien", "nature", "pollution", "traffic", "amenit",
];

const STANCE_WORDS = [
  "prefer", "i would rather", "in my opinion", "i think", "i believe",
  "agree", "disagree", "my preference", "personally",
];

const REASONING_CONNECTORS = [
  "because", "since", "therefore", "thus", "as a result", "due to",
  "consequently", "this shows", "this demonstrates", "this means",
  "for example", "for instance", "such as", "specifically", "which means",
  "in addition", "furthermore", "moreover",
];

const EXAMPLE_MARKERS = ["for example", "for instance", "such as", "e.g.", "consider", "take the case of", "when i"];

const CONCLUSION_MARKERS = ["in conclusion", "to conclude", "in summary", "overall", "to sum up", "for these reasons"];

const TRANSITION_WORDS = [
  "however", "moreover", "furthermore", "in addition", "on the other hand",
  "in contrast", "nevertheless", "consequently", "similarly", "likewise",
  "additionally", "conversely", "meanwhile", "in fact", "notably", "first", "second", "finally",
];

const ACADEMIC_WORDS = [
  "significant", "substantial", "fundamental", "convenient", "opportunity",
  "environment", "sustainable", "ultimately", "furthermore", "consequently",
  "perspective", "community", "accessible", "efficient", "beneficial",
  "advantage", "disadvantage", "lifestyle", "affordable", "diverse",
];

const COMMON_MISSPELLINGS = [
  "recieve", "occured", "seperate", "definately", "alot", "wich", "teh",
  "thier", "becuase", "arguement", "goverment", "enviroment", "acheive",
  "concious", "existance", "independant", "neccessary", "priviledge",
];

const SUBORDINATING_CONJUNCTIONS = [
  "although", "because", "since", "while", "when", "if", "though",
  "unless", "whereas", "after", "before", "even though", "as soon as",
];

const SUBJECT_VERB_ERROR_PATTERNS = [
  /\bhe are\b/i, /\bshe are\b/i, /\bit are\b/i, /\bthey is\b/i,
  /\bthey was\b/i, /\bi is\b/i, /\bwe is\b/i, /\byou is\b/i,
  /\bpeoples\b/i, /\bmore better\b/i, /\bmost best\b/i, /\bmore easier\b/i,
];

/* ── New: preposition collocation errors ─────────────────────── */
const PREPOSITION_ERRORS = [
  [/\bdepend(s|ed)?\s+of\b/gi, "depend on"],
  [/\bmarried\s+with\b/gi, "married to"],
  [/\bdiscuss\s+about\b/gi, "discuss (no preposition needed)"],
  [/\binterested\s+about\b/gi, "interested in"],
  [/\bgood\s+in\b/gi, "good at"],
  [/\bdifferent\s+than\b/gi, "different from"],
  [/\bcompare\s+to\b/gi, "compare with (usually)"],
  [/\bconsist\s+in\b/gi, "consist of"],
  [/\bresponsible\s+of\b/gi, "responsible for"],
  [/\bcapable\s+to\b/gi, "capable of"],
  [/\baccording\s+with\b/gi, "according to"],
];

/* ── New: informal / conversational register markers ─────────── */
const INFORMAL_WORDS = [
  "gonna", "wanna", "gotta", "kinda", "sorta", "dunno", "yeah", "yep",
  "nope", "stuff", "things", "a lot of", "like", "basically", "totally",
  "awesome", "cool", "guys", "u ", " u,", "ur ", "plz", "thx",
];

const CONTRACTIONS_RE = /\b(don't|doesn't|didn't|can't|won't|isn't|aren't|wasn't|weren't|i'm|it's|that's|there's|let's|we're|you're|they're|i've|we've|i'd|i'll|you'll)\b/gi;

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

/* ── Generic instructional words to strip when checking prompt-copying ── */
const PROMPT_GENERIC_WORDS = new Set([
  "do","you","agree","or","disagree","with","the","following","statement",
  "use","specific","reasons","and","examples","to","support","your","answer",
  "which","some","people","prefer","while","others","live","in","a","of",
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

function getParagraphs(text) {
  return text.split(/\n+/).map(p => p.trim()).filter(Boolean);
}

function getSentences(text) {
  return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
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

  const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z']/g, ""));
  const trigramCounts = {};
  for (let i = 0; i < lowerWords.length - 2; i++) {
    const tri = lowerWords.slice(i, i + 3).join(" ");
    if (tri.trim().length < 8) continue;
    trigramCounts[tri] = (trigramCounts[tri] || 0) + 1;
  }
  const repeatedPhrases = Object.entries(trigramCounts).filter(([, c]) => c >= 3).map(([p]) => p);

  return { topWord, topCount, ratio, repeatedPhrases };
}

function computeMATTR(words, window = 40) {
  const cleaned = words.map(w => w.toLowerCase().replace(/[^a-z']/g, "")).filter(Boolean);
  if (cleaned.length === 0) return 0;
  if (cleaned.length <= window) return new Set(cleaned).size / cleaned.length;
  let sum = 0, count = 0;
  for (let i = 0; i + window <= cleaned.length; i += 5) {
    const slice = cleaned.slice(i, i + window);
    sum += new Set(slice).size / window;
    count++;
  }
  return count ? sum / count : new Set(cleaned).size / cleaned.length;
}

/* ── Duplicate / copy-pasted content detection ───────────────── */

function analyzeDuplicateContent(text) {
  const sentences = getSentences(text)
    .map(s => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " "))
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

/* ── New: prompt-copying detection ───────────────────────────── */
/* Flags essays that lift chunks of wording directly from the prompt
   itself instead of writing an original response — a known way
   naive word-count-based scoring gets gamed. */
function analyzePromptCopying(text, promptText, n = 6) {
  const clean = (s) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

  const promptWords = clean(promptText).split(" ").filter(Boolean);
  const essayWords = clean(text).split(" ").filter(Boolean);

  if (essayWords.length < n) return { ratio: 0, matches: 0, sample: null };

  const promptGrams = new Set();
  for (let i = 0; i <= promptWords.length - n; i++) {
    const gram = promptWords.slice(i, i + n);
    // Skip n-grams that are entirely generic instructional language
    if (gram.every(w => PROMPT_GENERIC_WORDS.has(w))) continue;
    promptGrams.add(gram.join(" "));
  }

  let matches = 0;
  let sample = null;
  for (let i = 0; i <= essayWords.length - n; i++) {
    const gram = essayWords.slice(i, i + n).join(" ");
    if (promptGrams.has(gram)) {
      matches++;
      if (!sample) sample = gram;
    }
  }

  const ratio = matches / Math.max(1, essayWords.length - n + 1);
  return { ratio, matches, sample };
}

/* ── Off-topic detection ─────────────────────────────────────── */

function analyzeOffTopic(text) {
  const paragraphs = getParagraphs(text);
  if (paragraphs.length === 0) return { onTopicRatio: 0 };
  let onTopicCount = 0;
  paragraphs.forEach(p => {
    const lower = p.toLowerCase();
    if (TOPIC_KEYWORDS.some(k => lower.includes(k))) onTopicCount++;
  });
  return { onTopicRatio: onTopicCount / paragraphs.length };
}

/* ── Argument specificity ────────────────────────────────────── */

function analyzeSpecificity(text) {
  const sentences = getSentences(text);
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
  return { properNouns, numberMatches };
}

/* ── Sentence-to-sentence flow ───────────────────────────────── */

function analyzeFlow(text) {
  const paragraphs = getParagraphs(text);
  let flowSum = 0, flowCount = 0;
  paragraphs.forEach(p => {
    const sents = getSentences(p);
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
  return flowCount ? flowSum / flowCount : 0;
}

function analyzeThesisOverlap(text) {
  const paragraphs = getParagraphs(text);
  if (paragraphs.length < 2) return 0;
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
  return overlapCount ? overlapSum / overlapCount : 0;
}

/* ── New: article usage heuristic (a/an mismatches) ──────────── */
function analyzeArticleErrors(text) {
  const errors = [];
  // "a" followed by a vowel-sound word (excluding common exceptions like "university", "one", "user")
  const aVowelRe = /\ba\s+([aeiouAEIOU]\w*)/g;
  let m;
  while ((m = aVowelRe.exec(text)) !== null) {
    const w = m[1].toLowerCase();
    if (["university", "unicorn", "unique", "unit", "united", "user", "one", "once", "european"].some(ex => w.startsWith(ex))) continue;
    errors.push(`"a ${m[1]}" → likely should be "an ${m[1]}"`);
  }
  // "an" followed by a consonant-sound word (excluding silent-h exceptions)
  const anConsonantRe = /\ban\s+([b-df-hj-np-tv-zB-DF-HJ-NP-TV-Z]\w*)/g;
  while ((m = anConsonantRe.exec(text)) !== null) {
    const w = m[1].toLowerCase();
    if (["hour", "honest", "honor", "heir"].some(ex => w.startsWith(ex))) continue;
    errors.push(`"an ${m[1]}" → likely should be "a ${m[1]}"`);
  }
  return errors.slice(0, 5);
}

/* ── New: preposition collocation errors ─────────────────────── */
function analyzePrepositionErrors(text) {
  const found = [];
  PREPOSITION_ERRORS.forEach(([re, suggestion]) => {
    const matches = text.match(re);
    if (matches) found.push({ found: matches[0], suggestion, count: matches.length });
  });
  return found;
}

/* ── New: tense consistency heuristic ────────────────────────── */
function analyzeTenseConsistency(text) {
  const paragraphs = getParagraphs(text);
  let inconsistentParagraphs = 0;
  paragraphs.forEach(p => {
    const past = (p.match(/\b(was|were|had|did|went|said|made|took|came|thought|felt|knew)\b/gi) || []).length;
    const present = (p.match(/\b(is|are|am|do|does|has|have|goes|says|makes|takes|comes|thinks|feels|knows)\b/gi) || []).length;
    // Flag paragraphs with a substantial, roughly balanced mix of both tenses,
    // which often signals unintentional tense-shifting rather than deliberate use.
    if (past >= 3 && present >= 3 && Math.min(past, present) / Math.max(past, present) > 0.5) {
      inconsistentParagraphs++;
    }
  });
  return { inconsistentParagraphs, totalParagraphs: paragraphs.length };
}

/* ── New: passive voice detection ────────────────────────────── */
function analyzePassiveVoice(text) {
  const sentences = getSentences(text);
  const passiveRe = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;
  let passiveCount = 0;
  sentences.forEach(s => { if (passiveRe.test(s)) passiveCount++; });
  return { passiveCount, totalSentences: sentences.length, ratio: sentences.length ? passiveCount / sentences.length : 0 };
}

/* ── New: informal register detection ────────────────────────── */
function analyzeInformality(text) {
  const lower = text.toLowerCase();
  const informalHits = INFORMAL_WORDS.filter(w => lower.includes(w)).length;
  const contractionMatches = text.match(CONTRACTIONS_RE);
  const contractionCount = contractionMatches ? contractionMatches.length : 0;
  const firstPersonCount = (text.match(/\bI\b/g) || []).length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const firstPersonRatio = wordCount ? firstPersonCount / wordCount : 0;
  return { informalHits, contractionCount, firstPersonRatio };
}

/* ── Individual criterion scorers — each returns {score, diagnostics} ── */

function scoreTask(text, words) {
  const diagnostics = [];
  const lower = text.toLowerCase();
  let score = 0;

  const opening = words.slice(0, 60).join(" ").toLowerCase();
  const hasStance = STANCE_WORDS.some(w => opening.includes(w));
  score += hasStance ? 2.5 : 0.5;
  diagnostics.push(hasStance
    ? "✓ States a clear preference/position early."
    : "⚠️ No clear preference stated in the opening — answer the question directly early on.");

  const hits = TOPIC_KEYWORDS.filter(k => lower.includes(k)).length;
  score += clamp((hits / TOPIC_KEYWORDS.length) * 3, 0, 3);

  const offTopic = analyzeOffTopic(text);
  score += clamp(offTopic.onTopicRatio * 1.5, 0, 1.5);
  if (offTopic.onTopicRatio < 0.5) {
    score -= 1;
    diagnostics.push(`⚠️ About ${Math.round((1 - offTopic.onTopicRatio) * 100)}% of paragraphs don't reference the topic — stay focused on the prompt.`);
  } else {
    diagnostics.push("✓ Response stays focused on the prompt.");
  }

  if (words.length < writingTask.minWords) {
    score -= 1;
    diagnostics.push(`⚠️ Only ${words.length} of the recommended ${writingTask.minWords} words were written — a short response limits how fully the task can be fulfilled.`);
  }

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreDevelopment(text, wordCount) {
  const diagnostics = [];
  const lower = text.toLowerCase();
  const connectorHits = REASONING_CONNECTORS.reduce((s, c) => s + countOccurrences(lower, c), 0);
  const exampleHits = EXAMPLE_MARKERS.reduce((s, c) => s + countOccurrences(lower, c), 0);
  const density = (connectorHits / Math.max(wordCount, 1)) * 100;

  let score = clamp(density * 2.2, 0, 3);
  score += clamp(exampleHits * 1.2, 0, 2);

  const spec = analyzeSpecificity(text);
  score += clamp((spec.properNouns + spec.numberMatches) * 0.15, 0, 1);

  const paragraphs = getParagraphs(text);
  const avgParaLen = paragraphs.length
    ? paragraphs.reduce((s, p) => s + p.split(/\s+/).filter(Boolean).length, 0) / paragraphs.length
    : 0;
  if (avgParaLen < 25) {
    score -= 0.5;
    diagnostics.push("⚠️ Paragraphs are quite short — ideas may not be fully developed.");
  } else {
    diagnostics.push("✓ Paragraphs are developed with sufficient detail.");
  }

  diagnostics.push(connectorHits >= 2
    ? "✓ Reasons are supported with logical connectors."
    : "⚠️ Few logical connectors found — explain *why* with because/therefore/as a result.");

  diagnostics.push(exampleHits > 0
    ? `✓ ${exampleHits} concrete example(s) used to support the answer.`
    : "⚠️ No concrete examples found — TOEFL raters specifically reward personal/specific examples.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreOrganization(text, paragraphCount) {
  const diagnostics = [];
  const lower = text.toLowerCase();
  let score = 0;

  if (paragraphCount >= 4) score += 2.5;
  else if (paragraphCount === 3) score += 1.75;
  else if (paragraphCount === 2) score += 0.75;
  else score += 0.25;
  diagnostics.push(paragraphCount >= 4
    ? "✓ Clear paragraph structure (intro, body, conclusion)."
    : "⚠️ Use separate paragraphs for intro, each reason, and conclusion.");

  const hasConclusion = CONCLUSION_MARKERS.some(m => lower.includes(m));
  score += hasConclusion ? 1.5 : 0;
  diagnostics.push(hasConclusion
    ? "✓ Clear concluding statement."
    : "⚠️ No clear concluding statement found.");

  const transitionHits = TRANSITION_WORDS.filter(t => lower.includes(t)).length;
  score += clamp(transitionHits * 0.4, 0, 2);
  diagnostics.push(transitionHits >= 3
    ? "✓ Good use of transition words to organize ideas."
    : "⚠️ Add more transition words (first, in addition, finally...) to organize your points.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreGrammar(text) {
  const diagnostics = [];
  const rawSentences = getSentences(text);
  if (rawSentences.length === 0) return { score: 0, diagnostics: ["⚠️ No sentences detected."] };

  const lengths = rawSentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((s, l) => s + Math.pow(l - avgLen, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  let score = 6;

  if (avgLen < 6 || avgLen > 35) {
    score -= 2;
    diagnostics.push("⚠️ Average sentence length is extreme (too short or too long).");
  } else if (avgLen < 10 || avgLen > 28) {
    score -= 1;
  }

  const fragments = lengths.filter(l => l < 3).length;
  if (fragments > 0) {
    score -= clamp(fragments * 0.5, 0, 1.5);
    diagnostics.push(`⚠️ ${fragments} likely sentence fragment(s) detected.`);
  }

  const runOns = lengths.filter(l => l > 45).length;
  if (runOns > 0) {
    score -= clamp(runOns, 0, 2);
    diagnostics.push(`⚠️ ${runOns} likely run-on sentence(s) detected (45+ words).`);
  }

  const badCaps = rawSentences.filter(s => s.length > 0 && s[0] !== s[0].toUpperCase()).length;
  if (badCaps > 0) {
    score -= clamp(badCaps * 0.25, 0, 1.5);
    diagnostics.push(`⚠️ ${badCaps} sentence(s) don't start with a capital letter.`);
  }

  if (stdDev < 2) {
    score -= 0.5;
    diagnostics.push("⚠️ Sentence lengths are monotonous — vary short and long sentences.");
  }

  const svErrors = SUBJECT_VERB_ERROR_PATTERNS.filter(re => re.test(text)).length;
  if (svErrors > 0) {
    score -= clamp(svErrors * 0.75, 0, 1.5);
    diagnostics.push(`⚠️ ${svErrors} likely subject-verb agreement error(s) detected.`);
  }

  const articleErrors = analyzeArticleErrors(text);
  if (articleErrors.length > 0) {
    score -= clamp(articleErrors.length * 0.4, 0, 1.2);
    diagnostics.push(`⚠️ Possible article error(s): ${articleErrors.slice(0, 2).join("; ")}${articleErrors.length > 2 ? "..." : ""}`);
  }

  const prepErrors = analyzePrepositionErrors(text);
  if (prepErrors.length > 0) {
    score -= clamp(prepErrors.length * 0.4, 0, 1.2);
    diagnostics.push(`⚠️ Preposition issue: "${prepErrors[0].found.trim()}" → consider "${prepErrors[0].suggestion}".`);
  }

  const tense = analyzeTenseConsistency(text);
  if (tense.inconsistentParagraphs > 0) {
    score -= clamp(tense.inconsistentParagraphs * 0.5, 0, 1);
    diagnostics.push(`⚠️ ${tense.inconsistentParagraphs} paragraph(s) mix past and present tense inconsistently — keep verb tense consistent unless the meaning requires a shift.`);
  }

  if (diagnostics.length === 0) diagnostics.push("✓ Sentence structure is clear and controlled.");
  else if (!diagnostics.some(d => d.startsWith("✓"))) diagnostics.push("✓ No major structural breakdowns detected beyond the issues above.");

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
    ? "✓ Good vocabulary range with limited repetition."
    : "⚠️ Vocabulary range is limited — the same words are reused often.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreSentenceVariety(text) {
  const diagnostics = [];
  const sentences = getSentences(text);
  if (sentences.length === 0) return { score: 0, diagnostics: ["⚠️ No sentences detected."] };

  const complexCount = sentences.filter(s =>
    SUBORDINATING_CONJUNCTIONS.some(c => s.toLowerCase().includes(c))
  ).length;
  const compoundCount = (text.match(/,\s*(and|but|or|so|yet)\s/gi) || []).length;

  const starters = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase()).filter(Boolean);
  const starterFreq = {};
  starters.forEach(w => { starterFreq[w] = (starterFreq[w] || 0) + 1; });
  const maxStarterCount = Math.max(0, ...Object.values(starterFreq));
  const starterRepeatRatio = sentences.length ? maxStarterCount / sentences.length : 0;

  let score = 0;
  score += clamp((complexCount / sentences.length) * 4, 0, 3);
  score += clamp((compoundCount / sentences.length) * 3, 0, 1.5);
  score += clamp((1 - starterRepeatRatio) * 2, 0, 1.5);

  diagnostics.push(complexCount >= 2
    ? "✓ Uses complex sentences (with because/although/when...) for variety."
    : "⚠️ Mostly simple sentences — try combining ideas with because, although, when, etc.");

  diagnostics.push(starterRepeatRatio > 0.4
    ? `⚠️ Many sentences start the same way (e.g. "${Object.entries(starterFreq).sort((a,b)=>b[1]-a[1])[0][0]}") — vary sentence openings.`
    : "✓ Sentence openings are varied.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreCoherence(text) {
  const diagnostics = [];
  const flowScore = analyzeFlow(text);
  const overlapScore = analyzeThesisOverlap(text);

  let score = clamp(flowScore * 4, 0, 3.5) + clamp(overlapScore * 3.5, 0, 2.5);

  diagnostics.push(flowScore >= 0.12
    ? "✓ Sentences connect logically to the ones before them."
    : "⚠️ Sentence-to-sentence connections feel weak — link ideas explicitly.");

  diagnostics.push(overlapScore >= 0.15
    ? "✓ Body paragraphs stay tied to your main point."
    : "⚠️ Body paragraphs drift from your stated preference — tie each point back to your thesis.");

  return { score: clamp(score, 0, 6), diagnostics };
}

function scoreAccuracy(text) {
  const diagnostics = [];
  let score = 6;
  const lower = text.toLowerCase();

  const misspellHits = COMMON_MISSPELLINGS.filter(w => new RegExp(`\\b${w}\\b`, "i").test(lower)).length;
  if (misspellHits > 0) {
    score -= clamp(misspellHits * 1, 0, 2.5);
    diagnostics.push(`⚠️ ${misspellHits} common misspelling(s) detected.`);
  }

  const repeatMatches = text.match(/\b(\w+)\s+\1\b/gi);
  const repCount = repeatMatches ? repeatMatches.length : 0;
  if (repCount > 0) {
    score -= clamp(repCount * 0.5, 0, 1);
    diagnostics.push(`⚠️ Immediate word repetition found (e.g. "${repeatMatches[0]}").`);
  }

  const doublePunct = (text.match(/[,.;:]{2,}/g) || []).length;
  if (doublePunct > 0) { score -= clamp(doublePunct * 0.5, 0, 1); diagnostics.push("⚠️ Repeated punctuation marks found."); }

  const trimmed = text.trim();
  if (trimmed.length > 0 && !/[.!?]$/.test(trimmed)) {
    score -= 1;
    diagnostics.push("⚠️ Essay doesn't end with proper terminal punctuation.");
  }

  if (diagnostics.length === 0) diagnostics.push("✓ No obvious mechanical or usage errors detected.");
  return { score: clamp(score, 0, 6), diagnostics };
}

/* ── New: Formality / academic register scorer ───────────────── */
function scoreFormality(text) {
  const diagnostics = [];
  let score = 6;

  const informality = analyzeInformality(text);

  if (informality.contractionCount > 0) {
    score -= clamp(informality.contractionCount * 0.4, 0, 2);
    diagnostics.push(`⚠️ ${informality.contractionCount} contraction(s) found (e.g. "don't", "it's") — spell them out in formal academic writing.`);
  } else {
    diagnostics.push("✓ No contractions — appropriately formal.");
  }

  if (informality.informalHits > 0) {
    score -= clamp(informality.informalHits * 0.6, 0, 2);
    diagnostics.push(`⚠️ Informal/conversational word choice detected (e.g. "stuff", "a lot of", "gonna") — prefer academic phrasing.`);
  }

  if (informality.firstPersonRatio > 0.04) {
    score -= 0.75;
    diagnostics.push("⚠️ Heavy reliance on \"I\" — balance personal opinion with broader reasoning and examples.");
  } else {
    diagnostics.push("✓ Personal voice is balanced with broader reasoning.");
  }

  const passive = analyzePassiveVoice(text);
  if (passive.ratio > 0.35) {
    score -= 0.5;
    diagnostics.push("⚠️ Passive voice is used quite often — active voice usually reads as more direct and confident.");
  }

  return { score: clamp(score, 0, 6), diagnostics };
}

/* ── Master analysis function ─────────────────────────────────── */
function analyzeToeflEssay(essayText, promptText) {
  const text = essayText || "";
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const paragraphs = getParagraphs(text).length;

  const criteria = {
    task: scoreTask(text, words),
    development: scoreDevelopment(text, wordCount),
    organization: scoreOrganization(text, paragraphs),
    grammar: scoreGrammar(text),
    vocabulary: scoreVocabulary(words),
    sentenceVariety: scoreSentenceVariety(text),
    coherence: scoreCoherence(text),
    accuracy: scoreAccuracy(text),
    formality: scoreFormality(text),
  };

  let weighted = 0;
  Object.keys(WEIGHTS).forEach(key => { weighted += criteria[key].score * WEIGHTS[key]; });

  let lengthCapPenalty = 0;
  if (wordCount < 150) lengthCapPenalty = 2.5;
  else if (wordCount < 250) lengthCapPenalty = 1;
  else if (wordCount > 600) lengthCapPenalty = 0.5;

  const duplicateInfo = analyzeDuplicateContent(text);
  let duplicateCap = 6;
  let duplicatePenalty = 0;
  if (duplicateInfo.duplicateRatio >= 0.5) duplicateCap = 1.5;
  else if (duplicateInfo.duplicateRatio >= 0.3) duplicateCap = 2.5;
  else if (duplicateInfo.duplicateRatio >= 0.15) duplicatePenalty = 1.5;

  const promptCopy = analyzePromptCopying(text, promptText || writingTask.prompt);
  let promptCopyCap = 6;
  if (promptCopy.ratio >= 0.35) promptCopyCap = 1.5;
  else if (promptCopy.ratio >= 0.2) promptCopyCap = 3;

  let composite = clamp(weighted - lengthCapPenalty - duplicatePenalty, 0, 6);
  composite = Math.min(composite, duplicateCap, promptCopyCap);
  composite = Math.round(composite * 2) / 2;

  // Approximate scaling to the familiar 0–30 TOEFL writing scale.
  const toeflScore = clamp(Math.round((composite / 6) * 30), 0, 30);

  const warnings = [];
  if (wordCount < writingTask.minWords) {
    warnings.push(
      `⚠️ Your essay is ${writingTask.minWords - wordCount} word(s) short of the recommended ${writingTask.minWords}-word minimum. ` +
      `This lowers your Task Fulfillment score and applies an additional length penalty to your composite score.`
    );
  }
  if (duplicateInfo.duplicateRatio >= 0.15) {
    warnings.push(
      `⚠️ Duplicate content detected: ${duplicateInfo.duplicateSentenceCount} of ${duplicateInfo.totalSentences} sentences are repeated verbatim` +
      (duplicateInfo.topDuplicateCount > 1 ? ` (one sentence appears ${duplicateInfo.topDuplicateCount}× )` : "") +
      `. Repeating content instead of developing new ideas significantly lowers your score.`
    );
  }
  if (promptCopy.ratio >= 0.2) {
    warnings.push(
      `⚠️ A significant portion of your essay reuses wording directly from the prompt` +
      (promptCopy.sample ? ` (e.g. "${promptCopy.sample}")` : "") +
      `. Write the response in your own words — copying the prompt does not demonstrate writing ability.`
    );
  }

  return { wordCount, paragraphs, criteria, composite, toeflScore, warnings };
}

/* ── Band descriptor for the approximate 0–30 scale ───────────── */
function getBandDescriptor(toeflScore) {
  if (toeflScore >= 24) return { band: "Good (24–30)", description: "Effectively addresses the topic with well-organized, well-developed ideas, controlled grammar/vocabulary, and clear coherence." };
  if (toeflScore >= 17) return { band: "Fair (17–23)", description: "Addresses the topic with adequate development, but may have some organizational, grammatical, or coherence issues." };
  if (toeflScore >= 9) return { band: "Limited (9–16)", description: "Inadequate development, limited range of vocabulary/grammar, and/or connection of ideas is unclear at times." };
  return { band: "Weak (0–8)", description: "Serious problems with development, organization, or language use that obscure meaning." };
}

/* ────────────────────────────────────────────────────────────── */

function ToeflWriting() {
  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(writingTask.time);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const wordCount = answer
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const saveTestResult = async (result) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testName: "TOEFL Writing",
          result,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const calculateScore = () => {
    if (wordCount < writingTask.minWords) {
      const confirmSubmit = window.confirm(
        `Your essay contains only ${wordCount} words.\n\nThe recommended minimum is ${writingTask.minWords} words.\n\nDo you still want to submit?`
      );

      if (!confirmSubmit) return;
    }

    const analysis = analyzeToeflEssay(answer, writingTask.prompt);

    // Build a flat breakdown map for saving / passing along.
    const breakdown = {};
    Object.keys(analysis.criteria).forEach(key => {
      breakdown[key] = {
        label: CRITERIA_LABELS[key],
        weight: WEIGHTS[key],
        score: analysis.criteria[key].score,
        diagnostics: analysis.criteria[key].diagnostics,
      };
    });

    const band = getBandDescriptor(analysis.toeflScore);

    const resultPayload = {
      compositeScore: analysis.composite, // 0–6 rubric composite
      toeflScore: analysis.toeflScore,     // approx. 0–30 scaled score
      band,
      wordCount: analysis.wordCount,
      breakdown,
      warnings: analysis.warnings,
    };

    saveTestResult(resultPayload);

    navigate("/quiz/toefl/result", {
      state: {
        toeflScore: analysis.toeflScore,
        compositeScore: analysis.composite,
        band,
        wordCount: analysis.wordCount,
        breakdown,
        warnings: analysis.warnings,
        testType: "Writing",
      },
    });
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "100px 20px",
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111111",
      }}
    >
      {/* Title */}
      <h1
        style={{
          textAlign: "center",
          color: "#1a5c3a",
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "2rem",
        }}
      >
        TOEFL Writing Test
      </h1>

      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f4faf7",
          border: "1px solid #c8e6d4",
          borderRadius: "10px",
          padding: "12px 18px",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ fontWeight: "600" }}>
          Essay Writing Task
        </div>

        <div
          style={{
            color: "#1a5c3a",
            fontWeight: "700",
          }}
        >
          ⏱ Time Remaining: {formatTime(timeLeft)}
        </div>

        <div style={{ fontWeight: "600" }}>
          Words: {wordCount} / {writingTask.minWords}
        </div>
      </div>

      {/* Essay Prompt */}
      <div
        style={{
          background: "#f9fefb",
          border: "1px solid #c8e6d4",
          borderRadius: "10px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            color: "#1a5c3a",
            marginBottom: "1rem",
          }}
        >
          {writingTask.title}
        </h2>

        <p
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.8",
            color: "#222",
          }}
        >
          {writingTask.prompt}
        </p>
      </div>

      {/* Word Count */}
      <div
        style={{
          marginBottom: "10px",
          fontSize: "0.9rem",
          color: "#555",
        }}
      >
        Words: {wordCount} / {writingTask.minWords}

        {wordCount < writingTask.minWords && (
          <span
            style={{
              color: "#d32f2f",
              marginLeft: "10px",
            }}
          >
            Recommended minimum: {writingTask.minWords} words
          </span>
        )}
      </div>

      {/* Essay Box */}
      <textarea
        rows="18"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your essay here..."
        style={{
          width: "100%",
          padding: "1rem",
          border: "1px solid #b2d8c2",
          borderRadius: "10px",
          fontSize: "1rem",
          lineHeight: "1.7",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          background: "#ffffff",
          color: "#111111",
        }}
      />

      {/* Submit Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={calculateScore}
          style={{
            background: "#2e7d52",
            color: "#ffffff",
            border: "none",
            padding: "12px 30px",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1rem",
          }}
        >
          Finish & Submit ✓
        </button>
      </div>
    </div>
  );
}
export default ToeflWriting;