import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPenAlt } from "react-icons/fa";

function WritingTestReady() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleStartTest = () => {
        navigate("/quiz/writing");
    };

    return (
        <>
            <style jsx>{`
                .writing-container {
                    min-height: 100vh;
                    padding: 2rem;
                    padding-top: 140px;
                    background: #ffffff;
                }

                .content-wrapper {
                    max-width: 900px;
                    width: 100%;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 2rem;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    position: relative;
                }

                .main-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0 0 1rem 0;
                    color: #166534;
                    text-align: center;
                }

                .exam-title {
                    text-align: center;
                    color: #15803d;
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .subtitle {
                    font-size: 1.2rem;
                    color: #4b5563;
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #166534;
                    margin: 2rem 0 1rem 0;
                }

                .conditions-box {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 2rem;
                    border: 1px solid #d1d5db;
                    margin-bottom: 2rem;
                }

                .conditions-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .condition-item {
                    color: #374151;
                    padding: 0.8rem 0;
                    font-size: 1.1rem;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                }

                .condition-item:last-child {
                    border-bottom: none;
                }

                .condition-item::before {
                    content: "•";
                    color: #16a34a;
                    font-size: 1.5rem;
                    margin-right: 1rem;
                    font-weight: bold;
                }

                .start-button {
                    background: #19fd91;
                    color: #000;
                    border: none;
                    padding: 1.2rem 3rem;
                    font-size: 1.2rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    margin: 0;
                    transition: all 0.3s ease;
                    width: fit-content;
                }

                .button-group {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    margin: 3rem auto;
                    flex-wrap: wrap;
                }

                .start-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(25, 253, 145, 0.3);
                }

                .exit-button {
                    background: #ffffff;
                    color: #374151;
                    border: 1px solid #d1d5db;
                    padding: 1.2rem 3rem;
                    font-size: 1.2rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .exit-button:hover {
                    background: #f3f4f6;
                    transform: translateY(-2px);
                }

                .pen-icon {
                    font-size: 1.2rem;
                }

                .divider-line {
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(22, 101, 52, 0.3),
                        transparent
                    );
                    margin: 2rem 0;
                }

                /* Test Details */
                .test-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .detail-card {
                    background: #f9fafb;
                    border-radius: 10px;
                    padding: 1.5rem;
                    border: 1px solid #d1d5db;
                    text-align: center;
                }

                .detail-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #166534;
                    margin-bottom: 0.5rem;
                }

                .detail-label {
                    color: #6b7280;
                    font-size: 0.9rem;
                }

                /* Tasks Section */
                .tasks-section {
                    background: #f9fafb;
                    border-radius: 10px;
                    padding: 1.5rem;
                    margin: 2rem 0;
                    border: 1px solid #d1d5db;
                }

                .task-item {
                    margin: 1.5rem 0;
                }

                .task-title {
                    color: #166534;
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }

                .task-details {
                    color: #374151;
                    margin: 0.3rem 0;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                }

                .task-details::before {
                    content: "▸";
                    color: #16a34a;
                    margin-right: 0.8rem;
                    font-weight: bold;
                }

                /* Word Count Indicator */
                .word-count-info {
                    background: #ecfdf5;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-top: 1rem;
                    text-align: center;
                    border: 1px solid #bbf7d0;
                }

                .word-count-text {
                    color: #374151;
                    font-size: 1rem;
                }

                .word-count-highlight {
                    color: #166534;
                    font-weight: 600;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .writing-container {
                        padding: 1rem;
                        padding-top: 80px;
                    }

                    .content-wrapper {
                        padding: 1.5rem;
                    }

                    .main-title {
                        font-size: 1.9rem;
                    }

                    .subtitle {
                        font-size: 0.95rem;
                        margin-bottom: 2rem;
                    }

                    .section-title {
                        font-size: 1.2rem;
                    }

                    .button-group {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .start-button,
                    .exit-button {
                        width: 100%;
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .content-wrapper {
                        padding: 1.5rem;
                    }

                    .main-title {
                        font-size: 1.8rem;
                    }

                    .condition-item {
                        font-size: 1rem;
                    }

                    .start-button {
                        width: 100%;
                    }
                }
            `}</style>

            <div className="writing-container">
                <div className="content-wrapper">
                    {/* Main Title */}
                    <h1 className="main-title">
                        Writing Test Ready
                    </h1>

                    <h2 className="exam-title">
                        IELTS Academic Writing
                    </h2>

                    <p className="subtitle">
                        Prepare for your IELTS Writing assessment
                    </p>

                    {/* Exam Conditions Section */}
                    <h2 className="section-title">Exam Conditions Active</h2>

                    <div className="conditions-box">
                        <ul className="conditions-list">
                            <li className="condition-item">
                                2 writing tasks to complete in 60 minutes
                            </li>

                            <li className="condition-item">
                                Task 1: Describe visual information (20 minutes)
                            </li>

                            <li className="condition-item">
                                Task 2: Essay writing (40 minutes)
                            </li>

                            <li className="condition-item">
                                Word count monitoring enabled
                            </li>

                            <li className="condition-item">
                                Spell check and grammar suggestions disabled
                            </li>

                            <li className="condition-item">
                                Auto-submit when time expires
                            </li>
                        </ul>
                    </div>

                    {/* Test Details */}
                    <div className="test-details">
                        <div className="detail-card">
                            <div className="detail-number">60</div>
                            <div className="detail-label">Minutes Total</div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-number">2</div>
                            <div className="detail-label">Tasks</div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-number">300</div>
                            <div className="detail-label">Min Words</div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-number">9.0</div>
                            <div className="detail-label">Max Band</div>
                        </div>
                    </div>

                    {/* Tasks Breakdown */}
                    <div className="tasks-section">
                        <div className="task-item">
                            <div className="task-title">
                                Task 1: Academic/General Training
                            </div>

                            <div className="task-details">
                                Describe visual information (chart, graph, diagram)
                            </div>

                            <div className="task-details">
                                Minimum 150 words
                            </div>

                            <div className="task-details">
                                Recommended time: 20 minutes
                            </div>
                        </div>

                        <div className="task-item">
                            <div className="task-title">
                                Task 2: Essay Writing
                            </div>

                            <div className="task-details">
                                Respond to a point of view, argument, or problem
                            </div>

                            <div className="task-details">
                                Minimum 250 words
                            </div>

                            <div className="task-details">
                                Recommended time: 40 minutes
                            </div>
                        </div>

                        <div className="word-count-info">
                            <div className="word-count-text">
                                Total minimum words:
                                <span className="word-count-highlight">
                                    {" "}300+
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Start Test and Exit Buttons */}
                    <div className="button-group">
                        <button
                            className="start-button"
                            onClick={handleStartTest}
                        >
                            <FaPenAlt className="pen-icon" />
                            <span>Start Test</span>
                        </button>

                        <button
                            className="exit-button"
                            onClick={() => navigate("/")}
                        >
                            Exit Module
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="divider-line"></div>
                </div>
            </div>
        </>
    );
}

export default WritingTestReady;