// CategoryListPage.js - YOUR ORIGINAL CODE + HARDCODED DATA
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CategoryListPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // ✅ HARDCODED - Replaces broken imports
  const CATEGORIES = [
    { id: "personality", name: "Personality Tests", desc: "Discover your core personality traits" },
    { id: "career", name: "Career Tests", desc: "Find your ideal career path" }
  ];

  /* ... inside CategoryListPage.js ... */

  const ALL_TESTS = [
    {
      id: "leftright",
      name: "Left Brain and Right Brain Assessment",
      category: "personality",
      desc: "Discover your brain dominance and thinking style",
      mins: 5,
      questions: 5
    },
    {
      id: "bigfive",
      name: "Big Five Personality",
      category: "personality",
      desc: "Most scientifically validated personality test",
      mins: 15,
      questions: 50
    },
    {
      id: "mbti",
      name: "MBTI (16 Personalities)",
      category: "personality",
      desc: "Popular personality type indicator",
      mins: 12,
      questions: 93
    },
    {
      id: "16pf",
      name: "16PF Questionnaire",
      category: "personality",
      desc: "Comprehensive personality assessment",
      mins: 20,
      questions: 185
    },
    {
      id: "eqtest", // Added EQ Test
      name: "Emotional Intelligence (EQ) Test",
      category: "personality",
      desc: "Measure your emotional intelligence quotient",
      mins: 10,
      questions: 20
    },
    {
      id: "drphils", // Added EQ Test
      name: "Dr.Phil's",
      category: "personality",
      desc: "See yourself as others see you",
      mins: 10,
      questions: 10
    },
    {
      id: "perception", // Added EQ Test
      name: "Perception Personality",
      category: "personality",
      desc: "Words that describes you",
      mins: 10,
      questions: 10
    },
    {
      id: "diagramanalysis", // Added EQ Test
      name: "Diagram Analysis",
      category: "personality",
      desc: "Personality based on diagram",
      mins: 10,
      questions: 10
    },
    {
      id: "geometry", // Added EQ Test
      name: "Psychology of Geometry",
      category: "personality",
      desc: "Personality based on geometry shapes",
      mins: 10,
      questions: 4
    },
    {
      id: "sqtest",
      name: "SQ Test",
      category: "personality",
      desc: "Measure your social skills",
      mins: 15,
      questions: 20
    },
    {
      id: "pqtest",
      name: "PQ Test",
      category: "personality",
      desc: "Measure your personality skills",
      mins: 15,
      questions: 20
    },
   
    {
      id: "career-anchor",
      name: "Career Orientations",
      category: "career",
      desc: "Discover your career anchor and motivations",
      mins: 10,
      questions: 40
    },
    {
      id: "riasec",
      name: "RIASEC (Holland Code)",
      category: "career",
      desc: "Personality-based career interest assessment",
      mins: 10,
      questions: 48
    },
    {
      id: "iqtest",
      name: "IQ Test",
      category: "career",
      desc: "Measure your cognitive abilities",
      mins: 15,
      questions: 20
    }
  ];

  const categoryTests = ALL_TESTS.filter((t) => t.category === categoryId);

  const handleStart = (test) => {
    if (test.id === "leftright") {
      navigate("/tests/personality/leftright");
    } else if (test.id === "bigfive") {
      navigate("/tests/personality/bigfive");
    } else if (test.id === "mbti") {
      navigate("/tests/personality/mbti");
    } else if (test.id === "16pf") {
      navigate("/tests/personality/16pf");
    } else if (test.id === "eqtest") {
      navigate("/tests/personality/eqtest");
    }
    else if (test.id === "career-anchor") {
      navigate("/tests/career/career-anchor");
    }
    else if (test.id === "riasec") {
      navigate("/tests/career/riasec");
    }
    else if (test.id === "iqtest") {
      navigate("/tests/career/iqtest");
    }
    else {
      navigate(`/tests/${test.category}/${test.id}`);
    }
  };

  /* ... rest of the file ... */
}

export default CategoryListPage;
