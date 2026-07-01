const OPTIONS = ["Disagree", "Slightly Disagree", "Neutral", "Slightly Agree", "Agree"];

const getVal = (answers, n) => {
  // Frontend keys might be strings "0", "1", etc.
  // Logic uses 1-based index (Question 1 is at index 0)
  const answerText = answers[n-1] || "Neutral"; 
  const idx = OPTIONS.indexOf(answerText);
  return idx === -1 ? 3 : idx + 1; // Default to 3 if missing
};

exports.calculateBigFive = (answers) => {
  const get = (n) => getVal(answers, n);

  const E = 20 + get(1) - get(6) + get(11) - get(16) + get(21) - get(26) + get(31) - get(36) + get(41) - get(46);
  const A = 14 - get(2) + get(7) - get(12) + get(17) - get(22) + get(27) - get(32) + get(37) + get(42) + get(47);
  const C = 14 + get(3) - get(8) + get(13) - get(18) + get(23) - get(28) + get(33) - get(38) + get(43) + get(48);
  const N = 38 - get(4) + get(9) - get(14) + get(19) - get(24) - get(29) - get(34) - get(39) - get(44) - get(49);
  const O = 8 + get(5) - get(10) + get(15) - get(20) + get(25) - get(30) + get(35) + get(40) + get(45) + get(50);

  const describe = (s) => (s >= 30 ? "High" : s >= 20 ? "Average" : "Low");

  return {
    raw: { E, A, C, N, O },
    description: {
      Extraversion: describe(E),
      Agreeableness: describe(A),
      Conscientiousness: describe(C),
      Neuroticism: describe(N),
      Openness: describe(O)
    }
  };
};
