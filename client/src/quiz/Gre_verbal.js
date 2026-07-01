// src/quiz/Gre_verbal.js

import React, { useState, useEffect } from "react";
import getApiBaseUrl from "../utils/api";
import { FaClock } from "react-icons/fa";

const verbalQuestions = [

  // ---------- SECTION 1 ----------

  {
    id:1,
    question:"Although the professor appeared stern, his lectures were surprisingly ______.",
    options:["engaging","captivating","tedious","monotonous","rigid","dull"],
    answer:"engaging"
  },

  {
    id:2,
    question:"The CEO's explanation was so ______ that analysts struggled to determine the company's true financial position.",
    options:["lucid","transparent","equivocal","forthright"],
    answer:"equivocal"
  },

  {
    id:3,
    question:"Her criticism was so ______ that even confident speakers began doubting their arguments.",
    options:["devastating","scathing","mild","lenient","perfunctory","superficial"],
    answer:"scathing"
  },

  {
    id:4,
    question:"Despite early skepticism, economists began to view the reform with ______.",
    options:["hostility","cautious optimism","indifference","complete rejection"],
    answer:"cautious optimism"
  },

  {
    id:5,
    question:"Historians argue the empire's decline was a ______ process lasting centuries.",
    options:["gradual","abrupt","instantaneous","sudden"],
    answer:"gradual"
  },

  {
    id:6,
    question:"The scientist became famous for her ______ thinking, frequently challenging traditional beliefs.",
    options:["orthodox","iconoclastic","conventional","traditional"],
    answer:"iconoclastic"
  },

  {
    id:7,
    question:"The argument initially appears convincing but ultimately proves ______.",
    options:["sound","coherent","flawed","persuasive"],
    answer:"flawed"
  },

  {
    id:8,
    question:"The study's primary goal was to ______ widely accepted assumptions.",
    options:["confirm","refute","ignore","repeat"],
    answer:"refute"
  },

  {
    id:9,
    question:"The committee's decision was widely regarded as ______ and thoughtful.",
    options:["prudent","reckless","irrational","careless"],
    answer:"prudent"
  },

  {
    id:10,
    question:"His remarks were so ______ that many listeners felt offended.",
    options:["tactful","blunt","courteous","considerate"],
    answer:"blunt"
  },

  {
    id:11,
    question:"The discovery represented a ______ breakthrough in medical science.",
    options:["minor","insignificant","major","trivial"],
    answer:"major"
  },

  {
    id:12,
    question:"Her explanation was brief but remarkably ______.",
    options:["superficial","thorough","unclear","incomplete"],
    answer:"thorough"
  },

  // ---------- SECTION 2 ----------

  {
    id:13,
    question:"The politician attempted to ______ public concern about the scandal.",
    options:["intensify","mitigate","provoke","expand"],
    answer:"mitigate"
  },

  {
    id:14,
    question:"The theory was dismissed by critics as highly ______.",
    options:["innovative","implausible","convincing","logical"],
    answer:"implausible"
  },

  {
    id:15,
    question:"The research conclusions were later ______ by further experimentation.",
    options:["confirmed","contradicted","ignored","weakened"],
    answer:"confirmed"
  },

  {
    id:16,
    question:"The author's tone throughout the essay is best described as ______.",
    options:["satirical","solemn","neutral","casual"],
    answer:"satirical"
  },

  {
    id:17,
    question:"Following the economic reforms, company profits began to ______ steadily.",
    options:["decline","increase","vanish","collapse"],
    answer:"increase"
  },

  {
    id:18,
    question:"The hypothesis assumes that natural resources are ______.",
    options:["abundant","limited","unpredictable","renewable"],
    answer:"limited"
  },

  {
    id:19,
    question:"Despite criticism, the theory remains ______ and widely respected.",
    options:["tenuous","robust","fragile","weak"],
    answer:"robust"
  },

  {
    id:20,
    question:"Her speech was both inspiring and highly ______.",
    options:["dull","motivating","confusing","irrelevant"],
    answer:"motivating"
  },

  {
    id:21,
    question:"The results of the study were frustratingly ______.",
    options:["conclusive","ambiguous","irrelevant","trivial"],
    answer:"ambiguous"
  },

  {
    id:22,
    question:"This breakthrough may significantly ______ future scientific research.",
    options:["hinder","advance","delay","prevent"],
    answer:"advance"
  },

  {
    id:23,
    question:"The artist is admired for his highly ______ and original style.",
    options:["derivative","innovative","ordinary","common"],
    answer:"innovative"
  },

  {
    id:24,
    question:"The central bank introduced new policies to ______ inflation.",
    options:["reduce","increase","ignore","encourage"],
    answer:"reduce"
  },

  {
    id:25,
    question:"The lawyer presented ______ evidence that convinced the jury.",
    options:["irrelevant","compelling","weak","questionable"],
    answer:"compelling"
  },

  {
    id:26,
    question:"The experimental results were ______ the researcher's predictions.",
    options:["consistent with","contrary to","unrelated to","identical to"],
    answer:"consistent with"
  },

  {
    id:27,
    question:"The author's attitude toward the theory can best be described as ______.",
    options:["supportive","skeptical","indifferent","enthusiastic"],
    answer:"skeptical"
  }

];

function Gre_verbal(){

  const API_URL = getApiBaseUrl();

  const [section,setSection] = useState(1);
  const [currentQuestionIndex,setCurrentQuestionIndex] = useState(0);
  const [answers,setAnswers] = useState({});
  const [timeLeft,setTimeLeft] = useState(18*60);
  const [showResult,setShowResult] = useState(false);

  const questions =
    section === 1
      ? verbalQuestions.slice(0,12)
      : verbalQuestions.slice(12,27);

  const question = questions[currentQuestionIndex];
useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}, []);

  useEffect(()=>{

    const timer = setInterval(()=>{

      setTimeLeft(prev=>{

        if(prev <= 1){

          finishQuiz();
          return 0;

        }

        return prev - 1;

      });

    },1000);

    return ()=> clearInterval(timer);

  },[section,currentQuestionIndex]);

  const formatTime = (seconds)=>{

    const min = Math.floor(seconds/60);
    const sec = seconds%60;

    return `${min}:${sec<10?"0":""}${sec}`;

  };

  const handleOptionSelect = (option)=>{

    setAnswers(prev=>({

      ...prev,
      [`${section}-${currentQuestionIndex}`]:option

    }));

  };

  const handleNext = ()=>{

    if(currentQuestionIndex < questions.length-1){

      setCurrentQuestionIndex(prev=>prev+1);

    }else{

      if(section===1){

        setSection(2);
        setCurrentQuestionIndex(0);
        setTimeLeft(23*60);

      }else{

        finishQuiz();

      }

    }

  };

  const calculateScore = ()=>{

    let score = 0;

    Object.keys(answers).forEach((key)=>{

      const [sectionIndex,questionIndex] = key.split("-");

      let index =
        sectionIndex === "1"
          ? parseInt(questionIndex)
          : 12 + parseInt(questionIndex);

      if(verbalQuestions[index].answer === answers[key]){

        score++;

      }

    });

    return score;

  };

  const finishQuiz = async ()=>{

    const score = calculateScore();

    const level =
      score>=22
        ?"Excellent Verbal Ability"
        :score>=16
        ?"Strong Verbal Skills"
        :score>=10
        ?"Moderate Verbal Skills"
        :"Needs Improvement";

    try{

      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/tests/save`,{

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },

        body:JSON.stringify({

          testName:"GRE Verbal Reasoning",

          result:{
            score,
            total:27,
            level
          }

        })

      });

    }catch(err){

      console.error("Error saving GRE result:",err);

    }

    setShowResult(true);

  };

  const progress =
    ((currentQuestionIndex+1)/questions.length)*100;

  /* ───────── RESULT SCREEN ───────── */

  if(showResult){

    const score = calculateScore();

    const level =
      score>=22
        ?"Excellent Verbal Ability"
        :score>=16
        ?"Strong Verbal Skills"
        :score>=10
        ?"Moderate Verbal Skills"
        :"Needs Improvement";

    return(

      <div style={styles.resultPage}>

        <div style={styles.resultCard}>

          <h1 style={styles.resultHeading}>
            GRE Verbal Reasoning Test
          </h1>

          <div style={styles.score}>
            Score: {score} / 27
          </div>

          <div style={styles.level}>
            {level}
          </div>

          <div style={styles.saved}>
            ✅ Complete result stored in profile
          </div>

          <button
            style={styles.profileBtn}
            onClick={()=>window.location.href="/profile"}
          >
            Go to Profile
          </button>

        </div>

      </div>

    );

  }

  /* ───────── QUESTION SCREEN ───────── */

  return(

    <div style={styles.page}>

      <div style={styles.card}>

        {/* TITLE */}

        <h1 style={styles.mainHeading}>
          GRE Verbal Reasoning
        </h1>

        <div style={styles.sectionText}>
          Section {section}
        </div>

        {/* TIMER */}

        <div style={styles.timer}>

          <FaClock />

          <span>{formatTime(timeLeft)}</span>

        </div>

        {/* PROGRESS */}

        <div style={styles.progressWrapper}>

          <div
            style={{
              ...styles.progressFill,
              width:`${progress}%`
            }}
          />

        </div>

        {/* QUESTION */}

        <div style={styles.questionCount}>
          Question {currentQuestionIndex+1} of {questions.length}
        </div>

        <div style={styles.questionBox}>
          {question.question}
        </div>

        {/* OPTIONS */}

        <div style={styles.optionsContainer}>

          {question.options.map((option,index)=>{

            const selected =
              answers[`${section}-${currentQuestionIndex}`] === option;

            return(

              <button
                key={index}
                onClick={()=>handleOptionSelect(option)}
                style={{
                  ...styles.optionButton,

                  border:selected
                    ?"2px solid #166534"
                    :"2px solid #d1d5db",

                  background:selected
                    ?"rgba(22,101,52,0.08)"
                    :"#ffffff"
                }}
              >
                {option}
              </button>

            );

          })}

        </div>

        {/* BUTTON */}

        <div style={styles.buttonWrapper}>

          <button
            onClick={handleNext}
            disabled={!answers[`${section}-${currentQuestionIndex}`]}
            style={{
              ...styles.nextButton,

              background:
                answers[`${section}-${currentQuestionIndex}`]
                  ?"#166534"
                  :"#9ca3af",

              cursor:
                answers[`${section}-${currentQuestionIndex}`]
                  ?"pointer"
                  :"not-allowed"
            }}
          >
            {
              currentQuestionIndex === questions.length-1
                ? section===2
                  ? "Finish Test"
                  : "Go To Section 2"
                : "Next Question"
            }
          </button>

        </div>

      </div>

    </div>

  );

}

/* ───────── STYLES ───────── */
const styles = {

page:{
  minHeight:"100vh",
  width:"100%",
  background:"#ffffff",
  display:"flex",
  justifyContent:"center",
  alignItems:"flex-start",

  /* IMPORTANT FIX */
  paddingTop:"95px",

  paddingLeft:"14px",
  paddingRight:"14px",
  paddingBottom:"25px",

  boxSizing:"border-box",
  overflowY:"auto"
},

card:{
  width:"100%",
  maxWidth:"820px",
  background:"#ffffff",
  border:"1.5px solid #dcfce7",
  borderRadius:"18px",
  padding:"18px",
  boxShadow:"0 4px 18px rgba(0,0,0,0.05)",
  boxSizing:"border-box"
},

mainHeading:{
  margin:"0",
  textAlign:"center",
  color:"#166534",
  fontWeight:"800",
  lineHeight:"1.2",
  fontSize:"clamp(20px,2.5vw,30px)"
},

  sectionText:{
    textAlign:"center",
    color:"#374151",
    fontWeight:"700",
    marginTop:"5px",
    fontSize:"clamp(14px,1.8vw,18px)"
  },

  timer:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    gap:"6px",
    marginTop:"12px",
    marginBottom:"14px",
    color:"#166534",
    fontWeight:"700",
    fontSize:"clamp(13px,1.8vw,15px)"
  },

  progressWrapper:{
    width:"100%",
    height:"7px",
    background:"#e5e7eb",
    borderRadius:"999px",
    overflow:"hidden",
    marginBottom:"18px"
  },

  progressFill:{
    height:"100%",
    background:"#166534",
    transition:"0.3s"
  },

  questionCount:{
    color:"#166534",
    fontWeight:"700",
    marginBottom:"8px",
    fontSize:"clamp(14px,2vw,18px)"
  },

  questionBox:{
    color:"#111827",
    fontWeight:"600",
    lineHeight:"1.5",
    marginBottom:"18px",
    fontSize:"clamp(15px,2vw,21px)",
    wordBreak:"break-word"
  },

  optionsContainer:{
    display:"flex",
    flexDirection:"column",
    gap:"10px"
  },

  optionButton:{
    width:"100%",
    textAlign:"left",
    padding:"13px 16px",
    borderRadius:"12px",
    color:"#111827",
    fontWeight:"600",
    fontSize:"clamp(13px,1.8vw,16px)",
    lineHeight:"1.4",
    cursor:"pointer",
    transition:"0.2s",
    wordBreak:"break-word",
    outline:"none",
    background:"#fff"
  },

  buttonWrapper:{
    display:"flex",
    justifyContent:"center",
    marginTop:"22px"
  },

  nextButton:{
    border:"none",
    borderRadius:"10px",
    padding:"12px 28px",
    color:"#ffffff",
    fontWeight:"700",
    fontSize:"clamp(13px,1.8vw,16px)",
    transition:"0.3s"
  },

  resultPage:{
    minHeight:"100vh",
    width:"100%",
    background:"#ffffff",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:"20px",
    boxSizing:"border-box"
  },

  resultCard:{
    width:"100%",
    maxWidth:"520px",
    background:"#ffffff",
    border:"1.5px solid #dcfce7",
    borderRadius:"18px",
    padding:"24px",
    boxShadow:"0 4px 18px rgba(0,0,0,0.05)",
    textAlign:"center"
  },

  resultHeading:{
    margin:"0 0 14px",
    fontSize:"clamp(22px,3vw,32px)",
    color:"#166534",
    fontWeight:"800",
    lineHeight:"1.2"
  },

  score:{
    fontSize:"clamp(18px,2vw,24px)",
    fontWeight:"800",
    color:"#166534",
    marginBottom:"10px"
  },

  level:{
    fontSize:"clamp(14px,1.8vw,16px)",
    color:"#374151",
    marginBottom:"16px",
    fontWeight:"600"
  },

  saved:{
    color:"#166534",
    fontWeight:"700",
    marginBottom:"18px",
    fontSize:"14px"
  },

  profileBtn:{
    background:"#166534",
    color:"#ffffff",
    border:"none",
    borderRadius:"10px",
    padding:"12px 24px",
    fontSize:"14px",
    fontWeight:"700",
    cursor:"pointer"
  }

};

export default Gre_verbal;