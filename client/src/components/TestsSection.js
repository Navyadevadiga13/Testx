import React, { useRef, useEffect } from "react";
import {
  FaBrain,
  FaLanguage,
  FaArrowRight,
  FaChartPie,
  FaHeadphones,
  FaBookOpen,
  FaPenFancy,
  FaMicrophone,
  FaUniversity,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function TestsSection({ isLoggedIn }) {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  const handleStart = (route) => {
    if (isLoggedIn) navigate(route);
    else navigate("/login");
  };

  const ASSESSMENTS = [
    {
      id: "ielts",
      title: "IELTS Mock",
      subtitle: "Master the English language",
      icon: <FaLanguage />,
      buttons: [
        {
          label: "Listening",
          icon: <FaHeadphones />,
          action: () => handleStart("/quiz/listening/intro"),
        },
        {
          label: "Reading",
          icon: <FaBookOpen />,
          action: () => handleStart("/quiz/reading/intro"),
        },
        {
          label: "Writing",
          icon: <FaPenFancy />,
          action: () => handleStart("/quiz/writing/intro"),
        },
        {
          label: "Speaking",
          icon: <FaMicrophone />,
          action: () => handleStart("/quiz/speaking/intro"),
        },
      ],
    },

    {
      id: "toefl",
      title: "TOEFL Mock",
      subtitle: "TOEFL Mock Test",
      icon: <FaUniversity />,
      buttons: [
        {
          label: "Listening",
          icon: <FaHeadphones />,
          action: () => handleStart("/quiz/toefl/listening/intro"),
        },
        {
          label: "Reading",
          icon: <FaBookOpen />,
          action: () => handleStart("/quiz/toefl/reading/instruction"),
        },
        {
          label: "Writing",
          icon: <FaPenFancy />,
          action: () => handleStart("/quiz/toefl/writing/instruction"),
        },
        {
          label: "Speaking",
          icon: <FaMicrophone />,
          action: () => handleStart("/quiz/toefl/speaking"),
        },
      ],
    },

    {
      id: "gre",
      title: "GRE Mock Test",
      subtitle: "Practice for the Graduate Record Examination",
      icon: <FaBrain />,
      buttons: [
        {
          label: "Verbal Reasoning",
          icon: <FaBookOpen />,
          action: () => handleStart("/quiz/GRE/verbal-reasoning"),
        },
        {
          label: "Quantitative Reasoning",
          icon: <FaChartPie />,
          action: () => handleStart("/quiz/GRE/quantitative-analysis"),
        },
        {
          label: "Analytical Writing",
          icon: <FaChartPie />,
          action: () => handleStart("/quiz/GRE/analytical-writing"),
        },
      ],
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("card-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
        }

        body {
          margin: 0;
          background: #ffffff;
          font-family: Inter, sans-serif;
        }

        .tests-container {
          padding: 80px 60px;
          min-height: 100vh;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .tests-container::before{
          content:"";
          position:absolute;
          inset:0;

          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);

          background-size:40px 40px;
          pointer-events:none;
        }

        .tests-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 2;
        }

        .tests-main-title {
          font-size: 3rem;
          font-weight: 900;
          color: #000000;
          margin-bottom: 15px;
          line-height:1.1;
        }

        .tests-main-title span{
          color:#00c76a;
        }

        .tests-subtitle {
          color: #4b5563;
          font-size: 1.05rem;
        }

        /* ===================== */
        /* GRID */
        /* ===================== */

        .assessments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 35px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1400px) {
          .assessments-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 992px) {
          .assessments-grid {
            grid-template-columns: 1fr;
          }

          .tests-container {
            padding: 60px 20px;
          }

          .tests-main-title {
            font-size: 2.2rem;
          }
        }

        /* ===================== */
        /* CARD */
        /* ===================== */

        .assessment-interactive-card {
          background: #ffffff;

          border-radius: 24px;

          padding: 32px;

          border: 1px solid #e5e7eb;

          box-shadow:
            0 10px 30px rgba(0,0,0,0.05);

          transition: all 0.35s ease;

          opacity:0;
          transform:translateY(40px);
        }

        .assessment-interactive-card.card-visible{
          opacity:1;
          transform:translateY(0);
        }

        .assessment-interactive-card:hover {
          transform: translateY(-8px);

          border-color: rgba(0, 199, 106, 0.35);

          box-shadow:
            0 20px 40px rgba(0,0,0,0.08),
            0 0 25px rgba(0,199,106,0.08);
        }

        .card-header-interactive {
          text-align: center;
          margin-bottom: 24px;
        }

        .icon-wrapper-large {
          width: 75px;
          height: 75px;

          margin: 0 auto 18px;

          border-radius: 20px;

          display:flex;
          align-items:center;
          justify-content:center;

          font-size: 1.9rem;

          background: rgba(0, 199, 106, 0.1);

          color: #00c76a;
        }

        .card-header-interactive h2{
          color:#000000;
          font-size:1.5rem;
          margin-bottom:8px;
          font-weight:800;
        }

        .card-header-interactive p{
          color:#6b7280;
          line-height:1.6;
        }

        /* ===================== */
        /* BUTTONS */
        /* ===================== */

        .interactive-buttons-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 25px;
        }

        .interactive-btn {
          background: #ffffff;

          border: 1px solid #d1d5db;

          padding: 15px 18px;

          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #111827;

          cursor: pointer;

          transition: all 0.25s ease;

          font-size: 0.98rem;
          font-weight: 600;
        }

        .interactive-btn span{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .interactive-btn:hover {
          background: #00c76a;

          border-color: #00c76a;

          color: white;

          transform: translateX(4px);

          box-shadow:
            0 10px 25px rgba(0,199,106,0.25);
        }
      `}</style>

      <div className="tests-container">
        <div className="tests-header">
          <h1 className="tests-main-title">
            Choose Your <span>Assessment</span>
          </h1>

          <p className="tests-subtitle">
            Select a specific module to begin your mock test experience.
          </p>
        </div>

        <div className="assessments-grid">
          {ASSESSMENTS.map((assessment, index) => (
            <div
              key={assessment.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="assessment-interactive-card"
            >
              <div className="card-header-interactive">
                <div className="icon-wrapper-large">
                  {assessment.icon}
                </div>

                <h2>{assessment.title}</h2>

                <p>{assessment.subtitle}</p>
              </div>

              <div className="interactive-buttons-grid">
                {assessment.buttons.map((btn, idx) => (
                  <button
                    key={idx}
                    className="interactive-btn"
                    onClick={btn.action}
                  >
                    <span>
                      {btn.icon}
                      {btn.label}
                    </span>

                    <FaArrowRight />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TestsSection;