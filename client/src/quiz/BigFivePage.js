// // src/quiz/BigFivePage.js
// import React, { useState } from "react";
// import { ALL_TESTS } from "../data/allTests";
// import getApiBaseUrl from "../utils/api"; 

// const TEST_ID = "bigfive";

// const OPTIONS = [
//   "Disagree",
//   "Slightly Disagree",
//   "Neutral",
//   "Slightly Agree",
//   "Agree",
// ];

// const QUESTIONS = [
//   { question: "I am the life of the party.", options: OPTIONS },
//   { question: "I feel little concern for others.", options: OPTIONS },
//   { question: "I am always prepared.", options: OPTIONS },
//   { question: "I get stressed out easily.", options: OPTIONS },
//   { question: "I have a rich vocabulary.", options: OPTIONS },
//   { question: "I don't talk a lot.", options: OPTIONS },
//   { question: "I am interested in people.", options: OPTIONS },
//   { question: "I leave my belongings around.", options: OPTIONS },
//   { question: "I am relaxed most of the time.", options: OPTIONS },
//   { question: "I have difficulty understanding abstract ideas.", options: OPTIONS },
//   { question: "I feel comfortable around people.", options: OPTIONS },
//   { question: "I insult people.", options: OPTIONS },
//   { question: "I pay attention to details.", options: OPTIONS },
//   { question: "I worry about things.", options: OPTIONS },
//   { question: "I have a vivid imagination.", options: OPTIONS },
//   { question: "I keep in the background.", options: OPTIONS },
//   { question: "I sympathize with others' feelings.", options: OPTIONS },
//   { question: "I make a mess of things.", options: OPTIONS },
//   { question: "I seldom feel blue.", options: OPTIONS },
//   { question: "I am not interested in abstract ideas.", options: OPTIONS },
//   { question: "I start conversations.", options: OPTIONS },
//   { question: "I am not interested in other people's problems.", options: OPTIONS },
//   { question: "I get chores done right away.", options: OPTIONS },
//   { question: "I am easily disturbed.", options: OPTIONS },
//   { question: "I have excellent ideas.", options: OPTIONS },
//   { question: "I have little to say.", options: OPTIONS },
//   { question: "I have a soft heart.", options: OPTIONS },
//   { question: "I often forget to put things back in their proper place.", options: OPTIONS },
//   { question: "I get upset easily.", options: OPTIONS },
//   { question: "I do not have a good imagination.", options: OPTIONS },
//   { question: "I talk to a lot of different people at parties.", options: OPTIONS },
//   { question: "I am not really interested in others.", options: OPTIONS },
//   { question: "I like order.", options: OPTIONS },
//   { question: "I change my mood a lot.", options: OPTIONS },
//   { question: "I am quick to understand things.", options: OPTIONS },
//   { question: "I don't like to draw attention to myself.", options: OPTIONS },
//   { question: "I take time out for others.", options: OPTIONS },
//   { question: "I shirk my duties.", options: OPTIONS },
//   { question: "I have frequent mood swings.", options: OPTIONS },
//   { question: "I use difficult words.", options: OPTIONS },
//   { question: "I dont mind being the center of attention.", options: OPTIONS },
//   { question: "I feel others' emotions.", options: OPTIONS },
//   { question: "I follow a schedule.", options: OPTIONS },
//   { question: "I get irritated easily.", options: OPTIONS },
//   { question: "I spend time reflecting on things.", options: OPTIONS },
//   { question: "I am quiet around strangers.", options: OPTIONS },
//   { question: "I make people feel at ease.", options: OPTIONS },
//   { question: "I am exacting in my work.", options: OPTIONS },
//   { question: "I often feel blue.", options: OPTIONS },
//   { question: "I am full of ideas.", options: OPTIONS },
// ];

// // map option string → numeric rating 1–5
// function optionToValue(opt) {
//   const index = OPTIONS.indexOf(opt);
//   // 0 → 1, 4 → 5
//   return index === -1 ? 0 : index + 1;
// }

// // answers is an object {0: "Disagree", 1: "...", ...}
// function scoreBigFive(answers) {
//   const get = (n) => {
//     const opt = answers[n - 1];
//     return optionToValue(opt);
//   };

//   const E = 20 + get(1) - get(6) + get(11) - get(16) + get(21) - get(26) + get(31) - get(36) + get(41) - get(46);
//   const A = 14 - get(2) + get(7) - get(12) + get(17) - get(22) + get(27) - get(32) + get(37) + get(42) + get(47);
//   const C = 14 + get(3) - get(8) + get(13) - get(18) + get(23) - get(28) + get(33) - get(38) + get(43) + get(48);
//   const N = 38 - get(4) + get(9) - get(14) + get(19) - get(24) - get(29) - get(34) - get(39) - get(44) - get(49);
//   const O = 8 + get(5) - get(10) + get(15) - get(20) + get(25) - get(30) + get(35) + get(40) + get(45) + get(50);

//   const traits = { E, A, C, N, O };

//   const describe = (score) => {
//     if (score >= 30) return "High";
//     if (score >= 20) return "Average";
//     return "Low";
//   };

//   return {
//     raw: traits,
//     description: {
//       Extraversion: describe(E),
//       Agreeableness: describe(A),
//       Conscientiousness: describe(C),
//       Neuroticism: describe(N),
//       Openness: describe(O),
//     },
//   };
// }

// function BigFivePage() {
//   const test = ALL_TESTS.find((t) => t.id === TEST_ID);
//   const questionList = QUESTIONS;

//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);

//   const progress = Math.round(((step + 1) / questionList.length) * 100);

//   // ✅ USE ENV VARIABLE
//   const API_URL =  getApiBaseUrl(); 
// ;

//   // --- NEW: Helper to save result to backend ---
//   const saveTestResult = async (scoredResult) => {
//     const token = localStorage.getItem("token");
//     if (!token) return; // Not logged in

//     try {
//       await fetch(`${API_URL}/tests/save`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": token
//         },
//         body: JSON.stringify({
//           testName: test?.name || "Big Five Test",
//           result: scoredResult // Save the whole object (raw scores + descriptions)
//         })
//       });
//       console.log("✅ Test result saved successfully!");
//     } catch (err) {
//       console.error("❌ Failed to save test result:", err);
//     }
//   };
//   // ---------------------------------------------

//   const handleNext = () => {
//     if (!answers[step]) return;
//     if (step < questionList.length - 1) {
//       setStep((s) => s + 1);
//     } else {
//       const scored = scoreBigFive(answers);
//       setResult(scored);
//       saveTestResult(scored); // <--- We trigger the save here!
//     }
//   };

//   const handleBack = () => {
//     if (step > 0) setStep((s) => s - 1);
//   };

//   if (!test) {
//     return <div className="quiz-page">Test not found.</div>;
//   }

//   // Result screen
//   if (result) {
//     return (
//    <div
//     style={{
//      minHeight: "100vh",
// paddingTop: "150px",   // push below fixed header
// display: "flex",
// flexDirection: "column",
// alignItems: "center",
// justifyContent: "flex-start",   // 🔥 IMPORTANT
// background: "var(--bg-main)",
// paddingLeft: "1rem",
// paddingRight: "1rem",
// paddingBottom: "3.5rem",

//     }}
//   >


//         <div
//           style={{
//             background: "var(--bg-card)",
//             padding: "3rem 2.5rem",
//             width: "95%",
//             maxWidth: "800px",
//             borderRadius: 20,
//             boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
//             display: "flex",
//             flexDirection: "column",
//             gap: "1.4rem",
//           }}
//         >
//           <div
//             style={{
//               fontWeight: 700,
//               fontSize: "1.35rem",
//               color: "var(--text-main)",
//             }}
//           >
//             {test.name} – Your Personality Profile
//           </div>

//           <p style={{ color: "var(--text-muted)", fontSize: "0.98rem" }}>
//             Scores range from 0 to 40. Higher scores mean you show more of that
//             trait.
//           </p>

//           <ul
//             style={{
//               listStyle: "none",
//               padding: 0,
//               margin: 0,
//               display: "flex",
//               flexDirection: "column",
//               gap: "0.6rem",
//             }}
//           >
//             <li>
//               <strong>Extraversion (E):</strong> {result.raw.E} (
//               {result.description.Extraversion})
//             </li>
//             <li>
//               <strong>Agreeableness (A):</strong> {result.raw.A} (
//               {result.description.Agreeableness})
//             </li>
//             <li>
//               <strong>Conscientiousness (C):</strong> {result.raw.C} (
//               {result.description.Conscientiousness})
//             </li>
//             <li>
//               <strong>Neuroticism (N):</strong> {result.raw.N} (
//               {result.description.Neuroticism})
//             </li>
//             <li>
//               <strong>Openness (O):</strong> {result.raw.O} (
//               {result.description.Openness})
//             </li>
//           </ul>

//           <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)", textAlign: "center" }}>
//             ✅ Result saved to your profile!
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Question screen
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
//           width: "95%",
//           maxWidth: "800px",
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
//                 border: `2px solid ${answers[step] === opt
//                     ? "var(--accent)"
//                     : "var(--input-border)"
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

// export default BigFivePage;


// src/quiz/BigFivePage.js

import React, { useState, useEffect } from "react";
import { ALL_TESTS } from "../data/allTests";
import getApiBaseUrl from "../utils/api"; 

const TEST_ID = "bigfive";

const OPTIONS = [
  "Disagree",
  "Slightly Disagree",
  "Neutral",
  "Slightly Agree",
  "Agree",
];

const QUESTIONS = [
{ question: "I make social gatherings more fun.", options: OPTIONS },
  { question: "I feel little concern for others.", options: OPTIONS },
  { question: "I like to be well-organized and prepared.", options: OPTIONS },
  { question: "I get stressed out easily.", options: OPTIONS },
  { question: "I have a rich vocabulary.", options: OPTIONS },
  { question: "I don't talk a lot.", options: OPTIONS },
  { question: "I am interested in people.", options: OPTIONS },
  { question: "I leave my belongings around.", options: OPTIONS },
  { question: "I am relaxed most of the time.", options: OPTIONS },
{ question: "I find it hard to understand complex ideas.", options: OPTIONS },
  { question: "I feel comfortable around people.", options: OPTIONS },
{ question: "I can be rude to others at times.", options: OPTIONS },
  { question: "I pay attention to details.", options: OPTIONS },
  { question: "I worry about things.", options: OPTIONS },
  { question: "I have a vivid imagination.", options: OPTIONS },
{ question: "I tend to stay behind rather than stand out.", options: OPTIONS },
  { question: "I sympathize with others' feelings.", options: OPTIONS },
  { question: "I make a mess of things.", options: OPTIONS },
{ question: "I often feel confident about my abilities.", options: OPTIONS },
  { question: "I am not interested in abstract ideas.", options: OPTIONS },
{ question: "I take the lead in starting conversations.", options: OPTIONS },
  { question: "I am not interested in other people's problems.", options: OPTIONS },
  { question: "I get chores done right away.", options: OPTIONS },
  { question: "I am easily disturbed.", options: OPTIONS },
  { question: "I have excellent ideas.", options: OPTIONS },
  { question: "I have little to say.", options: OPTIONS },
  { question: "I have a soft heart.", options: OPTIONS },
  { question: "I often forget to put things back in their proper place.", options: OPTIONS },
  { question: "I get upset easily.", options: OPTIONS },
  { question: "I do not have a good imagination.", options: OPTIONS },
  { question: "I talk to a lot of different people at parties.", options: OPTIONS },
  { question: "I am not really interested in others.", options: OPTIONS },
{ question: "I like things to be organized.", options: OPTIONS },
  { question: "I change my mood a lot.", options: OPTIONS },
  { question: "I am quick to understand things.", options: OPTIONS },
  { question: "I don't like to draw attention to myself.", options: OPTIONS },
  { question: "I take time out for others.", options: OPTIONS },
{ question: "I avoid my responsibilities.", options: OPTIONS },
  { question: "I have frequent mood swings.", options: OPTIONS },
  { question: "I use difficult words.", options: OPTIONS },
  { question: "I dont mind being the center of attention.", options: OPTIONS },
  { question: "I feel others' emotions.", options: OPTIONS },
  { question: "I follow a schedule.", options: OPTIONS },
  { question: "I get irritated easily.", options: OPTIONS },
  { question: "I spend time reflecting on things.", options: OPTIONS },
  { question: "I am quiet around strangers.", options: OPTIONS },
  { question: "I make people feel at ease.", options: OPTIONS },
  { question: "I am exacting in my work.", options: OPTIONS },
{ question: "I feel down quite often.", options: OPTIONS },
{ question: "I often think of new ideas.", options: OPTIONS },
];

// map option string → numeric rating 1–5
function optionToValue(opt) {
  const index = OPTIONS.indexOf(opt);
  // 0 → 1, 4 → 5
  return index === -1 ? 0 : index + 1;
}

// answers is an object {0: "Disagree", 1: "...", ...}
function scoreBigFive(answers) {
  const get = (n) => {
    const opt = answers[n - 1];
    return optionToValue(opt);
  };

  const E = 20 + get(1) - get(6) + get(11) - get(16) + get(21) - get(26) + get(31) - get(36) + get(41) - get(46);
  const A = 14 - get(2) + get(7) - get(12) + get(17) - get(22) + get(27) - get(32) + get(37) + get(42) + get(47);
  const C = 14 + get(3) - get(8) + get(13) - get(18) + get(23) - get(28) + get(33) - get(38) + get(43) + get(48);
  const N = 38 - get(4) + get(9) - get(14) + get(19) - get(24) - get(29) - get(34) - get(39) - get(44) - get(49);
  const O = 8 + get(5) - get(10) + get(15) - get(20) + get(25) - get(30) + get(35) + get(40) + get(45) + get(50);

  const traits = { E, A, C, N, O };

  const describe = (score) => {
    if (score >= 30) return "High";
    if (score >= 20) return "Average";
    return "Low";
  };

  return {
    raw: traits,
    description: {
      Extraversion: describe(E),
      Agreeableness: describe(A),
      Conscientiousness: describe(C),
      Neuroticism: describe(N),
      Openness: describe(O),
    },
  };
}

function BigFivePage() {
  const test = ALL_TESTS.find((t) => t.id === TEST_ID);
  const questionList = QUESTIONS;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const progress = Math.round(((step + 1) / questionList.length) * 100);

  // ✅ USE ENV VARIABLE
  const API_URL =  getApiBaseUrl(); 
;

  // --- NEW: Helper to save result to backend ---
  const saveTestResult = async (scoredResult) => {
    const token = localStorage.getItem("token");
    if (!token) return; // Not logged in

    try {
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
testName: "Big Five Personality Test",
          result: scoredResult // Save the whole object (raw scores + descriptions)
        })
      });
      console.log("✅ Test result saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save test result:", err);
    }
  };
  // ---------------------------------------------

  const handleNext = () => {
    if (!answers[step]) return;
    if (step < questionList.length - 1) {
      setStep((s) => s + 1);
    } else {
      const scored = scoreBigFive(answers);
      setResult(scored);
      saveTestResult(scored);
        window.scrollTo(0, 0); // <--- We trigger the save here!
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (!test) {
    return <div className="quiz-page">Test not found.</div>;
  }

  // Result screen
  if (result) {
    return (
   <div
    style={{
     minHeight: "100vh",
paddingTop: "150px",   // push below fixed header
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "flex-start",   // 🔥 IMPORTANT
background: "var(--bg-main)",
paddingLeft: "1rem",
paddingRight: "1rem",
paddingBottom: "3.5rem",

    }}
  >


        <div
          style={{
            background: "var(--bg-card)",
            padding: "3rem 2.5rem",
            width: "95%",
            maxWidth: "800px",
            borderRadius: 20,
            boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.35rem",
              color: "var(--text-main)",
            }}
          >
            {test.name} – Your Personality Profile
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.98rem" }}>
            Scores range from 0 to 40. Higher scores mean you show more of that
            trait.
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <li>
              <strong>Extraversion (E):</strong> {result.raw.E} (
              {result.description.Extraversion})
            </li>
            <li>
              <strong>Agreeableness (A):</strong> {result.raw.A} (
              {result.description.Agreeableness})
            </li>
            <li>
              <strong>Conscientiousness (C):</strong> {result.raw.C} (
              {result.description.Conscientiousness})
            </li>
            <li>
              <strong>Neuroticism (N):</strong> {result.raw.N} (
              {result.description.Neuroticism})
            </li>
            <li>
              <strong>Openness (O):</strong> {result.raw.O} (
              {result.description.Openness})
            </li>
          </ul>

          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)", textAlign: "center" }}>
            ✅ Result saved to your profile!
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  return (
  <div
    style={{
      minHeight: "100vh",
      paddingTop: "140px", // space below navbar
      background: "var(--bg-main)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingBottom: "3rem",
    }}
  >
      <div
        style={{
          background: "var(--bg-card)",
          padding: "3rem 2.5rem",
          width: "95%",
          maxWidth: "800px",
          borderRadius: 20,
          boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          gap: "1.8rem",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
  <div
    style={{
      fontWeight: 700,
      fontSize: "1.5rem",
      color: "var(--text-main)",
      marginBottom: "0.6rem",
    }}
  >
    {test.name}
  </div>
<br/>
  {/* Description Box */}
  <div
    style={{
      background: "rgba(34, 197, 94, 0.08)",
      border: "1px solid rgba(34, 197, 94, 0.3)",
      borderRadius: "12px",
      padding: "0.8rem 1rem",
    }}
  >
    <p
      style={{
        color: "var(--text-muted)",
        fontSize: "0.95rem",
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      This test measures five key dimensions of your personality.

    </p>
    <p
      style={{
        color: "var(--text-muted)",
        fontSize: "0.95rem",
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      Answer honestly to discover how you naturally think, feel, and behave.
    </p>
  </div>
</div>
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          Question {step + 1} of {questionList.length}
        </div>
        <div
          style={{
            height: 10,
            background: "rgba(33,46,35,0.7)",
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: "1.5rem",
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
        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-main)",
          }}
        >
          {questionList[step].question}
        </div>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {questionList[step].options.map((opt) => (
            <label
              key={opt}
              style={{
                background:
                  answers[step] === opt ? "var(--accent)" : "var(--bg-accent)",
                color:
                  answers[step] === opt
                    ? "var(--btn-text)"
                    : "var(--text-main)",
                border: `2px solid ${answers[step] === opt
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
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
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
            style={{ padding: "0.6rem 2.2rem", borderRadius: 12 }}
            onClick={handleNext}
          >
            {step < questionList.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BigFivePage;
