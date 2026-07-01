// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaClock, FaArrowRight, FaArrowLeft } from "react-icons/fa";
// import iqQuestions from "../data/iqQuestions";
// import getApiBaseUrl from "../utils/api"; 

// function IqQuizPage() {
//     const navigate = useNavigate();
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answers, setAnswers] = useState({});
//     const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds

//     const API_URL = getApiBaseUrl(); 
// ;

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTimeLeft((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(timer);
//                     handleSubmit();
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);

//     const formatTime = (seconds) => {
//         const minutes = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//     };

//     const handleOptionSelect = (option) => {
//         setAnswers({ ...answers, [currentQuestionIndex]: option });
//     };

//     const handleNext = () => {
//         if (currentQuestionIndex < iqQuestions.length - 1) {
//             setCurrentQuestionIndex(currentQuestionIndex + 1);
//         } else {
//             handleSubmit();
//         }
//     };

//     const handlePrevious = () => {
//         if (currentQuestionIndex > 0) {
//             setCurrentQuestionIndex(currentQuestionIndex - 1);
//         }
//     };

//     const saveTestResult = async (iqScore) => {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         try {
//             await fetch(`${API_URL}/tests/save`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: token,
//                 },
//                 body: JSON.stringify({
//                     testName: "IQ Test",
//                     result: { score: iqScore, date: new Date().toISOString() }
//                 }),
//             });
//         } catch (err) {
//             console.error("Failed to save IQ result", err);
//         }
//     };

//     const handleSubmit = () => {
//         // Calculate Score
//         let correctCount = 0;
//         iqQuestions.forEach((q, index) => {
//             if (answers[index] === q.answer) {
//                 correctCount++;
//             }
//         });

//         // Updated IQ calculation: 20 questions * 5 points = 100 max
//         const iqScore = correctCount * 5;

//         // Save result
//         saveTestResult(iqScore);

//         navigate("/quiz/iq-result", { state: { score: iqScore, correct: correctCount, total: iqQuestions.length } });
//     };

//     const currentQuestion = iqQuestions[currentQuestionIndex];
//     const progressPercentage = ((currentQuestionIndex + 1) / iqQuestions.length) * 100;
//     const isLastQuestion = currentQuestionIndex === iqQuestions.length - 1;

//     // Theme colors matching BigFivePage/App.css
//     const theme = {
//         bgMain: "var(--bg-main)", // #0a140f
//         bgCard: "var(--bg-card)", // #111c17
//         accent: "var(--accent)", // #19fd91
//         textMain: "var(--text-main)", // #ffffff
//         textMuted: "var(--text-muted)", // #b4bebd
//         border: "var(--border)", // #233127
//     };

//     return (
//         <div style={{
//             minHeight: "100vh",
//             background: theme.bgMain,
//             fontFamily: "'Inter', sans-serif",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             padding: "2rem",
//             color: theme.textMain
//         }}>

//             {/* Top Bar: Progress & Timer */}
//             <div style={{
//                 width: "100%",
//                 maxWidth: "1000px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "2rem"
//             }}>
//                 <div style={{ fontWeight: "600", color: theme.textMuted }}>
//                     Question {currentQuestionIndex + 1} of {iqQuestions.length}
//                 </div>

//                 <div style={{
//                     flex: 1,
//                     height: "10px",
//                     background: "rgba(33,46,35,0.7)",
//                     borderRadius: "5px",
//                     margin: "0 2rem",
//                     overflow: "hidden"
//                 }}>
//                     <div style={{
//                         width: `${progressPercentage}%`,
//                         height: "100%",
//                         background: theme.accent,
//                         transition: "width 0.3s ease"
//                     }}></div>
//                 </div>

//                 <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "0.5rem",
//                     fontWeight: "600",
//                     color: theme.accent,
//                     background: "rgba(25, 253, 145, 0.1)",
//                     padding: "0.5rem 1rem",
//                     borderRadius: "20px",
//                     border: `1px solid ${theme.border}`
//                 }}>
//                     <FaClock />
//                     <span>{formatTime(timeLeft)}</span>
//                 </div>
//             </div>

//             {/* Question Card */}
//             <div style={{
//                 background: theme.bgCard,
//                 width: "100%",
//                 maxWidth: "1000px",
//                 borderRadius: "20px",
//                 padding: "3rem",
//                 boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
//                 border: `1px solid ${theme.border}`,
//                 minHeight: "400px",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center"
//             }}>

//                 <h2 style={{
//                     textAlign: "center",
//                     color: theme.textMain,
//                     marginBottom: "2rem",
//                     fontSize: "1.5rem",
//                     fontWeight: "600",
//                     lineHeight: "1.5"
//                 }}>
//                     {currentQuestionIndex + 1}. {currentQuestion.question}
//                 </h2>

//                 {/* Render Question SVG if available */}
//                 {currentQuestion.svg && (
//                     <div
//                         style={{
//                             marginBottom: "2rem",
//                             width: "100%",
//                             display: "flex",
//                             justifyContent: "center"
//                         }}
//                         dangerouslySetInnerHTML={{ __html: currentQuestion.svg }}
//                     />
//                 )}

//                 <div style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "1rem",
//                     marginBottom: "3rem",
//                     width: "100%"
//                 }}>
//                     {currentQuestion.options.map((option, idx) => {
//                         const isSelected = answers[currentQuestionIndex] === option;
//                         const labels = ["A", "B", "C", "D"];

//                         // Check if there's a specific SVG for this option (if we add optionSvgs to data)
//                         // Or auto-generate simple SVG for text/numbers to match "SVG format" request
//                         const optionSvg = currentQuestion.optionSvgs ? currentQuestion.optionSvgs[idx] : null;

//                         return (
//                             <div
//                                 key={idx}
//                                 onClick={() => handleOptionSelect(option)}
//                                 style={{
//                                     border: `2px solid ${isSelected ? theme.accent : "var(--input-border, #233127)"}`,
//                                     borderRadius: "10px",
//                                     padding: "1rem 1.5rem",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     cursor: "pointer",
//                                     transition: "all 0.2s ease",
//                                     background: isSelected ? theme.accent : "var(--bg-accent, #1A261F)",
//                                     color: isSelected ? "var(--btn-text, #000)" : theme.textMain,
//                                     gap: "1rem",
//                                     width: "100%",
//                                     boxSizing: "border-box"
//                                 }}
//                             >
//                                 <div style={{
//                                     width: "28px",
//                                     minWidth: "28px",
//                                     height: "28px",
//                                     borderRadius: "50%",
//                                     background: isSelected ? "rgba(0,0,0,0.2)" : "transparent",
//                                     border: isSelected ? "none" : `2px solid ${theme.textMuted}`,
//                                     color: isSelected ? "inherit" : theme.textMuted,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     fontWeight: "bold",
//                                     fontSize: "0.8rem"
//                                 }}>
//                                     {labels[idx]}
//                                 </div>

//                                 {optionSvg ? (
//                                     <div
//                                         style={{ width: "60px", height: "60px" }}
//                                         dangerouslySetInnerHTML={{ __html: optionSvg }}
//                                     />
//                                 ) : (
//                                     <div style={{
//                                         fontSize: "1.1rem",
//                                         fontWeight: "500",
//                                         textAlign: "left"
//                                     }}>
//                                         {option}
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div style={{
//                     display: "flex",
//                     justifyContent: "space-between", // Back left, Next right
//                     width: "100%",
//                     marginTop: "2rem"
//                 }}>
//                     {currentQuestionIndex > 0 ? (
//                         <button
//                             onClick={handlePrevious}
//                             style={{
//                                 background: "#222a22",
//                                 border: "none",
//                                 color: "white",
//                                 cursor: "pointer",
//                                 fontSize: "1rem",
//                                 fontWeight: "600",
//                                 padding: "1rem 3rem", // Increased padding for width
//                                 borderRadius: "12px",
//                                 transition: "all 0.2s",
//                                 minWidth: "180px" // Ensure minimum width
//                             }}
//                         >
//                             Back
//                         </button>
//                     ) : (
//                         <div></div>
//                     )}

//                     <button
//                         onClick={handleNext}
//                         style={{
//                             background: theme.accent,
//                             border: "none",
//                             color: "black",
//                             cursor: "pointer",
//                             fontSize: "1rem",
//                             fontWeight: "700",
//                             padding: "1rem 3rem", // Increased padding for width
//                             borderRadius: "12px",
//                             transition: "all 0.2s",
//                             minWidth: "180px" // Ensure minimum width
//                         }}
//                     >
//                         {isLastQuestion ? "Submit" : "Next"}
//                     </button>
//                 </div>

//             </div>
//             {/* Removed external footer */}

//         </div >
//     );
// }

// export default IqQuizPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import iqQuestions from "../data/iqQuestions";
import getApiBaseUrl from "../utils/api";

function IqQuizPage() {
    const navigate = useNavigate();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
    const [submitted, setSubmitted] = useState(false);

    const API_URL = getApiBaseUrl();

    // ✅ TIMER
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // ✅ AUTO SUBMIT
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
        }
    }, [timeLeft]);

    // ⏱ FORMAT TIME
    const formatTime = (seconds) => {
        if (seconds <= 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // 🟢 SELECT OPTION
    const handleOptionSelect = (option) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: option,
        }));
    };

    // ➡ NEXT
    const handleNext = () => {
        if (currentQuestionIndex < iqQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    // ⬅ PREVIOUS
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    // 💾 SAVE RESULT
const saveTestResult = async (rawScore, total) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  // ✅ CALCULATE IQ
  const iq = Math.round(((rawScore - 30) / 5) * 15 + 100);

  try {
    const res = await fetch(`${API_URL}/tests/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        testName: "IQ Test",
        result: {
          score: rawScore,
          total: total,
          iq: iq   // ✅ THIS IS THE KEY
        },
      }),
    });

    const data = await res.json();
    console.log("SAVE RESPONSE:", data);

  } catch (err) {
    console.error("Failed to save IQ result", err);
  }
};

    // ✅ SUBMIT
    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);

        let correctCount = 0;

        iqQuestions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                correctCount++;
            }
        });
saveTestResult(correctCount, iqQuestions.length);

      const wrongCount = iqQuestions.length - correctCount;

navigate("/quiz/iq-result", {
    state: {
        score: correctCount,
        total: iqQuestions.length,
        correct: correctCount,
        wrong: iqQuestions.length - correctCount,
        userAnswers: answers,           // ✅ ADD THIS
        questions: iqQuestions         // ✅ ADD THIS
    },
});
    };

    const currentQuestion = iqQuestions[currentQuestionIndex];
    const progressPercentage =
        ((currentQuestionIndex + 1) / iqQuestions.length) * 100;

    const theme = {
        bgMain: "#0a140f",
        bgCard: "#111c17",
        accent: "#28a745",
        textMain: "#ffffff",
        textMuted: "#b4bebd",
        border: "#233127",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: theme.bgMain,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem",
                color: theme.textMain,
            }}
        >
            {/* 🔝 TOP BAR (NO TIMER NOW) */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1000px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                }}
            >
                <div style={{ fontWeight: "600", color: theme.textMuted }}>
                    Question {currentQuestionIndex + 1} of {iqQuestions.length}
                </div>

                {/* 📊 PROGRESS */}
                <div
                    style={{
                        flex: 1,
                        height: "10px",
                        background: "#233127",
                        borderRadius: "5px",
                        margin: "0 2rem",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${progressPercentage}%`,
                            height: "100%",
                            background: theme.accent,
                        }}
                    ></div>
                </div>
            </div>

            {/* 📦 QUESTION CARD */}
            <div
                style={{
                    background: theme.bgCard,
                    width: "100%",
                    maxWidth: "1000px",
                    borderRadius: "20px",
                    padding: "3rem",
                    border: `1px solid ${theme.border}`,
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    {currentQuestionIndex + 1}. {currentQuestion.question}
                </h2>

                {/* IMAGE */}
                {currentQuestion.image && (
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <img
                            src={currentQuestion.image}
                            alt="Question"
                            style={{
                                maxWidth: "500px",
                                width: "100%",
                                borderRadius: "12px",
                            }}
                        />
                    </div>
                )}

                {/* OPTIONS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected =
                            answers[currentQuestionIndex] === option;

                        return (
                            <div
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                style={{
                                    border: `2px solid ${isSelected ? theme.accent : theme.border}`,
                                    borderRadius: "10px",
                                    padding: "1rem",
                                    cursor: "pointer",
                                    background: isSelected ? theme.accent : "transparent",
                                    color: isSelected ? "#fff" : theme.textMain,
                                }}
                            >
                                {option}
                            </div>
                        );
                    })}
                </div>

                {/* BUTTONS */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "2rem",
                    }}
                >
               {currentQuestionIndex > 0 && (
    <button onClick={handlePrevious} style={{backgroundColor:"#28a745",color:"#fff",border:"none",padding:"0.8rem 1.8rem",borderRadius:"8px",fontWeight:"600",cursor:"pointer"}}>Back</button>
)}
                  <button
    onClick={handleNext}
    style={{
        backgroundColor: "#28a745",   // ✅ green
        color: "#fff",
        border: "none",
        padding: "0.8rem 1.8rem",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
    }}
>
    {currentQuestionIndex === iqQuestions.length - 1
        ? "Submit"
        : "Next"}
</button>
                </div>
            </div>

            {/* ⏳ TIMER BELOW CARD */}
            <div
                style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontWeight: "700",
                        fontSize: "20px",
                        color: "#fff",
                        background: "#000",
                        padding: "10px 20px",
                        borderRadius: "25px",
                        border: "2px solid #28a745",
                    }}
                >
                    <FaClock />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>
        </div>
    );
}

export default IqQuizPage;