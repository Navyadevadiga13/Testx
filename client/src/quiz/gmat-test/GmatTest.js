import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiClock, FiArrowRight, FiArrowLeft, FiCheckCircle, FiBookmark, FiFlag, FiLogOut } from "react-icons/fi";
import getApiBaseUrl from "../../utils/api";

import GMAT_CONFIG from "./GmatConfig";
import gmatQuant from "./GmatQuant";
import gmatVerbal from "./GmatVerbal";
import gmatDataInsights from "./GmatDataInsights";
import { getStartingAbility, updateAbility, selectNextQuestion, selectNextVerbalQuestion } from "./GmatAdaptiveEngine";
import { isQuestionCorrect, calculateRawScore, calculateEstimatedScore, buildBreakdown } from "./GmatScoring";

const DATA_MAP = {
  quantitative: gmatQuant,
  verbal: gmatVerbal,
  dataInsights: gmatDataInsights
};


const isDraftAnswered = (q, draft) => {
  if (!q || draft === null || draft === undefined) return false;
  if (q.type === "graphicsInterpretation") {
    return q.blanks.every((b, i) => draft[`blank${i}`]);
  }
  if (q.type === "twoPartAnalysis") {
    return q.columns.every((c) => draft[c]);
  }
  return typeof draft === "string" && draft.length > 0;
};

const valuesEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a === "object" && typeof b === "object" && a && b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
};

export default function GmatTest() {
  const navigate = useNavigate();
  const { sectionKey } = useParams();
  const isFullTest = !sectionKey;

  const SECTIONS_TO_RUN = isFullTest
    ? GMAT_CONFIG.sections
    : GMAT_CONFIG.sections.filter((s) => s.key === sectionKey);

  const API_URL = getApiBaseUrl();

  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [history, setHistory] = useState([]);
  const [pointer, setPointer] = useState(0);
  const [ability, setAbility] = useState(getStartingAbility());
  const [answers, setAnswers] = useState({}); 
  const [editsUsed, setEditsUsed] = useState(0);
  const [bookmarks, setBookmarks] = useState({}); 
  const [draftValue, setDraftValue] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [dialogType, setDialogType] = useState(null); 
  const [testDone, setTestDone] = useState(false);
  const [results, setResults] = useState(null);

  const usedIdsRef = useRef([]);
  const activePassageIdRef = useRef(null); 
  const sectionResultsRef = useRef([]); 
  const allAnsweredRef = useRef([]); 
  const allAnswersSnapshotRef = useRef({});

 
  const historyRef = useRef([]);
  const pointerRef = useRef(0);
  const answersRef = useRef({});
  const editsUsedRef = useRef(0);
  const draftValueRef = useRef(null);

  const currentSection = SECTIONS_TO_RUN[currentSectionIdx];
  const bank = currentSection ? DATA_MAP[currentSection.key] : [];
  const currentQuestion = history[pointer];
  const isLastSectionOfRun = currentSectionIdx === SECTIONS_TO_RUN.length - 1;

  // ── init / reset whenever the active section changes ────────────
  const initSection = (idx) => {
    const section = SECTIONS_TO_RUN[idx];
    if (!section) return;
    const sectionBank = DATA_MAP[section.key];
    const startAbility = getStartingAbility();
    const first = selectNextQuestion(sectionBank, [], startAbility);
    usedIdsRef.current = first ? [first.id] : [];
    activePassageIdRef.current = first && first.passageId ? first.passageId : null;
    setHistory(first ? [first] : []);
    setPointer(0);
    setAbility(startAbility);
    setEditsUsed(0);
    setTimeLeft(section.timeLimitMinutes * 60);
  };

  useEffect(() => {
    initSection(currentSectionIdx);
    
  }, [currentSectionIdx]);

  
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { pointerRef.current = pointer; }, [pointer]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { editsUsedRef.current = editsUsed; }, [editsUsed]);
  useEffect(() => { draftValueRef.current = draftValue; }, [draftValue]);

  // Sync the draft with whatever's already saved whenever the visible question changes.
  useEffect(() => {
    const q = history[pointer];
    if (!q) return;
    const saved = answers[q.id];
    if (saved) {
      setDraftValue(saved.value);
    } else {
      setDraftValue(q.type === "graphicsInterpretation" || q.type === "twoPartAnalysis" ? {} : null);
    }
    
  }, [pointer, history]);


  // ── timer — resets fresh every time the section changes ─────────
  useEffect(() => {
    if (testDone) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentSectionIdx, testDone]);


  const autoFinishFiredRef = useRef(false);
  useEffect(() => {
    autoFinishFiredRef.current = false; 
  }, [currentSectionIdx]);

  useEffect(() => {
    if (testDone || timeLeft !== 0 || autoFinishFiredRef.current) return;
    autoFinishFiredRef.current = true;
    finishSectionFlowAuto();
    
  }, [timeLeft, testDone]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  

  const computeSaveResult = (q, draft, currentAnswers, currentEditsUsed) => {
    if (!q) return { answers: currentAnswers, editsUsed: currentEditsUsed, blocked: false };
    if (!isDraftAnswered(q, draft)) {
      return { answers: currentAnswers, editsUsed: currentEditsUsed, blocked: false };
    }
    const prevSaved = currentAnswers[q.id];
    const changed = prevSaved && !valuesEqual(prevSaved.value, draft);

    if (!prevSaved) {
      return {
        answers: { ...currentAnswers, [q.id]: { value: draft, changesUsed: 0 } },
        editsUsed: currentEditsUsed,
        blocked: false
      };
    }
    if (!changed) {
      return { answers: currentAnswers, editsUsed: currentEditsUsed, blocked: false };
    }
    if (currentEditsUsed < GMAT_CONFIG.maxAnswerChangesPerSection) {
      return {
        answers: { ...currentAnswers, [q.id]: { value: draft, changesUsed: prevSaved.changesUsed + 1 } },
        editsUsed: currentEditsUsed + 1,
        blocked: false
      };
    }
    return { answers: currentAnswers, editsUsed: currentEditsUsed, blocked: true };
  };

  const toggleBookmark = (qId) => {
    setBookmarks((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // ── navigation ────────────────────────────────────────────────
  const handlePrev = () => {
    const canReview = history.length >= currentSection.count;
    if (!canReview) {
      alert("You can review and change answers only after you've answered every question in this section.");
      return;
    }
    const { answers: newAnswers, editsUsed: newEditsUsed, blocked } = computeSaveResult(
      currentQuestion, draftValue, answers, editsUsed
    );
    if (blocked) {
      alert(`You've used all ${GMAT_CONFIG.maxAnswerChangesPerSection} answer changes allowed for this section. Your original answer for this question has been kept.`);
    }
    setAnswers(newAnswers);
    setEditsUsed(newEditsUsed);
    if (pointer > 0) setPointer((p) => p - 1);
  };

  const handleJumpTo = (idx) => {
    if (idx === pointer) return;
    const canReview = history.length >= currentSection.count;
    if (!canReview) {
      alert("You can review and change answers only after you've answered every question in this section.");
      return;
    }
    const { answers: newAnswers, editsUsed: newEditsUsed, blocked } = computeSaveResult(
      currentQuestion, draftValue, answers, editsUsed
    );
    if (blocked) {
      alert(`You've used all ${GMAT_CONFIG.maxAnswerChangesPerSection} answer changes allowed for this section. Your original answer for this question has been kept.`);
    }
    setAnswers(newAnswers);
    setEditsUsed(newEditsUsed);
    setPointer(idx);
  };

  const handleNext = () => {
    if (!isDraftAnswered(currentQuestion, draftValue)) {
      alert("Please answer the current question before moving to the next question.");
      return;
    }
    const q = currentQuestion;
    const { answers: newAnswers, editsUsed: newEditsUsed, blocked } = computeSaveResult(
      q, draftValue, answers, editsUsed
    );
    if (blocked) {
      alert(`You've used all ${GMAT_CONFIG.maxAnswerChangesPerSection} answer changes allowed for this section. Your original answer for this question has been kept.`);
    }
    setAnswers(newAnswers);
    setEditsUsed(newEditsUsed);

    const isFrontier = pointer === history.length - 1;

    if (!isFrontier) {
      setPointer((p) => p + 1);
      return;
    }

    if (history.length >= currentSection.count) {
      openFinishFlow(newAnswers);
      return;
    }

    const wasCorrect = isQuestionCorrect(q, newAnswers[q.id]);
    const newAbility = updateAbility(ability, wasCorrect);

    let next;
    if (currentSection.key === "verbal") {
      const picked = selectNextVerbalQuestion(bank, usedIdsRef.current, newAbility, activePassageIdRef.current);
      next = picked.question;
      activePassageIdRef.current = picked.activePassageId;
    } else {
      next = selectNextQuestion(bank, usedIdsRef.current, newAbility);
    }

    if (next) {
      usedIdsRef.current = [...usedIdsRef.current, next.id];
      setHistory((h) => [...h, next]);
      setAbility(newAbility);
      setPointer((p) => p + 1);
    } else {

      openFinishFlow(newAnswers);
    }
  };

  // ── exit mid-test ────────────────────────────────────────────
  const handleExitTest = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit? Your progress will not be saved, and the section timer will reset if you start again."
    );
    if (confirmExit) {
      navigate("/");
    }
  };

  // ── finishing a section / the whole exam ─────────────────────────
  const openFinishFlow = (answersSnapshot) => {
    if (!isFullTest) {
      const ok = window.confirm("Submit this section and see your results? You can't return to change answers after submitting.");
      if (ok) finalizeSection(answersSnapshot);
      return;
    }
    setDialogType(isLastSectionOfRun ? "submitExam" : "finishSection");
    dialogAnswersRef.current = answersSnapshot;
  };

  const dialogAnswersRef = useRef({});

  const recordSectionResult = (answersSnapshot) => {
    const liveHistory = historyRef.current;
    const raw = calculateRawScore(liveHistory, answersSnapshot, currentSection.count);
    const estimated = calculateEstimatedScore(liveHistory, answersSnapshot, GMAT_CONFIG.sectionScoreScale, currentSection.count);
    sectionResultsRef.current = [
      ...sectionResultsRef.current,
      { key: currentSection.key, label: currentSection.label, raw, estimated }
    ];
    allAnsweredRef.current = [...allAnsweredRef.current, ...liveHistory];
    allAnswersSnapshotRef.current = { ...allAnswersSnapshotRef.current, ...answersSnapshot };
  };

  const handleContinueToNextSection = () => {
    recordSectionResult(dialogAnswersRef.current);
    setDialogType(null);
    setCurrentSectionIdx((i) => i + 1);
  };

  const handleStayInSection = () => {
    setDialogType(null);
  };

  const handleSubmitExam = () => {
    recordSectionResult(dialogAnswersRef.current);
    finalizeExam();
    setDialogType(null);
  };

  const handleContinueReviewing = () => {
    setDialogType(null);
  };

  

  const finishSectionFlowAuto = () => {
    const liveHistory = historyRef.current;
    const livePointer = pointerRef.current;
    const q = liveHistory[livePointer];

    const { answers: newAnswers } = computeSaveResult(
      q, draftValueRef.current, answersRef.current, editsUsedRef.current
    );
    setAnswers(newAnswers);
    answersRef.current = newAnswers; 

    if (!isFullTest) {
      finalizeSection(newAnswers);
      return;
    }
    recordSectionResult(newAnswers);
    if (isLastSectionOfRun) {
      finalizeExam();
    } else {
      setCurrentSectionIdx((i) => i + 1);
    }
  };

  const finalizeSection = (answersSnapshot) => {
    const liveHistory = historyRef.current;
    const raw = calculateRawScore(liveHistory, answersSnapshot, currentSection.count);
    const estimated = calculateEstimatedScore(liveHistory, answersSnapshot, GMAT_CONFIG.sectionScoreScale, currentSection.count);
    const breakdown = buildBreakdown(liveHistory, answersSnapshot);
    const finalResults = {
      mode: "section",
      sectionLabel: currentSection.label,
      raw,
      estimatedSectionScore: estimated,
      breakdown
    };
    setResults(finalResults);
    setTestDone(true);
    saveResult(finalResults);
  };

  const finalizeExam = () => {
    const allQuestions = allAnsweredRef.current;
    const allAnswers = allAnswersSnapshotRef.current;
    const raw = calculateRawScore(allQuestions, allAnswers, GMAT_CONFIG.totalQuestions);
    const estimatedOverall = calculateEstimatedScore(allQuestions, allAnswers, GMAT_CONFIG.overallScoreScale, GMAT_CONFIG.totalQuestions);
    const breakdown = buildBreakdown(allQuestions, allAnswers);
    const finalResults = {
      mode: "full",
      raw,
      estimatedOverall,
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
    const testName = isFullTest ? "GMAT Full Practice Test" : `GMAT ${currentSection.label} Practice`;
    try {
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ testName, result: finalResults })
      });
    } catch (err) {
      console.error("Save failed:", err);
    }
  };


  const setDraftSimple = (val) => setDraftValue(val);
  const setDraftBlank = (idx, val) => setDraftValue((prev) => ({ ...(prev || {}), [`blank${idx}`]: val }));
  const setDraftColumn = (col, val) => setDraftValue((prev) => ({ ...(prev || {}), [col]: val }));

  // ── RESULT SCREEN ─────────────────────────────────────────────
  if (testDone && results) {
    return (
      <div className="gmat-result-container">
        <style jsx>{`
          .gmat-result-container {
            min-height: 100vh; background: #ffffff; display: flex; justify-content: center;
            padding: 2rem; padding-top: 100px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .result-card {
            width: 100%; max-width: 640px; background: #ffffff; border: 1px solid #bbf7d0;
            border-radius: 20px; padding: 2.5rem; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          .score-row { display: flex; justify-content: center; gap: 2rem; margin: 1.5rem 0; flex-wrap: wrap; }
          .score-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 1.2rem 1.8rem; }
          .score-num { font-size: 1.8rem; font-weight: 800; color: #16a34a; }
          .score-label { font-size: 0.8rem; color: #6b7280; margin-top: 4px; }
          .disclaimer { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; font-size: 0.82rem; border-radius: 10px; padding: 0.7rem 1rem; margin: 1rem 0; }
          .section-table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; text-align: left; }
          .section-table th, .section-table td { padding: 0.6rem 0.8rem; border-bottom: 1px solid #e5e7eb; font-size: 0.9rem; }
          .primary-btn { background: #16a34a; color: white; border: none; padding: 0.9rem 2.2rem; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 1.5rem; }
        `}</style>
        <div className="result-card">
          <FiCheckCircle style={{ fontSize: "3rem", color: "#19fd91" }} />
          <h2 style={{ color: "#166534", marginTop: "0.5rem" }}>
            {results.mode === "full" ? "Full Practice Test Complete" : `${results.sectionLabel} Practice Complete`}
          </h2>

          <div className="score-row">
            <div className="score-box">
              <div className="score-num">{results.raw.correct}/{results.raw.total}</div>
              <div className="score-label">Correct Answers</div>
            </div>
            <div className="score-box">
              <div className="score-num">{results.raw.accuracy}%</div>
              <div className="score-label">Accuracy</div>
            </div>
            <div className="score-box">
              <div className="score-num">
                {results.mode === "full" ? results.estimatedOverall : results.estimatedSectionScore}
                {results.mode === "full" ? "/805" : "/90"}
              </div>
              <div className="score-label">
                {results.mode === "full" ? "Estimated GMAT Score" : "Estimated Section Score"}
              </div>
            </div>
          </div>

          <div className="disclaimer">
            This is an <strong>estimated practice score</strong> based on a custom weighted algorithm — not an official GMAT score, and not affiliated with or endorsed by GMAC.
          </div>

          {results.mode === "full" && (
            <table className="section-table">
              <thead>
                <tr><th>Section</th><th>Raw</th><th>Est. Score</th></tr>
              </thead>
              <tbody>
                {results.sections.map((s) => (
                  <tr key={s.key}>
                    <td>{s.label}</td>
                    <td>{s.raw.correct}/{s.raw.total}</td>
                    <td>{s.estimated}/90</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button className="primary-btn" onClick={() => navigate("/profile")}>Go to Profile</button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div style={{ padding: "150px 20px", textAlign: "center" }}>Loading question bank…</div>;
  }

  const editsRemaining = GMAT_CONFIG.maxAnswerChangesPerSection - editsUsed;
  const nextSectionLabel = SECTIONS_TO_RUN[currentSectionIdx + 1]?.label;
  const currentAnswered = isDraftAnswered(currentQuestion, draftValue);
  const canReview = history.length >= currentSection.count;

  // ── question body renderer ───────────────────────────────────
  const renderQuestionBody = (q) => {
    const isSimpleOptionsType =
      !q.type || q.type === "readingComprehension" || q.type === "dataSufficiency" || q.type === "multiSourceReasoning" || q.type === "tableAnalysis";

    if (isSimpleOptionsType) {
      return (
        <>
          {q.type === "readingComprehension" && q.passage && (
            <>
              <div className="rc-passage-label">
                Reading Passage — {bank.filter((b) => b.passageId === q.passageId).length} questions
              </div>
              <div className="rc-passage-panel">{q.passage}</div>
            </>
          )}

          {q.type === "dataSufficiency" && (
            <div className="extra-context">
              <p><strong>(1)</strong> {q.statement1}</p>
              <p><strong>(2)</strong> {q.statement2}</p>
            </div>
          )}

          {q.type === "multiSourceReasoning" && (
            <div className="sources-panel">
              {q.sources.map((src) => (
                <div className="source-tab" key={src.title}>
                  <div className="source-title">{src.title}</div>
                  <div className="source-content">{src.content}</div>
                </div>
              ))}
            </div>
          )}

          {q.type === "tableAnalysis" && (
            <>
              <p className="extra-context">{q.statement}</p>
              <table className="di-table">
                <thead>
                  <tr>{q.table.columns.map((c) => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {q.table.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {q.image && (
            <div className="q-image-wrap"><img src={q.image} alt="Question visual" /></div>
          )}

          <div className="q-text">{q.question}</div>

          <div className="options-wrap">
            {q.options.map((opt) => {
              const letter = opt.trim().charAt(0);
              const isSelected = draftValue === letter;
              return (
                <div
                  key={opt}
                  className={`option-row ${isSelected ? "selected" : ""}`}
                  onClick={() => setDraftSimple(letter)}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        </>
      );
    }

    if (q.type === "graphicsInterpretation") {
      const draft = draftValue || {};
      return (
        <>
          {q.image && (
            <div className="q-image-wrap"><img src={q.image} alt="Chart" /></div>
          )}
          <div className="blanks-wrap">
            {q.blanks.map((b, i) => (
              <div className="blank-row" key={i}>
                <span className="blank-text">{b.text}</span>
                <select
                  value={draft[`blank${i}`] || ""}
                  onChange={(e) => setDraftBlank(i, e.target.value)}
                  className="blank-select"
                >
                  <option value="" disabled>Select…</option>
                  {b.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (q.type === "twoPartAnalysis") {
      const draft = draftValue || {};
      return (
        <>
          <div className="q-text">{q.question}</div>
          <table className="two-part-table">
            <thead>
              <tr>
                <th></th>
                {q.columns.map((c) => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {q.options.map((opt) => (
                <tr key={opt}>
                  <td className="two-part-optlabel">{opt}</td>
                  {q.columns.map((col) => (
                    <td key={col} style={{ textAlign: "center" }}>
                      <input
                        type="radio"
                        name={`gmat-2pa-${q.id}-${col}`}
                        checked={draft[col] === opt}
                        onChange={() => setDraftColumn(col, opt)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }

    return null;
  };

  // ── MAIN TEST SCREEN ─────────────────────────────────────────
  return (
    <div className="gmat-container">
      <style jsx>{`
        * { box-sizing: border-box; }
        .gmat-container {
          min-height: 100px; background: #ffffff; padding: 1.5rem; padding-top: 100px;
          padding-bottom: 1rem; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .top-bar {
          max-width: 900px; margin: 0 auto 1.5rem auto; display: flex; justify-content: space-between;
          align-items: center; border-bottom: 1px solid #d1fae5; padding-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;
        }
        .test-title { font-size: 1.3rem; font-weight: 800; color: #166534; }
        .section-label { font-size: 0.9rem; color: #6b7280; margin-top: 2px; }
        .timer-box {
          display: flex; align-items: center; gap: 8px; font-family: monospace; font-size: 1.15rem;
          font-weight: 800; padding: 8px 16px; border-radius: 12px; border: 1px solid #bbf7d0; background: #f0fdf4; color: #166534;
        }
        .timer-warning { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
        .edits-badge { font-size: 0.8rem; color: #6b7280; }
        .question-wrap { max-width: 900px; margin: 0 auto 2rem auto; max-height: calc(100vh - 165px); overflow-y: auto; padding-right: 4px; }
        .question-card { background: #ffffff; border: 1px solid #d1fae5; border-radius: 12px; padding: 1.4rem 1.6rem; }
        .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
        .q-position { font-size: 0.85rem; font-weight: 700; color: #15803d; }
        .bookmark-btn { background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1.2rem; }
        .bookmark-btn.active { color: #f59e0b; }
        .q-text { color: #14532d; font-size: 1rem; line-height: 1.6; white-space: pre-line; margin-bottom: 1rem; }
        .extra-context { background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 0.9rem 1.1rem; margin-bottom: 1rem; font-size: 0.92rem; color: #374151; }
        .rc-passage-label { font-size: 0.75rem; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 0.4rem; }
        .rc-passage-panel { background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 1.1rem 1.3rem; margin-bottom: 1.2rem; font-size: 0.92rem; color: #374151; line-height: 1.6; max-height: 260px; overflow-y: auto; }
        .sources-panel { display: flex; gap: 0.8rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .source-tab { flex: 1; min-width: 220px; background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 0.8rem 1rem; }
        .source-title { font-weight: 700; color: #166534; font-size: 0.85rem; margin-bottom: 0.4rem; }
        .source-content { font-size: 0.85rem; color: #374151; white-space: pre-line; }
        .di-table, .two-part-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
        .di-table th, .di-table td, .two-part-table th, .two-part-table td { border: 1px solid #d1d5db; padding: 0.5rem 0.7rem; font-size: 0.85rem; text-align: left; }
        .two-part-optlabel { font-weight: 600; }
        .q-image-wrap { margin-bottom: 1rem; text-align: center; }
        .q-image-wrap img { max-width: 100%; max-height: 320px; object-fit: contain; border-radius: 8px; border: 1px solid #d1d5db; }
        .options-wrap { display: flex; flex-direction: column; gap: 0.6rem; }
        .option-row { padding: 0.65rem 1rem; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 0.92rem; color: #374151; }
        .option-row:hover { background: #f9fffb; }
        .option-row.selected { border-color: #16a34a; background: #f0fdf4; color: #14532d; font-weight: 600; }
        .blanks-wrap { display: flex; flex-direction: column; gap: 0.8rem; }
        .blank-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; font-size: 0.95rem; color: #374151; }
        .blank-select { padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid #d1d5db; font-weight: 700; color: #166534; }
        .nav-footer {
          position: sticky; bottom: 0; left: 0; right: 0; background: #ffffff; border-top: 1px solid #d1fae5;
          padding: 0.6rem 1.2rem 0.7rem 1.2rem; box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
        }
        .nav-footer-inner { max-width: 900px; margin: 0 auto; }
        .nav-buttons { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.1rem; max-height: 36px; overflow-y: auto; }
        .nav-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid #d1fae5; background: #ffffff; color: #15803d; font-size: 0.7rem; font-weight: 700; cursor: pointer; position: relative; }
        .nav-btn.answered { background: #dcfce7; border-color: #16a34a; }
        .nav-btn.current { background: #16a34a; color: white; }
        .nav-btn.bookmarked::after { content: "★"; position: absolute; top: -6px; right: -4px; font-size: 0.6rem; color: #f59e0b; }
        .gmat-footer-actions { display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; gap: 0.4rem; min-height: 0; margin: 0; padding: 0; line-height: 1; width: 100%; }
        .gmat-footer-actions-left { display: flex; align-items: center; margin: 0; padding: 0; }
        .gmat-footer-actions-right { display: flex; align-items: center; gap: 0.4rem; flex-wrap: nowrap; margin: 0; padding: 0; }
        .btn-exit { background: #ffffff; color: #dc2626; border: 1px solid #fca5a5; padding: 0.55rem 1.1rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; line-height: 1.2; }        .btn-exit:hover { background: #fee2e2; }
        .btn-primary { background: #16a34a; color: white; border: none; padding: 0.65rem 1.6rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.98rem; line-height: 1.2; }        .btn-primary:disabled, .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
        .nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-secondary { background: #ffffff; color: #166534; border: 1px solid #bbf7d0; padding: 0.65rem 1.4rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.98rem; line-height: 1.2; }        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1.5rem; }
        .modal-box { background: white; border-radius: 16px; padding: 2rem; max-width: 480px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
        .modal-title { font-size: 1.3rem; font-weight: 800; color: #166534; margin-bottom: 0.8rem; }
        .modal-body { color: #374151; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
        .modal-buttons { display: flex; gap: 0.8rem; flex-wrap: wrap; }
        @media (max-width: 600px) {
          .gmat-container { padding-bottom: 1rem; }
          .btn-primary, .btn-secondary { padding: 0.55rem 1.2rem; font-size: 0.9rem; }
          .btn-exit { padding: 0.5rem 0.9rem; font-size: 0.82rem; }
          .gmat-footer-actions-right { gap: 0.3rem; }
          .gmat-footer-actions { overflow-x: auto; }
          .question-card { padding: 1rem 1.1rem; min-height: unset; }
          .q-text { font-size: 0.92rem; }
          .rc-passage-panel { max-height: 180px; }
        }
      `}</style>

      <div className="top-bar">
        <div>
          <div className="test-title">
            {isFullTest ? GMAT_CONFIG.title : `${currentSection.label} Practice`}
          </div>
          <div className="section-label">
            {isFullTest && `Section ${currentSectionIdx + 1} of ${SECTIONS_TO_RUN.length}: `}
            {currentSection.label} — Question {pointer + 1} of {currentSection.count}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className="edits-badge">Edits left: {editsRemaining}/{GMAT_CONFIG.maxAnswerChangesPerSection}</span>
          <div className={`timer-box ${timeLeft !== null && timeLeft < 120 ? "timer-warning" : ""}`}>
            <FiClock /> {formatTime(timeLeft ?? 0)}
          </div>
        </div>
      </div>

      <div className="question-wrap">
        <div className="question-card">
          <div className="q-header">
            <span className="q-position">Q{pointer + 1} · {currentQuestion.topic} · {currentQuestion.difficultyLevel}</span>
            <button
              className={`bookmark-btn ${bookmarks[currentQuestion.id] ? "active" : ""}`}
              onClick={() => toggleBookmark(currentQuestion.id)}
              title="Bookmark this question (reminder only — doesn't affect answer changes)"
            >
              <FiBookmark />
            </button>
          </div>
          {renderQuestionBody(currentQuestion)}
        </div>
      </div>

      <div className="nav-footer">
        <div className="nav-footer-inner">
          <div className="nav-buttons">
            {history.map((q, idx) => {
              let cls = "nav-btn";
              if (idx === pointer) cls += " current";
              else if (answers[q.id]) cls += " answered";
              if (bookmarks[q.id]) cls += " bookmarked";
              return (
                <button
                  key={q.id}
                  className={cls}
                  onClick={() => handleJumpTo(idx)}
                  disabled={!canReview}
                  title={!canReview ? "Available once you've answered every question in this section" : ""}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="gmat-footer-actions">
            <div className="gmat-footer-actions-left">
              <button className="btn-exit" onClick={handleExitTest}>
                <FiLogOut /> Exit
              </button>
            </div>
            <div className="gmat-footer-actions-right">
              {pointer > 0 && canReview ? (
                <button className="btn-secondary" onClick={handlePrev}>
                  <FiArrowLeft /> Previous
                </button>
              ) : <span />}
              <button className="btn-primary" onClick={handleNext} disabled={!currentAnswered}>
                {pointer === history.length - 1 && history.length >= currentSection.count ? (
                  <>{isFullTest && isLastSectionOfRun ? "Finish Exam" : "Finish Section"} <FiFlag /></>
                ) : (
                  <>Next <FiArrowRight /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {dialogType === "finishSection" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Finish {currentSection.label} Section?</div>
            <div className="modal-body">
              You have {editsRemaining} answer edit(s) remaining in this section.
              Once you continue to the next section, you cannot return to {currentSection.label} or change any of its answers.
              Are you sure you want to continue?
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleContinueToNextSection}>
                Continue to {nextSectionLabel}
              </button>
              <button className="btn-secondary" onClick={handleStayInSection}>
                Stay in {currentSection.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {dialogType === "submitExam" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Finish Exam?</div>
            <div className="modal-body">
              Once you submit, your exam will end and your results will be calculated.
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSubmitExam}>Submit Exam</button>
              <button className="btn-secondary" onClick={handleContinueReviewing}>Continue Reviewing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}