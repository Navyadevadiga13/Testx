import React from "react";

function LoginModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "#0009", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "var(--bg-card)", color: "var(--text-main)", padding: "2.3rem 2.1rem",
        borderRadius: 16, minWidth: 300, maxWidth: "90vw", boxShadow: "0 2px 32px #0007"
      }}>
        <h2 style={{ marginBottom: 20 }}>Login / Sign Up</h2>
        <input type="email" placeholder="Email" required style={{
          display: "block", marginBottom: 12, padding: ".8rem 1rem",
          borderRadius: 7, width: "100%", border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text-main)"
        }} />
        <input type="password" placeholder="Password" required style={{
          display: "block", marginBottom: 15, padding: ".8rem 1rem",
          borderRadius: 7, width: "100%", border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text-main)"
        }} />
        <button className="cta-btn" style={{ width: "100%" }}>Login</button>
        <div style={{ marginTop: 18, color: "var(--text-muted)", fontSize: ".93rem", textAlign: "center" }}>
          No account? <a href="#" style={{ color: "var(--accent)" }}>Sign Up</a>
        </div>
        <button style={{
          background: "none", color: "var(--accent)", border: "none",
          fontSize: "1.2rem", marginTop: 14, cursor: "pointer", display: "block", marginLeft: "auto", marginRight: "auto"
        }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
export default LoginModal;
