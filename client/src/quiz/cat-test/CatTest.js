import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiCheckCircle, FiBookmark, FiTrash2, FiChevronRight } from "react-icons/fi";
import getApiBaseUrl from "../../utils/api";

import CAT_CONFIG from "./CatConfig";
import catVarc from "./CatVarc";
import catDilr from "./CatDilr";
import catQa from "./CatQa";
import { calculateScore, buildBreakdown } from "./CatScoring";

const DATA_MAP = {
  varc: catVarc,
  dilr: catDilr,
  qa: catQa
};

export default function CatTest() {
  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [markedForReview, setMarkedForReview] = useState({}); 
  const [visited, setVisited] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [testDone, setTestDone] = useState(false);
  const [results, setResults] = useState(null);
  const [titaDraft, setTitaDraft] = useState("");

  
  const answersRef = useRef({});
  const sectionResultsRef = useRef([]); 
  const sectionTimeoutHandledRef = useRef(false);
  const currentQIndexRef = useRef(0);
  const titaDraftRef = useRef("");
  const prevSectionIdxRef = useRef(-1);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { currentQIndexRef.current = currentQIndex; }, [currentQIndex]);
  useEffect(() => { titaDraftRef.current = titaDraft; }, [titaDraft]);

  const currentSection = CAT_CONFIG.sections[currentSectionIdx];
  const sectionQuestions = DATA_MAP[currentSection.key];
  const currentQuestion = sectionQuestions[currentQIndex];
  const isLastSection = currentSectionIdx === CAT_CONFIG.sections.length - 1;


  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
    return () => {
      if (footer) footer.style.display = "";
    };
  }, []);


  useEffect(() => {
    const sectionChanged = prevSectionIdxRef.current !== currentSectionIdx;

    if (sectionChanged) {
      prevSectionIdxRef.current = currentSectionIdx;

      setCurrentQIndex(0);
      setTimeLeft(CAT_CONFIG.sections[currentSectionIdx].timeLimitMinutes * 60);
      sectionTimeoutHandledRef.current = false;

      const newSectionQuestions = DATA_MAP[CAT_CONFIG.sections[currentSectionIdx].key];
      const firstQ = newSectionQuestions[0];
      if (firstQ) {
        setVisited((prev) => (prev[firstQ.id] ? prev : { ...prev, [firstQ.id]: true }));
        setTitaDraft(firstQ.type === "tita" ? (answersRef.current[firstQ.id] ?? "") : "");
      }
      return;
    }

    if (!currentQuestion) return;
    setVisited((prev) => (prev[currentQuestion.id] ? prev : { ...prev, [currentQuestion.id]: true }));
    setTitaDraft(currentQuestion.type === "tita" ? (answers[currentQuestion.id] ?? "") : "");
  }, [currentSectionIdx, currentQIndex]);

 

  useEffect(() => {
    if (testDone) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => handleSectionTimeout(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentSectionIdx, testDone]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ── answer actions ─────────────────────────────────────────────
  const saveMcqAnswer = (letter) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: letter }));
  };

  const saveTitaAndNext = () => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: titaDraft.trim() }));
    goNextQuestion();
  };

  const saveAndNext = () => {
    if (currentQuestion.type === "tita") {
      saveTitaAndNext();
      return;
    }
    goNextQuestion();
  };

  const markForReviewAndNext = () => {
    setMarkedForReview((prev) => ({ ...prev, [currentQuestion.id]: true }));
    if (currentQuestion.type === "tita") {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: titaDraft.trim() }));
    }
    goNextQuestion();
  };

  const deleteAnswer = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
    if (currentQuestion.type === "tita") setTitaDraft("");
  };

  const goNextQuestion = () => {
    if (currentQIndex < sectionQuestions.length - 1) {
      setCurrentQIndex((i) => i + 1);
    }
  };

  const jumpToQuestion = (idx) => {
    if (currentQuestion.type === "tita") {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: titaDraft.trim() }));
    }
    setCurrentQIndex(idx);
  };

  const recordSectionResult = () => {
    const score = calculateScore(sectionQuestions, answersRef.current);
    sectionResultsRef.current = [
      ...sectionResultsRef.current,
      { key: currentSection.key, label: currentSection.label, score }
    ];
  };

  const handleSectionTimeout = () => {
    if (sectionTimeoutHandledRef.current) return;
    sectionTimeoutHandledRef.current = true;

    
    const liveQIndex = currentQIndexRef.current;
    const liveQuestion = sectionQuestions[liveQIndex];
    const liveDraft = titaDraftRef.current;

    if (liveQuestion && liveQuestion.type === "tita" && liveDraft.trim()) {
      const updatedAnswers = { ...answersRef.current, [liveQuestion.id]: liveDraft.trim() };
      answersRef.current = updatedAnswers;
      setAnswers(updatedAnswers);
    }

    recordSectionResult();
    if (isLastSection) {
      finalizeExam();
    } else {
      setCurrentSectionIdx((i) => i + 1);
    }
  };

  const finalizeExam = () => {
    const allQuestions = [...catVarc, ...catDilr, ...catQa];
    const finalAnswers = answersRef.current;
    const overall = calculateScore(allQuestions, finalAnswers);
    const breakdown = buildBreakdown(allQuestions, finalAnswers);
    const finalResults = {
      overall,
      sections: sectionResultsRef.current,
      breakdown
    };
    setResults(finalResults);
    setTestDone(true);
    saveResult(finalResults);
  };

  const saveResult = async (finalResults) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ testName: "CAT Mock Test", result: finalResults })
      });
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // ── RESULT SCREEN ─────────────────────────────────────────────
  if (testDone && results) {
    return (
      <div className="cat-result-container">
        <style jsx>{`
          .cat-result-container {
            min-height: 100vh; background: #ffffff; display: flex; justify-content: center;
            padding: 2rem; padding-top: 100px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .result-card {
            width: 100%; max-width: 680px; background: #ffffff; border: 1px solid #bbf7d0;
            border-radius: 20px; padding: 2.5rem; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          .score-row { display: flex; justify-content: center; gap: 1.5rem; margin: 1.5rem 0; flex-wrap: wrap; }
          .score-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 1.1rem 1.6rem; }
          .score-num { font-size: 1.7rem; font-weight: 800; color: #16a34a; }
          .score-num.negative { color: #dc2626; }
          .score-label { font-size: 0.78rem; color: #6b7280; margin-top: 4px; }
          .section-table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; text-align: left; }
          .section-table th, .section-table td { padding: 0.6rem 0.8rem; border-bottom: 1px solid #e5e7eb; font-size: 0.88rem; }
          .primary-btn { background: #16a34a; color: white; border: none; padding: 0.9rem 2.2rem; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 1.5rem; }
        `}</style>
        <div className="result-card">
          <FiCheckCircle style={{ fontSize: "3rem", color: "#19fd91" }} />
          <h2 style={{ color: "#166534", marginTop: "0.5rem" }}>CAT Mock Test Complete</h2>

          <div className="score-row">
            <div className="score-box">
              <div className={`score-num ${results.overall.marks < 0 ? "negative" : ""}`}>
                {results.overall.marks}
              </div>
              <div className="score-label">Total Marks (of {CAT_CONFIG.totalQuestions * 3})</div>
            </div>
            <div className="score-box">
              <div className="score-num">{results.overall.correct}</div>
              <div className="score-label">Correct</div>
            </div>
            <div className="score-box">
              <div className="score-num negative">{results.overall.wrong}</div>
              <div className="score-label">Wrong</div>
            </div>
            <div className="score-box">
              <div className="score-num" style={{ color: "#6b7280" }}>{results.overall.unattempted}</div>
              <div className="score-label">Unattempted</div>
            </div>
          </div>

          <table className="section-table">
            <thead>
              <tr><th>Section</th><th>Correct</th><th>Wrong</th><th>Marks</th></tr>
            </thead>
            <tbody>
              {results.sections.map((s) => (
                <tr key={s.key}>
                  <td>{s.label}</td>
                  <td>{s.score.correct}</td>
                  <td>{s.score.wrong}</td>
                  <td>{s.score.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="primary-btn" onClick={() => navigate("/profile")}>Go to Profile</button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div style={{ padding: "150px 20px", textAlign: "center" }}>Loading question paper…</div>;
  }

  const isAnswered = (q) => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== "";
  const isMarked = (q) => !!markedForReview[q.id];
  const isVisited = (q) => !!visited[q.id];

  const getSharedContext = (q) => {
    const groupId = q.passageId || q.setId;
    if (!groupId) {
      return { passage: q.passage || null, statement: q.statement || null, table: q.table || null };
    }
    const source = sectionQuestions.find(
      (sq) => (sq.passageId === groupId || sq.setId === groupId) && (sq.passage || sq.statement || sq.table)
    );
    return {
      passage: q.passage || source?.passage || null,
      statement: q.statement || source?.statement || null,
      table: q.table || source?.table || null
    };
  };

  const sharedContext = getSharedContext(currentQuestion);

  // ── MAIN TEST SCREEN ─────────────────────────────────────────
  return (
    <div className="cat-container">
      <style jsx>{`
        * { box-sizing: border-box; }
        .cat-container {
          min-height: 830px; background: #ffffff; padding: 1.5rem; padding-top: 100px;
          padding-bottom: 1rem; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .top-bar {
          max-width: 1000px; margin: 0 auto 1.2rem auto; display: flex; justify-content: space-between;
          align-items: center; border-bottom: 1px solid #d1fae5; padding-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;
        }
        .test-title { font-size: 1.25rem; font-weight: 800; color: #166534; }
        .section-label { font-size: 0.88rem; color: #6b7280; margin-top: 2px; }
        .timer-box {
          display: flex; align-items: center; gap: 8px; font-family: monospace; font-size: 1.1rem;
          font-weight: 800; padding: 8px 16px; border-radius: 12px; border: 1px solid #bbf7d0; background: #f0fdf4; color: #166534;
        }
        .timer-warning { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        .main-layout { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 260px; gap: 1.2rem; }

        .question-card { background: #ffffff; border: 1px solid #d1fae5; border-radius: 12px; padding: 1.4rem 1.6rem; min-height: 320px; }
        .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
        .q-position { font-size: 0.85rem; font-weight: 700; color: #15803d; }
        .q-type-badge { font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: #dcfce7; color: #166534; }
        .q-text { color: #14532d; font-size: 1rem; line-height: 1.6; white-space: pre-line; margin-bottom: 1rem; }
        .rc-passage-panel, .di-statement { background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 1rem 1.2rem; margin-bottom: 1.2rem; font-size: 0.9rem; color: #374151; line-height: 1.6; max-height: 220px; overflow-y: auto; white-space: pre-line; }
        .di-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
        .di-table th, .di-table td { border: 1px solid #d1d5db; padding: 0.5rem 0.7rem; font-size: 0.85rem; text-align: left; }

        .options-wrap { display: flex; flex-direction: column; gap: 0.6rem; }
        .option-row { padding: 0.65rem 1rem; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 0.92rem; color: #374151; }
        .option-row:hover { background: #f9fffb; }
        .option-row.selected { border-color: #16a34a; background: #f0fdf4; color: #14532d; font-weight: 600; }

        .tita-input { width: 100%; padding: 0.8rem 1rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.95rem; color: #111827; }
        .tita-input:focus { border-color: #16a34a; outline: none; box-shadow: 0 0 0 3px rgba(22,163,74,0.15); }
        .tita-hint { font-size: 0.78rem; color: #6b7280; margin-top: 0.4rem; }

        .action-row { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1.4rem; }
        .btn-save { background: #16a34a; color: white; border: none; padding: 0.65rem 1.4rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; }
        .btn-mark { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; padding: 0.65rem 1.2rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; }
        .btn-delete { background: #ffffff; color: #dc2626; border: 1px solid #fca5a5; padding: 0.65rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; }
        .btn-save:hover { background: #15803d; }
        .btn-mark:hover { background: #ede9fe; }
        .btn-mark-active {
          background: #7c3aed;
          color: white;
          border-color: #7c3aed;
        }
        .btn-mark-active:hover {
          background: #6d28d9;
        }
        .btn-delete:hover { background: #fee2e2; }

        .palette-panel { background: #ffffff; border: 1px solid #d1fae5; border-radius: 12px; padding: 1rem; height: fit-content; }
        .palette-title { font-size: 0.90rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 0.6rem; }
        .palette-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.4rem; max-height: 260px; overflow-y: auto; }
        .pal-btn { width: 40px; height: 38px; border-radius: 15px; border: 1px solid #d1d5db; background: #f9fafb; color: #6b7280; font-size: 0.85rem; font-weight: 750; cursor: pointer; position: relative; }
        .pal-btn.current { border-color: #16a34a; background: #16a34a; color: white; }
        .pal-btn.answered { background: #dcfce7; border-color: #16a34a; color: #166534; }
        .pal-btn.not-answered { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
        .pal-btn.marked::after { content: "★"; position: absolute; top: -3px; right: -4px; font-size: 0.75rem; color: #7c3aed; }
        .palette-legend { margin-top: 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; color: #6b7280; }
        .legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }

        @media (max-width: 800px) {
          .main-layout { grid-template-columns: 1fr; }
          .palette-grid { grid-template-columns: repeat(6, 1fr); }
          .palette-panel { width: auto; }
        }

        @media (max-width: 480px) {
          .cat-container { padding: 1rem; padding-top: 80px; min-height: auto; }
          .top-bar { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .test-title { font-size: 1.05rem; }
          .timer-box { font-size: 1rem; padding: 6px 12px; }
          .question-card { padding: 1rem 1.1rem; min-height: unset; }
          .q-text { font-size: 0.92rem; }
          .rc-passage-panel, .di-statement { max-height: 160px; padding: 0.8rem 1rem; }
          .palette-grid { grid-template-columns: repeat(5, 1fr); }
          .pal-btn { width: 34px; height: 34px; font-size: 0.72rem; }
          .action-row { flex-direction: column; }
          .btn-save, .btn-mark, .btn-delete { width: 100%; justify-content: center; }
          .tita-input { font-size: 0.9rem; }
        }
      `}</style>

      <div className="top-bar">
        <div>
          <div className="test-title">{CAT_CONFIG.title}</div>
          <div className="section-label">
            Section {currentSectionIdx + 1} of {CAT_CONFIG.sections.length}: {currentSection.label} —
            {" "}Question {currentQIndex + 1} of {sectionQuestions.length}
          </div>
        </div>
        <div className={`timer-box ${timeLeft < 120 ? "timer-warning" : ""}`}>
          <FiClock /> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="main-layout">
        <div className="question-card">
          <div className="q-header">
            <span className="q-position">Q{currentQuestion.id}</span>
            <span className="q-type-badge">{currentQuestion.type === "tita" ? "TITA — no negative marking" : "MCQ"}</span>
          </div>

          {sharedContext.passage && (
            <div className="rc-passage-panel">{sharedContext.passage}</div>
          )}

          {sharedContext.statement && (
            <div className="di-statement">{sharedContext.statement}</div>
          )}

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

          {currentQuestion.type === "tita" ? (
            <>
              <input
                type="text"
                className="tita-input"
                placeholder="Type your answer here…"
                value={titaDraft}
                onChange={(e) => setTitaDraft(e.target.value)}
              />
              <div className="tita-hint">No options — type the exact numeric or text answer.</div>
            </>
          ) : (
            <div className="options-wrap">
              {currentQuestion.options.map((opt) => {
                const letter = opt.trim().charAt(0);
                const isSelected = answers[currentQuestion.id] === letter;
                return (
                  <div
                    key={opt}
                    className={`option-row ${isSelected ? "selected" : ""}`}
                    onClick={() => saveMcqAnswer(letter)}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          )}

          <div className="action-row">
            <button className="btn-save" onClick={saveAndNext}>
              Save &amp; Next <FiChevronRight />
            </button>
            <button
              className={`btn-mark ${isMarked(currentQuestion) ? "btn-mark-active" : ""}`}
              onClick={markForReviewAndNext}
            >
              <FiBookmark /> {isMarked(currentQuestion) ? "Marked for Review" : "Mark for Review & Next"}
            </button>
            <button className="btn-delete" onClick={deleteAnswer}>
              <FiTrash2 /> Delete Answer
            </button>
          </div>
        </div>

        <div className="palette-panel">
          <div className="palette-title">{currentSection.label}</div>
          <div className="palette-grid">
            {sectionQuestions.map((q, idx) => {
              let cls = "pal-btn";
              if (idx === currentQIndex) cls += " current";
              else if (isAnswered(q)) cls += " answered";
              else if (isVisited(q)) cls += " not-answered";
              if (isMarked(q)) cls += " marked";
              return (
                <button key={q.id} className={cls} onClick={() => jumpToQuestion(idx)}>
                  {q.id}
                </button>
              );
            })}
          </div>
          <div className="palette-legend">
            <div><span className="legend-dot" style={{ background: "#16a34a" }} /> Current</div>
            <div><span className="legend-dot" style={{ background: "#dcfce7", border: "1px solid #16a34a" }} /> Answered</div>
            <div><span className="legend-dot" style={{ background: "#fee2e2", border: "1px solid #fca5a5" }} /> Not answered</div>
            <div><span className="legend-dot" style={{ background: "#f9fafb", border: "1px solid #d1d5db" }} /> Not visited</div>
            <div>★ Marked for review</div>
          </div>
        </div>
      </div>
    </div>
  );
}