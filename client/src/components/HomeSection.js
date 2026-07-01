// import React, { useEffect, useRef, useState } from "react";
// import styles from "./HomeSection.module.css";
// import { useNavigate } from "react-router-dom";
// function HomeSection({ onStartAssessment, onLearnMore }) {
//   const navigate = useNavigate();
//   const handleStartAssessment = () => {
//   navigate("/", { state: { scrollTarget: "tests" } });
// };
//   const titleRef = useRef(null);
//   const subtitleRef = useRef(null);
//   const buttonsRef = useRef(null);

//   /* ================= POPUP LOGIC ================= */

//   // Show popup only once per browser session
//   const [showPopup, setShowPopup] = useState(() => {
//     const hasShown = sessionStorage.getItem("hasShownHomePopup");
//     return hasShown ? false : true;
//   });

//   const handleClosePopup = () => {
//     sessionStorage.setItem("hasShownHomePopup", "true");
//     setShowPopup(false);
//   };

//   /* ================= ANIMATION ================= */

//   useEffect(() => {
//     setTimeout(() => {
//       if (titleRef.current) titleRef.current.classList.add(styles.visible);
//     }, 200);

//     setTimeout(() => {
//       if (subtitleRef.current) subtitleRef.current.classList.add(styles.visible);
//     }, 500);

//     setTimeout(() => {
//       if (buttonsRef.current) buttonsRef.current.classList.add(styles.visible);
//     }, 800);
//   }, []);

//   return (
//     <>
//       {/* ================= POPUP ================= */}
//       {showPopup && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>
//               🎓
//             </div>

//             <h2 style={{ marginBottom: "1rem", color: "#19fd91" }}>
//               Student Notice
//             </h2>

//             <p
//               style={{
//                 marginBottom: "1.5rem",
//                 textAlign: "center",
//                 lineHeight: "1.6",
//               }}
//             >
//               This platform is entirely non-commercial and has been created
//               exclusively to support students in their learning and career
//               exploration journey.
//             </p>

//             <button onClick={handleClosePopup} style={buttonStyle}>
//               Continue
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ================= HERO SECTION ================= */}
//       <section className={styles.heroSection}>
//         <div className={styles.cyberGrid}></div>
//         <div className={styles.ambientGlow}></div>

//         {/* Neuron Visualization */}
//         <div className={styles.neuronContainer}>
//           <div className={styles.neuronMain}>
//             <div className={styles.cellBody}>
//               <div className={styles.cellCore}></div>
//               <div className={styles.cellRing}></div>
//               <div
//                 className={styles.cellRing}
//                 style={{ animationDelay: "0.5s" }}
//               ></div>
//             </div>

//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={`dendrite-${i}`}
//                 className={styles.dendriteLine}
//                 style={{
//                   transform: `rotate(${i * 45}deg)`,
//                   animationDelay: `${i * 0.1}s`,
//                 }}
//               >
//                 <div className={styles.dendriteTip}></div>
//               </div>
//             ))}

//             <div className={styles.axonLine}>
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className={styles.myelinSegment}></div>
//               ))}
//             </div>

//             <div className={styles.synapseTerminal}></div>

//             {[...Array(20)].map((_, i) => (
//               <div
//                 key={`neuro-${i}`}
//                 className={styles.neuroDot}
//                 style={{
//                   top: `${20 + i * 4}%`,
//                   left: `${60 + i * 2}%`,
//                   animationDelay: `${i * 0.2}s`,
//                 }}
//               ></div>
//             ))}

//             <div className={styles.neuralImpulse}></div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className={styles.heroContent}>
//           <h1 ref={titleRef} className={styles.heroTitle}>
//             <span className={styles.titleLine}>
//  YOUR</span>
//             <span className={styles.titleHighlight}> MIND </span>
//             <span className={styles.titleLine}>AND</span>
//             <span className={styles.titleHighlight}> PERSONALITY</span>
//           </h1>

//           <p ref={subtitleRef} className={styles.heroSubtitle}>
//             Take a FREE personality assessment test and get a personalized,
//             research-backed profile of your strengths, values, and career fit.
//             <br />
//             <span className={styles.highlightLine}>
//               Unlock your potential now!
//             </span>
//           </p>

//           <div ref={buttonsRef} className={styles.heroActions}>
//         <button className={styles.heroCta} onClick={handleStartAssessment}>
//               <span className={styles.btnText}>Start Your Assessment</span>
//               <span className={styles.arrowIcon}>→</span>
//             </button>

//             <button
//               className={styles.heroSecondary}
//               onClick={onLearnMore}
//             >
//               <span>Learn More</span>
//               <span className={styles.playIcon}>▶</span>
//             </button>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default HomeSection;

// /* ================= POPUP STYLES ================= */

// const overlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   background: "rgba(0, 0, 0, 0.85)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 9999,
// };

// const modalStyle = {
//   background: "#0f172a",
//   padding: "2rem",
//   borderRadius: "16px",
//   maxWidth: "420px",
//   width: "90%",
//   textAlign: "center",
//   color: "white",
//   boxShadow: "0 15px 50px rgba(0,0,0,0.6)",
// };

// const buttonStyle = {
//   background: "#19fd91",
//   border: "none",
//   padding: "0.8rem 1.8rem",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontWeight: "600",
//   fontSize: "1rem",
// };
// src/components/HomeSection.js

import React, { useEffect, useRef, useState } from "react";
import homeImage from "../../src/assets/Home.png";
import styles from "./HomeSection.module.css";

function HomeSection({ onStartAssessment, onLearnMore }) {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenHomePopup");

    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("hasSeenHomePopup", "true");
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      titleRef.current?.classList.add(styles.visible);
    }, 200);

    setTimeout(() => {
      subtitleRef.current?.classList.add(styles.visible);
    }, 500);

    setTimeout(() => {
      buttonsRef.current?.classList.add(styles.visible);
    }, 800);
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* ================= PREMIUM POPUP ================= */}
      {showPopup && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            {/* glow */}
            <div style={topGlow}></div>

            <div style={iconWrapper}>
              <div style={iconCircle}>🎓</div>
            </div>

            <span style={tagStyle}>
              Student Platform
            </span>

            <h2 style={headingStyle}>
              Welcome to Your
              <br />
              Exam Preparation Hub
            </h2>

            <p style={descStyle}>
              This platform is completely
              non-commercial and built to help
              students prepare for
              <strong>
                {" "}IELTS, TOEFL, and GRE{" "}
              </strong>
              with realistic mock test
              experiences and guided learning.
            </p>

            <div style={dividerStyle}></div>

            <button
              onClick={handleClosePopup}
              style={buttonStyle}
            >
              Continue Learning →
            </button>
          </div>
        </div>
      )}

      {/* ================= HERO ================= */}
     {/* ================= HERO ================= */}
<section className={styles.heroSection}>
  <div className={styles.cyberGrid}></div>

  <div className={styles.ambientGlow}></div>

  <div className={styles.heroWrapper}>
    
    {/* LEFT CONTENT */}
    <div className={styles.heroContent}>
      <h1
        ref={titleRef}
        className={styles.heroTitle}
      >
        <span className={styles.titleLine}>
          MASTER YOUR
        </span>

        <span className={styles.titleHighlight}>
          IELTS
        </span>

        <span className={styles.titleLine}>
          TOEFL &
        </span>

        <span className={styles.titleHighlight}>
          GRE MOCK TESTS
        </span>
      </h1>

      <p
        ref={subtitleRef}
        className={styles.heroSubtitle}
      >
        Take realistic IELTS, TOEFL,
        and GRE mock tests designed
        to simulate the actual exam
        experience and boost your
        confidence.
      </p>

      <div
        ref={buttonsRef}
        className={styles.heroActions}
      >
        <button
          className={styles.heroCta}
          onClick={onStartAssessment}
        >
          <span className={styles.btnText}>
            Start Your Assessment
          </span>

          <span className={styles.arrowIcon}>
            →
          </span>
        </button>

        <button
          className={styles.heroSecondary}
          onClick={onLearnMore}
        >
          <span>Learn More</span>

          <span className={styles.playIcon}>
            ▶
          </span>
        </button>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className={styles.heroImageContainer}>
      <img
        src={homeImage}
        alt="TestX"
        className={styles.heroImage}
      />

    
    </div>
  </div>
</section>
    </>
  );
}

export default HomeSection;

/* ================= PREMIUM POPUP STYLES ================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(3, 7, 18, 0.72)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  padding: "1rem",
};

const modalStyle = {
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(145deg, #0f172a, #111827)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "2.7rem 2.3rem",
  borderRadius: "28px",
  maxWidth: "480px",
  width: "100%",
  textAlign: "center",
  color: "#ffffff",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.45)",
};

const topGlow = {
  position: "absolute",
  top: "-120px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "260px",
  height: "260px",
  background:
    "radial-gradient(circle, rgba(25,253,145,0.28), transparent 70%)",
};

const iconWrapper = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "1rem",
};

const iconCircle = {
  width: "74px",
  height: "74px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg, #19fd91, #0ea5e9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  boxShadow:
    "0 10px 35px rgba(25,253,145,0.35)",
};

const tagStyle = {
  display: "inline-block",
  padding: "0.4rem 0.9rem",
  borderRadius: "999px",
  background:
    "rgba(255,255,255,0.08)",
  border:
    "1px solid rgba(255,255,255,0.08)",
  color: "#19fd91",
  fontSize: "0.82rem",
  fontWeight: "600",
  marginBottom: "1.2rem",
  letterSpacing: "0.5px",
};

const headingStyle = {
  fontSize: "2rem",
  lineHeight: "1.25",
  fontWeight: "800",
  marginBottom: "1rem",
};

const descStyle = {
  fontSize: "1rem",
  lineHeight: "1.8",
  color: "rgba(255,255,255,0.75)",
  marginBottom: "1.7rem",
};

const dividerStyle = {
  width: "100%",
  height: "1px",
  background:
    "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
  marginBottom: "1.8rem",
};

const buttonStyle = {
  width: "100%",
  background:
    "linear-gradient(135deg, #19fd91, #00c2ff)",
  border: "none",
  padding: "1rem 1.4rem",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "1rem",
  color: "#04111d",
  transition: "all 0.3s ease",
  boxShadow:
    "0 12px 30px rgba(25,253,145,0.25)",
};
