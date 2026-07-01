import React, { useEffect, useRef } from "react";
import {
  FaFlask,
  FaUserCheck,
  FaLock,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

function AboutSection({ onStartAssessment }) {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
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
    <section className="about-section">
      {/* Animated Background Elements */}
      <div className="about-bg-gradient"></div>
      <div className="about-floating-orb orb-1"></div>
      <div className="about-floating-orb orb-2"></div>

      <div className="about-container">
        {/* Section Header */}
        <div className="about-header">
          <h2 className="about-title">
            <span className="title-line">Why Choose</span>
            <span className="title-accent"> TestX?</span>
          </h2>

          <p className="about-subtitle">
            Practice smarter with free online mock tests anytime,
            anywhere. TestX helps students improve performance with
            realistic exams, instant results, and detailed analysis —
            all from the comfort of home.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="about-cards-grid">
          {/* Card 1 */}
          <div
            ref={(el) => (cardsRef.current[0] = el)}
            className="about-card"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="card-icon-wrapper">
              <FaFlask className="card-icon" />
              <div className="icon-glow"></div>
            </div>

            <div className="card-badge">FREE MOCK TESTS</div>

            <h3 className="card-title">Real Exam Experience</h3>

            <p className="card-desc">
              Take realistic mock tests designed to match actual exam
              patterns and difficulty levels, helping you gain confidence
              before the real test.
            </p>

            <div className="card-features">
              <span className="feature-tag">Realistic Questions</span>
              <span className="feature-tag">Timed Tests</span>
              <span className="feature-tag">Instant Results</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            ref={(el) => (cardsRef.current[1] = el)}
            className="about-card"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="card-icon-wrapper">
              <FaUserCheck className="card-icon" />
              <div className="icon-glow"></div>
            </div>

            <div className="card-badge">SMART ANALYTICS</div>

            <h3 className="card-title">Track Your Performance</h3>

            <p className="card-desc">
              Get detailed performance insights, score analysis, and
              improvement suggestions after every mock test to identify
              your strengths and weak areas.
            </p>

            <div className="card-features">
              <span className="feature-tag">Score Analysis</span>
              <span className="feature-tag">Progress Tracking</span>
              <span className="feature-tag">Performance Reports</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            ref={(el) => (cardsRef.current[2] = el)}
            className="about-card"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="card-icon-wrapper">
              <FaLock className="card-icon" />
              <div className="icon-glow"></div>
            </div>

            <div className="card-badge">ANYTIME ACCESS</div>

            <h3 className="card-title">Learn at Your Comfort</h3>

            <p className="card-desc">
              Practice mock tests whenever you want, from anywhere,
              using your mobile, tablet, or desktop without the pressure
              of a classroom environment.
            </p>

            <div className="card-features">
              <span className="feature-tag">24/7 Access</span>
              <span className="feature-tag">Mobile Friendly</span>
              <span className="feature-tag">Study Anywhere</span>
            </div>
          </div>

          {/* Card 4 */}
          <div
            ref={(el) => (cardsRef.current[3] = el)}
            className="about-card"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="card-icon-wrapper">
              <FaChartLine className="card-icon" />
              <div className="icon-glow"></div>
            </div>

            <div className="card-badge">IMPROVE FASTER</div>

            <h3 className="card-title">Boost Your Confidence</h3>

            <p className="card-desc">
              Consistent practice with TestX helps students improve speed,
              accuracy, and confidence before appearing for important exams.
            </p>

            <div className="card-features">
              <span className="feature-tag">Practice Daily</span>
              <span className="feature-tag">Improve Accuracy</span>
              <span className="feature-tag">Build Confidence</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="about-cta">
          <div className="cta-content">
            <FaShieldAlt className="cta-icon" />

            <h3 className="cta-title">
              Start Your Free Mock Test Today
            </h3>

            <p className="cta-text">
              Join TestX and practice free mock tests anytime at your
              comfort place. Improve your skills, track progress, and
              prepare confidently for your exams.
            </p>

            <button
              className="cta-button"
              onClick={onStartAssessment}
            >
              <span>Start Free Test</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;