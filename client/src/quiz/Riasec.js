import React, { useState, useEffect } from "react";
import { ALL_TESTS } from "../data/allTests";
import getApiBaseUrl from "../utils/api"; 

const TEST_ID = "riasec";

// 42 RIASEC-style interest statements with pre-mapped categories
const STATEMENTS = [
  { text: "I like to work on cars", category: "R" },
  { text: "I like to do puzzles", category: "I" },
  { text: "I am good at working independently", category: "A" },
  { text: "I like to work in teams", category: "S" },
  { text: "I am an ambitious person, I set goals for myself", category: "E" },
  { text: "I like to organize things, (files, desks/offices)", category: "C" },
  { text: "I like to build things", category: "R" },
  { text: "I like to read about art and music", category: "A" },
  { text: "I like to have clear instructions to follow", category: "C" },
  { text: "I like to try to influence or persuade people", category: "E" },
  { text: "I like to do experiments", category: "I" },
  { text: "I like to teach or train people", category: "S" },
  { text: "I like trying to help people solve their problems", category: "S" },
  { text: "I like to take care of animals", category: "R" },
  { text: "I wouldn't mind working 8 hours per day in an office", category: "C" },
  { text: "I like selling things", category: "E" },
  { text: "I enjoy creative writing", category: "A" },
  { text: "I enjoy science", category: "I" },
  { text: "I am quick to take on new responsibilities", category: "E" },
  { text: "I am interested in healing people", category: "S" },
  { text: "I enjoy trying to figure out how things work", category: "I" },
  { text: "I like putting things together or assembling things", category: "R" },
  { text: "I am a creative person", category: "A" },
  { text: "I pay attention to details", category: "C" },
  { text: "I like to do filing or typing", category: "C" },
  { text: "I like to analyze things (problems/situations)", category: "I" },
  { text: "I like to play instruments or sing", category: "A" },
  { text: "I enjoy learning about other cultures", category: "S" },
  { text: "I would like to start my own business", category: "E" },
  { text: "I like to cook", category: "R" },
  { text: "I like acting in plays", category: "A" },
  { text: "I am a practical person", category: "R" },
  { text: "I like working with numbers or charts", category: "I" },
  { text: "I like to get into discussions about issues", category: "S" },
  { text: "I am good at keeping records of my work", category: "C" },
  { text: "I like to lead", category: "E" },
  { text: "I like working outdoors", category: "R" },
  { text: "I would like to work in an office", category: "C" },
  { text: "I'm good at math", category: "I" },
  { text: "I like helping people", category: "S" },
  { text: "I like to draw", category: "A" },
  { text: "I like to give speeches", category: "E" },
];

const CATEGORY_ORDER = ["R", "I", "A", "S", "E", "C"];

const CATEGORY_INFO = {
  R: {
    name: "Realistic",
    description: "These people are often good at mechanical or athletic jobs.",
    majors: ["Agriculture", "Health Assistant", "Computers", "Construction", "Mechanic/Machinist", "Engineering", "Food and Hospitality"],
    pathways: ["Natural Resources", "Health Services", "Industrial and Engineering Technology", "Arts and Communication"]
  },
  I: {
    name: "Investigative",
    description: "These people like to watch, learn, analyze and solve problems.",
    majors: ["Marine Biology", "Engineering", "Chemistry", "Zoology", "Medicine/Surgery", "Consumer Economics", "Psychology"],
    pathways: ["Health Services", "Business", "Public and Human Services", "Industrial and Engineering Technology"]
  },
  A: {
    name: "Artistic",
    description: "These people like to work in unstructured situations where they can use their creativity.",
    majors: ["Communications", "Cosmetology", "Fine and Performing Arts", "Photography", "Radio and TV", "Interior Design", "Architecture"],
    pathways: ["Public and Human Services", "Arts and Communication"]
  },
  S: {
    name: "Social",
    description: "These people like to work with other people, rather than things.",
    majors: ["Counseling", "Nursing", "Physical Therapy", "Travel", "Advertising", "Public Relations", "Education"],
    pathways: ["Health Services", "Public and Human Services"]
  },
  E: {
    name: "Enterprising",
    description: "These people like to work with others and enjoy persuading and performing.",
    majors: ["Fashion Merchandising", "Real Estate", "Marketing/Sales", "Law", "Political Science", "International Trade", "Banking/Finance"],
    pathways: ["Business", "Public and Human Services", "Arts and Communication"]
  },
  C: {
    name: "Conventional",
    description: "These people are very detail oriented, organized and like to work with data.",
    majors: ["Accounting", "Court Reporting", "Insurance", "Administration", "Medical Records", "Banking", "Data Processing"],
    pathways: ["Health Services", "Business", "Industrial and Engineering Technology"]
  }
};

function RiasecPage() {
  const test = ALL_TESTS.find((t) => t.id === TEST_ID);

  const [answers, setAnswers] = useState(Array(STATEMENTS.length).fill(""));
  const [result, setResult] = useState(null);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const API_URL = getApiBaseUrl(); 
;

  const handleChange = (qIdx, value) => {
    const next = [...answers];
    next[qIdx] = value;
    setAnswers(next);
  };

  const computeScores = () => {
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    STATEMENTS.forEach((statement, idx) => {
      if (answers[idx] === "1") {
        counts[statement.category] += 1;
      }
    });
    return counts;
  };

  const getTopThree = (counts) => {
    const arr = Object.keys(counts).map((k) => ({ key: k, count: counts[k] }));
    arr.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return CATEGORY_ORDER.indexOf(a.key) - CATEGORY_ORDER.indexOf(b.key);
    });
    return arr.slice(0, 3);
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
        body: JSON.stringify({ testName: test?.name || "RIASEC Test", result: scoredResult }),
      });
    } catch (err) {
      console.error("Failed to save RIASEC result", err);
    }
  };

  const handleSubmit = () => {
    const allAnswered = answers.every((a) => a === "1" || a === "");
    if (!allAnswered || answers.filter((a) => a === "1").length === 0) {
      alert("Please answer at least one statement before submitting.");
      return;
    }
    const counts = computeScores();
    const top = getTopThree(counts);
    const code = top.map((t) => t.key).join("");

    const topDetails = top.map((t) => ({
      letter: t.key,
      name: CATEGORY_INFO[t.key].name,
      count: t.count,
      description: CATEGORY_INFO[t.key].description,
      majors: CATEGORY_INFO[t.key].majors,
      pathways: CATEGORY_INFO[t.key].pathways,
    }));

    const scoredResult = { counts, code, top: topDetails };
    setResult(scoredResult);
    saveTestResult(scoredResult);
  };

  const handleRetake = () => {
    setAnswers(Array(STATEMENTS.length).fill(""));
    setResult(null);
  };

  if (!test) {
    return <div className="quiz-page">Test not found.</div>;
  }

  if (result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
        <div style={{ width: "95%", maxWidth: 1000, background: "rgba(20, 30, 25, 0.6)", backdropFilter: "blur(10px)", padding: "clamp(1.5rem, 3vw, 2.5rem)", borderRadius: 16, border: "1px solid rgba(25, 253, 145, 0.2)" }}>
          <h2 style={{ marginTop: 0, color: "#19fd91", fontSize: "clamp(1.3rem, 4vw, 1.6rem)" }}>Results of The RIASEC Test</h2>

          <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "rgba(25, 253, 145, 0.1)", borderLeft: "4px solid #19fd91", borderRadius: 6 }}>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
              Your results show your strongest interest areas based on the Holland Code framework. Use these insights to explore careers, college majors, and work environments that match your natural interests.
            </p>
          </div>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "1rem", color: "#19fd91", fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}>Your Interest Scores</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.7rem", marginBottom: "1.5rem" }}>
            {CATEGORY_ORDER.map((k) => (
              <div key={k} style={{
                background: result.counts[k] > 0 ? "rgba(25, 253, 145, 0.15)" : "rgba(255,255,255,0.05)",
                padding: "0.9rem",
                borderRadius: 8,
                border: "1px solid rgba(25, 253, 145, 0.3)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "0.4rem" }}>
                  {k} — {CATEGORY_INFO[k].name}
                </div>
                <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "#19fd91" }}>
                  {result.counts[k]}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(25, 253, 145, 0.2)",
            padding: "clamp(1rem, 2vw, 1.5rem)",
            borderRadius: 10,
            border: "2px solid #19fd91",
            marginBottom: "2rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", marginBottom: "0.5rem" }}>
              <strong>Your Holland Interest Code</strong>
            </div>
            <div style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, color: "#19fd91", letterSpacing: "0.2em" }}>
              {result.code}
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginTop: "0.4rem" }}>
              Top 3 Interest Areas (Ranked by score)
            </div>
          </div>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "1rem", color: "#19fd91", fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}>Your Top Three Interest Areas</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.2rem", marginBottom: "2rem" }}>
            {result.top.map((t, idx) => (
              <div key={t.letter} style={{
                padding: "clamp(1rem, 2vw, 1.5rem)",
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(25, 253, 145, 0.3)"
              }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{
                    backgroundColor: "#19fd91",
                    color: "#000",
                    borderRadius: "50%",
                    width: "clamp(36px, 5vw, 44px)",
                    height: "clamp(36px, 5vw, 44px)",
                    minWidth: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "clamp(1rem, 3vw, 1.2rem)",
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "clamp(1rem, 3vw, 1.15rem)", color: "#19fd91" }}>
                      {t.letter} — {t.name}
                    </h4>
                    <p style={{ margin: "0", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                      {t.description}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: "rgba(25, 253, 145, 0.08)",
                  padding: "1rem",
                  borderRadius: 8,
                  border: "1px solid rgba(25, 253, 145, 0.2)",
                  marginBottom: "0.8rem"
                }}>
                  <div style={{ marginBottom: "0.6rem" }}>
                    <strong style={{ color: "#19fd91", fontSize: "0.9rem" }}>Good College Majors:</strong>
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: "0.5rem"
                  }}>
                    {t.majors.map((major, i) => (
                      <div key={i} style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.85)",
                        padding: "0.4rem 0.7rem",
                        background: "rgba(25, 253, 145, 0.12)",
                        borderRadius: 5,
                        border: "1px solid rgba(25, 253, 145, 0.25)"
                      }}>
                        • {major}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: "rgba(25, 253, 145, 0.08)",
                  padding: "1rem",
                  borderRadius: 8,
                  border: "1px solid rgba(25, 253, 145, 0.2)"
                }}>
                  <div style={{ marginBottom: "0.6rem" }}>
                    <strong style={{ color: "#19fd91", fontSize: "0.9rem" }}>Related Career Pathways:</strong>
                  </div>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem"
                  }}>
                    {t.pathways.map((pathway, i) => (
                      <div key={i} style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.85)",
                        padding: "0.4rem 0.8rem",
                        background: "rgba(25, 253, 145, 0.15)",
                        borderRadius: 20,
                        border: "1px solid rgba(25, 253, 145, 0.3)",
                        fontWeight: 500
                      }}>
                        {pathway}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "1.5rem", padding: "1.2rem", background: "rgba(25, 253, 145, 0.1)", borderRadius: 8, border: "1px solid rgba(25, 253, 145, 0.25)" }}>
            <strong style={{ fontSize: "1rem", color: "#19fd91" }}>How to Use Your Interest Code</strong>
            <p style={{ margin: "0.6rem 0 0 0", fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
              Your 3-letter Interest Code ({result.code}) reflects the three RIASEC areas you scored highest in. Use it to:
            </p>
            <ul style={{ margin: "0.5rem 0 0 1.5rem", fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
              <li>Explore careers aligned with your natural interests</li>
              <li>Research college programs and majors in related fields</li>
              <li>Identify internships and volunteer opportunities that match your interests</li>
              <li>Guide course selections and career pathway decisions</li>
              <li>Discuss your results with career counselors or academic advisors</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
           
          </div>
        </div>
      </div>
    );
  }

  // Main test screen
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "6rem 1rem 2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 1100, background: "rgba(20, 30, 25, 0.6)", backdropFilter: "blur(10px)", padding: "clamp(1rem, 3vw, 2rem)", borderRadius: 12, border: "1px solid rgba(25, 253, 145, 0.2)" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#19fd91", fontSize: "clamp(1.3rem, 4vw, 1.8rem)" }}>{test.name}</h1>

        <div style={{ marginBottom: "1.5rem", padding: "0.8rem", borderRadius: 8, background: "rgba(25, 253, 145, 0.1)", border: "1px solid rgba(25, 253, 145, 0.25)" }}>
          <strong style={{ color: "#19fd91", display: "block", marginBottom: "0.5rem" }}>Instructions</strong>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
            <li>Read each statement carefully.</li>
            <li>If the statement resonates with you or describes you, fill in the circle.</li>
            <li>If it does not resonate, leave it blank and move to the next statement.</li>
            <li>It is not mandatory to circle every statement.</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {(() => {
            const half = Math.ceil(STATEMENTS.length / 2);
            const left = STATEMENTS.slice(0, half);
            const right = STATEMENTS.slice(half);

            const renderColumn = (list, offset) => (
              <div style={{ flex: "1 1 calc(50% - 1rem)", minWidth: "300px" }} key={offset}>
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                  <table style={{
                    width: "100%",
                    minWidth: "500px",
                    borderCollapse: "collapse",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(25, 253, 145, 0.3)",
                    fontSize: "0.85rem",
                    borderRadius: 8,
                    overflow: "hidden"
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: "rgba(25, 253, 145, 0.2)", borderBottom: "2px solid rgba(25, 253, 145, 0.4)" }}>
                        <th style={{
                          textAlign: "center",
                          padding: "0.6rem 0.3rem",
                          width: "32px",
                          fontWeight: 600,
                          color: "#19fd91",
                          borderRight: "1px solid rgba(25, 253, 145, 0.2)"
                        }}>#</th>
                        <th style={{
                          textAlign: "left",
                          padding: "0.6rem 0.5rem",
                          fontWeight: 600,
                          color: "#19fd91"
                        }}>Statement</th>
                        {CATEGORY_ORDER.map((c) => (
                          <th key={c} style={{
                            textAlign: "center",
                            padding: "0.6rem 0.3rem",
                            width: "44px",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "#19fd91",
                            borderLeft: "1px solid rgba(25, 253, 145, 0.2)"
                          }}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((statement, i) => {
                        const idx = offset + i;
                        const isSelected = answers[idx] === "1";
                        return (
                          <tr key={idx} style={{
                            borderBottom: "1px solid rgba(25, 253, 145, 0.15)",
                            backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"
                          }}>
                            <td style={{
                              padding: "0.5rem 0.3rem",
                              textAlign: "center",
                              fontSize: "0.8rem",
                              color: "rgba(255,255,255,0.5)",
                              fontWeight: 600,
                              borderRight: "1px solid rgba(25, 253, 145, 0.15)"
                            }}>{idx + 1}.</td>
                            <td style={{
                              padding: "0.5rem 0.5rem",
                              fontSize: "0.85rem",
                              color: "rgba(255,255,255,0.9)",
                              lineHeight: 1.3
                            }}>{statement.text}</td>
                            {CATEGORY_ORDER.map((c) => (
                              <td key={c} style={{
                                textAlign: "center",
                                padding: "0.4rem 0.3rem",
                                borderLeft: "1px solid rgba(25, 253, 145, 0.15)",
                                verticalAlign: "middle"
                              }}>
                                {statement.category === c && (
                                  <button
                                    onClick={() => handleChange(idx, isSelected ? "" : "1")}
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      border: isSelected ? "3px solid #19fd91" : "2px solid rgba(255,255,255,0.3)",
                                      backgroundColor: isSelected ? "#19fd91" : "transparent",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: "0",
                                      transition: "all 0.2s ease",
                                      margin: "0 auto"
                                    }}
                                    title={`Circle for statement ${idx + 1}`}
                                  >
                                    {isSelected && <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#000" }}></div>}
                                  </button>
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );

            return [renderColumn(left, 0), renderColumn(right, half)];
          })()}
        </div>

        <div style={{
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: window.innerWidth < 600 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: window.innerWidth < 600 ? "stretch" : "center",
          gap: "0.8rem",
          padding: "0.8rem",
          backgroundColor: "rgba(25, 253, 145, 0.1)",
          borderRadius: 8,
          border: "1px solid rgba(25, 253, 145, 0.25)"
        }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "rgba(255,255,255,0.85)", textAlign: window.innerWidth < 600 ? "center" : "left" }}>
            Circles filled: <strong style={{ color: "#19fd91" }}>{answers.filter((a) => a === "1").length}</strong> of <strong style={{ color: "#19fd91" }}>{STATEMENTS.length}</strong>
          </div>
          <button onClick={handleSubmit} style={{
            padding: "0.7rem 1.4rem",
            borderRadius: 8,
            background: answers.filter((a) => a === "1").length === 0 ? "rgba(25, 253, 145, 0.3)" : "#19fd91",
            color: answers.filter((a) => a === "1").length === 0 ? "rgba(255,255,255,0.5)" : "#000",
            border: "none",
            cursor: answers.filter((a) => a === "1").length === 0 ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "all 0.2s"
          }}
            onMouseOver={(e) => {
              if (answers.filter((a) => a === "1").length > 0) {
                e.target.style.background = "#15d67b";
              }
            }}
            onMouseOut={(e) => {
              if (answers.filter((a) => a === "1").length > 0) {
                e.target.style.background = "#19fd91";
              }
            }}>
            Submit & Get Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default RiasecPage;