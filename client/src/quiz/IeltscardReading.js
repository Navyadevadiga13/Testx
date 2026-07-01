import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookReader } from "react-icons/fa";

function ReadingTestReady() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleStartTest = () => {
        navigate("/quiz/reading");
    };

    return (
        <>
            <style jsx>{`
                .reading-container {
                    min-height: 100vh;
                    background: #ffffff;
                    padding: 2rem;
                    padding-top: 100px;
                    color: #111;
                    font-family: -apple-system, BlinkMacSystemFont,
                        'Segoe UI', Roboto, sans-serif;
                }

                .content-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 3rem;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                    position: relative;
                }

                .main-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0 0 1rem 0;
                    color: #0a894e;
                    text-align: center;
                }

                .subtitle {
                    font-size: 1.2rem;
                    color: #666;
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #0a894e;
                    margin: 2rem 0 1rem 0;
                }

                .conditions-box {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 2rem;
                    border: 1px solid #d1fae5;
                    margin-bottom: 2rem;
                }

                .conditions-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .condition-item {
                    color: #333;
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
                    color: #0a894e;
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

                .start-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(25, 253, 145, 0.3);
                }

                .button-group {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    margin: 3rem auto;
                    flex-wrap: wrap;
                }

                .book-icon {
                    font-size: 1.2rem;
                }

                .divider-line {
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(25, 253, 145, 0.3),
                        transparent
                    );
                    margin: 2rem 0;
                }

                /* Test Details */
                .test-details {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                    margin-top: 2rem;
                }

                .detail-card {
                    background: #f9fafb;
                    border-radius: 10px;
                    padding: 1.5rem;
                    border: 1px solid #d1fae5;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .detail-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(25, 253, 145, 0.12);
                }

                .detail-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #19fd91;
                    margin-bottom: 0.5rem;
                }

                .detail-label {
                    color: #666;
                    font-size: 0.9rem;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .reading-container {
                        padding: 1rem;
                        padding-top: 80px;
                    }

                    .content-wrapper {
                        padding: 2rem;
                    }

                    .main-title {
                        font-size: 2rem;
                    }

                    .subtitle {
                        font-size: 1rem;
                    }

                    .section-title {
                        font-size: 1.3rem;
                    }

                    .test-details {
                        grid-template-columns: 1fr;
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
                        padding: 1rem;
                    }
                }
            `}</style>

            <div className="reading-container">
                <div className="content-wrapper">
                    {/* Main Title */}
                    <h1 className="main-title">
                        Reading Test Ready
                    </h1>

                    <p className="subtitle">
                        Prepare for your IELTS Reading assessment
                    </p>

                    {/* Exam Conditions Section */}
                    <h2 className="section-title">
                        Exam Conditions Active
                    </h2>

                    <div className="conditions-box">
                        <ul className="conditions-list">
                            <li className="condition-item">
                                3 reading passages with 40 questions
                            </li>

                            <li className="condition-item">
                                60 minutes total test duration
                            </li>

                            <li className="condition-item">
                                Texts range from descriptive to analytical
                            </li>

                            <li className="condition-item">
                                No extra time for transferring answers
                            </li>

                            <li className="condition-item">
                                Questions include multiple choice,
                                matching, and sentence completion
                            </li>

                            <li className="condition-item">
                                Test auto-submits when time expires
                            </li>
                        </ul>
                    </div>

                    {/* Test Details */}
                    <div className="test-details">
                        <div className="detail-card">
                            <div className="detail-number">
                                60
                            </div>

                            <div className="detail-label">
                                Minutes
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-number">
                                40
                            </div>

                            <div className="detail-label">
                                Questions
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-number">
                                3
                            </div>

                            <div className="detail-label">
                                Passages
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-number">
                                9.0
                            </div>

                            <div className="detail-label">
                                Max Band
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="button-group">
                        <button
                            className="start-button"
                            onClick={handleStartTest}
                        >
                            <FaBookReader className="book-icon" />
                            <span>Start Test</span>
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            style={{
                                background: "#19fd91",
                                color: "black",
                                border: "none",
                                padding: "1.2rem 3rem",
                                fontSize: "1.2rem",
                                fontWeight: "600",
                                borderRadius: "12px",
                                cursor: "pointer"
                            }}
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

export default ReadingTestReady;