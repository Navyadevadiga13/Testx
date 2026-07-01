import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

const ToeflReadingInstructions = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#ffffff",
                color: "#111827",
                padding: "100px 20px 40px",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            background: "#ecfdf5",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.5rem",
                            border: "1px solid #d1fae5",
                            color: "#19fd91",
                            fontSize: "2.5rem",
                        }}
                    >
                        <FaBookOpen />
                    </div>

                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: "700",
                            marginBottom: "1rem",
                            color: "#111827",
                        }}
                    >
                        Reading Section
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "1.1rem",
                            maxWidth: "600px",
                            margin: "0 auto",
                            lineHeight: "1.7",
                        }}
                    >
                        In this section, you will read academic passages and answer multiple-choice questions.
                    </p>
                </div>

                {/* Info Cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "1.5rem",
                        marginBottom: "3rem",
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            padding: "1.5rem",
                            borderRadius: "16px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                marginBottom: "1rem",
                                color: "#19fd91",
                            }}
                        >
                            <FaClock size={24} />
                            <h3 style={{ margin: 0, color: "#111827" }}>
                                Time Limit
                            </h3>
                        </div>

                        <p style={{ color: "#4b5563", margin: 0, lineHeight: "1.6" }}>
                            You have <strong>40 minutes</strong> to complete all{" "}
                            <strong>25 questions</strong>.
                        </p>
                    </div>

                    <div
                        style={{
                            background: "#ffffff",
                            padding: "1.5rem",
                            borderRadius: "16px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                marginBottom: "1rem",
                                color: "#19fd91",
                            }}
                        >
                            <FaCheckCircle size={24} />
                            <h3 style={{ margin: 0, color: "#111827" }}>
                                Format
                            </h3>
                        </div>

                        <p style={{ color: "#4b5563", margin: 0, lineHeight: "1.6" }}>
                            <strong>5 academic passages</strong> ·{" "}
                            <strong>5 questions each</strong> · all multiple choice.
                        </p>
                    </div>
                </div>

                {/* What to Expect */}
                <div
                    style={{
                        background: "#f9fafb",
                        borderRadius: "20px",
                        border: "1px solid #e5e7eb",
                        padding: "2rem",
                        marginBottom: "3rem",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                    }}
                >
                    <h3
                        style={{
                            color: "#166534",
                            marginBottom: "1.5rem",
                            fontSize: "1.4rem",
                        }}
                    >
                        About the PBT Reading Section
                    </h3>

                    <ul
                        style={{
                            color: "#4b5563",
                            lineHeight: "1.9",
                            paddingLeft: "1.2rem",
                            margin: 0,
                        }}
                    >
                        <li>
                            All passages are academic in nature – topics may
                            include science, history, social studies, and the arts.
                        </li>

                        <li>
                            Each passage is followed by five multiple-choice
                            questions. You may answer them in any order within
                            that passage.
                        </li>

                        <li>
                            All information needed to answer the questions is
                            contained in the passage – no outside knowledge is
                            required.
                        </li>

                        <li>
                            There is no penalty for guessing, so it is to your
                            advantage to answer every question.
                        </li>

                        <li>
                            You can move between passages using the Previous and
                            Next buttons before finishing the test.
                        </li>
                    </ul>
                </div>

                {/* Start Button */}
                <div style={{ textAlign: "center" }}>
                    <button
                        onClick={() => navigate("/quiz/toefl/reading")}
                        style={{
                            background: "#19fd91",
                            color: "#000",
                            border: "none",
                            padding: "1rem 3rem",
                            fontSize: "1.2rem",
                            fontWeight: "700",
                            borderRadius: "50px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 15px rgba(25, 253, 145, 0.25)",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                    >
                        Start Reading Test <FaArrowRight />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ToeflReadingInstructions;