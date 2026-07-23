const CAT_CONFIG = {
  title: "CAT Mock Test",
  totalQuestions: 68,
  totalMinutes: 120,

  sections: [
    { key: "varc", label: "Verbal Ability & Reading Comprehension", count: 24, timeLimitMinutes: 40, idRange: [1, 24] },
    { key: "dilr", label: "Data Interpretation & Logical Reasoning", count: 22, timeLimitMinutes: 40, idRange: [25, 46] },
    { key: "qa", label: "Quantitative Aptitude", count: 22, timeLimitMinutes: 40, idRange: [47, 68] }
  ],
  marking: {
    correct: 3,
    wrongMcq: -1,
    wrongTita: 0,
    unattempted: 0
  }
};

export default CAT_CONFIG;