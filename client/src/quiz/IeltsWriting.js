import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiClock } from "react-icons/fi";
import getApiBaseUrl from "../utils/api";

const IELTS_DATA_WRITING = {
  title: "Academic Writing Practice Test 1",
  tasks: [
    {
      id: "task1",
      title: "Task 1: Report (20 min)",
      prompt:
        "The diagram below shows how bricks are manufactured for the building industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      image: "/bricks.png",
      minWords: 150,
      // keywords used for a crude "did you address the prompt" check
      keywords: ["brick", "manufactur", "process", "clay", "kiln", "produc", "stage", "diagram", "compar"]
    },
    {
      id: "task2",
      title: "Task 2: Essay (40 min)",
      prompt:
        "Compared to the past, more people are now trying to learn a foreign language to increase their chances of landing a better job in their native country or having better opportunities to work abroad. To what extent do you agree with this point of view? Give specific reasons and examples to support your opinion.",
      minWords: 250,
      keywords: ["language", "job", "work", "career", "opportunit", "abroad", "agree", "disagree", "learn"]
    }
  ]
};

const LINKING_WORDS = [
  "however", "moreover", "furthermore", "in addition", "therefore", "consequently",
  "for example", "for instance", "in conclusion", "on the other hand", "as a result",
  "in contrast", "similarly", "although", "despite", "nevertheless", "thus", "hence",
  "firstly", "secondly", "finally", "overall", "in summary", "to conclude", "meanwhile"
];

const STOPWORDS = new Set([
  "the","a","an","is","are","was","were","and","or","but","of","to","in","on","for",
  "with","as","by","at","from","that","this","it","be","have","has","had","not","i",
  "you","they","we","he","she","their","its","his","her","my","your","our","which"
]);

export default function IeltsWriting() {

  const navigate = useNavigate();

  const [activeTask, setActiveTask] = useState(0);
  const [responses, setResponses] = useState({ task1: "", task2: "" });
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [writingScore, setWritingScore] = useState(null);
  const [breakdown, setBreakdown] = useState(null); // { taskAchievement, coherence, lexical, grammar }

  const API_URL = getApiBaseUrl();

  useEffect(() => {

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => handleSubmit(), 0);
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const currentTask = IELTS_DATA_WRITING.tasks[activeTask];
  const wordCount = getWordCount(responses[currentTask.id] || "");

  // ---------- CRITERION 1: TASK ACHIEVEMENT / RESPONSE ----------
  // "Did you accurately address the prompt / cover all parts?"
  const scoreTaskAchievement = (text, task) => {
    const words = getWordCount(text);
    const lower = text.toLowerCase();

    // length compliance
    let lengthScore;
    if (words < task.minWords * 0.6) lengthScore = 4;
    else if (words < task.minWords * 0.8) lengthScore = 5;
    else if (words < task.minWords) lengthScore = 5.5;
    else if (words < task.minWords * 1.6) lengthScore = 7;
    else lengthScore = 6.5; // excessively long can hurt focus

    // topic relevance: how many prompt-related keywords actually appear
    const hits = task.keywords.filter(k => lower.includes(k)).length;
    const relevance = hits / task.keywords.length; // 0 - 1

    let relevanceScore;
    if (relevance < 0.2) relevanceScore = 4;
    else if (relevance < 0.4) relevanceScore = 5;
    else if (relevance < 0.6) relevanceScore = 6;
    else if (relevance < 0.8) relevanceScore = 7;
    else relevanceScore = 8;

    const band = Number((((lengthScore + relevanceScore) / 2)).toFixed(1));
    return {
      band,
      note: relevance < 0.4
        ? "Response may not fully address the prompt topic."
        : "Response engages with the prompt topic."
    };
  };

  // ---------- CRITERION 2: COHERENCE & COHESION ----------
  // "Is it organized? Paragraphing, linking words without overuse?"
  const scoreCoherence = (text) => {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const lower = text.toLowerCase();

    const linkersUsed = LINKING_WORDS.filter(w => lower.includes(w));
    const linkerCount = linkersUsed.length;

    let paragraphScore;
    if (paragraphs.length <= 1) paragraphScore = 4;
    else if (paragraphs.length === 2) paragraphScore = 5.5;
    else if (paragraphs.length >= 3 && paragraphs.length <= 5) paragraphScore = 7.5;
    else paragraphScore = 6.5; // too fragmented

    let linkerScore;
    if (linkerCount === 0) linkerScore = 4.5;
    else if (linkerCount <= 2) linkerScore = 6;
    else if (linkerCount <= 5) linkerScore = 7.5;
    else linkerScore = 6; // overuse penalized, matches "without overusing them"

    const band = Number(((paragraphScore + linkerScore) / 2).toFixed(1));
    return {
      band,
      note: linkerCount === 0
        ? "Consider using linking words (however, therefore, furthermore) to connect ideas."
        : "Good use of paragraphing and/or linking words."
    };
  };

  // ---------- CRITERION 3: LEXICAL RESOURCE ----------
  // "Vocabulary range, natural collocations, spelling"
  const scoreLexical = (text) => {
    const words = text.toLowerCase().match(/[a-z']+/g) || [];
    if (words.length === 0) return { band: 4, note: "No content to assess." };

    const uniqueWords = new Set(words.filter(w => !STOPWORDS.has(w)));
    const typeTokenRatio = uniqueWords.size / words.length; // vocabulary diversity

    const avgWordLength =
      words.reduce((sum, w) => sum + w.length, 0) / words.length;

    let diversityScore;
    if (typeTokenRatio < 0.35) diversityScore = 4.5;
    else if (typeTokenRatio < 0.45) diversityScore = 5.5;
    else if (typeTokenRatio < 0.55) diversityScore = 6.5;
    else if (typeTokenRatio < 0.65) diversityScore = 7.5;
    else diversityScore = 8;

    let complexityScore;
    if (avgWordLength < 3.8) complexityScore = 5;
    else if (avgWordLength < 4.3) complexityScore = 6;
    else if (avgWordLength < 4.8) complexityScore = 7;
    else complexityScore = 7.5;

    const band = Number(((diversityScore + complexityScore) / 2).toFixed(1));
    return {
      band,
      note: typeTokenRatio < 0.45
        ? "Try varying vocabulary more — avoid repeating the same words."
        : "Reasonable vocabulary range detected."
    };
  };

  // ---------- CRITERION 4: GRAMMATICAL RANGE & ACCURACY ----------
  // NOTE: True grammar-error detection needs a real grammar checker
  // (e.g. LanguageTool API) or an LLM call. This heuristic only looks
  // at sentence-structure variety as a rough proxy — it does NOT check
  // actual grammatical correctness (tenses, subject-verb agreement, etc).
  const scoreGrammarHeuristic = (text) => {
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    if (sentences.length === 0) return { band: 4, note: "No sentences to assess." };

    const lengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
    const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;

    const variance =
      lengths.reduce((sum, l) => sum + Math.pow(l - avgLen, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    // presence of complex-sentence markers (subordinate clauses)
    const complexMarkers = ["because", "although", "since", "while", "if", "when", "which", "who", "that"];
    const lower = text.toLowerCase();
    const complexHits = complexMarkers.filter(m => lower.includes(` ${m} `)).length;

    let varietyScore;
    if (stdDev < 3) varietyScore = 5; // sentences too uniform in length
    else if (stdDev < 6) varietyScore = 6.5;
    else varietyScore = 7.5;

    let complexityScore;
    if (complexHits === 0) complexityScore = 5;
    else if (complexHits <= 2) complexityScore = 6.5;
    else complexityScore = 7.5;

    const band = Number(((varietyScore + complexityScore) / 2).toFixed(1));
    return {
      band,
      note: "⚠️ Estimated from sentence structure only — not a real grammar check. Integrate LanguageTool or an LLM for actual error detection."
    };
  };

  const scoreEssay = (text, task) => {
    const ta = scoreTaskAchievement(text, task);
    const cc = scoreCoherence(text);
    const lr = scoreLexical(text);
    const gra = scoreGrammarHeuristic(text);

    const overall = Number((((ta.band + cc.band + lr.band + gra.band) / 4)).toFixed(1));

    return { overall, taskAchievement: ta, coherence: cc, lexical: lr, grammar: gra };
  };

  const handleSubmit = async () => {

    if (submitted) return;

    if (activeTask === 0) {
      setActiveTask(1);
      return;
    }

    const words1 = getWordCount(responses.task1);
    const words2 = getWordCount(responses.task2);

    if (words1 < 20 || words2 < 20) {
      alert("Please complete both tasks before submitting the test.");
      return;
    }

    const result1 = scoreEssay(responses.task1, IELTS_DATA_WRITING.tasks[0]);
    const result2 = scoreEssay(responses.task2, IELTS_DATA_WRITING.tasks[1]);

    const combined = {
      taskAchievement: Number(((result1.taskAchievement.band + result2.taskAchievement.band) / 2).toFixed(1)),
      coherence: Number(((result1.coherence.band + result2.coherence.band) / 2).toFixed(1)),
      lexical: Number(((result1.lexical.band + result2.lexical.band) / 2).toFixed(1)),
      grammar: Number(((result1.grammar.band + result2.grammar.band) / 2).toFixed(1))
    };

    const finalScore = Number(
      ((combined.taskAchievement + combined.coherence + combined.lexical + combined.grammar) / 4).toFixed(1)
    );

    setWritingScore(finalScore);
    setBreakdown(combined);
    setSubmitted(true);

    const token = localStorage.getItem("token");

    if (token) {

      try {

        await fetch(`${API_URL}/tests/save`, {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({

            testName: "IELTS Writing",

            result: {
              score: finalScore,
              task1Band: result1.overall,
              task2Band: result2.overall,
              breakdown: combined,
              essayTask1: responses.task1,
              essayTask2: responses.task2,
              wordCountTask1: words1,
              wordCountTask2: words2
            }

          })

        });

      } catch (err) {
        console.error("Save failed", err);
      }

    }

  };

  return (

    <div className="ielts-container">

      {submitted && (

        <div
          style={{
            maxWidth: "650px",
            margin: "0 auto 30px auto",
            background: "#ffffff",
            border: "1px solid #bbf7d0",
            borderRadius: "16px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >

          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>

          <h2 style={{ fontSize: "36px", color: "#16a34a", marginBottom: "10px", fontWeight: "bold" }}>
            Band {writingScore}
          </h2>

          <p style={{ color: "#374151", marginBottom: "20px" }}>
            Your writing test has been successfully saved.
          </p>

          {breakdown && (
            <div style={{ textAlign: "left", margin: "0 auto 20px auto", maxWidth: "450px" }}>
              <BreakdownRow label="Task Achievement" value={breakdown.taskAchievement} />
              <BreakdownRow label="Coherence & Cohesion" value={breakdown.coherence} />
              <BreakdownRow label="Lexical Resource" value={breakdown.lexical} />
              <BreakdownRow label="Grammatical Range & Accuracy" value={breakdown.grammar} />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <button
              onClick={() => navigate("/profile")}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Go to Profile
            </button>
          </div>

        </div>

      )}

      <style jsx>{`
.ielts-container{min-height:100vh;background:#ffffff;padding:2rem;padding-top:180px;color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
.header-container{position:relative;display:flex;align-items:center;justify-content:center;max-width:1500px;margin:0 auto 40px auto;border-bottom:1px solid #d1fae5;padding-bottom:15px;}
.test-title{position:absolute;left:50%;transform:translateX(-50%);font-size:2rem;font-weight:800;color:#111827;}
.tabs{position:absolute;left:0;display:flex;gap:12px;}
.tab-btn{background:#ffffff;border:1px solid #bbf7d0;color:#15803d;padding:0.6rem 1.4rem;border-radius:10px;cursor:pointer;font-weight:600;transition:0.3s;}
.tab-btn:hover{background:#dcfce7;}
.tab-btn.active{background:#16a34a;border-color:#16a34a;color:white;}
.timer-box{position:absolute;right:0;display:flex;align-items:center;gap:8px;font-family:monospace;font-size:1.3rem;font-weight:800;padding:8px 18px;border-radius:12px;border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;}
.timer-warning{background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;}
.main-container{display:grid;grid-template-columns:${currentTask.image ? "1fr 1fr" : "1fr"};gap:2.5rem;height:calc(100vh - 180px);max-width:1500px;margin:0 auto;}
.image-container{background:#ffffff;border:1px solid #bbf7d0;border-radius:20px;padding:2rem;box-shadow:0 4px 15px rgba(0,0,0,0.05);display:flex;flex-direction:column;}
.image-content{flex:1;display:flex;align-items:center;justify-content:center;background:#f0fdf4;border-radius:12px;padding:1.2rem;}
.image-content img{max-width:100%;max-height:100%;object-fit:contain;}
.prompt-container{background:#ffffff;border:1px solid #bbf7d0;border-radius:20px;padding:2rem;box-shadow:0 4px 15px rgba(0,0,0,0.05);}
.response-container{background:#ffffff;border:1px solid #bbf7d0;border-radius:20px;padding:2rem;flex:1;display:flex;flex-direction:column;box-shadow:0 4px 15px rgba(0,0,0,0.05);}
.editor-area{background:#f9fafb;border:1px solid #d1d5db;border-radius:12px;color:#111827;padding:1.4rem;width:100%;flex:1;resize:none;font-family:'Courier New',monospace;font-size:1.05rem;line-height:1.6;outline:none;transition:0.3s;}
.editor-area:focus{border-color:#16a34a;box-shadow:0 0 0 3px rgba(34,197,94,0.2);}
.editor-area::placeholder{color:#6b7280;}
.primary-btn{background:#16a34a;color:white;font-weight:700;border:none;border-radius:10px;padding:0.85rem 2rem;cursor:pointer;display:flex;align-items:center;gap:.6rem;margin-top:20px;transition:0.3s;}
.primary-btn:hover{background:#15803d;}
.primary-btn:disabled{opacity:0.6;cursor:not-allowed;}
@media (max-width:900px){.main-container{grid-template-columns:1fr;height:auto;}.editor-area{min-height:250px;}}
@media (max-width:600px){.ielts-container{padding:1rem;padding-top:140px;}.header-container{flex-direction:column;align-items:center;gap:10px;position:static;}.test-title{position:static;transform:none;font-size:1.4rem;text-align:center;}.tabs{position:static;justify-content:center;}.timer-box{position:static;font-size:1rem;padding:6px 10px;}.tab-btn{padding:0.4rem 0.9rem;font-size:0.9rem;}}
`}</style>

      {!submitted && (

        <div className="header-container">
          <div className="tabs">
            <button onClick={() => setActiveTask(0)} className={`tab-btn ${activeTask === 0 ? "active" : ""}`}>
              Task 1
            </button>
            <button
              disabled={getWordCount(responses.task1) < 20}
              style={{
                opacity: getWordCount(responses.task1) < 20 ? 0.5 : 1,
                cursor: getWordCount(responses.task1) < 20 ? "not-allowed" : "pointer"
              }}
              onClick={() => {
                if (getWordCount(responses.task1) < 20) {
                  alert("Please complete Task 1 before moving to Task 2.");
                  return;
                }
                setActiveTask(1);
              }}
              className={`tab-btn ${activeTask === 1 ? "active" : ""}`}
            >
              Task 2
            </button>
          </div>

          <h1 className="test-title">IELTS Academic Writing</h1>

          <div className={`timer-box ${timeLeft < 300 ? "timer-warning" : ""}`}>
            <FiClock />
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

      )}

      {!submitted && (

        <div className="main-container">

          {currentTask.image && (
            <div className="image-container">
              <h3 className="text-xl font-bold text-green-700 mb-4">Visual Information</h3>
              <div className="image-content">
                <img src={currentTask.image} alt="Task Visual" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">

            <div className="prompt-container">
              <h2 className="text-2xl font-bold mb-3">{currentTask.title}</h2>
              <div className="text-gray-700 whitespace-pre-line">{currentTask.prompt}</div>
            </div>

            <div className="response-container">

              <span style={{ color: wordCount >= currentTask.minWords ? "#16a34a" : "#6b7280" }}>
                Words: {wordCount} / {currentTask.minWords}
              </span>

              {wordCount < currentTask.minWords && (
                <span style={{ color: "#dc2626", fontSize: "13px" }}>
                  Recommended minimum: {currentTask.minWords} words
                </span>
              )}

              <textarea
                className="editor-area"
                placeholder={`Type your ${activeTask === 0 ? "report" : "essay"} here...`}
                value={responses[currentTask.id] || ""}
                onChange={(e) =>
                  setResponses({ ...responses, [currentTask.id]: e.target.value })
                }
              />

              <button
                onClick={handleSubmit}
                className="primary-btn"
                disabled={wordCount < 5 || submitted}
              >
                {activeTask === 0 ? "Next Task" : "Submit Writing Test"}
                <FiSave />
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

function BreakdownRow({ label, value }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid #f3f4f6"
    }}>
      <span style={{ color: "#374151", fontWeight: 500 }}>{label}</span>
      <span style={{ color: "#16a34a", fontWeight: 700 }}>{value}</span>
    </div>
  );
}