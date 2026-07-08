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