// src/components/ProfilePage.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

import GMAT_CONFIG from "../quiz/gmat-test/GmatConfig";
import CAT_CONFIG from "../quiz/cat-test/CatConfig";
import MAT_CONFIG from "../quiz/mat-test/MatConfig";
import PGCET_MBA_CONFIG from "../quiz/pgcet-mba-test/PgcetmbaConfig";
import PGCET_MCA_CONFIG from "../quiz/pgcet-mca-test/PgcetmcaConfig";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};


const wasAttempted = (test) => {
  if (!test) return false;
  const result = test.result || {};

 
  if (result.essayTask1 || result.essayTask2 || result.essay) return true;
  if (typeof result.score === "number" && result.score > 0) return true;
  if (typeof result.rawScore === "number" && result.rawScore > 0) return true;


  const breakdownEntries = result.breakdown ? Object.values(result.breakdown) : null;
  if (breakdownEntries && breakdownEntries.length > 0) {
    const looksLikePerQuestion = breakdownEntries.every(
      (b) => b && typeof b === "object" && ("correct" in b || "isCorrect" in b)
    );
    if (looksLikePerQuestion) {
      return breakdownEntries.some(
        (b) => b.user !== undefined && b.user !== null && String(b.user).trim() !== ""
      );
    }
  }

  if (Array.isArray(result.questionAnalysis) && result.questionAnalysis.length > 0) {
    return result.questionAnalysis.some(
      (a) => a && a.studentAnswer && String(a.studentAnswer).trim() !== ""
    );
  }

  return false;
};

// ── Shared helpers for GMAT / CAT / MAT / PGCET (breakdown is keyed by question id) ──
const filterBreakdownByRange = (breakdown, idRange) => {
  if (!breakdown || !idRange) return {};
  const [min, max] = idRange;
  return Object.fromEntries(
    Object.entries(breakdown).filter(([id]) => {
      const n = Number(id);
      return !Number.isNaN(n) && n >= min && n <= max;
    })
  );
};

const summarizeBreakdown = (breakdown, idRange) => {
  const subset = filterBreakdownByRange(breakdown, idRange);
  const entries = Object.values(subset);
  let correct = 0, attempted = 0, marks = 0;
  entries.forEach((e) => {
    const isAttempted = e && e.user !== null && e.user !== undefined && e.user !== "";
    if (isAttempted) attempted += 1;
    if (e && e.isCorrect) correct += 1;
    if (e && typeof e.mark === "number") marks += e.mark;
  });
  return { correct, attempted, total: entries.length, marks: Math.round(marks * 100) / 100 };
};

// ── Score box ──
const ScoreBox = ({ label, value, isTotal, notAttempted, date }) => (
  <div style={{
    background: isTotal ? "#1a7a4a" : "#e8f8f0",
    border: `2px solid ${isTotal ? "#0d5c36" : "#b2e8cb"}`,
    borderRadius: "10px", padding: "14px 10px", textAlign: "center",
    minWidth: "90px", flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", gap: "4px",
  }}>
    <div style={{ fontSize: "0.72rem", fontWeight: "700", color: isTotal ? "#a0f0c8" : "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px", whiteSpace: "pre-line" }}>{label}</div>
    <div style={{ fontSize: isTotal ? "2rem" : "1.75rem", fontWeight: "900", color: isTotal ? "#ffffff" : notAttempted ? "#aaaaaa" : "#1a7a4a", lineHeight: 1 }}>
      {notAttempted ? "-" : value ?? "—"}
    </div>
    {date && !notAttempted && (
      <div style={{ fontSize: "0.62rem", color: isTotal ? "#80d8a8" : "#5a9a70", marginTop: "4px", fontWeight: "500" }}>
        {formatDate(date)}<br />{formatTime(date)}
      </div>
    )}
  </div>
);

// ── Section tabs ──
const SectionTabs = ({ active, tabs, onChange }) => (
  <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
    {tabs.map((tab) => (
      <button key={tab} onClick={() => onChange(tab)} style={{
        padding: "7px 18px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700",
        cursor: "pointer", border: "none", letterSpacing: "0.2px",
        background: active === tab ? "#222" : "#f0f0f0",
        color: active === tab ? "#fff" : "#555", transition: "all 0.15s",
      }}>{tab}</button>
    ))}
  </div>
);

// ── Improvement tips ──
const ImprovementCard = ({ tips }) => (
  <ul style={{ margin: "16px 0 0", paddingLeft: "20px", fontSize: "0.88rem", color: "#333", lineHeight: "2" }}>
    {tips.map((tip, i) => <li key={i}>{tip}</li>)}
  </ul>
);

// ── Next steps card ──
const NextStepsCard = ({ suggestions }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
    <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "18px" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>NEXT STEPS</div>
      <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "10px" }}>Review Your Performance</div>
      <p style={{ fontSize: "0.83rem", color: "#555", lineHeight: "1.7", margin: 0 }}>
        Review your performance breakdown below to find areas where you can improve. Focus on sections where you scored lower to boost your overall band.
      </p>
    </div>
    <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "18px" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>IMPROVEMENT TIPS</div>
      <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "10px" }}>💡 Areas to Improve</div>
      {suggestions.length === 0 ? (
        <p style={{ fontSize: "0.83rem", color: "#2a7a50", fontWeight: "600", margin: 0 }}>✅ Great job! All sections are above target.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.82rem", color: "#555", lineHeight: "1.9" }}>
          {suggestions.slice(0, 3).map((s, i) => <li key={i}><strong>{s.label}:</strong> {s.tips[0]}</li>)}
        </ul>
      )}
    </div>
  </div>
);

// ── IELTS Writing breakdown ──
const IeltsWritingBreakdown = ({ result }) => {
  if (!result) return null;
  return (
    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {result.task1Band !== undefined && (
          <div style={{ flex: 1, minWidth: "120px", padding: "14px", background: "#e8f8f0", border: "2px solid #b2e8cb", borderRadius: "10px", textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px" }}>Task 1 Band</div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#1a7a4a" }}>{result.task1Band}</div>
            <div style={{ fontSize: "0.72rem", color: "#5a9a70" }}>{result.wordCountTask1 || 0} words</div>
          </div>
        )}
        {result.task2Band !== undefined && (
          <div style={{ flex: 1, minWidth: "120px", padding: "14px", background: "#e8f8f0", border: "2px solid #b2e8cb", borderRadius: "10px", textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px" }}>Task 2 Band</div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#1a7a4a" }}>{result.task2Band}</div>
            <div style={{ fontSize: "0.72rem", color: "#5a9a70" }}>{result.wordCountTask2 || 0} words</div>
          </div>
        )}
      </div>
      {result.essayTask1 && (
        <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>📝 Task 1 — Your Response</div>
          <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "200px", overflowY: "auto" }}>{result.essayTask1}</p>
        </div>
      )}
      {result.essayTask2 && (
        <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>📝 Task 2 — Your Response</div>
          <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "200px", overflowY: "auto" }}>{result.essayTask2}</p>
        </div>
      )}
    </div>
  );
};

// ── TOEFL Writing breakdown ──
const ToeflWritingBreakdown = ({ result }) => {
  if (!result) return (
    <div style={{ marginTop: "16px", padding: "20px", background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", textAlign: "center", color: "#888", fontSize: "0.85rem" }}>
      No writing response data available yet.
    </div>
  );

  const tasks = result.breakdown ? Object.entries(result.breakdown) : [];

  return (
    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "14px 16px", background: "#f0fbf5", border: "1px solid #b2e8cb", borderRadius: "8px" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1a7a4a" }}>
          📝 {result.rawScore ?? "?"} of {result.total ?? "?"} tasks met minimum word count
          &nbsp;|&nbsp; TOEFL Score: {result.toeflScore ?? "?"}/30
        </span>
      </div>

      {tasks.length === 0 && (
        <div style={{ padding: "16px", background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", color: "#888", fontSize: "0.85rem", textAlign: "center" }}>
          Detailed writing responses not available for this attempt.
        </div>
      )}

      {tasks.map(([taskId, task]) => (
        <div key={taskId} style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#333" }}>{task.title || taskId}</div>
            <span style={{
              fontSize: "0.75rem", fontWeight: "700", padding: "3px 10px", borderRadius: "20px",
              background: task.meetsMinimum ? "#e8f8f0" : "#fff5f5",
              border: `1px solid ${task.meetsMinimum ? "#b2e8cb" : "#fecaca"}`,
              color: task.meetsMinimum ? "#1a7a4a" : "#dc2626",
            }}>
              {task.wordCount} words {task.meetsMinimum ? "✅" : `❌ (min: ${task.minWords})`}
            </span>
          </div>
          {task.prompt && (
            <div style={{ background: "#f0fbf5", border: "1px solid #b2e8cb", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: "700", color: "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>Prompt</div>
              <p style={{ fontSize: "0.82rem", color: "#333", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>{task.prompt}</p>
            </div>
          )}
          <div style={{ fontSize: "0.68rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Your Response</div>
          {task.response ? (
            <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "220px", overflowY: "auto", background: "#fff", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "12px" }}>
              {task.response}
            </p>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "#aaa", fontStyle: "italic", margin: 0 }}>No response submitted.</p>
          )}
        </div>
      ))}
    </div>
  );
};

// ── GRE Analytical Writing breakdown ──
const GreAnalyticalBreakdown = ({ result }) => {
  if (!result) return (
    <div style={{ marginTop: "16px", padding: "20px", background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", textAlign: "center", color: "#888", fontSize: "0.85rem" }}>
      No writing response data available yet.
    </div>
  );
  return (
    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "120px", padding: "14px", background: "#e8f8f0", border: "2px solid #b2e8cb", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px" }}>AWA Score</div>
          <div style={{ fontSize: "2rem", fontWeight: "900", color: "#1a7a4a" }}>{result.score ?? "—"} / 6</div>
          <div style={{ fontSize: "0.72rem", color: "#5a9a70" }}>{result.wordCount ?? 0} words</div>
        </div>
      </div>
      {result.essay && (
        <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>📝 Your Essay Response</div>
          <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "260px", overflowY: "auto", background: "#fff", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "12px" }}>
            {result.essay}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Per-question review list — shared by IELTS Reading/Listening and
// TOEFL Reading/Listening. Two saved shapes exist across test types:
//  - array of { number, questionText, userAnswerText, correctAnswerText,
//    isCorrect, explanation } (TOEFL Reading/Listening)
//  - object keyed by question id: { [id]: { user, correct, isCorrect } }
//    (IELTS Reading/Listening)
// This normalizes both into the same row shape before rendering.
const AnswerBreakdown = ({ breakdown }) => {
  if (!breakdown) return null;

  const rows = Array.isArray(breakdown)
    ? breakdown.map((item, idx) => ({
        key: item.number ?? idx,
        number: item.number ?? idx + 1,
        questionText: item.questionText,
        userAnswerText: item.userAnswerText,
        correctAnswerText: item.correctAnswerText,
        isCorrect: !!item.isCorrect,
        explanation: item.explanation,
      }))
    : Object.entries(breakdown).map(([id, item], idx) => ({
        key: id,
        number: idx + 1,
        questionText: null,
        userAnswerText: Array.isArray(item?.user) ? item.user.join(", ") : item?.user,
        correctAnswerText: Array.isArray(item?.correct) ? item.correct.join(" / ") : item?.correct,
        isCorrect: !!item?.isCorrect,
        explanation: item?.explanation,
      }));

  if (rows.length === 0) return null;

  return (
    <div style={{ marginTop: "16px" }}>
      {rows.map((row, idx) => (
        <div key={row.key} style={{
          display: "flex", gap: "10px", alignItems: "flex-start",
          padding: "12px 0",
          borderTop: idx === 0 ? "none" : "1px solid #e8e8e8",
        }}>
          <div style={{
            flexShrink: 0, width: "26px", height: "26px", borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", fontWeight: "700",
            background: row.isCorrect ? "#e8f8f0" : "#fff5f5",
            color: row.isCorrect ? "#1a7a4a" : "#dc2626",
          }}>
            {row.isCorrect ? "✓" : "✕"}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#333", marginBottom: "4px" }}>
              Question {row.number}{row.questionText ? `. ${row.questionText}` : ""}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#555", lineHeight: "1.6" }}>
              <div>
                Your answer: <strong>
                  {row.userAnswerText && String(row.userAnswerText).trim() !== "" ? row.userAnswerText : "No answer"}
                </strong>
              </div>
              {!row.isCorrect && (
                <div>Correct answer: <strong>{row.correctAnswerText}</strong></div>
              )}
              {row.explanation && <div>Explanation: {row.explanation}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Divider ──
const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", marginTop: "20px" }}>
    <div style={{ height: "2px", flex: 1, background: "#e0e0e0" }} />
    <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#555", textTransform: "uppercase", letterSpacing: "1px", padding: "4px 12px", background: "#f0f0f0", borderRadius: "20px" }}>{label}</span>
    <div style={{ height: "2px", flex: 1, background: "#e0e0e0" }} />
  </div>
);

// ─────────────────────────────────────────────
function ProfilePage({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toeflTab, setToeflTab] = useState("Reading");
  const [ieltsTab, setIeltsTab] = useState("Reading");
  const [greTab, setGreTab] = useState("Verbal");
  const [gmatTab, setGmatTab] = useState("Quant");
  const [catTab, setCatTab] = useState("VARC");
  const [matTab, setMatTab] = useState(MAT_CONFIG.sections[0].label);
  const [pgcetMbaTab, setPgcetMbaTab] = useState(PGCET_MBA_CONFIG.sections[0].label);
  const [pgcetMcaTab, setPgcetMcaTab] = useState(PGCET_MCA_CONFIG.sections[0].label);
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) { if (onLogout) onLogout(); navigate("/login"); return; }
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data) {
          setUser(data);
        } else {
          localStorage.removeItem("token"); localStorage.removeItem("loggedIn");
          if (onLogout) onLogout(); navigate("/login");
        }
      } catch (err) {
        console.error("Profile fetch error:", err); setError("Server error");
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, [navigate, API_URL, onLogout]);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#555" }}>Loading profile...</div>;
  if (error) return <div style={{ padding: "4rem", textAlign: "center", color: "#ff5252" }}>{error}</div>;
  if (!user) return null;

  const testHistory = user.testHistory || [];

  // ─── TOEFL ───────────────────────────────────────────────────────
 // ─── TOEFL ───────────────────────────────────────────────────────
const toeflAll = testHistory.filter(
  (t) => t.testName?.toLowerCase().includes("toefl")
);

const findToefl = (keyword) =>
  toeflAll
    .filter((t) => t.testName?.toLowerCase().includes(keyword))
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

const toeflReadingTest = findToefl("reading");
const toeflListeningTest = findToefl("listening");
const toeflWritingTest = findToefl("writing");
const toeflSpeakingTest = findToefl("speaking");

const getScore = (test) =>
  test ? Number(test.result?.toeflScore) || 0 : 0;

const readingScore = getScore(toeflReadingTest);
const listeningScore = getScore(toeflListeningTest);
const writingScore = getScore(toeflWritingTest);
const speakingScore = getScore(toeflSpeakingTest);

// Official TOEFL iBT Total
const toeflTotal =
  readingScore +
  listeningScore +
  writingScore +
  speakingScore;

const anyToefl = toeflAll.length > 0;

const toeflTabToTest = {
  Reading: toeflReadingTest,
  Listening: toeflListeningTest,
  Writing: toeflWritingTest,
  Speaking: toeflSpeakingTest,
};
const getTOEFLSuggestions = () =>
  [
    {
      label: "Reading",
      score: readingScore,
      tips: [
        "Practice academic reading passages.",
        "Improve skimming and scanning.",
        "Learn vocabulary from context.",
      ],
    },
    {
      label: "Listening",
      score: listeningScore,
      tips: [
        "Listen to university lectures.",
        "Practice note-taking.",
        "Identify the speaker's purpose and main ideas.",
      ],
    },
    {
      label: "Speaking",
      score: speakingScore,
      tips: [
        "Record your responses.",
        "Practice speaking within the time limit.",
        "Improve pronunciation and fluency.",
      ],
    },
    {
      label: "Writing",
      score: writingScore,
      tips: [
        "Organize essays clearly.",
        "Support ideas with examples.",
        "Improve grammar and vocabulary.",
      ],
    },
  ].filter((section) => section.score < 23);

const getTOEFLNote = (score) => {
  if (score >= 110)
    return "Outstanding! Competitive for admission to the world's top universities.";

  if (score >= 100)
    return "Excellent! Meets the requirements of most top universities.";

  if (score >= 90)
    return "Very Good! Suitable for many graduate and undergraduate programs.";

  if (score >= 80)
    return "Good. Meets the admission requirements of many universities.";

  if (score >= 70)
    return "Fair. Additional preparation is recommended.";

  if (score >= 60)
    return "Needs improvement. Focus on your weaker sections.";

  return "Continue practising to improve your TOEFL score.";
};

  const toeflSectionTips = {
    Reading:   ["Practice skimming and scanning passages under time pressure.", "Read academic and news articles daily.", "Work on identifying main ideas and author's purpose."],
    Listening: ["Listen to TED Talks, lectures, and academic podcasts.", "Practice note-taking while listening.", "Focus on identifying key arguments and transitions."],
    Writing:   ["Practice integrated and independent essay structures.", "Work on clear thesis statements and coherent paragraphs.", "Expand academic vocabulary and vary sentence structure."],
    Speaking:  ["Record yourself and listen back for clarity.", "Practice speaking on academic topics spontaneously.", "Work on pacing, pronunciation, and linking ideas."],
  };

  // ─── IELTS ───────────────────────────────────────────────────────
  const ieltsAll = testHistory.filter(t => t.testName?.toLowerCase().includes("ielts"));

  const findIelts = (keyword) =>
    ieltsAll
      .filter(t => t.testName?.toLowerCase().includes(keyword))
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const ieltsReadingTest   = findIelts("reading");
  const ieltsListeningTest = findIelts("listening");
  const ieltsWritingTest   = findIelts("writing");
  const ieltsSpeakingTest  = findIelts("speaking");

  const calculateIELTSBand = (score, total = 40) => {
    const scaledRaw = Math.round((score / total) * 40);
    const bandMap = [[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[27,6.5],[23,6],[19,5.5],[15,5],[13,4.5],[10,4],[7,3.5],[5,3],[3,2.5],[1,2],[0,0]];
    for (const [minRaw, band] of bandMap) { if (scaledRaw >= minRaw) return band; }
    return 0;
  };

  // ── FIXED: each section now only counts if wasAttempted() confirms the
  // user actually answered something. A test that auto-submitted with no
  // answers (e.g. Listening timing out) is treated as "Not attempted"
  // instead of a real Band 0, so it can no longer silently drag the
  // Total Score down or be mistaken for a completed section.
  const ieltsReading   = (ieltsReadingTest && wasAttempted(ieltsReadingTest))
    ? (ieltsReadingTest.result?.bandScore ?? calculateIELTSBand(Number(ieltsReadingTest.result?.score) || 0))
    : null;
  const ieltsListening = (ieltsListeningTest && wasAttempted(ieltsListeningTest))
    ? calculateIELTSBand(Number(ieltsListeningTest.result?.score) || 0)
    : null;
  const ieltsWriting   = (ieltsWritingTest && wasAttempted(ieltsWritingTest))
    ? (ieltsWritingTest.result?.score ?? calculateIELTSBand(Number(ieltsWritingTest.result?.score) || 0))
    : null;
  const ieltsSpeaking  = (ieltsSpeakingTest && wasAttempted(ieltsSpeakingTest))
    ? calculateIELTSBand(Number(ieltsSpeakingTest.result?.score) || 0)
    : null;

  // ── FIXED: track which section results are actually contributing to
  // the Total Score, and whether they were all set on the same calendar
  // day. If not, we no longer imply this is one exam sitting — we show
  // an explicit warning banner instead.
  const ieltsSectionResults = [
    { key: "Reading",   test: ieltsReadingTest,   band: ieltsReading },
    { key: "Listening", test: ieltsListeningTest, band: ieltsListening },
    { key: "Writing",   test: ieltsWritingTest,   band: ieltsWriting },
    { key: "Speaking",  test: ieltsSpeakingTest,  band: ieltsSpeaking },
  ];

  const ieltsAttemptedResults = ieltsSectionResults.filter(s => s.band !== null && s.test);
  const ieltsBands = ieltsAttemptedResults.map(s => s.band);

  const ieltsOverall = ieltsBands.length > 0
    ? Math.round((ieltsBands.reduce((a, b) => a + b, 0) / ieltsBands.length) * 2) / 2
    : null;

  const ieltsIsSingleSitting = ieltsAttemptedResults.length <= 1
    ? true
    : new Set(ieltsAttemptedResults.map(s => new Date(s.test.date).toDateString())).size === 1;

  const ieltsMostRecentDate = ieltsAttemptedResults.length > 0
    ? ieltsAttemptedResults.reduce(
        (latest, s) => (new Date(s.test.date) > new Date(latest) ? s.test.date : latest),
        ieltsAttemptedResults[0].test.date
      )
    : null;

  const ieltsSessionWarning = !ieltsIsSingleSitting
    ? "These section scores are from different test attempts (different dates), not one sitting. Your Total Score is a composite average of your most recent attempt in each section."
    : null;

  const ieltsTabToTest = {
    Reading:   ieltsReadingTest,
    Listening: ieltsListeningTest,
    Writing:   ieltsWritingTest,
    Speaking:  ieltsSpeakingTest,
  };

  const getIELTSSuggestions = () => [
    { label: "Reading",   band: ieltsReading,   tips: ["Practice skimming and scanning techniques.", "Read academic articles daily to improve speed.", "Focus on understanding passage structure and keywords."] },
    { label: "Listening", band: ieltsListening, tips: ["Listen to podcasts, news, and lectures daily.", "Practice note-taking while listening.", "Focus on catching keywords and numbers accurately."] },
    { label: "Writing",   band: ieltsWriting,   tips: ["Work on task response and coherence.", "Practice writing introductions and conclusions.", "Learn to use a variety of sentence structures and vocabulary."] },
    { label: "Speaking",  band: ieltsSpeaking,  tips: ["Speak English daily, even alone.", "Record yourself and review pronunciation.", "Expand your answers with examples and opinions."] },
  ].filter(s => s.band !== null && s.band < 6.5);

  const getIELTSNote = (band) => {
    if (band >= 8) return "Excellent! You have a very strong command of English. Keep it up!";
    if (band >= 7) return "Great score! You are proficient and ready for most universities worldwide.";
    if (band >= 6) return "Good progress! A score of 6.5+ opens doors to many international universities.";
    if (band >= 5) return "You have a basic command of English. Consistent practice will help you reach your target band.";
    return "Keep practising — every band improvement brings you closer to your goal!";
  };

  const ieltsSectionTips = {
    Reading:   ["Practice skimming and scanning techniques.", "Read academic articles daily to improve speed.", "Focus on understanding passage structure and keywords."],
    Listening: ["Listen to podcasts, news, and lectures daily.", "Practice note-taking while listening.", "Focus on catching keywords and numbers accurately."],
    Writing:   ["Work on task response and coherence.", "Practice writing introductions and conclusions.", "Learn to use a variety of sentence structures and vocabulary."],
    Speaking:  ["Speak English daily, even alone.", "Record yourself and review pronunciation.", "Expand your answers with examples and opinions."],
  };

  // ─── GRE ─────────────────────────────────────────────────────────
  const greAll = testHistory.filter(t => t.testName?.toLowerCase().includes("gre"));

  const findGre = (keyword) =>
    greAll
      .filter(t => t.testName?.toLowerCase().includes(keyword))
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const greVerbalTest     = findGre("verbal");
  const greQuantTest      = findGre("quant");
  const greAnalyticalTest = findGre("analytical") || findGre("awa");

  const convertToGRE = (raw, total = 27) => raw != null ? Math.round(130 + (raw / total) * 40) : null;

  const greVerbal     = greVerbalTest     ? convertToGRE(greVerbalTest.result?.score)     : null;
  const greQuant      = greQuantTest      ? convertToGRE(greQuantTest.result?.score)      : null;
  const greAnalytical = greAnalyticalTest ? (greAnalyticalTest.result?.score ?? null)     : null;

  const greTotal = greVerbal !== null && greQuant !== null ? greVerbal + greQuant : null;
  const anyGRE = greAll.length > 0;

  // Tab → test object (used for breakdown rendering)
  const greTabToTest = {
    Verbal:       greVerbalTest,
    Quantitative: greQuantTest,
    Analytical:   greAnalyticalTest,
  };

  const getGRESuggestions = () => [
    { label: "Verbal",       score: greVerbal,     threshold: 155, tips: ["Build vocabulary with GRE word lists daily.", "Practice reading comprehension with dense passages.", "Work on text completion and sentence equivalence."] },
    { label: "Quantitative", score: greQuant,      threshold: 155, tips: ["Review core math concepts — algebra, geometry, statistics.", "Practice data interpretation and quantitative comparisons.", "Time yourself strictly on problem sets."] },
    { label: "Analytical",   score: greAnalytical, threshold: 4,   tips: ["Practice Issue and Argument essay templates.", "Focus on clear thesis and well-structured arguments.", "Read sample high-scoring AWA essays for reference."] },
  ].filter(s => s.score !== null && s.score < s.threshold);

  const getGRENote = (total) => {
    if (total >= 320) return "Excellent! A score of 320+ is competitive for top graduate programs worldwide.";
    if (total >= 300) return "Good score! 300+ meets requirements for most graduate programs.";
    if (total >= 280) return "Decent base. Focused preparation can push your score significantly higher.";
    return "Keep practising — consistent effort leads to major improvement on the GRE.";
  };

  const greSectionTips = {
    Verbal:       ["Build vocabulary with GRE word lists daily.", "Practice reading comprehension with dense passages.", "Work on text completion and sentence equivalence."],
    Quantitative: ["Review core math concepts — algebra, geometry, statistics.", "Practice data interpretation and quantitative comparisons.", "Time yourself strictly on problem sets."],
    Analytical:   ["Practice Issue and Argument essay templates.", "Focus on clear thesis and well-structured arguments.", "Read sample high-scoring AWA essays for reference."],
  };

  // ─── GMAT ────────────────────────────────────────────────────────
  // GMAT question ids don't collide across sections (Quant 1-100, Verbal
  // 101-200, Data Insights 201-300), so a full-test breakdown can safely
  // be split per section using these ranges.
  const gmatIdRanges = {
    "Quantitative Reasoning": [1, 100],
    "Verbal Reasoning": [101, 200],
    "Data Insights": [201, 300],
  };
  const gmatTabMeta = [
    { tab: "Quant", label: "Quantitative Reasoning" },
    { tab: "Verbal", label: "Verbal Reasoning" },
    { tab: "Data Insights", label: "Data Insights" },
  ];

  const gmatAll = testHistory.filter(t => t.testName?.toLowerCase().startsWith("gmat"));
  const gmatFullTest = gmatAll
    .filter(t => t.testName === "GMAT Full Practice Test")
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const findGmatPractice = (label) =>
    gmatAll
      .filter(t => t.testName === `GMAT ${label} Practice`)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const getGmatSectionData = (label) => {
    const idRange = gmatIdRanges[label];
    if (gmatFullTest) {
      const sec = (gmatFullTest.result?.sections || []).find(s => s.label === label);
      if (sec) {
        return {
          score: sec.estimatedSectionScore,
          raw: sec.raw,
          date: gmatFullTest.date,
          breakdown: filterBreakdownByRange(gmatFullTest.result?.breakdown, idRange),
        };
      }
    }
    const practice = findGmatPractice(label);
    if (practice) {
      return {
        score: practice.result?.estimatedSectionScore,
        raw: practice.result?.raw,
        date: practice.date,
        breakdown: practice.result?.breakdown || {},
      };
    }
    return null;
  };

  const gmatSectionData = {
    "Quantitative Reasoning": getGmatSectionData("Quantitative Reasoning"),
    "Verbal Reasoning": getGmatSectionData("Verbal Reasoning"),
    "Data Insights": getGmatSectionData("Data Insights"),
  };

  const anyGMAT = gmatAll.length > 0;
  const gmatTotal = gmatFullTest ? gmatFullTest.result?.estimatedOverall ?? null : null;
  const gmatTotalDate = gmatFullTest?.date;

  const gmatTabToTest = {};
  gmatTabMeta.forEach(({ tab, label }) => {
    const data = gmatSectionData[label];
    gmatTabToTest[tab] = data ? { result: { breakdown: data.breakdown } } : null;
  });

  const gmatSectionTips = {
    Quant: ["Revise core quant fundamentals — arithmetic, algebra, and geometry.", "Practice data sufficiency questions to build reasoning speed.", "Time yourself strictly on problem sets."],
    Verbal: ["Practice critical reasoning and reading comprehension daily.", "Focus on sentence correction grammar rules.", "Read dense academic and business articles for comprehension speed."],
    "Data Insights": ["Practice multi-source reasoning and table analysis questions.", "Get comfortable interpreting graphs and data sets quickly.", "Work on two-part analysis and graphics interpretation questions."],
  };

  const getGMATSuggestions = () => {
    const mid = (GMAT_CONFIG.sectionScoreScale.min + GMAT_CONFIG.sectionScoreScale.max) / 2;
    return gmatTabMeta
      .map(({ tab, label }) => ({ label: tab, score: gmatSectionData[label]?.score, tips: gmatSectionTips[tab] }))
      .filter(s => typeof s.score === "number" && s.score < mid);
  };

  const getGMATNote = (total) => {
    if (total >= 655) return "Excellent! Highly competitive for top MBA programs worldwide.";
    if (total >= 605) return "Very good, competitive for many strong business schools.";
    if (total >= 555) return "Good score, meets requirements for many good MBA programs.";
    if (total >= 455) return "Fair. Continued practice can meaningfully raise your score.";
    return "Keep practicing — steady prep leads to strong GMAT gains.";
  };

  // ─── CAT ─────────────────────────────────────────────────────────
  const catTest = testHistory
    .filter(t => t.testName === "CAT Mock Test")
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const catResult = catTest?.result || null;
  const catOverall = catResult?.overall || null;
  const catSections = catResult?.sections || [];
  const findCatSection = (key) => catSections.find(s => s.key === key) || null;

  const catShortTab = { varc: "VARC", dilr: "DILR", qa: "QA" };
  const catSectionMeta = CAT_CONFIG.sections.map(s => ({
    key: s.key,
    tab: catShortTab[s.key] || s.label,
    idRange: s.idRange,
  }));

  const anyCAT = !!catTest;

  const catTabToTest = {};
  catSectionMeta.forEach(({ key, tab, idRange }) => {
    catTabToTest[tab] = catResult ? { result: { breakdown: filterBreakdownByRange(catResult.breakdown, idRange) } } : null;
  });

  const catSectionTips = {
    VARC: ["Read editorials and opinion pieces daily to build reading speed.", "Practice para-jumbles and summary questions.", "Build vocabulary through contextual reading, not word lists."],
    DILR: ["Practice data sets under strict time limits.", "Learn to quickly identify the type of DI/LR set before solving.", "Focus on accuracy over attempting every set."],
    QA: ["Strengthen fundamentals in arithmetic, algebra, and geometry.", "Practice mental math to save time.", "Revise formulas and shortcut techniques regularly."],
  };

  const getCATSuggestions = () =>
    catSectionMeta
      .map(({ key, tab }) => {
        const sec = findCatSection(key);
        return { label: tab, score: sec?.score, tips: catSectionTips[tab] };
      })
      .filter(s => s.score && s.score.accuracy < 60);

  const getCATNote = (marks) => {
    if (marks >= 150) return "Outstanding! Highly competitive for top IIMs and premier B-schools.";
    if (marks >= 110) return "Excellent! Competitive for many top-tier MBA programs.";
    if (marks >= 70) return "Good score. Meets requirements for several good B-schools.";
    if (marks >= 30) return "Fair. Focused practice can meaningfully boost your score.";
    return "Keep practicing — consistent effort will improve your CAT score.";
  };

  // ─── MAT ─────────────────────────────────────────────────────────
  const matTest = testHistory
    .filter(t => t.testName === "MAT Mock Test")
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const matResult = matTest?.result || null;

  const matSectionMeta = MAT_CONFIG.sections.map(s => ({ key: s.key, label: s.label, idRange: s.idRange }));

  const matSectionTips = {
    languageComprehension: ["Read varied passages daily to build comprehension speed.", "Practice para-jumbles, para-completion, and critical reasoning.", "Work on vocabulary and inference-based questions."],
    intelligenceReasoning: ["Practice puzzles, syllogisms, and logical sequences regularly.", "Time yourself on reasoning sets to build speed.", "Review common analytical reasoning question patterns."],
    dataAnalysis: ["Practice data sufficiency and data interpretation sets.", "Get comfortable reading tables, graphs, and charts quickly.", "Focus on accuracy before speed in DI sets."],
    mathematicalSkills: ["Revise core arithmetic, algebra, and geometry concepts.", "Practice speed calculation techniques.", "Solve previous years' MAT quant sets under time pressure."],
    economicBusiness: ["Stay updated on current economic and business affairs.", "Revise basic economics and business terminology.", "Practice general knowledge questions on business trends."],
  };

  const matTabToTest = {};
  matSectionMeta.forEach(({ key, label, idRange }) => {
    matTabToTest[label] = matResult ? { result: { breakdown: filterBreakdownByRange(matResult.breakdown, idRange) } } : null;
  });

  const getMATSuggestions = () =>
    matSectionMeta
      .map(({ key, label, idRange }) => {
        const stats = summarizeBreakdown(matResult?.breakdown, idRange);
        const ratio = stats.total > 0 ? stats.correct / stats.total : 0;
        return { label, ratio, hasData: !!matResult, tips: matSectionTips[key] };
      })
      .filter(s => s.hasData && s.ratio < 0.6);

  const getMATNote = (composite) => {
    if (composite >= 700) return "Excellent! Highly competitive score for top B-schools accepting MAT.";
    if (composite >= 600) return "Very good. Meets requirements for many reputed institutes.";
    if (composite >= 500) return "Good. Suitable for a solid range of MBA colleges.";
    if (composite >= 400) return "Fair. Focused preparation can meaningfully raise your score.";
    return "Keep practicing — every bit of preparation helps raise your MAT score.";
  };

  // ─── PGCET MBA ───────────────────────────────────────────────────
  const pgcetMbaTest = testHistory
    .filter(t => t.testName === "PGCET MBA Mock Test")
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const pgcetMbaResult = pgcetMbaTest?.result || null;
  const pgcetMbaSectionMeta = PGCET_MBA_CONFIG.sections.map(s => ({ key: s.key, label: s.label, idRange: s.idRange }));

  const pgcetMbaSectionTips = {
    computerAwareness: ["Revise computer fundamentals, MS Office, and basic networking.", "Practice previous years' computer awareness questions.", "Stay updated on common tech terms and abbreviations."],
    analyticalReasoning: ["Practice puzzles, seating arrangements, and syllogisms.", "Work on blood relations and direction sense questions.", "Time yourself to improve solving speed."],
    quantitativeAnalysis: ["Revise arithmetic, percentages, ratios, and averages.", "Practice data interpretation questions regularly.", "Focus on shortcut calculation techniques."],
    englishLanguage: ["Read English newspapers and articles daily.", "Practice grammar, vocabulary, and comprehension questions.", "Work on error-spotting and sentence correction."],
    generalKnowledge: ["Follow current affairs and general awareness sources regularly.", "Revise static GK topics like history, geography, and polity.", "Practice previous years' GK question sets."],
  };

  const pgcetMbaTabToTest = {};
  pgcetMbaSectionMeta.forEach(({ key, label, idRange }) => {
    pgcetMbaTabToTest[label] = pgcetMbaResult ? { result: { breakdown: filterBreakdownByRange(pgcetMbaResult.breakdown, idRange) } } : null;
  });

  const getPGCETMbaSuggestions = () =>
    pgcetMbaSectionMeta
      .map(({ key, label, idRange }) => {
        const stats = summarizeBreakdown(pgcetMbaResult?.breakdown, idRange);
        const ratio = stats.total > 0 ? stats.correct / stats.total : 0;
        return { label, ratio, hasData: !!pgcetMbaResult, tips: pgcetMbaSectionTips[key] };
      })
      .filter(s => s.hasData && s.ratio < 0.6);

  // ─── PGCET MCA ───────────────────────────────────────────────────
  const pgcetMcaTest = testHistory
    .filter(t => t.testName === "PGCET MCA Mock Test")
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const pgcetMcaResult = pgcetMcaTest?.result || null;
  const pgcetMcaSectionMeta = PGCET_MCA_CONFIG.sections.map(s => ({ key: s.key, label: s.label, idRange: s.idRange }));

  const pgcetMcaSectionTips = {
    mathematics: ["Revise core mathematics topics — algebra, calculus, and statistics.", "Practice numerical problems under time pressure.", "Focus on speed and accuracy in calculations."],
    computerAwareness: ["Revise computer fundamentals, data structures, and basic networking.", "Practice previous years' computer awareness questions.", "Stay updated on common tech terms and abbreviations."],
    analyticalReasoning: ["Practice puzzles, seating arrangements, and syllogisms.", "Work on blood relations and direction sense questions.", "Time yourself to improve solving speed."],
    generalAwareness: ["Follow current affairs and general knowledge sources regularly.", "Revise static GK and important recent events.", "Practice previous years' general awareness sets."],
    generalEnglish: ["Practice grammar and vocabulary exercises regularly.", "Read English articles to build comprehension speed.", "Work on sentence correction and error spotting."],
  };

  const pgcetMcaTabToTest = {};
  pgcetMcaSectionMeta.forEach(({ key, label, idRange }) => {
    pgcetMcaTabToTest[label] = pgcetMcaResult ? { result: { breakdown: filterBreakdownByRange(pgcetMcaResult.breakdown, idRange) } } : null;
  });

  const getPGCETMcaSuggestions = () =>
    pgcetMcaSectionMeta
      .map(({ key, label, idRange }) => {
        const stats = summarizeBreakdown(pgcetMcaResult?.breakdown, idRange);
        const ratio = stats.total > 0 ? stats.correct / stats.total : 0;
        return { label, ratio, hasData: !!pgcetMcaResult, tips: pgcetMcaSectionTips[key] };
      })
      .filter(s => s.hasData && s.ratio < 0.6);

  const getPGCETNote = (percentage) => {
    if (percentage >= 80) return "Excellent! Strong performance for PGCET admissions.";
    if (percentage >= 60) return "Good score. Competitive for several PGCET-affiliated colleges.";
    if (percentage >= 40) return "Fair. More practice can help raise your percentile.";
    return "Keep practicing to build a stronger PGCET score.";
  };

  // ─── Render breakdown panel ───────────────────────────────────────
  const renderBreakdownPanel = ({ activeTab, isIelts, isToefl, isGre, isGeneric, breakdownMap }) => {
    const tabTest = breakdownMap[activeTab];

    // ── IELTS ──
    if (isIelts) {
      if (!tabTest) return null;
      if (activeTab === "Writing") {
        return (
          <>
            <SectionDivider label="Writing Responses" />
            <IeltsWritingBreakdown result={tabTest.result} />
          </>
        );
      }
      // Speaking is an appointment booking, not an auto-graded test —
      // there are no answers to review.
      if (activeTab === "Speaking") return null;

      const bd = tabTest.result?.breakdown;
      if (!bd || Object.keys(bd).length === 0) return null;
      return (
        <>
          <SectionDivider label="Your Answers vs Correct Answers" />
          <AnswerBreakdown breakdown={bd} />
        </>
      );
    }

    // ── TOEFL ──
    if (isToefl) {
      if (!tabTest) return null;
      if (activeTab === "Writing") {
        return (
          <>
            <SectionDivider label="Writing Responses" />
            <ToeflWritingBreakdown result={tabTest.result} />
          </>
        );
      }

      if (activeTab === "Speaking") return null;
      const bd = tabTest.result?.breakdown;
      if (!bd || Object.keys(bd).length === 0) {
        return (
          <>
           
          </>
        );
      }
      return (
        <>
          <SectionDivider label="Your Answers vs Correct Answers" />
          <AnswerBreakdown breakdown={bd} />
        </>
      );

      // Reading / Listening / Speaking: no answer breakdown anymore
      return null;

    }

    // ── GRE ──
    if (isGre) {
      if (!tabTest) return null;

      // Analytical tab → show essay
      if (activeTab === "Analytical") {
        return (
          <>
            <SectionDivider label="Analytical Writing Response" />
            <GreAnalyticalBreakdown result={tabTest.result} />
          </>
        );
      }


      // Verbal / Quantitative → show answer breakdown
      const bd = tabTest.result?.breakdown;
      if (!bd || Object.keys(bd).length === 0) {
        return (
          <>
           
          </>
        );
      }
      return (
        <>
          <SectionDivider label="Your Answers vs Correct Answers" />
          <AnswerBreakdown breakdown={bd} />
        </>
      );

      // Verbal / Quantitative: no answer breakdown anymore
      return null;

    }

    // GMAT / CAT / MAT / PGCET: no answer breakdown

    return null;
  };

  // ─── Shared test block renderer ───────────────────────────────────
  const renderTestBlock = ({
    title, subtitle, scoreBoxes, totalBox,
    sectionTabs, activeTab, onTabChange,
    sectionTips, suggestions, note, sessionWarning,
    isIelts, isToefl, isGre, isGeneric, breakdownMap,
  }) => (
    <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "16px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#111", marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "0.82rem", color: "#888", fontWeight: "500" }}>{subtitle}</div>
      </div>

      {/* Score boxes */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
        {totalBox && <ScoreBox label="Total Score" value={totalBox.value} isTotal date={totalBox.date} />}
        {scoreBoxes.map((box) => (
          <ScoreBox key={box.label} label={box.label} value={box.value} notAttempted={box.notAttempted} date={box.date} />
        ))}
      </div>

      {/* Note */}
      {note && (
        <div style={{ marginTop: "16px", background: "#f0fbf5", border: "1px solid #b2e8cb", borderRadius: "8px", padding: "10px 14px", fontSize: "0.83rem", color: "#1a7a4a", fontWeight: "500" }}>
          📌 {note}
        </div>
      )}

      {/* Session mismatch warning — shown when the sections making up the
          Total Score come from different test dates, so the user isn't
          misled into thinking these came from a single sitting. */}
      {sessionWarning && (
        <div style={{ marginTop: "10px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", padding: "10px 14px", fontSize: "0.83rem", color: "#9a3412", fontWeight: "500" }}>
          ⚠️ {sessionWarning}
        </div>
      )}

      <NextStepsCard suggestions={suggestions} />

      {/* Section tabs + content */}
      <div style={{ marginTop: "28px" }}>
        <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "4px" }}>Section Results</div>
        <SectionTabs active={activeTab} tabs={sectionTabs} onChange={onTabChange} />

        <div style={{ marginTop: "16px", background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", padding: "18px" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#333", marginBottom: "8px" }}>📚 Tips for {activeTab}</div>
          <ImprovementCard tips={sectionTips[activeTab] || []} />

          {renderBreakdownPanel({ activeTab, isIelts, isToefl, isGre, isGeneric, breakdownMap: breakdownMap || {} })}
        </div>
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "3rem 1rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", background: "#ffffff", borderRadius: "20px", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0d3d26 0%, #0a2e1e 50%, #061a12 100%)", padding: "3.5rem 2rem", textAlign: "center", width: "100%", borderBottom: "1px solid rgba(25,253,145,0.15)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#19fd91 1px, transparent 1px), linear-gradient(90deg, #19fd91 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: "110px", height: "110px", background: "linear-gradient(135deg, #19fd91, #0ab866)", borderRadius: "50%", margin: "0 auto 1.2rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", fontWeight: "900", color: "#060d16", boxShadow: "0 0 40px rgba(25,253,145,0.3)" }}>
              {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
            </div>
            <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: "900", color: "#e8f8f0", letterSpacing: "-0.5px" }}>{user.fullname || "User"}</h1>
            <p style={{ margin: "0.5rem 0 0", color: "#5a9a78", fontSize: "1rem", fontWeight: "500" }}>{user.email}</p>
            {user.isVerified && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "14px", background: "rgba(25,253,145,0.1)", border: "1px solid rgba(25,253,145,0.25)", padding: "5px 16px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "700", color: "#19fd91", letterSpacing: "0.3px" }}>
                ✅ Verified Account
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "2.5rem 2rem", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
            <h2 style={{ color: "#111", margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>Test History</h2>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          </div>

          {/* IELTS */}
          {ieltsAll.length > 0 && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test IELTS Practice Test",
            totalBox: ieltsOverall ? { value: ieltsOverall, date: ieltsMostRecentDate } : null,
            scoreBoxes: [
              { label: "Reading",   value: ieltsReading,   notAttempted: ieltsReading === null,   date: ieltsReadingTest?.date },
              { label: "Listening", value: ieltsListening, notAttempted: ieltsListening === null, date: ieltsListeningTest?.date },
              { label: "Speaking",  value: ieltsSpeaking,  notAttempted: ieltsSpeaking === null,  date: ieltsSpeakingTest?.date },
              { label: "Writing",   value: ieltsWriting,   notAttempted: ieltsWriting === null,   date: ieltsWritingTest?.date },
            ],
            sectionTabs: ["Reading", "Listening", "Speaking", "Writing"],
            activeTab: ieltsTab,
            onTabChange: setIeltsTab,
            sectionTips: ieltsSectionTips,
            suggestions: getIELTSSuggestions(),
            note: ieltsOverall ? getIELTSNote(ieltsOverall) : null,
            sessionWarning: ieltsSessionWarning,
            isIelts: true,
            breakdownMap: ieltsTabToTest,
          })}

          {/* TOEFL */}
          {anyToefl && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test TOEFL Practice Test",
totalBox:
  toeflTotal > 0
    ? {
        value: `${toeflTotal}/120`,
        date: toeflReadingTest?.date,
      }
    : null,
          scoreBoxes: [
  {
    label: "Reading",
    value: readingScore > 0 ? `${readingScore}/30` : null,
    notAttempted: readingScore === 0,
    date: toeflReadingTest?.date,
  },
  {
    label: "Listening",
    value: listeningScore > 0 ? `${listeningScore}/30` : null,
    notAttempted: listeningScore === 0,
    date: toeflListeningTest?.date,
  },
  {
    label: "Speaking",
    value: speakingScore > 0 ? `${speakingScore}/30` : null,
    notAttempted: speakingScore === 0,
    date: toeflSpeakingTest?.date,
  },
  {
    label: "Writing",
    value: writingScore > 0 ? `${writingScore}/30` : null,
    notAttempted: writingScore === 0,
    date: toeflWritingTest?.date,
  },
],
            sectionTabs: ["Reading", "Listening", "Speaking", "Writing"],
            activeTab: toeflTab,
            onTabChange: setToeflTab,
            sectionTips: toeflSectionTips,
            suggestions: getTOEFLSuggestions(),
            note: toeflTotal > 0 ? getTOEFLNote(toeflTotal) : null,
            isToefl: true,
            breakdownMap: toeflTabToTest,
          })}

          {/* GRE */}
          {anyGRE && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test GRE Practice Test",
            totalBox: greTotal ? { value: greTotal, date: greVerbalTest?.date } : null,
            scoreBoxes: [
              { label: "Verbal",       value: greVerbal     !== null ? `${greVerbal}/170`     : null, notAttempted: greVerbal     === null, date: greVerbalTest?.date },
              { label: "Quantitative", value: greQuant      !== null ? `${greQuant}/170`      : null, notAttempted: greQuant      === null, date: greQuantTest?.date },
         {
  label: "Analytical Writing\n(Not included in Overall Score)",
  value: greAnalytical !== null ? `${greAnalytical}/6` : null,
  notAttempted: greAnalytical === null,
  date: greAnalyticalTest?.date
}, ],
            sectionTabs: ["Verbal", "Quantitative", "Analytical"],
            activeTab: greTab,
            onTabChange: setGreTab,
            sectionTips: greSectionTips,
            suggestions: getGRESuggestions(),
            note: greTotal ? getGRENote(greTotal) : null,
            isGre: true,
            breakdownMap: greTabToTest,
          })}

          {/* GMAT */}
          {anyGMAT && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test GMAT Practice Test",
            totalBox: gmatTotal !== null ? { value: gmatTotal, date: gmatTotalDate } : null,
            scoreBoxes: gmatTabMeta.map(({ tab, label }) => {
              const data = gmatSectionData[label];
              return {
                label: tab,
                value: data ? `${data.score}/90` : null,
                notAttempted: !data,
                date: data?.date,
              };
            }),
            sectionTabs: gmatTabMeta.map(m => m.tab),
            activeTab: gmatTab,
            onTabChange: setGmatTab,
            sectionTips: gmatSectionTips,
            suggestions: getGMATSuggestions(),
            note: gmatTotal !== null ? getGMATNote(gmatTotal) : null,
            isGeneric: true,
            breakdownMap: gmatTabToTest,
          })}

          {/* CAT */}
          {anyCAT && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test CAT Mock Test",
            totalBox: catOverall ? { value: catOverall.marks, date: catTest?.date } : null,
            scoreBoxes: catSectionMeta.map(({ key, tab }) => {
              const sec = findCatSection(key);
              return {
                label: tab,
                value: sec ? sec.score.marks : null,
                notAttempted: !sec,
                date: catTest?.date,
              };
            }),
            sectionTabs: catSectionMeta.map(m => m.tab),
            activeTab: catTab,
            onTabChange: setCatTab,
            sectionTips: catSectionTips,
            suggestions: getCATSuggestions(),
            note: catOverall ? getCATNote(catOverall.marks) : null,
            isGeneric: true,
            breakdownMap: catTabToTest,
          })}

          {/* MAT */}
          {matTest && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test MAT Mock Test",
            totalBox: matResult ? { value: `${matResult.composite}/${MAT_CONFIG.compositeScale.max}`, date: matTest.date } : null,
            scoreBoxes: matSectionMeta.map(({ key, label, idRange }) => {
              const stats = summarizeBreakdown(matResult?.breakdown, idRange);
              return {
                label,
                value: matResult ? `${stats.correct}/${stats.total}` : null,
                notAttempted: !matResult,
                date: matTest?.date,
              };
            }),
            sectionTabs: matSectionMeta.map(m => m.label),
            activeTab: matTab,
            onTabChange: setMatTab,
            sectionTips: matSectionMeta.reduce((acc, { key, label }) => {
              acc[label] = matSectionTips[key];
              return acc;
            }, {}),
            suggestions: getMATSuggestions(),
            note: matResult ? `${getMATNote(matResult.composite)} Estimated percentile: ${matResult.percentile}%.` : null,
            isGeneric: true,
            breakdownMap: matTabToTest,
          })}

          {/* PGCET MBA */}
          {pgcetMbaTest && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test PGCET MBA Mock Test",
            totalBox: pgcetMbaResult ? { value: `${pgcetMbaResult.score}/${pgcetMbaResult.total}`, date: pgcetMbaTest.date } : null,
            scoreBoxes: pgcetMbaSectionMeta.map(({ key, label, idRange }) => {
              const stats = summarizeBreakdown(pgcetMbaResult?.breakdown, idRange);
              return {
                label,
                value: pgcetMbaResult ? `${stats.correct}/${stats.total}` : null,
                notAttempted: !pgcetMbaResult,
                date: pgcetMbaTest?.date,
              };
            }),
            sectionTabs: pgcetMbaSectionMeta.map(m => m.label),
            activeTab: pgcetMbaTab,
            onTabChange: setPgcetMbaTab,
            sectionTips: pgcetMbaSectionMeta.reduce((acc, { key, label }) => {
              acc[label] = pgcetMbaSectionTips[key];
              return acc;
            }, {}),
            suggestions: getPGCETMbaSuggestions(),
            note: pgcetMbaResult ? getPGCETNote(pgcetMbaResult.percentage) : null,
            isGeneric: true,
            breakdownMap: pgcetMbaTabToTest,
          })}

          {/* PGCET MCA */}
          {pgcetMcaTest && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test PGCET MCA Mock Test",
            totalBox: pgcetMcaResult ? { value: `${pgcetMcaResult.score}/${pgcetMcaResult.total}`, date: pgcetMcaTest.date } : null,
            scoreBoxes: pgcetMcaSectionMeta.map(({ key, label, idRange }) => {
              const stats = summarizeBreakdown(pgcetMcaResult?.breakdown, idRange);
              return {
                label,
                value: pgcetMcaResult ? `${stats.correct}/${stats.total}` : null,
                notAttempted: !pgcetMcaResult,
                date: pgcetMcaTest?.date,
              };
            }),
            sectionTabs: pgcetMcaSectionMeta.map(m => m.label),
            activeTab: pgcetMcaTab,
            onTabChange: setPgcetMcaTab,
            sectionTips: pgcetMcaSectionMeta.reduce((acc, { key, label }) => {
              acc[label] = pgcetMcaSectionTips[key];
              return acc;
            }, {}),
            suggestions: getPGCETMcaSuggestions(),
            note: pgcetMcaResult ? getPGCETNote(pgcetMcaResult.percentage) : null,
            isGeneric: true,
            breakdownMap: pgcetMcaTabToTest,
          })}

          {/* Empty state */}
          {testHistory.length === 0 && (
            <div style={{ textAlign: "center", color: "#888", padding: "4rem 2rem", background: "#fafafa", borderRadius: "12px", border: "1px solid #eee" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
              <p style={{ fontSize: "1rem", margin: "0 0 1.5rem" }}>You haven't taken any tests yet.</p>
              <button onClick={() => navigate("/")} style={{ background: "#1a7a4a", color: "#fff", border: "none", padding: "0.8rem 2.5rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer" }}>
                Explore Tests
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => { if (onLogout) onLogout(); navigate("/login"); }}
          style={{ marginTop: "0.5rem", marginBottom: "3rem", background: "transparent", color: "#ff5252", border: "1px solid rgba(255,82,82,0.5)", padding: "0.8rem 3rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" }}
          onMouseOver={(e) => { e.target.style.background = "rgba(255,82,82,0.06)"; }}
          onMouseOut={(e) => { e.target.style.background = "transparent"; }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;