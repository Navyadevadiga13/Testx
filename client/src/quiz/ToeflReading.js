import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

// --- PBT READING DATA (5 passages, 5 questions each = 25 questions) ---
const readingModules = [
  {
    id: "pbtReading",
    title: "TOEFL Reading Test",
    sections: [
      {
        id: "passage1",
        type: "academic",
        title: "Photosynthesis",
        passage: `Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a by‑product. It is critical for life on Earth because it produces the oxygen we breathe and forms the base of most food chains. The process occurs in the chloroplasts, specifically in structures called thylakoids. The light energy is used to split water molecules, releasing oxygen. The hydrogen from water then combines with carbon dioxide to form glucose.`,
        questions: [
          { id: 1, question: "What is the main topic of the passage?", options: ["Plant reproduction", "Photosynthesis", "Cellular respiration", "Plant genetics"], correct: 1 },
          { id: 2, question: "According to the passage, where does photosynthesis occur within a plant cell?", options: ["In the nucleus", "In the mitochondria", "In the chloroplasts", "In the cell wall"], correct: 2 },
          { id: 3, question: "What is released as a by‑product of photosynthesis?", options: ["Carbon dioxide", "Glucose", "Oxygen", "Hydrogen"], correct: 2 },
          { id: 4, question: "The word 'synthesize' in line 1 is closest in meaning to...", options: ["separate", "create", "destroy", "analyze"], correct: 1 },
          { id: 5, question: "Why is photosynthesis described as 'critical for life on Earth'?", options: ["It produces carbon dioxide for plants.", "It creates food and oxygen for other organisms.", "It regulates global temperatures.", "It prevents soil erosion."], correct: 1 }
        ]
      },
      {
        id: "passage2",
        type: "academic",
        title: "The Industrial Revolution",
        passage: `The Industrial Revolution was a period of major industrialization that took place during the late 1700s and early 1800s. It began in Great Britain and quickly spread throughout the world. This time period saw the mechanization of agriculture and textile manufacturing, and a revolution in power, including steam ships and railroads, that affected social, cultural and economic conditions. Factories emerged, leading to urbanization as people moved to cities for work. Working conditions were often harsh, prompting the rise of labor movements.`,
        questions: [
          { id: 6, question: "Where did the Industrial Revolution begin?", options: ["United States", "France", "Great Britain", "Germany"], correct: 2 },
          { id: 7, question: "Which of the following was NOT mentioned in the passage?",
options: [
  "Agriculture",
  "Textile manufacturing",
  "Computer programming",
  "Steamships and railroads"
],
correct: 2 },
          { id: 8, question: "The word 'urbanization' in line 5 is closest in meaning to...", options: ["movement to rural areas", "growth of cities", "population decline", "industrial decline"], correct: 1 },
          { id: 9, question: "According to the passage, what contributed to the rise of labor movements?", options: ["Improved working conditions", "Harsh working conditions", "Government regulations", "Technological advances"], correct: 1 },
          { id: 10, question: "What is the main idea of the passage?", options: ["The Industrial Revolution had only positive effects.", "The Industrial Revolution brought major changes to society and the economy.", "The Industrial Revolution began in the United States.", "The Industrial Revolution ended in the 1700s."], correct: 1 }
        ]
      },
      {
        id: "passage3",
        type: "academic",
        title: "The Solar System",
        passage: `The Solar System consists of the Sun and the objects that orbit it, including eight planets, their moons, and various smaller bodies like asteroids and comets. The four inner planets—Mercury, Venus, Earth, and Mars—are rocky and relatively small. The outer planets—Jupiter, Saturn, Uranus, and Neptune—are gas giants, much larger and composed mainly of hydrogen and helium. The Sun contains 99.8% of the Solar System's mass, exerting gravitational pull that keeps everything in orbit.`,
        questions: [
          { id: 11, question: "What percentage of the Solar System's mass is contained in the Sun?", options: ["90%", "95%", "99.8%", "100%"], correct: 2 },
          { id: 12, question: "Which planets are described as 'gas giants'?", options: ["Mercury, Venus, Earth, Mars", "Jupiter, Saturn, Uranus, Neptune", "Mars, Jupiter, Saturn, Uranus", "Earth, Mars, Jupiter, Saturn"], correct: 1 },
          { id: 13, question: "The word 'exerting' in line 5 is closest in meaning to...", options: ["releasing", "applying", "reducing", "avoiding"], correct: 1 },
          { id: 14, question: "What keeps the planets in orbit around the Sun?", options: ["Solar wind", "Magnetic fields", "Gravitational pull", "Atmospheric pressure"], correct: 2 },
          { id: 15, question: "According to the passage, which planets are rocky and small?", options: ["The outer planets", "The inner planets", "All planets", "Only Earth and Mars"], correct: 1 }
        ]
      },
      {
        id: "passage4",
        type: "academic",
        title: "The Great Wall of China",
        passage: `The Great Wall of China is a series of fortifications built across the northern borders of China to protect against invasions. Construction began as early as the 7th century BC, but the most famous sections were built during the Ming Dynasty (1368–1644). The wall stretches over 13,000 miles, though not continuously. It was built using various materials, including earth, wood, and stone. Thousands of workers, including soldiers and peasants, labored on its construction.`,
        questions: [
          { id: 16, question: "What was the primary purpose of the Great Wall?", options: ["Trade route", "Defense against invasions", "Religious pilgrimage", "Agricultural boundary"], correct: 1 },
          { id: 17, question: "During which dynasty were the most famous sections built?", options: ["Qin Dynasty", "Ming Dynasty", "Tang Dynasty", "Song Dynasty"], correct: 1 },
          { id: 18, question: "The word 'fortifications' in line 1 is closest in meaning to...", options: ["palaces", "defensive structures", "temples", "bridges"], correct: 1 },
          { id: 19, question: "Approximately how long is the Great Wall?", options: ["5,000 miles", "10,000 miles", "13,000 miles", "20,000 miles"], correct: 2 },
         {
  id: 20,
  question: "Who built the Great Wall?",
  options: [
    "Only soldiers",
    "Only peasants",
    "Soldiers and peasants",
    "Foreign laborers"
  ],
  correct: 2
}
        ]
      },
      {
        id: "passage5",
        type: "academic",
        title: "The Amazon Rainforest",
        passage: `The Amazon Rainforest is the largest tropical rainforest in the world, covering much of northwestern Brazil and extending into Colombia, Peru, and other South American countries. It is home to an immense biodiversity, including millions of species of insects, plants, birds, and mammals. The rainforest plays a critical role in regulating the global climate by absorbing carbon dioxide and producing oxygen. However, deforestation for agriculture and logging poses a serious threat to this ecosystem.`,
        questions: [
          { id: 21, question: "Where is the Amazon Rainforest primarily located?", options: ["Africa", "Southeast Asia", "South America", "Central America"], correct: 2 },
          { id: 22, question: "What is the main threat to the Amazon Rainforest mentioned in the passage?", options: ["Climate change", "Deforestation", "Urbanization", "Pollution"], correct: 1 },
          { id: 23, question: "The word 'immense' in line 3 is closest in meaning to...", options: ["small", "limited", "huge", "unknown"], correct: 2 },
          { id: 24, question: "According to the passage, what role does the Amazon play in the global climate?", options: ["It releases carbon dioxide.", "It absorbs carbon dioxide and produces oxygen.", "It increases global temperatures.", "It has no effect on climate."], correct: 1 },
          { id: 25, question: "What is the main idea of the passage?", options: ["The Amazon has many species of insects.", "The Amazon is important for biodiversity and climate, but is threatened.", "The Amazon is located only in Brazil.", "The Amazon produces most of the world's oxygen."], correct: 1 }
        ]
      }
    ]
  }
];

// --- TIMER CONFIG ---
const TEST_DURATION_SECONDS = 40 * 60; // 40 minutes

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Timer badge, rendered via portal so no ancestor CSS (transform,
// overflow:hidden, z-index stacking contexts, etc.) can hide or clip it ──────
function TimerBadge({ timeLeft, isMobile }) {
  const isTimeLow = timeLeft <= 5 * 60; // last 5 minutes
  const isTimeCritical = timeLeft <= 60; // last 1 minute

  const badge = (
    <div style={{
      position: "fixed",
      top: isMobile ? "80px" : "110px",
      right: isMobile ? "28px" : "65px",
      zIndex: 2147483647, // max z-index, guarantees it's on top of everything
      background: isTimeCritical ? "#fdeceb" : isTimeLow ? "#fff6e5" : "#eaf7f0",
      border: `1.5px solid ${isTimeCritical ? "#e05a4e" : isTimeLow ? "#e0a63c" : "#2e7d52"}`,
      borderRadius: "30px",
      padding: isMobile ? "6px 12px" : "8px 18px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      pointerEvents: "none",
    }}>
      <span style={{ fontSize: isMobile ? "0.78rem" : "0.85rem", fontWeight: "600", color: "#555" }}>
        Time Left
      </span>
      <span style={{
        fontSize: isMobile ? "0.95rem" : "1.05rem",
        fontWeight: "800",
        fontVariantNumeric: "tabular-nums",
        color: isTimeCritical ? "#c0392b" : isTimeLow ? "#a06a10" : "#1a5c3a",
      }}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );

  // Render directly into document.body so it can never be clipped or
  // covered because of a parent's transform/overflow/z-index.
  return typeof document !== "undefined"
    ? ReactDOM.createPortal(badge, document.body)
    : badge;
}

// ── Responsive hook ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function ToeflReading() {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const [selectedModule] = useState(readingModules[0].id);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [mcAnswers, setMcAnswers] = useState({});
  const [showPassage, setShowPassage] = useState(true); // mobile tab toggle
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const hasAutoSubmittedRef = useRef(false);

  const currentModule = readingModules.find((m) => m.id === selectedModule);
  const currentSection = currentModule.sections[currentSectionIndex];
  const totalSections = currentModule.sections.length;
  const isLastSection = currentSectionIndex === totalSections - 1;

  const answeredCount = Object.keys(mcAnswers).filter(k => k.startsWith(`${currentSectionIndex}-`)).length;

  const handleNext = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setShowPassage(true);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      setShowPassage(true);
      window.scrollTo(0, 0);
    }
  };

  const handleMcChange = (sectionIndex, qId, value) => {
    setMcAnswers((prev) => ({
      ...prev,
      [`${sectionIndex}-${qId}`]: value,
    }));
  };

  function convertToToeflScore(correct) {
    if (correct >= 25) return 30;
    if (correct >= 23) return 29;
    if (correct >= 21) return 28;
    if (correct >= 19) return 26;
    if (correct >= 17) return 24;
    if (correct >= 15) return 22;
    if (correct >= 13) return 20;
    if (correct >= 10) return 17;
    if (correct >= 7) return 14;
    return 10;
  }

  const calculateTotalScore = async () => {
    let correctCount = 0;
    let total = 0;
    const breakdown = [];

    currentModule.sections.forEach((section, sIdx) => {
      section.questions.forEach((q) => {
        total++;
        const rawAnswer = mcAnswers[`${sIdx}-${q.id}`];
        const userIdx = rawAnswer !== undefined ? parseInt(rawAnswer) : NaN;
        const isCorrect = userIdx === q.correct;
        if (isCorrect) correctCount++;

        const entry = {
          number: q.id,
          questionText: q.question,
          userAnswerText: rawAnswer === undefined ? "No answer" : q.options[userIdx],
          correctAnswerText: q.options[q.correct],
          isCorrect,
        };
        if (q.explanation) entry.explanation = q.explanation;
        breakdown.push(entry);
      });
    });

    const percentage = Math.round((correctCount / total) * 100);
    const toeflScore = convertToToeflScore(correctCount);
    const API_URL = getApiBaseUrl();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: "TOEFL Reading Test",
          result: { rawScore: correctCount, total, percentage, toeflScore, breakdown }
        })
      });

      const savedData = await response.json();
      if (!response.ok) {
        console.error("❌ Failed to save:", savedData);
        alert("Failed to save result.");
        return;
      }

      navigate('/quiz/toefl/result', {
        state: { correctCount, total, toeflScore, testType: "Reading (PBT)", breakdown }
      });
    } catch (error) {
      console.error("Error saving TOEFL result:", error);
    }
  };

  // Keep a ref to the latest calculateTotalScore so the timer's interval
  // (which is only created once) always calls the freshest version —
  // otherwise it would close over stale mcAnswers from the first render.
  const calculateTotalScoreRef = useRef(calculateTotalScore);
  useEffect(() => {
    calculateTotalScoreRef.current = calculateTotalScore;
  });

  // ── 40-minute countdown timer ──────────────────────────────────────────────
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Auto-submit once the timer hits zero
  useEffect(() => {
    if (timeLeft === 0 && !hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = true;
      calculateTotalScoreRef.current();
    }
  }, [timeLeft]);

  // ── Shared styles ──────────────────────────────────────────────────────────
  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #c8e6d4",
    borderRadius: "12px",
    padding: isMobile ? "1rem" : "1.2rem",
  };

  const panelHeight = isMobile ? "auto" : "62vh";
  const panelOverflow = isMobile ? "visible" : "auto";

  return (
    <div style={{
      maxWidth: "1400px",
      margin: "0 auto",
      padding: isMobile ? "90px 12px 100px" : "130px 24px 20px",
      minHeight: "100vh",
      background: "#ffffff",
      color: "#111",
    }}>

      {/* ── TIMER BADGE (portal, always on top, always visible) ── */}
      <TimerBadge timeLeft={timeLeft} isMobile={isMobile} />

      {/* ── BREADCRUMB ── */}
      <div style={{ fontSize: isMobile ? "1.1rem" : "1.4rem", color: "#555", marginBottom: "12px" }}>
        TOEFL Suite / <span style={{ color: "#2e7d52", fontWeight: "600" }}>Reading</span>
      </div>

      {/* ── INSTRUCTIONS BANNER ── */}
      <div style={{
        background: "#f4faf7",
        border: "1px solid #c8e6d4",
        borderRadius: "12px",
        padding: isMobile ? "0.85rem 1rem" : "1rem 1.4rem",
        marginBottom: "14px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? "0.6rem" : "1rem",
      }}>
        <div>
          <h3 style={{ color: "#1a5c3a", margin: "0 0 6px 0", fontSize: isMobile ? "0.88rem" : "0.95rem" }}>
            Reading Test Instructions
          </h3>
          <ul style={{ margin: 0, paddingLeft: "18px", color: "#444", fontSize: isMobile ? "0.8rem" : "0.85rem", lineHeight: "1.7" }}>
            <li>Read each passage carefully and answer all questions.</li>
            <li>{isMobile ? "Use the tabs below to switch between passage and questions." : "Use the Previous / Next buttons to move between passages."}</li>
            <li>You have 40 minutes to complete the test. It will submit automatically when time runs out.</li>
          </ul>
        </div>
        <div style={{
          borderLeft: isMobile ? "none" : "3px solid #2e7d52",
          borderTop: isMobile ? "2px solid #c8e6d4" : "none",
          paddingLeft: isMobile ? "0" : "1rem",
          paddingTop: isMobile ? "0.6rem" : "0",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <span style={{ fontWeight: "700", color: "#1a5c3a", fontSize: isMobile ? "0.88rem" : "1.1rem" }}>Important:</span>
          <span style={{ color: "#444", fontSize: isMobile ? "0.8rem" : "0.85rem" }}>
            Answer all questions based only on the information given in the passages.
          </span>
        </div>
      </div>

      {/* ── PASSAGE HEADER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        flexWrap: "wrap",
        gap: "6px",
      }}>
        <h2 style={{ margin: 0, fontSize: isMobile ? "0.95rem" : "1.1rem", color: "#1a5c3a", fontWeight: "700" }}>
          Passage {currentSectionIndex + 1}: {currentSection.title}
        </h2>
        <span style={{
          background: "#eaf7f0", border: "1px solid #c8e6d4",
          color: "#2e7d52", fontWeight: "600", fontSize: "0.78rem",
          borderRadius: "6px", padding: "3px 12px", whiteSpace: "nowrap",
        }}>
          Q{currentSection.questions[0].id}–{currentSection.questions[currentSection.questions.length - 1].id}
        </span>
      </div>

      {/* ── MOBILE TAB TOGGLE ── */}
      {isMobile && (
        <div style={{
          display: "flex",
          background: "#eaf7f0",
          borderRadius: "10px",
          padding: "4px",
          marginBottom: "12px",
          gap: "4px",
        }}>
          {["Passage", "Questions"].map((label, idx) => {
            const active = (idx === 0 && showPassage) || (idx === 1 && !showPassage);
            return (
              <button
                key={label}
                onClick={() => setShowPassage(idx === 0)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  background: active ? "#2e7d52" : "transparent",
                  color: active ? "#fff" : "#2e7d52",
                  fontWeight: "700",
                  fontSize: "0.87rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {label} {idx === 1 && `(${answeredCount}/${currentSection.questions.length})`}
              </button>
            );
          })}
        </div>
      )}

      {/* ── TWO-COLUMN LAYOUT (desktop) / SINGLE PANEL (mobile) ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: "14px",
        marginBottom: "12px",
      }}>

        {/* LEFT: Passage */}
        {(!isMobile || showPassage) && (
          <div style={{
            ...cardStyle,
            height: panelHeight,
            overflowY: panelOverflow,
          }}>
            <div style={{
              lineHeight: "1.8",
              fontSize: isMobile ? "0.88rem" : "0.92rem",
              color: "#222",
              whiteSpace: "pre-wrap",
            }}>
              {currentSection.passage}
            </div>
          </div>
        )}

        {/* RIGHT: Questions */}
        {(!isMobile || !showPassage) && (
          <div style={{
            ...cardStyle,
            height: panelHeight,
            overflowY: panelOverflow,
          }}>
            {/* Questions header — desktop only (mobile uses tab) */}
            {!isMobile && (
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #e0f0e8",
              }}>
                <h3 style={{ color: "#1a5c3a", margin: 0, fontSize: "1rem", fontWeight: "700" }}>Questions</h3>
                <span style={{
                  background: "#eaf7f0", border: "1px solid #c8e6d4",
                  color: "#2e7d52", fontSize: "0.78rem", fontWeight: "600",
                  borderRadius: "6px", padding: "2px 10px",
                }}>
                  {answeredCount}/{currentSection.questions.length} answered
                </span>
              </div>
            )}

            {currentSection.questions.map((q) => (
              <div key={q.id} style={{
                marginBottom: "1.2rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #e8f5ee",
              }}>
                <p style={{
                  fontWeight: "600", marginBottom: "8px", color: "#111",
                  fontSize: isMobile ? "0.88rem" : "0.92rem", lineHeight: "1.5",
                  marginTop: 0,
                }}>
                  {q.id}. {q.question}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {q.options.map((opt, optIdx) => {
                    const selected = mcAnswers[`${currentSectionIndex}-${q.id}`] === optIdx.toString();
                    return (
                      <label
                        key={optIdx}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: "9px",
                          cursor: "pointer",
                          padding: isMobile ? "10px 10px" : "8px 10px",
                          borderRadius: "8px",
                          background: selected ? "#e8f5ee" : "#fafffe",
                          border: selected ? "1.5px solid #2e7d52" : "1.5px solid #dceee5",
                          transition: "all 0.15s",
                          fontSize: isMobile ? "0.85rem" : "0.87rem",
                          color: "#222",
                          lineHeight: "1.5",
                        }}
                      >
                        <input
                          type="radio"
                          name={`q-${currentSectionIndex}-${q.id}`}
                          value={optIdx}
                          checked={selected}
                          onChange={(e) => handleMcChange(currentSectionIndex, q.id, e.target.value)}
                          style={{
                            accentColor: "#2e7d52",
                            width: "16px", height: "16px",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV BAR ── */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "stretch" : "center",
        gap: isMobile ? "10px" : "0",
        background: "#f9fefb",
        border: "1px solid #c8e6d4",
        borderRadius: "10px",
        padding: isMobile ? "12px" : "10px 16px",
        // On mobile, stick to bottom
        ...(isMobile ? {
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          borderRadius: "12px 12px 0 0",
          zIndex: 100,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
        } : {}),
      }}>

        {/* Passage dots + prev/next (center on desktop, top row on mobile) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          flexWrap: "wrap",
          order: isMobile ? 1 : 2,
        }}>
          <button
            onClick={handlePrev}
            disabled={currentSectionIndex === 0}
            style={{
              padding: isMobile ? "8px 14px" : "7px 16px",
              background: currentSectionIndex === 0 ? "#f0f0f0" : "#ffffff",
              color: currentSectionIndex === 0 ? "#aaa" : "#2e7d52",
              border: "1px solid #c8e6d4", borderRadius: "30px",
              cursor: currentSectionIndex === 0 ? "not-allowed" : "pointer",
              fontWeight: "600", fontSize: "0.86rem",
            }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalSections }).map((_, i) => (
            <div key={i} style={{
              width: isMobile ? "26px" : "30px",
              height: isMobile ? "26px" : "30px",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.78rem", fontWeight: "700",
              background: i === currentSectionIndex ? "#2e7d52" : "#eaf7f0",
              color: i === currentSectionIndex ? "#fff" : "#2e7d52",
              border: `1.5px solid ${i === currentSectionIndex ? "#2e7d52" : "#c8e6d4"}`,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
          ))}

          {!isLastSection ? (
            <button
              onClick={handleNext}
              style={{
                padding: isMobile ? "8px 14px" : "7px 16px",
                background: "#2e7d52", color: "#fff",
                border: "none", borderRadius: "30px", cursor: "pointer",
                fontWeight: "600", fontSize: "0.86rem",
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={calculateTotalScore}
              style={{
                padding: isMobile ? "8px 16px" : "7px 18px",
                background: "#1a5c3a", color: "#fff",
                border: "none", borderRadius: "30px", cursor: "pointer",
                fontWeight: "700", fontSize: "0.86rem",
              }}
            >
              Finish ✓
            </button>
          )}
        </div>

        {/* Exit + counter row on mobile */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          order: isMobile ? 2 : 1,
        }}>
          <button
            onClick={() => navigate("/tests")}
            style={{
              padding: "7px 18px", background: "transparent",
              border: "1px solid #c8e6d4", color: "#555",
              borderRadius: "30px", cursor: "pointer", fontSize: "0.86rem",
            }}
          >
            Exit Test
          </button>

          <span style={{ fontSize: "0.82rem", color: "#555" }}>
            Passage <strong style={{ color: "#1a5c3a" }}>{currentSectionIndex + 1}</strong> of {totalSections}
          </span>
        </div>

      </div>
    </div>
  );
}

export default ToeflReading;