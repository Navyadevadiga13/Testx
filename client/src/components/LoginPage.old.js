import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ onSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const username = data.get("username");
    const password = data.get("password");
    if (username === "test" && password === "test") {
      onSuccess();
      navigate("/");
    } else {
      setError("Invalid username or password (try: test/test)");
    }
  }

  return (
    <div className="login-signup-container">
      <form className="auth-form-box" onSubmit={handleSubmit}>
        <h2 className="form-title">Welcome Back</h2>
        <div className="auth-subtitle">Sign in to continue your journey.</div>
        {error && <div style={{ color: "#ff5252", marginBottom: 12, fontWeight: 500 }}>{error}</div>}
        <div className="form-group">
          <label className="form-label">Username or Email</label>
          <input
            className="form-input"
            required
            placeholder="Enter your username or email"
            autoComplete="username"
            type="text"
            name="username"
          />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Password</span>
            <a href="#" style={{ color: "var(--accent)", fontWeight: 500, fontSize: ".93rem", textDecoration: "none" }}>Forgot Password?</a>
          </label>
          <div className="input-eye-wrap">
            <input
              className="form-input"
              required
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              name="password"
            />
            <button
              type="button"
              className="eye-btn"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <button className="cta-btn" type="submit">
          Log In
        </button>
        <div className="auth-alt-row">
          Don’t have an account?&nbsp;
          <a href="#" onClick={e => { e.preventDefault(); navigate("/signup"); }}>Sign Up</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
