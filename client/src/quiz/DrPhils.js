import React, { useState, useEffect } from "react";
import getApiBaseUrl from "../utils/api";

const TEST_NAME = "Dr Phil's Personality Test";

const TEST_DESCRIPTION =
  "This fun personality test is designed to give insight into how others may perceive you. Answer all questions honestly and choose the option that best represents your natural behavior. At the end, your total score will reveal how people typically see your personality traits.";

/* ---------------- QUESTIONS ---------------- */

const QUESTIONS = [
  {
    question: "1. When do you feel your best?",
    options: [
      { text: "In the morning", score: 2 },
      { text: "During the afternoon and early evening", score: 4 },
      { text: "Late at night", score: 6 },
    ],
  },
  {
    question: "2. Do you usually walk...",
    options: [
      { text: "Fairly fast, with long steps", score: 6 },
      { text: "Fairly fast, with short steps", score: 4 },
      { text: "Less fast, head up", score: 7 },
      { text: "Less fast, head down", score: 2 },
      { text: "Very slowly", score: 1 },
    ],
  },
  {
    question: "3. When talking to people you...",
    options: [
      { text: "Stand with arms folded", score: 4 },
      { text: "Have your hands clasped", score: 2 },
      { text: "Hands on hips", score: 5 },
      { text: "Touch or push the person", score: 7 },
      { text: "Play with hair or chin", score: 6 },
    ],
  },
  {
    question: "4. When relaxing you sit...",
    options: [
      { text: "Knees bent and legs neatly side by side", score: 4 },
      { text: "Legs crossed", score: 6 },
      { text: "Legs stretched out or straight", score: 2 },
      { text: "One leg curled under you", score: 1 },
    ],
  },
  {
    question: "5. When something really amuses you...",
    options: [
      { text: "A big appreciative laugh", score: 6 },
      { text: "A laugh but not loud", score: 4 },
      { text: "A quiet chuckle", score: 3 },
      { text: "A big smile", score: 5 },
      { text: "A slow smile", score: 2 },
    ],
  },
  {
    question: "6. When you go to a party or social gathering, do you",
    options: [
      { text: "Make a loud entrance so everyone notices you?", score: 6 },
      { text: "Make a quieter entrance, looking around quickly for someone you know?", score: 4 },
      { text: "Make the quietest possible entrance and try to stay unnoticed?", score: 2 },
    ],
  },
  {
    question: "7. When working hard and interrupted...",
    options: [
      { text: "Welcome the break", score: 6 },
      { text: "Feel irritated", score: 2 },
      { text: "Vary between both", score: 4 },
    ],
  },
  {
    question: "8. Which color do you like most?",
    options: [
      { text: "Red or orange", score: 6 },
      { text: "Black", score: 7 },
      { text: "Yellow or light blue", score: 5 },
      { text: "Green", score: 4 },
      { text: "Dark blue or purple", score: 3 },
      { text: "White", score: 2 },
      { text: "Brown, gray or violet", score: 1 },
    ],
  },
  {
    question: "9. When in bed at night, in those last few moments before going to sleep, do you lie",
    options: [
      { text: "Stretched out on your back", score: 7 },
      { text: "Face down on stomach", score: 6 },
      { text: "On your side, slightly curled", score: 4 },
      { text: "Head on one arm", score: 2 },
      { text: "Head under covers", score: 1 },
    ],
  },
  {
    question: "10. Do you often dream that you are...",
    options: [
      { text: "Falling", score: 4 },
      { text: "Fighting or struggling", score: 2 },
      { text: "Searching for someone", score: 3 },
      { text: "Flying or floating", score: 5 },
      { text: "Usually dreamless sleep", score: 6 },
      { text: "Pleasant dreams", score: 1 },
    ],
  },
];

/* ---------------- COMPONENT ---------------- */

function DrPhils() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [result, setResult] = useState(null);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const letters = ["A", "B", "C", "D", "E", "F", "G"];
  const API_URL = getApiBaseUrl();

  const handleSelect = (qIndex, score) => {
    const updated = [...answers];
    updated[qIndex] = score;
    setAnswers(updated);
  };

const getInterpretation = (score) => {
  if (score > 60)
    return `Over 60 points:
People see you as very strong and confident.
You like being in control and taking charge.
Others may admire you, but sometimes they may feel careful around you or unsure about trusting you completely.`;

  if (score >= 51 && score <= 60)
    return `51 to 60 points:
People see you as bold, energetic, and adventurous.
You enjoy excitement and new experiences.
You are a natural leader, but sometimes you may act quickly without thinking deeply.`;

  if (score >= 41 && score <= 50)
    return `41 to 50 points:
People see you as friendly, lively, and interesting.
You attract attention easily but stay balanced.
You are kind, supportive, and easy to be around.`;

  if (score >= 31 && score <= 40)
    return `31 to 40 points:
People see you as sensible and practical.
You think before you act.
You are loyal and value trust in friendships.
It may take time for you to fully trust others`;

  if (score >= 21 && score <= 30)
    return `21 to 30 points:
People see you as careful and cautious.
You do not act quickly or impulsively.
You like to think deeply before making decisions.
You prefer safety over risk.`;

  return `Under 21 points:
People see you as quiet and shy.
You may worry more than necessary.
You may depend on others to make decisions.
You don’t easily open up, but those who know you understand you better.`;
};
  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions.");
      return;
    }

    const total = answers.reduce((a, b) => a + b, 0);

    const scoredResult = {
      score: total,
      interpretation: getInterpretation(total),
      description: `Your total score is ${total}.`
    };

    setResult(scoredResult);
     window.scrollTo(0, 0);

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: TEST_NAME,
          result: scoredResult
        })
      });

      console.log("✅ Dr Phil result saved!");
    } catch (error) {
      console.error("❌ Error saving Dr Phil result:", error);
    }
  };

  const handleRetake = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setResult(null);
  };

  /* ---------------- RESULT SCREEN ---------------- */
/* ---------------- RESULT SCREEN ---------------- */
if (result) {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{TEST_NAME}</h1>

      <div style={styles.resultCard}>
        <h2>Your Total Score</h2>
        <h1 style={styles.score}>{result.score}</h1>

        {/* FULL INTERPRETATION DISPLAY */}
        <div
          style={{
            marginTop: "20px",
            fontSize: "1rem",
            lineHeight: "1.8",
            whiteSpace: "pre-wrap",   // 🔥 important
            textAlign: "left",
            color: "#ddd"
          }}
        >
          {result.interpretation}
        </div>

        <div style={{ color: "#19fd91", marginTop: "20px" }}>
          ✅ Full result is saved in your profile!
        </div>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <button
            style={{ ...styles.button, width: "220px" }}
            onClick={() => (window.location.href = "/profile")}
          >
            View Full Result
          </button>

         
        </div>
      </div>
    </div>
  );
}

  /* ---------------- QUESTION SCREEN ---------------- */

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{TEST_NAME}</h1>
      <p style={styles.description}>{TEST_DESCRIPTION}</p>

      {QUESTIONS.map((q, qIndex) => (
        <div key={qIndex} style={styles.card}>
          <h3>{q.question}</h3>

          {q.options.map((opt, optIndex) => (
            <div
              key={optIndex}
              style={{
                ...styles.optionBox,
                background: answers[qIndex] === opt.score ? "#19fd91" : "#1c1c1c",
                color: answers[qIndex] === opt.score ? "#000" : "#fff",
              }}
              onClick={() => handleSelect(qIndex, opt.score)}
            >
              <strong>{letters[optIndex]}.</strong> {opt.text}
            </div>
          ))}
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button style={styles.button} onClick={handleSubmit}>
          Submit Test
        </button>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    maxWidth: "850px",
    margin: "140px auto 60px",
    padding: "0 20px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#19fd91",
    fontSize: "32px",
  },
  description: {
    textAlign: "center",
    color: "#ccc",
    marginBottom: "30px",
  },
  card: {
    background: "#111",
    border: "1px solid #19fd91",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    color: "white",
  },
  optionBox: {
    padding: "10px 15px",
    borderRadius: "8px",
    marginTop: "10px",
    cursor: "pointer",
    transition: "0.2s",
  },
  button: {
    padding: "12px 25px",
    background: "#19fd91",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  resultCard: {
    background: "#111",
    border: "1px solid #19fd91",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    color: "white",
  },
  score: {
    fontSize: "50px",
    color: "#19fd91",
  },
};

export default DrPhils;