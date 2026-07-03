import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPenFancy, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

const ToeflWritingInstructions = () => {
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
                        <FaPenFancy />
                    </div>

                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: "700",
                            marginBottom: "1rem",
                            color: "#111827",
                        }}
                    >
                        TOEFL Writing Test
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "1.1rem",
                            maxWidth: "600px",
                            margin: "0 auto",
                            lineHeight: "1.6",
                        }}
                    >
                        In this section, you will write an essay to demonstrate your ability to organize and express ideas clearly in written English.
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
                            You will have <strong>30 minutes</strong> to complete one essay-writing task.
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
                                Task
                            </h3>
                        </div>

                        <p style={{ color: "#4b5563", margin: 0, lineHeight: "1.6" }}>
                            You will complete one essay-writing task that evaluates your ability to organize ideas, support arguments, and use English effectively.
                        </p>
                    </div>
                </div>

                {/* Task Table */}
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "20px",
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        marginBottom: "3rem",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            color: "#4b5563",
                        }}
                    >
                        <thead>
                            <tr style={{ background: "#f9fafb" }}>
                                <th
                                    style={{
                                        padding: "1.2rem",
                                        textAlign: "left",
                                        color: "#111827",
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
                                >
                                    Task
                                </th>

                                <th
                                    style={{
                                        padding: "1.2rem",
                                        textAlign: "left",
                                        color: "#111827",
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
                                >
                                    Description
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        padding: "1.2rem",
                                        borderBottom: "1px solid #e5e7eb",
                                        fontWeight: "600",
                                        color: "#111827",
                                    }}
                                >
                                    Essay Writing
                                </td>

                                <td
                                    style={{
                                        padding: "1.2rem",
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
                                >
                                    Write an essay on the assigned topic. Support your ideas with relevant reasons, examples, and details. Recommended length: <strong>250–300 words</strong>.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Start Button */}
                <div style={{ textAlign: "center" }}>
                    <button
                        onClick={() => navigate("/quiz/toefl/writing")}
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
                            transition: "transform 0.2s",
                            boxShadow: "0 4px 15px rgba(25, 253, 145, 0.25)",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                    >
                        Start Writing Test <FaArrowRight />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ToeflWritingInstructions;