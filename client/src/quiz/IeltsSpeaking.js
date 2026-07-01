import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiSquare, FiSave, FiClock, FiPlay } from "react-icons/fi";
import getApiBaseUrl from "../utils/api"; 

const IELTS_DATA_SPEAKING = {
    title: "Academic Speaking Practice Test 1",
    parts: [
        {
            id: "part1",
            title: "Part 1: Introduction & Interview (4-5 min)",
            questions: [
                "Let's talk about where you live. Do you live in a house or an apartment?",
                "What do you like most about your home?",
                "Is there anything you would like to change about your home?",
                "Let's talk about hobbies. What do you do in your spare time?",
                "How long have you been doing this hobby?"
            ]
        },
        {
            id: "part2",
            title: "Part 2: Long Turn (Cue Card) (3-4 min)",
            prompt: "Describe a person you admire who is older than you. You should say: Who the person is, How you met them, What they are like, and explain why you admire them.",
            preparationTime: 60,
            speakingTime: 120
        },
        {
            id: "part3",
            title: "Part 3: Discussion (4-5 min)",
            questions: [
                "In your culture, which roles do older people play in the family?",
                "Do you think the role of older people in society is changing?",
                "What can younger generations learn from older people?",
                "Is it important for society to take care of its elderly members?"
            ]
        }
    ]
};

export default function IeltsSpeaking() {
    const navigate = useNavigate();
    const [activePart, setActivePart] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [recordings, setRecordings] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const API_URL =  getApiBaseUrl(); 
;

    useEffect(() => {
        let timer;
        if (isRecording && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRecording) {
            stopRecording();
        }
        return () => clearInterval(timer);
    }, [isRecording, timeLeft]);

    const startRecording = (duration) => {
        setIsRecording(true);
        setTimeLeft(duration || 300); // 5 mins default
    };

    const stopRecording = () => {
        setIsRecording(false);
        setRecordings(prev => ({ ...prev, [activePart]: "recording_stored" }));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await fetch(`${API_URL}/tests/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": token },
                    body: JSON.stringify({
                        testName: "IELTS Academic Speaking",
                        result: {
                            score: "Submitted", // Manual Review
                            total: 3,
                            breakdown: {
                                partsCompleted: Object.keys(recordings).length,
                                part1: recordings[0] ? "Completed" : "Not attempted",
                                part2: recordings[1] ? "Completed" : "Not attempted",
                                part3: recordings[2] ? "Completed" : "Not attempted"
                            }
                        }
                    })
                });
            } catch (err) {
                console.error("Save failed", err);
            }
        }
    };

    const currentPart = IELTS_DATA_SPEAKING.parts[activePart];

    // Helper functions
    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording(currentPart.speakingTime || 300);
        }
    };

    const nextPart = () => {
        if (activePart < IELTS_DATA_SPEAKING.parts.length - 1) {
            setActivePart(prev => prev + 1);
            setIsRecording(false);
            setTimeLeft(0);
        } else {
            handleSubmit();
        }
    };

    // Render Submitted State
    if (submitted) {
        return (
            <div className="ielts-container">
                <style jsx>{`
                    .ielts-container {
                      min-height: 100vh;
                      background: linear-gradient(135deg, #0a140f 0%, #111c17 100%);
                      padding: 2rem;
                      padding-top: 100px;
                      color: white;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    }
                    .glass-card {
                      background: rgba(17, 28, 23, 0.6);
                      backdrop-filter: blur(12px);
                      border: 1px solid rgba(25, 253, 145, 0.1);
                      border-radius: 24px;
                      padding: 2.5rem;
                      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
                      text-align: center;
                    }
                    .primary-btn {
                      background: #19fd91;
                      color: black;
                      font-weight: 700;
                      border: none;
                      border-radius: 12px;
                      padding: 1rem 3rem;
                      cursor: pointer;
                      transition: transform 0.2s;
                    } 
                 `}</style>
                <div className="w-full max-w-[800px] mx-auto glass-card">
                    <FiSave className="text-6xl text-[#19fd91] mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-2">Speaking Test Submitted</h2>
                    <p className="text-gray-400 mb-8">Your recordings have been saved for assessment.</p>
                    <button onClick={() => navigate("/tests/ielts")} className="primary-btn">Return to Menu</button>
                </div>
            </div>
        );
    }

    // Render Main State
    return (
        <div className="ielts-container">
            <style jsx>{`
            .ielts-container {
              min-height: 100vh;
              background: linear-gradient(135deg, #0a140f 0%, #111c17 100%);
              padding: 2rem;
              padding-top: 100px;
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
    
            .glass-card {
              background: rgba(17, 28, 23, 0.6);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(25, 253, 145, 0.1);
              border-radius: 24px;
              padding: 2.5rem;
              box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
              text-align: center;
            }
    
            .progress-bar {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 0.5rem;
                display: flex;
                justify-content: space-between;
                margin-bottom: 2rem;
            }
    
            .progress-step {
                flex: 1;
                text-align: center;
                padding: 0.5rem;
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.4);
                border-radius: 8px;
                transition: all 0.3s;
            }
    
            .progress-step.active {
                background: rgba(25, 253, 145, 0.1);
                color: #19fd91;
                font-weight: bold;
            }
    
            .mic-btn {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
                margin: 0 auto;
            }
    
            .mic-btn.active {
                background: #ef4444;
                color: white;
                box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
                animation: pulse-ring 2s infinite;
            }
    
            .mic-btn.idle {
                background: rgba(255, 255, 255, 0.1);
                color: #19fd91;
                border: 1px solid rgba(25, 253, 145, 0.3);
            }
    
            .mic-btn.idle:hover {
                background: rgba(25, 253, 145, 0.1);
                transform: scale(1.05);
            }
    
            .primary-btn {
              background: #19fd91;
              color: black;
              font-weight: 700;
              border: none;
              border-radius: 12px;
              padding: 1rem 3rem;
              cursor: pointer;
              transition: transform 0.2s;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
    
            .primary-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 20px rgba(25, 253, 145, 0.2);
            }
    
            @keyframes pulse-ring {
                0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
                100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
          `}</style>

            {/* HEADER */}
            <div className="w-full max-w-[800px] mx-auto flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/tests/ielts")}>IELTS Mock Test</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-[#19fd91]">Speaking</span>
                </h1>

                {isRecording && (
                    <div className="flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-xl bg-red-500/20 text-red-400 animate-pulse border border-red-500/30">
                        <FiClock /> {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {/* MAIN CARD */}
            <div className="w-full max-w-[800px] mx-auto glass-card">

                {/* PROGRESS STEPS */}
                <div className="progress-bar">
                    <div className={`progress-step ${activePart === 0 ? "active" : ""}`}>Part 1: Introduction</div>
                    <div className={`progress-step ${activePart === 1 ? "active" : ""}`}>Part 2: Cue Card</div>
                    <div className={`progress-step ${activePart === 2 ? "active" : ""}`}>Part 3: Discussion</div>
                </div>

                <div className="py-4">
                    <h2 className="text-2xl font-bold text-white mb-2">{currentPart.title}</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        {activePart === 1 ? "Prepare for 1 min, then speak for 2 mins." : "Answer the questions as naturally as possible."}
                    </p>

                    <div className="bg-black/20 p-8 rounded-2xl mb-10 border border-white/5 min-h-[150px] flex flex-col items-center justify-center gap-4">
                        {currentPart.prompt && <p className="text-xl text-white font-medium italic leading-relaxed">"{currentPart.prompt}"</p>}
                        {currentPart.questions && currentPart.questions.map((q, i) => (
                            <p key={i} className="text-lg text-gray-300">"{q}"</p>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <button
                            onClick={toggleRecording}
                            className={`mic-btn ${isRecording ? "active" : "idle"}`}
                        >
                            {isRecording ? <FiMic /> : <FiMic />}
                        </button>
                        <p className={`font-mono text-sm ${isRecording ? "text-red-400 animate-pulse" : "text-gray-500"}`}>
                            {isRecording ? "Recording in progress..." : "Click microphone to start answering"}
                        </p>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button onClick={nextPart} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-sm font-bold border border-white/10">
                            {activePart < 2 ? "Skip to Next Part" : "Finish Test"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
