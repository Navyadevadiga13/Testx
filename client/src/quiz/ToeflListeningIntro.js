import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaHeadphones } from "react-icons/fa";

function ToeflListeningIntro() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartTest = () => {
    navigate("/quiz/toefl/listening");
  };

  return (
    <>
      <style>{`
        .listening-container {
          min-height: 100vh;
          background: #ffffff;
          padding: 2rem;
          padding-top: 100px;
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .content-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          padding: 3rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #0a894e;
          text-align: center;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 2rem 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .conditions-box {
          background: #f9fafb;
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid #d1fae5;
        }

        .conditions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .condition-item {
          color: #374151;
          padding: 0.8rem 0;
          font-size: 1.05rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: flex-start;
          line-height: 1.7;
        }

        .condition-item:last-child {
          border-bottom: none;
        }

        .condition-item::before {
          content: "•";
          color: #19fd91;
          font-size: 1.5rem;
          margin-right: 1rem;
          font-weight: bold;
        }

        .button-group {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }

        .start-button {
          background: #19fd91;
          color: black;
          border: none;
          padding: 1.2rem 3rem;
          font-size: 1.2rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(25, 253, 145, 0.25);
        }

        .exit-button {
          background: white;
          border: 1px solid #d1d5db;
          padding: 1.2rem 3rem;
          font-size: 1.2rem;
          color: #374151;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .exit-button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(25,253,145,0.4),
            transparent
          );
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .listening-container {
            padding: 1rem;
            padding-top: 80px;
          }

          .content-wrapper {
            padding: 2rem;
          }

          .main-title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .button-group {
            flex-direction: column;
          }

          .start-button,
          .exit-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .content-wrapper {
            padding: 1.5rem;
          }

          .main-title {
            font-size: 1.7rem;
          }

          .condition-item {
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className="listening-container">
        <div className="content-wrapper">

          <h1 className="main-title">
            TOEFL Listening Test
          </h1>

          <p className="subtitle">
            This section measures your ability to understand spoken English in academic environments.
          </p>

          <h2 className="section-title">
            <FaHeadphones size={20} /> Test Instructions
          </h2>

          <div className="conditions-box">
          <ul className="conditions-list">

  <li className="condition-item">
    The test contains 25 listening questions.
  </li>

  <li className="condition-item">
    The Listening Test is divided into three parts:
    <br />
    Part A – Short Conversations
    <br />
    Part B – Longer Conversations
    <br />
    Part C – Lectures and Talks
  </li>

  <li className="condition-item">
    Click the "Play Audio" button to hear each conversation or lecture.
  </li>

  <li className="condition-item">
    Each audio recording will play only once, so listen carefully.
  </li>

  <li className="condition-item">
    After listening, select the best answer from the four options provided.
  </li>

  <li className="condition-item">
    You must answer each question before moving to the next one.
  </li>

  <li className="condition-item">
    You cannot return to previous questions.
  </li>

  <li className="condition-item">
    You have 35 minutes to complete the test.
  </li>

</ul>
          </div>

          <div className="button-group">
            <button className="start-button" onClick={handleStartTest}>
              <FaPlay size={16} /> Start Test
            </button>

            <button
              className="exit-button"
              onClick={() => navigate("/")}
            >
              Exit Module
            </button>
          </div>

          <div className="divider-line"></div>

        </div>
      </div>
    </>
  );
}

export default ToeflListeningIntro;