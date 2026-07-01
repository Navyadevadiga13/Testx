// // src/quiz/MbtiPage.js
// import React, { useState } from "react";
// import { ALL_TESTS } from "../data/allTests";
// import getApiBaseUrl from "../utils/api"; 

// const TEST_ID = "mbti";

// // ---------- PART 1 QUESTIONS ----------
// const QUESTIONS_PART_1 = [
//   {
//     number: 1,
//     question: "When you go somewhere for the day, would you rather",
//     dimension: "JP",
//     direction: "J",
//     options: [
//       "a. Plan what you will do and when",
//       "b. Just go",
//     ],
//   },
//   {
//     number: 2,
//     question: "If you were a teacher, would you rather teach",
//     dimension: "SN",
//     direction: "S",
//     options: [
//       "a. Fact courses",
//       "b. Courses involving theory",
//     ],
//   },
//   {
//     number: 3,
//     question: "Are you usually",
//     dimension: "EI",
//     direction: "E",
//     options: [
//       "a. A “good mixer”",
//       "b. Rather quiet and reserved",
//     ],
//   },
//   {
//     number: 4,
//     question: "Do you more often let",
//     dimension: "TF",
//     direction: "F",
//     options: [
//       "a. Your heart rule your head",
//       "b. Your head rule your heart",
//     ],
//   },
//   {
//     number: 5,
//     question:
//       "In doing something that many other people do, does it appeal to you more to",
//     dimension: "JP",
//     direction: "P",
//     options: [
//       "a. Invent a way of your own",
//       "b. Do it in the accepted way",
//     ],
//   },
//   {
//     number: 6,
//     question: "Among your friends are you",
//     dimension: "EI",
//     direction: "E",
//     options: [
//       "a. Full of news about everybody",
//       "b. One of the last to hear what is going on",
//     ],
//   },
//   {
//     number: 7,
//     question:
//       "Does the idea of making a list of what you should get done over a weekend",
//     dimension: "JP",
//     direction: "J",
//     options: [
//       "a. Appeal to you",
//       "b. Leave you cold",
//       "c. Positively depress you",
//     ],
//   },
//   {
//     number: 8,
//     question: "When you have a special job to do, do you like to",
//     dimension: "JP",
//     direction: "J",
//     options: [
//       "a. Organize it carefully before you start",
//       "b. Find out what is necessary as you go along",
//     ],
//   },
//   {
//     number: 9,
//     question: "Do you tend to have",
//     dimension: "EI",
//     direction: "E",
//     options: [
//       "a. Broad friendships with many different people",
//       "b. Deep friendship with very few people",
//     ],
//   },
//   {
//     number: 10,
//     question: "Do you admire more the people who are",
//     dimension: "SN",
//     direction: "S",
//     options: [
//       "a. Conventional enough never to make themselves conspicuous",
//       "b. Too original & individual to care whether they are conspicuous or not",
//     ],
//   },
//   {
//     number: 11,
//     question: "Do you prefer to",
//     dimension: "JP",
//     direction: "J",
//     options: [
//       "a. Arrange picnics, parties etc, well in advance",
//       "b. Be free to do whatever looks like fun when the time comes",
//     ],
//   },
//   {
//     number: 12,
//     question: "Do you usually get along better with",
//     dimension: "SN",
//     direction: "S",
//     options: [
//       "a. Realistic people",
//       "b. Imaginative people",
//     ],
//   },
//   {
//     number: 13,
//     question:
//       "When you are with a group of people, would you usually rather",
//     dimension: "EI",
//     direction: "E",
//     options: [
//       "a. Join in the talk of the group",
//       "b. Start a conversation of your own",
//     ],
//   },
//   {
//     number: 14,
//     question: "Is it a higher compliment to be called",
//     dimension: "TF",
//     direction: "F",
//     options: [
//       "a. A person of real feeling",
//       "b. A consistently reasonable person",
//     ],
//   },
//   {
//     number: 15,
//     question: "In reading for pleasure, do you",
//     dimension: "SN",
//     direction: "N",
//     options: [
//       "a. Enjoy odd or original ways of saying things",
//       "b. Like writers to say exactly what they mean",
//     ],
//   },
//   {
//     number: 16,
//     question: "Do you",
//     dimension: "EI",
//     direction: "E",
//     options: [
//       "a. Talk easily to almost anyone for as long as you have to",
//       "b. Find a lot to say only to certain people or under certain conditions",
//     ],
//   },
//   {
//     number: 17,
//     question: "Does following a schedule",
//     dimension: "JP",
//     direction: "J",
//     options: [
//       "a. Appeal to you",
//       "b. Cramp you",
//     ],
//   },
//   {
//     number: 18,
//     question:
//       "When it is settled well in advance that you will do a certain thing at a certain time, do you find it",
//     dimension: "JP",
//     direction: "J",
//     options: [
//       "a. Nice to be able to plan accordingly",
//       "b. A little unpleasant to be tied down",
//     ],
//   },
//   {
//     number: 19,
//     question: "Are you more successful",
//     dimension: "JP",
//     direction: "J",
//     options: [
//       "a. At following a carefully worked out plan",
//       "b. At dealing with the unexpected and seeing quickly what should be done",
//     ],
//   },
//   {
//     number: 20,
//     question: "Would you rather be considered",
//     dimension: "SN",
//     direction: "S",
//     options: [
//       "a. A practical person",
//       "b. An ingenious person",
//     ],
//   },
//   {
//     number: 21,
//     question: "In a large group, do you more often",
//     dimension: "EI",
//     direction: "E",
//     options: [
//       "a. Introduce others",
//       "b. Get introduced",
//     ],
//   },
//   {
//     number: 22,
//     question: "Do you usually",
//     dimension: "TF",
//     direction: "F",
//     options: [
//       "a. Value sentiment more than logic",
//       "b. Value logic more than sentiments",
//     ],
//   },
//   {
//     number: 23,
//     question: "Would you rather have as a friend",
//     dimension: "SN",
//     direction: "N",
//     options: [
//       "a. Someone who is always coming up with new ideas",
//       "b. Someone who has both feet on the ground",
//     ],
//   },
//   {
//     number: 24,
//     question: "Can the new people you meet tell what you are interested in",
//     dimension: "EI",
//     direction: "E",
//     options: [
//       "a. Right away",
//       "b. Only after they really get to know you",
//     ],
//   },
//   {
//     number: 25,
//     question: "In your daily work, do you",
//     dimension: "JP",
//     direction: "J",
//     options: [
//       "a. Usually plan your work so you won’t need to work under pressure",
//       "b. Rather enjoy an emergency that makes you work against time",
//       "c. Hate to work under pressure",
//     ],
//   },
//   {
//     number: 26,
//     question: "Do you usually",
//     dimension: "EI",
//     direction: "E",
//     options: [
//       "a. Show your feelings freely",
//       "b. Keep your feelings to yourself",
//     ],
//   },
// ];

// // ---------- PART 2 QUESTIONS ----------

// const QUESTIONS_PART_2 = [
//   {
//     number: 27,
//     question: "Which word in each pair appeals to you more",
//     dimension: "JP",
//     direction: "J",
//     options: ["a. scheduled", "b. unplanned"],
//   },
//   {
//     number: 28,
//     question: "Which word in each pair appeals to you more",
//     dimension: "SN",
//     direction: "S",
//     options: ["a. facts", "b. ideas"],
//   },
//   {
//     number: 29,
//     question: "Which word in each pair appeals to you more",
//     dimension: "EI",
//     direction: "I",
//     options: ["a. quiet", "b. hearty"],
//   },
//   {
//     number: 30,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "T",
//     options: ["a. convincing", "b. touching"],
//   },
//   {
//     number: 31,
//     question: "Which word in each pair appeals to you more",
//     dimension: "SN",
//     direction: "N",
//     options: ["a. imaginative", "b. determined"],
//   },
//   {
//     number: 32,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "T",
//     options: ["a. benefits", "b. blessings"],
//   },
//   {
//     number: 33,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "F",
//     options: ["a. peacemaker", "b. judge"],
//   },
//   {
//     number: 34,
//     question: "Which word in each pair appeals to you more",
//     dimension: "JP",
//     direction: "J",
//     options: ["a. systematic", "b. spontaneous"],
//   },
//   {
//     number: 35,
//     question: "Which word in each pair appeals to you more",
//     dimension: "SN",
//     direction: "S",
//     options: ["a. statement", "b. concept"],
//   },
//   {
//     number: 36,
//     question: "Which word in each pair appeals to you more",
//     dimension: "EI",
//     direction: "I",
//     options: ["a. reserved", "b. talkative"],
//   },
//   {
//     number: 37,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "T",
//     options: ["a. analyze", "b. sympathize"],
//   },
//   {
//     number: 38,
//     question: "Which word in each pair appeals to you more",
//     dimension: "SN",
//     direction: "N",
//     options: ["a. create", "b. make"],
//   },
//   {
//     number: 39,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "T",
//     options: ["a. determined", "b. gentle"],
//   },
//   {
//     number: 40,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "F",
//     options: ["a. gentle", "b. firm"],
//   },
//   {
//     number: 41,
//     question: "Which word in each pair appeals to you more",
//     dimension: "JP",
//     direction: "J",
//     options: ["a. systematic", "b. casual"],
//   },
//   {
//     number: 42,
//     question: "Which word in each pair appeals to you more",
//     dimension: "SN",
//     direction: "S",
//     options: ["a. certainty", "b. theory"],
//   },
//   {
//     number: 43,
//     question: "Which word in each pair appeals to you more",
//     dimension: "EI",
//     direction: "I",
//     options: ["a. calm", "b. lively"],
//   },
//   {
//     number: 44,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "T",
//     options: ["a. justice", "b. mercy"],
//   },
//   {
//     number: 45,
//     question: "Which word in each pair appeals to you more",
//     dimension: "SN",
//     direction: "N",
//     options: ["a. fascinating", "b. sensible"],
//   },
//   {
//     number: 46,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "T",
//     options: ["a. firm-minded", "b. warmhearted"],
//   },
//   {
//     number: 47,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "F",
//     options: ["a. feeling", "b. thinking"],
//   },
//   {
//     number: 48,
//     question: "Which word in each pair appeals to you more",
//     dimension: "SN",
//     direction: "S",
//     options: ["a. literal", "b. figurative"],
//   },
//   {
//     number: 49,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "T",
//     options: ["a. foresight", "b. compassion"],
//   },
//   {
//     number: 50,
//     question: "Which word in each pair appeals to you more",
//     dimension: "TF",
//     direction: "T",
//     options: ["a. hard", "b. soft"],
//   },
// ];

// const QUESTIONS = [...QUESTIONS_PART_1, ...QUESTIONS_PART_2];

// // ---------- TYPE DESCRIPTIONS ----------

// const MBTI_DESCRIPTIONS = {
//   ISTJ: {
//     label: "ISTJ – Responsible Organizer",
//     text:
//       "Quiet, reliable, and detail‑focused. Prefers clear structures, follows through on commitments, and values duty and stability.",
//   },
//   ISFJ: {
//     label: "ISFJ – Supportive Protector",
//     text:
//       "Warm, considerate, and practical. Notices others’ needs, enjoys helping, and works hard behind the scenes to keep things running smoothly.",
//   },
//   INFJ: {
//     label: "INFJ – Insightful Idealist",
//     text:
//       "Reflective and people‑focused, driven by values and meaning. Looks for deeper patterns and wants to help others grow and improve their lives.",
//   },
//   INTJ: {
//     label: "INTJ – Strategic Visionary",
//     text:
//       "Independent, analytical, and future‑oriented. Quickly sees long‑term possibilities and prefers efficient, well‑designed systems.",
//   },
//   ISTP: {
//     label: "ISTP – Practical Troubleshooter",
//     text:
//       "Calm and hands‑on, enjoys figuring out how things work. Likes solving immediate problems with flexible, realistic solutions.",
//   },
//   ISFP: {
//     label: "ISFP – Gentle Creator",
//     text:
//       "Quiet, kind, and sensitive to aesthetics. Values personal freedom, prefers a relaxed pace, and expresses care through actions more than words.",
//   },
//   INFP: {
//     label: "INFP – Thoughtful Idealist",
//     text:
//       "Imaginative and values‑driven, guided by inner principles. Interested in possibilities and meaning, especially in people and ideas.",
//   },
//   INTP: {
//     label: "INTP – Curious Analyst",
//     text:
//       "Logical, curious, and independent. Enjoys exploring concepts, spotting patterns, and understanding how systems and theories fit together.",
//   },
//   ESTP: {
//     label: "ESTP – Energetic Doer",
//     text:
//       "Action‑oriented, adaptable, and realistic. Likes variety, reacts quickly to what’s happening, and prefers learning by doing.",
//   },
//   ESFP: {
//     label: "ESFP – Friendly Performer",
//     text:
//       "Outgoing, lively, and people‑focused. Enjoys shared experiences, brings energy to groups, and prefers practical, here‑and‑now activities.",
//   },
//   ENFP: {
//     label: "ENFP – Enthusiastic Explorer",
//     text:
//       "Imaginative, expressive, and people‑centered. Enjoys new ideas and possibilities, and looks for work and relationships that feel meaningful.",
//   },
//   ENTP: {
//     label: "ENTP – Inventive Debater",
//     text:
//       "Quick‑thinking and curious, enjoys challenges and debate. Likes generating options, questioning assumptions, and playing with new concepts.",
//   },
//   ESTJ: {
//     label: "ESTJ – Efficient Organizer",
//     text:
//       "Decisive, direct, and practical. Prefers clear rules, takes charge to get things done, and values reliability and order.",
//   },
//   ESFJ: {
//     label: "ESFJ – Caring Coordinator",
//     text:
//       "Warm, sociable, and responsible. Notices how people are feeling, values harmony, and works to meet group expectations and needs.",
//   },
//   ENFJ: {
//     label: "ENFJ – Inspiring Mentor",
//     text:
//       "Empathetic, organized, and people‑oriented. Reads others well, encourages their growth, and likes to coordinate efforts toward shared goals.",
//   },
//   ENTJ: {
//     label: "ENTJ – Commanding Strategist",
//     text:
//       "Confident, goal‑focused, and analytical. Enjoys taking the lead, planning long‑range, and improving systems to work more efficiently.",
//   },
// };

// // ---------- SCORING LOGIC ----------

// function scoreQuestion(q, chosenOption) {
//   if (!chosenOption) return { dim: q.dimension, dirScore: 0, oppScore: 0 };

//   const idx = q.options.indexOf(chosenOption); 
//   if (idx === -1) return { dim: q.dimension, dirScore: 0, oppScore: 0 };

//   if (q.options.length === 2) {
//     const dirScore = idx === 0 ? 1 : 0;
//     const oppScore = idx === 1 ? 1 : 0;
//     return { dim: q.dimension, dirScore, oppScore };
//   }

//   if (q.options.length === 3) {
//     if (idx === 0) return { dim: q.dimension, dirScore: 1, oppScore: 0 };
//     if (idx === 1) return { dim: q.dimension, dirScore: 0, oppScore: 1 };
//     return { dim: q.dimension, dirScore: 0, oppScore: 0 };
//   }

//   return { dim: q.dimension, dirScore: 0, oppScore: 0 };
// }

// function oppositeLetter(dimension, direction) {
//   if (dimension === "EI") return direction === "E" ? "I" : "E";
//   if (dimension === "SN") return direction === "S" ? "N" : "S";
//   if (dimension === "TF") return direction === "T" ? "F" : "T";
//   return direction === "J" ? "P" : "J"; 
// }

// function scoreMbti(answers) {
//   const totals = {
//     EI: { E: 0, I: 0 },
//     SN: { S: 0, N: 0 },
//     TF: { T: 0, F: 0 },
//     JP: { J: 0, P: 0 },
//   };

//   QUESTIONS.forEach((q, index) => {
//     const response = answers[index];
//     const { dim, dirScore, oppScore } = scoreQuestion(q, response);
//     const pair = totals[dim];
//     if (!pair) return;

//     const dir = q.direction.toUpperCase();
//     const opp = oppositeLetter(dim, dir);

//     pair[dir] += dirScore;
//     pair[opp] += oppScore;
//   });

//   const typeLetters = [
//     totals.EI.E >= totals.EI.I ? "E" : "I",
//     totals.SN.S >= totals.SN.N ? "S" : "N",
//     totals.TF.T >= totals.TF.F ? "T" : "F",
//     totals.JP.J >= totals.JP.P ? "J" : "P",
//   ];

//   const type = typeLetters.join("");

//   return {
//     type,
//     totals,
//   };
// }

// // ---------- PAGE COMPONENT ----------

// export default function MbtiPage() {
//   const test = ALL_TESTS.find((t) => t.id === TEST_ID);
//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);

//   const questionList = QUESTIONS;
//   const progress = Math.round(((step + 1) / questionList.length) * 100);

//   // ✅ USE ENV VARIABLE
//   const API_URL =  getApiBaseUrl(); 
// ;

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
//           testName: test?.name || "MBTI Test",
//           result: scoredResult // Saves type + totals
//         })
//       });
//       console.log("✅ MBTI Result saved!");
//     } catch (err) {
//       console.error("❌ Failed to save MBTI result:", err);
//     }
//   };

//   const handleNext = () => {
//     if (!answers[step]) return;
//     if (step < questionList.length - 1) {
//       setStep((s) => s + 1);
//     } else {
//       const scored = scoreMbti(answers);
//       setResult(scored);
//       saveTestResult(scored); // <--- TRIGGER SAVE
//     }
//   };

//   const handleBack = () => {
//     if (step > 0) setStep((s) => s - 1);
//   };

//   if (!test) return <div className="quiz-page">Test not found.</div>;

//   if (result) {
//   const info = MBTI_DESCRIPTIONS[result.type];

//   const letterMap = {
//     E: "Extraverted",
//     I: "Introverted",
//     S: "Sensing",
//     N: "Intuitive",
//     T: "Thinking",
//     F: "Feeling",
//     J: "Judging",
//     P: "Perceiving",
//   };
//   const prefs =
//     result.type &&
//     result.type
//       .split("")
//       .map((ch) => letterMap[ch] || ch)
//       .join(" • ");

//   return (
//    <div
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
//           gap: "0.9rem",
//           textAlign: "center",
//         }}
//       >
//         <div
//           style={{
//             fontWeight: 700,
//             fontSize: "1.35rem",
//             color: "var(--text-main)",
//           }}
//         >
//           {test.name} – Your Type
//         </div>

//         <div
//           style={{
//             fontSize: "2.6rem",
//             fontWeight: 800,
//             color: "var(--accent)",
//             letterSpacing: "0.18em",
//             marginTop: "0.5rem",
//           }}
//         >
//           {result.type}
//         </div>

//         {info && (
//           <div
//             style={{
//               fontSize: "1.15rem",
//               fontWeight: 700,
//               color: "var(--text-main)",
//             }}
//           >
//             {info.label.split("–")[1]?.trim() || info.label}
//           </div>
//         )}

//         {prefs && (
//           <div
//             style={{
//               fontSize: "0.95rem",
//               color: "var(--text-main)",
//             }}
//           >
//             ({prefs})
//           </div>
//         )}

//         {info && (
//           <p
//             style={{
//               color: "var(--text-muted)",
//               fontSize: "0.95rem",
//               marginTop: "0.75rem",
//             }}
//           >
//             {info.text}
//           </p>
//         )}
//         <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)", textAlign: "center" }}>
//             ✅ Result saved to your profile!
//         </div>
//       </div>
//     </div>
//   );
// }

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
//           {test?.name || "MBTI‑style Personality Test"}
//         </div>
//         <div
//           style={{
//             color: "var(--text-muted)",
//             fontSize: "1rem",
//             marginBottom: "1rem",
//           }}
//         >
//           Question {step + 1} of {questionList.length}
//         </div>
//         <div
//           style={{
//             height: 10,
//             background: "rgba(33,46,35,0.7)",
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
//           {questionList[step].question}
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
//                 border: `2px solid ${
//                   answers[step] === opt
//                     ? "var(--accent)"
//                     : "var(--input-border)"
//                 }`,
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
//                 background: "#222a22",
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
//             {step < questionList.length - 1 ? "Next" : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/quiz/MbtiPage.js

import React, { useState, useEffect } from "react";
import { ALL_TESTS } from "../data/allTests";
import getApiBaseUrl from "../utils/api"; 
import { useNavigate } from "react-router-dom";
const TEST_ID = "mbti";

// ---------- PART 1 QUESTIONS ----------
const QUESTIONS_PART_1 = [
  {
    number: 1,
    question: "When you go somewhere for the day, would you rather",
    dimension: "JP",
    direction: "J",
    options: [
      "a. Plan what you will do and when",
      "b. Just go",
    ],
  },
  {
    number: 2,
    question: "If you were a teacher, would you rather teach",
    dimension: "SN",
    direction: "S",
    options: [
      "a. Fact courses",
      "b. Courses involving theory",
    ],
  },
  {
    number: 3,
    question: "Are you usually",
    dimension: "EI",
    direction: "E",
    options: [
      "a. A “good mixer”",
      "b. Rather quiet and reserved",
    ],
  },
  {
    number: 4,
    question: "Do you more often let",
    dimension: "TF",
    direction: "F",
    options: [
      "a. Your heart rule your head",
      "b. Your head rule your heart",
    ],
  },
  {
    number: 5,
    question:
      "In doing something that many other people do, does it appeal to you more to",
    dimension: "JP",
    direction: "P",
    options: [
      "a. Invent a way of your own",
      "b. Do it in the accepted way",
    ],
  },
  {
    number: 6,
    question: "Among your friends are you",
    dimension: "EI",
    direction: "E",
    options: [
      "a. Full of news about everybody",
      "b. One of the last to hear what is going on",
    ],
  },
  {
    number: 7,
    question:
      "Does the idea of making a list of what you should get done over a weekend",
    dimension: "JP",
    direction: "J",
    options: [
      "a. Appeal to you",
      "b. Leave you cold",
      "c. Positively depress you",
    ],
  },
  {
    number: 8,
    question: "When you have a special job to do, do you like to",
    dimension: "JP",
    direction: "J",
    options: [
      "a. Organize it carefully before you start",
      "b. Find out what is necessary as you go along",
    ],
  },
  {
    number: 9,
    question: "Do you tend to have",
    dimension: "EI",
    direction: "E",
    options: [
      "a. Broad friendships with many different people",
      "b. Deep friendship with very few people",
    ],
  },
  {
    number: 10,
    question: "Do you admire more the people who are",
    dimension: "SN",
    direction: "S",
    options: [
      "a. Conventional enough never to make themselves conspicuous",
      "b. Too original & individual to care whether they are conspicuous or not",
    ],
  },
  {
    number: 11,
    question: "Do you prefer to",
    dimension: "JP",
    direction: "J",
    options: [
      "a. Arrange picnics, parties etc, well in advance",
      "b. Be free to do whatever looks like fun when the time comes",
    ],
  },
  {
    number: 12,
    question: "Do you usually get along better with",
    dimension: "SN",
    direction: "S",
    options: [
      "a. Realistic people",
      "b. Imaginative people",
    ],
  },
  {
    number: 13,
    question:
      "When you are with a group of people, would you usually rather",
    dimension: "EI",
    direction: "E",
    options: [
      "a. Join in the talk of the group",
      "b. Start a conversation of your own",
    ],
  },
  {
    number: 14,
    question: "Is it a higher compliment to be called",
    dimension: "TF",
    direction: "F",
    options: [
      "a. A person of real feeling",
      "b. A consistently reasonable person",
    ],
  },
  {
    number: 15,
    question: "In reading for pleasure, do you",
    dimension: "SN",
    direction: "N",
    options: [
      "a. Enjoy odd or original ways of saying things",
      "b. Like writers to say exactly what they mean",
    ],
  },
  {
    number: 16,
    question: "Do you",
    dimension: "EI",
    direction: "E",
    options: [
      "a. Talk easily to almost anyone for as long as you have to",
      "b. Find a lot to say only to certain people or under certain conditions",
    ],
  },
  {
    number: 17,
    question: "Does following a schedule",
    dimension: "JP",
    direction: "J",
    options: [
      "a. Appeal to you",
      "b. Cramp you",
    ],
  },
  {
    number: 18,
    question:
      "When it is settled well in advance that you will do a certain thing at a certain time, do you find it",
    dimension: "JP",
    direction: "J",
    options: [
      "a. Nice to be able to plan accordingly",
      "b. A little unpleasant to be tied down",
    ],
  },
  {
    number: 19,
    question: "Are you more successful",
    dimension: "JP",
    direction: "J",
    options: [
      "a. At following a carefully worked out plan",
      "b. At dealing with the unexpected and seeing quickly what should be done",
    ],
  },
  {
    number: 20,
    question: "Would you rather be considered",
    dimension: "SN",
    direction: "S",
    options: [
      "a. A practical person",
      "b. An ingenious person",
    ],
  },
  {
    number: 21,
    question: "In a large group, do you more often",
    dimension: "EI",
    direction: "E",
    options: [
      "a. Introduce others",
      "b. Get introduced",
    ],
  },
  {
    number: 22,
    question: "Do you usually",
    dimension: "TF",
    direction: "F",
    options: [
      "a. Value sentiment more than logic",
      "b. Value logic more than sentiments",
    ],
  },
  {
    number: 23,
    question: "Would you rather have as a friend",
    dimension: "SN",
    direction: "N",
    options: [
      "a. Someone who is always coming up with new ideas",
      "b. Someone who has both feet on the ground",
    ],
  },
  {
    number: 24,
    question: "Can the new people you meet tell what you are interested in",
    dimension: "EI",
    direction: "E",
    options: [
      "a. Right away",
      "b. Only after they really get to know you",
    ],
  },
  {
    number: 25,
    question: "In your daily work, do you",
    dimension: "JP",
    direction: "J",
    options: [
      "a. Usually plan your work so you won’t need to work under pressure",
      "b. Rather enjoy an emergency that makes you work against time",
      "c. Hate to work under pressure",
    ],
  },
  {
    number: 26,
    question: "Do you usually",
    dimension: "EI",
    direction: "E",
    options: [
      "a. Show your feelings freely",
      "b. Keep your feelings to yourself",
    ],
  },
];

// ---------- PART 2 QUESTIONS ----------

const QUESTIONS_PART_2 = [
  {
    number: 27,
    question: "Which word in each pair appeals to you more",
    dimension: "JP",
    direction: "J",
    options: ["a. scheduled", "b. unplanned"],
  },
  {
    number: 28,
    question: "Which word in each pair appeals to you more",
    dimension: "SN",
    direction: "S",
    options: ["a. facts", "b. ideas"],
  },
  {
    number: 29,
    question: "Which word in each pair appeals to you more",
    dimension: "EI",
    direction: "I",
    options: ["a. quiet", "b. hearty"],
  },
  {
    number: 30,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "T",
    options: ["a. convincing", "b. touching"],
  },
  {
    number: 31,
    question: "Which word in each pair appeals to you more",
    dimension: "SN",
    direction: "N",
    options: ["a. imaginative", "b. determined"],
  },
  {
    number: 32,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "T",
    options: ["a. benefits", "b. blessings"],
  },
  {
    number: 33,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "F",
    options: ["a. peacemaker", "b. judge"],
  },
  {
    number: 34,
    question: "Which word in each pair appeals to you more",
    dimension: "JP",
    direction: "J",
    options: ["a. systematic", "b. spontaneous"],
  },
  {
    number: 35,
    question: "Which word in each pair appeals to you more",
    dimension: "SN",
    direction: "S",
    options: ["a. statement", "b. concept"],
  },
  {
    number: 36,
    question: "Which word in each pair appeals to you more",
    dimension: "EI",
    direction: "I",
    options: ["a. reserved", "b. talkative"],
  },
  {
    number: 37,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "T",
    options: ["a. analyze", "b. sympathize"],
  },
  {
    number: 38,
    question: "Which word in each pair appeals to you more",
    dimension: "SN",
    direction: "N",
    options: ["a. create", "b. make"],
  },
  {
    number: 39,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "T",
    options: ["a. determined", "b. gentle"],
  },
  {
    number: 40,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "F",
    options: ["a. gentle", "b. firm"],
  },
  {
    number: 41,
    question: "Which word in each pair appeals to you more",
    dimension: "JP",
    direction: "J",
    options: ["a. systematic", "b. casual"],
  },
  {
    number: 42,
    question: "Which word in each pair appeals to you more",
    dimension: "SN",
    direction: "S",
    options: ["a. certainty", "b. theory"],
  },
  {
    number: 43,
    question: "Which word in each pair appeals to you more",
    dimension: "EI",
    direction: "I",
    options: ["a. calm", "b. lively"],
  },
  {
    number: 44,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "T",
    options: ["a. justice", "b. mercy"],
  },
  {
    number: 45,
    question: "Which word in each pair appeals to you more",
    dimension: "SN",
    direction: "N",
    options: ["a. fascinating", "b. sensible"],
  },
  {
    number: 46,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "T",
    options: ["a. firm-minded", "b. warmhearted"],
  },
  {
    number: 47,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "F",
    options: ["a. feeling", "b. thinking"],
  },
  {
    number: 48,
    question: "Which word in each pair appeals to you more",
    dimension: "SN",
    direction: "S",
    options: ["a. literal", "b. figurative"],
  },
  {
    number: 49,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "T",
    options: ["a. foresight", "b. compassion"],
  },
  {
    number: 50,
    question: "Which word in each pair appeals to you more",
    dimension: "TF",
    direction: "T",
    options: ["a. hard", "b. soft"],
  },
];

const QUESTIONS = [...QUESTIONS_PART_1, ...QUESTIONS_PART_2];

// ---------- TYPE DESCRIPTIONS ----------

const MBTI_DESCRIPTIONS = {
  ISTJ: {
    label: "ISTJ – Responsible Organizer",
    text:
      "Quiet, reliable, and detail‑focused. Prefers clear structures, follows through on commitments, and values duty and stability.",
  },
  ISFJ: {
    label: "ISFJ – Supportive Protector",
    text:
      "Warm, considerate, and practical. Notices others’ needs, enjoys helping, and works hard behind the scenes to keep things running smoothly.",
  },
  INFJ: {
    label: "INFJ – Insightful Idealist",
    text:
      "Reflective and people‑focused, driven by values and meaning. Looks for deeper patterns and wants to help others grow and improve their lives.",
  },
  INTJ: {
    label: "INTJ – Strategic Visionary",
    text:
      "Independent, analytical, and future‑oriented. Quickly sees long‑term possibilities and prefers efficient, well‑designed systems.",
  },
  ISTP: {
    label: "ISTP – Practical Troubleshooter",
    text:
      "Calm and hands‑on, enjoys figuring out how things work. Likes solving immediate problems with flexible, realistic solutions.",
  },
  ISFP: {
    label: "ISFP – Gentle Creator",
    text:
      "Quiet, kind, and sensitive to aesthetics. Values personal freedom, prefers a relaxed pace, and expresses care through actions more than words.",
  },
  INFP: {
    label: "INFP – Thoughtful Idealist",
    text:
      "Imaginative and values‑driven, guided by inner principles. Interested in possibilities and meaning, especially in people and ideas.",
  },
  INTP: {
    label: "INTP – Curious Analyst",
    text:
      "Logical, curious, and independent. Enjoys exploring concepts, spotting patterns, and understanding how systems and theories fit together.",
  },
  ESTP: {
    label: "ESTP – Energetic Doer",
    text:
      "Action‑oriented, adaptable, and realistic. Likes variety, reacts quickly to what’s happening, and prefers learning by doing.",
  },
  ESFP: {
    label: "ESFP – Friendly Performer",
    text:
      "Outgoing, lively, and people‑focused. Enjoys shared experiences, brings energy to groups, and prefers practical, here‑and‑now activities.",
  },
  ENFP: {
    label: "ENFP – Enthusiastic Explorer",
    text:
      "Imaginative, expressive, and people‑centered. Enjoys new ideas and possibilities, and looks for work and relationships that feel meaningful.",
  },
  ENTP: {
    label: "ENTP – Inventive Debater",
    text:
      "Quick‑thinking and curious, enjoys challenges and debate. Likes generating options, questioning assumptions, and playing with new concepts.",
  },
  ESTJ: {
    label: "ESTJ – Efficient Organizer",
    text:
      "Decisive, direct, and practical. Prefers clear rules, takes charge to get things done, and values reliability and order.",
  },
  ESFJ: {
    label: "ESFJ – Caring Coordinator",
    text:
      "Warm, sociable, and responsible. Notices how people are feeling, values harmony, and works to meet group expectations and needs.",
  },
  ENFJ: {
    label: "ENFJ – Inspiring Mentor",
    text:
      "Empathetic, organized, and people‑oriented. Reads others well, encourages their growth, and likes to coordinate efforts toward shared goals.",
  },
  ENTJ: {
    label: "ENTJ – Commanding Strategist",
    text:
      "Confident, goal‑focused, and analytical. Enjoys taking the lead, planning long‑range, and improving systems to work more efficiently.",
  },
};

// ---------- SCORING LOGIC ----------

function scoreQuestion(q, chosenOption) {
  if (!chosenOption) return { dim: q.dimension, dirScore: 0, oppScore: 0 };

  const idx = q.options.indexOf(chosenOption); 
  if (idx === -1) return { dim: q.dimension, dirScore: 0, oppScore: 0 };

  if (q.options.length === 2) {
    const dirScore = idx === 0 ? 1 : 0;
    const oppScore = idx === 1 ? 1 : 0;
    return { dim: q.dimension, dirScore, oppScore };
  }

  if (q.options.length === 3) {
    if (idx === 0) return { dim: q.dimension, dirScore: 1, oppScore: 0 };
    if (idx === 1) return { dim: q.dimension, dirScore: 0, oppScore: 1 };
    return { dim: q.dimension, dirScore: 0, oppScore: 0 };
  }

  return { dim: q.dimension, dirScore: 0, oppScore: 0 };
}

function oppositeLetter(dimension, direction) {
  if (dimension === "EI") return direction === "E" ? "I" : "E";
  if (dimension === "SN") return direction === "S" ? "N" : "S";
  if (dimension === "TF") return direction === "T" ? "F" : "T";
  return direction === "J" ? "P" : "J"; 
}

function scoreMbti(answers) {
  const totals = {
    EI: { E: 0, I: 0 },
    SN: { S: 0, N: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  };

  QUESTIONS.forEach((q, index) => {
    const response = answers[index];
    const { dim, dirScore, oppScore } = scoreQuestion(q, response);
    const pair = totals[dim];
    if (!pair) return;

    const dir = q.direction.toUpperCase();
    const opp = oppositeLetter(dim, dir);

    pair[dir] += dirScore;
    pair[opp] += oppScore;
  });

  const typeLetters = [
    totals.EI.E >= totals.EI.I ? "E" : "I",
    totals.SN.S >= totals.SN.N ? "S" : "N",
    totals.TF.T >= totals.TF.F ? "T" : "F",
    totals.JP.J >= totals.JP.P ? "J" : "P",
  ];

  const type = typeLetters.join("");

  return {
    type,
    totals,
  };
}

// ---------- PAGE COMPONENT ----------

export default function MbtiPage() {
  const test = ALL_TESTS.find((t) => t.id === TEST_ID);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
const navigate = useNavigate();
  const questionList = QUESTIONS;
  const progress = Math.round(((step + 1) / questionList.length) * 100);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  // ✅ USE ENV VARIABLE
  const API_URL =  getApiBaseUrl(); 

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
  testName: test?.name,
  result: {
    ...scoredResult,
    description: MBTI_DESCRIPTIONS[scoredResult.type]
  }
})
      });
      console.log("✅ MBTI Result saved!");
    } catch (err) {
      console.error("❌ Failed to save MBTI result:", err);
    }
  };

  const handleNext = () => {
    if (!answers[step]) return;
    if (step < questionList.length - 1) {
      setStep((s) => s + 1);
    } else {
      const scored = scoreMbti(answers);
      setResult(scored);
      saveTestResult(scored); // <--- TRIGGER SAVE
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (!test) return <div className="quiz-page">Test not found.</div>;

  // ✅ RESULT SCREEN (when result exists)
  if (result) {
    const info = MBTI_DESCRIPTIONS[result.type];

    const letterMap = {
      E: "Extraverted",
      I: "Introverted",
      S: "Sensing",
      N: "Intuitive",
      T: "Thinking",
      F: "Feeling",
      J: "Judging",
      P: "Perceiving",
    };

    return (
      <div
        style={{
          minHeight: "60vh",
          marginTop: "100px", // pushes below navbar
          background: "var(--bg-main)",
          padding: "2rem 1rem 3rem 1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            padding: "2rem 1.8rem",
            maxWidth: 540,
            borderRadius: 20,
            boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "var(--accent)",
              letterSpacing: "0.18em",
            }}
          >
            {result.type}
          </div>

          {info && (
            <>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginTop: "1rem",
                }}
              >
                {info.label}
              </div>

              <p
                style={{
                  color: "var(--text-muted)",
                  marginTop: "1rem",
                }}
              >
                {info.text}
              </p>
            </>
          )}

          <div style={{ marginTop: "1rem", color: "var(--accent)" }}>
            ✅ Result saved to your profile!
          </div>
          <button
  onClick={() => navigate("/profile")}
  style={{
    marginTop: "1.2rem",
    padding: "0.7rem 2rem",
    borderRadius: "10px",
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  }}
>
  Go to Profile
</button>
        </div>
      </div>
    );
  }

 // ✅ QUESTION SCREEN – title & description inside the card, description in a <div>
  return (
    <div
      style={{
        minHeight: "100vh",
        marginTop: "60px",
        background: "var(--bg-main)",
        padding: "1rem 1rem 3.5rem 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
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
            gap: "1.8rem",
          }}
        >
          {/* Title & Description inside card – description is in a <div> */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--text-main)",
                marginBottom: "0.8rem",
              }}
            >
              {test?.name || "MBTI Personality Test"}
            </h1>
            {/* Description Box */}
<div
  style={{
   background: "rgba(34, 197, 94, 0.08)",
      border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: "14px",
    padding: "1.2rem 1.4rem",
    color: "var(--text-muted)",
    fontSize: "1rem",
    lineHeight: "1.6",
  }}
>
  This test measures your personality preferences across four key dimensions.
  <br />
  Answer honestly to discover how you naturally think, interact, and make decisions.
</div>
          </div>


        {/* ===== Question Number ===== */}
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "1rem",
          }}
        >
          Question {step + 1} of {questionList.length}
        </div>

        {/* ===== Progress Bar ===== */}
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
              background: "var(--accent)",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* ===== Question Text ===== */}
        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-main)",
          }}
        >
          {questionList[step].question}
        </div>

        {/* ===== Options Form ===== */}
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
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
                  marginRight: 20,
                  accentColor: "var(--accent)",
                  cursor: "pointer",
                }}
              />
              {opt}
            </label>
          ))}
        </form>

        {/* ===== Navigation Buttons ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          {step > 0 && (
            <button
              type="button"
              className="cta-btn"
              style={{
                background: "#222a22",
                color: "#fff",
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
            {step < questionList.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
