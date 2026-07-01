import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import eqQuestions from "../data/eqQuestions";
import getApiBaseUrl from "../utils/api"; 

function EqQuizPage() {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const API_URL =  getApiBaseUrl(); 
;

    // Theme colors matching BigFivePage/App.css
    const theme = {
        bgMain: "var(--bg-main, #0a140f)",
        bgCard: "var(--bg-card, #111c17)",
        accent: "var(--accent, #19fd91)",
        textMain: "var(--text-main, #ffffff)",
        textMuted: "var(--text-muted, #b4bebd)",
        border: "var(--border, #233127)",
    };

    const handleOptionSelect = (option) => {
        setAnswers({ ...answers, [currentQuestionIndex]: option });
    };

    const handleNext = () => {
        if (currentQuestionIndex < eqQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const saveTestResult = async (resultData) => {
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
                    testName: "EQ Test",
                    result: resultData
                }),
            });
        } catch (err) {
            console.error("Failed to save EQ result", err);
        }
    };

    const handleSubmit = () => {
        // Option to Value Map
        const optionToValue = (opt) => {
            const map = {
                "Strongly Disagree": 1,
                "Disagree": 2,
                "Neutral": 3,
                "Agree": 4,
                "Strongly Agree": 5
            };
            return map[opt] || 0;
        };

        // Calculate Scores per Category
        // Q1-5: Self-Awareness
        // Q6-10: Self-Regulation
        // Q11-15: Motivation
        // Q16-20: Empathy & Social Skills

        let scores = {
            selfAwareness: 0,
            selfRegulation: 0,
            motivation: 0,
            empathy: 0
        };

        eqQuestions.forEach((q, index) => {
            const val = optionToValue(answers[index]);
            if (index < 5) scores.selfAwareness += val;
            else if (index < 10) scores.selfRegulation += val;
            else if (index < 15) scores.motivation += val;
            else scores.empathy += val;
        });

        const totalScore = scores.selfAwareness + scores.selfRegulation + scores.motivation + scores.empathy;

        const resultData = {
            score: totalScore,
            breakdown: scores,
            date: new Date().toISOString()
        };

        saveTestResult(resultData);

        navigate("/quiz/eq-result", { state: resultData });
    };

    const currentQuestion = eqQuestions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / eqQuestions.length) * 100;
    const isLastQuestion = currentQuestionIndex === eqQuestions.length - 1;

    return (
        <div style={{
            minHeight: "100vh",
            background: theme.bgMain,
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            color: theme.textMain
        }}>

            <div style={{
                width: "100%",
                maxWidth: "800px",
                marginBottom: "2rem"
            }}>
                <div style={{ fontWeight: "600", color: theme.textMuted, marginBottom: "0.5rem" }}>
                    Question {currentQuestionIndex + 1} of {eqQuestions.length}
                </div>
                <div style={{
                    width: "100%",
                    height: "10px",
                    background: "rgba(33,46,35,0.7)",
                    borderRadius: "5px",
                    overflow: "hidden"
                }}>
                    <div style={{
                        width: `${progressPercentage}%`,
                        height: "100%",
                        background: theme.accent,
                        transition: "width 0.3s ease"
                    }}></div>
                </div>
            </div>

            <div style={{
                background: theme.bgCard,
                width: "100%",
                maxWidth: "800px",
                borderRadius: "20px",
                padding: "3rem",
                boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
                border: `1px solid ${theme.border}`,
                display: "flex",
                flexDirection: "column",
                gap: "2rem"
            }}>

                <h2 style={{
                    color: theme.textMain,
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    lineHeight: "1.5"
                }}>
                    {currentQuestionIndex + 1}. {currentQuestion.question}
                </h2>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "100%"
                }}>
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = answers[currentQuestionIndex] === option;
                        return (
                            <div
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                style={{
                                    border: `2px solid ${isSelected ? theme.accent : "var(--input-border, #233127)"}`,
                                    borderRadius: "10px",
                                    padding: "1rem 1.5rem",
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    background: isSelected ? theme.accent : "var(--bg-accent, #1A261F)",
                                    color: isSelected ? "var(--btn-text, #000)" : theme.textMain,
                                    width: "100%",
                                    boxSizing: "border-box"
                                }}
                            >
                                <div style={{
                                    fontSize: "1.1rem",
                                    fontWeight: "500",
                                    width: "100%"
                                }}>
                                    {option}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                    width: "100%"
                }}>
                    {currentQuestionIndex > 0 ? (
                        <button
                            onClick={handlePrevious}
                            style={{
                                background: "#222a22",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: "600",
                                padding: "1rem 3rem",
                                borderRadius: "12px",
                                transition: "all 0.2s",
                                minWidth: "150px"
                            }}
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    <button
                        onClick={handleNext}
                        style={{
                            background: theme.accent,
                            border: "none",
                            color: "black",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "700",
                            padding: "1rem 3rem",
                            borderRadius: "12px",
                            transition: "all 0.2s",
                            minWidth: "150px"
                        }}
                    >
                        {isLastQuestion ? "Submit" : "Next"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EqQuizPage;
