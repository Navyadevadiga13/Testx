const PGCET_CONFIG = {
  title: "PGCET MBA Mock Test",
  totalQuestions: 100,
  totalMarks: 100,
  durationMinutes: 120,
  sections: [
    { key: "computerAwareness", label: "Computer Awareness", count: 20, idRange: [1, 20] },
    { key: "analyticalReasoning", label: "Analytical Ability & Logical Reasoning", count: 20, idRange: [21, 40] },
    { key: "quantitativeAnalysis", label: "Quantitative Analysis", count: 20, idRange: [41, 60] },
    { key: "englishLanguage", label: "English Language", count: 20, idRange: [61, 80] },
    { key: "generalKnowledge", label: "General Knowledge", count: 20, idRange: [81, 100] }
  ]
};
 
export default PGCET_CONFIG;