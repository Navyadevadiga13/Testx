// // src/components/ProfilePage.js
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import getApiBaseUrl from "../utils/api";

// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric", month: "short", day: "numeric",
//   });
// };

// const formatTime = (dateString) => {
//   if (!dateString) return "";
//   return new Date(dateString).toLocaleTimeString("en-US", {
//     hour: "2-digit", minute: "2-digit", hour12: true,
//   });
// };

// // ── Magoosh-style score box ──
// const ScoreBox = ({ label, value, isTotal, notAttempted, date }) => (
//   <div style={{
//     background: isTotal ? "#1a7a4a" : "#e8f8f0",
//     border: `2px solid ${isTotal ? "#0d5c36" : "#b2e8cb"}`,
//     borderRadius: "10px",
//     padding: "14px 10px",
//     textAlign: "center",
//     minWidth: "90px",
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "4px",
//   }}>
//     <div style={{
//       fontSize: "0.72rem", fontWeight: "700",
//       color: isTotal ? "#a0f0c8" : "#2a7a50",
//       textTransform: "uppercase", letterSpacing: "0.8px",
//       marginBottom: "2px",
//     }}>{label}</div>
//     <div style={{
//       fontSize: isTotal ? "2rem" : "1.75rem",
//       fontWeight: "900",
//       color: isTotal ? "#ffffff" : notAttempted ? "#aaaaaa" : "#1a7a4a",
//       lineHeight: 1,
//     }}>
//       {notAttempted ? "-" : value ?? "—"}
//     </div>
//     {date && !notAttempted && (
//       <div style={{ fontSize: "0.62rem", color: isTotal ? "#80d8a8" : "#5a9a70", marginTop: "4px", fontWeight: "500" }}>
//         {formatDate(date)}<br />{formatTime(date)}
//       </div>
//     )}
//   </div>
// );

// // ── Section tab row ──
// const SectionTabs = ({ active, tabs, onChange }) => (
//   <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
//     {tabs.map((tab) => (
//       <button
//         key={tab}
//         onClick={() => onChange(tab)}
//         style={{
//           padding: "7px 18px", borderRadius: "6px",
//           fontSize: "0.85rem", fontWeight: "700", cursor: "pointer",
//           border: "none", letterSpacing: "0.2px",
//           background: active === tab ? "#222" : "#f0f0f0",
//           color: active === tab ? "#fff" : "#555",
//           transition: "all 0.15s",
//         }}
//       >{tab}</button>
//     ))}
//   </div>
// );

// // ── Improvement tip card ──
// const ImprovementCard = ({ tips }) => (
//   <ul style={{
//     margin: "16px 0 0",
//     paddingLeft: "20px",
//     fontSize: "0.88rem",
//     color: "#333",
//     lineHeight: "2",
//   }}>
//     {tips.map((tip, i) => <li key={i}>{tip}</li>)}
//   </ul>
// );

// // ── Next steps card (matches Magoosh layout) ──
// const NextStepsCard = ({ suggestions }) => (
//   <div style={{
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "16px",
//     marginTop: "20px",
//   }}>
//     <div style={{
//       background: "#f9f9f9", border: "1px solid #e0e0e0",
//       borderRadius: "10px", padding: "18px",
//     }}>
//       <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
//         NEXT STEPS
//       </div>
//       <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "10px" }}>
//         Review Your Performance
//       </div>
//       <p style={{ fontSize: "0.83rem", color: "#555", lineHeight: "1.7", margin: 0 }}>
//         Review your performance breakdown below to find areas where you can improve. Focus on sections where you scored lower to boost your overall band.
//       </p>
//     </div>
//     <div style={{
//       background: "#f9f9f9", border: "1px solid #e0e0e0",
//       borderRadius: "10px", padding: "18px",
//     }}>
//       <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
//         IMPROVEMENT TIPS
//       </div>
//       <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "10px" }}>
//         💡 Areas to Improve
//       </div>
//       {suggestions.length === 0 ? (
//         <p style={{ fontSize: "0.83rem", color: "#2a7a50", fontWeight: "600", margin: 0 }}>
//           ✅ Great job! All sections are above target.
//         </p>
//       ) : (
//         <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.82rem", color: "#555", lineHeight: "1.9" }}>
//           {suggestions.slice(0, 3).map((s, i) => (
//             <li key={i}><strong>{s.label}:</strong> {s.tips[0]}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   </div>
// );

// function ProfilePage({ onLogout }) {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [toeflTab, setToeflTab] = useState("Reading");
//   const [ieltsTab, setIeltsTab] = useState("Reading");
//   const [greTab, setGreTab] = useState("Verbal");
//   const API_URL = getApiBaseUrl();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) { if (onLogout) onLogout(); navigate("/login"); return; }
//       try {
//         const res = await fetch(`${API_URL}/auth/me`, {
//           method: "GET",
//           headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
//         });
//         const data = await res.json();
//         if (res.ok && data) {
//           setUser(data);
//         } else {
//           localStorage.removeItem("token"); localStorage.removeItem("loggedIn");
//           if (onLogout) onLogout(); navigate("/login");
//         }
//       } catch (err) {
//         console.error("Profile fetch error:", err); setError("Server error");
//       } finally { setLoading(false); }
//     };
//     fetchProfile();
//   }, [navigate, API_URL, onLogout]);

//   if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#555" }}>Loading profile...</div>;
//   if (error) return <div style={{ padding: "4rem", textAlign: "center", color: "#ff5252" }}>{error}</div>;
//   if (!user) return null;

//   // ── TOEFL ──
//   const toeflTests = (user.testHistory || []).filter((t) => t.testName && t.testName.toLowerCase().includes("toefl"));
//   let reading = null, listening = null, writing = null, speaking = null;
//   let readingDate = null, listeningDate = null, writingDate = null, speakingDate = null;
//   toeflTests.forEach((t) => {
//     const s = Number(t.result?.toeflScore) || 0;
//     const name = t.testName.toLowerCase();
//     if (name.includes("reading"))        { reading = s;   readingDate = t.date; }
//     else if (name.includes("listening")) { listening = s; listeningDate = t.date; }
//     else if (name.includes("writing"))   { writing = s;   writingDate = t.date; }
//     else if (name.includes("speaking"))  { speaking = s;  speakingDate = t.date; }
//   });
//   const toeflAttempted = [reading, listening, writing, speaking].filter(s => s !== null && s > 0);
//   const toeflTotal = toeflAttempted.reduce((a, b) => a + b, 0);
//   const anyToefl = toeflTests.length > 0;

//   const getTOEFLSuggestions = () => [
//     { label: "Reading",   score: reading,   tips: ["Practice skimming and scanning passages under time pressure.", "Read academic and news articles daily.", "Work on identifying main ideas and author's purpose."] },
//     { label: "Listening", score: listening, tips: ["Listen to TED Talks, lectures, and academic podcasts.", "Practice note-taking while listening.", "Focus on identifying key arguments and transitions."] },
//     { label: "Writing",   score: writing,   tips: ["Practice integrated and independent essay structures.", "Work on clear thesis statements and coherent paragraphs.", "Expand academic vocabulary and vary sentence structure."] },
//     { label: "Speaking",  score: speaking,  tips: ["Record yourself and listen back for clarity.", "Practice speaking on academic topics spontaneously.", "Work on pacing, pronunciation, and linking ideas."] },
//   ].filter(s => s.score !== null && s.score > 0 && s.score < 20);

//   const getTOEFLNote = (total) => {
//     if (total >= 100) return "Excellent! A score of 100+ is competitive for top universities worldwide.";
//     if (total >= 80)  return "Good score! 80+ meets requirements for many graduate and undergraduate programs.";
//     if (total >= 60)  return "Decent foundation. Focused preparation can help you reach your target score.";
//     return "Keep practising — consistent effort leads to significant improvement.";
//   };

//   const toeflSectionTips = {
//     Reading:   ["Practice skimming and scanning passages under time pressure.", "Read academic and news articles daily.", "Work on identifying main ideas and author's purpose."],
//     Listening: ["Listen to TED Talks, lectures, and academic podcasts.", "Practice note-taking while listening.", "Focus on identifying key arguments and transitions."],
//     Writing:   ["Practice integrated and independent essay structures.", "Work on clear thesis statements and coherent paragraphs.", "Expand academic vocabulary and vary sentence structure."],
//     Speaking:  ["Record yourself and listen back for clarity.", "Practice speaking on academic topics spontaneously.", "Work on pacing, pronunciation, and linking ideas."],
//   };

//   // ── IELTS ──
//   const ieltsTests = (user.testHistory || []).filter((t) => t.testName && t.testName.toLowerCase().includes("ielts"));
//   let ieltsReading = null, ieltsListening = null, ieltsWriting = null, ieltsSpeaking = null;
//   let ieltsReadingDate = null, ieltsListeningDate = null, ieltsWritingDate = null, ieltsSpeakingDate = null;

//   const calculateIELTSBand = (score, total = 40) => {
//     const scaledRaw = Math.round((score / total) * 40);
//     const bandMap = [[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[27,6.5],[23,6],[19,5.5],[15,5],[13,4.5],[10,4],[7,3.5],[5,3],[3,2.5],[1,2],[0,0]];
//     for (const [minRaw, band] of bandMap) { if (scaledRaw >= minRaw) return band; }
//     return 0;
//   };

//   ieltsTests.forEach((t) => {
//     const score = Number(t.result?.score) || 0;
//     const band = calculateIELTSBand(score);
//     const name = t.testName?.toLowerCase() || "";
//     if (name.includes("reading"))        { ieltsReading = band;   ieltsReadingDate = t.date; }
//     else if (name.includes("listening")) { ieltsListening = band; ieltsListeningDate = t.date; }
//     else if (name.includes("writing"))   { ieltsWriting = band;   ieltsWritingDate = t.date; }
//     else if (name.includes("speaking"))  { ieltsSpeaking = band;  ieltsSpeakingDate = t.date; }
//   });

//   const ieltsBands = [ieltsReading, ieltsListening, ieltsWriting, ieltsSpeaking].filter(b => b !== null);
//   const ieltsOverall = ieltsBands.length > 0 ? Math.round((ieltsBands.reduce((a, b) => a + b, 0) / ieltsBands.length) * 2) / 2 : null;

//   const getIELTSSuggestions = () => [
//     { label: "Reading",   band: ieltsReading,   tips: ["Practice skimming and scanning techniques.", "Read academic articles daily to improve speed.", "Focus on understanding passage structure and keywords."] },
//     { label: "Listening", band: ieltsListening, tips: ["Listen to podcasts, news, and lectures daily.", "Practice note-taking while listening.", "Focus on catching keywords and numbers accurately."] },
//     { label: "Writing",   band: ieltsWriting,   tips: ["Work on task response and coherence.", "Practice writing introductions and conclusions.", "Learn to use a variety of sentence structures and vocabulary."] },
//     { label: "Speaking",  band: ieltsSpeaking,  tips: ["Speak English daily, even alone.", "Record yourself and review pronunciation.", "Expand your answers with examples and opinions."] },
//   ].filter(s => s.band !== null && s.band < 6.5);

//   const getIELTSNote = (band) => {
//     if (band >= 8) return "Excellent! You have a very strong command of English. Keep it up!";
//     if (band >= 7) return "Great score! You are proficient and ready for most universities worldwide.";
//     if (band >= 6) return "Good progress! A score of 6.5+ opens doors to many international universities.";
//     if (band >= 5) return "You have a basic command of English. Consistent practice will help you reach your target band.";
//     return "Keep practising — every band improvement brings you closer to your goal!";
//   };

//   const ieltsSectionTips = {
//     Reading:   ["Practice skimming and scanning techniques.", "Read academic articles daily to improve speed.", "Focus on understanding passage structure and keywords."],
//     Listening: ["Listen to podcasts, news, and lectures daily.", "Practice note-taking while listening.", "Focus on catching keywords and numbers accurately."],
//     Writing:   ["Work on task response and coherence.", "Practice writing introductions and conclusions.", "Learn to use a variety of sentence structures and vocabulary."],
//     Speaking:  ["Speak English daily, even alone.", "Record yourself and review pronunciation.", "Expand your answers with examples and opinions."],
//   };

//   // ── GRE ──
//   const greTests = (user.testHistory || []).filter((t) => t.testName && t.testName.toLowerCase().includes("gre"));
//   let greVerbal = null, greQuant = null, greAnalytical = null;
//   let greVerbalDate = null, greQuantDate = null, greAnalyticalDate = null;
//   const convertToGRE = (raw, total = 27) => { if (raw === null || raw === undefined) return null; return Math.round(130 + (raw / total) * 40); };
//   greTests.forEach((t) => {
//     const name = t.testName?.toLowerCase() || "";
//     const raw = t.result && typeof t.result.score === "number" ? t.result.score : null;
//     if (name.includes("verbal"))                                       { greVerbal = convertToGRE(raw);  greVerbalDate = t.date; }
//     else if (name.includes("quant") || name.includes("quantitative"))  { greQuant = convertToGRE(raw);   greQuantDate = t.date; }
//     else if ((name.includes("analytical") || name.includes("awa")) && raw !== null) { greAnalytical = raw; greAnalyticalDate = t.date; }
//   });
//   const greTotal = greVerbal !== null && greQuant !== null ? greVerbal + greQuant : null;
//   const anyGRE = greTests.length > 0;

//   const getGRESuggestions = () => [
//     { label: "Verbal",       score: greVerbal,     threshold: 155, tips: ["Build vocabulary with GRE word lists daily.", "Practice reading comprehension with dense passages.", "Work on text completion and sentence equivalence."] },
//     { label: "Quantitative", score: greQuant,      threshold: 155, tips: ["Review core math concepts — algebra, geometry, statistics.", "Practice data interpretation and quantitative comparisons.", "Time yourself strictly on problem sets."] },
//     { label: "Analytical",   score: greAnalytical, threshold: 4,   tips: ["Practice Issue and Argument essay templates.", "Focus on clear thesis and well-structured arguments.", "Read sample high-scoring AWA essays for reference."] },
//   ].filter(s => s.score !== null && s.score < s.threshold);

//   const getGRENote = (total) => {
//     if (total >= 320) return "Excellent! A score of 320+ is competitive for top graduate programs worldwide.";
//     if (total >= 300) return "Good score! 300+ meets requirements for most graduate programs.";
//     if (total >= 280) return "Decent base. Focused preparation can push your score significantly higher.";
//     return "Keep practising — consistent effort leads to major improvement on the GRE.";
//   };

//   const greSectionTips = {
//     Verbal:       ["Build vocabulary with GRE word lists daily.", "Practice reading comprehension with dense passages.", "Work on text completion and sentence equivalence."],
//     Quantitative: ["Review core math concepts — algebra, geometry, statistics.", "Practice data interpretation and quantitative comparisons.", "Time yourself strictly on problem sets."],
//     Analytical:   ["Practice Issue and Argument essay templates.", "Focus on clear thesis and well-structured arguments.", "Read sample high-scoring AWA essays for reference."],
//   };

//   // ── Magoosh-style test result block ──
//   const renderTestBlock = ({ title, subtitle, scoreBoxes, totalBox, sectionTabs, activeTab, onTabChange, sectionTips, suggestions, note }) => (
//     <div style={{
//       background: "#ffffff",
//       border: "1px solid #e0e0e0",
//       borderRadius: "16px",
//       padding: "2rem",
//       marginBottom: "2rem",
//       boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//     }}>
//       {/* Header row */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
//         <div>
//           <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#111", marginBottom: "4px" }}>{title}</div>
//           <div style={{ fontSize: "0.82rem", color: "#888", fontWeight: "500" }}>{subtitle}</div>
//         </div>
//       </div>

//       {/* Score boxes row — matches Magoosh layout */}
//       <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
//         {totalBox && (
//           <ScoreBox label="Total Score" value={totalBox.value} isTotal date={totalBox.date} />
//         )}
//         {scoreBoxes.map((box) => (
//           <ScoreBox
//             key={box.label}
//             label={box.label}
//             value={box.value}
//             notAttempted={box.notAttempted}
//             date={box.date}
//           />
//         ))}
//       </div>

//       {/* Note banner */}
//       {note && (
//         <div style={{
//           marginTop: "16px", background: "#f0fbf5",
//           border: "1px solid #b2e8cb", borderRadius: "8px",
//           padding: "10px 14px", fontSize: "0.83rem", color: "#1a7a4a", fontWeight: "500",
//         }}>
//           📌 {note}
//         </div>
//       )}

//       {/* Next steps + tips */}
//       <NextStepsCard suggestions={suggestions} />

//       {/* Section Results tabs — matches Magoosh */}
//       <div style={{ marginTop: "28px" }}>
//         <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "4px" }}>Section Results</div>
//         <SectionTabs active={activeTab} tabs={sectionTabs} onChange={onTabChange} />
//         <div style={{
//           marginTop: "16px", background: "#f9f9f9",
//           border: "1px solid #e8e8e8", borderRadius: "10px", padding: "18px",
//         }}>
//           <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#333", marginBottom: "8px" }}>
//             📚 Tips for {activeTab}
//           </div>
//           <ImprovementCard tips={sectionTips[activeTab] || []} />
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "3rem 1rem" }}>
//       <div style={{
//         maxWidth: "860px", margin: "0 auto",
//         background: "#ffffff",
//         borderRadius: "20px",
//         boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
//         overflow: "hidden",
//         display: "flex", flexDirection: "column", alignItems: "center",
//       }}>

//         {/* ── HEADER (unchanged) ── */}
//         <div style={{
//           background: "linear-gradient(135deg, #0d3d26 0%, #0a2e1e 50%, #061a12 100%)",
//           padding: "3.5rem 2rem", textAlign: "center", width: "100%",
//           borderBottom: "1px solid rgba(25,253,145,0.15)",
//           position: "relative", overflow: "hidden",
//         }}>
//           <div style={{
//             position: "absolute", inset: 0, opacity: 0.04,
//             backgroundImage: "linear-gradient(#19fd91 1px, transparent 1px), linear-gradient(90deg, #19fd91 1px, transparent 1px)",
//             backgroundSize: "40px 40px",
//           }} />
//           <div style={{ position: "relative", zIndex: 1 }}>
//             <div style={{
//               width: "110px", height: "110px",
//               background: "linear-gradient(135deg, #19fd91, #0ab866)",
//               borderRadius: "50%", margin: "0 auto 1.2rem",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: "3rem", fontWeight: "900", color: "#060d16",
//               boxShadow: "0 0 40px rgba(25,253,145,0.3)",
//             }}>
//               {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
//             </div>
//             <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: "900", color: "#e8f8f0", letterSpacing: "-0.5px" }}>
//               {user.fullname || "User"}
//             </h1>
//             <p style={{ margin: "0.5rem 0 0", color: "#5a9a78", fontSize: "1rem", fontWeight: "500" }}>
//               {user.email}
//             </p>
//             {user.isVerified && (
//               <span style={{
//                 display: "inline-flex", alignItems: "center", gap: "6px",
//                 marginTop: "14px", background: "rgba(25,253,145,0.1)",
//                 border: "1px solid rgba(25,253,145,0.25)",
//                 padding: "5px 16px", borderRadius: "20px",
//                 fontSize: "0.82rem", fontWeight: "700", color: "#19fd91", letterSpacing: "0.3px",
//               }}>✅ Verified Account</span>
//             )}
//           </div>
//         </div>

//         {/* ── BODY ── */}
//         <div style={{ padding: "2.5rem 2rem", width: "100%" }}>

//           {/* Section heading */}
//           <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
//             <h2 style={{ color: "#111", margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>Test History</h2>
//             <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
//           </div>

//           {/* ── IELTS ── */}
//           {ieltsTests.length > 0 && renderTestBlock({
//             title: "Practice Test Results",
//             subtitle: `Test IELTS Practice Test · Finished ${ieltsReadingDate ? formatDate(ieltsReadingDate) : "Recently"}`,
//             totalBox: ieltsOverall ? { value: ieltsOverall, date: ieltsReadingDate } : null,
//             scoreBoxes: [
//               { label: "Reading",   value: ieltsReading,   notAttempted: ieltsReading === null,   date: ieltsReadingDate },
//               { label: "Listening", value: ieltsListening, notAttempted: ieltsListening === null, date: ieltsListeningDate },
//               { label: "Speaking",  value: ieltsSpeaking,  notAttempted: ieltsSpeaking === null,  date: ieltsSpeakingDate },
//               { label: "Writing",   value: ieltsWriting,   notAttempted: ieltsWriting === null,   date: ieltsWritingDate },
//             ],
//             sectionTabs: ["Reading", "Listening", "Speaking", "Writing"],
//             activeTab: ieltsTab,
//             onTabChange: setIeltsTab,
//             sectionTips: ieltsSectionTips,
//             suggestions: getIELTSSuggestions(),
//             note: ieltsOverall ? getIELTSNote(ieltsOverall) : null,
//           })}

//           {/* ── TOEFL ── */}
//           {anyToefl && renderTestBlock({
//             title: "Practice Test Results",
//             subtitle: `Test TOEFL Practice Test · Finished ${readingDate ? formatDate(readingDate) : "Recently"}`,
//             totalBox: toeflTotal > 0 ? { value: toeflTotal, date: readingDate } : null,
//             scoreBoxes: [
//               { label: "Reading",   value: reading !== null && reading > 0 ? `${reading}/30` : null,   notAttempted: reading === null || reading === 0,   date: readingDate },
//               { label: "Listening", value: listening !== null && listening > 0 ? `${listening}/30` : null, notAttempted: listening === null || listening === 0, date: listeningDate },
//               { label: "Speaking",  value: speaking !== null && speaking > 0 ? `${speaking}/30` : null,  notAttempted: speaking === null || speaking === 0,  date: speakingDate },
//               { label: "Writing",   value: writing !== null && writing > 0 ? `${writing}/30` : null,   notAttempted: writing === null || writing === 0,   date: writingDate },
//             ],
//             sectionTabs: ["Reading", "Listening", "Speaking", "Writing"],
//             activeTab: toeflTab,
//             onTabChange: setToeflTab,
//             sectionTips: toeflSectionTips,
//             suggestions: getTOEFLSuggestions(),
//             note: toeflTotal > 0 ? getTOEFLNote(toeflTotal) : null,
//           })}

//           {/* ── GRE ── */}
//           {anyGRE && renderTestBlock({
//             title: "Practice Test Results",
//             subtitle: `Test GRE Practice Test · Finished ${greVerbalDate ? formatDate(greVerbalDate) : "Recently"}`,
//             totalBox: greTotal ? { value: greTotal, date: greVerbalDate } : null,
//             scoreBoxes: [
//               { label: "Verbal",       value: greVerbal !== null ? `${greVerbal}/170` : null,     notAttempted: greVerbal === null,     date: greVerbalDate },
//               { label: "Quantitative", value: greQuant !== null ? `${greQuant}/170` : null,       notAttempted: greQuant === null,      date: greQuantDate },
//               { label: "Analytical",   value: greAnalytical !== null ? `${greAnalytical}/6` : null, notAttempted: greAnalytical === null, date: greAnalyticalDate },
//             ],
//             sectionTabs: ["Verbal", "Quantitative", "Analytical"],
//             activeTab: greTab,
//             onTabChange: setGreTab,
//             sectionTips: greSectionTips,
//             suggestions: getGRESuggestions(),
//             note: greTotal ? getGRENote(greTotal) : null,
//           })}

//           {/* ── EMPTY STATE ── */}
//           {(!user.testHistory || user.testHistory.length === 0) && (
//             <div style={{
//               textAlign: "center", color: "#888", padding: "4rem 2rem",
//               background: "#fafafa", borderRadius: "12px", border: "1px solid #eee",
//             }}>
//               <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
//               <p style={{ fontSize: "1rem", margin: "0 0 1.5rem" }}>You haven't taken any tests yet.</p>
//               <button
//                 onClick={() => navigate("/")}
//                 style={{
//                   background: "#1a7a4a", color: "#fff",
//                   border: "none", padding: "0.8rem 2.5rem",
//                   borderRadius: "8px", fontSize: "0.95rem", fontWeight: "700",
//                   cursor: "pointer",
//                 }}
//               >Explore Tests</button>
//             </div>
//           )}
//         </div>

//         {/* LOGOUT */}
//         <button
//           onClick={() => { if (onLogout) onLogout(); navigate("/login"); }}
//           style={{
//             marginTop: "0.5rem", marginBottom: "3rem",
//             background: "transparent", color: "#ff5252",
//             border: "1px solid rgba(255,82,82,0.5)",
//             padding: "0.8rem 3rem", borderRadius: "8px",
//             fontSize: "0.95rem", fontWeight: "700", cursor: "pointer",
//             transition: "all 0.2s ease",
//           }}
//           onMouseOver={(e) => { e.target.style.background = "rgba(255,82,82,0.06)"; }}
//           onMouseOut={(e) => { e.target.style.background = "transparent"; }}
//         >
//           Log Out
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;



// src/components/ProfilePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

// ── Score box ──
const ScoreBox = ({ label, value, isTotal, notAttempted, date }) => (
  <div style={{
    background: isTotal ? "#1a7a4a" : "#e8f8f0",
    border: `2px solid ${isTotal ? "#0d5c36" : "#b2e8cb"}`,
    borderRadius: "10px", padding: "14px 10px", textAlign: "center",
    minWidth: "90px", flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", gap: "4px",
  }}>
    <div style={{ fontSize: "0.72rem", fontWeight: "700", color: isTotal ? "#a0f0c8" : "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>{label}</div>
    <div style={{ fontSize: isTotal ? "2rem" : "1.75rem", fontWeight: "900", color: isTotal ? "#ffffff" : notAttempted ? "#aaaaaa" : "#1a7a4a", lineHeight: 1 }}>
      {notAttempted ? "-" : value ?? "—"}
    </div>
    {date && !notAttempted && (
      <div style={{ fontSize: "0.62rem", color: isTotal ? "#80d8a8" : "#5a9a70", marginTop: "4px", fontWeight: "500" }}>
        {formatDate(date)}<br />{formatTime(date)}
      </div>
    )}
  </div>
);

// ── Section tabs ──
const SectionTabs = ({ active, tabs, onChange }) => (
  <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
    {tabs.map((tab) => (
      <button key={tab} onClick={() => onChange(tab)} style={{
        padding: "7px 18px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700",
        cursor: "pointer", border: "none", letterSpacing: "0.2px",
        background: active === tab ? "#222" : "#f0f0f0",
        color: active === tab ? "#fff" : "#555", transition: "all 0.15s",
      }}>{tab}</button>
    ))}
  </div>
);

// ── Improvement tips ──
const ImprovementCard = ({ tips }) => (
  <ul style={{ margin: "16px 0 0", paddingLeft: "20px", fontSize: "0.88rem", color: "#333", lineHeight: "2" }}>
    {tips.map((tip, i) => <li key={i}>{tip}</li>)}
  </ul>
);

// ── Next steps card ──
const NextStepsCard = ({ suggestions }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
    <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "18px" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>NEXT STEPS</div>
      <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "10px" }}>Review Your Performance</div>
      <p style={{ fontSize: "0.83rem", color: "#555", lineHeight: "1.7", margin: 0 }}>
        Review your performance breakdown below to find areas where you can improve. Focus on sections where you scored lower to boost your overall band.
      </p>
    </div>
    <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "18px" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>IMPROVEMENT TIPS</div>
      <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "10px" }}>💡 Areas to Improve</div>
      {suggestions.length === 0 ? (
        <p style={{ fontSize: "0.83rem", color: "#2a7a50", fontWeight: "600", margin: 0 }}>✅ Great job! All sections are above target.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.82rem", color: "#555", lineHeight: "1.9" }}>
          {suggestions.slice(0, 3).map((s, i) => <li key={i}><strong>{s.label}:</strong> {s.tips[0]}</li>)}
        </ul>
      )}
    </div>
  </div>
);

// ── Answer breakdown (Reading / Listening / GRE Verbal & Quant) ──
const AnswerBreakdown = ({ breakdown }) => {
  if (!breakdown || Object.keys(breakdown).length === 0) {
    return (
      <div style={{ marginTop: "16px", padding: "20px", background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", textAlign: "center", color: "#888", fontSize: "0.85rem" }}>
        No answer data available for this section yet.
      </div>
    );
  }

  const entries = Object.entries(breakdown).sort((a, b) => {
    const na = parseInt(a[0].replace(/\D/g, "")) || 0;
    const nb = parseInt(b[0].replace(/\D/g, "")) || 0;
    return na - nb;
  });
  const correct = entries.filter(([, v]) => v.isCorrect).length;
  const total = entries.length;

  return (
    <div style={{ marginTop: "16px" }}>
      {/* Summary bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", padding: "12px 16px", background: "#f0fbf5", border: "1px solid #b2e8cb", borderRadius: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#1a7a4a" }}>
          ✅ {correct} correct &nbsp;|&nbsp; ❌ {total - correct} wrong &nbsp;|&nbsp; Total: {total}
        </span>
        <div style={{ flex: 1, minWidth: "80px", height: "8px", background: "#e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${Math.round((correct / total) * 100)}%`, height: "100%", background: "linear-gradient(90deg, #1a7a4a, #2db870)", borderRadius: "4px", transition: "width 0.5s ease" }} />
        </div>
        <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#555" }}>{Math.round((correct / total) * 100)}%</span>
      </div>

      {/* Per-question rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "440px", overflowY: "auto", paddingRight: "4px" }}>
        {entries.map(([qId, val]) => (
          <div key={qId} style={{
            display: "grid", gridTemplateColumns: "44px 1fr 1fr 32px",
            alignItems: "center", gap: "8px", padding: "10px 14px",
            borderRadius: "8px",
            background: val.isCorrect ? "#f0fbf5" : "#fff5f5",
            border: `1px solid ${val.isCorrect ? "#b2e8cb" : "#fecaca"}`,
            fontSize: "0.83rem",
          }}>
            <div style={{ fontWeight: "800", color: val.isCorrect ? "#1a7a4a" : "#dc2626", fontSize: "0.78rem" }}>
              Q{qId.replace(/\D/g, "") || qId}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.65rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Answer</span>
              <span style={{ fontWeight: "700", color: val.isCorrect ? "#1a7a4a" : "#dc2626", wordBreak: "break-word" }}>
                {val.user && val.user !== "—not answered—"
                  ? val.user
                  : <em style={{ color: "#bbb", fontWeight: 400 }}>—not answered—</em>}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.65rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Correct Answer</span>
              <span style={{ fontWeight: "700", color: "#1a7a4a", wordBreak: "break-word" }}>{val.correct}</span>
            </div>
            <div style={{ textAlign: "center", fontSize: "1rem" }}>{val.isCorrect ? "✅" : "❌"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── IELTS Writing breakdown ──
const IeltsWritingBreakdown = ({ result }) => {
  if (!result) return null;
  return (
    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {result.task1Band !== undefined && (
          <div style={{ flex: 1, minWidth: "120px", padding: "14px", background: "#e8f8f0", border: "2px solid #b2e8cb", borderRadius: "10px", textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px" }}>Task 1 Band</div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#1a7a4a" }}>{result.task1Band}</div>
            <div style={{ fontSize: "0.72rem", color: "#5a9a70" }}>{result.wordCountTask1 || 0} words</div>
          </div>
        )}
        {result.task2Band !== undefined && (
          <div style={{ flex: 1, minWidth: "120px", padding: "14px", background: "#e8f8f0", border: "2px solid #b2e8cb", borderRadius: "10px", textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px" }}>Task 2 Band</div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#1a7a4a" }}>{result.task2Band}</div>
            <div style={{ fontSize: "0.72rem", color: "#5a9a70" }}>{result.wordCountTask2 || 0} words</div>
          </div>
        )}
      </div>
      {result.essayTask1 && (
        <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>📝 Task 1 — Your Response</div>
          <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "200px", overflowY: "auto" }}>{result.essayTask1}</p>
        </div>
      )}
      {result.essayTask2 && (
        <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>📝 Task 2 — Your Response</div>
          <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "200px", overflowY: "auto" }}>{result.essayTask2}</p>
        </div>
      )}
    </div>
  );
};

// ── TOEFL Writing breakdown ──
const ToeflWritingBreakdown = ({ result }) => {
  if (!result) return (
    <div style={{ marginTop: "16px", padding: "20px", background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", textAlign: "center", color: "#888", fontSize: "0.85rem" }}>
      No writing response data available yet.
    </div>
  );

  const tasks = result.breakdown ? Object.entries(result.breakdown) : [];

  return (
    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "14px 16px", background: "#f0fbf5", border: "1px solid #b2e8cb", borderRadius: "8px" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1a7a4a" }}>
          📝 {result.rawScore ?? "?"} of {result.total ?? "?"} tasks met minimum word count
          &nbsp;|&nbsp; TOEFL Score: {result.toeflScore ?? "?"}/30
        </span>
      </div>

      {tasks.length === 0 && (
        <div style={{ padding: "16px", background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", color: "#888", fontSize: "0.85rem", textAlign: "center" }}>
          Detailed writing responses not available for this attempt.
        </div>
      )}

      {tasks.map(([taskId, task]) => (
        <div key={taskId} style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#333" }}>{task.title || taskId}</div>
            <span style={{
              fontSize: "0.75rem", fontWeight: "700", padding: "3px 10px", borderRadius: "20px",
              background: task.meetsMinimum ? "#e8f8f0" : "#fff5f5",
              border: `1px solid ${task.meetsMinimum ? "#b2e8cb" : "#fecaca"}`,
              color: task.meetsMinimum ? "#1a7a4a" : "#dc2626",
            }}>
              {task.wordCount} words {task.meetsMinimum ? "✅" : `❌ (min: ${task.minWords})`}
            </span>
          </div>
          {task.prompt && (
            <div style={{ background: "#f0fbf5", border: "1px solid #b2e8cb", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: "700", color: "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>Prompt</div>
              <p style={{ fontSize: "0.82rem", color: "#333", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>{task.prompt}</p>
            </div>
          )}
          <div style={{ fontSize: "0.68rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Your Response</div>
          {task.response ? (
            <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "220px", overflowY: "auto", background: "#fff", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "12px" }}>
              {task.response}
            </p>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "#aaa", fontStyle: "italic", margin: 0 }}>No response submitted.</p>
          )}
        </div>
      ))}
    </div>
  );
};

// ── GRE Analytical Writing breakdown ──
const GreAnalyticalBreakdown = ({ result }) => {
  if (!result) return (
    <div style={{ marginTop: "16px", padding: "20px", background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", textAlign: "center", color: "#888", fontSize: "0.85rem" }}>
      No writing response data available yet.
    </div>
  );
  return (
    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "120px", padding: "14px", background: "#e8f8f0", border: "2px solid #b2e8cb", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#2a7a50", textTransform: "uppercase", letterSpacing: "0.8px" }}>AWA Score</div>
          <div style={{ fontSize: "2rem", fontWeight: "900", color: "#1a7a4a" }}>{result.score ?? "—"} / 6</div>
          <div style={{ fontSize: "0.72rem", color: "#5a9a70" }}>{result.wordCount ?? 0} words</div>
        </div>
      </div>
      {result.essay && (
        <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>📝 Your Essay Response</div>
          <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "260px", overflowY: "auto", background: "#fff", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "12px" }}>
            {result.essay}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Divider ──
const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", marginTop: "20px" }}>
    <div style={{ height: "2px", flex: 1, background: "#e0e0e0" }} />
    <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#555", textTransform: "uppercase", letterSpacing: "1px", padding: "4px 12px", background: "#f0f0f0", borderRadius: "20px" }}>{label}</span>
    <div style={{ height: "2px", flex: 1, background: "#e0e0e0" }} />
  </div>
);

// ─────────────────────────────────────────────
function ProfilePage({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toeflTab, setToeflTab] = useState("Reading");
  const [ieltsTab, setIeltsTab] = useState("Reading");
  const [greTab, setGreTab] = useState("Verbal");
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) { if (onLogout) onLogout(); navigate("/login"); return; }
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data) {
          setUser(data);
        } else {
          localStorage.removeItem("token"); localStorage.removeItem("loggedIn");
          if (onLogout) onLogout(); navigate("/login");
        }
      } catch (err) {
        console.error("Profile fetch error:", err); setError("Server error");
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, [navigate, API_URL, onLogout]);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#555" }}>Loading profile...</div>;
  if (error) return <div style={{ padding: "4rem", textAlign: "center", color: "#ff5252" }}>{error}</div>;
  if (!user) return null;

  const testHistory = user.testHistory || [];

  // ─── TOEFL ───────────────────────────────────────────────────────
  const toeflAll = testHistory.filter(t => t.testName?.toLowerCase().includes("toefl"));

  const findToefl = (keyword) =>
    toeflAll
      .filter(t => t.testName?.toLowerCase().includes(keyword))
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const toeflReadingTest   = findToefl("reading");
  const toeflListeningTest = findToefl("listening");
  const toeflWritingTest   = findToefl("writing");
  const toeflSpeakingTest  = findToefl("speaking");

  const getScore = (test) => (test ? Number(test.result?.toeflScore) || 0 : null);

  const tReading   = toeflReadingTest   ? getScore(toeflReadingTest)   : null;
  const tListening = toeflListeningTest ? getScore(toeflListeningTest) : null;
  const tWriting   = toeflWritingTest   ? getScore(toeflWritingTest)   : null;
  const tSpeaking  = toeflSpeakingTest  ? getScore(toeflSpeakingTest)  : null;

  const toeflAttempted = [tReading, tListening, tWriting, tSpeaking].filter(s => s !== null && s > 0);
  const toeflTotal = toeflAttempted.reduce((a, b) => a + b, 0);
  const anyToefl = toeflAll.length > 0;

  const toeflTabToTest = {
    Reading:   toeflReadingTest,
    Listening: toeflListeningTest,
    Writing:   toeflWritingTest,
    Speaking:  toeflSpeakingTest,
  };

  const getTOEFLSuggestions = () => [
    { label: "Reading",   score: tReading,   tips: ["Practice skimming and scanning passages under time pressure.", "Read academic and news articles daily.", "Work on identifying main ideas and author's purpose."] },
    { label: "Listening", score: tListening, tips: ["Listen to TED Talks, lectures, and academic podcasts.", "Practice note-taking while listening.", "Focus on identifying key arguments and transitions."] },
    { label: "Writing",   score: tWriting,   tips: ["Practice integrated and independent essay structures.", "Work on clear thesis statements and coherent paragraphs.", "Expand academic vocabulary and vary sentence structure."] },
    { label: "Speaking",  score: tSpeaking,  tips: ["Record yourself and listen back for clarity.", "Practice speaking on academic topics spontaneously.", "Work on pacing, pronunciation, and linking ideas."] },
  ].filter(s => s.score !== null && s.score > 0 && s.score < 20);

  const getTOEFLNote = (total) => {
    if (total >= 100) return "Excellent! A score of 100+ is competitive for top universities worldwide.";
    if (total >= 80)  return "Good score! 80+ meets requirements for many graduate and undergraduate programs.";
    if (total >= 60)  return "Decent foundation. Focused preparation can help you reach your target score.";
    return "Keep practising — consistent effort leads to significant improvement.";
  };

  const toeflSectionTips = {
    Reading:   ["Practice skimming and scanning passages under time pressure.", "Read academic and news articles daily.", "Work on identifying main ideas and author's purpose."],
    Listening: ["Listen to TED Talks, lectures, and academic podcasts.", "Practice note-taking while listening.", "Focus on identifying key arguments and transitions."],
    Writing:   ["Practice integrated and independent essay structures.", "Work on clear thesis statements and coherent paragraphs.", "Expand academic vocabulary and vary sentence structure."],
    Speaking:  ["Record yourself and listen back for clarity.", "Practice speaking on academic topics spontaneously.", "Work on pacing, pronunciation, and linking ideas."],
  };

  // ─── IELTS ───────────────────────────────────────────────────────
  const ieltsAll = testHistory.filter(t => t.testName?.toLowerCase().includes("ielts"));

  const findIelts = (keyword) =>
    ieltsAll
      .filter(t => t.testName?.toLowerCase().includes(keyword))
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const ieltsReadingTest   = findIelts("reading");
  const ieltsListeningTest = findIelts("listening");
  const ieltsWritingTest   = findIelts("writing");
  const ieltsSpeakingTest  = findIelts("speaking");

  const calculateIELTSBand = (score, total = 40) => {
    const scaledRaw = Math.round((score / total) * 40);
    const bandMap = [[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[27,6.5],[23,6],[19,5.5],[15,5],[13,4.5],[10,4],[7,3.5],[5,3],[3,2.5],[1,2],[0,0]];
    for (const [minRaw, band] of bandMap) { if (scaledRaw >= minRaw) return band; }
    return 0;
  };

  const ieltsReading   = ieltsReadingTest   ? calculateIELTSBand(Number(ieltsReadingTest.result?.score) || 0)   : null;
  const ieltsListening = ieltsListeningTest ? calculateIELTSBand(Number(ieltsListeningTest.result?.score) || 0) : null;
  const ieltsWriting   = ieltsWritingTest   ? (ieltsWritingTest.result?.score ?? calculateIELTSBand(Number(ieltsWritingTest.result?.score) || 0)) : null;
  const ieltsSpeaking  = ieltsSpeakingTest  ? calculateIELTSBand(Number(ieltsSpeakingTest.result?.score) || 0)  : null;

  const ieltsBands = [ieltsReading, ieltsListening, ieltsWriting, ieltsSpeaking].filter(b => b !== null);
  const ieltsOverall = ieltsBands.length > 0 ? Math.round((ieltsBands.reduce((a, b) => a + b, 0) / ieltsBands.length) * 2) / 2 : null;

  const ieltsTabToTest = {
    Reading:   ieltsReadingTest,
    Listening: ieltsListeningTest,
    Writing:   ieltsWritingTest,
    Speaking:  ieltsSpeakingTest,
  };

  const getIELTSSuggestions = () => [
    { label: "Reading",   band: ieltsReading,   tips: ["Practice skimming and scanning techniques.", "Read academic articles daily to improve speed.", "Focus on understanding passage structure and keywords."] },
    { label: "Listening", band: ieltsListening, tips: ["Listen to podcasts, news, and lectures daily.", "Practice note-taking while listening.", "Focus on catching keywords and numbers accurately."] },
    { label: "Writing",   band: ieltsWriting,   tips: ["Work on task response and coherence.", "Practice writing introductions and conclusions.", "Learn to use a variety of sentence structures and vocabulary."] },
    { label: "Speaking",  band: ieltsSpeaking,  tips: ["Speak English daily, even alone.", "Record yourself and review pronunciation.", "Expand your answers with examples and opinions."] },
  ].filter(s => s.band !== null && s.band < 6.5);

  const getIELTSNote = (band) => {
    if (band >= 8) return "Excellent! You have a very strong command of English. Keep it up!";
    if (band >= 7) return "Great score! You are proficient and ready for most universities worldwide.";
    if (band >= 6) return "Good progress! A score of 6.5+ opens doors to many international universities.";
    if (band >= 5) return "You have a basic command of English. Consistent practice will help you reach your target band.";
    return "Keep practising — every band improvement brings you closer to your goal!";
  };

  const ieltsSectionTips = {
    Reading:   ["Practice skimming and scanning techniques.", "Read academic articles daily to improve speed.", "Focus on understanding passage structure and keywords."],
    Listening: ["Listen to podcasts, news, and lectures daily.", "Practice note-taking while listening.", "Focus on catching keywords and numbers accurately."],
    Writing:   ["Work on task response and coherence.", "Practice writing introductions and conclusions.", "Learn to use a variety of sentence structures and vocabulary."],
    Speaking:  ["Speak English daily, even alone.", "Record yourself and review pronunciation.", "Expand your answers with examples and opinions."],
  };

  // ─── GRE ─────────────────────────────────────────────────────────
  const greAll = testHistory.filter(t => t.testName?.toLowerCase().includes("gre"));

  const findGre = (keyword) =>
    greAll
      .filter(t => t.testName?.toLowerCase().includes(keyword))
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const greVerbalTest     = findGre("verbal");
  const greQuantTest      = findGre("quant");
  const greAnalyticalTest = findGre("analytical") || findGre("awa");

  const convertToGRE = (raw, total = 27) => raw != null ? Math.round(130 + (raw / total) * 40) : null;

  const greVerbal     = greVerbalTest     ? convertToGRE(greVerbalTest.result?.score)     : null;
  const greQuant      = greQuantTest      ? convertToGRE(greQuantTest.result?.score)      : null;
  const greAnalytical = greAnalyticalTest ? (greAnalyticalTest.result?.score ?? null)     : null;

  const greTotal = greVerbal !== null && greQuant !== null ? greVerbal + greQuant : null;
  const anyGRE = greAll.length > 0;

  // Tab → test object (used for breakdown rendering)
  const greTabToTest = {
    Verbal:       greVerbalTest,
    Quantitative: greQuantTest,
    Analytical:   greAnalyticalTest,
  };

  const getGRESuggestions = () => [
    { label: "Verbal",       score: greVerbal,     threshold: 155, tips: ["Build vocabulary with GRE word lists daily.", "Practice reading comprehension with dense passages.", "Work on text completion and sentence equivalence."] },
    { label: "Quantitative", score: greQuant,      threshold: 155, tips: ["Review core math concepts — algebra, geometry, statistics.", "Practice data interpretation and quantitative comparisons.", "Time yourself strictly on problem sets."] },
    { label: "Analytical",   score: greAnalytical, threshold: 4,   tips: ["Practice Issue and Argument essay templates.", "Focus on clear thesis and well-structured arguments.", "Read sample high-scoring AWA essays for reference."] },
  ].filter(s => s.score !== null && s.score < s.threshold);

  const getGRENote = (total) => {
    if (total >= 320) return "Excellent! A score of 320+ is competitive for top graduate programs worldwide.";
    if (total >= 300) return "Good score! 300+ meets requirements for most graduate programs.";
    if (total >= 280) return "Decent base. Focused preparation can push your score significantly higher.";
    return "Keep practising — consistent effort leads to major improvement on the GRE.";
  };

  const greSectionTips = {
    Verbal:       ["Build vocabulary with GRE word lists daily.", "Practice reading comprehension with dense passages.", "Work on text completion and sentence equivalence."],
    Quantitative: ["Review core math concepts — algebra, geometry, statistics.", "Practice data interpretation and quantitative comparisons.", "Time yourself strictly on problem sets."],
    Analytical:   ["Practice Issue and Argument essay templates.", "Focus on clear thesis and well-structured arguments.", "Read sample high-scoring AWA essays for reference."],
  };

  // ─── Render breakdown panel ───────────────────────────────────────
  const renderBreakdownPanel = ({ activeTab, isIelts, isToefl, isGre, breakdownMap }) => {
    const tabTest = breakdownMap[activeTab];

    // ── IELTS ──
    if (isIelts) {
      if (!tabTest) return null;
      if (activeTab === "Writing") {
        return (
          <>
            <SectionDivider label="Writing Responses" />
            <IeltsWritingBreakdown result={tabTest.result} />
          </>
        );
      }
      const bd = tabTest.result?.breakdown;
      if (!bd || Object.keys(bd).length === 0) return null;
      return (
        <>
          <SectionDivider label="Your Answers vs Correct Answers" />
          <AnswerBreakdown breakdown={bd} />
        </>
      );
    }

    // ── TOEFL ──
    if (isToefl) {
      if (!tabTest) return null;
      if (activeTab === "Writing") {
        return (
          <>
            <SectionDivider label="Writing Responses" />
            <ToeflWritingBreakdown result={tabTest.result} />
          </>
        );
      }
      if (activeTab === "Speaking") return null;
      const bd = tabTest.result?.breakdown;
      if (!bd || Object.keys(bd).length === 0) {
        return (
          <>
            <SectionDivider label="Your Answers vs Correct Answers" />
            <div style={{ marginTop: "12px", padding: "16px", background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "8px", fontSize: "0.83rem", color: "#7a5c00" }}>
              ⚠️ Answer breakdown is available for tests taken after the latest update. Please retake this section to see your detailed results.
            </div>
          </>
        );
      }
      return (
        <>
          <SectionDivider label="Your Answers vs Correct Answers" />
          <AnswerBreakdown breakdown={bd} />
        </>
      );
    }

    // ── GRE ──
    if (isGre) {
      if (!tabTest) return null;

      // Analytical tab → show essay
      if (activeTab === "Analytical") {
        return (
          <>
            <SectionDivider label="Analytical Writing Response" />
            <GreAnalyticalBreakdown result={tabTest.result} />
          </>
        );
      }

      // Verbal / Quantitative → show answer breakdown
      const bd = tabTest.result?.breakdown;
      if (!bd || Object.keys(bd).length === 0) {
        return (
          <>
            <SectionDivider label="Your Answers vs Correct Answers" />
            <div style={{ marginTop: "12px", padding: "16px", background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "8px", fontSize: "0.83rem", color: "#7a5c00" }}>
              ⚠️ Answer breakdown is available for tests taken after the latest update. Please retake this section to see your detailed results.
            </div>
          </>
        );
      }
      return (
        <>
          <SectionDivider label="Your Answers vs Correct Answers" />
          <AnswerBreakdown breakdown={bd} />
        </>
      );
    }

    return null;
  };

  // ─── Shared test block renderer ───────────────────────────────────
  const renderTestBlock = ({
    title, subtitle, scoreBoxes, totalBox,
    sectionTabs, activeTab, onTabChange,
    sectionTips, suggestions, note,
    isIelts, isToefl, isGre, breakdownMap,
  }) => (
    <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "16px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "#111", marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "0.82rem", color: "#888", fontWeight: "500" }}>{subtitle}</div>
      </div>

      {/* Score boxes */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
        {totalBox && <ScoreBox label="Total Score" value={totalBox.value} isTotal date={totalBox.date} />}
        {scoreBoxes.map((box) => (
          <ScoreBox key={box.label} label={box.label} value={box.value} notAttempted={box.notAttempted} date={box.date} />
        ))}
      </div>

      {/* Note */}
      {note && (
        <div style={{ marginTop: "16px", background: "#f0fbf5", border: "1px solid #b2e8cb", borderRadius: "8px", padding: "10px 14px", fontSize: "0.83rem", color: "#1a7a4a", fontWeight: "500" }}>
          📌 {note}
        </div>
      )}

      <NextStepsCard suggestions={suggestions} />

      {/* Section tabs + content */}
      <div style={{ marginTop: "28px" }}>
        <div style={{ fontSize: "1rem", fontWeight: "800", color: "#111", marginBottom: "4px" }}>Section Results</div>
        <SectionTabs active={activeTab} tabs={sectionTabs} onChange={onTabChange} />

        <div style={{ marginTop: "16px", background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", padding: "18px" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#333", marginBottom: "8px" }}>📚 Tips for {activeTab}</div>
          <ImprovementCard tips={sectionTips[activeTab] || []} />

          {renderBreakdownPanel({ activeTab, isIelts, isToefl, isGre, breakdownMap: breakdownMap || {} })}
        </div>
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "3rem 1rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", background: "#ffffff", borderRadius: "20px", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0d3d26 0%, #0a2e1e 50%, #061a12 100%)", padding: "3.5rem 2rem", textAlign: "center", width: "100%", borderBottom: "1px solid rgba(25,253,145,0.15)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#19fd91 1px, transparent 1px), linear-gradient(90deg, #19fd91 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: "110px", height: "110px", background: "linear-gradient(135deg, #19fd91, #0ab866)", borderRadius: "50%", margin: "0 auto 1.2rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", fontWeight: "900", color: "#060d16", boxShadow: "0 0 40px rgba(25,253,145,0.3)" }}>
              {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
            </div>
            <h1 style={{ margin: 0, fontSize: "2.2rem", fontWeight: "900", color: "#e8f8f0", letterSpacing: "-0.5px" }}>{user.fullname || "User"}</h1>
            <p style={{ margin: "0.5rem 0 0", color: "#5a9a78", fontSize: "1rem", fontWeight: "500" }}>{user.email}</p>
            {user.isVerified && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "14px", background: "rgba(25,253,145,0.1)", border: "1px solid rgba(25,253,145,0.25)", padding: "5px 16px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "700", color: "#19fd91", letterSpacing: "0.3px" }}>
                ✅ Verified Account
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "2.5rem 2rem", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
            <h2 style={{ color: "#111", margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>Test History</h2>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          </div>

          {/* IELTS */}
          {ieltsAll.length > 0 && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test IELTS Practice Test",
            totalBox: ieltsOverall ? { value: ieltsOverall, date: ieltsReadingTest?.date } : null,
            scoreBoxes: [
              { label: "Reading",   value: ieltsReading,   notAttempted: ieltsReading === null,   date: ieltsReadingTest?.date },
              { label: "Listening", value: ieltsListening, notAttempted: ieltsListening === null, date: ieltsListeningTest?.date },
              { label: "Speaking",  value: ieltsSpeaking,  notAttempted: ieltsSpeaking === null,  date: ieltsSpeakingTest?.date },
              { label: "Writing",   value: ieltsWriting,   notAttempted: ieltsWriting === null,   date: ieltsWritingTest?.date },
            ],
            sectionTabs: ["Reading", "Listening", "Speaking", "Writing"],
            activeTab: ieltsTab,
            onTabChange: setIeltsTab,
            sectionTips: ieltsSectionTips,
            suggestions: getIELTSSuggestions(),
            note: ieltsOverall ? getIELTSNote(ieltsOverall) : null,
            isIelts: true,
            breakdownMap: ieltsTabToTest,
          })}

          {/* TOEFL */}
          {anyToefl && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test TOEFL Practice Test",
            totalBox: toeflTotal > 0 ? { value: toeflTotal, date: toeflReadingTest?.date } : null,
            scoreBoxes: [
              { label: "Reading",   value: tReading   !== null && tReading   > 0 ? `${tReading}/30`   : null, notAttempted: tReading   === null || tReading   === 0, date: toeflReadingTest?.date },
              { label: "Listening", value: tListening !== null && tListening > 0 ? `${tListening}/30` : null, notAttempted: tListening === null || tListening === 0, date: toeflListeningTest?.date },
              { label: "Speaking",  value: tSpeaking  !== null && tSpeaking  > 0 ? `${tSpeaking}/30`  : null, notAttempted: tSpeaking  === null || tSpeaking  === 0, date: toeflSpeakingTest?.date },
              { label: "Writing",   value: tWriting   !== null && tWriting   > 0 ? `${tWriting}/30`   : null, notAttempted: tWriting   === null || tWriting   === 0, date: toeflWritingTest?.date },
            ],
            sectionTabs: ["Reading", "Listening", "Speaking", "Writing"],
            activeTab: toeflTab,
            onTabChange: setToeflTab,
            sectionTips: toeflSectionTips,
            suggestions: getTOEFLSuggestions(),
            note: toeflTotal > 0 ? getTOEFLNote(toeflTotal) : null,
            isToefl: true,
            breakdownMap: toeflTabToTest,
          })}

          {/* GRE */}
          {anyGRE && renderTestBlock({
            title: "Practice Test Results",
            subtitle: "Test GRE Practice Test",
            totalBox: greTotal ? { value: greTotal, date: greVerbalTest?.date } : null,
            scoreBoxes: [
              { label: "Verbal",       value: greVerbal     !== null ? `${greVerbal}/170`     : null, notAttempted: greVerbal     === null, date: greVerbalTest?.date },
              { label: "Quantitative", value: greQuant      !== null ? `${greQuant}/170`      : null, notAttempted: greQuant      === null, date: greQuantTest?.date },
              { label: "Analytical",   value: greAnalytical !== null ? `${greAnalytical}/6`   : null, notAttempted: greAnalytical === null, date: greAnalyticalTest?.date },
            ],
            sectionTabs: ["Verbal", "Quantitative", "Analytical"],
            activeTab: greTab,
            onTabChange: setGreTab,
            sectionTips: greSectionTips,
            suggestions: getGRESuggestions(),
            note: greTotal ? getGRENote(greTotal) : null,
            isGre: true,
            breakdownMap: greTabToTest,
          })}

          {/* Empty state */}
          {testHistory.length === 0 && (
            <div style={{ textAlign: "center", color: "#888", padding: "4rem 2rem", background: "#fafafa", borderRadius: "12px", border: "1px solid #eee" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
              <p style={{ fontSize: "1rem", margin: "0 0 1.5rem" }}>You haven't taken any tests yet.</p>
              <button onClick={() => navigate("/")} style={{ background: "#1a7a4a", color: "#fff", border: "none", padding: "0.8rem 2.5rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer" }}>
                Explore Tests
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => { if (onLogout) onLogout(); navigate("/login"); }}
          style={{ marginTop: "0.5rem", marginBottom: "3rem", background: "transparent", color: "#ff5252", border: "1px solid rgba(255,82,82,0.5)", padding: "0.8rem 3rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" }}
          onMouseOver={(e) => { e.target.style.background = "rgba(255,82,82,0.06)"; }}
          onMouseOut={(e) => { e.target.style.background = "transparent"; }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;