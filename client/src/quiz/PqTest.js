import React, { useState, useEffect } from "react";
import getApiBaseUrl from "../utils/api";
import { useNavigate } from "react-router-dom";
import facialQuiet from "../assets/facial_quite.PNG";
import facialSurprise from "../assets/facial_surprise.png";
import facialDisgust from "../assets/facial_disgust.png";
import facialConfusion from "../assets/facial_confusion.png";
const TEST_NAME = "Personality Quotient Test (PQ)";

const QUESTIONS = [
  {
    question: "1. At a professional conference, where is the easiest place to start conversations?",
    options: [
      "Standing in a quiet corner",
      "Near the registration desk",
      "Where people are forming small open groups",
      "Sitting alone checking your phone"
    ],
    correct: "Where people are forming small open groups"
  },
  {
    question: "2. Which statement about friendships is most supported by research?",
    options: [
      "People are most attracted to those completely opposite to them",
      "Shared interests increase long-term bonding",
      "Conflict strengthens every relationship",
      "First impressions never matter"
    ],
    correct: "Shared interests increase long-term bonding"
  },
  {
    question: "3. Roughly how much of personality differences are influenced by genetics?",
    options: [
      "Less than 10%",
      "Around 30–50%",
      "Around 80–90%",
      "Entirely determined by environment"
    ],
    correct: "Around 30–50%"
  },
  {
    question: "4. Which factor most increases trust during a conversation?",
    options: [
      "Constantly talking about your achievements",
      "Maintaining balanced eye contact",
      "Interrupting to show excitement",
      "Avoiding emotional topics"
    ],
    correct: "Maintaining balanced eye contact"
  },
  {
    question: "5. When meeting someone new, which trait is easiest to notice immediately?",
    options: [
      "Their stress levels",
      "Their long-term goals",
      "Their energy level (introvert vs extrovert cues)",
      "Their childhood experiences"
    ],
    correct: "Their energy level (introvert vs extrovert cues)"
  },
  {
  question: "6. The best way to show someone you care about them is to:",
  options: [
    "Tell them all the reasons they are awesome",
    "Get them a gift",
    "Do their to-do list for them",
    "All of the above",
    "It’s different for each person"
  ],
  correct: "It’s different for each person"
},
{
  question: "7. Which phrase corresponds best with this facial expression?",
  options: [
    "He is an introvert",
    "He is an extrovert",
    "He is laid-back",
    "He is quiet"
  ],
  correct: "He is quiet"
},
{
  question: "8. Our brains are most active when we are chatting about:",
  options: [
    "Our crush",
    "The latest juicy gossip",
    "Ourselves",
    "The latest thriller"
  ],
  correct: "Ourselves"
},
{
  question: "9. What does this face mean?",
  options: [
    "Excitement",
    "Giddiness",
    "Interest",
    "Surprise"
  ],
  correct: "Surprise"
},
{
  question: "10. In the average conversation, people typically hold eye contact what percent of the time?",
  options: [
    "31 percent",
    "51 percent",
    "61 percent",
    "91 percent"
  ],
  correct: "51 percent"
},
{
  question: "11. What is the best way to make someone agree with you?",
  options: [
    "Tell them a story",
    "Pay them a compliment",
    "Make them laugh",
    "Say something surprising"
  ],
  correct: "Tell them a story"
},
{
  question: "12. What does this face mean?",
  options: [
    "Embarrassment",
    "Confusion",
    "Irritation",
    "Disgust"
  ],
  correct: "Disgust"
},
{
  question: "13. Which of these habits tends to annoy people the most?",
  options: [
    "People who are too talkative",
    "People who are too quiet",
    "People who are fake",
    "People who show off"
  ],
  correct: "People who are fake"
},
{
  question: "14. People will pay more for something that:",
  options: [
    "Their friends have also bought",
    "A doctor recommends",
    "Matches their personality",
    "They customized"
  ],
  correct: "Matches their personality"
},
{
  question: "15. When you first meet someone, you are LEAST likely to be able to accurately guess:",
  options: [
    "How extroverted they are",
    "How much they worry",
    "If they are open to new ideas",
    "Their IQ",
    "How organized they are"
  ],
  correct: "Their IQ"
},
{
  question: "16. What behavior might show that your new colleague is very anxious?",
  options: [
    "Put up inspirational posters",
    "Show up early to every meeting on the first day",
    "Introduce themselves to you immediately",
    "Wait for you to introduce yourself"
  ],
  correct: "Show up early to every meeting on the first day"
},
{
  question: "17. What does this face mean?",
  options: [
    "Confusion",          // ✅ Correct
    "Uncertainty",
    "Doubt",
    "Concern"
  ],
  correct: "Confusion"
},
{
  question: "18. Making someone feel _____ is the best way to improve their mood.",
  options: [
    "Flattered",
    "Attractive",
    "Valued",
    "Powerful"
  ],
  correct: "Valued"
},
{
  question: "19. Which saying about people is most true?",
  options: [
    "Opposites attract",
    "Birds of a feather flock together",
    "One bad apple spoils the bunch",
    "Never bite the hand that feeds you"
  ],
  correct: "Birds of a feather flock together"
},
{
  question: "20. Where is the best place to stand at a networking event?",
  options: [
    "Near the entrance to the event",
    "At the food table so you can sit with people",
    "Where people exit the bar",
    "Next to someone you know"
  ],
  correct: "Near the entrance to the event"
}
];

export default function PqTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [resultData, setResultData] = useState(null);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const API_URL = getApiBaseUrl();
  const navigate = useNavigate();

  const handleChange = (value) => {
    setAnswers({ ...answers, [currentIndex]: value });
  };

const nextQuestion = () => {
  if (!answers[currentIndex]) {
    alert("Please select an option");
    return;
  }

  if (currentIndex < QUESTIONS.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

const calculateScore = async () => {
  if (!answers[currentIndex]) {
    alert("Please select an option before submitting");
    return;
  }

  let total = 0;

  QUESTIONS.forEach((q, index) => {
    if (answers[index] === q.correct) {
      total += 10;
    }
  });

  const level =
    total >= 151
      ? "Exceptional People Reading Skills"
      : total >= 101
      ? "Strong Interpersonal Intelligence"
      : total >= 51
      ? "Average Interpersonal Awareness"
      : "Developing Social Perception";

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/tests/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        testName: TEST_NAME,
        result: {
          score: total,
          level: level,
        },
      }),
    });

    const savedData = await response.json();
    setResultData(savedData.result);

    window.scrollTo({ top: 0, behavior: "smooth" });

  } catch (error) {
    console.error("Error saving PQ result:", error);
  }
};

  const resetTest = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResultData(null);
  };

  /* ================= RESULT SCREEN ================= */

  if (resultData) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>{TEST_NAME}</h1>

        <div style={styles.resultCard}>
          <h2>Your Personality Quotient Result</h2>

          <div style={styles.scoreText}>
            Score: {resultData.score} / {QUESTIONS.length * 10}
          </div>

          <div style={styles.levelText}>
            {resultData.level}
          </div>

          <div style={styles.savedMessage}>
            ✅ Result saved to your profile!
          </div>

          <div style={styles.buttonGroup}>
           

            <button
              style={styles.profileButton}
              onClick={() => navigate("/profile")}
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIndex];

  /* ================= QUESTION SCREEN ================= */

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{TEST_NAME}</h1>
      <p style={styles.description}>
  Personality Quotient (PQ) Test measures your ability to read people, understand social cues, and interpret emotional expressions accurately.
  Each correct answer carries 10 marks, and incorrect answers receive 0 marks.
</p>

      <div style={styles.questionCard}>
        <p>
          Question {currentIndex + 1} of {QUESTIONS.length}
        </p>

        <h3>{currentQuestion.question}</h3>
          {currentIndex === 6 && (   // index 6 = Question 7
  <div style={{ textAlign: "center", margin: "20px 0" }}>
    <img
      src={facialQuiet}
      alt="Facial expression"
      style={{
        width: "250px",
        borderRadius: "10px",
        border: "1px solid #19fd91"
      }}
    />
  </div>
)}
{currentIndex === 8 && (   // index 8 = Question 9
  <div style={{ textAlign: "center", margin: "20px 0" }}>
    <img
      src={facialSurprise}
      alt="Facial expression surprise"
      style={{
        width: "250px",
        borderRadius: "10px",
        border: "1px solid #19fd91"
      }}
    />
  </div>
)}
{currentIndex === 11 && (   // index 11 = Question 12
  <div style={{ textAlign: "center", margin: "20px 0" }}>
    <img
      src={facialDisgust}
      alt="Facial expression disgust"
      style={{
        width: "250px",
        borderRadius: "10px",
        border: "1px solid #19fd91"
      }}
    />
  </div>
)}
   {currentIndex === 16 && (   // index 16 = Question 17
  <div style={{ textAlign: "center", margin: "20px 0" }}>
    <img
      src={facialConfusion}
      alt="Facial expression confusion"
      style={{
        width: "250px",
        borderRadius: "10px",
        border: "1px solid #19fd91"
      }}
    />
  </div>
)}
        {currentQuestion.options.map((option, i) => (
          <label key={i} style={styles.optionLabel}>
            <input
              type="radio"
              name="option"
              value={option}
              checked={answers[currentIndex] === option}
              onChange={() => handleChange(option)}
            />
            {option}
          </label>
        ))}

        <div style={styles.navigation}>
          <button
            style={styles.navButton}
            onClick={prevQuestion}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

         {currentIndex === QUESTIONS.length - 1 ? (
  <button
    style={styles.button}
    onClick={calculateScore}
    disabled={!answers[currentIndex]}   // ✅ ADD THIS
  >
    Submit
  </button>
) : (
            <button style={styles.navButton} onClick={nextQuestion}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
    description: {
  fontSize: "14px",
  color: "#b4bebd",
  marginBottom: "20px",
  lineHeight: "1.6",
  maxWidth: "600px",
  marginLeft: "auto",
  marginRight: "auto"
},
  container: {
    maxWidth: "700px",
    margin: "120px auto 60px",
    padding: "0 20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "32px",
    color: "#19fd91",
    marginBottom: "20px",
  },
  questionCard: {
    background: "#111",
    border: "1px solid #19fd91",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "left",
  },
  optionLabel: {
    display: "block",
    marginTop: "10px",
    cursor: "pointer",
    color: "#ccc"
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px"
  },
  navButton: {
    padding: "10px 20px",
    background: "#222",
    border: "1px solid #19fd91",
    color: "#19fd91",
    borderRadius: "8px",
    cursor: "pointer"
  },
  button: {
    padding: "12px 25px",
    background: "#19fd91",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px"
  },
  profileButton: {
    padding: "12px 25px",
    background: "#222",
    border: "1px solid #19fd91",
    color: "#19fd91",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px"
  },
  resultCard: {
    background: "#111",
    border: "1px solid #19fd91",
    borderRadius: "12px",
    padding: "30px",
  },
  scoreText: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#19fd91",
    marginTop: "10px"
  },
  levelText: {
    fontSize: "1.1rem",
    marginTop: "10px"
  },
  savedMessage: {
    marginTop: "15px",
    color: "#19fd91"
  }
};