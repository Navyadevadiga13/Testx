export const ALL_TESTS = [
  // ✅ PERSONALITY category - ONLY these go here
  { 
    id: "leftright", 
    name: "Left Brain and Right Brain Assessment", 
    category: "personality",  // ← Must be "personality"
    desc: "Discover your brain dominance and thinking style",
    mins: 5, 
    questions: 5 
  },
  { 
    id: "bigfive", 
    name: "Big Five Personality", 
    category: "personality",  // ← Must be "personality"
    desc: "The most scientifically validated personality test",
    mins: 5, 
    questions: 50 
  },
  { 
    id: "mbti", 
    name: "MBTI", 
    category: "personality",  // ← Must be "personality" 
    desc: "Myers-Briggs Type Indicator",
    mins: 8, 
    questions: 93 
  },
  { 
    id: "16pf", 
    name: "16PF", 
    category: "personality",  // ← Must be "personality"
    desc: "16 Personality Factors test", 
    mins: 12,
    questions: 169 
  },

  // ✅ CAREER category - ONLY this goes here  
  {
    id: "career-anchor",
    name: "Career Orientations Inventory", 
    category: "career",       // ← Must be "career"
    desc: "Schein's Career Anchor test - discover your career values",
    mins: 6,
    questions: 40
  }
  ,
  {
    id: "riasec",
    name: "RIASEC (Holland Code)",
    category: "career",
    desc: "RIASEC interest inventory based on Holland's vocational typology",
    mins: 8,
    questions: 42
  }
];
//   // ❌ QUOTIENT category - NONE go here