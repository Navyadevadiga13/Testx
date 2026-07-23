export function isQuestionCorrect(q, savedAnswer) {
  if (!savedAnswer || savedAnswer.value === null || savedAnswer.value === undefined) return false;
  const val = savedAnswer.value;
 
  if (q.type === "graphicsInterpretation") {
    if (typeof val !== "object") return false;
    return q.blanks.every((b, i) => val[`blank${i}`] === b.answer);
  }
 
  if (q.type === "twoPartAnalysis") {
    if (typeof val !== "object") return false;
    return q.columns.every((col) => val[col] === q.answers[col]);
  }
 
  return typeof val === "string" && val.toUpperCase() === (q.answer || "").toUpperCase();
}
 

export function calculateRawScore(answeredQuestions, answersMap, totalOverride) {
  let correct = 0;
  answeredQuestions.forEach((q) => {
    if (isQuestionCorrect(q, answersMap[q.id])) correct += 1;
  });
  const total = totalOverride !== undefined ? totalOverride : answeredQuestions.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;
  return { correct, total, accuracy };
}
 

export function calculateEstimatedScore(answeredQuestions, answersMap, scale, totalOverride) {
  const total = totalOverride !== undefined ? totalOverride : answeredQuestions.length;
  if (total === 0) return scale.min;

  let earned = 0;
  let possible = 0;

  answeredQuestions.forEach((q) => {
    const weight = q.difficultyScore || 500;
    possible += weight;
    if (isQuestionCorrect(q, answersMap[q.id])) {
      earned += weight;
    }
  });

  
  const missingCount = Math.max(0, total - answeredQuestions.length);
  possible += missingCount * 500;

  const ratio = possible > 0 ? earned / possible : 0;
  const raw = scale.min + ratio * (scale.max - scale.min);
  return Math.round(raw / 5) * 5;
}
 

export function buildBreakdown(answeredQuestions, answersMap) {
  const breakdown = {};
  answeredQuestions.forEach((q) => {
    const saved = answersMap[q.id];
    breakdown[q.id] = {
      user: saved ? saved.value : null,
      correct: q.type === "graphicsInterpretation" || q.type === "twoPartAnalysis" ? null : q.answer,
      isCorrect: isQuestionCorrect(q, saved)
    };
  });
  return breakdown;
}