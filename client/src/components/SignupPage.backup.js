import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage({ onSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSuccess();
    navigate("/");
  }

  return (
    <div className="login-signup-container">
      <form className="auth-form-box" onSubmit={handleSubmit}>
        <h2 className="form-title">Create Your Account</h2>
        <div className="auth-subtitle">Begin your journey of self-discovery.</div>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" required type="text" placeholder="Enter your full name" autoComplete="name" name="fullname" />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" required type="email" placeholder="Enter your email address" autoComplete="email" name="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-eye-wrap">
            <input
              className="form-input"
              required
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
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
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="input-eye-wrap">
            <input
              className="form-input"
              required
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              name="confirm"
            />
            <button
              type="button"
              className="eye-btn"
              tabIndex={-1}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirm(v => !v)}
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <div className="form-group checkbox-row" style={{ margin: "14px 0", alignItems: "flex-start" }}>
          <input type="checkbox" required style={{ margin: "3px 8px 0 0", flexShrink: 0 }} id="tos-check" />
          <label htmlFor="tos-check" style={{ fontSize: ".99rem", color: "var(--text-main)", cursor: "pointer", lineHeight: "1.6", margin: 0 }}>
            I agree to the&nbsp;
            <a href="#" style={{ color: "var(--accent)" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={{ color: "var(--accent)" }}>Privacy Policy</a>.
          </label>
        </div>
        <button className="cta-btn" type="submit">
          Create Account
        </button>
        <div className="auth-alt-row" style={{ marginTop: 17 }}>
          Already have an account?&nbsp;
          <a href="#" onClick={e => { e.preventDefault(); navigate("/login"); }}>Log In</a>
        </div>
      </form>
    </div>
  );
}
export default SignupPage;
