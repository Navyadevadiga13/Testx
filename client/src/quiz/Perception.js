import React, { useState, useEffect } from "react";
import smileyImg from "../assets/smiley_test.png";
import getApiBaseUrl from "../utils/api";

const TEST_NAME = "Perception Personality Test";

const TEST_DESCRIPTION =
  "Enter the first 4 words that you see";

// ✅ Allowed words (from smiley)

const ALLOWED_WORDS = [
  // --- PRIMARY TRAITS ---
  "happy","lazy","impatient","patient","genuine","elegant","peaceful","reserved",
  "witty","sentimental","lovely","dependent","loyal","lethargic","dramatic",
  "overdramatic","talented","charismatic","honest","naive","shy","kind",
  "passionate","insecure","secure","thoughtful","thought","eloquent",
  "restless","outgoing","sweet",

  // --- ADDITIONAL VALID TRAITS ---
  "sincere","charming","courageous","compassionate","helpful","stubborn","calculating",

  // --- VALID SUB-WORDS ---
  "passion","love","depend","drama","talent",
  "spoken","sentiment","mental","peace"
];

function Perception() {
  const [words, setWords] = useState(["", "", "", ""]);
  const [result, setResult] = useState(null);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const API_URL = getApiBaseUrl();

  const handleChange = (index, value) => {
    const updated = [...words];
    updated[index] = value;
    setWords(updated);
  };

  // 🔥 Levenshtein Distance (for spelling correction)
  const levenshteinDistance = (a, b) => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  };

  // 🔥 Find closest valid word
  const getClosestWord = (input) => {
    input = input.toLowerCase();

    if (ALLOWED_WORDS.includes(input)) return input;

    for (let allowed of ALLOWED_WORDS) {
      if (levenshteinDistance(input, allowed) <= 1) {
        return allowed;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const trimmed = words.map(w => w.trim().toLowerCase());

    // 1️⃣ Must enter 4 words
    if (trimmed.some(w => w === "")) {
      alert("Please enter exactly 4 words.");
      return;
    }

    // 2️⃣ No duplicates
    const unique = new Set(trimmed);
    if (unique.size !== 4) {
      alert("Please enter 4 different words.");
      return;
    }

    // 3️⃣ Validate + autocorrect
    let correctedWords = [];

    for (let word of trimmed) {
      const match = getClosestWord(word);

      if (!match) {
        alert(`"${word}" does not exist in the smiley words.`);
        return;
      }

      correctedWords.push(match);
    }

    // Capitalize
    const formatted = correctedWords.map(
      w => w.charAt(0).toUpperCase() + w.slice(1)
    );

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: TEST_NAME,
          result: { selectedWords: formatted }
        })
      });

      const savedData = await response.json();
      setResult(savedData.result);
        window.scrollTo(0, 0);

    } catch (error) {
      console.error("Error saving Perception result:", error);
    }
  };

  const handleRetake = () => {
    setWords(["", "", "", ""]);
    setResult(null);
  };

  /* ---------------- RESULT SCREEN ---------------- */

  if (result) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>{TEST_NAME}</h1>

        <div style={styles.resultCard}>
          <h2>This is your personality</h2>

          <div style={styles.sentence}>
            You are{" "}
            {result.selectedWords.map((word, index) => {
              if (index === result.selectedWords.length - 1) {
                return `and ${word}`;
              }
              return `${word}, `;
            })}
            .
          </div>

          <div style={styles.wordsContainer}>
            {result.selectedWords.map((word, index) => (
              <div key={index} style={styles.wordBadge}>
                {word}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "10px", color: "#19fd91" }}>
            ✅ Result saved to your profile!
          </div>

      
        </div>
      </div>
    );
  }

  /* ---------------- INPUT SCREEN ---------------- */

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{TEST_NAME}</h1>
      <p style={styles.description}>{TEST_DESCRIPTION}</p>

      <div style={styles.imageWrapper}>
        <img
          src={smileyImg}
          alt="Smiley Word Test"
          style={styles.image}
        />
      </div>

      <div style={styles.inputContainer}>
        {words.map((word, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Word ${index + 1}`}
            value={word}
            onChange={(e) => handleChange(index, e.target.value)}
            style={styles.input}
          />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button style={styles.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    maxWidth: "800px",
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
    marginBottom: "30px",
  },
  imageWrapper: {
    marginBottom: "30px",
  },
  image: {
    maxWidth: "350px",
    width: "100%",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #19fd91",
    background: "#111",
    color: "white",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "12px 25px",
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
    padding: "30px",
    marginTop: "20px",
  },
  sentence: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#19fd91",
    marginTop: "10px"
  },
  wordsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
    margin: "20px 0",
  },
  wordBadge: {
    padding: "10px 18px",
    background: "#19fd91",
    color: "#000",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "16px",
  },
};

export default Perception;