import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiFileText, FiPlay, FiAlertTriangle } from "react-icons/fi";
import CAT_CONFIG from "./CatConfig";

export default function CatMenu() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartTest = () => {
    navigate("/quiz/cat/test");
  };

  return (
    <>
      <style jsx>{`
        .cat-container {
          min-height: 100vh;
          background: #ffffff;
          padding: 2rem;
          padding-top: 100px;
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .content-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          padding: 3rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          color: #166534;
          text-align: center;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #166534;
          margin: 2rem 0 1rem 0;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 1.2rem;
          text-align: center;
        }

        .summary-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: #16a34a;
        }

        .summary-label {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .sections-box {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem 2rem;
          border: 1px solid #d1d5db;
          margin-bottom: 2rem;
        }

        .section-row {
          display: flex;
          justify-content: space-between;
          padding: 0.7rem 0;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
          font-size: 1rem;
        }

        .section-row:last-child {
          border-bottom: none;
        }

        .section-row .count {
          font-weight: 700;
          color: #166534;
        }

        .conditions-box {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem 2rem;
          border: 1px solid #d1d5db;
          margin-bottom: 1.5rem;
        }

        .condition-item {
          color: #374151;
          padding: 0.6rem 0;
          font-size: 0.98rem;
          display: flex;
          align-items: center;
        }

        .condition-item::before {
          content: "•";
          color: #16a34a;
          font-size: 1.4rem;
          margin-right: 0.8rem;
          font-weight: bold;
        }

        .warning-box {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 0.9rem;
          border-radius: 10px;
          padding: 1rem 1.2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .button-group {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }

        .start-button {
          background: #19fd91;
          color: #000;
          border: none;
          padding: 1.1rem 2.8rem;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
        }

        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(25, 253, 145, 0.3);
        }

        .exit-button {
          background: #ffffff;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 1.1rem 2.8rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
        }

        .exit-button:hover {
          background: #f3f4f6;
        }

        @media (max-width: 700px) {
          .summary-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="cat-container">
        <div className="content-wrapper">
          <h1 className="main-title">{CAT_CONFIG.title}</h1>
          <p className="subtitle">
            A fixed-paper, sectional-timed mock test built to mirror the real CAT interface.
          </p>

          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-number">{CAT_CONFIG.totalQuestions}</div>
              <div className="summary-label">Questions</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">{CAT_CONFIG.sections.length}</div>
              <div className="summary-label">Sections</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">{CAT_CONFIG.totalMinutes}</div>
              <div className="summary-label">Minutes</div>
            </div>
          </div>

          <h2 className="section-title">
            <FiFileText style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Section Breakdown
          </h2>

          <div className="sections-box">
            {CAT_CONFIG.sections.map((s) => (
              <div className="section-row" key={s.key}>
                <span>{s.label}</span>
                <span className="count">{s.count} Qs · {s.timeLimitMinutes} min</span>
              </div>
            ))}
          </div>

          <h2 className="section-title">
            <FiClock style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Exam Rules
          </h2>

          <div className="conditions-box">
            <div className="condition-item">+3 marks for every correct answer.</div>
            <div className="condition-item">−1 mark for every wrong MCQ answer.</div>
            <div className="condition-item">
              TITA (Type In The Answer) questions carry no negative marking — a wrong or blank TITA scores 0.
            </div>
            <div className="condition-item">
              Sections run in fixed order: {CAT_CONFIG.sections.map((s) => s.label.split(" ")[0]).join(" → ")}.
              You cannot choose or reorder them.
            </div>
            <div className="condition-item">
              Each section has its own independent timer. You may freely move between questions,
              edit answers, and use "Mark for Review" within a section, any number of times.
            </div>
          </div>

          <div className="warning-box">
            <FiAlertTriangle style={{ marginTop: "2px", flexShrink: 0 }} />
            <span>
              There is no manual "Finish Section" button. A section ends only
              when its timer reaches zero, and you can never return to a section once it has ended.
            </span>
          </div>

          <div className="button-group">
            <button className="start-button" onClick={handleStartTest}>
              <FiPlay />
              <span>Start Test</span>
            </button>
            <button className="exit-button" onClick={() => navigate("/")}>
              Exit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}