const GMAT_CONFIG = {
  title: "GMAT Mock Test",
  totalQuestions: 64,
  maxAnswerChangesPerSection: 3,
  overallScoreScale: { min: 205, max: 805 },
  sectionScoreScale: { min: 60, max: 90 },
  sections: [
    {
      key: "quantitative",
      label: "Quantitative Reasoning",
      count: 21,
      timeLimitMinutes: 45
    },
    {
      key: "verbal",
      label: "Verbal Reasoning",
      count: 23,
      timeLimitMinutes: 45
    },
    {
      key: "dataInsights",
      label: "Data Insights",
      count: 20,
      timeLimitMinutes: 45
    }
  ]
};
 
export default GMAT_CONFIG;

