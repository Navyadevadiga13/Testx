// src/pages/DiagramAnalysis.js

import React, { useState, useEffect } from "react";
import getApiBaseUrl from "../utils/api";
import { useNavigate } from "react-router-dom";
import shape1 from "../assets/shape_1.PNG";
import shape2 from "../assets/shape_2.PNG";
import shape3 from "../assets/shape_3.PNG";
import shape4 from "../assets/shape_4.PNG";
import shape5 from "../assets/shape_5.PNG";

const TEST_NAME = "Diagram Analysis Test";

const SHAPES = [
  {
    id: 1,
    image: shape1,
    result: "Dynamic, Active, Extroverted",
    description: `You are quite willing to accept certain risks and to make a strong commitment in exchange for interesting and varied work.

Non-routine situations suit you best — routine has a paralyzing effect on you.
You like to play an active role in events.
Your initiative is highly pronounced.`
  },
  {
    id: 2,
    image: shape2,
    result: "Introspective, Sensitive, Reflective",
    description: `You come to grips more thoroughly with yourself than most people.

You dislike superficiality and prefer meaningful conversations.
Your deep friendships give you inner harmony and peace.`
  },
  {
    id: 3,
    image: shape3,
    result: "Down to Earth, Well-Balanced, Harmonious",
    description: `You value simplicity and authenticity.

People depend on you because you provide stability.
You prefer practical, elegant and simple things over fashion trends.`
  },
  {
    id: 4,
    image: shape4,
    result: "Carefree, Playful, Cheerful",
    description: `You love freedom and spontaneity.

You are curious and open to new experiences.
You dislike feeling restricted and enjoy life's surprises.`
  },
  {
    id: 5,
    image: shape5,
    result: "Romantic, Dreamy, Emotional",
    description: `You are highly sensitive and emotional.

Your feelings guide you strongly.
You value dreams, imagination and emotional richness in life.`
  }
];

function DiagramAnalysis() {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async () => {
    if (!selected) {
      alert("Please select a diagram first.");
      return;
    }

    const chosenShape = SHAPES.find(s => s.id === selected);

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
 "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: TEST_NAME,
          result: {
            selectedShape: chosenShape.id,
            personality: chosenShape.result,
            description: chosenShape.description
          }
        })
      });

      // 🔥 IMPORTANT: Use local data to show result
      setResult(chosenShape);

    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  const handleRetake = () => {
    setSelected(null);
    setResult(null);
  };

  /* ---------------- RESULT SCREEN ---------------- */

  if (result) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>{TEST_NAME}</h1>

        <div style={styles.resultCard}>
          <h2>{result.result}</h2>

          <div style={styles.descriptionText}>
            {result.description}
          </div>

        <div style={{ marginTop: "15px", color: "#19fd91" }}>
  ✅ Result saved to your profile!
</div>

{/* ✅ VIEW PROFILE BUTTON */}
<button
  onClick={() => navigate("/profile")}
  style={{
    marginTop: "20px",
    padding: "10px 20px",
    background: "#19fd91",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer"
  }}
>
  View Profile
</button>
          
        </div>
      </div>
    );
  }

  /* ---------------- SELECTION SCREEN ---------------- */

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{TEST_NAME}</h1>
      <p style={styles.description}>
        Select the visual that appeals to you the most.
      </p>

      {isMobile ? (
        <>
          <div style={styles.row}>
            {SHAPES.slice(0, 2).map(renderCard)}
          </div>

          <div style={styles.rowCenter}>
            {renderCard(SHAPES[2])}
          </div>

          <div style={styles.row}>
            {SHAPES.slice(3, 5).map(renderCard)}
          </div>
        </>
      ) : (
        <div style={styles.desktopRow}>
          {SHAPES.map(renderCard)}
        </div>
      )}

      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );

  function renderCard(shape) {
    return (
      <div
        key={shape.id}
        style={{
          ...styles.card,
          border:
            selected === shape.id
              ? "3px solid #19fd91"
              : "1px solid #333"
        }}
        onClick={() => setSelected(shape.id)}
      >
        <img
          src={shape.image}
          alt={`Shape ${shape.id}`}
          style={styles.image}
        />
      </div>
    );
  }
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "120px auto 60px",
    padding: "0 20px",
    textAlign: "center",
  },

  heading: {
    fontSize: "32px",
    color: "#19fd91",
    marginBottom: "10px",
  },

  description: {
    color: "#ccc",
    marginBottom: "40px",
  },

  desktopRow: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginBottom: "30px"
  },

  row: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginBottom: "25px"
  },

  rowCenter: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px"
  },

  card: {
    width: "180px",
    background: "#111",
    borderRadius: "12px",
    padding: "15px",
    cursor: "pointer",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    borderRadius: "8px"
  },

  button: {
    marginTop: "30px",
    padding: "12px 28px",
    background: "#19fd91",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },

  resultCard: {
    background: "#111",
    border: "1px solid #19fd91",
    borderRadius: "12px",
    padding: "35px",
    marginTop: "20px",
  },

  descriptionText: {
    marginTop: "20px",
    fontSize: "15px",
    color: "#ccc",
    lineHeight: "1.7",
    whiteSpace: "pre-line",
    textAlign: "left"
  }
};

export default DiagramAnalysis;