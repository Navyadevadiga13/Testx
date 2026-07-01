// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// function IqResultPage() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [result, setResult] = useState(null);

//     const getInterpretation = (score) => {
//         if (score >= 90) return "Very Superior";
//         if (score >= 80) return "Superior";
//         if (score >= 70) return "High Average";
//         if (score >= 60) return "Average";
//         if (score >= 40) return "Low Average";
//         return "Below Average";
//     };

//     useEffect(() => {
//         if (location.state) {
//             setResult(location.state);
//         } else {
//             // Redirect if no state (e.g., direct access)
//             navigate("/tests");
//         }
//     }, [location, navigate]);

//     // Theme colors matching BigFivePage/App.css
//     const theme = {
//         bgMain: "var(--bg-main, #0a140f)",
//         bgCard: "var(--bg-card, #111c17)",
//         accent: "var(--accent, #19fd91)",
//         textMain: "var(--text-main, #ffffff)",
//         textMuted: "var(--text-muted, #b4bebd)",
//         border: "var(--border, #233127)",
//     };

//     if (!result) return null;

//     const formattedDate = new Date().toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });

//     return (
//         <div style={{
//             minHeight: "80vh",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             background: theme.bgMain,
//             padding: "3.5rem 1rem",
//             fontFamily: "'Inter', sans-serif",
//         }}>
//             <div style={{
//                 background: theme.bgCard,
//                 padding: "3rem 2.5rem",
//                 width: "95%",
//                 maxWidth: "600px",
//                 borderRadius: "20px",
//                 boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 gap: "1.5rem",
//                 border: `1px solid ${theme.border}`
//             }}>

//                 <h1 style={{
//                     color: theme.textMain,
//                     fontSize: "1.8rem",
//                     fontWeight: "700",
//                     margin: 0
//                 }}>
//                     IQ Test
//                 </h1>

//                 <div style={{
//                     color: theme.textMuted,
//                     fontSize: "1rem",
//                     marginBottom: "1rem"
//                 }}>
//                     {formattedDate}
//                 </div>

//                 <div style={{
//                     width: "100%",
//                     height: "1px",
//                     background: theme.border,
//                     marginBottom: "1rem"
//                 }}></div>

//                 <div style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: "0.5rem"
//                 }}>
//                     <span style={{
//                         color: theme.textMuted,
//                         fontSize: "1.2rem",
//                         fontWeight: "500"
//                     }}>
//                         IQ Score
//                     </span>
//                     <span style={{
//                         color: theme.textMain, // White score to match screenshot style usually, or accent?
//                         fontSize: "4rem",
//                         fontWeight: "800",
//                         lineHeight: "1"
//                     }}>
//                         {result.score}
//                     </span>
//                     <span style={{
//                         color: theme.accent,
//                         fontSize: "1.5rem",
//                         fontWeight: "600",
//                         marginTop: "0.5rem"
//                     }}>
//                         {getInterpretation(result.score)}
//                     </span>
//                 </div>

//                 <div style={{
//                     marginTop: "2rem",
//                     fontSize: "0.95rem",
//                     color: theme.accent,
//                     textAlign: "center",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "0.5rem"
//                 }}>
//                     ✅ Result saved to your profile!
//                 </div>

//                 <button
//                     onClick={() => navigate("/profile")}
//                     style={{
//                         backgroundColor: "transparent",
//                         color: theme.textMuted,
//                         border: `1px solid ${theme.textMuted}`,
//                         padding: "0.8rem 2.5rem",
//                         fontSize: "1rem",
//                         fontWeight: "600",
//                         borderRadius: "12px",
//                         cursor: "pointer",
//                         marginTop: "1.5rem",
//                         transition: "all 0.2s ease"
//                     }}
//                     onMouseOver={(e) => {
//                         e.target.style.borderColor = theme.accent;
//                         e.target.style.color = theme.accent;
//                     }}
//                     onMouseOut={(e) => {
//                         e.target.style.borderColor = theme.textMuted;
//                         e.target.style.color = theme.textMuted;
//                     }}
//                 >
//                     Go To Profile
//                 </button>

//             </div>
//         </div>
//     );
// }

// export default IqResultPage;


// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// function IqResultPage() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [result, setResult] = useState(null);

//     const getInterpretation = (score) => {
//         if (score >= 90) return "Very Superior";
//         if (score >= 80) return "Superior";
//         if (score >= 70) return "High Average";
//         if (score >= 60) return "Average";
//         if (score >= 40) return "Low Average";
//         return "Below Average";
//     };

//     useEffect(() => {
//         if (location.state) {
//             setResult(location.state);
//         } else {
//             // Redirect if no state (e.g., direct access)
//             navigate("/tests");
//         }
//     }, [location, navigate]);

//     // Theme colors matching BigFivePage/App.css
//     const theme = {
//         bgMain: "var(--bg-main, #0a140f)",
//         bgCard: "var(--bg-card, #111c17)",
//         accent: "var(--accent, #19fd91)",
//         textMain: "var(--text-main, #ffffff)",
//         textMuted: "var(--text-muted, #b4bebd)",
//         border: "var(--border, #233127)",
//     };

//     if (!result) return null;

//     const formattedDate = new Date().toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });

//     return (
//         <div style={{
//             minHeight: "80vh",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             background: theme.bgMain,
//             padding: "3.5rem 1rem",
//             fontFamily: "'Inter', sans-serif",
//         }}>
//             <div style={{
//                 background: theme.bgCard,
//                 padding: "3rem 2.5rem",
//                 width: "95%",
//                 maxWidth: "600px",
//                 borderRadius: "20px",
//                 boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 gap: "1.5rem",
//                 border: `1px solid ${theme.border}`
//             }}>

//                 <h1 style={{
//                     color: theme.textMain,
//                     fontSize: "1.8rem",
//                     fontWeight: "700",
//                     margin: 0
//                 }}>
//                     IQ Test
//                 </h1>

//                 <div style={{
//                     color: theme.textMuted,
//                     fontSize: "1rem",
//                     marginBottom: "1rem"
//                 }}>
//                     {formattedDate}
//                 </div>

//                 <div style={{
//                     width: "100%",
//                     height: "1px",
//                     background: theme.border,
//                     marginBottom: "1rem"
//                 }}></div>

//                 <div style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: "0.5rem"
//                 }}>
//                     <span style={{
//                         color: theme.textMuted,
//                         fontSize: "1.2rem",
//                         fontWeight: "500"
//                     }}>
//                         IQ Score
//                     </span>
//                     <span style={{
//                         color: theme.textMain, // White score to match screenshot style usually, or accent?
//                         fontSize: "4rem",
//                         fontWeight: "800",
//                         lineHeight: "1"
//                     }}>
//                         {result.score}
//                     </span>
//                     <span style={{
//                         color: theme.accent,
//                         fontSize: "1.5rem",
//                         fontWeight: "600",
//                         marginTop: "0.5rem"
//                     }}>
//                         {getInterpretation(result.score)}
//                     </span>
//                 </div>

//                 <div style={{
//                     marginTop: "2rem",
//                     fontSize: "0.95rem",
//                     color: theme.accent,
//                     textAlign: "center",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "0.5rem"
//                 }}>
//                     ✅ Result saved to your profile!
//                 </div>

//                 <button
//                     onClick={() => navigate("/profile")}
//                     style={{
//                         backgroundColor: "transparent",
//                         color: theme.textMuted,
//                         border: `1px solid ${theme.textMuted}`,
//                         padding: "0.8rem 2.5rem",
//                         fontSize: "1rem",
//                         fontWeight: "600",
//                         borderRadius: "12px",
//                         cursor: "pointer",
//                         marginTop: "1.5rem",
//                         transition: "all 0.2s ease"
//                     }}
//                     onMouseOver={(e) => {
//                         e.target.style.borderColor = theme.accent;
//                         e.target.style.color = theme.accent;
//                     }}
//                     onMouseOut={(e) => {
//                         e.target.style.borderColor = theme.textMuted;
//                         e.target.style.color = theme.textMuted;
//                     }}
//                 >
//                     Go To Profile
//                 </button>

//             </div>
//         </div>
//     );
// }

// export default IqResultPage;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function IqResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    // Updated parameters for a 30‑question test
    const TOTAL_QUESTIONS = 30; // changed from 50
    const MEAN_RAW = 15;        // average score (mid of 30)
    const RAW_SD = 6;           // adjusted standard deviation
    const IQ_MEAN = 100;
    const IQ_SD = 15;

    // Calculate IQ from raw score
    const calculateIQ = (rawScore) => {
        const safeRaw = Math.min(Math.max(rawScore, 0), TOTAL_QUESTIONS);
        // Adjusted formula to fit 30 questions
        let iq = Math.round(85 + (safeRaw / TOTAL_QUESTIONS) * 30);
        return Math.min(iq, 200);
    };

    // Classification based on IQ
    const getClassification = (iq) => {
        if (iq >= 130) return "Highly gifted";
        if (iq >= 115) return "Above average";
        if (iq >= 90) return "Average";
        if (iq >= 75) return "Below average";
        return "Low range";
    };

    const getClassificationColor = (classification) => {
        if (classification.includes("gifted")) return "#19fd91";
        if (classification.includes("Average")) return "#ffffff";
        if (classification.includes("Above average")) return "#a0e0a0";
        if (classification.includes("Low")) return "#ff9999";
        return "#b4bebd";
    };

    useEffect(() => {
        if (location.state) {
            setResult(location.state);
        } else {
            navigate("/tests");
        }
    }, [location, navigate]);

    const theme = {
        bgMain: "var(--bg-main, #0a140f)",
        bgCard: "var(--bg-card, #111c17)",
        accent: "var(--accent, #19fd91)",
        textMain: "var(--text-main, #ffffff)",
        textMuted: "var(--text-muted, #b4bebd)",
        border: "var(--border, #233127)",
    };

    if (!result) return null;

    const userAnswers = result.userAnswers || {};
    const questions = result.questions || [];
    const rawScore = result.score;
    const correct = result.correct ?? rawScore;
    const wrong = result.wrong ?? (TOTAL_QUESTIONS - rawScore);
    const iqScore = calculateIQ(rawScore);
    const classification = getClassification(iqScore);
    const classificationColor = getClassificationColor(classification);

    const formattedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                background: theme.bgMain,
                paddingTop: "120px",
                paddingBottom: "3rem",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div
                style={{
                    background: theme.bgCard,
                    padding: "3rem 2.5rem",
                    width: "95%",
                    maxWidth: "600px",
                    borderRadius: "20px",
                    boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.5rem",
                    border: `1px solid ${theme.border}`,
                }}
            >
                <h1
                    style={{
                        color: theme.textMain,
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        margin: 0,
                    }}
                >
                    IQ Test Result
                </h1>
                <div
                    style={{
                        color: theme.textMuted,
                        fontSize: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    {formattedDate}
                </div>
                <div
                    style={{
                        width: "100%",
                        height: "1px",
                        background: theme.border,
                        marginBottom: "1rem",
                    }}
                ></div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <span
                        style={{
                            color: theme.textMuted,
                            fontSize: "1.2rem",
                            fontWeight: "500",
                        }}
                    >
                        IQ Score
                    </span>
                    <span
                        style={{
                            color: theme.textMain,
                            fontSize: "4rem",
                            fontWeight: "800",
                            lineHeight: "1",
                        }}
                    >
                        {iqScore}
                    </span>
                    <span
                        style={{
                            color: classificationColor,
                            fontSize: "1.5rem",
                            fontWeight: "600",
                            marginTop: "0.5rem",
                            textAlign: "center",
                        }}
                    >
                        {classification}
                    </span>
                </div>
                <div
                    style={{
                        marginTop: "1rem",
                        fontSize: "1rem",
                        color: theme.textMuted,
                        textAlign: "center",
                    }}
                >
                    Raw Score: {rawScore} / {TOTAL_QUESTIONS}
                </div>

                <div
                    style={{
                        marginTop: "1rem",
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        fontSize: "1rem",
                        fontWeight: "600",
                    }}
                >
                    <span style={{ color: "#19fd91" }}>✅ Correct: {correct}</span>
                    <span style={{ color: "#ff6b6b" }}>❌ Wrong: {wrong}</span>
                </div>

                <div style={{ width: "100%", marginTop: "2rem" }}>
                    <h3
                        style={{
                            color: theme.accent,
                            marginBottom: "1rem",
                            textAlign: "center",
                        }}
                    >
                        Answer Review
                    </h3>

                    {questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === q.answer;

                        return (
                            <div
                                key={index}
                                style={{
                                    background: "#0f1a14",
                                    border: `1px solid ${isCorrect ? "#19fd91" : "#ff6b6b"}`,
                                    borderRadius: "10px",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                }}
                            >
                                <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                                    Q{index + 1}. {q.question}
                                </div>

                                <div style={{ fontSize: "0.9rem" }}>
                                    Your Answer:{" "}
                                    <span
                                        style={{
                                            color: isCorrect ? "#19fd91" : "#ff6b6b",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {userAnswer || "Not Answered"}
                                    </span>
                                </div>

                                {!isCorrect && (
                                    <div
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "#19fd91",
                                            marginTop: "0.3rem",
                                        }}
                                    >
                                        Correct Answer: {q.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div
                    style={{
                        marginTop: "1rem",
                        fontSize: "0.95rem",
                        color: theme.accent,
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    ✅ Result saved to your profile!
                </div>
                <button
                    onClick={() => navigate("/profile")}
                    style={{
                        backgroundColor: "transparent",
                        color: theme.textMuted,
                        border: `1px solid ${theme.textMuted}`,
                        padding: "0.8rem 2.5rem",
                        fontSize: "1rem",
                        fontWeight: "600",
                        borderRadius: "12px",
                        cursor: "pointer",
                        marginTop: "1.5rem",
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        e.target.style.borderColor = theme.accent;
                        e.target.style.color = theme.accent;
                    }}
                    onMouseOut={(e) => {
                        e.target.style.borderColor = theme.textMuted;
                        e.target.style.color = theme.textMuted;
                    }}
                >
                    Go To Profile
                </button>
            </div>
        </div>
    );
}

export default IqResultPage;