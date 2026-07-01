// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// function EqResultPage() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [result, setResult] = useState(null);

//     useEffect(() => {
//         if (location.state) {
//             setResult(location.state);
//         } else {
//             navigate("/tests");
//         }
//     }, [location, navigate]);

//     if (!result) return null;

//     const score = result.score; // Assumes score is 0-100 based on Likert (20-100 range)

//     // Score Ranges (Dark Theme adjusted)
//     const ranges = [
//         { min: 0, max: 16, label: "Very low emotional intelligence" },
//         { min: 17, max: 36, label: "Low emotional intelligence" },
//         { min: 37, max: 63, label: "Neither low nor high" },
//         { min: 64, max: 83, label: "High emotional intelligence" },
//         { min: 84, max: 100, label: "Very high emotional intelligence" },
//     ];

//     const getInterpretation = (s) => {
//         if (s >= 84) return "Very high emotional intelligence";
//         if (s >= 64) return "High emotional intelligence";
//         if (s >= 37) return "Neither low nor high";
//         if (s >= 17) return "Low emotional intelligence";
//         return "Very low emotional intelligence";
//     };

//     const currentInterpretation = getInterpretation(score);

//     return (
//         <div style={{
//             minHeight: "90vh", // Reduced from 100vh to fit better
//             background: "var(--bg-main)",
//             fontFamily: "'Inter', sans-serif",
//             padding: "1rem", // Reduced padding
//             color: "var(--text-main)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center"
//         }}>
//             <div style={{
//                 background: "var(--bg-card)",
//                 borderRadius: "20px",
//                 maxWidth: "1000px",
//                 width: "100%",
//                 overflow: "hidden",
//                 boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
//                 border: "1px solid var(--border)"
//             }}>
//                 {/* Header */}
//                 <div style={{
//                     padding: "2rem", // Increased padding slightly back
//                     textAlign: "center",
//                     borderBottom: "1px solid var(--border)"
//                 }}>
//                     <h1 style={{
//                         margin: 0,
//                         color: "var(--accent)", // Changed to accent color for visibility
//                         fontSize: "2.5rem", // Increased size
//                         fontWeight: "700",
//                         textShadow: "0 0 10px rgba(25, 253, 145, 0.3)" // Added glow
//                     }}>
//                         Emotional Intelligence Test Score
//                     </h1>
//                 </div>

//                 {/* Content Grid */}
//                 <div style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     padding: "1.5rem", // Reduced padding
//                     gap: "2rem", // Reduced gap
//                     justifyContent: "center"
//                 }}>
//                     {/* Left Column: Graph */}
//                     <div style={{ flex: "1 1 350px" }}>
//                         <div style={{
//                             textAlign: "center",
//                             fontSize: "1.2rem",
//                             fontWeight: "bold",
//                             marginBottom: "1rem",
//                             color: "var(--accent)"
//                         }}>
//                             <span style={{ fontSize: "1.8rem", color: "var(--text-main)" }}>{score}/100</span>
//                             <div style={{ fontSize: "1rem", marginTop: "0.2rem", color: "var(--text-muted)" }}>{currentInterpretation}</div>
//                         </div>

//                         {/* SVG Bell Curve (Dark Theme) */}
//                         <div style={{ position: "relative", height: "220px", width: "100%" }}> {/* Reduced height from 300px */}
//                             <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
//                                 {/* Axes/Grid lines */}
//                                 <line x1="20" y1="180" x2="380" y2="180" stroke="var(--border)" strokeWidth="2" />

//                                 {/* Bell Curve Path */}
//                                 <path
//                                     d="M20,180 Q100,180 150,100 T200,20 T250,100 T380,180"
//                                     fill="none"
//                                     stroke="var(--accent)"
//                                     strokeWidth="3"
//                                 />
//                                 {/* Filled area under curve */}
//                                 <path
//                                     d="M20,180 Q100,180 150,100 T200,20 T250,100 T380,180 L380,180 L20,180 Z"
//                                     fill="var(--accent)"
//                                     opacity="0.1"
//                                 />

//                                 {/* "You" Marker */}
//                                 {(() => {
//                                     // Map score (0-100) to X (20-380)
//                                     // X range = 360
//                                     const x = 20 + (Math.min(score, 100) / 100) * 360;
//                                     return (
//                                         <g>
//                                             <line x1={x} y1="20" x2={x} y2="180" stroke="#00e0ff" strokeWidth="4" />
//                                             <rect x={x - 25} y="-15" width="50" height="26" rx="6" fill="#00e0ff" />
//                                             <text x={x} y="2" textAnchor="middle" fill="#000" fontSize="11" fontWeight="bold">You</text>
//                                         </g>
//                                     );
//                                 })()}

//                                 {/* Labels on X Axis */}
//                                 <text x="77" y="198" textAnchor="middle" fill="var(--text-muted)" fontSize="10">16</text>
//                                 <text x="149" y="198" textAnchor="middle" fill="var(--text-muted)" fontSize="10">36</text>
//                                 <text x="246" y="198" textAnchor="middle" fill="var(--text-muted)" fontSize="10">63</text>
//                                 <text x="318" y="198" textAnchor="middle" fill="var(--text-muted)" fontSize="10">83</text>
//                             </svg>
//                         </div>
//                     </div>

//                     {/* Right Column: Legend */}
//                     <div style={{
//                         flex: "1 1 300px",
//                         background: "var(--bg-main)",
//                         borderRadius: "15px",
//                         padding: "1.5rem", // Reduced padding
//                         border: "1px solid var(--border)"
//                     }}>
//                         <h3 style={{
//                             margin: "0 0 1rem 0",
//                             fontSize: "1.1rem",
//                             textAlign: "center",
//                             color: "var(--text-main)"
//                         }}>
//                             What do the scores mean?
//                         </h3>

//                         <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}> {/* Reduced gap */}
//                             {ranges.map((range, idx) => {
//                                 const isActive = score >= range.min && score <= range.max;
//                                 const activeStyle = isActive ? {
//                                     background: "rgba(25, 253, 145, 0.15)", // Translucent green
//                                     border: "1px solid var(--accent)",
//                                     color: "var(--accent)",
//                                     fontWeight: "bold",
//                                     transform: "scale(1.01)",
//                                 } : {
//                                     background: "transparent",
//                                     border: "1px solid transparent",
//                                     color: "var(--text-muted)"
//                                 };

//                                 return (
//                                     <div key={idx} style={{
//                                         display: "flex",
//                                         justifyContent: "space-between",
//                                         padding: "0.6rem 0.8rem", // Reduced padding
//                                         borderRadius: "8px",
//                                         transition: "all 0.2s ease",
//                                         alignItems: "center",
//                                         fontSize: "0.9rem",
//                                         ...activeStyle
//                                     }}>
//                                         <span style={{ minWidth: "50px" }}>{range.min}-{range.max}</span>
//                                         <span style={{ textAlign: "right" }}>{range.label}</span>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </div>

//                 <div style={{ padding: "0 1.5rem 1.5rem", textAlign: "center" }}>
//                     <div style={{ marginBottom: "2rem", color: "var(--accent)" }}>
//                         ✅ Result saved to your profile!
//                     </div>

//                     <button
//                         onClick={() => navigate("/tests")}
//                         className="cta-btn"
//                         style={{
//                             padding: "1rem 2.5rem",
//                             backgroundColor: "var(--bg-accent)",
//                             color: "var(--text-main)",
//                             border: "none",
//                             borderRadius: "10px",
//                             fontSize: "1rem",
//                             cursor: "pointer",
//                             fontWeight: "600",
//                             marginRight: "1rem"
//                         }}
//                     >
//                         Back to Assessments
//                     </button>
//                     <button
//                         onClick={() => navigate("/profile")}
//                         className="cta-btn"
//                         style={{
//                             padding: "1rem 2.5rem",
//                             backgroundColor: "var(--accent)",
//                             color: "#000",
//                             border: "none",
//                             borderRadius: "10px",
//                             fontSize: "1rem",
//                             cursor: "pointer",
//                             fontWeight: "bold"
//                         }}
//                     >
//                         Go to Profile
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );
// }

// export default EqResultPage;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function EqResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (location.state) {
            setResult(location.state);
        } else {
            navigate("/tests");
        }
    }, [location, navigate]);

    if (!result) return null;

    const score = result.score; // Assumes score is 0-100 based on Likert (20-100 range)

    // Score Ranges (Dark Theme adjusted)
    const ranges = [
        { min: 0, max: 16, label: "Very low emotional intelligence" },
        { min: 17, max: 36, label: "Low emotional intelligence" },
        { min: 37, max: 63, label: "Neither low nor high" },
        { min: 64, max: 83, label: "High emotional intelligence" },
        { min: 84, max: 100, label: "Very high emotional intelligence" },
    ];

    const getInterpretation = (s) => {
        if (s >= 84) return "Very high emotional intelligence";
        if (s >= 64) return "High emotional intelligence";
        if (s >= 37) return "Neither low nor high";
        if (s >= 17) return "Low emotional intelligence";
        return "Very low emotional intelligence";
    };

    const currentInterpretation = getInterpretation(score);

    return (
        <div style={{
            // 👇 Fix: Add marginTop equal to navbar height and adjust minHeight accordingly
            minHeight: "calc(90vh - var(--navbar-height, 70px))",
            marginTop: "var(--navbar-height, 70px)",
            background: "var(--bg-main)",
            fontFamily: "'Inter', sans-serif",
            padding: "1rem",
            color: "var(--text-main)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{
                background: "var(--bg-card)",
                borderRadius: "20px",
                maxWidth: "1000px",
                width: "100%",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                border: "1px solid var(--border)"
            }}>
                {/* Header */}
                <div style={{
                    padding: "2rem",
                    textAlign: "center",
                    borderBottom: "1px solid var(--border)"
                }}>
                    <h1 style={{
                        margin: 0,
                        color: "var(--accent)",
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        textShadow: "0 0 10px rgba(25, 253, 145, 0.3)"
                    }}>
                        Emotional Intelligence Test Score
                    </h1>
                </div>

                {/* Content Grid */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    padding: "1.5rem",
                    gap: "2rem",
                    justifyContent: "center"
                }}>
                    {/* Left Column: Graph */}
                    <div style={{ flex: "1 1 350px" }}>
                        <div style={{
                            textAlign: "center",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            marginBottom: "1rem",
                            color: "var(--accent)"
                        }}>
                            <span style={{ fontSize: "1.8rem", color: "var(--text-main)" }}>{score}/100</span>
                            <div style={{ fontSize: "1rem", marginTop: "0.2rem", color: "var(--text-muted)" }}>{currentInterpretation}</div>
                        </div>

                        {/* SVG Bell Curve (Dark Theme) */}
                        <div style={{ position: "relative", height: "220px", width: "100%" }}>
                            <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                                {/* Axes/Grid lines */}
                                <line x1="20" y1="180" x2="380" y2="180" stroke="var(--border)" strokeWidth="2" />

                                {/* Bell Curve Path */}
                                <path
                                    d="M20,180 Q100,180 150,100 T200,20 T250,100 T380,180"
                                    fill="none"
                                    stroke="var(--accent)"
                                    strokeWidth="3"
                                />
                                {/* Filled area under curve */}
                                <path
                                    d="M20,180 Q100,180 150,100 T200,20 T250,100 T380,180 L380,180 L20,180 Z"
                                    fill="var(--accent)"
                                    opacity="0.1"
                                />

                                {/* "You" Marker */}
                                {(() => {
                                    const x = 20 + (Math.min(score, 100) / 100) * 360;
                                    return (
                                        <g>
                                            <line x1={x} y1="20" x2={x} y2="180" stroke="var(--accent)" strokeWidth="4" />
                                            <rect x={x - 25} y="-15" width="50" height="26" rx="6" fill="var(--accent)" />
                                            <text x={x} y="2" textAnchor="middle" fill="#000" fontSize="11" fontWeight="bold">You</text>
                                        </g>
                                    );
                                })()}

                                {/* Labels on X Axis */}
                                <text x="77" y="198" textAnchor="middle" fill="var(--text-muted)" fontSize="10">16</text>
                                <text x="149" y="198" textAnchor="middle" fill="var(--text-muted)" fontSize="10">36</text>
                                <text x="246" y="198" textAnchor="middle" fill="var(--text-muted)" fontSize="10">63</text>
                                <text x="318" y="198" textAnchor="middle" fill="var(--text-muted)" fontSize="10">83</text>
                            </svg>
                        </div>
                    </div>

                    {/* Right Column: Legend */}
                    <div style={{
                        flex: "1 1 300px",
                        background: "var(--bg-main)",
                        borderRadius: "15px",
                        padding: "1.5rem",
                        border: "1px solid var(--border)"
                    }}>
                        <h3 style={{
                            margin: "0 0 1rem 0",
                            fontSize: "1.1rem",
                            textAlign: "center",
                            color: "var(--text-main)"
                        }}>
                            What do the scores mean?
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {ranges.map((range, idx) => {
                                const isActive = score >= range.min && score <= range.max;
                                const activeStyle = isActive ? {
                                    background: "rgba(25, 253, 145, 0.15)",
                                    border: "1px solid var(--accent)",
                                    color: "var(--accent)",
                                    fontWeight: "bold",
                                    transform: "scale(1.01)",
                                } : {
                                    background: "transparent",
                                    border: "1px solid transparent",
                                    color: "var(--text-muted)"
                                };

                                return (
                                    <div key={idx} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "0.6rem 0.8rem",
                                        borderRadius: "8px",
                                        transition: "all 0.2s ease",
                                        alignItems: "center",
                                        fontSize: "0.9rem",
                                        ...activeStyle
                                    }}>
                                        <span style={{ minWidth: "50px" }}>{range.min}-{range.max}</span>
                                        <span style={{ textAlign: "right" }}>{range.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ padding: "0 1.5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ marginBottom: "2rem", color: "var(--accent)" }}>
                        ✅ Result saved to your profile!
                    </div>

                    <button
                        onClick={() => navigate("/tests")}
                        className="cta-btn"
                        style={{
                            padding: "1rem 2.5rem",
                            backgroundColor: "var(--bg-accent)",
                            color: "var(--text-main)",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "1rem",
                            cursor: "pointer",
                            fontWeight: "600",
                            marginRight: "1rem"
                        }}
                    >
                        Back to Assessments
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="cta-btn"
                        style={{
                            padding: "1rem 2.5rem",
                            backgroundColor: "var(--accent)",
                            color: "#000",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "1rem",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Go to Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EqResultPage;
