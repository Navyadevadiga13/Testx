import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiSave, FiArrowRight, FiArrowLeft, FiCheckCircle, FiLogOut } from "react-icons/fi";
import getApiBaseUrl from "../../utils/api";

import MAT_CONFIG from "./MatConfig";
import matLanguageComprehension from "./MatLanguageComprehension";
import matIntelligenceReasoning from "./MatIntelligenceReasoning";
import matDataAnalysis from "./MatDataAnalysis";
import matMathematicalSkills from "./MatMathematicalSkills";
import matEconomicBusiness from "./MatEconomicBusiness";
import { calculateScore, buildBreakdown, calculatePercentile, estimateCompositeScore } from "./MatScoring";

const DATA_MAP = {
  languageComprehension: matLanguageComprehension,
  intelligenceReasoning: matIntelligenceReasoning,
  dataAnalysis: matDataAnalysis,
  mathematicalSkills: matMathematicalSkills,
  economicBusiness: matEconomicBusiness
};

const SECTIONS = MAT_CONFIG.sections.map((s) => ({
  ...s,
  questions: DATA_MAP[s.key] || []
}));

const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);

export default function MatTest() {
  const navigate = useNavigate();

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0); 
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(MAT_CONFIG.durationMinutes * 60);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);

  const submittedRef = useRef(false);
  const answersRef = useRef({});

  useEffect(() => { answersRef.current = answers; }, [answers]);

  const API_URL = getApiBaseUrl();
  const currentSection = SECTIONS[activeSectionIndex];
  const isLastSection = activeSectionIndex === SECTIONS.length - 1;

 
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
    return () => {
      if (footer) footer.style.display = "";
    };
  }, []);

  
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
    setCurrentQIndex(0); 
  }, [activeSectionIndex]);

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

  const currentQuestion = currentSection.questions[currentQIndex];

  const getSharedContext = (q) => {
    const groupId = q.passageId || q.setId;
    if (!groupId) {
      return { passage: q.passage || null, statement: q.statement || null, table: q.table || null };
    }
    const source = currentSection.questions.find(
      (sq) => (sq.passageId === groupId || sq.setId === groupId) && (sq.passage || sq.statement || sq.table)
    );
    return {
      passage: q.passage || source?.passage || null,
      statement: q.statement || source?.statement || null,
      table: q.table || source?.table || null
    };
  };

  const goNextQuestion = () => {
    if (currentQIndex < currentSection.questions.length - 1) setCurrentQIndex((i) => i + 1);
  };
  const goPrevQuestion = () => {
    if (currentQIndex > 0) setCurrentQIndex((i) => i - 1);
  };
  const jumpToQuestion = (idx) => setCurrentQIndex(idx);

  const saveTestResult = async (finalScore, percentile, composite, breakdown) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          testName: "MAT Mock Test",
          result: {
            marks: finalScore.marks,
            correct: finalScore.correct,
            wrong: finalScore.wrong,
            unattempted: finalScore.unattempted,
            total: MAT_CONFIG.totalMarks,
            percentile,
            composite,
            breakdown
          }
        })
      });
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const finalScore = calculateScore(ALL_QUESTIONS, answersRef.current);
    const percentile = calculatePercentile(finalScore.marks); 
    const composite = estimateCompositeScore(percentile);
    const breakdown = buildBreakdown(ALL_QUESTIONS, answersRef.current);

    setScore({ ...finalScore, percentile, composite });
    setShowResult(true);
    window.scrollTo(0, 0);
    saveTestResult(finalScore, percentile, composite, breakdown);
  };

  
  const goNextSection = () => {
    if (activeSectionIndex < SECTIONS.length - 1) {
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

  const handleManualSubmit = () => {
    const unansweredCount = MAT_CONFIG.totalQuestions - Object.keys(answers).length;
    const confirmMsg = unansweredCount > 0
        ? `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit the test now? This cannot be undone.`
        : "Are you sure you want to submit the test now? This cannot be undone.";
    if (window.confirm(confirmMsg)) {
        handleSubmit();
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
  if (showResult && score) {
    return (
      <div className="mat-result-container">
        <style jsx>{`
          .mat-result-container {
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
            max-width: 640px;
            background: #ffffff;
            border: 1px solid #bbf7d0;
            border-radius: 20px;
            padding: 2.5rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          .score-row { display: flex; justify-content: center; gap: 1.2rem; margin: 1.5rem 0; flex-wrap: wrap; }
          .score-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 1.1rem 1.5rem; min-width: 110px; }
          .score-num { font-size: 1.6rem; font-weight: 800; color: #16a34a; }
          .score-num.negative { color: #dc2626; }
          .score-label { font-size: 0.75rem; color: #6b7280; margin-top: 4px; }
          .composite-box { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; border-radius: 16px; padding: 1.6rem; margin-top: 1.5rem; }
          .composite-num { font-size: 2.4rem; font-weight: 900; }
          .composite-label { font-size: 0.8rem; opacity: 0.9; margin-top: 4px; }
          .disclaimer { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; font-size: 0.8rem; border-radius: 10px; padding: 0.7rem 1rem; margin-top: 1rem; }
          .primary-btn { background: #16a34a; color: white; border: none; padding: 0.9rem 2.2rem; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 1.5rem; }
        `}</style>
        <div className="result-card">
          <FiCheckCircle style={{ fontSize: "3rem", color: "#19fd91" }} />
          <h2 style={{ color: "#166534", marginTop: "0.5rem" }}>MAT Mock Test Complete</h2>

          <div className="score-row">
            <div className="score-box">
              <div className={`score-num ${score.marks < 0 ? "negative" : ""}`}>{score.marks}</div>
              <div className="score-label">Raw Marks (of {MAT_CONFIG.totalMarks})</div>
            </div>
            <div className="score-box">
              <div className="score-num">{score.correct}</div>
              <div className="score-label">Correct</div>
            </div>
            <div className="score-box">
              <div className="score-num negative">{score.wrong}</div>
              <div className="score-label">Wrong</div>
            </div>
            <div className="score-box">
              <div className="score-num" style={{ color: "#6b7280" }}>{score.unattempted}</div>
              <div className="score-label">Unattempted</div>
            </div>
          </div>

          <div className="composite-box">
            <div className="composite-num">{score.composite}/{MAT_CONFIG.compositeScale.max}</div>
            <div className="composite-label">
                Estimated Composite Score · Estimated Percentile: {score.percentile}%
            </div>
          </div>

          <div className="disclaimer">
            Composite score and percentile are estimates only, not an official AIMA score.
            Accuracy improves as more users take this mock test.
          </div>

          <button className="primary-btn" onClick={() => navigate("/profile")}>Go to Profile</button>
        </div>
      </div>
    );
  }

  // ---------- MAIN TEST SCREEN ----------
  const sharedContext = getSharedContext(currentQuestion);
  
  return (
    <div className="mat-container">
      <style jsx>{`
        * { box-sizing: border-box; }

        .mat-container {
          min-height: 100vh;
          background: #ffffff;
          padding: 1.5rem;
          padding-top: 100px;
          padding-bottom: 180px;
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .top-bar {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #ffffff;
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #d1fae5;
          padding: 1rem 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .test-title { font-size: 1.3rem; font-weight: 800; color: #166534; }
        .section-label { font-size: 0.9rem; color: #6b7280; margin-top: 2px; }

        .timer-box {
          display: flex; align-items: center; gap: 8px; font-family: monospace; font-size: 1.15rem;
          font-weight: 800; padding: 8px 16px; border-radius: 999px; border: 1px solid #bbf7d0; background: #f0fdf4; color: #166534;
        }
        .timer-warning { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        .content-wrap { max-width: 820px; margin: 0 auto; padding-top: 90px; }

        .section-strip {
          display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.6rem; margin-bottom: 1.2rem;
        }
        .section-pill {
          flex-shrink: 0; padding: 0.5rem 1rem; border-radius: 999px; border: 1px solid #d1fae5;
          background: #ffffff; color: #166534; font-size: 0.8rem; font-weight: 700; cursor: pointer;
        }
        .section-pill.active { background: #166534; border-color: #166534; color: white; }

        .question-card {
          background: #f9fffb; border: 1px solid #d1fae5; border-left: 4px solid #16a34a;
          border-radius: 10px; padding: 1.6rem 1.8rem;
        }

        .q-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .q-badge { font-size: 0.75rem; font-weight: 800; color: #166534; background: #dcfce7; padding: 4px 12px; border-radius: 999px; }
        .q-progress { font-size: 0.78rem; color: #6b7280; }

        .q-text { color: #14532d; font-size: 1.05rem; line-height: 1.65; white-space: pre-line; margin-bottom: 1.2rem; }

        .rc-passage-panel, .di-statement {
          background: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; padding: 1rem 1.2rem;
          margin-bottom: 1.2rem; font-size: 0.9rem; color: #374151; line-height: 1.6; white-space: pre-line;
        }
        .di-table { width: 100%; margin-bottom: 1.2rem; border-collapse: collapse; }
        .di-table th, .di-table td { border: 1px solid #d1d5db; padding: 0.5rem 0.7rem; font-size: 0.85rem; text-align: left; background: #ffffff; }

        .options-wrap { display: flex; flex-direction: column; gap: 0.65rem; }
        .option-row {
          display: flex; align-items: center; gap: 0.7rem; padding: 0.75rem 1rem; border: 1px solid #d1d5db;
          border-radius: 10px; cursor: pointer; font-size: 0.94rem; color: #374151; background: #ffffff; transition: all 0.15s ease;
        }
        .option-row:hover { border-color: #86efac; }
        .option-row.selected { border-color: #16a34a; background: #ecfdf5; color: #14532d; font-weight: 700; }

        .q-nav-row { display: flex; justify-content: space-between; align-items: center; margin-top: 1.4rem; }
        .q-nav-btn {
          background: #ffffff; color: #166534; border: 1px solid #bbf7d0; padding: 0.55rem 1.1rem;
          border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem;
        }
        .q-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .q-nav-btn:hover:not(:disabled) { background: #f0fdf4; }

        .question-strip { display: flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 1.4rem; }
        .q-pill {
          width: 32px; height: 32px; border-radius: 999px; border: 1px solid #d1fae5; background: #ffffff;
          color: #15803d; font-size: 0.72rem; font-weight: 700; cursor: pointer;
        }
        .q-pill.current { background: #16a34a; border-color: #16a34a; color: white; }
        .q-pill.answered { background: #dcfce7; border-color: #16a34a; }

        .bottom-dock {
          position: fixed; bottom: 0; left: 0; right: 0; background: #ffffff; border-top: 1px solid #d1fae5;
          padding: 0.9rem 1.5rem; box-shadow: 0 -4px 20px rgba(0,0,0,0.06); z-index: 1000;
        }
        .bottom-dock-inner { max-width: 820px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.7rem; }
        .dock-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .dock-right { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }

        .btn-primary { background: #16a34a; color: white; border: none; padding: 0.7rem 1.6rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
        .btn-secondary { background: #ffffff; color: #166534; border: 1px solid #bbf7d0; padding: 0.7rem 1.3rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
        .btn-secondary:hover { background: #f0fdf4; }
        .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-exit { background: #ffffff; color: #dc2626; border: 1px solid #fca5a5; padding: 0.55rem 1.1rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; }
        .btn-exit:hover { background: #fee2e2; }

        @media (max-width: 600px) {
          .mat-container { padding-bottom: 210px; padding-top: 80px; }
          .top-bar { flex-direction: column; align-items: flex-start; gap: 0.4rem; padding: 0.8rem 1rem; }
          .test-title { font-size: 1.05rem; }
          .timer-box { font-size: 1rem; padding: 6px 12px; }
          .content-wrap { margin-top: 40px; }
          .question-card { padding: 1.1rem 1.2rem; }
          .q-text { font-size: 0.94rem; }
          .q-nav-row { flex-direction: column; gap: 0.6rem; align-items: stretch; }
          .q-nav-btn { justify-content: center; }
        }

        @media (max-width: 480px) {
            .mat-container { padding-bottom: 240px; padding-top: 80px; }
            .section-pill { padding: 0.4rem 0.8rem; font-size: 0.72rem; }
            .q-pill { width: 28px; height: 28px; font-size: 0.65rem; }
            .question-card { padding: 1rem; }
            .rc-passage-panel, .di-statement { padding: 0.8rem 1rem; }
            .dock-right { flex-direction: column; width: 100%; }
            .btn-secondary, .btn-primary { width: 100%; justify-content: center; }
            .dock-left { width: 100%; justify-content: space-between; }
        }

       
      `}</style>

      <div className="top-bar">
        <div>
          <div className="test-title">{MAT_CONFIG.title}</div>
          <div className="section-label">
            Section {activeSectionIndex + 1} of {SECTIONS.length}: {currentSection.label}
          </div>
        </div>
        <div className={`timer-box ${timeLeft < 300 ? "timer-warning" : ""}`}>
          <FiClock /> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="content-wrap">
        {/* Section switcher — horizontal pills, freely clickable (no lock) */}
        <div className="section-strip">
          {SECTIONS.map((s, idx) => (
            <button
              key={s.key}
              className={`section-pill ${idx === activeSectionIndex ? "active" : ""}`}
              onClick={() => setActiveSectionIndex(idx)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="question-card">
          <div className="q-meta">
            <span className="q-badge">Q{currentQuestion.id}</span>
            <span className="q-progress">Question {currentQIndex + 1} of {currentSection.questions.length}</span>
          </div>

          {sharedContext.passage && <div className="rc-passage-panel">{sharedContext.passage}</div>}
          {sharedContext.statement && <div className="di-statement">{sharedContext.statement}</div>}
          {sharedContext.table && (
            <table className="di-table">
              <thead>
                <tr>{sharedContext.table.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {sharedContext.table.rows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="q-text">{currentQuestion.question}</div>

          <div className="options-wrap">
            {currentQuestion.options.map((opt) => {
              const letter = opt.trim().charAt(0);
              const isSelected = answers[currentQuestion.id] === letter;
              return (
                <div
                  key={opt}
                  className={`option-row ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(currentQuestion.id, letter)}
                >
                  {opt}
                </div>
              );
            })}
          </div>

          <div className="q-nav-row">
            <button className="q-nav-btn" onClick={goPrevQuestion} disabled={currentQIndex === 0}>
              <FiArrowLeft /> Previous
            </button>
            <button
              className="q-nav-btn"
              onClick={goNextQuestion}
              disabled={currentQIndex === currentSection.questions.length - 1}
            >
              Next <FiArrowRight />
            </button>
          </div>

          {/* Question navigator — freely jump to any question in this section */}
          <div className="question-strip">
            {currentSection.questions.map((q, idx) => {
              let cls = "q-pill";
              if (idx === currentQIndex) cls += " current";
              else if (isAnswered(q.id)) cls += " answered";
              return (
                <button key={q.id} className={cls} onClick={() => jumpToQuestion(idx)}>
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bottom-dock">
        <div className="bottom-dock-inner">
          <div className="dock-left">
            <button className="btn-exit" onClick={handleExitTest}>
              <FiLogOut /> Exit
            </button>
            <span style={{ fontSize: "0.83rem", color: "#6b7280" }}>
              {Object.keys(answers).length} / {MAT_CONFIG.totalQuestions} answered
            </span>
          </div>
          <div className="dock-right">
            {activeSectionIndex > 0 && (
              <button className="btn-secondary" onClick={goPrevSection}>
                <FiArrowLeft /> Prev Section
              </button>
            )}
            {!isLastSection && (
              <button className="btn-secondary" onClick={goNextSection}>
                Next Section <FiArrowRight />
              </button>
            )}
            <button className="btn-primary" onClick={handleManualSubmit}>
              Submit Test <FiSave />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}