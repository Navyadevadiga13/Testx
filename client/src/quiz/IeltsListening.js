import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiSave,
  FiVolume2,
  FiClock,
  FiAlertTriangle,
  FiPlay,
} from "react-icons/fi";
import getApiBaseUrl from "../utils/api";

// ==========================================
// DATA
// ==========================================
const IELTS_DATA_LISTENING = {
  title: "IELTS Listening Practice Test 1",
  sections: [
    {
      id: "s1",
      title: "Section 1: Revision Note",
      audioSrc: "/audio/test1.mp3",
      questionGroups: [
        {
          instruction:
            "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
          image: null,
          questions: [
            {
              id: "q1",
              text: "Problem with: the brochure sample. Company name: ______ Hotel Chains",
              type: "fill_blank",
              answer: "central",
            },
            {
              id: "q2",
              text: "Letters of the ______ should be bigger.",
              type: "fill_blank",
              answer: "address",
            },
            {
              id: "q3",
              text: "The information of the ______ should be removed.",
              type: "fill_blank",
              answer: "pool",
            },
            {
              id: "q4",
              text: "Change the description under the top photo to ______.",
              type: "fill_blank",
              answer: "reception",
            },
            {
              id: "q5",
              text: "Use the picture with the ______ of the hotel.",
              type: "fill_blank",
              answer: "view",
            },
            {
              id: "q6",
              text: "The ______ should be in red print.",
              type: "fill_blank",
              answer: "price",
            },
            {
              id: "q7",
              text: "Translate into ______.",
              type: "fill_blank",
              answer: "spanish",
            },
            {
              id: "q8",
              text: "Deadline: by the end of ______.",
              type: "fill_blank",
              answer: "july",
            },
            {
              id: "q9",
              text: "Address: No. 9 Green Drive, ______ , NY21300.",
              type: "fill_blank",
              answer: "cliffside",
            },
            {
              id: "q10",
              text: "Telephone number: ______.",
              type: "fill_blank",
              answer: "8664428",
            },
          ],
        },
      ],
    },

    {
      id: "s2",
      title: "Section 2: Park Tour Guide",
      audioSrc: "/audio/test1.mp3",
      questionGroups: [
        {
          instruction: "Choose the correct letter A, B or C.",
          image: null,
          questions: [
            {
              id: "q11",
              text: "The most famous view in this park is:",
              type: "mcq",
              options: [
                "A. the largest waterfall worldwide",
                "B. the longest river in the world",
                "C. the biggest sub-tropical rainforest",
              ],
              answer: "C",
            },
            {
              id: "q12",
              text: "According to the tour guide, what is best to do on top of the mountain?",
              type: "mcq",
              options: [
                "A. having a picnic",
                "B. taking photos",
                "C. strolling about",
              ],
              answer: "B",
            },
            {
              id: "q13",
              text: "What did the tour guide recommend for experienced walkers?",
              type: "mcq",
              options: [
                "A. the mountain trail",
                "B. the bush track",
                "C. the creek circuit",
              ],
              answer: "C",
            },
            {
              id: "q14",
              text: "What is mentioned about the transport in the park?",
              type: "mcq",
              options: [
                "A. bicycles can be hired",
                "B. trams are available",
                "C. it is included in the ticket",
              ],
              answer: "A",
            },
            {
              id: "q15",
              text: "Which activity is provided for adults all year round?",
              type: "mcq",
              options: [
                "A. abseiling",
                "B. bungee jumping",
                "C. paragliding",
              ],
              answer: "A",
            },
            {
              id: "q16",
              text: "What should visitors do before going to the restaurant?",
              type: "mcq",
              options: [
                "A. make bookings",
                "B. ask for availability",
                "C. collect meal ticket at reception",
              ],
              answer: "C",
            },
          ],
        },

        {
          instruction:
            "Label the map below. Write the correct letter, A–I, next to questions 17–20.",
          image: "/images/campsite_map.png",
          mapOptions: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
          questions: [
            { id: "q17", text: "Campsite", type: "map", answer: "G" },
            {
              id: "q18",
              text: "Business Centre",
              type: "map",
              answer: "H",
            },
            { id: "q19", text: "Museum", type: "map", answer: "I" },
            { id: "q20", text: "Cafe", type: "map", answer: "F" },
          ],
        },
      ],
    },

    {
      id: "s3",
      title: "Section 3: Nursing Program Discussion",
      audioSrc: "/audio/test1.mp3",
      questionGroups: [
        {
          instruction: "Choose the correct letter A, B or C.",
          image: null,
          questions: [
            {
              id: "q21",
              text: "How old are the students in the nursing program?",
              type: "mcq",
              options: [
                "A. teenagers",
                "B. in their twenties",
                "C. different age groups",
              ],
              answer: "C",
            },
            {
              id: "q22",
              text: "What do the speakers say about the group project?",
              type: "mcq",
              options: [
                "A. improves relationships",
                "B. develops problem solving",
                "C. creates supportive environment",
              ],
              answer: "B",
            },
            {
              id: "q23",
              text: "Which part of the program surprised Paul?",
              type: "mcq",
              options: [
                "A. number of essays",
                "B. amount of practical work",
                "C. internship opportunity",
              ],
              answer: "A",
            },
            {
              id: "q24",
              text: "What do they feel about learning law?",
              type: "mcq",
              options: [
                "A. essential training",
                "B. too theoretical",
                "C. takes too much time",
              ],
              answer: "A",
            },
          ],
        },

        {
          instruction:
            "What improvement do the speakers suggest for each of the following? Choose SIX answers from the box A–H.",
          image: "/images/options_box.png",
          mapOptions: ["A", "B", "C", "D", "E", "F", "G", "H"],
          questions: [
            { id: "q25", text: "Essays", type: "map", answer: "E" },
            { id: "q26", text: "Lectures", type: "map", answer: "G" },
            { id: "q27", text: "Research", type: "map", answer: "F" },
            { id: "q28", text: "Online forum", type: "map", answer: "D" },
            {
              id: "q29",
              text: "Placement tests",
              type: "map",
              answer: "B",
            },
            { id: "q30", text: "Freshmen", type: "map", answer: "C" },
          ],
        },
      ],
    },

    {
      id: "s4",
      title: "Section 4: Penguins in Africa",
      audioSrc: "/audio/test1.mp3",
      questionGroups: [
        {
          instruction: "Write ONE WORD ONLY for each answer.",
          image: null,
          questions: [
            {
              id: "q31",
              text: "The ______ of their body remains constant.",
              type: "fill_blank",
              answer: "temperature",
            },
            {
              id: "q32",
              text: "They restrict their ______ on land from dusk till dawn.",
              type: "fill_blank",
              answer: "movement",
            },
            {
              id: "q33",
              text: "They cannot fly because they have heavy ______.",
              type: "fill_blank",
              answer: "bones",
            },
            {
              id: "q34",
              text: "They build nests in underground ______.",
              type: "fill_blank",
              answer: "burrows",
            },
            {
              id: "q35",
              text: "Their main food source is ______.",
              type: "fill_blank",
              answer: "fish",
            },
            {
              id: "q36",
              text: "Predators include seals, seagulls and ______.",
              type: "fill_blank",
              answer: "sharks",
            },
            {
              id: "q37",
              text: "Seagulls often eat the penguin ______.",
              type: "fill_blank",
              answer: "eggs",
            },
            {
              id: "q38",
              text: "Penguins replace old ______ during moulting.",
              type: "fill_blank",
              answer: "feathers",
            },
            {
              id: "q39",
              text: "They fight for nesting ______ and food.",
              type: "fill_blank",
              answer: "space",
            },
            {
              id: "q40",
              text: "This helps increase the ______ of their genes.",
              type: "fill_blank",
              answer: "diversity",
            },
          ],
        },
      ],
    },
  ],
};

// ==========================================
// COMPONENT
// ==========================================
export default function IeltsListening() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const audioRefs = useRef({});
  const API_URL = getApiBaseUrl();

  // ==========================================
  // TIMER
  // ==========================================
  useEffect(() => {
    let timer;

    if (hasStarted && !showResult) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleCalculateScore();
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [hasStarted, showResult]);

  // ==========================================
  // AUTO PLAY NEXT AUDIO
  // ==========================================
  useEffect(() => {
    const audios = Object.values(audioRefs.current);

    audios.forEach((audio, index) => {
      if (!audio) return;

      audio.onended = () => {
        const nextAudio = audios[index + 1];

        if (nextAudio) {
          nextAudio.play().catch(() => {});
        }
      };
    });
  }, [hasStarted]);

  // ==========================================
  // HELPERS
  // ==========================================
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const normalize = (t) =>
    (t || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w]/g, "");

  // ==========================================
  // START TEST
  // ==========================================
  const startTest = () => {
    setAudioError("");

    const firstAudio = audioRefs.current["s1"];

    if (firstAudio) {
      firstAudio.currentTime = 0;

      firstAudio
        .play()
        .then(() => {
          setHasStarted(true);
        })
        .catch(() => {
          setAudioError(
            "Audio file not found. Please check /public/audio/test1.mp3"
          );
        });
    }
  };

  // ==========================================
  // ANSWERS
  // ==========================================
  const handleInput = (qId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  // ==========================================
  // SCORE
  // ==========================================
  const handleCalculateScore = () => {
    let s = 0;
    let total = 0;

    const breakdown = {};

    IELTS_DATA_LISTENING.sections.forEach((sec) => {
      sec.questionGroups.forEach((grp) => {
        grp.questions.forEach((item) => {
          total++;

          const user = normalize(answers[item.id]);
          const correct = normalize(item.answer);

          const isCorrect =
            item.type === "mcq" || item.type === "map"
              ? user.charAt(0) === correct.charAt(0)
              : user === correct;

          if (isCorrect) s++;

          breakdown[item.id] = {
            user: answers[item.id] || "",
            correct: item.answer,
            isCorrect,
          };
        });
      });
    });

    setScore(s);
    setShowResult(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    saveResult(s, total, breakdown);
  };

  // ==========================================
  // SAVE RESULT
  // ==========================================
  const saveResult = async (finalScore, total, breakdown) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testName: IELTS_DATA_LISTENING.title,
          result: {
            score: finalScore,
            total,
            percentage: Math.round((finalScore / total) * 100) + "%",
            breakdown,
          },
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // QUESTION
  // ==========================================
  const renderQuestion = (item) => {
    const userAns = normalize(answers[item.id]);
    const correctAns = normalize(item.answer);

    let isCorrect = false;

    if (showResult) {
      isCorrect =
        item.type === "mcq" || item.type === "map"
          ? userAns.charAt(0) === correctAns.charAt(0)
          : userAns === correctAns;
    }

    return (
      <div className="il-question" key={item.id}>
        <div className="il-q-row">
          <div
            className={`il-q-num ${
              showResult ? (isCorrect ? "correct" : "wrong") : ""
            }`}
          >
            {item.id.replace("q", "")}
          </div>

          <div className="il-q-body">
            {/* FILL BLANK */}
            {item.type === "fill_blank" && (
              <div className="il-q-text">
                {item.text.split("______").map((part, i, arr) => (
                  <span key={i}>
                    {part}

                    {i < arr.length - 1 &&
                      (showResult ? (
                        <span
                          className={`il-blank-result ${
                            isCorrect ? "correct" : "wrong"
                          }`}
                        >
                          {answers[item.id] || "—"}
                        </span>
                      ) : (
                        <input
                          className="il-input"
                          type="text"
                          value={answers[item.id] || ""}
                          onChange={(e) =>
                            handleInput(item.id, e.target.value)
                          }
                        />
                      ))}
                  </span>
                ))}
              </div>
            )}

            {/* MCQ */}
            {item.type === "mcq" && (
              <>
                <div className="il-q-text">{item.text}</div>

                <div className="il-options">
                  {item.options.map((opt) => {
                    const letter = opt.charAt(0);

                    const isSelected = answers[item.id] === letter;

                    const isCorrectOpt =
                      showResult &&
                      letter === correctAns.charAt(0).toUpperCase();

                    const isWrongSel =
                      showResult && isSelected && !isCorrectOpt;

                    return (
                      <div
                        key={opt}
                        className={`il-option ${
                          !showResult && isSelected ? "selected" : ""
                        } ${
                          showResult && isCorrectOpt
                            ? "result-correct"
                            : ""
                        } ${
                          showResult && isWrongSel ? "result-wrong" : ""
                        }`}
                        onClick={() => {
                          if (!showResult)
                            handleInput(item.id, letter);
                        }}
                      >
                        <div
                          className={`il-radio ${
                            !showResult && isSelected
                              ? "checked"
                              : ""
                          } ${
                            showResult && isCorrectOpt
                              ? "correct-radio"
                              : ""
                          } ${
                            showResult && isWrongSel
                              ? "wrong-sel"
                              : ""
                          }`}
                        />

                        <span className="il-option-text">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* REVEAL */}
            {showResult && !isCorrect && (
              <div className="il-answer-reveal">
                Correct answer: <strong>{item.answer}</strong>
              </div>
            )}
          </div>

          {/* RESULT ICON */}
          {showResult && (
            <div className="il-result-icon">
              {isCorrect ? (
                <FiCheckCircle size={20} color="#19a96b" />
              ) : (
                <FiXCircle size={20} color="#e55" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // MAP GROUP
  // ==========================================
  const renderMapGroup = (grp) => {
    return (
      <div className="il-map-layout">
        {/* IMAGE */}
        {grp.image ? (
          <div className="il-map-img-wrap">
            <img
              src={grp.image}
              alt="map"
              className="il-map-img"
            />
          </div>
        ) : (
          <div className="il-map-placeholder">No image</div>
        )}

        {/* TABLE */}
        <div className="il-map-table-wrap">
          <table className="il-map-table">
            <thead>
              <tr>
                <th className="il-map-th-label"></th>

                {grp.mapOptions.map((letter) => (
                  <th key={letter} className="il-map-th">
                    {letter}
                  </th>
                ))}

                <th className="il-map-th-icon"></th>
              </tr>
            </thead>

            <tbody>
              {grp.questions.map((item) => {
                const userAns = normalize(answers[item.id]);

                const correctAns = normalize(item.answer);

                const isCorrect =
                  userAns.charAt(0) === correctAns.charAt(0);

                return (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td className="il-map-td-label">
                        <div className="il-map-td-label-inner">
                          <span className="il-q-num sm">
                            {item.id.replace("q", "")}
                          </span>

                          <span className="il-map-text">
                            {item.text}
                          </span>
                        </div>
                      </td>

                      {grp.mapOptions.map((letter) => {
                        const isSelected =
                          answers[item.id] === letter;

                        const isCorrectOpt =
                          showResult &&
                          letter ===
                            correctAns.charAt(0).toUpperCase();

                        const isWrongSel =
                          showResult &&
                          isSelected &&
                          !isCorrectOpt;

                        return (
                          <td
                            key={letter}
                            className="il-map-td-radio"
                            onClick={() => {
                              if (!showResult)
                                handleInput(item.id, letter);
                            }}
                          >
                            <div
                              className={`il-radio-cell ${
                                !showResult && isSelected
                                  ? "radio-checked"
                                  : ""
                              } ${
                                showResult && isCorrectOpt
                                  ? "radio-correct"
                                  : ""
                              } ${
                                showResult && isWrongSel
                                  ? "radio-wrong"
                                  : ""
                              }`}
                            />
                          </td>
                        );
                      })}

                      <td className="il-map-td-icon">
                        {showResult &&
                          (isCorrect ? (
                            <FiCheckCircle
                              size={16}
                              color="#19a96b"
                            />
                          ) : (
                            <FiXCircle
                              size={16}
                              color="#e55"
                            />
                          ))}
                      </td>
                    </tr>

                    {showResult && !isCorrect && (
                      <tr className="il-map-tr-reveal">
                        <td
                          colSpan={grp.mapOptions.length + 2}
                          className="il-map-td-reveal"
                        >
                          <div className="il-answer-reveal">
                            Correct answer:{" "}
                            <strong>{item.answer}</strong>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <>


      <div className="il-page">
        {/* TIMER */}
        <div className="il-timer-bar">
          <h1>IELTS Listening Practice Test 1</h1>
<style>{`
  *{
    box-sizing:border-box;
  }

  html,
  body,
  #root{
    width:100%;
    overflow-x:hidden;
    margin:0;
    padding:0;
  }

  body{
    background:#f4f7f4;
    font-family:Arial, Helvetica, sans-serif;
    color:#1f2937;
  }

  .il-page{
    width:100%;
    min-height:100vh;
    background:#f4f7f4;
    overflow-x:hidden;
  }

  .il-container{
    width:100%;
    max-width:1200px;
    margin:auto;
    padding:24px;
  }

  /* =========================
      TIMER BAR
  ========================= */

  .il-timer-bar{
    position:sticky;
    top:0;
    z-index:999;
    width:100%;
    background:white;
    border-bottom:1px solid #e5e7eb;
    box-shadow:0 2px 10px rgba(0,0,0,.05);
    padding:16px 24px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
    flex-wrap:wrap;
  }

  .il-timer-bar h1{
    margin:0;
    font-size:clamp(18px,3vw,28px);
    color:#047857;
    font-weight:800;
  }

  .il-timer-clock{
    display:flex;
    align-items:center;
    gap:8px;
    font-size:18px;
    font-weight:700;
    color:#059669;
    background:#ecfdf5;
    border:1px solid #bbf7d0;
    padding:10px 18px;
    border-radius:999px;
  }

  .warning{
    color:#dc2626;
  }

  /* =========================
      TITLE
  ========================= */

  .il-page-title{
    font-size:clamp(30px,5vw,42px);
    margin-bottom:10px;
    color:#047857;
    font-weight:800;
  }

  .il-page-subtitle{
    color:#6b7280;
    margin-bottom:28px;
    line-height:1.6;
    font-size:15px;
  }

  /* =========================
      LIVE BADGE
  ========================= */

  .il-live-badge{
    background:#ecfdf5;
    border:1px solid #bbf7d0;
    color:#047857;
    padding:10px 16px;
    border-radius:999px;
    display:inline-flex;
    align-items:center;
    gap:8px;
    margin-bottom:26px;
    font-size:13px;
    font-weight:700;
  }

  .il-live-dot{
    width:8px;
    height:8px;
    background:#22c55e;
    border-radius:50%;
    animation:blink 1s infinite;
  }

  @keyframes blink{
    0%{opacity:1}
    50%{opacity:.3}
    100%{opacity:1}
  }

  /* =========================
      SECTION CARD
  ========================= */

  .il-section{
    background:white;
    border-radius:24px;
    overflow:hidden;
    margin-bottom:32px;
    border:1px solid #e5e7eb;
    box-shadow:0 6px 24px rgba(0,0,0,.04);
  }

  /* =========================
      SECTION HEADER
  ========================= */

  .il-section-header{
    background:linear-gradient(
      135deg,
      #047857,
      #10b981
    );
    color:white;
    padding:20px 24px;
  }

  .il-section-label{
    font-size:11px;
    color:#d1fae5;
    margin-bottom:5px;
    text-transform:uppercase;
    letter-spacing:1px;
  }

  .il-section-title{
    font-size:clamp(18px,3vw,24px);
    font-weight:700;
  }

  /* =========================
      AUDIO WRAP
  ========================= */

  .il-audio-wrap{
    display:flex;
    gap:14px;
    align-items:center;
    padding:18px 24px;
    background:#f9fafb;
    border-bottom:1px solid #e5e7eb;
    flex-wrap:wrap;
  }

  .il-audio-wrap span{
    font-weight:700;
    color:#065f46;
  }

  .il-audio-wrap audio{
    flex:1;
    width:100%;
    min-width:220px;
  }

  .il-group{
    padding:24px;
  }

  /* =========================
      INSTRUCTION BOX
  ========================= */

  .il-instruction{
    background:#f0fdf4;
    border-left:4px solid #10b981;
    padding:14px 16px;
    margin-bottom:24px;
    border-radius:10px;
    line-height:1.7;
    font-size:15px;
    color:#065f46;
  }

  /* =========================
      QUESTIONS
  ========================= */

  .il-question{
    padding:20px 0;
    border-bottom:1px solid #f0f0f0;
  }

  .il-q-row{
    display:flex;
    gap:14px;
    align-items:flex-start;
  }

  .il-q-num{
    width:36px;
    height:36px;
    border-radius:50%;
    background:#047857;
    color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:13px;
    font-weight:700;
    flex-shrink:0;
  }

  .il-q-num.sm{
    width:28px;
    height:28px;
    font-size:11px;
  }

  .correct{
    background:#10b981 !important;
  }

  .wrong{
    background:#ef4444 !important;
  }

  .il-q-body{
    flex:1;
    min-width:0;
  }

  .il-q-text{
    line-height:1.9;
    font-size:16px;
    color:#111827;
  }

  /* =========================
      INPUT
  ========================= */

  .il-input{
    border:none;
    border-bottom:2px solid #10b981;
    outline:none;
    background:transparent;
    padding:4px 8px;
    width:min(170px,100%);
    font-size:15px;
    margin:0 4px;
  }

  .il-input:focus{
    border-color:#047857;
  }

  /* =========================
      OPTIONS
  ========================= */

  .il-options{
    display:flex;
    flex-direction:column;
    gap:12px;
    margin-top:14px;
  }

  .il-option{
    display:flex;
    gap:12px;
    padding:15px;
    border:1px solid #e5e7eb;
    border-radius:14px;
    cursor:pointer;
    transition:.25s;
    line-height:1.6;
    background:white;
  }

  .il-option:hover{
    background:#f0fdf4;
    border-color:#86efac;
  }

  .selected{
    background:#ecfdf5;
    border-color:#10b981;
  }

  .result-correct{
    background:#ecfdf5;
    border-color:#10b981;
  }

  .result-wrong{
    background:#fef2f2;
    border-color:#ef4444;
  }

  .il-radio{
    width:18px;
    height:18px;
    border:2px solid #9ca3af;
    border-radius:50%;
    margin-top:2px;
    position:relative;
    flex-shrink:0;
  }

  .checked::after,
  .correct-radio::after,
  .wrong-sel::after{
    content:'';
    width:8px;
    height:8px;
    border-radius:50%;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
  }

  .checked{
    border-color:#10b981;
  }

  .checked::after{
    background:#10b981;
  }

  .correct-radio{
    border-color:#10b981;
  }

  .correct-radio::after{
    background:#10b981;
  }

  .wrong-sel{
    border-color:#ef4444;
  }

  .wrong-sel::after{
    background:#ef4444;
  }

  /* =========================
      ANSWER REVEAL
  ========================= */

  .il-answer-reveal{
    margin-top:12px;
    background:#f0fdf4;
    border-left:4px solid #10b981;
    padding:12px 14px;
    border-radius:8px;
    color:#065f46;
  }

  .il-result-icon{
    flex-shrink:0;
    padding-top:4px;
  }

  /* =========================
      MAP
  ========================= */

  .il-map-layout{
    display:flex;
    gap:20px;
    flex-wrap:wrap;
  }

  .il-map-img{
    width:100%;
    border-radius:14px;
    border:1px solid #e5e7eb;
  }

  .il-map-table-wrap{
    flex:1 1 450px;
    overflow-x:auto;
  }

  .il-map-table{
    width:100%;
    border-collapse:collapse;
    min-width:600px;
  }

  .il-map-th{
    padding:12px;
    background:#ecfdf5;
    color:#065f46;
  }

  .il-map-th-label{
    background:#ecfdf5;
    min-width:180px;
  }

  .il-map-th,
  .il-map-td-radio,
  .il-map-th-label,
  .il-map-th-icon,
  .il-map-td-label,
  .il-map-td-icon{
    border:1px solid #d1d5db;
  }

  .il-map-td-label{
    padding:12px;
  }

  .il-map-td-label-inner{
    display:flex;
    gap:10px;
    align-items:center;
  }

  .il-map-text{
    font-weight:600;
  }

  .il-map-td-radio{
    text-align:center;
    cursor:pointer;
    padding:10px;
  }

  .il-radio-cell{
    width:18px;
    height:18px;
    border-radius:50%;
    border:2px solid #bbb;
    margin:auto;
  }

  .radio-checked{
    background:#047857;
    border-color:#047857;
    box-shadow: inset 0 0 0 3px white;
  }

  .radio-correct{
    background:#10b981;
    border-color:#10b981;
    box-shadow: inset 0 0 0 3px white;
  }

  .radio-wrong{
    background:#ef4444;
    border-color:#ef4444;
    box-shadow: inset 0 0 0 3px white;
  }

  /* =========================
      BUTTONS
  ========================= */

  .il-submit-area{
    display:flex;
    justify-content:flex-end;
    margin-top:24px;
  }

  .il-submit-btn{
    width:100%;
    max-width:280px;
    background:#10b981;
    color:white;
    border:none;
    padding:15px 24px;
    border-radius:16px;
    font-size:16px;
    font-weight:700;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    box-shadow:0 8px 24px rgba(16,185,129,.25);
    transition:.25s;
  }

  .il-submit-btn:hover{
    background:#059669;
    transform:translateY(-2px);
  }

  /* =========================
      RESULT
  ========================= */

  .il-result-banner{
    background:white;
    color:#111827;
    padding:36px 20px;
    border-radius:24px;
    text-align:center;
    margin-bottom:30px;
    border:2px solid #bbf7d0;
    box-shadow:0 8px 24px rgba(0,0,0,.05);
  }

  .il-result-score{
    font-size:clamp(48px,8vw,72px);
    color:#059669;
    font-weight:800;
  }

  .il-result-btn{
    margin-top:20px;
    background:#10b981;
    color:white;
    border:none;
    padding:12px 24px;
    border-radius:14px;
    cursor:pointer;
    font-weight:700;
  }

  /* =========================
      START OVERLAY
  ========================= */

  .il-overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);
    backdrop-filter:blur(4px);
    z-index:9999;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
  }

  .il-start-card{
    width:100%;
    max-width:520px;
    background:white;
    border-radius:28px;
    padding:36px 28px;
    text-align:center;
    box-shadow:0 20px 50px rgba(0,0,0,.15);
  }

  .il-start-icon{
    font-size:60px;
    color:#10b981;
    margin-bottom:16px;
  }

  .il-rules{
    text-align:left;
    margin:24px 0;
    background:#f9fafb;
    padding:20px;
    border-radius:14px;
    border:1px solid #e5e7eb;
  }

  .il-rule{
    margin-bottom:12px;
    line-height:1.6;
  }

  .il-error{
    background:#fef2f2;
    color:#dc2626;
    padding:12px;
    border-radius:10px;
    margin-bottom:20px;
    display:flex;
    gap:10px;
    border:1px solid #fecaca;
  }

  .il-start-btn{
    width:100%;
    border:none;
    background:#22c55e;
    color:white;
    padding:16px;
    border-radius:16px;
    font-size:16px;
    font-weight:700;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    transition:.25s;
  }

  .il-start-btn:hover{
    background:#16a34a;
    transform:translateY(-2px);
  }

  /* TABLET */

  @media(max-width:992px){

    .il-container{
      padding:16px;
    }

    .il-map-layout{
      flex-direction:column;
    }
  }

  /* MOBILE */

  @media(max-width:768px){

    .il-container{
      padding:12px;
    }

    .il-timer-bar{
      padding:12px;
      align-items:flex-start;
    }

    .il-timer-clock{
      font-size:15px;
    }

    .il-section-header{
      padding:16px;
    }

    .il-group{
      padding:16px;
    }

    .il-q-text{
      font-size:15px;
    }

    .il-option{
      padding:12px;
    }

    .il-map-table{
      min-width:520px;
    }

    .il-submit-btn{
      max-width:100%;
    }

    .il-start-card{
      padding:24px 18px;
    }
  }

  /* EXTRA SMALL */

  @media(max-width:480px){

    .il-page-title{
      font-size:24px;
    }

    .il-timer-bar h1{
      font-size:16px;
    }

    .il-q-num{
      width:30px;
      height:30px;
      font-size:12px;
    }

    .il-q-text{
      font-size:14px;
    }

    .il-option-text{
      font-size:14px;
    }

    .il-result-score{
      font-size:44px;
    }
  }
`}</style>
          <div
            className={`il-timer-clock ${
              timeLeft < 300 ? "warning" : ""
            }`}
          >
            <FiClock />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="il-container">
          {/* START OVERLAY */}
          {!hasStarted && !showResult && (
            <div className="il-overlay">
              <div className="il-start-card">
                <div className="il-start-icon">
                  <FiVolume2 />
                </div>

                <h2>Listening Test Ready</h2>

                <p>
                  Make sure your speakers or headphones are
                  working.
                </p>

                {audioError && (
                  <div className="il-error">
                    <FiAlertTriangle />
                    <span>{audioError}</span>
                  </div>
                )}

                <div className="il-rules">
                  <div className="il-rule">
                    • Audio plays once only
                  </div>

                  <div className="il-rule">
                    • No replay allowed
                  </div>

                  <div className="il-rule">
                    • Test auto-submits after 30 minutes
                  </div>
                </div>

                <button
                  className="il-start-btn"
                  onClick={startTest}
                >
                  <FiPlay />
                  Start Test
                </button>
              </div>
            </div>
          )}

          {/* HEADER */}
          <h1 className="il-page-title">
            IELTS Listening Practice Test 1
          </h1>

          <p className="il-page-subtitle">
            Answer all 40 questions.
          </p>

          {/* LIVE */}
          {hasStarted && !showResult && (
            <div className="il-live-badge">
              <span className="il-live-dot"></span>
              AUDIO PLAYING
            </div>
          )}

          {/* RESULT */}
          {showResult && (
            <div className="il-result-banner">
              <h2>Test Complete</h2>

              <div className="il-result-score">
                {score}/40
              </div>

              <div>
                {Math.round((score / 40) * 100)}%
                correct
              </div>

              <button
                className="il-result-btn"
                onClick={() => navigate("/")}
              >
                Back to Menu
              </button>
            </div>
          )}

          {/* SECTIONS */}
          {IELTS_DATA_LISTENING.sections.map(
            (section, sIdx) => (
              <div
                className="il-section"
                key={section.id}
              >
                <div className="il-section-header">
                  <div className="il-section-label">
                    Part {sIdx + 1}
                  </div>

                  <div className="il-section-title">
                    {section.title}
                  </div>
                </div>

                {/* AUDIO */}
                <div className="il-audio-wrap">
                  <span>Part {sIdx + 1} Audio</span>

                  <audio
                    ref={(el) =>
                      (audioRefs.current[section.id] = el)
                    }
                    src={section.audioSrc}
                    controls
                    controlsList="nodownload noplaybackrate"
                  />
                </div>

                {/* GROUPS */}
                {section.questionGroups.map(
                  (grp, gIdx) => (
                    <div
                      className="il-group"
                      key={gIdx}
                    >
                      <div className="il-instruction">
                        {grp.instruction}
                      </div>

                      {grp.mapOptions
                        ? renderMapGroup(grp)
                        : grp.questions.map((item) =>
                            renderQuestion(item)
                          )}
                    </div>
                  )
                )}
              </div>
            )
          )}

          {/* SUBMIT */}
          {!showResult && (
            <div className="il-submit-area">
              <button
                className="il-submit-btn"
                onClick={handleCalculateScore}
              >
                Submit Test
                <FiSave />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}