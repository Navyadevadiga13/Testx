import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

// --- TOEFL PBT LISTENING DATASET (25 Questions) ---
const PBT_LISTENING_DATA = [
  // PART A: Short Conversations (1-15)
  {
    id: 1,
    part: "A",
    passage: "Man: I heard you're going to Chicago next week.\nWoman: Yes, I have a job interview there.",
    question: "What does the woman mean?",
    options: [
      "She is moving to Chicago permanently.",
      "She has a job interview in Chicago.",
      "She is going to Chicago on vacation.",
      "She has family in Chicago."
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    part: "A",
    passage: "Woman: The library closes at 10 tonight.\nMan: Oh no, I still need to return these books.",
    question: "What will the man probably do?",
    options: [
      "Go to the library before it closes.",
      "Keep the books until tomorrow.",
      "Return the books next week.",
      "Call the library about the hours."
    ],
    correctAnswer: 0,
  },
  {
    id: 3,
    part: "A",
    passage: "Man: I can't find my chemistry notes anywhere.\nWoman: Did you check your backpack? I saw you put them there this morning.",
    question: "What does the woman imply?",
    options: [
      "The man should buy a new notebook.",
      "The notes might be in his backpack.",
      "She will help him look for the notes.",
      "The man lost his notes permanently."
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    part: "A",
    passage: "Woman: The professor postponed the exam until next Friday.\nMan: That's a relief! I wasn't ready at all.",
    question: "What does the man mean?",
    options: [
      "He is disappointed about the postponement.",
      "He is glad to have more time to study.",
      "He thinks the exam will be harder now.",
      "He will drop the class."
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    part: "A",
    passage: "Man: Would you like to go to the concert tonight?\nWoman: I wish I could, but I have to finish my research paper.",
    question: "What will the woman probably do tonight?",
    options: [
      "Go to the concert with the man.",
      "Stay home and work on her paper.",
      "Go to the library to study.",
      "Ask for an extension on her paper."
    ],
    correctAnswer: 1,
  },
  {
    id: 6,
    part: "A",
    passage: "Woman: This is the third time the bus has been late this week.\nMan: I know. It's really frustrating.",
    question: "What are the speakers discussing?",
    options: [
      "The high cost of bus fares.",
      "The unreliability of the bus service.",
      "The need for a new bus route.",
      "The comfort of the buses."
    ],
    correctAnswer: 1,
  },
  {
    id: 7,
    part: "A",
    passage: "Man: I heard you got an internship at the museum.\nWoman: Yes, I start next Monday. I'll be helping with the children's programs.",
    question: "What will the woman do at the museum?",
    options: [
      "Give guided tours to adults.",
      "Work with children's programs.",
      "Help restore old paintings.",
      "Manage the museum's finances."
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    part: "A",
    passage: "Woman: The cafeteria is closed for renovation until next month.\nMan: Where are we supposed to eat then?",
    question: "What is the man concerned about?",
    options: [
      "The quality of the food.",
      "Finding an alternative place to eat.",
      "The cost of meals off campus.",
      "The renovation timeline."
    ],
    correctAnswer: 1,
  },
  {
    id: 9,
    part: "A",
    passage: "Man: Have you seen my umbrella? I thought I left it by the door.\nWoman: I put it in the closet so it wouldn't get lost.",
    question: "What does the woman mean?",
    options: [
      "She lost the umbrella.",
      "She moved the umbrella to the closet.",
      "She borrowed the umbrella.",
      "She doesn't know where the umbrella is."
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    part: "A",
    passage: "Woman: I'm thinking of taking a geology course next semester.\nMan: I took one last year. It was fascinating, but the lab work was intense.",
    question: "What does the man say about the geology course?",
    options: [
      "It was boring and easy.",
      "It required a lot of lab work.",
      "It had no exams.",
      "It was only for science majors."
    ],
    correctAnswer: 1,
  },
  {
    id: 11,
    part: "A",
    passage: "Man: Do you know when the art history paper is due?\nWoman: The syllabus says this Friday, but the professor might extend it.",
    question: "What does the woman say about the paper due date?",
    options: [
      "It is definitely this Friday.",
      "It might be changed to a later date.",
      "It was already last week.",
      "It is not in the syllabus."
    ],
    correctAnswer: 1,
  },
  {
    id: 12,
    part: "A",
    passage: "Woman: I can't believe how expensive textbooks are this semester.\nMan: I know. I spent over $300 already.",
    question: "What are the speakers discussing?",
    options: [
      "The cost of tuition.",
      "The price of textbooks.",
      "The number of classes they're taking.",
      "The availability of used books."
    ],
    correctAnswer: 1,
  },
  {
    id: 13,
    part: "A",
    passage: "Man: The computer lab is always crowded in the evening.\nWoman: That's because everyone waits until the last minute to print their assignments.",
    question: "Why is the computer lab crowded at night according to the woman?",
    options: [
      "Students prefer to study at night.",
      "The lab has better equipment at night.",
      "Students procrastinate on their assignments.",
      "The lab offers free printing at night."
    ],
    correctAnswer: 2,
  },
  {
    id: 14,
    part: "A",
    passage: "Woman: I need to get a part-time job to help pay for school.\nMan: Have you checked the bulletin board in the student center? There are always listings there.",
    question: "What does the man suggest?",
    options: [
      "Looking for job postings at the student center.",
      "Asking professors for job recommendations.",
      "Applying for a scholarship instead.",
      "Waiting until next semester to find a job."
    ],
    correctAnswer: 0,
  },
  {
    id: 15,
    part: "A",
    passage: "Man: I'm having trouble with my biology lab report.\nWoman: You should go to the writing center. They helped me a lot last semester.",
    question: "What does the woman recommend?",
    options: [
      "Asking the professor for help.",
      "Visiting the writing center.",
      "Buying a lab report guide.",
      "Working with a study group."
    ],
    correctAnswer: 1,
  },

  // PART B: Longer Conversations (16-20)
  {
    id: 16,
    part: "B",
    passage: "Man: Hi Lisa, I heard you're working on the archaeology project about ancient pottery.\nWoman: Yes, it's really interesting. I'm studying how pottery styles changed over time in the Mediterranean region.\nMan: That sounds fascinating. What time period are you focusing on?\nWoman: Mostly the Bronze Age, around 3000 to 1000 BCE. There's a lot of evidence from that era.\nMan: Are you looking at any specific sites?\nWoman: Mainly Crete and mainland Greece. The Minoan and Mycenaean cultures produced some beautiful ceramics.\nMan: I'd love to see some of the pieces you're studying.\nWoman: Actually, the museum has a small exhibit of replicas. We could go together sometime.",
    question: "What is the woman's research project about?",
    options: [
      "Ancient Greek architecture",
      "Mediterranean pottery styles",
      "Bronze Age weapons",
      "Minoan burial practices"
    ],
    correctAnswer: 1,
  },
  {
    id: 17,
    part: "B",
    passage: "Man: Hi Lisa, I heard you're working on the archaeology project about ancient pottery.\nWoman: Yes, it's really interesting. I'm studying how pottery styles changed over time in the Mediterranean region.\nMan: That sounds fascinating. What time period are you focusing on?\nWoman: Mostly the Bronze Age, around 3000 to 1000 BCE. There's a lot of evidence from that era.\nMan: Are you looking at any specific sites?\nWoman: Mainly Crete and mainland Greece. The Minoan and Mycenaean cultures produced some beautiful ceramics.\nMan: I'd love to see some of the pieces you're studying.\nWoman: Actually, the museum has a small exhibit of replicas. We could go together sometime.",
    question: "Which ancient cultures does the woman mention?",
    options: [
      "Egyptian and Roman",
      "Minoan and Mycenaean",
      "Phoenician and Carthaginian",
      "Greek and Persian"
    ],
    correctAnswer: 1,
  },
  {
    id: 18,
    part: "B",
    passage: "Man: Hi Lisa, I heard you're working on the archaeology project about ancient pottery.\nWoman: Yes, it's really interesting. I'm studying how pottery styles changed over time in the Mediterranean region.\nMan: That sounds fascinating. What time period are you focusing on?\nWoman: Mostly the Bronze Age, around 3000 to 1000 BCE. There's a lot of evidence from that era.\nMan: Are you looking at any specific sites?\nWoman: Mainly Crete and mainland Greece. The Minoan and Mycenaean cultures produced some beautiful ceramics.\nMan: I'd love to see some of the pieces you're studying.\nWoman: Actually, the museum has a small exhibit of replicas. We could go together sometime.",
    question: "What does the woman suggest they do together?",
    options: [
      "Visit an archaeological dig",
      "Go to a museum exhibit",
      "Attend a lecture on pottery",
      "Study at the library"
    ],
    correctAnswer: 1,
  },
  {
    id: 19,
    part: "B",
    passage: "Woman: Excuse me, Professor Thompson. Do you have a moment?\nMan: Of course, Sarah. What can I do for you?\nWoman: I'm thinking about applying for the study abroad program in London next fall, and I need a letter of recommendation.\nMan: I'd be happy to write one for you. You were one of my best students in the British literature course.\nWoman: Thank you so much. The deadline is March 15th. Is that enough time?\nMan: Plenty of time. Just send me your resume and a brief statement about why you want to go, and I'll take care of it.\nWoman: Great. I'll email you those materials by the end of this week.\nMan: Perfect. And let me know if you need any advice about the program itself. I studied in London years ago.\nWoman: Really? That would be wonderful. I'd love to hear about your experience sometime.",
    question: "Why does the woman visit Professor Thompson?",
    options: [
      "To ask about a grade",
      "To request a recommendation letter",
      "To discuss a course assignment",
      "To get advice about London"
    ],
    correctAnswer: 1,
  },
  {
    id: 20,
    part: "B",
    passage: "Woman: Excuse me, Professor Thompson. Do you have a moment?\nMan: Of course, Sarah. What can I do for you?\nWoman: I'm thinking about applying for the study abroad program in London next fall, and I need a letter of recommendation.\nMan: I'd be happy to write one for you. You were one of my best students in the British literature course.\nWoman: Thank you so much. The deadline is March 15th. Is that enough time?\nMan: Plenty of time. Just send me your resume and a brief statement about why you want to go, and I'll take care of it.\nWoman: Great. I'll email you those materials by the end of this week.\nMan: Perfect. And let me know if you need any advice about the program itself. I studied in London years ago.\nWoman: Really? That would be wonderful. I'd love to hear about your experience sometime.",
    question: "What does the professor ask the woman to send him?",
    options: [
      "Her transcript and course list",
      "Her resume and a personal statement",
      "A list of references",
      "Her application fee"
    ],
    correctAnswer: 1,
  },

  // PART C: Lectures/Talks (21-25)
  {
    id: 21,
    part: "C",
    passage: "Today we'll discuss the process of photosynthesis, which is how plants convert light energy into chemical energy. This occurs in the chloroplasts, specifically in structures called thylakoids. The thylakoids contain chlorophyll, the green pigment that captures light. The light energy is used to split water molecules, releasing oxygen as a byproduct. The hydrogen from water then combines with carbon dioxide to form glucose. This entire process is essential for life on Earth because it produces the oxygen we breathe and forms the base of most food chains.",
    question: "What is the main topic of this lecture?",
    options: ["Plant reproduction", "Photosynthesis", "Cellular respiration", "Plant genetics"],
    correctAnswer: 1,
  },
  {
    id: 22,
    part: "C",
    passage: "Today we'll discuss the process of photosynthesis, which is how plants convert light energy into chemical energy. This occurs in the chloroplasts, specifically in structures called thylakoids. The thylakoids contain chlorophyll, the green pigment that captures light. The light energy is used to split water molecules, releasing oxygen as a byproduct. The hydrogen from water then combines with carbon dioxide to form glucose. This entire process is essential for life on Earth because it produces the oxygen we breathe and forms the base of most food chains.",
    question: "Where does photosynthesis occur within a plant cell?",
    options: ["In the nucleus", "In the mitochondria", "In the chloroplasts", "In the cell wall"],
    correctAnswer: 2,
  },
  {
    id: 23,
    part: "C",
    passage: "Today we'll discuss the process of photosynthesis, which is how plants convert light energy into chemical energy. This occurs in the chloroplasts, specifically in structures called thylakoids. The thylakoids contain chlorophyll, the green pigment that captures light. The light energy is used to split water molecules, releasing oxygen as a byproduct. The hydrogen from water then combines with carbon dioxide to form glucose. This entire process is essential for life on Earth because it produces the oxygen we breathe and forms the base of most food chains.",
    question: "What is released as a byproduct of photosynthesis?",
    options: ["Carbon dioxide", "Glucose", "Oxygen", "Hydrogen"],
    correctAnswer: 2,
  },
  {
    id: 24,
    part: "C",
    passage: "Good morning. Today I want to talk about the history of the postal service in the United States. The first official postal system was established in 1775, with Benjamin Franklin appointed as the first Postmaster General. In those early days, mail was transported by horseback riders on designated routes. The service expanded rapidly during the 19th century with the introduction of railroads and steamships. Perhaps the most famous innovation was the Pony Express, which began in 1860 and could deliver mail from Missouri to California in just 10 days. Although it only operated for 18 months, it captured the public's imagination. By the late 1800s, rural free delivery brought mail directly to people's homes, revolutionizing communication in rural America.",
    question: "Who was the first Postmaster General of the United States?",
    options: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "Alexander Hamilton"],
    correctAnswer: 2,
  },
  {
    id: 25,
    part: "C",
    passage: "Good morning. Today I want to talk about the history of the postal service in the United States. The first official postal system was established in 1775, with Benjamin Franklin appointed as the first Postmaster General. In those early days, mail was transported by horseback riders on designated routes. The service expanded rapidly during the 19th century with the introduction of railroads and steamships. Perhaps the most famous innovation was the Pony Express, which began in 1860 and could deliver mail from Missouri to California in just 10 days. Although it only operated for 18 months, it captured the public's imagination. By the late 1800s, rural free delivery brought mail directly to people's homes, revolutionizing communication in rural America.",
    question: "How long did the Pony Express operate?",
    options: ["10 years", "5 years", "18 months", "6 months"],
    correctAnswer: 2,
  },
];

const TOTAL_QUESTIONS = PBT_LISTENING_DATA.length;

// --- COMPONENT ---
function ToeflListening() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(TOTAL_QUESTIONS).fill(null));
  const [timeLeft, setTimeLeft] = useState(35 * 60);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const API_URL = getApiBaseUrl();

  // Timer
  useEffect(() => {
    if (testCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTestCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [testCompleted]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const playAudio = () => {
    if (!window.speechSynthesis) return alert("Speech synthesis not supported.");
    window.speechSynthesis.cancel();
    const current = PBT_LISTENING_DATA[currentIdx];
    const utter = new SpeechSynthesisUtterance(`${current.passage}. ${current.question}`);
    utter.rate = 0.9;
    utter.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) utter.voice = voices[0];
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleSelect = (i) => {
    const ans = [...userAnswers];
    ans[currentIdx] = i;
    setUserAnswers(ans);
  };

  const handleNext = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentIdx < TOTAL_QUESTIONS - 1) setCurrentIdx(prev => prev + 1);
    else setTestCompleted(true);
  };

const calculateScore = async () => {

  const correctCount = userAnswers.reduce(
    (acc, ans, idx) => acc + (ans === PBT_LISTENING_DATA[idx].correctAnswer ? 1 : 0),
    0
  );

  const rawScore = correctCount;
  const total = TOTAL_QUESTIONS;

  const toeflScore = Math.round((rawScore / total) * 30);
  const percentage = Math.round((rawScore / total) * 100);

  try {

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login to save your test result.");
  return;
}

    console.log("Saving TOEFL Result:", {
      rawScore,
      total,
      toeflScore,
      percentage
    });

    if (token) {

      const response = await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
    Authorization: `Bearer ${token}` // ✅ FIXED
        },
        body: JSON.stringify({
          testName: "TOEFL Listening (PBT)",
          result: {
            rawScore,
            total,
            toeflScore,
            percentage
          }
        })
      });

      const data = await response.json();
      console.log("Save response:", data);

    }

  } catch (err) {
    console.error("Error saving test:", err);
  }

  navigate("/quiz/toefl/result", {
    state: {
      correctCount: rawScore,
      total,
      toeflScore,
      percentage,
      testType: "Listening"
    }
  });

};

  if (testCompleted) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ color: "#097442" }}>Session Concluded</h1>
          <p style={{ color: "#b4bebd" }}>You have completed the TOEFL PBT Listening test.</p>
          <button onClick={calculateScore} style={primaryBtnStyle}>Check Your Results</button>
        </div>
      </div>
    );
  }

  const currentQ = PBT_LISTENING_DATA[currentIdx];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ color: "#05914f" }}>TOEFL Listening (PBT)</h1>
        <div style={timerBoxStyle}>
          <span style={{ color: timeLeft < 300 ? "#ff4757" : "#077542", fontSize: "1.4rem", fontWeight: "bold" }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "#141515" }}>
        <span>Question {currentIdx + 1} of {TOTAL_QUESTIONS}</span>
        <span style={{ color: "#078248" }}>Part {currentQ.part}</span>
      </div>

      <div style={progressContainerStyle}>
        <div style={{ ...progressBarStyle, width: `${((currentIdx + 1) / TOTAL_QUESTIONS) * 100}%` }} />
      </div>

      <div style={cardStyle}>
        <div style={audioControlStyle}>
          <button onClick={playAudio} style={{ ...audioPlayBtnStyle, background: isSpeaking ? "#ff4757" : "#05914f" }}>
            {isSpeaking ? "🔊 Speaking..." : "▶ Play Audio Question"}
          </button>
          <p style={{ fontSize: "0.9rem", color: "#b4bebd", marginTop: "1rem" }}>
            Click to listen to the conversation and question.
          </p>
        </div>
<div style={questionAreaStyle}>
  <h3 style={{ marginBottom: "1rem" }}>Question:</h3>
  <p style={{ color: "#001211", marginBottom: "2rem" }}>{currentQ.question}</p>

  <div style={optionsGridStyle}>
    {currentQ.options.map((opt, i) => (
      <button
        key={i}
        onClick={() => handleSelect(i)}
        style={{
          ...optionBtnStyle,
          borderColor: userAnswers[currentIdx] === i ? "#19fd91" : "rgba(255,255,255,0.1)",
          background: userAnswers[currentIdx] === i ? "rgba(25, 253, 145, 0.05)" : "rgba(255,255,255,0.03)"
        }}
      >
        <div style={radioCircleStyle}>
          {userAnswers[currentIdx] === i && <div style={radioInnerStyle} />}
        </div>
        <span>{opt}</span>
      </button>
    ))}
  </div>
</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem", gap: "2rem" }}>
        <button onClick={() => navigate("/")} style={exitBtnStyle}>Exit Test</button>
        <button
          onClick={handleNext}
          disabled={userAnswers[currentIdx] === null}
          style={{ ...navBtnStyle, opacity: userAnswers[currentIdx] === null ? 0.5 : 1 }}
        >
          {currentIdx === TOTAL_QUESTIONS - 1 ? "Finish Test" : "Next Question"}
        </button>
      </div>
    </div>
  );
}

// --- STYLES ---
const containerStyle = { maxWidth: "860px", margin: "0 auto",  padding: "160px 24px 16px", minHeight: "100vh", background: "#ffffff", color: "#111111" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" };
const timerBoxStyle = { background: "#f4faf7", border: "1px solid #c8e6d4", padding: "6px 18px", borderRadius: "12px", textAlign: "center", minWidth: "100px" };
const progressContainerStyle = { width: "100%", height: "4px", background: "#e0f0e8", borderRadius: "2px", marginBottom: "8px" };
const progressBarStyle = { height: "100%", background: "#2e7d52", transition: "width 0.3s ease" };
const cardStyle = { background: "#f9fefb", border: "1px solid #c8e6d4", borderRadius: "16px", padding: "1.1rem 1.4rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
const audioControlStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #c8e6d4", paddingBottom: "0.7rem", marginBottom: "0.7rem" };
const audioPlayBtnStyle = { padding: "8px 22px", border: "none", borderRadius: "22px", color: "#fff", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" };
const questionAreaStyle = { width: "100%" };
const optionsGridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" };
const optionBtnStyle = { border: "1.5px solid", padding: "10px 12px", borderRadius: "9px", color: "#111111", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.2s", background: "#ffffff", fontSize: "0.87rem" };
const radioCircleStyle = { width: "17px", height: "17px", borderRadius: "50%", border: "2px solid #2e7d52", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" };
const radioInnerStyle = { width: "9px", height: "9px", borderRadius: "50%", background: "#2e7d52" };
const navBtnStyle = { padding: "9px 28px", background: "#0c572e", color: "#fff", border: "none", borderRadius: "50px", fontWeight: "bold", fontSize: "0.92rem", transition: "all 0.2s", cursor: "pointer" };
const exitBtnStyle = { padding: "9px 20px", background: "transparent", border: "1px solid #c8e6d4", color: "#555", borderRadius: "50px", cursor: "pointer", fontSize: "0.88rem" };
const primaryBtnStyle = { padding: "11px 32px", background: "#0f522d", color: "#fff", border: "none", borderRadius: "50px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" };

export default ToeflListening;