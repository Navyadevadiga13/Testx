import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiSave, FiArrowRight, FiArrowLeft, FiCheckCircle, FiLogOut } from "react-icons/fi";
import getApiBaseUrl from "../../utils/api";
 
import PGCET_CONFIG from "./PgcetmcaConfig";
import pgcetmcaMathematics from "./PgcetmcaMathematics";
import pgcetmcaComputerAwareness from "./PgcetmcaComputerAwareness";
import pgcetmcaAnalyticalReasoning from "./PgcetmcaAnalyticalReasoning";
import pgcetmcaGeneralAwareness from "./PgcetmcaGeneralAwareness";
import pgcetmcaGeneralEnglish from "./PgcetmcaGeneralEnglish";
 

const DATA_MAP = {
  mathematics: pgcetmcaMathematics,
  computerAwareness: pgcetmcaComputerAwareness,
  analyticalReasoning: pgcetmcaAnalyticalReasoning,
  generalAwareness: pgcetmcaGeneralAwareness,
  generalEnglish: pgcetmcaGeneralEnglish
};
 

const SECTIONS = PGCET_CONFIG.sections.map((s) => ({
  ...s,
  questions: DATA_MAP[s.key] || []
}));
 

const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);
 
export default function PgcetmcaTest() {
  const navigate = useNavigate();
 
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(PGCET_CONFIG.durationMinutes * 60);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [focusedQId, setFocusedQId] = useState(null);
 
  const questionRefs = useRef({});
  const submittedRef = useRef(false); 
  const answersRef = useRef({});

  const API_URL = getApiBaseUrl();
  const currentSection = SECTIONS[activeSectionIndex];
  const isLastSection = activeSectionIndex === SECTIONS.length - 1;
 

 
  
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  
  useEffect(() => {
    if (showResult) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult]);
 
  

  useEffect(() => {
    if (currentSection && currentSection.questions.length > 0) {
      setFocusedQId(currentSection.questions[0].id);
    }
  }, [activeSectionIndex]); 
 
  useEffect(() => {
    if (focusedQId !== null && questionRefs.current[focusedQId]) {
      questionRefs.current[focusedQId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusedQId]);
 
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };
 

  const handleSelect = (qId, letter) => {
    if (showResult) return;
    setAnswers((prev) => ({ ...prev, [qId]: letter }));
  };
 
  const isAnswered = (id) => answers[id] !== undefined && answers[id] !== "";
 
  const getResult = (item) => {
    if (!showResult) return null;
    return (answers[item.id] || "").toUpperCase() === (item.answer || "").toUpperCase();
  };
 
  const saveTestResult = async (finalScore, breakdown) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          testName: "PGCET MCA Mock Test",
          result: {
            score: finalScore,
            total: PGCET_CONFIG.totalMarks,
            percentage: Math.round((finalScore / PGCET_CONFIG.totalMarks) * 100),
            breakdown
          }
        })
      });
      const data = await response.json();
      console.log("PGCET MCA result saved:", data);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };
 
  const calculateScore = () => {
    let newScore = 0;
    const breakdown = {};
    const liveAnswers = answersRef.current;

    ALL_QUESTIONS.forEach((q) => {
      const userAns = (liveAnswers[q.id] || "").toUpperCase();
      const correctAns = (q.answer || "").toUpperCase();
      const isCorrect = userAns !== "" && userAns === correctAns;
      if (isCorrect) newScore += 1;
      breakdown[q.id] = { user: liveAnswers[q.id] || null, correct: q.answer, isCorrect };
    });

    setScore(newScore);
    return { newScore, breakdown };
  };
 
  const handleSubmit = () => {
    if (submittedRef.current) return; 
    submittedRef.current = true;
 
    const { newScore, breakdown } = calculateScore();
    setShowResult(true);
    window.scrollTo(0, 0);
    saveTestResult(newScore, breakdown);
  };
 
  const goNextSection = () => {
    if (isLastSection) {
      handleSubmit();
    } else {
      setActiveSectionIndex((i) => i + 1);
      window.scrollTo(0, 0);
    }
  };
  const goPrevSection = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex((i) => i - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleExitTest = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit? Your progress will not be saved and the timer will reset if you start the test again."
    );
    if (confirmExit) {
      navigate("/");
    }
  };
 
  // ---------- RESULT SCREEN ----------
  if (showResult) {
    return (
      <div className="pgcet-result-container">
        <style jsx>{`
          .pgcet-result-container {
            min-height: 100vh;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 2rem;
            padding-top: 120px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .result-card {
            width: 100%;
            max-width: 560px;
            background: #ffffff;
            border: 1px solid #bbf7d0;
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          .result-score {
            font-size: 3rem;
            font-weight: 800;
            color: #16a34a;
            margin: 1rem 0 0.5rem 0;
          }
          .result-sub {
            color: #6b7280;
            margin-bottom: 2rem;
          }
          .primary-btn {
            background: #16a34a;
            color: white;
            border: none;
            padding: 0.9rem 2.2rem;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
        <div className="result-card">
          <FiCheckCircle style={{ fontSize: "3rem", color: "#19fd91" }} />
          <div className="result-score">{score} / {PGCET_CONFIG.totalMarks}</div>
          <p className="result-sub">
            Your PGCET mock test has been submitted and saved.
          </p>
          <button className="primary-btn" onClick={() => navigate("/profile")}>
            Go to Profile
          </button>
        </div>
      </div>
    );
  }
 
  // ---------- MAIN TEST SCREEN ----------
  return (
    <div className="pgcet-container">
      <style jsx>{`
        * { box-sizing: border-box; }
 
        .pgcet-container {
          min-height: 100px;
          background: #ffffff;
          padding: 1.5rem;
          padding-top: 220px;
          padding-bottom: 100px; /* room for the fixed nav dock */
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
 
        .top-bar {
          position: fixed;
          top: 80px;              
          left: 0;
          right: 0;
          z-index: 20;
          background: #ffffff;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #d1fae5;
          padding: 1rem 1.5rem;   
          flex-wrap: wrap;
          gap: 0.75rem;
        }
 
        .test-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #166534;
        }
 
        .section-label {
          font-size: 0.95rem;
          color: #6b7280;
          margin-top: 2px;
        }
 
        .timer-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 1.2rem;
          font-weight: 800;
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #166534;
        }
 
        .timer-warning {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fca5a5;
        }
 
        .questions-wrap {
          max-width: 900px;
          margin: 0 auto;
        }
 
        .question-card {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          padding: 1.2rem 1.4rem;
          margin-bottom: 1rem;
          scroll-margin-top: 20px;
        }
 
        .question-card.focused-card {
          border-color: #16a34a;
          background: #f0fdf4;
        }
 
        .q-top {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          margin-bottom: 0.9rem;
        }
 
        .q-num {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #dcfce7;
          color: #15803d;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
 
        .q-text {
          color: #14532d;
          font-size: 1rem;
          line-height: 1.5;
        }
 
        .options-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding-left: 2.5rem;
        }
 
        .option-row {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.6rem 0.9rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.92rem;
          color: #374151;
          transition: all 0.15s ease;
        }
 
        .option-row:hover {
          background: #f9fffb;
        }
 
        .option-row.selected {
          border-color: #16a34a;
          background: #f0fdf4;
          color: #14532d;
          font-weight: 600;
        }
 
        .option-row.correct-opt {
          border-color: #16a34a;
          background: #dcfce7;
        }
 
        .option-row.wrong-opt {
          border-color: #ef4444;
          background: #fee2e2;
        }
 
        .nav-dock {
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #d1fae5;
          padding: 0.6rem 1.2rem 0.7rem 1.2rem;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
        }
 
        .nav-dock-inner {
          max-width: 900px;
          margin: 0 auto;
        }
 
        .nav-dock-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 0.5rem;
        }
 
        .nav-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          margin-bottom: 0.3rem;
          max-height: 40px;
          overflow-y: auto;
        }
 
        .nav-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #d1fae5;
          background: #ffffff;
          color: #15803d;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
        }
 
        .nav-btn.answered {
          background: #dcfce7;
          border-color: #16a34a;
        }
 
        .nav-btn.focused {
          background: #16a34a;
          color: white;
        }
 
        .dock-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .dock-footer-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .dock-footer-right {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .btn-secondary {
          background: #ffffff;
          color: #166534;
          border: 1px solid #bbf7d0;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary:hover {
          background: #f0fdf4;
        }

        .btn-exit {
          background: #ffffff;
          color: #dc2626;
          border: 1px solid #fca5a5;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
        }

        .btn-exit:hover {
          background: #fee2e2;
        }
 
        .btn-primary {
          background: #16a34a;
          color: white;
          border: none;
          padding: 0.8rem 1.8rem;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
 
        @media (max-width: 600px) {
          .pgcet-container { padding-bottom: 260px; padding-top: 220px; }
          .options-wrap { padding-left: 0; }
          .top-bar { flex-direction: column; align-items: flex-start; gap: 0.4rem; padding: 0.8rem 1rem; }
          .test-title { font-size: 1.1rem; }
          .timer-box { font-size: 1rem; padding: 6px 12px; }
          .q-text { font-size: 0.92rem; }
          .nav-btn { width: 26px; height: 26px; font-size: 0.68rem; }
        }
      `}</style>
 
      <div className="top-bar">
        <div>
          <div className="test-title">{PGCET_CONFIG.title}</div>
          <div className="section-label">
            Section {activeSectionIndex + 1} of {SECTIONS.length}: {currentSection.label}
          </div>
        </div>
        <div className={`timer-box ${timeLeft < 300 ? "timer-warning" : ""}`}>
          <FiClock /> {formatTime(timeLeft)}
        </div>
      </div>
 
      <div className="questions-wrap">
        {currentSection.questions.map((q) => {
          const focused = focusedQId === q.id;
          const selected = answers[q.id];
          return (
            <div
              key={q.id}
              ref={(el) => (questionRefs.current[q.id] = el)}
              className={`question-card ${focused ? "focused-card" : ""}`}
              onClick={() => setFocusedQId(q.id)}
            >
              <div className="q-top">
                <div className="q-num">{q.id}</div>
                <div className="q-text">{q.question}</div>
              </div>
 
              <div className="options-wrap">
                {q.options.map((opt) => {
                  const letter = opt.trim().charAt(0);
                  const isSelected = selected === letter;
                  let cls = "option-row";
                  if (isSelected) cls += " selected";
                  if (showResult) {
                    if (letter === (q.answer || "").toUpperCase()) cls += " correct-opt";
                    else if (isSelected) cls += " wrong-opt";
                  }
                  return (
                    <div
                      key={opt}
                      className={cls}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(q.id, letter);
                      }}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
 
      <div className="nav-dock">
        <div className="nav-dock-inner">
          <div className="nav-dock-label">
            {currentSection.label} — Q{currentSection.idRange[0]}–{currentSection.idRange[1]}
          </div>
          <div className="nav-buttons">
            {currentSection.questions.map((q) => {
              const answered = isAnswered(q.id);
              const focused = focusedQId === q.id;
              let cls = "nav-btn";
              if (focused) cls += " focused";
              else if (answered) cls += " answered";
              return (
                <button key={q.id} className={cls} onClick={() => setFocusedQId(q.id)}>
                  {q.id}
                </button>
              );
            })}
          </div>
          <div className="dock-footer">
            <div className="dock-footer-left">
              <button className="btn-exit" onClick={handleExitTest}>
                <FiLogOut /> Exit
              </button>
              <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                {Object.keys(answers).length} / {PGCET_CONFIG.totalQuestions} answered
              </span>
            </div>
            <div className="dock-footer-right">
              {activeSectionIndex > 0 && (
                <button className="btn-secondary" onClick={goPrevSection}>
                  <FiArrowLeft /> Previous Section
                </button>
              )}
              <button className="btn-primary" onClick={goNextSection}>
                {isLastSection ? (
                  <>Submit Test <FiSave /></>
                ) : (
                  <>Next Section <FiArrowRight /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}