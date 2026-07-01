// import React, { useState } from "react";
// import { ALL_TESTS } from "../data/allTests";
// import getApiBaseUrl from "../utils/api"; 

// const TEST_ID = "leftright";

// const STATEMENTS = [
//   "I have no trouble making decisions about the correct thing to do.",
//   "I see problems or pictures as a whole rather than in parts or details.",
//   "I follow written directions best and prefer to write and talk.",
//   "I often think of many things at once rather than thinking through one idea at a time.",
//   "I'm usually aware of the time.",
//   "When I’m introduced to someone for the first time, I pay particular attention to the person’s face. I later forget the person’s name, but I remember his or her face.",
//   "I attack most problem-solving activities analytically and logically.",
//   "When comparing things, I usually look for ways they are alike rather than ways they are different.",
//   "I’d rather take a true/false, multiple-choice or matching test than an essay test.",
//   "Most often, I use my imagination and I think in an abstract manner.",
//   "If I have a problem, I break it down into smaller, more manageable parts in order to arrive at the solution.",
//   "I seem to learn best if I can observe a demonstration or read the directions.",
//   "Generally, I like to be in control of a situation and I do not like to take too many risks.",
//   "I like assignments that are open-ended rather than more structured assignments.",
//   "I learn best by seeing and hearing.",
//   "I learn best by touching or doing.",
//   "I usually think in concrete patterns and solve problems with a step-by-step approach.",
//   "If I try to remember information, I generally picture it in my mind.",
//   "Although I sometimes get upset, I am a rational person.",
//   "I don’t mind trying anything once; I take risks when it is necessary.",
//   "Sometimes I talk to myself in order to think or learn something.",
//   "I can let my feelings “go.”  I am considered to be somewhat emotional.",
//   "I solve problems on an intellectual basis rather than an intuitive one.",
//   "People have told me that I’m creative.",
//   "I prefer to think of one thing at a time.",
//   "I like to act in a spontaneous manner.",
//   "I prefer to plan things and know what’s going to happen ahead of time.",
//   "I can easily remember melodies and tunes.",
//   "I am usually in control of my feelings.",
//   "I do well in geometry and geography.",
//   "I usually can recall information I need quickly and easily.",
//   "I enjoy reading and writing poetry; it comes to me easily.",
//   "I can really concentrate when I want to.",
//   "When I work in a group, I can “feel” the moods of others.",
//   "I understand mathematical concepts.",
//   "When solving problems or taking tests, I rely on one idea leading to another in order to come to a conclusion.",
//   "I can learn new vocabulary words easily.",
//   "When I plan a party, I “hang loose” rather than plan all of the details.",
//   "I usually can learn easily from any teacher.",
//   "In class I’m generally aware of what everyone is doing.",
//   "I notice and remember details.",
//   "I can easily see the whole picture when only a few puzzle pieces are in place.",
//   "I don’t mind practicing something repeatedly in order to master it.",
//   "I communicate best with someone “in person” rather than on the phone.",
//   "I can remember jokes and punch lines.",
//   "I have trouble concentrating when I know I should.",
//   "I can write directions in a clear and logical manner.",
//   "I sometimes rely on my intuition when making decisions.",
//   "I basically have a day-to-day routine.",
//   "I sometimes can remember things according to where I “saw” them on the page.",
// ];

// // Count selected statements: odd = left brain, even = right brain
// function scoreLeftRightBrain(selectedCount) {
//   const isRightBrain = selectedCount % 2 === 0; // even
//   const dominance = isRightBrain ? "Right Brain" : "Left Brain";

//   const careers = isRightBrain
//     ? [
//         "Teacher / Speaker / Manager",
//         "Writer / Author",
//         "Designer / Architect",
//         "Psychologist / Therapist",
//         "Computer Programmer",
//         "Fashion Designer",
//         "Animator / UI-UX Designer",
//         "Scientist / Researcher",
//       ]
//     : [
//         "Lawyer / Judge / Paralegal",
//         "Engineer / Technologist",
//         "Finance and Accountant",
//         "Statistician / Mathematician",
//         "Doctor / Medical Professional",
//         "Computer Programmer",
//         "Project Leader",
//         "Scientist / Researcher",
//       ];

//   return {
//     total: selectedCount,
//     dominance,
//     isRightBrain,
//     careers,
//     description: `You selected ${selectedCount} statement${selectedCount !== 1 ? "s" : ""}, indicating a ${dominance} dominance.`,
//   };
// }

// function LeftRightBrainPage() {
//   const test = ALL_TESTS.find((t) => t.id === TEST_ID);

//   const [selected, setSelected] = useState(new Set());
//   const [result, setResult] = useState(null);

//   // ✅ USE ENV VARIABLE
//   const API_URL = getApiBaseUrl(); 
// ;

//   // Toggle statement selection
//   const toggleStatement = (index) => {
//     const newSelected = new Set(selected);
//     if (newSelected.has(index)) {
//       newSelected.delete(index);
//     } else {
//       newSelected.add(index);
//     }
//     setSelected(newSelected);
//   };

//   // --- Helper to save result to backend ---
//   const saveTestResult = async (scoredResult) => {
//     const token = localStorage.getItem("token");
//     if (!token) return; // Not logged in

//     try {
//       await fetch(`${API_URL}/tests/save`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//        Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           testName: test?.name || "Left/Right Brain Test",
//           result: scoredResult
//         })
//       });
//       console.log("✅ Test result saved successfully!");
//     } catch (err) {
//       console.error("❌ Failed to save test result:", err);
//     }
//   };

//   const handleSubmit = () => {
//     if (selected.size === 0) {
//       alert("Please select at least one statement that resonates with you.");
//       return;
//     }
//     const scored = scoreLeftRightBrain(selected.size);
//     setResult(scored);
//     saveTestResult(scored);
//   };

//   const handleRetake = () => {
//     setSelected(new Set());
//     setResult(null);
//   };

//   if (!test) {
//     return <div className="quiz-page">Test not found.</div>;
//   }

//   // Result screen
//   if (result) {
//     return (
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
//             {test.name} – Your Brain Dominance Profile
//           </div>

//           <p style={{ color: "var(--text-muted)", fontSize: "0.98rem" }}>
//             Based on your responses, your total score of <strong>{result.total}</strong> indicates a <strong>{result.dominance}</strong> dominance.
//           </p>

//           <div
//             style={{
//               background: "rgba(34, 197, 94, 0.1)",
//               border: "2px solid var(--accent)",
//               borderRadius: "12px",
//               padding: "1.5rem",
//               textAlign: "center",
//             }}
//           >
//             <h3 style={{ fontSize: "1.8rem", color: "var(--accent)", margin: "0 0 0.5rem 0" }}>
//               {result.dominance}
//             </h3>
//             <p style={{ margin: "0.5rem 0 1rem 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
//               {result.isRightBrain
//                 ? "You tend to think holistically, creatively, and intuitively. You see the big picture and prefer visual/spatial thinking."
//                 : "You tend to think analytically, logically, and sequentially. You excel at detail-oriented and linear thinking."}
//             </p>
//           </div>

//           {/* Career Suggestions */}
//           <div
//             style={{
//               background: "rgba(34, 197, 94, 0.05)",
//               border: "1px solid rgba(34, 197, 94, 0.3)",
//               borderRadius: "12px",
//               padding: "1.5rem",
//             }}
//           >
//             <h4 style={{ fontSize: "1.1rem", color: "var(--accent)", marginTop: 0, marginBottom: "1rem" }}>
//               🎯 Ideal Career Paths for You
//             </h4>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "0.8rem",
//               }}
//             >
//               {result.careers.map((career, idx) => (
//                 <div
//                   key={idx}
//                   style={{
//                     background: "var(--bg-card)",
//                     padding: "0.8rem",
//                     borderRadius: "8px",
//                     border: "1px solid rgba(34, 197, 94, 0.2)",
//                     fontSize: "0.9rem",
//                     color: "var(--text-primary)",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "0.5rem",
//                   }}
//                 >
//                   <span style={{ color: "var(--accent)", fontWeight: "600" }}>✓</span>
//                   {career}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)", textAlign: "center" }}>
//             ✅ Result saved to your profile!
//           </div>

         
//         </div>
//       </div>
//     );
//   }

//   // Question screen - all statements visible
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
//           maxWidth: "850px",
//           borderRadius: 20,
//           boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
//         }}
//       >
//         <div style={{ marginBottom: "2rem" }}>
//           <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-main)" }}>
//             {test.name}
//           </h1>
//           <p style={{ color: "var(--text-muted)", margin: 0 }}>
//             Select the statements that resonate with you. Select as many as apply!
//           </p>
//         </div>

//         <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2.5rem" }}>
//           {STATEMENTS.map((statement, idx) => (
//             <div
//               key={idx}
//               onClick={() => toggleStatement(idx)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "1rem",
//                 padding: "1.2rem",
//                 background: selected.has(idx) ? "rgba(34, 197, 94, 0.1)" : "transparent",
//                 border: `2px solid ${selected.has(idx) ? "var(--accent)" : "rgba(34, 197, 94, 0.3)"}`,
//                 borderRadius: "12px",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//               }}
//               onMouseEnter={(e) => {
//                 if (!selected.has(idx)) {
//                   e.currentTarget.style.borderColor = "var(--accent)";
//                   e.currentTarget.style.background = "rgba(34, 197, 94, 0.05)";
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!selected.has(idx)) {
//                   e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.3)";
//                   e.currentTarget.style.background = "transparent";
//                 }
//               }}
//             >
//               {/* Circular Selection Button */}
//               <div
//                 style={{
//                   width: "32px",
//                   height: "32px",
//                   borderRadius: "50%",
//                   border: `3px solid ${selected.has(idx) ? "var(--accent)" : "rgba(34, 197, 94, 0.5)"}`,
//                   background: selected.has(idx) ? "var(--accent)" : "transparent",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                   transition: "all 0.2s ease",
//                 }}
//               >
//                 {selected.has(idx) && (
//                   <div
//                     style={{
//                       width: "6px",
//                       height: "12px",
//                       border: "solid white",
//                       borderWidth: "0 2px 2px 0",
//                       transform: "rotate(45deg)",
//                     }}
//                   />
//                 )}
//               </div>
              
//               {/* Statement Text with numbering */}
//               <span
//                 style={{
//                   fontSize: "1rem",
//                   color: selected.has(idx) ? "var(--accent)" : "var(--text-main)",
//                   fontWeight: selected.has(idx) ? "600" : "400",
//                   display: "inline-flex",
//                   alignItems: "flex-start",
//                   gap: "0.5rem",
//                 }}
//               >
//                 <strong style={{ color: selected.has(idx) ? "var(--accent)" : "var(--text-muted)", minWidth: 20 }}>
//                   {idx + 1}.
//                 </strong>
//                 <span style={{ display: "inline-block" }}>{statement}</span>
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Info Box */}
//         <div
//           style={{
//             background: "rgba(34, 197, 94, 0.08)",
//             border: "1px solid rgba(34, 197, 94, 0.3)",
//             borderRadius: "8px",
//             padding: "1rem",
//             marginBottom: "1.5rem",
//             fontSize: "0.9rem",
//             color: "var(--text-secondary)",
//           }}
//         >
//           <strong>Selected: {selected.size} of {STATEMENTS.length}</strong> statements
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={handleSubmit}
//           style={{
//             width: "100%",
//             padding: "1rem",
//             background: selected.size > 0 ? "var(--accent)" : "var(--bg-main)",
//             color: selected.size > 0 ? "white" : "var(--text-muted)",
//             border: "none",
//             borderRadius: "8px",
//             cursor: selected.size > 0 ? "pointer" : "not-allowed",
//             fontSize: "1.1rem",
//             fontWeight: "600",
//             opacity: selected.size > 0 ? 1 : 0.5,
//             transition: "all 0.2s ease",
//           }}
//           onMouseEnter={(e) => {
//             if (selected.size > 0) e.target.style.transform = "scale(1.02)";
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.transform = "scale(1)";
//           }}
//         >
//           Submit & Get Results
//         </button>
//       </div>
//     </div>
//   );
// }

// export default LeftRightBrainPage;


import React, { useState, useEffect } from "react";
import { ALL_TESTS } from "../data/allTests";
import getApiBaseUrl from "../utils/api"; 
import { useNavigate } from "react-router-dom";
// ✅ USE CLEAN PROFESSIONAL IMAGES (make sure these files are high quality)
import leftBrainImg from "../assets/leftbrain.jpeg";
import rightBrainImg from "../assets/rightbrain.jpeg";

const TEST_ID = "leftright";

const STATEMENTS = [
  "I have no trouble making decisions about the correct thing to do.",
  "I see problems or pictures as a whole rather than in parts or details.",
  "I follow written directions best and prefer to write and talk.",
  "I often think of many things at once rather than thinking through one idea at a time.",
  "I'm usually aware of the time.",
  "When I’m introduced to someone for the first time, I pay particular attention to the person’s face. I later forget the person’s name, but I remember his or her face.",
  "I attack most problem-solving activities analytically and logically.",
  "When comparing things, I usually look for ways they are alike rather than ways they are different.",
  "I’d rather take a true/false, multiple-choice or matching test than an essay test.",
  "Most often, I use my imagination and I think in an abstract manner.",
  "If I have a problem, I break it down into smaller, more manageable parts in order to arrive at the solution.",
  "I seem to learn best if I can observe a demonstration or read the directions.",
  "Generally, I like to be in control of a situation and I do not like to take too many risks.",
  "I like assignments that are open-ended rather than more structured assignments.",
  "I learn best by seeing and hearing.",
  "I learn best by touching or doing.",
  "I usually think in concrete patterns and solve problems with a step-by-step approach.",
  "If I try to remember information, I generally picture it in my mind.",
  "Although I sometimes get upset, I am a rational person.",
  "I don’t mind trying anything once; I take risks when it is necessary.",
  "Sometimes I talk to myself in order to think or learn something.",
  "I can let my feelings “go.”  I am considered to be somewhat emotional.",
  "I solve problems on an intellectual basis rather than an intuitive one.",
  "People have told me that I’m creative.",
  "I prefer to think of one thing at a time.",
  "I like to act in a spontaneous manner.",
  "I prefer to plan things and know what’s going to happen ahead of time.",
  "I can easily remember melodies and tunes.",
  "I am usually in control of my feelings.",
  "I do well in geometry and geography.",
  "I usually can recall information I need quickly and easily.",
  "I enjoy reading and writing poetry; it comes to me easily.",
  "I can really concentrate when I want to.",
  "When I work in a group, I can “feel” the moods of others.",
  "I understand mathematical concepts.",
  "When solving problems or taking tests, I rely on one idea leading to another in order to come to a conclusion.",
  "I can learn new vocabulary words easily.",
  "When I plan a party, I “hang loose” rather than plan all of the details.",
  "I usually can learn easily from any teacher.",
  "In class I’m generally aware of what everyone is doing.",
  "I notice and remember details.",
  "I can easily see the whole picture when only a few puzzle pieces are in place.",
  "I don’t mind practicing something repeatedly in order to master it.",
  "I communicate best with someone “in person” rather than on the phone.",
  "I can remember jokes and punch lines.",
  "I have trouble concentrating when I know I should.",
  "I can write directions in a clear and logical manner.",
  "I sometimes rely on my intuition when making decisions.",
  "I basically have a day-to-day routine.",
  "I sometimes can remember things according to where I “saw” them on the page.",
];

// ✅ NO CHANGE IN LOGIC

// ✅ New scoring function based on total selected circles only
function scoreLeftRightBrain(selectedSet) {
  const totalSelected = selectedSet.size;

  // Odd = Left Brain, Even = Right Brain
  const isLeftBrain = totalSelected % 2 === 1;
  const dominance = isLeftBrain ? "Left Brain" : "Right Brain";

  const careers = isLeftBrain
    ? [
        "Lawyer / Judge / Paralegal",
        "Engineer / Technologist",
        "Finance and Accountant",
        "Statistician / Mathematician",
        "Doctor / Medical Professional",
        "Computer Programmer",
        "Project Leader",
        "Scientist / Researcher",
      ]
    : [
        "Teacher / Speaker / Manager",
        "Writer / Author",
        "Designer / Architect",
        "Psychologist / Therapist",
        "Computer Programmer",
        "Fashion Designer",
        "Animator / UI-UX Designer",
        "Scientist / Researcher",
      ];

  return {
    total: totalSelected,
    dominance,
    isRightBrain: !isLeftBrain,
    careers,
    description: `You are ${dominance} dominant.`,
  };
}
function LeftRightBrainPage() {
  const test = ALL_TESTS.find((t) => t.id === TEST_ID);

  const [selected, setSelected] = useState(new Set());
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const API_URL = getApiBaseUrl();

  const toggleStatement = (index) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

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
          testName: test?.name || "Left/Right Brain Test",
          result: scoredResult
        })
      });
      console.log("✅ Test result saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save test result:", err);
    }
  };

  const handleSubmit = () => {
    if (selected.size === 0) {
      alert("Please select at least one statement that resonates with you.");
      return;
    }
    const scored = scoreLeftRightBrain(selected);
    setResult(scored);
    saveTestResult(scored);
     window.scrollTo(0, 0);
  };

  const handleRetake = () => {
    setSelected(new Set());
    setResult(null);
  };

  if (!test) {
    return <div className="quiz-page">Test not found.</div>;
  }

  // ✅ RESULT SCREEN (ONLY IMAGE LINE IS IMPORTANT)
  if (result) {
    return (
      <div style={{ minHeight: "80vh", marginTop: "130px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-main)", padding: "3.5rem 1rem" }}>
        <div style={{ background: "var(--bg-card)", padding: "3rem 2.5rem", width: "95%", maxWidth: "800px", borderRadius: 20, boxShadow: "0 6px 40px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", gap: "1.4rem" }}>

          <div style={{ fontWeight: 700, fontSize: "1.35rem", color: "var(--text-main)" }}>
            {test.name} – Your Brain Dominance Profile
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.98rem" }}>
            Based on your responses, your total score of <strong>{result.total}</strong> indicates a <strong>{result.dominance}</strong> dominance.
          </p>

          {/* ✅ FINAL PROFESSIONAL IMAGE USAGE */}
          <img
            src={result.isRightBrain ? rightBrainImg : leftBrainImg}
            alt={result.isRightBrain ? "Right Brain Illustration" : "Left Brain Illustration"}
            style={{
              width: "100%",
              maxWidth: "420px",
              height: "auto",
              margin: "0 auto",
              display: "block",
              objectFit: "contain"
            }}
          />

          {/* REST OF YOUR CODE SAME — NO CHANGE */}
        <div
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "2px solid var(--accent)",
            borderRadius: "12px",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "1.8rem",
              color: "var(--accent)",
              margin: "0 0 0.5rem 0",
            }}
          >
            {result.dominance}
          </h3>
          <p
            style={{
              margin: "0.5rem 0 1rem 0",
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            {result.isRightBrain
              ? "You tend to think holistically, creatively, and intuitively. You see the big picture and prefer visual/spatial thinking."
              : "You tend to think analytically, logically, and sequentially. You excel at detail-oriented and linear thinking."}
          </p>
        </div>

        <div
          style={{
            background: "rgba(34, 197, 94, 0.05)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem",
          }}
        >
          <h4
            style={{
              fontSize: "1.1rem",
              color: "var(--accent)",
              marginTop: 0,
              marginBottom: "1rem",
            }}
          >
            🎯 Ideal Career Paths for You
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.8rem",
            }}
          >
            {result.careers.map((career, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-card)",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ color: "var(--accent)", fontWeight: "600" }}>✓</span>
                {career}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: "var(--accent)",
            textAlign: "center",
          }}
        >
          ✅ Result saved to your profile!
        </div>

   <button
  onClick={() => navigate("/profile")}
  style={{
    width: "100%",
    padding: "0.9rem",
    marginTop: "10px",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
  }}
>
  View in Profile
</button>
      </div>
    </div>
  );
}

  // Question screen - all statements visible
  return (
    <div
      style={{
        minHeight: "80vh",
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
          width: "95%",
          maxWidth: "850px",
          borderRadius: 20,
          boxShadow: "0 6px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-main)" }}>
            {test.name}
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            Select the statements that resonate with you. Select as many as apply!
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2.5rem" }}>
          {STATEMENTS.map((statement, idx) => (
            <div
              key={idx}
              onClick={() => toggleStatement(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.2rem",
                background: selected.has(idx) ? "rgba(34, 197, 94, 0.1)" : "transparent",
                border: `2px solid ${selected.has(idx) ? "var(--accent)" : "rgba(34, 197, 94, 0.3)"}`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!selected.has(idx)) {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.background = "rgba(34, 197, 94, 0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!selected.has(idx)) {
                  e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.3)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {/* Circular Selection Button */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: `3px solid ${selected.has(idx) ? "var(--accent)" : "rgba(34, 197, 94, 0.5)"}`,
                  background: selected.has(idx) ? "var(--accent)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {selected.has(idx) && (
                  <div
                    style={{
                      width: "6px",
                      height: "12px",
                      border: "solid white",
                      borderWidth: "0 2px 2px 0",
                      transform: "rotate(45deg)",
                    }}
                  />
                )}
              </div>
              
              {/* Statement Text with numbering */}
              <span
                style={{
                  fontSize: "1rem",
                  color: selected.has(idx) ? "var(--accent)" : "var(--text-main)",
                  fontWeight: selected.has(idx) ? "600" : "400",
                  display: "inline-flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                }}
              >
                <strong style={{ color: selected.has(idx) ? "var(--accent)" : "var(--text-muted)", minWidth: 20 }}>
                  {idx + 1}.
                </strong>
                <span style={{ display: "inline-block" }}>{statement}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div
          style={{
            background: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}
        >
          <strong>Selected: {selected.size} of {STATEMENTS.length}</strong> statements
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "1rem",
            background: selected.size > 0 ? "var(--accent)" : "var(--bg-main)",
            color: selected.size > 0 ? "white" : "var(--text-muted)",
            border: "none",
            borderRadius: "8px",
            cursor: selected.size > 0 ? "pointer" : "not-allowed",
            fontSize: "1.1rem",
            fontWeight: "600",
            opacity: selected.size > 0 ? 1 : 0.5,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (selected.size > 0) e.target.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          Submit & Get Results
        </button>
      </div>
    </div>
  );
}

export default LeftRightBrainPage;