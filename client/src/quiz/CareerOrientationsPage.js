// // src/quiz/CareerOrientationsPage.js
// import React, { useState } from "react";
// import { ALL_TESTS } from "../data/allTests";
// import getApiBaseUrl from "../utils/api"; 

// const TEST_ID = "career-anchor";

// const CAREER_ANCHORS = {
//   AU: "Autonomy/Independence",
//   SE: "Security/Stability",
//   TF: "Technical/Functional",
//   GM: "General Management",
//   EC: "Entrepreneurial Creativity",
//   SV: "Service/Dedication",
//   CH: "Pure Challenge",
//   LS: "Lifestyle",
// };

// const QUESTIONS = [
//   "I dream of being so good at what I do that my expert advice will be sought continually",
//   "I am most fulfilled in my work when I have been able to integrate and manage the efforts of others",
//   "I dream of having career that will allow me the freedom to do a job my own way and on my own schedule",
//   "Security and stability are more important to me than freedom and autonomy",
//   "I am always on the lookout for ideas that would permit me to start my own enterprise",
//   "I will feel successful in my career only if I have a feeling of having made a real contribution to the welfare of society",
//   "I dream of a career in which I can solve problems or win out in situations that are extremely challenging",
//   "I would rather leave my organization than to be put in a job that would compromise my ability to pursue personal and family concerns",
//   "I will feel successful in my career only if I can develop technical or functional skills to a very high level competence",
//   "I dream of being in charge of a complex organization and making decisions that affect many people",
//   "I am most fulfilled in my work when I am completely free to define my own tasks, schedules and procedures",
//   "I would rather leave my organization altogether than accept an assignment that would jeopardize my security in that organization",
//   "Building my own business is more important to me than achieving a high-level managerial position in someone else's organization",
//   "I am most fulfilled in my career when I have been able to use my talents in the service of others",
//   "I will feel successful in my career only if I face and overcome very difficult challenges",
//   "I dream of a career that will permit me to integrate my personal, family, and work needs",
//   "Becoming a senior functional manager in my area of expertise is more attractive to me than becoming a general manager",
//   "I will feel successful in my career only if I become a general manager in some organization",
//   "I will feel successful in my career only if I achieve complete autonomy and freedom",
//   "I seek jobs in organizations that will give me a sense of security and stability",
//   "I am most fulfilled in my career when I have been able to build something that is entirely the result of my own ideas and efforts",
//   "Using my skills to make the world a better place to live and work is more important to me than achieving a high-level managerial position",
//   "I have been most fulfilled in my career when I have solved seemingly unsolvable problems or won out over seemingly impossible odds",
//   "I feel successful in life only if I have been able to balance my personal, family, and career requirements",
//   "I would rather leave my organization than accept a rotational assignments that would take me out of my area of expertise",
//   "Becoming a general manager is more attractive to me than becoming a senior functional manager in my current area of expertise",
//   "The chance to do a job my own way, free of rules and constraints, is more important to me than security",
//   "I am most fulfilled in my work when I feel that I have complete financial and employment security",
//   "I will feel successful in my career only if I succeed in creating or building something that is entirely my own product or idea",
//   "I dream of having a career that makes a real contribution to humanity and society",
//   "I seek out work opportunities that strongly challenge my problem solving and/or competitive skills",
//   "Balancing the demands of personal and professional life is more important to me than achieving a high-level managerial position",
//   "I am most fulfilled in my work when I have been able to use my special skills and talents",
//   "I would rather leave my organization than accept a job that would take me away from the general managerial track",
//   "I would rather leave my organization than accept a job that would reduce my autonomy and freedom",
//   "I dream of having a career that will allow me to feel a sense of security and stability",
//   "I dream of starting up and building my own business",
//   "I would rather leave my organization than accept an assignment that would undermine my ability to be of service to others",
//   "Working on problems that are almost unsolvable is more important to me than achieving a high-level managerial position",
//   "I have always sought out work opportunities that minimize interference with personal or family concerns",
// ];

// const QUESTION_MAPPING = {
//   2: "AU", 10: "AU", 18: "AU", 26: "AU", 34: "AU",
//   3: "SE", 11: "SE", 19: "SE", 27: "SE", 35: "SE",
//   0: "TF", 16: "TF", 24: "TF", 32: "TF",
//   1: "GM", 9: "GM", 17: "GM", 25: "GM", 33: "GM",
//   4: "EC", 12: "EC", 20: "EC", 28: "EC", 36: "EC",
//   5: "SV", 13: "SV", 21: "SV", 29: "SV", 37: "SV",
//   6: "CH", 14: "CH", 22: "CH", 30: "CH", 38: "CH",
//   7: "LS", 15: "LS", 23: "LS", 31: "LS", 39: "LS",
// };

// function scoreCareerAnchor(answersByIndex) {
//   const scores = { AU: 0, SE: 0, TF: 0, GM: 0, EC: 0, SV: 0, CH: 0, LS: 0 };

//   answersByIndex.forEach((value, index) => {
//     if (!value) return;
//     const anchor = QUESTION_MAPPING[index];
//     if (!anchor) return;
//     scores[anchor] += value;
//   });

//   const topAnchors = Object.entries(scores)
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 3);

//   return { scores, topAnchors };
// }

// function ThemeFixesCSS() {
//   return (
//     <style>{`
//       /* Hide number input arrows (all browsers) */
//       input.rating-input::-webkit-outer-spin-button,
//       input.rating-input::-webkit-inner-spin-button {
//         -webkit-appearance: none;
//         margin: 0;
//       }
//       input.rating-input[type="number"] {
//         -moz-appearance: textfield;
//         appearance: textfield;
//       }

//       /* Light mode ONLY: Darken muted text (don't affect dark mode) */
//       body:not(.dark) [style*="text-muted"],
//       :not(body.dark) [style*="text-muted"] {
//         color: rgba(0, 0, 0, 0.75) !important;
//       }
//       body:not(.dark) [style*="0.78rem"],
//       :not(body.dark) [style*="0.78rem"] {
//         color: rgba(0, 0, 0, 0.65) !important;
//       }

//       /* Ensure dark mode uses proper contrast */
//       body.dark [style*="text-muted"] {
//         color: #b4bebd !important;
//       }
//     `}</style>
//   );
// }

// export default function CareerOrientationsPage() {
//   const test = ALL_TESTS.find((t) => t.id === TEST_ID);
//   const questionList = QUESTIONS;
//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   if (!test) {
//     return <div className="quiz-page">Test not found.</div>;
//   }

//   const total = questionList.length;
//   const progress = Math.round(((step + 1) / total) * 100);

//   // ✅ USE ENV VARIABLE
//   const API_URL =  getApiBaseUrl(); 
// ;

//   // --- NEW: Helper to save result to backend ---
//   const saveTestResult = async (scoredResult) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       await fetch(`${API_URL}/tests/save`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": token
//         },
//         body: JSON.stringify({
//           testName: test?.name || "Career Anchors Test",
//           result: scoredResult
//         })
//       });
//       console.log("✅ Career Result saved!");
//     } catch (err) {
//       console.error("❌ Failed to save Career result:", err);
//     }
//   };
//   // ---------------------------------------------

//   const validateCurrent = () => {
//     const val = answers[step];
//     if (val === "" || val === undefined || val === null) {
//       setError("Please enter a rating from 1 to 6.");
//       return false;
//     }
//     if (!Number.isInteger(val) || val < 1 || val > 6) {
//       setError("Rating must be a whole number between 1 and 6.");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const handleNext = () => {
//     if (!validateCurrent()) return;

//     if (step < total - 1) {
//       setStep((s) => s + 1);
//     } else {
//       const answersByIndex = Array.from({ length: total }, (_, i) => answers[i]);
//       const scored = scoreCareerAnchor(answersByIndex);
//       setResult(scored);
//       saveTestResult(scored); // <--- TRIGGER SAVE
//     }
//   };

//   const handleBack = () => {
//     if (step > 0) {
//       setError("");
//       setStep((s) => s - 1);
//     }
//   };

//   if (result) {
//     return (
//     <div
//   style={{
//     minHeight: "80vh",
//     marginTop: "130px",   // 👈 pushes entire card below header
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "var(--bg-main)",
//     padding: "3.5rem 1rem",
//   }}
// >

//         <ThemeFixesCSS />
//         <div
//           style={{
//             background: "var(--bg-card)",
//             padding: "3rem 2.75rem 3.25rem",
//             minWidth: 380,
//             maxWidth: 720,
//             borderRadius: 24,
//             boxShadow: "var(--card-shadow)",
//             display: "flex",
//             flexDirection: "column",
//             gap: "1.7rem",
//           }}
//         >
//           <div
//             style={{
//               fontWeight: 750,
//               fontSize: "1.45rem",
//               color: "var(--text-main)",
//               textAlign: "center",
//             }}
//           >
//             {test.name} – Your Career Anchors
//           </div>

//           <p
//             style={{
//               color: "var(--text-muted)",
//               fontSize: "0.94rem",
//               lineHeight: 1.5,
//               textAlign: "center",
//             }}
//           >
//             Scores are raw sums for each anchor (5–30 per anchor, higher = stronger). The highest
//             scores reflect the anchors most central to your career choices.
//           </p>

//           {/* Centered Top Anchors Layout */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               gap: "1rem",
//               marginBottom: "1rem",
//             }}
//           >
//             {/* Top 2 anchors side-by-side */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "1rem",
//                 width: "100%",
//                 maxWidth: "500px",
//               }}
//             >
//               {result.topAnchors.slice(0, 2).map(([anchor, score]) => (
//                 <div
//                   key={anchor}
//                   style={{
//                     background: "linear-gradient(135deg, var(--accent), #29ff8f)",
//                     color: "#021409",
//                     borderRadius: 16,
//                     padding: "1.4rem 1.2rem",
//                     textAlign: "center",
//                     fontWeight: 600,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: "1.05rem",
//                       marginBottom: "0.35rem",
//                       opacity: 0.9,
//                     }}
//                   >
//                     {CAREER_ANCHORS[anchor]}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "2.2rem",
//                       fontWeight: 800,
//                       letterSpacing: "0.03em",
//                     }}
//                   >
//                     {score}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Third anchor centered below */}
//             {result.topAnchors[2] && (
//               <div
//                 style={{
//                   background: "linear-gradient(135deg, var(--accent), #29ff8f)",
//                   color: "#021409",
//                   borderRadius: 16,
//                   padding: "1.4rem 1.2rem",
//                   textAlign: "center",
//                   fontWeight: 600,
//                   width: "220px", /* Fixed width for center alignment */
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "1.05rem",
//                     marginBottom: "0.35rem",
//                     opacity: 0.9,
//                   }}
//                 >
//                   {CAREER_ANCHORS[result.topAnchors[2][0]]}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "2.2rem",
//                     fontWeight: 800,
//                     letterSpacing: "0.03em",
//                   }}
//                 >
//                   {result.topAnchors[2][1]}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div style={{ overflowX: "auto", marginTop: "0.3rem" }}>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 background: "var(--table-bg)",
//                 borderRadius: 14,
//                 overflow: "hidden",
//                 border: "1px solid var(--table-border)",
//               }}
//             >
//               <thead>
//                 <tr
//                   style={{
//                     background: "rgba(0,255,135,0.22)",
//                     color: "var(--btn-text)",
//                   }}
//                 >
//                   <th
//                     style={{
//                       padding: "0.85rem 0.9rem",
//                       textAlign: "left",
//                       fontSize: "0.9rem",
//                       fontWeight: 600,
//                     }}
//                   >
//                     Anchor
//                   </th>
//                   <th
//                     style={{
//                       padding: "0.85rem 0.9rem",
//                       textAlign: "center",
//                       fontSize: "0.9rem",
//                       fontWeight: 600,
//                     }}
//                   >
//                     Score
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(CAREER_ANCHORS).map(([key, label]) => (
//                   <tr
//                     key={key}
//                     style={{
//                       borderBottom: "1px solid rgba(255,255,255,0.06)",
//                     }}
//                   >
//                     <td
//                       style={{
//                         padding: "0.7rem 0.9rem",
//                         fontSize: "0.9rem",
//                         color: "var(--text-main)",
//                       }}
//                     >
//                       {label}
//                     </td>
//                     <td
//                       style={{
//                         padding: "0.7rem 0.9rem",
//                         textAlign: "center",
//                         fontWeight: 650,
//                         color:
//                           result.topAnchors[0][0] === key
//                             ? "var(--accent)"
//                             : "var(--text-main)",
//                       }}
//                     >
//                       {result.scores[key]}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)", textAlign: "center" }}>
//             ✅ Result saved to your profile!
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const currentValue =
//     answers[step] === undefined || answers[step] === null ? "" : answers[step];

//   return (
//     <div
//       style={{
//         minHeight: "80vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "var(--bg-main)",
//         padding: "3.5rem 1rem",
//       }}
//     >
//       <ThemeFixesCSS />

//       <div
//         style={{
//           background: "var(--bg-card)",
//           padding: "2.6rem 2.75rem 2.9rem",
//           minWidth: 380,
//           maxWidth: 640,
//           borderRadius: 24,
//           boxShadow: "var(--card-shadow)",
//           display: "flex",
//           flexDirection: "column",
//           gap: "1.6rem",
//         }}
//       >
//         <div
//           style={{
//             fontWeight: 750,
//             fontSize: "1.4rem",
//             color: "var(--text-main)",
//           }}
//         >
//           {test.name}
//         </div>
//         <div
//           style={{
//             color: "var(--text-muted)",
//             fontSize: "0.9rem",
//             lineHeight: 1.5,
//           }}
//         >
//           For each statement, type a number from 1 to 6: 1 = never true, 2–3 =
//           occasionally true, 4–5 = often true, 6 = always true.
//         </div>
//         <div
//           style={{
//             color: "var(--text-muted)",
//             fontSize: "0.95rem",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <span>
//             Question {step + 1} of {total}
//           </span>
//           <span style={{ opacity: 0.75 }}>{progress}% complete</span>
//         </div>
//         <div
//           style={{
//             height: 8,
//             background: "var(--progress-track-bg)",
//             borderRadius: 999,
//             overflow: "hidden",
//             marginBottom: "0.8rem",
//             width: "100%",
//           }}
//         >
//           <div
//             style={{
//               width: `${progress}%`,
//               height: "100%",
//               background:
//                 "linear-gradient(90deg, var(--accent), #29ff8f)",
//               transition: "width 0.25s ease",
//             }}
//           />
//         </div>
//         <div
//           style={{
//             fontSize: "1.22rem",
//             fontWeight: 600,
//             color: "var(--text-main)",
//             lineHeight: 1.5,
//           }}
//         >
//           {questionList[step]}
//         </div>

//         <div
//           style={{
//             marginTop: "0.8rem",
//             padding: "0.9rem 1.1rem",
//             borderRadius: 14,
//             background: "var(--panel-bg)",
//             border: "1px solid var(--panel-border)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: "1rem",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "0.25rem",
//             }}
//           >
//             <span
//               style={{
//                 color: "var(--text-muted)",
//                 fontSize: "0.9rem",
//               }}
//             >
//               Rating (1–6)
//             </span>
//             <span
//               style={{
//                 color: "var(--text-muted)",
//                 fontSize: "0.78rem",
//                 opacity: 0.8,
//               }}
//             >
//               Use whole numbers only.
//             </span>
//           </div>
//           <input
//             className="rating-input"
//             type="number"
//             min={1}
//             max={6}
//             value={currentValue}
//             onChange={(e) => {
//               const v = e.target.value;
//               if (v === "") {
//                 setAnswers((a) => ({ ...a, [step]: "" }));
//                 setError("Please enter a rating from 1 to 6.");
//                 return;
//               }
//               const num = Number(v);
//               setAnswers((a) => ({ ...a, [step]: num }));
//               if (num >= 1 && num <= 6 && Number.isInteger(num)) {
//                 setError("");
//               } else {
//                 setError("Rating must be a whole number between 1 and 6.");
//               }
//             }}
//             style={{
//               width: 82,
//               padding: "0.55rem 0.4rem",
//               borderRadius: 999,
//               border: "1.5px solid var(--input-border)",
//               background: "var(--input-bg)",
//               color: "var(--text-main)",
//               fontSize: "1.1rem",
//               textAlign: "center",
//               outline: "none",
//             }}
//           />
//         </div>

//         {error && (
//           <div
//             style={{
//               color: "#ff6b6b",
//               fontSize: "0.82rem",
//               marginTop: "0.45rem",
//             }}
//           >
//             {error}
//           </div>
//         )}

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: "0.8rem",
//             marginTop: "1.4rem",
//           }}
//         >
//           {step > 0 && (
//             <button
//               type="button"
//               className="cta-btn"
//               style={{
//                 background: "#182418",
//                 color: "#e6fbe9",
//                 fontWeight: 600,
//                 borderRadius: 999,
//                 padding: "0.55rem 1.9rem",
//               }}
//               onClick={handleBack}
//             >
//               Back
//             </button>
//           )}
//           <button
//             type="button"
//             className="cta-btn"
//             style={{
//               padding: "0.55rem 2.4rem",
//               borderRadius: 999,
//               fontWeight: 650,
//             }}
//             onClick={handleNext}
//           >
//             {step < total - 1 ? "Next" : "Get Results"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// src/quiz/CareerOrientationsPage.js


import React, { useState, useEffect } from "react";
import { ALL_TESTS } from "../data/allTests";
import getApiBaseUrl from "../utils/api";
import { useNavigate } from "react-router-dom";
const TEST_ID = "career-anchor";

const CAREER_ANCHORS = {
  AU: "Autonomy/Independence",
  SE: "Security/Stability",
  TF: "Technical/Functional",
  GM: "General Management",
  EC: "Entrepreneurial Creativity",
  SV: "Service/Dedication",
  CH: "Pure Challenge",
  LS: "Lifestyle",
};

const QUESTIONS = [
  "I dream of being so good at what I do that my expert advice will be sought continually",
  "I am most fulfilled in my work when I have been able to integrate and manage the efforts of others",
  "I dream of having career that will allow me the freedom to do a job my own way and on my own schedule",
  "Security and stability are more important to me than freedom and autonomy",
  "I am always on the lookout for ideas that would permit me to start my own enterprise",
  "I will feel successful in my career only if I have a feeling of having made a real contribution to the welfare of society",
  "I dream of a career in which I can solve problems or win out in situations that are extremely challenging",
  "I would rather leave my organization than to be put in a job that would compromise my ability to pursue personal and family concerns",
  "I will feel successful in my career only if I can develop technical or functional skills to a very high level competence",
  "I dream of being in charge of a complex organization and making decisions that affect many people",
  "I am most fulfilled in my work when I am completely free to define my own tasks, schedules and procedures",
  "I would rather leave my organization altogether than accept an assignment that would jeopardize my security in that organization",
  "Building my own business is more important to me than achieving a high-level managerial position in someone else's organization",
  "I am most fulfilled in my career when I have been able to use my talents in the service of others",
  "I will feel successful in my career only if I face and overcome very difficult challenges",
  "I dream of a career that will permit me to integrate my personal, family, and work needs",
  "Becoming a senior functional manager in my area of expertise is more attractive to me than becoming a general manager",
  "I will feel successful in my career only if I become a general manager in some organization",
  "I will feel successful in my career only if I achieve complete autonomy and freedom",
  "I seek jobs in organizations that will give me a sense of security and stability",
  "I am most fulfilled in my career when I have been able to build something that is entirely the result of my own ideas and efforts",
  "Using my skills to make the world a better place to live and work is more important to me than achieving a high-level managerial position",
  "I have been most fulfilled in my career when I have solved seemingly unsolvable problems or won out over seemingly impossible odds",
  "I feel successful in life only if I have been able to balance my personal, family, and career requirements",
  "I would rather leave my organization than accept a rotational assignments that would take me out of my area of expertise",
  "Becoming a general manager is more attractive to me than becoming a senior functional manager in my current area of expertise",
  "The chance to do a job my own way, free of rules and constraints, is more important to me than security",
  "I am most fulfilled in my work when I feel that I have complete financial and employment security",
  "I will feel successful in my career only if I succeed in creating or building something that is entirely my own product or idea",
  "I dream of having a career that makes a real contribution to humanity and society",
  "I seek out work opportunities that strongly challenge my problem solving and/or competitive skills",
  "Balancing the demands of personal and professional life is more important to me than achieving a high-level managerial position",
  "I am most fulfilled in my work when I have been able to use my special skills and talents",
  "I would rather leave my organization than accept a job that would take me away from the general managerial track",
  "I would rather leave my organization than accept a job that would reduce my autonomy and freedom",
  "I dream of having a career that will allow me to feel a sense of security and stability",
  "I dream of starting up and building my own business",
  "I would rather leave my organization than accept an assignment that would undermine my ability to be of service to others",
  "Working on problems that are almost unsolvable is more important to me than achieving a high-level managerial position",
  "I have always sought out work opportunities that minimize interference with personal or family concerns",
];

const QUESTION_MAPPING = {
  2: "AU", 10: "AU", 18: "AU", 26: "AU", 34: "AU",
  3: "SE", 11: "SE", 19: "SE", 27: "SE", 35: "SE",
  0: "TF", 16: "TF", 24: "TF", 32: "TF",
  1: "GM", 9: "GM", 17: "GM", 25: "GM", 33: "GM",
  4: "EC", 12: "EC", 20: "EC", 28: "EC", 36: "EC",
  5: "SV", 13: "SV", 21: "SV", 29: "SV", 37: "SV",
  6: "CH", 14: "CH", 22: "CH", 30: "CH", 38: "CH",
  7: "LS", 15: "LS", 23: "LS", 31: "LS", 39: "LS",
};

function scoreCareerAnchor(answersByIndex) {
  const scores = { AU: 0, SE: 0, TF: 0, GM: 0, EC: 0, SV: 0, CH: 0, LS: 0 };

  answersByIndex.forEach((value, index) => {
    if (value === "" || value === undefined) return;

    const anchor = QUESTION_MAPPING[index];
    if (!anchor) return;

    scores[anchor] += Number(value); // ✅ FIX
  });

  const topAnchors = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return { scores, topAnchors };
}

function ThemeFixesCSS() {
  return (
    <style>{`
      input.rating-input::-webkit-outer-spin-button,
      input.rating-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input.rating-input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
      }
      body:not(.dark) [style*="text-muted"],
      :not(body.dark) [style*="text-muted"] {
        color: rgba(0, 0, 0, 0.75) !important;
      }
      body:not(.dark) [style*="0.78rem"],
      :not(body.dark) [style*="0.78rem"] {
        color: rgba(0, 0, 0, 0.65) !important;
      }
      body.dark [style*="text-muted"] {
        color: #b4bebd !important;
      }
    `}</style>
  );
}

export default function CareerOrientationsPage() {
  const navigate = useNavigate();
  const test = ALL_TESTS.find((t) => t.id === TEST_ID);
  const questionList = QUESTIONS;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  if (!test) {
    return <div className="quiz-page">Test not found.</div>;
  }

  const total = questionList.length;
  const progress = Math.round(((step + 1) / total) * 100);

  const API_URL = getApiBaseUrl();

  const saveTestResult = async (scoredResult) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
        body: JSON.stringify({
          testName: test?.name || "Career Anchors Test",
          result: {
            scores: scoredResult.scores,        // ✅ detailed scores
            topAnchors: scoredResult.topAnchors // ✅ top 3
          }
        }),
      });

      const data = await res.json();
      console.log("✅ Saved Career Result:", data);

    } catch (err) {
      console.error("❌ Failed to save Career result:", err);
    }
  };

  const validateCurrent = () => {
    const val = Number(answers[step]);

    if (answers[step] === "" || answers[step] === undefined) {
      setError("Please enter a rating from 1 to 6.");
      return false;
    }

    if (!Number.isInteger(val) || val < 1 || val > 6) {
      setError("Rating must be a whole number between 1 and 6.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateCurrent()) return;

    if (step < total - 1) {
   setStep((s) => s + 1);
window.scrollTo(0, 0);
    } else {
      const answersByIndex = Array.from({ length: total }, (_, i) => answers[i]);
      const scored = scoreCareerAnchor(answersByIndex);
      setResult(scored);
      saveTestResult(scored);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setError("");
      setStep((s) => s - 1);
    }
  };

  // ✅ RESULT SCREEN (unchanged)
  if (result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          marginTop: "120px",
          background: "var(--bg-main)",
          padding: "2rem 1rem 3rem 1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ThemeFixesCSS />
        <div
          style={{
            background: "var(--bg-card)",
            padding: "2rem 1.8rem",
            maxWidth: 420,
            borderRadius: 20,
            boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: 750,
              fontSize: "1.45rem",
              color: "var(--text-main)",
              marginBottom: "1rem",
            }}
          >
            {test.name} – Your Career Anchors
          </div>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.94rem",
              lineHeight: 1.5,
              marginBottom: "1.5rem",
            }}
          >
            Scores are raw sums for each anchor (5–30 per anchor, higher = stronger). The highest
            scores reflect the anchors most central to your career choices.
          </p>

          {/* Top anchors layout (unchanged) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              {result.topAnchors.slice(0, 2).map(([anchor, score]) => (
                <div
                  key={anchor}
                  style={{
                    background: "linear-gradient(135deg, var(--accent), #29ff8f)",
                    color: "#021409",
                    borderRadius: 16,
                    padding: "1.4rem 1.2rem",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ fontSize: "1.05rem", marginBottom: "0.35rem", opacity: 0.9 }}>
                    {CAREER_ANCHORS[anchor]}
                  </div>
                  <div style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "0.03em" }}>
                    {score}
                  </div>
                </div>
              ))}
            </div>
            {result.topAnchors[2] && (
              <div
                style={{
                  background: "linear-gradient(135deg, var(--accent), #29ff8f)",
                  color: "#021409",
                  borderRadius: 16,
                  padding: "1.4rem 1.2rem",
                  textAlign: "center",
                  fontWeight: 600,
                  width: "220px",
                }}
              >
                <div style={{ fontSize: "1.05rem", marginBottom: "0.35rem", opacity: 0.9 }}>
                  {CAREER_ANCHORS[result.topAnchors[2][0]]}
                </div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "0.03em" }}>
                  {result.topAnchors[2][1]}
                </div>
              </div>
            )}
          </div>

          <div style={{ overflowX: "auto", marginTop: "0.3rem" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "var(--table-bg)",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid var(--table-border)",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(0,255,135,0.22)", color: "var(--btn-text)" }}>
                  <th style={{ padding: "0.85rem 0.9rem", textAlign: "left", fontSize: "0.9rem", fontWeight: 600 }}>
                    Anchor
                  </th>
                  <th style={{ padding: "0.85rem 0.9rem", textAlign: "center", fontSize: "0.9rem", fontWeight: 600 }}>
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CAREER_ANCHORS).map(([key, label]) => (
                  <tr key={key} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "0.7rem 0.9rem", fontSize: "0.9rem", color: "var(--text-main)" }}>
                      {label}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 0.9rem",
                        textAlign: "center",
                        fontWeight: 650,
                        color: result.topAnchors[0][0] === key ? "var(--accent)" : "var(--text-main)",
                      }}
                    >
                      {result.scores[key]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* ✅ SUCCESS MESSAGE */}
<div style={{
  marginTop: "1rem",
  fontSize: "0.9rem",
  color: "var(--accent)",
  textAlign: "center"
}}>
  ✅ Result saved to your profile!
</div>

{/* ✅ GREEN BUTTON */}
<button
  onClick={() => navigate("/profile")}
  style={{
    marginTop: "12px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#19fd91",
    color: "#000",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "0.2s ease"
  }}
  onMouseOver={(e) => (e.target.style.opacity = "0.85")}
  onMouseOut={(e) => (e.target.style.opacity = "1")}
>
  View in Profile →
</button>
        </div>
      </div>
    );
  }

  // ✅ QUESTION SCREEN – updated with title in one line, reduced top spacing, and description box
  const currentValue =
    answers[step] === undefined || answers[step] === null ? "" : answers[step];

  return (
    <div
      style={{
        minHeight: "100vh",
        marginTop: "120px",
        background: "var(--bg-main)",
        padding: "2rem 1rem 3.5rem 1rem",
      }}
    >
      <ThemeFixesCSS />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            padding: "1.5rem 2.5rem 3rem 2.5rem", // reduced top padding
            width: "100%",
            maxWidth: 600, // increased width to accommodate title
            borderRadius: 20,
            boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            gap: "1.8rem",
          }}
        >
          {/* Title – adjusted font size to fit in one line */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--text-main)",
              textAlign: "center",
              margin: 0, // remove default margins
              lineHeight: 1.2,
            }}
          >
            {test.name}
          </h1>

          {/* Description Box (styled div) */}
          <div
            style={{
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "12px",
              padding: "0.8rem 1rem",
              color: "var(--text-muted)",
              fontSize: "1.05rem",
              lineHeight: "1.6",
            }}
          >
            Discover your career anchors based on your work preferences and values.
            <br />
            This assessment helps you understand what motivates you in your career.
          </div>

          {/* Original instruction block */}
          <div
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            For each statement, type a number from 1 to 6: 1 = never true, 2–3 =
            occasionally true, 4–5 = often true, 6 = always true.
          </div>

          <div
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
            }}
          >
            Question {step + 1} of {total}
          </div>

          <div
            style={{
              height: 10,
              background: "rgba(33,46,35,0.7)",
              borderRadius: 6,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, var(--accent), #29ff8f)",
                transition: "width 0.25s ease",
              }}
            />
          </div>

          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--text-main)",
              lineHeight: 1.5,
            }}
          >
            {questionList[step]}
          </div>

          <div
            style={{
              marginTop: "0.8rem",
              padding: "0.9rem 1.1rem",
              borderRadius: 14,
              background: "var(--panel-bg)",
              border: "1px solid var(--panel-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                }}
              >
                Rating (1–6)
              </span>
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                  opacity: 0.8,
                }}
              >
                Use whole numbers only.
              </span>
            </div>
           <div
  style={{
    display: "flex",
    gap: "0.6rem",
    justifyContent: "center",
    flexWrap: "wrap",
  }}
>
  {[1, 2, 3, 4, 5, 6].map((num) => (
    <button
      key={num}
      onClick={() => {
        setAnswers((a) => ({ ...a, [step]: num }));
        setError("");
      }}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        border:
          answers[step] === num
            ? "2px solid #19fd91"
            : "2px solid #2a3d2f",
        background:
          answers[step] === num ? "#19fd91" : "#10241a",
        color: answers[step] === num ? "#000" : "#fff",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {num}
    </button>
  ))}
</div>
          </div>

          {error && (
            <div
              style={{
                color: "#ff6b6b",
                fontSize: "0.82rem",
                marginTop: "0.45rem",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {step > 0 && (
              <button
                type="button"
                className="cta-btn"
                style={{
                  background: "#182418",
                  color: "#e6fbe9",
                  fontWeight: 600,
                  borderRadius: 12,
                  padding: "0.6rem 2.2rem",
                }}
                onClick={handleBack}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className="cta-btn"
              style={{
                padding: "0.6rem 2.2rem",
                borderRadius: 12,
              }}
              onClick={handleNext}
            >
              {step < total - 1 ? "Next" : "Get Results"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}