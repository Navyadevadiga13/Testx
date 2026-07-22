import MAT_CONFIG from "./MatConfig";

export function isQuestionCorrect(q, userAnswer) {
  if (userAnswer === null || userAnswer === undefined || userAnswer === "") return false;
  return String(userAnswer).toUpperCase() === String(q.answer).toUpperCase();
}

export function markForQuestion(q, userAnswer) {
  const attempted = userAnswer !== null && userAnswer !== undefined && userAnswer !== "";
  if (!attempted) return MAT_CONFIG.marking.unattempted;
  return isQuestionCorrect(q, userAnswer) ? MAT_CONFIG.marking.correct : MAT_CONFIG.marking.wrong;
}

export function calculateScore(questions, answersMap) {
  let marks = 0;
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  questions.forEach((q) => {
    const val = answersMap[q.id];
    const attempted = val !== null && val !== undefined && val !== "";
    marks += markForQuestion(q, val);

    if (!attempted) unattempted += 1;
    else if (isQuestionCorrect(q, val)) correct += 1;
    else wrong += 1;
  });

  marks = Math.round(marks * 100) / 100; 

  return {
    marks,
    correct,
    wrong,
    unattempted,
    total: questions.length,
    accuracy: correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 1000) / 10 : 0
  };
}

export function buildBreakdown(questions, answersMap) {
  const breakdown = {};
  questions.forEach((q) => {
    const val = answersMap[q.id];
    const attempted = val !== null && val !== undefined && val !== "";
    breakdown[q.id] = {
      user: attempted ? val : null,
      correct: q.answer,
      isCorrect: attempted ? isQuestionCorrect(q, val) : false,
      mark: markForQuestion(q, val)
    };
  });
  return breakdown;
}


export function calculatePercentile(rawMarks, otherRawScores) {
  if (Array.isArray(otherRawScores) && otherRawScores.length > 0) {
    const below = otherRawScores.filter((s) => s < rawMarks).length;
    return Math.round((below / otherRawScores.length) * 1000) / 10;
  }

 
  const maxMarks = MAT_CONFIG.totalMarks;
  const ratio = Math.max(0, Math.min(1, rawMarks / maxMarks));
  const curved = Math.pow(ratio, 1.6); 
  return Math.round(curved * 1000) / 10;
}

export function estimateCompositeScore(percentile) {
  const band = MAT_CONFIG.percentileBands.find((b) => percentile >= b.minPercentile);
  if (!band) return MAT_CONFIG.compositeScale.min;


  const bandIndex = MAT_CONFIG.percentileBands.indexOf(band);
  const nextBoundary = bandIndex > 0 ? MAT_CONFIG.percentileBands[bandIndex - 1].minPercentile : 100;
  const span = nextBoundary - band.minPercentile;
  const posInBand = span > 0 ? (percentile - band.minPercentile) / span : 0;

  const score = band.minScore + posInBand * (band.maxScore - band.minScore);
  return Math.round(score);
}