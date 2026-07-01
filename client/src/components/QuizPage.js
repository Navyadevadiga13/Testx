// src/components/QuizPage.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function QuizPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect any /quiz/:id usage to the Big Five page for now
    navigate("/tests/personality/bigfive", { replace: true });
  }, [navigate]);

  return null;
}

export default QuizPage;
