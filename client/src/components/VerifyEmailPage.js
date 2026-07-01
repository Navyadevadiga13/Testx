// src/components/VerifyEmailPage.js
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import getApiBaseUrl from "../utils/api"; 

// ✅ Accept 'onLogin' prop
function VerifyEmailPage({ onLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email...");

  // ✅ USE ENV VARIABLE
  const API_URL =  getApiBaseUr();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    // Prevent double-firing in StrictMode
    let isMounted = true;

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (isMounted) {
          if (res.ok) {
            setStatus("success");
            setMessage("Email verified successfully! Logging you in...");
            
            // Save Token
            localStorage.setItem("token", data.token);
            
            // ✅ Notify App.js to update Header
            if (onLogin) onLogin();

            // Redirect to Profile after 2 seconds
            setTimeout(() => {
              navigate("/profile");
            }, 2000);
          } else {
            setStatus("error");
            setMessage(data.msg || "Verification failed.");
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setStatus("error");
          setMessage("Server error. Please try again.");
        }
      }
    };

    verifyToken();

    return () => { isMounted = false; };
  }, [token, navigate, onLogin, API_URL]);

  return (
    <div style={{ 
      minHeight: "80vh", display: "flex", flexDirection: "column", 
      justifyContent: "center", alignItems: "center", 
      background: "var(--bg-main)", color: "var(--text-main)", padding: "20px" 
    }}>
      <div style={{ 
        background: "var(--bg-card)", padding: "3rem", borderRadius: "16px", 
        textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "500px", width: "100%"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
          {status === "verifying" && "⏳"}
          {status === "success" && "✅"}
          {status === "error" && "❌"}
        </div>
        
        <h2 style={{ marginBottom: "1rem" }}>
          {status === "verifying" && "Verifying..."}
          {status === "success" && "Success!"}
          {status === "error" && "Error"}
        </h2>
        
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
          {message}
        </p>

        {status === "error" && (
           <Link to="/login" className="cta-btn">Back to Login</Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
