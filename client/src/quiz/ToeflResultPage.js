import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ToeflResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { correctCount = 0, total = 0, testType = "Test" } = state || {};

  const percentage = total ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "var(--bg-main)",
        paddingTop: "200px",   // 👈 pushes card further down
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          padding: "3rem",
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
            fontSize: "2rem",
          }}
        >
          TOEFL {testType} Results
        </h2>

        <div
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "0.5rem",
          }}
        >
          {percentage}%
        </div>

        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
          }}
        >
          You scored <strong>{correctCount}</strong> out of <strong>{total}</strong>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            onClick={() => navigate("/profile")}
            style={{
              padding: "1rem 2rem",
              background: "var(--accent)",
              color: "#000",
              border: "none",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Go to Profile
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "1rem 2rem",
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--border-color)",
              borderRadius: "50px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Back to Tests
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToeflResultPage;