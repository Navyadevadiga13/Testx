// export default ToeflWriting;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

const writingTask = {
  id: "essay",
  title: "Essay Writing",
  time: 1800, // 30 minutes
  minWords: 250,
  prompt: `Do you agree or disagree with the following statement?

Some people prefer to live in a small town, while others prefer to live in a large city.

Which do you prefer?

Use specific reasons and examples to support your answer.`,
};

function ToeflWriting() {
  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(writingTask.time);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const wordCount = answer
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const saveTestResult = async (result) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testName: "TOEFL Writing",
          result,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

const calculateScore = () => {
  if (wordCount < writingTask.minWords) {
    const confirmSubmit = window.confirm(
      `Your essay contains only ${wordCount} words.\n\nThe recommended minimum is ${writingTask.minWords} words.\n\nDo you still want to submit?`
    );

    if (!confirmSubmit) return;
  }

  const completed = wordCount >= writingTask.minWords ? 1 : 0;

  const total = 1;
  const percentage = completed ? 100 : 0;

  let toeflScore = 15;

  if (completed) {
    toeflScore = 30;
  }

  const resultPayload = {
    rawScore: completed,
    total,
    percentage,
    toeflScore,
    wordCount,
  };

  saveTestResult(resultPayload);

  navigate("/quiz/toefl/result", {
    state: {
      correctCount: completed,
      total,
      toeflScore,
      wordCount,
      testType: "Writing",
    },
  });
};

    return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "100px 20px",
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111111",
      }}
    >
      {/* Title */}
      <h1
        style={{
          textAlign: "center",
          color: "#1a5c3a",
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "2rem",
        }}
      >
        TOEFL Writing Test
      </h1>

      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f4faf7",
          border: "1px solid #c8e6d4",
          borderRadius: "10px",
          padding: "12px 18px",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ fontWeight: "600" }}>
          Essay Writing Task
        </div>

        <div
          style={{
            color: "#1a5c3a",
            fontWeight: "700",
          }}
        >
          ⏱ Time Remaining: {formatTime(timeLeft)}
        </div>

        <div style={{ fontWeight: "600" }}>
          Words: {wordCount} / {writingTask.minWords}
        </div>
      </div>

      {/* Essay Prompt */}
      <div
        style={{
          background: "#f9fefb",
          border: "1px solid #c8e6d4",
          borderRadius: "10px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            color: "#1a5c3a",
            marginBottom: "1rem",
          }}
        >
          {writingTask.title}
        </h2>

        <p
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.8",
            color: "#222",
          }}
        >
          {writingTask.prompt}
        </p>
      </div>

      {/* Word Count */}
      <div
        style={{
          marginBottom: "10px",
          fontSize: "0.9rem",
          color: "#555",
        }}
      >
        Words: {wordCount} / {writingTask.minWords}

        {wordCount < writingTask.minWords && (
          <span
            style={{
              color: "#d32f2f",
              marginLeft: "10px",
            }}
          >
            Recommended minimum: {writingTask.minWords} words
          </span>
        )}
      </div>

      {/* Essay Box */}
      <textarea
        rows="18"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your essay here..."
        style={{
          width: "100%",
          padding: "1rem",
          border: "1px solid #b2d8c2",
          borderRadius: "10px",
          fontSize: "1rem",
          lineHeight: "1.7",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          background: "#ffffff",
          color: "#111111",
        }}
      />

      {/* Submit Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={calculateScore}
          style={{
            background: "#2e7d52",
            color: "#ffffff",
            border: "none",
            padding: "12px 30px",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1rem",
          }}
        >
          Finish & Submit ✓
        </button>
      </div>
    </div>
  );
}

export default ToeflWriting;