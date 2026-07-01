// src/quiz/Gre_quantitative.js

import React, { useState, useEffect } from "react";
import getApiBaseUrl from "../utils/api";
import { FaClock } from "react-icons/fa";

// ================= SECTION 1 =================

const section1Questions = [
    {
        id: 1,
        question: "Let f(x) = (x² − 4x + 3)/(x − 1), x ≠ 1. Compare lim(x→1) f(x) and lim(x→1)(x+2).",
        options: ["Quantity A > Quantity B", "Quantity B > Quantity A", "Equal", "Cannot be determined"],
        answer: "Equal"
    },
    {
        id: 2,
        question: "If log₂(x) + log₂(x−2) = 3, what is x?",
        options: ["3", "4", "5", "6"],
        answer: "4"
    },
    {
        id: 3,
        question: "A tank has 30L solution with 20% salt. 10L removed and replaced with water twice. Final salt %?",
        options: ["8.89%", "10%", "11.11%", "12%"],
        answer: "8.89%"
    },
    {
        id: 4,
        question: "If x² + y² = 25 and xy = 12, find (x+y)².",
        options: ["25", "36", "49", "64"],
        answer: "49"
    },
    {
        id: 5,
        question: "Triangle sides 13, 14, 15. Find area.",
        options: ["84", "90", "96", "100"],
        answer: "84"
    },
    {
        id: 6,
        question: "Total production 2020 = 300k and 2022 = 420k. Percentage increase?",
        options: ["30%", "35%", "40%", "45%"],
        answer: "40%"
    },
    {
        id: 7,
        question: "A bag has 5 red, 4 blue, 3 green balls. Two drawn without replacement. Probability both same color?",
        options: ["11/66", "19/66", "7/22", "1/3"],
        answer: "19/66"
    },
    {
        id: 8,
        question: "Compare √(x²+4x+4) and x+2 for x>0.",
        options: ["A>B", "B>A", "Equal", "Cannot determine"],
        answer: "Equal"
    },
    {
        id: 9,
        question: "Dataset: 3,7,8,12,15,15,18. Compare Mean and Median.",
        options: ["Mean > Median", "Median > Mean", "Equal", "Cannot determine"],
        answer: "Mean > Median"
    },
    {
        id: 10,
        question: "Solve x² −5x +6 =0. Possible values of x?",
        options: ["1 and 6", "2 and 3", "3 and 6", "1 and 3"],
        answer: "2 and 3"
    },
    {
        id: 11,
        question: "If 1/x + 1/y =1 and x+y=5, find xy.",
        options: ["4", "5", "6", "8"],
        answer: "5"
    },
    {
        id: 12,
        question: "Circle radius 10, chord length 12. Distance from center to chord?",
        options: ["6", "8", "9", "10"],
        answer: "8"
    }
];

// ================= SECTION 2 =================

const section2Questions = [
    {
        id: 13,
        question: "Let n = 2¹⁰. Compare number of factors of n and 10.",
        options: ["A>B", "B>A", "Equal", "Cannot determine"],
        answer: "B>A"
    },
    {
        id: 14,
        question: "Solve √(x+6) + √(x−3) = 5.",
        options: ["4", "5", "6", "7"],
        answer: "6"
    },
    {
        id: 15,
        question: "Find remainder when 7²⁰²⁵ is divided by 6.",
        options: ["1", "3", "5", "0"],
        answer: "1"
    },
    {
        id: 16,
        question: "Cube side 6. Sphere inscribed. Volume?",
        options: ["36π", "48π", "72π", "144π"],
        answer: "36π"
    },
    {
        id: 17,
        question: "Revenue distribution: B=25%, C=20% of $2M. Combined revenue?",
        options: ["$700,000", "$800,000", "$900,000", "$1,000,000"],
        answer: "$900,000"
    },
    {
        id: 18,
        question: "Three dice rolled. Probability sum = 10?",
        options: ["1/12", "1/8", "1/6", "1/9"],
        answer: "1/8"
    },
    {
        id: 19,
        question: "f(x)=2x²−3x+1. Find f(f(1)).",
        options: ["0", "1", "2", "3"],
        answer: "1"
    },
    {
        id: 20,
        question: "Solve 3^(x+1) = 81.",
        options: ["2", "3", "4", "5"],
        answer: "3"
    },
    {
        id: 21,
        question: "From 8 students choose committee of 3 but two specific students cannot be together.",
        options: ["48", "52", "56", "60"],
        answer: "52"
    },
    {
        id: 22,
        question: "Mean =20, SD=4. If each value increases by 5, new mean?",
        options: ["20", "25", "30", "35"],
        answer: "25"
    },
    {
        id: 23,
        question: "Diagonal of rectangular prism with dimensions 3,4,12.",
        options: ["12", "13", "14", "15"],
        answer: "13"
    },
    {
        id: 24,
        question: "If x + 1/x = 5, find x² + 1/x².",
        options: ["21", "23", "25", "27"],
        answer: "23"
    },
    {
        id: 25,
        question: "Population 50,000 growing 10% yearly. Population after 3 years?",
        options: ["66,550", "65,000", "60,500", "70,000"],
        answer: "66,550"
    },
    {
        id: 26,
        question: "Compare 2⁵⁰ and 10¹⁵.",
        options: ["A>B", "B>A", "Equal", "Cannot determine"],
        answer: "B>A"
    },
    {
        id: 27,
        question: "Train travels half distance at 60 km/h and half at 40 km/h. Average speed?",
        options: ["48", "50", "52", "55"],
        answer: "48"
    }
];

const allQuestions = [...section1Questions, ...section2Questions];

function Gre_quantitative() {

    const API_URL = getApiBaseUrl();

    const [section, setSection] = useState(1);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(21 * 60);
    const [showResult, setShowResult] = useState(false);

    const questions =
        section === 1
            ? section1Questions
            : section2Questions;

    const question = questions[currentQuestionIndex];

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {

        const timer = setInterval(() => {

            setTimeLeft(prev => {

                if (prev <= 1) {

                    if (section === 1) {
                        setSection(2);
                        setCurrentQuestionIndex(0);
                        setTimeLeft(26 * 60);
                        return 26 * 60;
                    }

                    finishQuiz();
                    return 0;
                }

                return prev - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [section]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    const handleOptionSelect = (option) => {

        setAnswers(prev => ({
            ...prev,
            [`${section}-${currentQuestionIndex}`]: option
        }));

    };

    const handleNext = () => {

        if (currentQuestionIndex < questions.length - 1) {

            setCurrentQuestionIndex(prev => prev + 1);

        } else {

            if (section === 1) {

                setSection(2);
                setCurrentQuestionIndex(0);
                setTimeLeft(26 * 60);

            } else {

                finishQuiz();

            }
        }
    };

    const calculateScore = () => {

        let score = 0;

        Object.keys(answers).forEach((key) => {

            const [sectionIndex, questionIndex] = key.split("-");

            const index =
                sectionIndex === "1"
                    ? parseInt(questionIndex)
                    : 12 + parseInt(questionIndex);

            if (allQuestions[index].answer === answers[key]) {
                score++;
            }

        });

        return score;
    };

    const finishQuiz = async () => {

        const score = calculateScore();

        const level =
            score >= 22
                ? "Excellent Quantitative Ability"
                : score >= 16
                    ? "Strong Quantitative Skills"
                    : score >= 10
                        ? "Moderate Quantitative Skills"
                        : "Needs Improvement";

        try {

            const token = localStorage.getItem("token");

            await fetch(`${API_URL}/tests/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    testName: "GRE Quantitative Reasoning",
                    result: {
                        score,
                        total: 27,
                        level
                    }
                })
            });

        } catch (err) {
            console.error(err);
        }

        setShowResult(true);
    };

    const progress =
        ((currentQuestionIndex + 1) / questions.length) * 100;

    if (showResult) {

        const score = calculateScore();

        const level =
            score >= 22
                ? "Excellent Quantitative Ability"
                : score >= 16
                    ? "Strong Quantitative Skills"
                    : score >= 10
                        ? "Moderate Quantitative Skills"
                        : "Needs Improvement";

        return (

            <div style={{
                maxWidth: "800px",
                margin: "120px auto",
                padding: "20px",
                textAlign: "center",
                background: "#ffffff",
                color: "#111827"
            }}>

                <h1 style={{
                    fontSize: "32px",
                    color: "#166534",
                    marginBottom: "20px"
                }}>
                    GRE Quantitative Reasoning Test
                </h1>

                <div style={{
                    background: "#ffffff",
                    border: "1px solid #bbf7d0",
                    borderRadius: "12px",
                    padding: "30px"
                }}>

                    <h2>Your Result</h2>

                    <div style={{
                        fontSize: "1.3rem",
                        fontWeight: "600",
                        color: "#166534",
                        marginTop: "10px"
                    }}>
                        Score: {score} / 27
                    </div>

                    <div style={{
                        fontSize: "1.1rem",
                        marginTop: "10px"
                    }}>
                        {level}
                    </div>

                    <button
                        onClick={() => window.location.href = "/profile"}
                        style={{
                            marginTop: "20px",
                            padding: "12px 25px",
                            background: "#166534",
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Go to Profile
                    </button>

                </div>

            </div>
        );
    }

    return (

        <div style={{
            minHeight: "100vh",
            background: "#ffffff",
            display: "flex",
            justifyContent: "center",
            paddingTop: "140px",
            color: "#111827"
        }}>

            <div style={{
                width: "100%",
                maxWidth: "900px"
            }}>

                <h2 style={{
                    textAlign: "center",
                    color: "#166534"
                }}>
                    GRE Quantitative Reasoning — Section {section}
                </h2>

                <p style={{
                    textAlign: "center"
                }}>
                    <FaClock /> {formatTime(timeLeft)}
                </p>

                <div style={{
                    height: "8px",
                    background: "#e5e7eb",
                    marginBottom: "25px",
                    borderRadius: "8px"
                }}>

                    <div style={{
                        width: `${progress}%`,
                        background: "#166534",
                        height: "100%",
                        borderRadius: "8px"
                    }} />

                </div>

                <h3 style={{
                    color: "#166534"
                }}>
                    Question {currentQuestionIndex + 1}
                </h3>

                <p style={{
                    marginBottom: "20px"
                }}>
                    {question.question}
                </p>

                {question.options.map((option, index) => {

                    const selected =
                        answers[`${section}-${currentQuestionIndex}`] === option;

                    return (

                        <div
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            style={{
                                padding: "14px",
                                border: selected
                                    ? "2px solid #166534"
                                    : "1px solid #d1d5db",
                                marginBottom: "12px",
                                cursor: "pointer",
                                borderRadius: "8px",
                                background: selected
                                    ? "#dcfce7"
                                    : "#ffffff"
                            }}
                        >
                            {option}
                        </div>

                    );

                })}

                <div style={{ textAlign: "center" }}>

                    <button
                        onClick={handleNext}
                        disabled={!answers[`${section}-${currentQuestionIndex}`]}
                        style={{
                            background:
                                answers[`${section}-${currentQuestionIndex}`]
                                    ? "#166534"
                                    : "#e5e7eb",
                            color:
                                answers[`${section}-${currentQuestionIndex}`]
                                    ? "#ffffff"
                                    : "#6b7280",
                            border: "none",
                            padding: "12px 32px",
                            borderRadius: "8px",
                            marginTop: "20px",
                            cursor: "pointer"
                        }}
                    >
                        {section === 2 &&
                        currentQuestionIndex === questions.length - 1
                            ? "Finish"
                            : "Next"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Gre_quantitative;