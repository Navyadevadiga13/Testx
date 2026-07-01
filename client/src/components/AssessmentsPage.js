import React, { useRef, useEffect } from "react";
import {
  FaBrain, FaHandshake, FaBriefcase, FaLanguage, FaArrowRight,
  FaChartPie, FaPuzzlePiece, FaListOl, FaShapes,
  FaHeadphones, FaBookOpen, FaPenFancy, FaHandsHelping,
  FaMicrophone, FaHeadSideVirus, FaHeart,
  FaUniversity, FaUserFriends, FaPalette,FaUserCog
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TestsSection({ isLoggedIn }) {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

const handleStart = (route) => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate(route);
  } else {
    navigate("/login");
  }
};

  const ASSESSMENTS = [


    {
      id: "ielts",
      title: "IELTS Mock",
      subtitle: "Master the English language",
      icon: <FaLanguage />,
      color:  "#3b82f6",
      gradient: "linear-gradient(135deg, #19fd91, rgba(25, 253, 145, 0.8))",
      bgColor: "rgba(25, 253, 145, 0.05)",
      buttons: [
        { label: "Listening", icon: <FaHeadphones />, action: () => handleStart("/quiz/listening/intro") },
        { label: "Reading", icon: <FaBookOpen />, action: () => handleStart("/quiz/reading/intro") },
        { label: "Writing", icon: <FaPenFancy />, action: () => handleStart("/quiz/writing/intro") },
        { label: "Speaking", icon: <FaMicrophone />, action: () => handleStart("/quiz/speaking/intro") }
      ]
    },
    {
      id: "toefl",
      title: "TOEFL Mock",
      subtitle: "iBT Practice Test",
      icon: <FaUniversity />,
      color: "#19fd91",
      gradient: "linear-gradient(135deg, #19fd91, rgba(25, 253, 145, 0.8))",
      bgColor: "rgba(25, 253, 145, 0.05)",
      buttons: [
        { label: "Listening", icon: <FaHeadphones />, action: () => handleStart("/quiz/toefl/listening") },
        { label: "Reading", icon: <FaBookOpen />, action: () => handleStart("/quiz/toefl/reading/instruction") },
        { label: "Writing", icon: <FaPenFancy />, action: () => handleStart("/quiz/toefl/writing/instruction") },
        { label: "Speaking", icon: <FaMicrophone />, action: () => handleStart("/quiz/toefl/speaking") }
      ]
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("card-visible");
      });
    }, { threshold: 0.1 });

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
     <style>{`

  body { margin: 0; }

  .tests-container {
    padding: 80px 100px;
    min-height: 100vh;
    background: #0a140f;
    box-sizing: border-box;
  }

  .tests-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .tests-main-title {
    font-size: 2.6rem;
    font-weight: 800;
    color: #19fd91;
    margin-bottom: 10px;
  }

  .tests-subtitle {
    color: #b4bebd;
    font-size: 1rem;
  }

  .assessments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
  }

  .assessment-interactive-card {
    background: #111c17;
    border-radius: 20px;
    padding: 32px;
    border: 1px solid #233127;
    transition: all 0.3s ease;
    position: relative;
  }

  .assessment-interactive-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(25,253,145,0.18);
  }

  .card-header-interactive {
    text-align: center;
    margin-bottom: 22px;
  }

  .icon-wrapper-large {
    font-size: 2.2rem;
    margin-bottom: 12px;
    color: #19fd91;
  }

  .card-header-interactive h2 {
    margin: 5px 0;
    font-size: 1.4rem;
  }

  .card-header-interactive p {
    color: #b4bebd;
    font-size: 0.95rem;
  }

  .interactive-buttons-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 18px;
  }

  .interactive-btn {
    background: #1a2a20;
    border: 1px solid #233127;
    padding: 12px 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    cursor: pointer;
    transition: 0.2s ease;
    font-size: 14px;
    width: 100%;
  }

  .interactive-btn span {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
  }

  .interactive-btn:hover {
    background: #19fd91;
    color: black;
  }

  /* ================= TABLET ================= */

  @media (max-width: 1024px) {

    .tests-container {
      padding: 60px 50px;
    }

    .tests-main-title {
      font-size: 2.2rem;
    }

    .assessments-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
  }

  /* ================= MOBILE ================= */

  @media (max-width: 768px) {

   .tests-container {
  padding: 140px 100px 80px 100px;}

    .tests-main-title {
      font-size: 1.9rem;
    }

    .tests-subtitle {
      font-size: 0.9rem;
    }

    .assessments-grid {
      grid-template-columns: 1fr;
      gap: 25px;
    }

    .assessment-interactive-card {
      padding: 22px;
      border-radius: 16px;
    }

    .interactive-btn {
      font-size: 13px;
      padding: 10px 14px;
    }
  }

  /* ================= SMALL MOBILE ================= */

  @media (max-width: 480px) {

    .tests-main-title {
      font-size: 1.6rem;
    }

    .card-header-interactive h2 {
      font-size: 1.2rem;
    }

    .card-header-interactive p {
      font-size: 0.85rem;
    }

    .interactive-btn {
      font-size: 12px;
      padding: 9px 12px;
    }
  }

`}</style>

      <div className="tests-container">
        <div className="tests-header">
          <h1 className="tests-main-title">Choose Your Assessment</h1>
          <p className="tests-subtitle">Select a specific module to begin your analysis.</p>
        </div>

        <div className="assessments-grid">
          {ASSESSMENTS.map((assessment, index) => (
            <div
              key={assessment.id}
              ref={el => cardsRef.current[index] = el}
              className="assessment-interactive-card"
            >
              <div className="card-header-interactive">
                <div className="icon-wrapper-large">{assessment.icon}</div>
                <h2>{assessment.title}</h2>
                <p>{assessment.subtitle}</p>
              </div>

              <div className="interactive-buttons-grid">
                {assessment.buttons.map((btn, idx) => (
                  <button key={idx} className="interactive-btn" onClick={btn.action}>
                    <span>{btn.icon} {btn.label}</span>
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