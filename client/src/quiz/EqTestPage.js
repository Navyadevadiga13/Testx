import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

function EqTestPage() {
    const navigate = useNavigate();
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
    return (
        <>
            <style jsx>{`
        .iq-test-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a140f 0%, #111c17 100%);
            padding: 2rem;
            padding-top: 100px;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .content-wrapper {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(17, 28, 23, 0.7);
            border-radius: 20px;
            padding: 3rem;
            border: 1px solid rgba(25, 253, 145, 0.1);
            backdrop-filter: blur(10px);
            position: relative;
        }

        .main-title {
            font-size: 2.5rem;
            font-weight: 800;
            margin: 0 0 1rem 0;
            color: #19fd91;
            text-align: center;
        }

        .subtitle {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #19fd91;
            margin: 2rem 0 1rem 0;
        }

        .conditions-box {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 2rem;
            border: 1px solid rgba(25, 253, 145, 0.2);
            margin-bottom: 2rem;
        }

        .conditions-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .condition-item {
            color: rgba(255, 255, 255, 0.9);
            padding: 0.8rem 0;
            font-size: 1.1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: flex-start;
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
            line-height: 1;
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
        }

        .exit-button {
            background: transparent;
            color: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 1.2rem 3rem;
            font-size: 1.2rem;
            font-weight: 600;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .exit-button:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-color: white;
            transform: translateY(-2px);
        }

        .play-icon {
            font-size: 1.2rem;
        }

        .divider-line {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(25, 253, 145, 0.3), transparent);
            margin: 2rem 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .iq-test-container {
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
      `}</style>

            <div className="iq-test-container">
                <div className="content-wrapper">
                    <h1 className="main-title">Ready to start the EQ test?</h1>
                    <p className="subtitle">Assess your emotional intelligence with our comprehensive test.</p>

                    <h2 className="section-title">Test Instructions</h2>
                    <div className="conditions-box">
                        <ul className="conditions-list">
                            <li className="condition-item">
                                This assessment contains 20 statements related to emotional intelligence.
                            </li>
                            <li className="condition-item">
                                Choose the response that best describes your feelings or actions in each scenario.
                            </li>
                            <li className="condition-item">
                                There are no right or wrong answers — respond honestly to get an accurate result.
                            </li>
                        </ul>
                    </div>

                    <div className="button-group">
                        <button
                            className="start-button"
                            onClick={() => navigate("/quiz/eq-test")}
                        >
                            <FaPlay className="play-icon" />
                            <span>Start the EQ test</span>
                        </button>
                        <button className="exit-button" onClick={() => navigate("/tests")}>
                            Exit
                        </button>
                    </div>

                    <div className="divider-line"></div>
                </div>
            </div>
        </>
    );
}

export default EqTestPage;
