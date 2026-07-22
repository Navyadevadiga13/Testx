const PGCET_CONFIG = {
  title: "PGCET MCA Mock Test",
  totalQuestions: 100,
  totalMarks: 100,
  durationMinutes: 120,
  sections: [
    { key: "mathematics", label: "Mathematics", count: 30, idRange: [1, 30] },
    { key: "computerAwareness", label: "Computer Awareness", count: 25, idRange: [31, 55] },
    { key: "analyticalReasoning", label: "Analytical Ability & Logical Reasoning", count: 15, idRange: [56, 70] },
    { key: "generalAwareness", label: "General Awareness", count: 20, idRange: [71, 90] },
    { key: "generalEnglish", label: "General English", count: 10, idRange: [91, 100] }
  ]
};
 
export default PGCET_CONFIG;
