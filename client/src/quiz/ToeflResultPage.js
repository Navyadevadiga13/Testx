import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

// ── Responsive hook (matches ToeflReading.js / ToeflListening.js) ───────────
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function ToeflResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const {
    correctCount = 0,
    total = 0,
    testType = "Test",
    breakdown = null,
    toeflScore = null,
    compositeScore = null,
    band = null,
    wordCount = null,
    warnings = [],
  } = state || {};

  // Writing results come from a rubric (0-6 composite / ~30 scaled score,
  // per-criterion breakdown object), not a right/wrong question count —
  // MCQ tests (Reading/Listening) are the only ones with a percentage.
  const isWritingResult = testType === "Writing";
  const percentage = total ? Math.round((correctCount / total) * 100) : 0;
  const criteriaBreakdown =
    isWritingResult && breakdown && !Array.isArray(breakdown)
      ? Object.values(breakdown)
      : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "var(--bg-main)",
        paddingTop: isMobile ? "110px" : "200px",
        paddingBottom: "2rem",
        paddingLeft: isMobile ? "1rem" : "2rem",
        paddingRight: isMobile ? "1rem" : "2rem",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          padding: isMobile ? "1.5rem 1.25rem" : "3rem",
          borderRadius: "20px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h2
          style={{
            color: "var(--accent)",
            marginBottom: "1.5rem",
            fontSize: isMobile ? "1.4rem" : "2rem",
          }}
        >
          TOEFL {testType} Results
        </h2>

        <div
          style={{
            fontSize: isMobile ? "2.6rem" : "4rem",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "0.5rem",
          }}
        >
          {isWritingResult ? `${toeflScore ?? 0}/30` : `${percentage}%`}
        </div>

        {isWritingResult ? (
          <>
            <p
              style={{
                fontSize: isMobile ? "1rem" : "1.2rem",
                color: "var(--text-muted)",
                marginBottom: band ? "0.5rem" : "2rem",
              }}
            >
              Rubric composite: <strong>{compositeScore ?? 0}/6</strong>
              {wordCount !== null && <> &nbsp;·&nbsp; {wordCount} words</>}
            </p>
            {band && (
              <p
                style={{
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  color: "var(--accent)",
                  fontWeight: "700",
                  marginBottom: "0.4rem",
                }}
              >
                {band.band}
              </p>
            )}
            {band && (
              <p
                style={{
                  fontSize: isMobile ? "0.82rem" : "0.9rem",
                  color: "var(--text-muted)",
                  marginBottom: "2rem",
                  lineHeight: "1.6",
                }}
              >
                {band.description}
              </p>
            )}
          </>
        ) : (
          <p
            style={{
              fontSize: isMobile ? "1rem" : "1.2rem",
              color: "var(--text-muted)",
              marginBottom: "2rem",
            }}
          >
            You scored <strong>{correctCount}</strong> out of <strong>{total}</strong>
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            onClick={() => navigate("/profile")}
            style={{
              padding: isMobile ? "0.85rem 1.5rem" : "1rem 2rem",
              background: "var(--accent)",
              color: "#000",
              border: "none",
              borderRadius: "50px",
              fontSize: isMobile ? "1rem" : "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Go to Profile
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: isMobile ? "0.85rem 1.5rem" : "1rem 2rem",
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--border-color)",
              borderRadius: "50px",
              fontSize: isMobile ? "0.9rem" : "1rem",
              cursor: "pointer",
            }}
          >
            Back to Tests
          </button>
        </div>
      </div>

      {/* ── PER-QUESTION REVIEW BREAKDOWN ── */}
      {Array.isArray(breakdown) && breakdown.length > 0 && (
        <div
          style={{
            maxWidth: "700px",
            width: "100%",
            marginTop: "1.5rem",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "16px",
              padding: isMobile ? "1.1rem 1rem" : "1.75rem",
            }}
          >
            <h3
              style={{
                color: "var(--accent)",
                marginTop: 0,
                marginBottom: "1.25rem",
                fontSize: isMobile ? "1.05rem" : "1.3rem",
              }}
            >
              Question Review
            </h3>

            {breakdown.map((item, idx) => (
              <div
                key={item.number ?? idx}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                  padding: isMobile ? "0.75rem 0" : "0.9rem 0",
                  borderTop: idx === 0 ? "none" : "1px solid var(--border-color)",
                  textAlign: "left",
                }}
              >
                <div style={{ flexShrink: 0, marginTop: "2px" }}>
                  {item.isCorrect ? (
                    <FiCheckCircle size={20} color="#19a96b" />
                  ) : (
                    <FiXCircle size={20} color="#e55" />
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1, wordBreak: "break-word" }}>
                  <div
                    style={{
                      color: "var(--text-main, #fff)",
                      fontWeight: "600",
                      fontSize: isMobile ? "0.88rem" : "0.95rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Q{item.number}. {item.questionText}
                  </div>
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: isMobile ? "0.8rem" : "0.87rem",
                      lineHeight: "1.6",
                    }}
                  >
                    <div>
                      Your answer: <strong>{item.userAnswerText || "No answer"}</strong>
                    </div>
                    {!item.isCorrect && (
                      <div>
                        Correct answer: <strong>{item.correctAnswerText}</strong>
                      </div>
                    )}
                    {item.explanation && <div>Explanation: {item.explanation}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── WRITING RUBRIC BREAKDOWN ── */}
      {criteriaBreakdown && (
        <div
          style={{
            maxWidth: "700px",
            width: "100%",
            marginTop: "1.5rem",
          }}
        >
          {warnings.length > 0 && (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: isMobile ? "1rem" : "1.5rem",
                marginBottom: "1rem",
                textAlign: "left",
              }}
            >
              {warnings.map((w, i) => (
                <p
                  key={i}
                  style={{
                    color: "var(--text-muted)",
                    fontSize: isMobile ? "0.82rem" : "0.9rem",
                    margin: i === 0 ? "0 0 6px" : "6px 0",
                    lineHeight: "1.6",
                  }}
                >
                  {w}
                </p>
              ))}
            </div>
          )}

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "16px",
              padding: isMobile ? "1.1rem 1rem" : "1.75rem",
            }}
          >
            <h3
              style={{
                color: "var(--accent)",
                marginTop: 0,
                marginBottom: "1.25rem",
                fontSize: isMobile ? "1.05rem" : "1.3rem",
                textAlign: "left",
              }}
            >
              Rubric Breakdown
            </h3>

            {criteriaBreakdown.map((c, idx) => (
              <div
                key={c.label ?? idx}
                style={{
                  padding: isMobile ? "0.75rem 0" : "0.9rem 0",
                  borderTop: idx === 0 ? "none" : "1px solid var(--border-color)",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "0.75rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-main, #fff)",
                      fontWeight: "600",
                      fontSize: isMobile ? "0.88rem" : "0.95rem",
                    }}
                  >
                    {c.label}
                  </span>
                  <span
                    style={{
                      color: "var(--accent)",
                      fontWeight: "700",
                      fontSize: isMobile ? "0.85rem" : "0.92rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.score}/6
                  </span>
                </div>
                {Array.isArray(c.diagnostics) && c.diagnostics.length > 0 && (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.1rem",
                      color: "var(--text-muted)",
                      fontSize: isMobile ? "0.8rem" : "0.87rem",
                      lineHeight: "1.6",
                    }}
                  >
                    {c.diagnostics.map((d, dIdx) => (
                      <li key={dIdx}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ToeflResultPage;
