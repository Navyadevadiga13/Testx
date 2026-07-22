import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiFileText, FiPlay } from "react-icons/fi";
import MAT_CONFIG from "./MatConfig";

export default function MatMenu() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartTest = () => {
    navigate("/quiz/mat/test");
  };

  return (
    <>
      <style jsx>{`
        .mat-container {
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
          margin-bottom: 2rem;
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

        @media (max-width: 480px) {
          .mat-container { padding: 1rem; padding-top: 80px; }
          .content-wrapper { padding: 1.5rem; }
          .main-title { font-size: 1.8rem; }
          .subtitle { font-size: 0.95rem; }
          .summary-grid { grid-template-columns: 1fr; }
          .section-row { flex-direction: column; align-items: flex-start; gap: 0.2rem; }
          .button-group { flex-direction: column; }
          .start-button, .exit-button { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="mat-container">
        <div className="content-wrapper">
          <h1 className="main-title">{MAT_CONFIG.title}</h1>
          <p className="subtitle">
            One continuous paper, one overall timer — move freely between all five sections.
          </p>

          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-number">{MAT_CONFIG.totalQuestions}</div>
              <div className="summary-label">Questions</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">{MAT_CONFIG.totalMarks}</div>
              <div className="summary-label">Marks</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">{MAT_CONFIG.durationMinutes}</div>
              <div className="summary-label">Minutes</div>
            </div>
          </div>

          <h2 className="section-title">
            <FiFileText style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Section Breakdown
          </h2>

          <div className="sections-box">
            {MAT_CONFIG.sections.map((s) => (
              <div className="section-row" key={s.key}>
                <span>{s.label}</span>
                <span className="count">{s.count} Qs</span>
              </div>
            ))}
          </div>

          <h2 className="section-title">
            <FiClock style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Exam Rules
          </h2>

          <div className="conditions-box">
            <div className="condition-item">+1 mark for every correct answer.</div>
            <div className="condition-item">−0.25 marks deducted for every incorrect answer.</div>
            <div className="condition-item">No marks deducted for unattempted questions.</div>
            <div className="condition-item">
              A single {MAT_CONFIG.durationMinutes}-minute timer runs for the entire paper —
              there is no separate timer per section.
            </div>
            <div className="condition-item">
              You may move between sections freely at any time using "Previous Section" /
              "Next Section" — nothing is locked once you leave it.
            </div>
            <div className="condition-item">
              Your result includes both your raw score (out of {MAT_CONFIG.totalMarks}) and an
              estimated composite score ({MAT_CONFIG.compositeScale.min}–{MAT_CONFIG.compositeScale.max}).
            </div>
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