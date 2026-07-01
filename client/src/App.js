// // src/App.js
// import React, { useRef, useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
//   useLocation,
//   Navigate,
// } from "react-router-dom";

// // --- IMPORTS ---
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import HomeSection from "./components/HomeSection";
// import AboutSection from "./components/AboutSection";
// import TestsSection from "./components/TestsSection";
// import LoginPage from "./components/LoginPage";
// import SignupPage from "./components/SignupPage";
// import ProfilePage from "./components/ProfilePage";
// import CategoryListPage from "./components/CategoryListPage";
// import AssessmentsPage from "./components/AssessmentsPage";
// import QuizPage from "./components/QuizPage";
// import BigFivePage from "./quiz/BigFivePage";
// import LeftRightBrainPage from "./quiz/LeftRightBrain";
// import MbtiPage from "./quiz/MbtiPage";
// import SixteenPFPage from "./quiz/SixteenPFPage";
// import CareerOrientationsPage from "./quiz/CareerOrientationsPage";
// import RiasecPage from "./quiz/Riasec";
// import DrPhils from "./quiz/DrPhils";
// import Perception from "./quiz/Perception";
// import DiagramAnalysis from "./quiz/DiagramAnalysis";
// import IqTestPage from "./quiz/IqTestPage";
// import IqQuizPage from "./quiz/IqQuizPage";
// import IqResultPage from "./quiz/IqResultPage";
// import EqTestPage from "./quiz/EqTestPage";
// import EqQuizPage from "./quiz/EqQuizPage";
// import EqResultPage from "./quiz/EqResultPage";
// import VerifyEmailPage from "./components/VerifyEmailPage";
// import IeltsListening from "./quiz/IeltsListening";
// import IeltsReading from "./quiz/IeltsReading";
// import IeltsWriting from "./quiz/IeltsWriting";
// import IeltsSpeaking from "./quiz/IeltsSpeaking";
// import IeltsMenu from "./quiz/IeltsMenu";
// import ListeningTestReady from "./quiz/Ieltscardlistening";
// import ReadingTestReady from "./quiz/IeltscardReading";
// import SpeakingTestReady from "./quiz/IeltscardSpeaking";
// import WritingTestReady from "./quiz/IeltscardWriting";
// import ToeflListening from "./quiz/ToeflListening";
// import ToeflReading from "./quiz/ToeflReading";
// import ToeflWriting from "./quiz/ToeflWriting";
// import ToeflSpeaking from "./quiz/ToeflSpeaking";
// import ToeflListeningIntro from "./quiz/ToeflListeningIntro";  // adjust naming
// import ToeflReadingIntro from "./quiz/ToeflcardReading";
// import ToeflWritingIntro from "./quiz/ToeflcardWriting";

// import ToeflReadingInstructions from "./quiz/ToeflReadingInstructions";
// import ToeflWritingInstructions from "./quiz/ToeflWritingInstructions";
// import ToeflResultPage from "./quiz/ToeflResultPage";
// import Geometry from "./quiz/Geometry";
// import SqTest from "./quiz/SqTest";
// import PqTest from "./quiz/PqTest";
// import AdminLogin from "./components/AdminLogin";
// import Gre_verbal from "./quiz/Gre_verbal";
// import Gre_quantitative from "./quiz/Gre_quantitative";
// import Gre_analytical from "./quiz/Gre_analytical";
// import "./App.css";

// const HEADER_OFFSET = 70;

// const ProtectedRoute = ({ isLoggedIn, children }) => {
//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// function MainContent() {
//   const [theme, setTheme] = useState("dark");

//   // ✅ FIX 1: Check for 'token' directly. This fixes the header on refresh.
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     () => !!localStorage.getItem("token")
//   );

//   useEffect(() => {
//     document.body.className = theme === "dark" ? "dark" : "";
//   }, [theme]);

//   const homeRef = useRef(null);
//   const aboutRef = useRef(null);
//   const testsRef = useRef(null);
//   const contactRef = useRef(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const scrollToSection = (section) => {
//     let ref = null;
//     switch (section) {
//       case "home":
//         ref = homeRef;
//         break;
//       case "about":
//         ref = aboutRef;
//         break;
//       case "tests":
//         ref = testsRef;
//         break;
//       case "contact":
//         ref = contactRef;
//         break;
//       default:
//         break;
//     }

//     if (ref && ref.current) {
//       const el = ref.current;
//       const rect = el.getBoundingClientRect();
//       const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//       const top = rect.top + scrollTop - HEADER_OFFSET;

//       window.scrollTo({
//         top,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     if (
//       location.pathname === "/" &&
//       location.state &&
//       location.state.scrollTarget
//     ) {
//       scrollToSection(location.state.scrollTarget);
//     }
//   }, [location]);

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//     // We don't strictly need 'loggedIn' item anymore if we check token, 
//     // but keeping it for consistency doesn't hurt.
//     localStorage.setItem("loggedIn", "yes");
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem("loggedIn");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const handleExplore = (categoryId) => {
//     navigate(`/tests/${categoryId}`);
//   };

//   return (
//     <>
//       <Header
//         theme={theme}
//         setTheme={setTheme}
//         isLoggedIn={isLoggedIn}
//         showLogin={() => navigate("/login")}
//         goProfile={() => navigate("/profile")}
//       />
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <>
//               <div ref={homeRef}>
//                 <HomeSection
//                   onStartAssessment={() => navigate("/tests")}
//                   onLearnMore={() => scrollToSection("about")}
//                 />
//               </div>
//               <div ref={aboutRef}>
//                 <AboutSection onStartAssessment={() => navigate("/tests")} />
//               </div>
//               <div
//                 ref={testsRef}
//                 style={{ minHeight: "100vh", padding: "2rem 0" }}
//               >
//                 <TestsSection
//                   isLoggedIn={isLoggedIn}
//                   onExplore={handleExplore}
//                 />
//               </div>
//             </>
//           }
//         />
//         <Route path="/admin" element={<AdminLogin/>}/>
//         <Route path="/login" element={<LoginPage onLogin={handleLogin} onSuccess={handleLogin} />} />
//         <Route path="/signup" element={<SignupPage onSuccess={handleLogin} />} />
//         <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />

//         {/* ✅ FIX 2: Pass 'onLogin' so verification updates the Header */}
//         <Route path="/verify-email" element={<VerifyEmailPage onLogin={handleLogin} />} />

//         {/* SECURED ROUTES */}
//         <Route path="/tests/:categoryId" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <CategoryListPage />
//           </ProtectedRoute>
//         } />

//         {/* Helper page for choosing assessment */}
//         <Route path="/tests" element={<AssessmentsPage />} />

//         <Route path="/quiz/:quizId" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <QuizPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/tests/personality/leftright" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <LeftRightBrainPage />
//           </ProtectedRoute>
//         } />
  
//         <Route path="/tests/personality/bigfive" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <BigFivePage />
//           </ProtectedRoute>
//         } />

//         <Route path="/tests/personality/mbti" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <MbtiPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/tests/personality/16pf" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <SixteenPFPage />
//           </ProtectedRoute>
//         } />
//         <Route path="/tests/personality/drphils" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <DrPhils />
//           </ProtectedRoute>
//         } />
//         <Route path="/tests/personality/perception" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <Perception />
//           </ProtectedRoute>
//         } />
//         <Route path="/tests/personality/diagramanalysis" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <DiagramAnalysis />
//           </ProtectedRoute>
//         } />
//         <Route path="/tests/personality/geometry" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <Geometry />
//           </ProtectedRoute>
//         } />
    
//         <Route path="/tests/personality/sqtest" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <SqTest />
//           </ProtectedRoute>
//         } />
      
//         <Route path="/tests/personality/pqtest" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <PqTest />
//           </ProtectedRoute>
//         } />
        
    
//         <Route path="/tests/career/riasec" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <RiasecPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/tests/career/career-anchor" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <CareerOrientationsPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/tests/career/iqtest" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <IqTestPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/quiz/iq-test" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <IqQuizPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/quiz/iq-result" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <IqResultPage />
//           </ProtectedRoute>
//         } />

//         {/* EQ Test Routes */}
//         <Route path="/tests/personality/eqtest" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <EqTestPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/quiz/eq-test" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <EqQuizPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/quiz/eq-result" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <EqResultPage />
//           </ProtectedRoute>
//         } />


//         {/* IELTS ROUTES */}
//         <Route path="/quiz/listening/intro" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ListeningTestReady />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/reading/intro" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ReadingTestReady />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/speaking/intro" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <SpeakingTestReady />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/writing/intro" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <WritingTestReady />
//           </ProtectedRoute>
//         } />

//         <Route path="/quiz/listening" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <IeltsListening />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/reading" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <IeltsReading />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/writing" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <IeltsWriting />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/speaking" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <IeltsSpeaking />
//           </ProtectedRoute>
//         } />

//         {/* IELTS MENU */}
//         <Route path="/tests/ielts-menu" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <IeltsMenu />
//           </ProtectedRoute>
//         } />

//         <Route path="/quiz/toefl/listening/intro" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflListeningIntro />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/toefl/reading/intro" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflReadingIntro />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/toefl/writing/intro" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflWritingIntro />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/toefl/speaking" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflSpeaking />
//           </ProtectedRoute>
//         } />

//         <Route path="/quiz/toefl/reading/instruction" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflReadingInstructions />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/toefl/writing/instruction" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflWritingInstructions />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/toefl/writing/instruction" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflWritingInstructions />
//           </ProtectedRoute>
//         } />



//         <Route path="/quiz/toefl/listening" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflListening />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/toefl/reading" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflReading />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/toefl/writing" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflWriting />
//           </ProtectedRoute>
//         } />
   
//         <Route path="/quiz/GRE/verbal-reasoning" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <Gre_verbal />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/GRE/quantitative-analysis" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <Gre_quantitative />
//           </ProtectedRoute>
//         } />
//         <Route path="/quiz/GRE/analytical-writing" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <Gre_analytical />
//           </ProtectedRoute>
//         } />

//         {/* TOEFL RESULTS */}
//         <Route path="/quiz/toefl/result" element={
//           <ProtectedRoute isLoggedIn={isLoggedIn}>
//             <ToeflResultPage />
//           </ProtectedRoute>
//         } />
//       </Routes>
//       {!["/login", "/signup"].includes(location.pathname) && <Footer />}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <MainContent />
//     </Router>
//   );
// }

// export default App;
// src/App.js
import React, { useRef, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

// --- COMPONENTS ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import TestsSection from "./components/TestsSection";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProfilePage from "./components/ProfilePage";
import CategoryListPage from "./components/CategoryListPage";
import AssessmentsPage from "./components/AssessmentsPage";
import QuizPage from "./components/QuizPage";
import VerifyEmailPage from "./components/VerifyEmailPage";
import AdminLogin from "./components/AdminLogin";

// --- QUIZ PAGES ---
import BigFivePage from "./quiz/BigFivePage";
import LeftRightBrainPage from "./quiz/LeftRightBrain";
import MbtiPage from "./quiz/MbtiPage";
import SixteenPFPage from "./quiz/SixteenPFPage";
import CareerOrientationsPage from "./quiz/CareerOrientationsPage";
import RiasecPage from "./quiz/Riasec";
import DrPhils from "./quiz/DrPhils";
import Perception from "./quiz/Perception";
import DiagramAnalysis from "./quiz/DiagramAnalysis";
import IqTestPage from "./quiz/IqTestPage";
import IqQuizPage from "./quiz/IqQuizPage";
import IqResultPage from "./quiz/IqResultPage";
import EqTestPage from "./quiz/EqTestPage";
import EqQuizPage from "./quiz/EqQuizPage";
import EqResultPage from "./quiz/EqResultPage";

// --- TOEFL & IELTS (example: adjust if needed) ---
import IeltsListening from "./quiz/IeltsListening";
import IeltsReading from "./quiz/IeltsReading";
import IeltsWriting from "./quiz/IeltsWriting";
import IeltsSpeaking from "./quiz/IeltsSpeaking";
import IeltsMenu from "./quiz/IeltsMenu";
import ListeningTestReady from "./quiz/Ieltscardlistening";
import ReadingTestReady from "./quiz/IeltscardReading";
import SpeakingTestReady from "./quiz/IeltscardSpeaking";
import WritingTestReady from "./quiz/IeltscardWriting";
import ToeflListening from "./quiz/ToeflListening";
import ToeflReading from "./quiz/ToeflReading";
import ToeflWriting from "./quiz/ToeflWriting";
import ToeflSpeaking from "./quiz/ToeflSpeaking";
import ToeflListeningIntro from "./quiz/ToeflListeningIntro";
import ToeflReadingIntro from "./quiz/ToeflcardReading";
import ToeflWritingIntro from "./quiz/ToeflcardWriting";
import ToeflReadingInstructions from "./quiz/ToeflReadingInstructions";
import ToeflWritingInstructions from "./quiz/ToeflWritingInstructions";
import ToeflResultPage from "./quiz/ToeflResultPage";

// --- GRE & Other Tests ---
import Geometry from "./quiz/Geometry";
import SqTest from "./quiz/SqTest";
import PqTest from "./quiz/PqTest";
import Gre_verbal from "./quiz/Gre_verbal";
import Gre_quantitative from "./quiz/Gre_quantitative";
import Gre_analytical from "./quiz/Gre_analytical";

// --- STYLES ---
import "./App.css";

const HEADER_OFFSET = 70;

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

function MainContent() {
  const [theme, setTheme] = useState("dark");
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const testsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (section) => {
    let ref = null;
    switch (section) {
      case "home":
        ref = homeRef;
        break;
      case "about":
        ref = aboutRef;
        break;
      case "tests":
        ref = testsRef;
        break;
      default:
        break;
    }

    if (ref && ref.current) {
      let top = ref.current.offsetTop - HEADER_OFFSET;

      // Scroll to bottom of tests section for assessments
      if (section === "tests") {
        top = ref.current.offsetTop + ref.current.offsetHeight - window.innerHeight;
      }

      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTarget) {
      scrollToSection(location.state.scrollTarget);
    }
  }, [location]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("loggedIn", "yes");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleExplore = (categoryId) => {
    navigate(`/tests/${categoryId}`);
  };

  return (
    <>
      <Header
        theme={theme}
        setTheme={setTheme}
        isLoggedIn={isLoggedIn}
        showLogin={() => navigate("/login")}
        goProfile={() => navigate("/profile")}
      />
      <Routes>
        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <div ref={homeRef}>
                <HomeSection
                  onStartAssessment={() => scrollToSection("tests")}
                  onLearnMore={() => scrollToSection("about")}
                />
              </div>

              <div ref={aboutRef}>
                <AboutSection onStartAssessment={() => scrollToSection("tests")} />
              </div>

              <div ref={testsRef} style={{ minHeight: "100vh", padding: "2rem 0" }}>
                <TestsSection isLoggedIn={isLoggedIn} onExplore={handleExplore} />
              </div>
            </>
          }
        />

        {/* AUTH ROUTES */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} onSuccess={handleLogin} />} />
        <Route path="/signup" element={<SignupPage onSuccess={handleLogin} />} />
        <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
        <Route path="/verify-email" element={<VerifyEmailPage onLogin={handleLogin} />} />



       

        {/* GRE TESTS */}
        <Route path="/quiz/GRE/verbal-reasoning" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><Gre_verbal /></ProtectedRoute>
        } />
        <Route path="/quiz/GRE/quantitative-analysis" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><Gre_quantitative /></ProtectedRoute>
        } />
        <Route path="/quiz/GRE/analytical-writing" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><Gre_analytical /></ProtectedRoute>
        } />

        {/* IELTS TESTS */}
        <Route path="/quiz/listening/intro" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ListeningTestReady /></ProtectedRoute>
        } />
        <Route path="/quiz/reading/intro" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ReadingTestReady /></ProtectedRoute>
        } />
        <Route path="/quiz/speaking/intro" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><SpeakingTestReady /></ProtectedRoute>
        } />
        <Route path="/quiz/writing/intro" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><WritingTestReady /></ProtectedRoute>
        } />
        <Route path="/tests/ielts-menu" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><IeltsMenu /></ProtectedRoute>
        } />
        <Route path="/quiz/listening" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><IeltsListening /></ProtectedRoute>
        } />
        <Route path="/quiz/reading" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><IeltsReading /></ProtectedRoute>
        } />
        <Route path="/quiz/writing" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><IeltsWriting /></ProtectedRoute>
        } />
        <Route path="/quiz/speaking" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><IeltsSpeaking /></ProtectedRoute>
        } />

        {/* TOEFL TESTS */}
        <Route path="/quiz/toefl/listening/intro" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflListeningIntro /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/reading/intro" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflReadingIntro /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/writing/intro" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflWritingIntro /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/listening" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflListening /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/reading" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflReading /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/writing" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflWriting /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/speaking" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflSpeaking /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/writing/instruction" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflWritingInstructions /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/reading/instruction" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflReadingInstructions /></ProtectedRoute>
        } />
        <Route path="/quiz/toefl/result" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}><ToeflResultPage /></ProtectedRoute>
        } />
      </Routes>

      {!["/login", "/signup"].includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;