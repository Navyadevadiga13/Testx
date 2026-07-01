import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

const writingTasks = [
    {
        id: "integrated",
        title: "Integrated Writing Task",
        time: 1200,
        minWords: 150,

        reading: `Many environmental scientists believe that urban green spaces are essential for improving the quality of life in large cities. Green spaces include public parks, gardens, tree-lined streets, and natural reserves within urban areas.

First, green spaces offer recreational opportunities for city residents. Parks and gardens allow individuals to relax and exercise outdoors.

Second, urban vegetation can improve environmental conditions. Trees absorb carbon dioxide and release oxygen.

Finally, green spaces can help manage rainwater and reduce the risk of flooding.`,

        lecture: `Okay, so the reading passage suggests that urban green spaces provide several benefits for cities. However, the professor explains that these advantages may actually be overstated.

First, many parks are crowded and noisy, so they do not always improve mental health.

Second, cities have far fewer trees compared to the pollution created by vehicles and factories.

Finally, modern cities rely on advanced drainage systems to prevent flooding.`,

        prompt: "Summarize the points made in the lecture and explain how they challenge the reading passage."
    },

    {
        id: "discussion",
        title: "Academic Discussion",
        time: 600,
        minWords: 120,
        prompt: "Do you agree or disagree with the following statement?\n\nOnline education is better than traditional classroom education.\n\nUse reasons and examples to support your answer."
    }
];

function ToeflWriting() {

    const navigate = useNavigate();
    const API_URL = getApiBaseUrl();

    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(writingTasks[0].time);

    const currentTask = writingTasks[currentTaskIndex];
    const isLastTask = currentTaskIndex === writingTasks.length - 1;

    const playLecture = (text) => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            return;
        }
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 0.9;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    };

    const pauseLecture = () => {
        window.speechSynthesis.pause();
    };

    useEffect(() => {
        setTimeLeft(currentTask.time);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentTaskIndex]);
    // Add this useEffect for initial scroll (place it after your existing useEffects)
useEffect(() => {
    window.scrollTo(0, 0);
}, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" + s : s}`;
    };

    const handleInputChange = (value) => {
        setAnswers(prev => ({
            ...prev,
            [currentTask.id]: value
        }));
    };

    const handleNext = () => {
        window.speechSynthesis.cancel();
        if (currentTaskIndex < writingTasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        window.speechSynthesis.cancel();
        if (currentTaskIndex > 0) {
            setCurrentTaskIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const wordCount = (answers[currentTask.id] || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    const saveTestResult = async (result) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            await fetch(`${API_URL}/tests/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    testName: "TOEFL Writing",
                    result: result
                })
            });
        } catch (err) {
            console.error(err);
        }
    };

    const calculateTotalScore = () => {
        window.speechSynthesis.cancel();
        let completed = 0;
        writingTasks.forEach(task => {
            const words = (answers[task.id] || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean).length;
            if (words >= task.minWords) completed++;
        });
        const total = writingTasks.length;
        const percentage = Math.round((completed / total) * 100);
        let toeflScore = 15;
        if (percentage === 100) toeflScore = 30;
        else if (percentage >= 75) toeflScore = 24;
        else if (percentage >= 50) toeflScore = 20;
        const resultPayload = { rawScore: completed, total, percentage, toeflScore };
        saveTestResult(resultPayload);
        navigate("/quiz/toefl/result", {
            state: { correctCount: completed, total, toeflScore, testType: "Writing" }
        });
    };

    return (
        <div style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "100px 20px",
            minHeight: "100vh",
            background: "#ffffff",
            color: "#111111"
        }}>

            {/* Title */}
            <h1 style={{
                textAlign: "center",
                color: "#1a5c3a",
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "1.5rem"
            }}>
                TOEFL Writing
            </h1>

            {/* Task Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
                {writingTasks.map((task, index) => (
                    <div
                        key={task.id}
                        style={{
                            padding: "8px 20px",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            background: index === currentTaskIndex ? "#2e7d52" : "transparent",
                            color: index === currentTaskIndex ? "#ffffff" : "#2e7d52",
                            border: `2px solid ${index === currentTaskIndex ? "#2e7d52" : "#a8d5b5"}`,
                            cursor: "default"
                        }}
                    >
                        Task {index + 1}
                    </div>
                ))}
            </div>

            {/* Top Bar: task counter, timer, word count */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.2rem",
                padding: "10px 16px",
                background: "#f4faf7",
                borderRadius: "8px",
                border: "1px solid #c8e6d4"
            }}>
                <div style={{ color: "#333", fontWeight: "500" }}>
                    Task {currentTaskIndex + 1} of {writingTasks.length}
                </div>
                <div style={{
                    color: "#1a5c3a",
                    fontWeight: "700",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                }}>
                    ⏱ Time Remaining: {formatTime(timeLeft)}
                </div>
                <div style={{ color: "#333", fontWeight: "500" }}>
                    Words: {wordCount} / {currentTask.minWords}
                </div>
            </div>

            {/* Reading + Lecture Panel (Integrated Task) */}
            {currentTask.reading && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem"
                }}>
                    {/* Reading Passage */}
                    <div style={{
                        background: "#f9fefb",
                        padding: "1.5rem",
                        borderRadius: "10px",
                        border: "1px solid #c8e6d4",
                        maxHeight: "300px",
                        overflowY: "auto"
                    }}>
                        <h3 style={{ color: "#1a5c3a", marginBottom: "0.8rem" }}>Reading Passage</h3>
                        <p style={{ lineHeight: "1.7", color: "#222" }}>{currentTask.reading}</p>
                    </div>

                    {/* Lecture Audio */}
                    <div style={{
                        background: "#f9fefb",
                        padding: "1.5rem",
                        borderRadius: "10px",
                        border: "1px solid #c8e6d4"
                    }}>
                        <h3 style={{ color: "#1a5c3a", marginBottom: "0.8rem" }}>Lecture Audio</h3>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => playLecture(currentTask.lecture)}
                                style={{
                                    padding: "8px 18px",
                                    background: "#2e7d52",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                ▶ Play
                            </button>
                            <button
                                onClick={pauseLecture}
                                style={{
                                    padding: "8px 18px",
                                    background: "#f0a500",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                ⏸ Pause
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Prompt */}
            <div style={{
                background: "#f9fefb",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid #c8e6d4",
                marginBottom: "1rem"
            }}>
                <h3 style={{ color: "#1a5c3a", marginBottom: "0.5rem" }}>
                    {currentTask.title} {currentTask.reading ? "(20 min)" : "(10 min)"}
                </h3>
                <p style={{ whiteSpace: "pre-wrap", color: "#222", lineHeight: "1.7" }}>
                    {currentTask.prompt}
                </p>
            </div>

            {/* Word count hint */}
            <div style={{ marginBottom: "6px", fontSize: "0.85rem", color: "#555" }}>
                Words: {wordCount} / {currentTask.minWords}
                {wordCount < currentTask.minWords && (
                    <span style={{ color: "#c0392b", marginLeft: "8px" }}>
                        Recommended minimum: {currentTask.minWords} words
                    </span>
                )}
            </div>

            {/* Textarea */}
            <textarea
                rows="12"
                value={answers[currentTask.id] || ""}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Type your response here..."
                style={{
                    width: "100%",
                    padding: "1rem",
                    background: "#ffffff",
                    border: "1px solid #b2d8c2",
                    borderRadius: "8px",
                    color: "#111",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box"
                }}
            />

            {/* Navigation Buttons */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "2rem"
            }}>
                <button
                    onClick={handlePrev}
                    disabled={currentTaskIndex === 0}
                    style={{
                        padding: "10px 28px",
                        background: currentTaskIndex === 0 ? "#d0e8da" : "#2e7d52",
                        color: currentTaskIndex === 0 ? "#888" : "#fff",
                        border: "none",
                        borderRadius: "30px",
                        fontWeight: "bold",
                        cursor: currentTaskIndex === 0 ? "not-allowed" : "pointer",
                        fontSize: "0.95rem"
                    }}
                >
                    Previous
                </button>

                {!isLastTask ? (
                    <button
                        onClick={handleNext}
                        style={{
                            padding: "10px 28px",
                            background: "#2e7d52",
                            color: "#fff",
                            border: "none",
                            borderRadius: "30px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.95rem"
                        }}
                    >
                        Next Task →
                    </button>
                ) : (
                    <button
                        onClick={calculateTotalScore}
                        style={{
                            padding: "10px 28px",
                            background: "#2e7d52",
                            color: "#fff",
                            border: "none",
                            borderRadius: "30px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.95rem"
                        }}
                    >
                        Finish & Submit ✓
                    </button>
                )}
            </div>

        </div>
    );
}

export default ToeflWriting;