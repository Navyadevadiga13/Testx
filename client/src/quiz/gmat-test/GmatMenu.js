import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiPlay, FiTarget, FiLayers } from "react-icons/fi";
import GMAT_CONFIG from "./GmatConfig";

const MODES = [
  {
    key: "quantitative",
    title: "Quantitative Practice",
    desc: "Practice a single GMAT section at your own pace. This mode helps you strengthen specific areas such as Quantitative. You'll receive a section-specific raw score and an estimated score for that section only.",
    route: "/quiz/gmat/practice/quantitative",
    meta: "21 Questions · 45 Minutes"
  },
  {
    key: "verbal",
    title: "Verbal Practice",
    desc: "Practice a single GMAT section at your own pace. This mode helps you strengthen specific areas such as Verbal. You'll receive a section-specific raw score and an estimated score for that section only.",
    route: "/quiz/gmat/practice/verbal",
    meta: "23 Questions · 45 Minutes"
  },
  {
    key: "dataInsights",
    title: "Data Insights Practice",
    desc: "Practice a single GMAT section at your own pace. This mode helps you strengthen specific areas such as Data Insights. You'll receive a section-specific raw score and an estimated score for that section only.",
    route: "/quiz/gmat/practice/dataInsights",
    meta: "20 Questions · 45 Minutes"
  },
  {
    key: "full",
    title: "Full Practice Test",
    desc: "Experience a complete GMAT-style practice test with all sections combined. This mode is designed to simulate a realistic exam experience using adaptive question selection. At the end of the test, you'll receive your overall raw score (X/64) and an Estimated GMAT Score (205–805), along with section-wise performance.",
    route: "/quiz/gmat/full",
    meta: "64 Questions · 2h 15m",
    highlight: true
  }
];

export default function GmatMenu() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style jsx>{`
        .gmat-container {
          min-height: 100vh;
          background: #ffffff;
          padding: 2rem;
          padding-top: 100px;
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .content-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          color: #166534;
          text-align: center;
        }

        .subtitle {
          font-size: 1.05rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 1rem;
        }

        .disclaimer {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 0.85rem;
          border-radius: 10px;
          padding: 0.8rem 1.2rem;
          max-width: 700px;
          margin: 0 auto 2.5rem auto;
          text-align: center;
        }

        .modes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          margin-bottom: 1.2rem;
        }

        .mode-card {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 16px;
          padding: 1.6rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .mode-card.full-card {
          grid-column: 1 / -1;
          border-color: #16a34a;
          background: #f0fdf4;
        }

        .mode-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #166534;
          margin-bottom: 0.4rem;
        }

        .mode-meta {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .mode-desc {
          font-size: 0.9rem;
          color: #374151;
          line-height: 1.5;
          flex: 1;
          margin-bottom: 1.2rem;
        }

        .mode-btn {
          background: #19fd91;
          color: #000;
          border: none;
          padding: 0.8rem 1.2rem;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .mode-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .modes-grid { grid-template-columns: 1fr; }
          .mode-card.full-card { grid-column: auto; }
        }

        @media (max-width: 480px) {
          .gmat-container { padding: 1rem; padding-top: 80px; }
          .main-title { font-size: 1.9rem; }
          .mode-card { padding: 1.2rem; }
          .mode-title { font-size: 1.05rem; }
        }
      `}</style>

      <div className="gmat-container">
        <div className="content-wrapper">
          <h1 className="main-title">{GMAT_CONFIG.title}</h1>
          <p className="subtitle">Choose a practice mode to begin.</p>
          <div className="disclaimer">
            Scores shown are an <strong>Estimated GMAT Score</strong>, not an official score.
            This practice test is not affiliated with or endorsed by GMAC.
          </div>

          <div className="modes-grid">
            {MODES.map((m) => (
              <div key={m.key} className={`mode-card ${m.highlight ? "full-card" : ""}`}>
                <div className="mode-title">
                  {m.highlight ? <FiLayers style={{ marginRight: 6, verticalAlign: "middle" }} /> : <FiTarget style={{ marginRight: 6, verticalAlign: "middle" }} />}
                  {m.title}
                </div>
                <div className="mode-meta"><FiClock /> {m.meta}</div>
                <div className="mode-desc">{m.desc}</div>
                <button className="mode-btn" onClick={() => navigate(m.route)}>
                  <FiPlay /> Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}