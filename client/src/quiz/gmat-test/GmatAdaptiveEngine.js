const STARTING_ABILITY = 550; 
const ABILITY_STEP = 60; 

export function getStartingAbility() {
  return STARTING_ABILITY;
}

export function updateAbility(currentAbility, wasCorrect) {
  return wasCorrect ? currentAbility + ABILITY_STEP : currentAbility - ABILITY_STEP;
}


const TOLERANCE = 40; 

export function selectNextQuestion(bank, usedIds, ability) {
  const remaining = bank.filter((q) => !usedIds.includes(q.id));
  if (remaining.length === 0) return null;

  let bestDiff = Infinity;
  remaining.forEach((q) => {
    const diff = Math.abs((q.difficultyScore || 500) - ability);
    if (diff < bestDiff) bestDiff = diff;
  });

  const candidates = remaining.filter(
    (q) => Math.abs((q.difficultyScore || 500) - ability) <= bestDiff + TOLERANCE
  );

  return candidates[Math.floor(Math.random() * candidates.length)];
}


export function selectNextVerbalQuestion(bank, usedIds, ability, activePassageId) {
  if (activePassageId) {
    const samePassageRemaining = bank.filter(
      (q) => q.passageId === activePassageId && !usedIds.includes(q.id)
    );
    if (samePassageRemaining.length > 0) {
      return { question: samePassageRemaining[0], activePassageId };
    }
  }

  const next = selectNextQuestion(bank, usedIds, ability);
  return { question: next, activePassageId: next && next.passageId ? next.passageId : null };
}