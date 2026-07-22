import CAT_CONFIG from "./CatConfig";


const normalizeTita = (val) => {
  if (val === null || val === undefined) return "";
  return String(val).trim().replace(/\s+/g, " ").toLowerCase();
};

export function isQuestionCorrect(q, userAnswer) {
  if (userAnswer === null || userAnswer === undefined || userAnswer === "") return false;

  if (q.type === "tita") {
    return normalizeTita(userAnswer) === normalizeTita(q.answer);
  }

  
  return String(userAnswer).toUpperCase() === String(q.answer).toUpperCase();
}


export function markForQuestion(q, userAnswer) {
  const attempted = userAnswer !== null && userAnswer !== undefined && userAnswer !== "";
  if (!attempted) return CAT_CONFIG.marking.unattempted;

  const correct = isQuestionCorrect(q, userAnswer);
  if (correct) return CAT_CONFIG.marking.correct;

  return q.type === "tita" ? CAT_CONFIG.marking.wrongTita : CAT_CONFIG.marking.wrongMcq;
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

    if (!attempted) {
      unattempted += 1;
    } else if (isQuestionCorrect(q, val)) {
      correct += 1;
    } else {
      wrong += 1;
    }
  });

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
      type: q.type || "mcq",
      isCorrect: attempted ? isQuestionCorrect(q, val) : false,
      mark: markForQuestion(q, val)
    };
  });
  return breakdown;
}