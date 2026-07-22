const MAT_CONFIG = {
  title: "MAT Mock Test",
  totalQuestions: 150,
  totalMarks: 150,
  durationMinutes: 120, 
  sections: [
    { key: "languageComprehension", label: "Language Comprehension", count: 30, idRange: [1, 30] },
    { key: "intelligenceReasoning", label: "Intelligence and Critical Reasoning", count: 30, idRange: [31, 60] },
    { key: "dataAnalysis", label: "Data Analysis and Sufficiency", count: 30, idRange: [61, 90] },
    { key: "mathematicalSkills", label: "Mathematical Skills", count: 30, idRange: [91, 120] },
    { key: "economicBusiness", label: "Economic & Business Environment", count: 30, idRange: [121, 150] }
  ],
  marking: {
    correct: 1,
    wrong: -0.25,
    unattempted: 0
  },
  compositeScale: { min: 200, max: 800 },
  
  percentileBands: [
    { minPercentile: 99, minScore: 760, maxScore: 800 },
    { minPercentile: 95, minScore: 700, maxScore: 759 },
    { minPercentile: 90, minScore: 650, maxScore: 699 },
    { minPercentile: 80, minScore: 600, maxScore: 649 },
    { minPercentile: 70, minScore: 550, maxScore: 599 },
    { minPercentile: 60, minScore: 500, maxScore: 549 },
    { minPercentile: 50, minScore: 450, maxScore: 499 },
    { minPercentile: 0, minScore: 200, maxScore: 449 }
  ]
};

export default MAT_CONFIG;