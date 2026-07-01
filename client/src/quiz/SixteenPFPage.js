// // src/quiz/SixteenPFPage.js
// import React, { useState } from "react";
// import { ALL_TESTS } from "../data/allTests";
// import getApiBaseUrl from "../utils/api"; 

// const TEST_ID = "16pf";

// // Each factor gets a short code and label
// const FACTORS = {
//   A: "Warmth",
//   B: "Reasoning",
//   C: "Emotional Stability",
//   E: "Dominance",
//   F: "Liveliness",
//   G: "Rule‑Consciousness",
//   H: "Social Boldness",
//   I: "Sensitivity",
//   L: "Vigilance",
//   M: "Abstractedness",
//   N: "Privateness",
//   O: "Apprehension",
//   Q1: "Openness to Change",
//   Q2: "Self‑Reliance",
//   Q3: "Perfectionism",
//   Q4: "Tension",
// };

// // Common options (you can adjust labels)
// const OPTIONS = [
//   "Strongly Disagree",
//   "Disagree",
//   "Neutral",
//   "Agree",
//   "Strongly Agree",
// ];

// const QUESTIONS = [
//   { id: 1, factor: "A", reverse: false, text: "I take time out for others.", options: OPTIONS },
//   { id: 2, factor: "H", reverse: false, text: "I know that I am not a special person.", options: OPTIONS },
//   { id: 3, factor: "E", reverse: false, text: "I take control of things.", options: OPTIONS },
//   { id: 4, factor: "C", reverse: false, text: "I try to forgive and forget.", options: OPTIONS },
//   { id: 5, factor: "A", reverse: true, text: "I keep in the background.", options: OPTIONS },
//   { id: 6, factor: "A", reverse: false, text: "I can't do without the company of others.", options: OPTIONS },
//   { id: 7, factor: "L", reverse: false, text: "I trust others.", options: OPTIONS },
//   { id: 8, factor: "C", reverse: false, text: "I am not easily frustrated.", options: OPTIONS },
//   { id: 9, factor: "F", reverse: false, text: "I cheer people up.", options: OPTIONS },
//   { id: 10, factor: "H", reverse: true, text: "I often feel uncomfortable around others.", options: OPTIONS },
//   { id: 11, factor: "C", reverse: false, text: "I seldom feel blue.", options: OPTIONS },
//   { id: 12, factor: "O", reverse: true, text: "I dislike myself.", options: OPTIONS },
//   { id: 13, factor: "E", reverse: false, text: "I take charge.", options: OPTIONS },
//   { id: 14, factor: "E", reverse: true, text: "I let others make the decisions.", options: OPTIONS },
//   { id: 15, factor: "M", reverse: false, text: "I believe in the importance of art.", options: OPTIONS },
//   { id: 16, factor: "M", reverse: false, text: "I like to get lost in thought.", options: OPTIONS },
//   { id: 17, factor: "E", reverse: true, text: "I wait for others to lead the way.", options: OPTIONS },
//   { id: 18, factor: "F", reverse: false, text: "I am willing to talk about myself.", options: OPTIONS },
//   { id: 19, factor: "H", reverse: true, text: "I find it difficult to approach others.", options: OPTIONS },
//   { id: 20, factor: "N", reverse: false, text: "I enjoy my privacy.", options: OPTIONS },
//   { id: 21, factor: "Q1", reverse: false, text: "I swim against the current.", options: OPTIONS },
//   { id: 22, factor: "Q4", reverse: true, text: "I feel guilty when I say 'no.'", options: OPTIONS },
//   { id: 23, factor: "A", reverse: true, text: "I am hard to get to know.", options: OPTIONS },
//   { id: 24, factor: "A", reverse: true, text: "I don't talk a lot.", options: OPTIONS },
//   { id: 25, factor: "Q3", reverse: false, text: "I believe in one true religion.", options: OPTIONS },
//   { id: 26, factor: "C", reverse: false, text: "I am not easily annoyed.", options: OPTIONS },
//   { id: 27, factor: "Q4", reverse: true, text: "I feel crushed by setbacks.", options: OPTIONS },
//   { id: 28, factor: "O", reverse: true, text: "I am afraid that I will do the wrong thing.", options: OPTIONS },
//   { id: 29, factor: "F", reverse: false, text: "I enjoy being part of a loud crowd.", options: OPTIONS },
//   { id: 30, factor: "Q1", reverse: false, text: "I weigh the pros against the cons.", options: OPTIONS },
//   { id: 31, factor: "M", reverse: false, text: "I do unexpected things.", options: OPTIONS },
//   { id: 32, factor: "C", reverse: true, text: "I get angry easily.", options: OPTIONS },
//   { id: 33, factor: "H", reverse: true, text: "I am quiet around strangers.", options: OPTIONS },
//   { id: 34, factor: "N", reverse: false, text: "I don't mind eating alone.", options: OPTIONS },
//   { id: 35, factor: "A", reverse: false, text: "I make people feel at ease.", options: OPTIONS },
//   { id: 36, factor: "B", reverse: false, text: "I use my brain.", options: OPTIONS },
//   { id: 37, factor: "A", reverse: false, text: "I have a good word for everyone.", options: OPTIONS },
//   { id: 38, factor: "O", reverse: true, text: "I feel desperate.", options: OPTIONS },
//   { id: 39, factor: "E", reverse: false, text: "I want to be in charge.", options: OPTIONS },
//   { id: 40, factor: "H", reverse: false, text: "I feel comfortable around people.", options: OPTIONS },
//   { id: 41, factor: "F", reverse: false, text: "I am the life of the party.", options: OPTIONS },
//   { id: 42, factor: "C", reverse: false, text: "I don't let others discourage me.", options: OPTIONS },
//   { id: 43, factor: "A", reverse: false, text: "I enjoy being part of a group.", options: OPTIONS },
//   { id: 44, factor: "M", reverse: false, text: "I love to daydream.", options: OPTIONS },
//   { id: 45, factor: "L", reverse: true, text: "I distrust people.", options: OPTIONS },
//   { id: 46, factor: "O", reverse: true, text: "I worry about things.", options: OPTIONS },
//   { id: 47, factor: "C", reverse: false, text: "I am not easily bothered by things.", options: OPTIONS },
//   { id: 48, factor: "G", reverse: false, text: "I respect authority.", options: OPTIONS },
//   { id: 49, factor: "M", reverse: false, text: "I do things that others find strange.", options: OPTIONS },
//   { id: 50, factor: "B", reverse: true, text: "I skip difficult words while reading.", options: OPTIONS },
//   { id: 51, factor: "O", reverse: false, text: "I feel comfortable with myself.", options: OPTIONS },
//   { id: 52, factor: "Q3", reverse: false, text: "I am exacting in my work.", options: OPTIONS },
//   { id: 53, factor: "B", reverse: false, text: "I tend to analyze things.", options: OPTIONS },
//   { id: 54, factor: "Q3", reverse: false, text: "I continue until everything is perfect.", options: OPTIONS },
//   { id: 55, factor: "G", reverse: false, text: "I believe that people are basically moral.", options: OPTIONS },
//   { id: 56, factor: "L", reverse: true, text: "I am quick to judge others.", options: OPTIONS },
//   { id: 57, factor: "C", reverse: false, text: "I am relaxed most of the time.", options: OPTIONS },
//   { id: 58, factor: "Q2", reverse: false, text: "I enjoy silence.", options: OPTIONS },
//   { id: 59, factor: "A", reverse: false, text: "I show my feelings.", options: OPTIONS },
//   { id: 60, factor: "L", reverse: true, text: "I judge people by their appearance.", options: OPTIONS },
//   { id: 61, factor: "Q1", reverse: false, text: "I prefer variety to routine.", options: OPTIONS },
//   { id: 62, factor: "G", reverse: true, text: "I never challenge things.", options: OPTIONS },
//   { id: 63, factor: "E", reverse: false, text: "I can't stand being contradicted.", options: OPTIONS },
//   { id: 64, factor: "A", reverse: true, text: "I try not to think about the needy.", options: OPTIONS },
//   { id: 65, factor: "Q4", reverse: true, text: "I am easily put out.", options: OPTIONS },
//   { id: 66, factor: "Q2", reverse: false, text: "I prefer to do things by myself.", options: OPTIONS },
//   { id: 67, factor: "C", reverse: true, text: "I get irritated easily.", options: OPTIONS },
//   { id: 68, factor: "B", reverse: false, text: "I know the answers to many questions.", options: OPTIONS },
//   { id: 69, factor: "L", reverse: false, text: "I trust what people say.", options: OPTIONS },
//   { id: 70, factor: "G", reverse: false, text: "I like to stand during the national anthem.", options: OPTIONS },
//   { id: 71, factor: "I", reverse: false, text: "I love flowers.", options: OPTIONS },
//   { id: 72, factor: "A", reverse: true, text: "I find it hard to forgive others.", options: OPTIONS },
//   { id: 73, factor: "Q3", reverse: true, text: "I leave my belongings around.", options: OPTIONS },
//   { id: 74, factor: "I", reverse: false, text: "I feel others' emotions.", options: OPTIONS },
//   { id: 75, factor: "E", reverse: true, text: "I let myself be pushed around.", options: OPTIONS },
//   { id: 76, factor: "H", reverse: true, text: "I don't like crowded events.", options: OPTIONS },
//   { id: 77, factor: "Q1", reverse: false, text: "I enjoy hearing new ideas.", options: OPTIONS },
//   { id: 78, factor: "F", reverse: false, text: "I act wild and crazy.", options: OPTIONS },
//   { id: 79, factor: "B", reverse: false, text: "I read a lot.", options: OPTIONS },
//   { id: 80, factor: "G", reverse: false, text: "I try to follow the rules.", options: OPTIONS },
//   { id: 81, factor: "M", reverse: false, text: "I enjoy wild flights of fantasy.", options: OPTIONS },
//   { id: 82, factor: "G", reverse: true, text: "I use swear words.", options: OPTIONS },
//   { id: 83, factor: "C", reverse: false, text: "I don't worry about things that have already happened.", options: OPTIONS },
//   { id: 84, factor: "E", reverse: false, text: "I say what I think.", options: OPTIONS },
//   { id: 85, factor: "O", reverse: true, text: "I am easily hurt.", options: OPTIONS },
//   { id: 86, factor: "Q2", reverse: false, text: "I enjoy spending time by myself.", options: OPTIONS },
//   { id: 87, factor: "H", reverse: false, text: "I don't mind being the center of attention.", options: OPTIONS },
//   { id: 88, factor: "M", reverse: true, text: "I seldom get lost in thought.", options: OPTIONS },
//   { id: 89, factor: "M", reverse: true, text: "I seldom daydream.", options: OPTIONS },
//   { id: 90, factor: "L", reverse: true, text: "I suspect hidden motives in others.", options: OPTIONS },
//   { id: 91, factor: "Q1", reverse: true, text: "I am not interested in abstract ideas.", options: OPTIONS },
//   { id: 92, factor: "O", reverse: true, text: "I am easily discouraged.", options: OPTIONS },
//   { id: 93, factor: "E", reverse: false, text: "I am not afraid of providing criticism.", options: OPTIONS },
//   { id: 94, factor: "N", reverse: false, text: "I disclose my intimate thoughts.", options: OPTIONS },
//   { id: 95, factor: "F", reverse: true, text: "I don't like action movies.", options: OPTIONS },
//   { id: 96, factor: "Q3", reverse: false, text: "I want everything to be 'just right.'", options: OPTIONS },
//   { id: 97, factor: "O", reverse: true, text: "I feel threatened easily.", options: OPTIONS },
//   { id: 98, factor: "F", reverse: true, text: "I am the last to laugh at a joke.", options: OPTIONS },
//   { id: 99, factor: "A", reverse: false, text: "I enjoy discussing movies and books with others.", options: OPTIONS },
//   { id: 100, factor: "F", reverse: false, text: "I joke around a lot.", options: OPTIONS },
//   { id: 101, factor: "B", reverse: true, text: "I have a poor vocabulary.", options: OPTIONS },
//   { id: 102, factor: "F", reverse: true, text: "I dislike loud music.", options: OPTIONS },
//   { id: 103, factor: "B", reverse: false, text: "I make insightful remarks.", options: OPTIONS },
//   { id: 104, factor: "A", reverse: false, text: "I enjoy bringing people together.", options: OPTIONS },
//   { id: 105, factor: "Q3", reverse: false, text: "I get chores done right away.", options: OPTIONS },
//   { id: 106, factor: "B", reverse: false, text: "I reflect on things before acting.", options: OPTIONS },
//   { id: 107, factor: "Q3", reverse: true, text: "I am not bothered by disorder.", options: OPTIONS },
//   { id: 108, factor: "A", reverse: true, text: "I don't like to get involved in other people's problems.", options: OPTIONS },
//   { id: 109, factor: "G", reverse: true, text: "I break rules.", options: OPTIONS },
//   { id: 110, factor: "E", reverse: false, text: "I can take strong measures.", options: OPTIONS },
//   { id: 111, factor: "H", reverse: false, text: "I love large parties.", options: OPTIONS },
//   { id: 112, factor: "M", reverse: true, text: "I do not like poetry.", options: OPTIONS },
//   { id: 113, factor: "L", reverse: false, text: "I believe that others have good intentions.", options: OPTIONS },
//   { id: 114, factor: "Q3", reverse: true, text: "I leave a mess in my room.", options: OPTIONS },
//   { id: 115, factor: "Q3", reverse: true, text: "I put off unpleasant tasks.", options: OPTIONS },
//   { id: 116, factor: "G", reverse: true, text: "I oppose authority.", options: OPTIONS },
//   { id: 117, factor: "G", reverse: true, text: "I resist authority.", options: OPTIONS },
//   { id: 118, factor: "C", reverse: false, text: "I readily overcome setbacks.", options: OPTIONS },
//   { id: 119, factor: "B", reverse: true, text: "I get confused easily.", options: OPTIONS },
//   { id: 120, factor: "A", reverse: false, text: "I know how to comfort others.", options: OPTIONS },
//   { id: 121, factor: "N", reverse: false, text: "I am open about my feelings.", options: OPTIONS },
//   { id: 122, factor: "I", reverse: true, text: "I rarely notice my emotional reactions.", options: OPTIONS },
//   { id: 123, factor: "F", reverse: false, text: "I amuse my friends.", options: OPTIONS },
//   { id: 124, factor: "Q1", reverse: false, text: "I love to think up new ways of doing things.", options: OPTIONS },
//   { id: 125, factor: "M", reverse: true, text: "I dislike works of fiction.", options: OPTIONS },
//   { id: 126, factor: "I", reverse: true, text: "I do not enjoy watching dance performances.", options: OPTIONS },
//   { id: 127, factor: "H", reverse: false, text: "I start conversations.", options: OPTIONS },
//   { id: 128, factor: "A", reverse: false, text: "I make friends easily.", options: OPTIONS },
//   { id: 129, factor: "O", reverse: true, text: "I often feel blue.", options: OPTIONS },
//   { id: 130, factor: "E", reverse: false, text: "I counter others' arguments.", options: OPTIONS },
//   { id: 131, factor: "Q1", reverse: true, text: "I am not interested in theoretical discussions.", options: OPTIONS },
//   { id: 132, factor: "Q2", reverse: false, text: "I seek quiet.", options: OPTIONS },
//   { id: 133, factor: "O", reverse: true, text: "I have frequent mood swings.", options: OPTIONS },
//   { id: 134, factor: "B", reverse: false, text: "I learn quickly.", options: OPTIONS },
//   { id: 135, factor: "Q1", reverse: true, text: "I rarely look for a deeper meaning in things.", options: OPTIONS },
//   { id: 136, factor: "B", reverse: false, text: "I like to read.", options: OPTIONS },
//   { id: 137, factor: "N", reverse: true, text: "I keep my thoughts to myself.", options: OPTIONS },
//   { id: 138, factor: "A", reverse: true, text: "I try to avoid complex people.", options: OPTIONS },
//   { id: 139, factor: "N", reverse: true, text: "I reveal little about myself.", options: OPTIONS },
//   { id: 140, factor: "Q3", reverse: true, text: "I am not bothered by messy people.", options: OPTIONS },
//   { id: 141, factor: "H", reverse: true, text: "I consider myself an average person.", options: OPTIONS },
//   { id: 142, factor: "Q3", reverse: false, text: "I like order.", options: OPTIONS },
//   { id: 143, factor: "Q1", reverse: true, text: "I avoid philosophical discussions.", options: OPTIONS },
//   { id: 144, factor: "O", reverse: true, text: "I am annoyed by others' mistakes.", options: OPTIONS },
//   { id: 145, factor: "I", reverse: false, text: "I cry during movies.", options: OPTIONS },
//   { id: 146, factor: "A", reverse: true, text: "I am not really interested in others.", options: OPTIONS },
//   { id: 147, factor: "L", reverse: true, text: "I believe that people are essentially evil.", options: OPTIONS },
//   { id: 148, factor: "G", reverse: true, text: "I know how to get around the rules.", options: OPTIONS },
//   { id: 149, factor: "F", reverse: true, text: "I seldom joke around.", options: OPTIONS },
//   { id: 150, factor: "B", reverse: false, text: "I carry the conversation to a higher level.", options: OPTIONS },
//   { id: 151, factor: "O", reverse: true, text: "I spend time thinking about past mistakes.", options: OPTIONS },
//   { id: 152, factor: "H", reverse: false, text: "I talk to a lot of different people at parties.", options: OPTIONS },
//   { id: 153, factor: "N", reverse: true, text: "I bottle up my feelings.", options: OPTIONS },
//   { id: 154, factor: "Q2", reverse: false, text: "I want to be left alone.", options: OPTIONS },
//   { id: 155, factor: "A", reverse: false, text: "I take an interest in other people's lives.", options: OPTIONS },
//   { id: 156, factor: "L", reverse: true, text: "I am wary of others.", options: OPTIONS },
//   { id: 157, factor: "A", reverse: false, text: "I enjoy teamwork.", options: OPTIONS },
//   { id: 158, factor: "A", reverse: true, text: "I have little to say.", options: OPTIONS },
//   { id: 159, factor: "G", reverse: false, text: "I believe laws should be strictly enforced.", options: OPTIONS },
//   { id: 160, factor: "G", reverse: false, text: "I do things by the book.", options: OPTIONS },
//   { id: 161, factor: "N", reverse: false, text: "I am open about my feelings.", options: OPTIONS },
//   { id: 162, factor: "L", reverse: true, text: "I believe that people seldom tell you the whole truth.", options: OPTIONS },
//   { id: 163, factor: "Q1", reverse: false, text: "I take deviant positions.", options: OPTIONS },
// ];

// // Map option text → numeric score 1–5
// function optionToValue(opt) {
//   const idx = OPTIONS.indexOf(opt);
//   return idx === -1 ? 0 : idx + 1;
// }

// // Simple scoring: average 1–5 per factor, with basic qualitative labels
// function scoreSixteenPF(answers) {
//   const sums = {};
//   const counts = {};

//   QUESTIONS.forEach((q, index) => {
//     const rawOpt = answers[index];
//     if (!rawOpt) return;

//     const raw = optionToValue(rawOpt);
//     if (!raw) return;

//     const value = q.reverse ? 6 - raw : raw; // reverse 1–5
//     if (!sums[q.factor]) {
//       sums[q.factor] = 0;
//       counts[q.factor] = 0;
//     }
//     sums[q.factor] += value;
//     counts[q.factor] += 1;
//   });

//   const averages = {};
//   Object.keys(FACTORS).forEach((code) => {
//     if (counts[code]) {
//       averages[code] = +(sums[code] / counts[code]).toFixed(2);
//     } else {
//       averages[code] = null;
//     }
//   });

//   const describe = (avg) => {
//     if (avg == null) return "Not enough data";
//     if (avg >= 4) return "High";
//     if (avg >= 3) return "Average";
//     return "Low";
//   };

//   const descriptions = {};
//   Object.keys(FACTORS).forEach((code) => {
//     descriptions[code] = describe(averages[code]);
//   });

//   return { averages, descriptions };
// }

// export default function SixteenPFPage() {
//   const test = ALL_TESTS.find((t) => t.id === TEST_ID);
//   const questionList = QUESTIONS;

//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);

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
//           testName: test?.name || "16PF Test",
//           result: scoredResult
//         })
//       });
//       console.log("✅ 16PF Result saved!");
//     } catch (err) {
//       console.error("❌ Failed to save 16PF result:", err);
//     }
//   };
//   // ---------------------------------------------

//   const handleNext = () => {
//     if (!answers[step]) return;
//     if (step < total - 1) {
//       setStep((s) => s + 1);
//     } else {
//       const scored = scoreSixteenPF(answers);
//       setResult(scored);
//       saveTestResult(scored); // <--- TRIGGER SAVE
//     }
//   };

//   const handleBack = () => {
//     if (step > 0) setStep((s) => s - 1);
//   };

//   if (!test) {
//     return <div className="quiz-page">Test not found.</div>;
//   }

//   // Result view
//   if (result) {
//     return (
//      <div
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

//         <div
//           style={{
//             background: "var(--bg-card)",
//             padding: "3rem 2.5rem",
//             minWidth: 350,
//             maxWidth: 720,
//             borderRadius: 20,
//             boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
//             display: "flex",
//             flexDirection: "column",
//             gap: "1.5rem",
//           }}
//         >
//           <div
//             style={{
//               fontWeight: 700,
//               fontSize: "1.35rem",
//               color: "var(--text-main)",
//               textAlign: "center",
//             }}
//           >
//             {test.name} – Profile Summary
//           </div>

//           <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
//             Scores are shown on a 1–5 scale for each of the sixteen factors.
//             Higher scores mean you show more of that trait.
//           </p>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//               gap: "0.9rem 1.4rem",
//             }}
//           >
//             {Object.keys(FACTORS).map((code) => (
//               <div
//                 key={code}
//                 style={{
//                   background: "var(--bg-accent)",
//                   borderRadius: 12,
//                   padding: "0.75rem 0.9rem",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "0.1rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontWeight: 650,
//                     fontSize: "0.98rem",
//                     color: "var(--text-main)",
//                   }}
//                 >
//                   {code} – {FACTORS[code]}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "0.9rem",
//                     color: "var(--text-muted)",
//                   }}
//                 >
//                   Score: {result.averages[code] ?? "–"} (
//                   {result.descriptions[code]})
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)", textAlign: "center" }}>
//             ✅ Result saved to your profile!
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Question view
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
//       <div
//         style={{
//           background: "var(--bg-card)",
//           padding: "3rem 2.5rem",
//           minWidth: 350,
//           maxWidth: 540,
//           borderRadius: 20,
//           boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
//           display: "flex",
//           flexDirection: "column",
//           gap: "1.8rem",
//         }}
//       >
//         <div
//           style={{
//             fontWeight: 700,
//             fontSize: "1.35rem",
//             color: "var(--text-main)",
//           }}
//         >
//           {test.name}
//         </div>
//         <div
//           style={{
//             color: "var(--text-muted)",
//             fontSize: "1rem",
//             marginBottom: "1rem",
//           }}
//         >
//           Question {step + 1} of {total}
//         </div>
//         <div
//           style={{
//             height: 10,
//             background: "rgba(25, 253, 145, 0.1)",
//             borderRadius: 6,
//             overflow: "hidden",
//             marginBottom: "1.5rem",
//             width: "100%",
//           }}
//         >
//           <div
//             style={{
//               width: `${progress}%`,
//               height: "100%",
//               background: "var(--accent)",
//               transition: "width 0.3s ease",
//             }}
//           />
//         </div>
//         <div
//           style={{
//             fontSize: "1.25rem",
//             fontWeight: 600,
//             color: "var(--text-main)",
//           }}
//         >
//           {questionList[step].text}
//         </div>
//         <form
//           style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//         >
//           {questionList[step].options.map((opt) => (
//             <label
//               key={opt}
//               style={{
//                 background:
//                   answers[step] === opt ? "var(--accent)" : "var(--bg-accent)",
//                 color:
//                   answers[step] === opt
//                     ? "var(--btn-text)"
//                     : "var(--text-main)",
//                 border: `2px solid ${answers[step] === opt
//                   ? "var(--accent)"
//                   : "var(--input-border)"
//                   }`,
//                 borderRadius: 10,
//                 padding: "1rem 1.5rem",
//                 cursor: "pointer",
//                 fontWeight: 550,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "1rem",
//               }}
//             >
//               <input
//                 type="radio"
//                 name={`q${step}`}
//                 value={opt}
//                 checked={answers[step] === opt}
//                 onChange={() =>
//                   setAnswers((a) => ({
//                     ...a,
//                     [step]: opt,
//                   }))
//                 }
//                 style={{
//                   marginRight: 20,
//                   accentColor: "var(--accent)",
//                   cursor: "pointer",
//                 }}
//               />
//               {opt}
//             </label>
//           ))}
//         </form>
//         <div
//           style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
//         >
//           {step > 0 && (
//             <button
//               type="button"
//               className="cta-btn"
//               style={{
//                 background: "var(--bg-accent)",
//                 color: "#fff",
//                 fontWeight: 600,
//                 borderRadius: 12,
//                 padding: "0.6rem 2.2rem",
//               }}
//               onClick={handleBack}
//             >
//               Back
//             </button>
//           )}
//           <button
//             type="button"
//             className="cta-btn"
//             style={{ padding: "0.6rem 2.2rem", borderRadius: 12 }}
//             onClick={handleNext}
//           >
//             {step < total - 1 ? "Next" : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/quiz/SixteenPFPage.js
import React, { useState, useEffect } from "react";
import { ALL_TESTS } from "../data/allTests";
import getApiBaseUrl from "../utils/api"; 

const TEST_ID = "16pf";

// Each factor gets a short code and label
const FACTORS = {
  A: "Warmth",
  B: "Reasoning",
  C: "Emotional Stability",
  E: "Dominance",
  F: "Liveliness",
  G: "Rule‑Consciousness",
  H: "Social Boldness",
  I: "Sensitivity",
  L: "Vigilance",
  M: "Abstractedness",
  N: "Privateness",
  O: "Apprehension",
  Q1: "Openness to Change",
  Q2: "Self‑Reliance",
  Q3: "Perfectionism",
  Q4: "Tension",
};

// Common options (you can adjust labels)
const OPTIONS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const QUESTIONS = [
  { id: 1, factor: "A", reverse: false, text: "I take time out for others.", options: OPTIONS },
  { id: 2, factor: "H", reverse: false, text: "I know that I am not a special person.", options: OPTIONS },
  { id: 3, factor: "E", reverse: false, text: "I take control of things.", options: OPTIONS },
  { id: 4, factor: "C", reverse: false, text: "I try to forgive and forget.", options: OPTIONS },
  { id: 5, factor: "A", reverse: true, text: "I keep in the background.", options: OPTIONS },
  { id: 6, factor: "A", reverse: false, text: "I can't do without the company of others.", options: OPTIONS },
  { id: 7, factor: "L", reverse: false, text: "I trust others.", options: OPTIONS },
  { id: 8, factor: "C", reverse: false, text: "I am not easily frustrated.", options: OPTIONS },
  { id: 9, factor: "F", reverse: false, text: "I cheer people up.", options: OPTIONS },
  { id: 10, factor: "H", reverse: true, text: "I often feel uncomfortable around others.", options: OPTIONS },
  { id: 11, factor: "C", reverse: false, text: "I seldom feel blue.", options: OPTIONS },
  { id: 12, factor: "O", reverse: true, text: "I dislike myself.", options: OPTIONS },
  { id: 13, factor: "E", reverse: false, text: "I take charge.", options: OPTIONS },
  { id: 14, factor: "E", reverse: true, text: "I let others make the decisions.", options: OPTIONS },
  { id: 15, factor: "M", reverse: false, text: "I believe in the importance of art.", options: OPTIONS },
  { id: 16, factor: "M", reverse: false, text: "I like to get lost in thought.", options: OPTIONS },
  { id: 17, factor: "E", reverse: true, text: "I wait for others to lead the way.", options: OPTIONS },
  { id: 18, factor: "F", reverse: false, text: "I am willing to talk about myself.", options: OPTIONS },
  { id: 19, factor: "H", reverse: true, text: "I find it difficult to approach others.", options: OPTIONS },
  { id: 20, factor: "N", reverse: false, text: "I enjoy my privacy.", options: OPTIONS },
  { id: 21, factor: "Q1", reverse: false, text: "I swim against the current.", options: OPTIONS },
  { id: 22, factor: "Q4", reverse: true, text: "I feel guilty when I say 'no.'", options: OPTIONS },
  { id: 23, factor: "A", reverse: true, text: "I am hard to get to know.", options: OPTIONS },
  { id: 24, factor: "A", reverse: true, text: "I don't talk a lot.", options: OPTIONS },
  { id: 25, factor: "Q3", reverse: false, text: "I believe in one true religion.", options: OPTIONS },
  { id: 26, factor: "C", reverse: false, text: "I am not easily annoyed.", options: OPTIONS },
  { id: 27, factor: "Q4", reverse: true, text: "I feel crushed by setbacks.", options: OPTIONS },
  { id: 28, factor: "O", reverse: true, text: "I am afraid that I will do the wrong thing.", options: OPTIONS },
  { id: 29, factor: "F", reverse: false, text: "I enjoy being part of a loud crowd.", options: OPTIONS },
  { id: 30, factor: "Q1", reverse: false, text: "I weigh the pros against the cons.", options: OPTIONS },
  { id: 31, factor: "M", reverse: false, text: "I do unexpected things.", options: OPTIONS },
  { id: 32, factor: "C", reverse: true, text: "I get angry easily.", options: OPTIONS },
  { id: 33, factor: "H", reverse: true, text: "I am quiet around strangers.", options: OPTIONS },
  { id: 34, factor: "N", reverse: false, text: "I don't mind eating alone.", options: OPTIONS },
  { id: 35, factor: "A", reverse: false, text: "I make people feel at ease.", options: OPTIONS },
  { id: 36, factor: "B", reverse: false, text: "I use my brain.", options: OPTIONS },
  { id: 37, factor: "A", reverse: false, text: "I have a good word for everyone.", options: OPTIONS },
  { id: 38, factor: "O", reverse: true, text: "I feel desperate.", options: OPTIONS },
  { id: 39, factor: "E", reverse: false, text: "I want to be in charge.", options: OPTIONS },
  { id: 40, factor: "H", reverse: false, text: "I feel comfortable around people.", options: OPTIONS },
  { id: 41, factor: "F", reverse: false, text: "I am the life of the party.", options: OPTIONS },
  { id: 42, factor: "C", reverse: false, text: "I don't let others discourage me.", options: OPTIONS },
  { id: 43, factor: "A", reverse: false, text: "I enjoy being part of a group.", options: OPTIONS },
  { id: 44, factor: "M", reverse: false, text: "I love to daydream.", options: OPTIONS },
  { id: 45, factor: "L", reverse: true, text: "I distrust people.", options: OPTIONS },
  { id: 46, factor: "O", reverse: true, text: "I worry about things.", options: OPTIONS },
  { id: 47, factor: "C", reverse: false, text: "I am not easily bothered by things.", options: OPTIONS },
  { id: 48, factor: "G", reverse: false, text: "I respect authority.", options: OPTIONS },
  { id: 49, factor: "M", reverse: false, text: "I do things that others find strange.", options: OPTIONS },
  { id: 50, factor: "B", reverse: true, text: "I skip difficult words while reading.", options: OPTIONS },
  { id: 51, factor: "O", reverse: false, text: "I feel comfortable with myself.", options: OPTIONS },
  { id: 52, factor: "Q3", reverse: false, text: "I am exacting in my work.", options: OPTIONS },
  { id: 53, factor: "B", reverse: false, text: "I tend to analyze things.", options: OPTIONS },
  { id: 54, factor: "Q3", reverse: false, text: "I continue until everything is perfect.", options: OPTIONS },
  { id: 55, factor: "G", reverse: false, text: "I believe that people are basically moral.", options: OPTIONS },
  { id: 56, factor: "L", reverse: true, text: "I am quick to judge others.", options: OPTIONS },
  { id: 57, factor: "C", reverse: false, text: "I am relaxed most of the time.", options: OPTIONS },
  { id: 58, factor: "Q2", reverse: false, text: "I enjoy silence.", options: OPTIONS },
  { id: 59, factor: "A", reverse: false, text: "I show my feelings.", options: OPTIONS },
  { id: 60, factor: "L", reverse: true, text: "I judge people by their appearance.", options: OPTIONS },
  { id: 61, factor: "Q1", reverse: false, text: "I prefer variety to routine.", options: OPTIONS },
  { id: 62, factor: "G", reverse: true, text: "I never challenge things.", options: OPTIONS },
  { id: 63, factor: "E", reverse: false, text: "I can't stand being contradicted.", options: OPTIONS },
  { id: 64, factor: "A", reverse: true, text: "I try not to think about the needy.", options: OPTIONS },
  { id: 65, factor: "Q4", reverse: true, text: "I am easily put out.", options: OPTIONS },
  { id: 66, factor: "Q2", reverse: false, text: "I prefer to do things by myself.", options: OPTIONS },
  { id: 67, factor: "C", reverse: true, text: "I get irritated easily.", options: OPTIONS },
  { id: 68, factor: "B", reverse: false, text: "I know the answers to many questions.", options: OPTIONS },
  { id: 69, factor: "L", reverse: false, text: "I trust what people say.", options: OPTIONS },
  { id: 70, factor: "G", reverse: false, text: "I like to stand during the national anthem.", options: OPTIONS },
  { id: 71, factor: "I", reverse: false, text: "I love flowers.", options: OPTIONS },
  { id: 72, factor: "A", reverse: true, text: "I find it hard to forgive others.", options: OPTIONS },
  { id: 73, factor: "Q3", reverse: true, text: "I leave my belongings around.", options: OPTIONS },
  { id: 74, factor: "I", reverse: false, text: "I feel others' emotions.", options: OPTIONS },
  { id: 75, factor: "E", reverse: true, text: "I let myself be pushed around.", options: OPTIONS },
  { id: 76, factor: "H", reverse: true, text: "I don't like crowded events.", options: OPTIONS },
  { id: 77, factor: "Q1", reverse: false, text: "I enjoy hearing new ideas.", options: OPTIONS },
  { id: 78, factor: "F", reverse: false, text: "I act wild and crazy.", options: OPTIONS },
  { id: 79, factor: "B", reverse: false, text: "I read a lot.", options: OPTIONS },
  { id: 80, factor: "G", reverse: false, text: "I try to follow the rules.", options: OPTIONS },
  { id: 81, factor: "M", reverse: false, text: "I enjoy wild flights of fantasy.", options: OPTIONS },
  { id: 82, factor: "G", reverse: true, text: "I use swear words.", options: OPTIONS },
  { id: 83, factor: "C", reverse: false, text: "I don't worry about things that have already happened.", options: OPTIONS },
  { id: 84, factor: "E", reverse: false, text: "I say what I think.", options: OPTIONS },
  { id: 85, factor: "O", reverse: true, text: "I am easily hurt.", options: OPTIONS },
  { id: 86, factor: "Q2", reverse: false, text: "I enjoy spending time by myself.", options: OPTIONS },
  { id: 87, factor: "H", reverse: false, text: "I don't mind being the center of attention.", options: OPTIONS },
  { id: 88, factor: "M", reverse: true, text: "I seldom get lost in thought.", options: OPTIONS },
  { id: 89, factor: "M", reverse: true, text: "I seldom daydream.", options: OPTIONS },
  { id: 90, factor: "L", reverse: true, text: "I suspect hidden motives in others.", options: OPTIONS },
  { id: 91, factor: "Q1", reverse: true, text: "I am not interested in abstract ideas.", options: OPTIONS },
  { id: 92, factor: "O", reverse: true, text: "I am easily discouraged.", options: OPTIONS },
  { id: 93, factor: "E", reverse: false, text: "I am not afraid of providing criticism.", options: OPTIONS },
  { id: 94, factor: "N", reverse: false, text: "I disclose my intimate thoughts.", options: OPTIONS },
  { id: 95, factor: "F", reverse: true, text: "I don't like action movies.", options: OPTIONS },
  { id: 96, factor: "Q3", reverse: false, text: "I want everything to be 'just right.'", options: OPTIONS },
  { id: 97, factor: "O", reverse: true, text: "I feel threatened easily.", options: OPTIONS },
  { id: 98, factor: "F", reverse: true, text: "I am the last to laugh at a joke.", options: OPTIONS },
  { id: 99, factor: "A", reverse: false, text: "I enjoy discussing movies and books with others.", options: OPTIONS },
  { id: 100, factor: "F", reverse: false, text: "I joke around a lot.", options: OPTIONS },
  { id: 101, factor: "B", reverse: true, text: "I have a poor vocabulary.", options: OPTIONS },
  { id: 102, factor: "F", reverse: true, text: "I dislike loud music.", options: OPTIONS },
  { id: 103, factor: "B", reverse: false, text: "I make insightful remarks.", options: OPTIONS },
  { id: 104, factor: "A", reverse: false, text: "I enjoy bringing people together.", options: OPTIONS },
  { id: 105, factor: "Q3", reverse: false, text: "I get chores done right away.", options: OPTIONS },
  { id: 106, factor: "B", reverse: false, text: "I reflect on things before acting.", options: OPTIONS },
  { id: 107, factor: "Q3", reverse: true, text: "I am not bothered by disorder.", options: OPTIONS },
  { id: 108, factor: "A", reverse: true, text: "I don't like to get involved in other people's problems.", options: OPTIONS },
  { id: 109, factor: "G", reverse: true, text: "I break rules.", options: OPTIONS },
  { id: 110, factor: "E", reverse: false, text: "I can take strong measures.", options: OPTIONS },
  { id: 111, factor: "H", reverse: false, text: "I love large parties.", options: OPTIONS },
  { id: 112, factor: "M", reverse: true, text: "I do not like poetry.", options: OPTIONS },
  { id: 113, factor: "L", reverse: false, text: "I believe that others have good intentions.", options: OPTIONS },
  { id: 114, factor: "Q3", reverse: true, text: "I leave a mess in my room.", options: OPTIONS },
  { id: 115, factor: "Q3", reverse: true, text: "I put off unpleasant tasks.", options: OPTIONS },
  { id: 116, factor: "G", reverse: true, text: "I oppose authority.", options: OPTIONS },
  { id: 117, factor: "G", reverse: true, text: "I resist authority.", options: OPTIONS },
  { id: 118, factor: "C", reverse: false, text: "I readily overcome setbacks.", options: OPTIONS },
  { id: 119, factor: "B", reverse: true, text: "I get confused easily.", options: OPTIONS },
  { id: 120, factor: "A", reverse: false, text: "I know how to comfort others.", options: OPTIONS },
  { id: 121, factor: "N", reverse: false, text: "I am open about my feelings.", options: OPTIONS },
  { id: 122, factor: "I", reverse: true, text: "I rarely notice my emotional reactions.", options: OPTIONS },
  { id: 123, factor: "F", reverse: false, text: "I amuse my friends.", options: OPTIONS },
  { id: 124, factor: "Q1", reverse: false, text: "I love to think up new ways of doing things.", options: OPTIONS },
  { id: 125, factor: "M", reverse: true, text: "I dislike works of fiction.", options: OPTIONS },
  { id: 126, factor: "I", reverse: true, text: "I do not enjoy watching dance performances.", options: OPTIONS },
  { id: 127, factor: "H", reverse: false, text: "I start conversations.", options: OPTIONS },
  { id: 128, factor: "A", reverse: false, text: "I make friends easily.", options: OPTIONS },
  { id: 129, factor: "O", reverse: true, text: "I often feel blue.", options: OPTIONS },
  { id: 130, factor: "E", reverse: false, text: "I counter others' arguments.", options: OPTIONS },
  { id: 131, factor: "Q1", reverse: true, text: "I am not interested in theoretical discussions.", options: OPTIONS },
  { id: 132, factor: "Q2", reverse: false, text: "I seek quiet.", options: OPTIONS },
  { id: 133, factor: "O", reverse: true, text: "I have frequent mood swings.", options: OPTIONS },
  { id: 134, factor: "B", reverse: false, text: "I learn quickly.", options: OPTIONS },
  { id: 135, factor: "Q1", reverse: true, text: "I rarely look for a deeper meaning in things.", options: OPTIONS },
  { id: 136, factor: "B", reverse: false, text: "I like to read.", options: OPTIONS },
  { id: 137, factor: "N", reverse: true, text: "I keep my thoughts to myself.", options: OPTIONS },
  { id: 138, factor: "A", reverse: true, text: "I try to avoid complex people.", options: OPTIONS },
  { id: 139, factor: "N", reverse: true, text: "I reveal little about myself.", options: OPTIONS },
  { id: 140, factor: "Q3", reverse: true, text: "I am not bothered by messy people.", options: OPTIONS },
  { id: 141, factor: "H", reverse: true, text: "I consider myself an average person.", options: OPTIONS },
  { id: 142, factor: "Q3", reverse: false, text: "I like order.", options: OPTIONS },
  { id: 143, factor: "Q1", reverse: true, text: "I avoid philosophical discussions.", options: OPTIONS },
  { id: 144, factor: "O", reverse: true, text: "I am annoyed by others' mistakes.", options: OPTIONS },
  { id: 145, factor: "I", reverse: false, text: "I cry during movies.", options: OPTIONS },
  { id: 146, factor: "A", reverse: true, text: "I am not really interested in others.", options: OPTIONS },
  { id: 147, factor: "L", reverse: true, text: "I believe that people are essentially evil.", options: OPTIONS },
  { id: 148, factor: "G", reverse: true, text: "I know how to get around the rules.", options: OPTIONS },
  { id: 149, factor: "F", reverse: true, text: "I seldom joke around.", options: OPTIONS },
  { id: 150, factor: "B", reverse: false, text: "I carry the conversation to a higher level.", options: OPTIONS },
  { id: 151, factor: "O", reverse: true, text: "I spend time thinking about past mistakes.", options: OPTIONS },
  { id: 152, factor: "H", reverse: false, text: "I talk to a lot of different people at parties.", options: OPTIONS },
  { id: 153, factor: "N", reverse: true, text: "I bottle up my feelings.", options: OPTIONS },
  { id: 154, factor: "Q2", reverse: false, text: "I want to be left alone.", options: OPTIONS },
  { id: 155, factor: "A", reverse: false, text: "I take an interest in other people's lives.", options: OPTIONS },
  { id: 156, factor: "L", reverse: true, text: "I am wary of others.", options: OPTIONS },
  { id: 157, factor: "A", reverse: false, text: "I enjoy teamwork.", options: OPTIONS },
  { id: 158, factor: "A", reverse: true, text: "I have little to say.", options: OPTIONS },
  { id: 159, factor: "G", reverse: false, text: "I believe laws should be strictly enforced.", options: OPTIONS },
  { id: 160, factor: "G", reverse: false, text: "I do things by the book.", options: OPTIONS },
  { id: 161, factor: "N", reverse: false, text: "I am open about my feelings.", options: OPTIONS },
  { id: 162, factor: "L", reverse: true, text: "I believe that people seldom tell you the whole truth.", options: OPTIONS },
  { id: 163, factor: "Q1", reverse: false, text: "I take deviant positions.", options: OPTIONS },
];

// Map option text → numeric score 1–5
function optionToValue(opt) {
  const idx = OPTIONS.indexOf(opt);
  return idx === -1 ? 0 : idx + 1;
}

// Simple scoring: average 1–5 per factor, with basic qualitative labels
function scoreSixteenPF(answers) {
  const sums = {};
  const counts = {};

  QUESTIONS.forEach((q, index) => {
    const rawOpt = answers[index];
    if (!rawOpt) return;

    const raw = optionToValue(rawOpt);
    if (!raw) return;

    const value = q.reverse ? 6 - raw : raw; // reverse 1–5
    if (!sums[q.factor]) {
      sums[q.factor] = 0;
      counts[q.factor] = 0;
    }
    sums[q.factor] += value;
    counts[q.factor] += 1;
  });

  const averages = {};
  Object.keys(FACTORS).forEach((code) => {
    if (counts[code]) {
      averages[code] = +(sums[code] / counts[code]).toFixed(2);
    } else {
      averages[code] = null;
    }
  });

  const describe = (avg) => {
    if (avg == null) return "Not enough data";
    if (avg >= 4) return "High";
    if (avg >= 3) return "Average";
    return "Low";
  };

  const descriptions = {};
  Object.keys(FACTORS).forEach((code) => {
    descriptions[code] = describe(averages[code]);
  });

  return { averages, descriptions };
}

export default function SixteenPFPage() {
  const test = ALL_TESTS.find((t) => t.id === TEST_ID);
  const questionList = QUESTIONS;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const total = questionList.length;
  const progress = Math.round(((step + 1) / total) * 100);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  // ✅ USE ENV VARIABLE
  const API_URL =  getApiBaseUrl(); 
;

  // --- NEW: Helper to save result to backend ---
  const saveTestResult = async (scoredResult) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: test?.name || "16PF Test",
          result: scoredResult
        })
      });
      console.log("✅ 16PF Result saved!");
    } catch (err) {
      console.error("❌ Failed to save 16PF result:", err);
    }
  };
  // ---------------------------------------------

  const handleNext = () => {
    if (!answers[step]) return;
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      const scored = scoreSixteenPF(answers);
      setResult(scored);
      saveTestResult(scored); // <--- TRIGGER SAVE
      
  window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (!test) {
    return <div className="quiz-page">Test not found.</div>;
  }

  // Result view
  if (result) {
    return (
     <div
  style={{
    minHeight: "80vh",
    marginTop: "130px",   // 👈 pushes entire card below header
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-main)",
    padding: "3.5rem 1rem",
  }}
>

        <div
          style={{
            background: "var(--bg-card)",
            padding: "3rem 2.5rem",
            minWidth: 350,
            maxWidth: 720,
            borderRadius: 20,
            boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.35rem",
              color: "var(--text-main)",
              textAlign: "center",
            }}
          >
            {test.name} – Profile Summary
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Scores are shown on a 1–5 scale for each of the sixteen factors.
            Higher scores mean you show more of that trait.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.9rem 1.4rem",
            }}
          >
            {Object.keys(FACTORS).map((code) => (
              <div
                key={code}
                style={{
                  background: "var(--bg-accent)",
                  borderRadius: 12,
                  padding: "0.75rem 0.9rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.1rem",
                }}
              >
                <div
                  style={{
                    fontWeight: 650,
                    fontSize: "0.98rem",
                    color: "var(--text-main)",
                  }}
                >
                  {code} – {FACTORS[code]}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Score: {result.averages[code] ?? "–"} (
                  {result.descriptions[code]})
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)", textAlign: "center" }}>
            ✅ Result saved to your profile!
          </div>
        </div>
      </div>
    );
  }

  // Question view
return (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-main)",
      padding: "3.5rem 1rem",
    }}
  >
    <div
      style={{
        background: "var(--bg-card)",
        padding: "3rem 2.5rem",
        width: "100%",
        maxWidth: 540,
        borderRadius: 20,
        boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      {/* Title */}
<h1
  style={{
    fontSize: "2.3rem",
    fontWeight: 800,
    color: "var(--text-main)",
    textAlign: "center",
    marginBottom: "0.6rem",
  }}
>
  {test?.name || "Sixteen Personality Factors"}
</h1>

{/* Description Box */}
<div
  style={{
    background: "rgba(34, 197, 94, 0.08)",
      border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: "14px",
    padding: "1.2rem 1.5rem",
    marginBottom: "0 rem",
  }}
>
  <p
    style={{
      margin: 0,
      color: "var(--text-muted)",
      fontSize: "1rem",
      lineHeight: "1.6",
    }}
  >
    This assessment evaluates sixteen core personality traits that
    influence how you think, behave, and interact with others.
  </p>

  <p
    style={{
      marginTop: "0rem",
      marginBottom: 0,
      color: "var(--text-muted)",
      fontSize: "1rem",
      lineHeight: "1.6",
    }}
  >
    Answer honestly to gain deeper insight into your strengths,
    preferences, and behavioral patterns.
  </p>
</div>

      {/* Question Number */}
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: "1rem",
          marginBottom: "0.5rem",
        }}
      >
        Question {step + 1} of {total}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: 10,
          background: "rgba(25, 253, 145, 0.1)",
          borderRadius: 6,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "var(--accent)",
            transition: "width 0.3s ease",
            marginBottom: "1rem",
          }}
        />
      </div>

      {/* Question Text */}
      <div
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--text-main)",
        }}
      >
        {questionList[step].text}
      </div>

      {/* Options */}
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {questionList[step].options.map((opt) => (
          <label
            key={opt}
            style={{
              background:
                answers[step] === opt
                  ? "var(--accent)"
                  : "var(--bg-accent)",
              color:
                answers[step] === opt
                  ? "var(--btn-text)"
                  : "var(--text-main)",
              border: `2px solid ${
                answers[step] === opt
                  ? "var(--accent)"
                  : "var(--input-border)"
              }`,
              borderRadius: 10,
              padding: "1rem 1.5rem",
              cursor: "pointer",
              fontWeight: 550,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <input
              type="radio"
              name={`q${step}`}
              value={opt}
              checked={answers[step] === opt}
              onChange={() =>
                setAnswers((a) => ({
                  ...a,
                  [step]: opt,
                }))
              }
              style={{
                accentColor: "var(--accent)",
                cursor: "pointer",
              }}
            />
            {opt}
          </label>
        ))}
      </form>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        {step > 0 && (
          <button
            type="button"
            className="cta-btn"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        <button
          type="button"
          className="cta-btn"
          onClick={handleNext}
        >
          {step < total - 1 ? "Next" : "Submit"}
        </button>
      </div>
    </div>
  </div>
);
}