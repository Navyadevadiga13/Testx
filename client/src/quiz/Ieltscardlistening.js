import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

function ListeningTestReady() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleStartTest = () => {
        navigate("/quiz/listening");
    };

    return (
        <>
            <style jsx>{`
                .listening-container {
                    min-height: 100vh;
                    background: #ffffff; /* White Background */
                    padding: 2rem;
                    padding-top: 100px;
                    color: #111;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .content-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 3rem;
                    border: 1px solid #e5e5e5;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
                    color: #555;
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
                    background: #f9f9f9;
                    border-radius: 12px;
                    padding: 2rem;
                    border: 1px solid #dcdcdc;
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
                    border-bottom: 1px solid #eaeaea;
                    display: flex;
                    align-items: center;
                }

                .condition-item:last-child {
                    border-bottom: none;
                }

                .condition-item::before {
                    content: "•";
                    color: #19fd91;
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
                    transition: all 0.3s ease;
                    width: fit-content;
                }

                .start-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(16, 142, 83, 0.3);
                }

                .button-group {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    margin: 3rem auto;
                    flex-wrap: wrap;
                }

                .exit-button {
                    background: transparent;
                    color: #333;
                    border: 1px solid #ccc;
                    padding: 1.2rem 3rem;
                    font-size: 1.2rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .exit-button:hover {
                    background: #f5f5f5;
                    border-color: #999;
                    transform: translateY(-2px);
                }

                .play-icon {
                    font-size: 1.2rem;
                }

                .divider-line {
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(14, 103, 61, 0.4),
                        transparent
                    );
                    margin: 2rem 0;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .listening-container {
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

                    .start-button,
                    .exit-button {
                        width: 100%;
                        padding: 1rem;
                    }
                }
            `}</style>

            <div className="listening-container">
                <div className="content-wrapper">
                    {/* Main Title */}
                    <h1 className="main-title">Listening Test Ready</h1>

                    <p className="subtitle">
                        Select a specific module to begin your analysis.
                    </p>

                    {/* Exam Conditions Section */}
                    <h2 className="section-title">Exam Conditions Active</h2>

                    <div className="conditions-box">
                        <ul className="conditions-list">
                            <li className="condition-item">
                                The audio will play once only.
                            </li>

                            <li className="condition-item">
                                You cannot pause or replay the track.
                            </li>

                            <li className="condition-item">
                                The test will auto-submit after 30 minutes.
                            </li>

                            <li className="condition-item">
                                Answer questions as you listen.
                            </li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="button-group">
                        <button
                            className="start-button"
                            onClick={handleStartTest}
                        >
                            <FaPlay className="play-icon" />
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

export default ListeningTestReady;