import React, { useState, useEffect, useRef } from "react";
import getApiBaseUrl from "../utils/api";
import { FaClock } from "react-icons/fa";

function Gre_analytical() {

  const topRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const API_URL = getApiBaseUrl();
  const totalTime = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [essay, setEssay] = useState("");
  const [score, setScore] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (showResult) window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [showResult]);

  const calculateScore = (essayText) => {
    const words = essayText.trim().split(/\s+/).length;
    const sentences = essayText.split(/[.!?]/).length;
    const paragraphs = essayText.split(/\n+/).length;
    let score = 0;
    if (words < 150) score = 1;
    else if (words < 200) score = 2.5;
    else if (words < 250) score = 3.5;
    else if (words <= 320) score = 4;
    else if (words <= 400) score = 4.5;
    else if (words <= 450) score = 4;
    else if (words <= 500) score = 3.5;
    else score = 3;
    if (sentences > 12) score += 0.25;
    if (paragraphs >= 3) score += 0.25;
    if (score > 6) score = 6;
    return Number(score.toFixed(1));
  };

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); finishEssay(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult]);

  const finishEssay = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const calculatedScore = calculateScore(essay);
    setScore(calculatedScore);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          testName: "GRE Analytical Writing",
          result: { wordCount, essay, score: calculatedScore }
        })
      });
    } catch (err) { console.error("Error saving essay:", err); }
    setShowResult(true);
  };

  /* ── RESULT SCREEN ─────────────────────────────────────────── */
  if (showResult) {
    return (
      <div style={{
        minHeight: "100vh", background: "#ffffff",
        paddingTop: "90px", paddingBottom: "40px",
        paddingLeft: "20px", paddingRight: "20px",
        display: "flex", justifyContent: "center"
      }}>
        <div style={{ width: "100%", maxWidth: "800px", textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", color: "#166534", fontWeight: "900", marginBottom: "4px" }}>
            GRE Analytical
          </h1>
          <h2 style={{ fontSize: "16px", color: "#4b5563", marginBottom: "24px", fontWeight: "600" }}>
            Writing Test
          </h2>
          <div style={{
            background: "#ffffff", border: "1px solid #d1d5db",
            borderRadius: "18px", padding: "35px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ color: "#111827", fontSize: "24px", fontWeight: "800" }}>
              Your Essay Submitted
            </h2>
            <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#166534", marginTop: "18px" }}>
              Word Count: {wordCount}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#166534", marginTop: "14px" }}>
              GRE Score: {score} / 6
            </div>
            <div style={{ marginTop: "14px", color: "#111827", fontWeight: "500" }}>
              ✅ Complete result stored in profile
            </div>
            <button
              style={{
                padding: "12px 28px", background: "#166534", color: "#ffffff",
                border: "none", borderRadius: "10px", cursor: "pointer",
                fontWeight: "700", fontSize: "15px", marginTop: "24px"
              }}
              onClick={() => window.location.href = "/profile"}
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── TEST SCREEN ───────────────────────────────────────────── */
  return (
    <div ref={topRef} style={{
      minHeight: "100vh", background: "#ffffff",
      display: "flex", justifyContent: "center",
      paddingTop: "80px",   /* ✅ was 140px — just clears the navbar */
      paddingBottom: "40px",
      paddingLeft: "15px", paddingRight: "15px"
    }}>
      <div style={{ width: "100%", maxWidth: "900px", color: "#111827" }}>

        {/* HEADING — tighter & smaller */}
        <h1 style={{
          textAlign: "center", color: "#166534",
          fontSize: "26px",   /* ✅ was 42px */
          fontWeight: "900", marginBottom: "2px"
        }}>
          GRE Analytical
        </h1>
        <h2 style={{
          textAlign: "center", color: "#4b5563",
          fontSize: "15px",   /* ✅ was 24px */
          fontWeight: "600", marginBottom: "14px"
        }}>
          Writing — Issue Task
        </h2>

        {/* TIMER + WORD COUNT ROW */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "10px"
        }}>
          <p style={{ color: "#111827", fontSize: "16px", fontWeight: "700", margin: 0 }}>
            <FaClock style={{ verticalAlign: "middle", marginRight: "6px" }} />
            {minutes}:{seconds < 10 ? "0" : ""}{seconds}
          </p>
          <span style={{ fontWeight: "700", color: "#166534", fontSize: "15px" }}>
            Words: {wordCount}
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div style={{
          height: "8px", background: "#e5e7eb",
          borderRadius: "999px", marginBottom: "20px", overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`, background: "#166534",
            height: "100%", transition: "0.3s"
          }} />
        </div>

        {/* MAIN CARD */}
        <div style={{
          background: "#ffffff", border: "1px solid #d1d5db",
          borderRadius: "18px", padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
        }}>

          <h3 style={{ color: "#166534", fontSize: "18px", fontWeight: "800" }}>
            Directions
          </h3>
          <p style={{ lineHeight: "1.8", marginTop: "10px", color: "#111827", fontSize: "15px" }}>
            Write an essay explaining whether you agree or disagree with the statement below.
            Support your opinion with reasons and examples.
          </p>
          <p style={{ marginTop: "8px", color: "#111827", fontSize: "14px" }}>
            Recommended length: <b>250–400 words</b>.
          </p>

          <h3 style={{ marginTop: "24px", color: "#166534", fontSize: "18px", fontWeight: "800" }}>
            Issue Topic
          </h3>
          <blockquote style={{
            fontStyle: "italic", fontSize: "16px", marginTop: "12px",
            color: "#111827", lineHeight: "1.8", background: "#f9fafb",
            padding: "18px", borderLeft: "5px solid #166534", borderRadius: "12px"
          }}>
            "Societies that prioritize economic growth above all other goals
            inevitably weaken their cultural values and social well-being."
          </blockquote>

          <h3 style={{ marginTop: "24px", color: "#166534", fontSize: "18px", fontWeight: "800" }}>
            Your Response
          </h3>
          <textarea
            style={{
              width: "100%", height: "260px", marginTop: "12px",
              padding: "16px", fontSize: "15px", borderRadius: "12px",
              border: "1px solid #d1d5db", background: "#ffffff",
              color: "#111827", resize: "none", outline: "none",
              lineHeight: "1.8", boxSizing: "border-box"
            }}
            placeholder="Start writing your essay here..."
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
          />

          {wordCount > 400 && (
            <p style={{ color: "#dc2626", marginTop: "8px", fontWeight: "600", fontSize: "14px" }}>
              Essay exceeds the GRE recommended limit of 400 words.
            </p>
          )}
          {wordCount > 0 && wordCount < 150 && (
            <p style={{ color: "#dc2626", marginTop: "8px", fontWeight: "600", fontSize: "14px" }}>
              Essay is too short. Minimum 150 words required.
            </p>
          )}

          <div style={{ textAlign: "center" }}>
            <button
              onClick={finishEssay}
              disabled={wordCount < 150 || wordCount > 400 || isSubmitted}
              style={{
                background: wordCount >= 150 && wordCount <= 400 ? "#166534" : "#9ca3af",
                color: "#ffffff", border: "none", padding: "13px 36px",
                borderRadius: "10px", fontWeight: "700",
                cursor: wordCount >= 150 && wordCount <= 400 ? "pointer" : "not-allowed",
                marginTop: "22px", fontSize: "15px", transition: "0.3s"
              }}
            >
              Submit Essay
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
export default Gre_analytical;