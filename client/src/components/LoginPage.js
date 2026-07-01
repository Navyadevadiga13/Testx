// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import getApiBaseUrl from "../utils/api";

// function LoginPage({ onSuccess }) {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const API_URL = getApiBaseUrl();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const formData = new FormData(e.target);
//     const payload = Object.fromEntries(formData.entries());

//     try {
//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: payload.email,
//           password: payload.password
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // ✅ Save token
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         if (onSuccess && typeof onSuccess === "function") {
//           onSuccess();
//         }

//         navigate("/");
//       } else {
//         const msg = data.errors ? data.errors[0].msg : data.msg;
//         setError(msg || "Invalid credentials");
//       }

//     } catch (err) {
//       console.error(err);
//       setError("Server connection error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="login-signup-container">
//       <form className="auth-form-box" onSubmit={handleSubmit}>
//         <h2 className="form-title">Welcome Back</h2>
//         <div className="auth-subtitle">Sign in to continue your journey.</div>

//         {error && (
//           <div style={{
//             background: "#ff525220",
//             border: "1px solid #ff5252",
//             color: "#ff5252",
//             padding: "10px",
//             borderRadius: "8px",
//             marginBottom: "15px",
//             fontSize: "0.9rem",
//             textAlign: "center"
//           }}>
//             {error}
//           </div>
//         )}

//         <div className="form-group">
//           <label className="form-label">Email Address</label>
//           <input
//             className="form-input"
//             required
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//           />
//         </div>

//         <div className="form-group">
//           <label className="form-label">Password</label>
//           <div className="input-eye-wrap">
//             <input
//               className="form-input"
//               required
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Enter your password"
//             />
//             <button
//               type="button"
//               className="eye-btn"
//               onClick={() => setShowPassword(v => !v)}
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </button>
//           </div>
//         </div>

//         <button className="cta-btn" type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Log In"}
//         </button>

//         <div className="auth-alt-row">
//           Don’t have an account?{" "}
//           <Link to="/signup" style={{ color: "var(--accent)", textDecoration: "none" }}>
//             Sign Up
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default LoginPage;



import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

function LoginPage({ onSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Forgot Password States
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const API_URL = getApiBaseUrl();

  // ✅ LOGIN
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        }

        navigate("/");
      } else {
        const msg = data.errors ? data.errors[0].msg : data.msg;
        setError(msg || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ GENERATE OTP
  const handleGenerateOtp = async (email) => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.msg || "OTP sent");
      setOtpSent(true);
    } else {
      alert(data.msg || "Failed to send OTP");
    }
  };

  // ✅ RESET PASSWORD
  const handleResetPassword = async (email, otp, password) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        newPassword: password   // ✅ IMPORTANT
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.msg || "Password reset successful");
      setForgotMode(false);
      setOtpSent(false);
    } else {
      alert(data.msg || "Failed");
    }
  };

  return (
    <div className="login-signup-container">
      <form
        className="auth-form-box"
        onSubmit={(e) => {
          if (!forgotMode) return handleSubmit(e);

          e.preventDefault();

          const formData = new FormData(e.target);
          const email = formData.get("email");
          const otp = formData.get("otp");
          const password = formData.get("newPassword");
          const confirm = formData.get("confirmPassword");

          // Step 1: Generate OTP
          if (!otpSent) return handleGenerateOtp(email);

          // Step 2: Reset password
          if (password !== confirm) {
            alert("Passwords do not match");
            return;
          }

          return handleResetPassword(email, otp, password);
        }}
      >
        <h2 className="form-title">
          {forgotMode ? "Reset Password" : "Welcome Back"}
        </h2>

        <div className="auth-subtitle">
          {forgotMode
            ? "Recover your account using OTP"
            : "Sign in to continue your journey."}
        </div>

        {error && (
          <div style={{
            background: "#ff525220",
            border: "1px solid #ff5252",
            color: "#ff5252",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            required
            type="email"
            name="email"
            placeholder="Enter your email"
          />
        </div>

        {/* PASSWORD (LOGIN ONLY) */}
        {!forgotMode && (
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-eye-wrap">
              <input
                className="form-input"
                required
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        )}

        {/* OTP + PASSWORD FIELDS */}
        {forgotMode && otpSent && (
          <>
            <input className="form-input" name="otp" placeholder="Enter OTP" required />
            <input className="form-input" name="newPassword" type="password" placeholder="New Password" required />
            <input className="form-input" name="confirmPassword" type="password" placeholder="Confirm Password" required />
          </>
        )}

        {/* FORGOT PASSWORD LINK */}
        {!forgotMode && (
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <span
              style={{ color: "var(--accent)", cursor: "pointer" }}
              onClick={() => setForgotMode(true)}
            >
              Forgot Password?
            </span>
          </div>
        )}

        {/* BUTTON */}
        <button className="cta-btn" type="submit" disabled={loading}>
          {!forgotMode
            ? (loading ? "Logging in..." : "Log In")
            : (!otpSent ? "Generate OTP" : "Reset Password")}
        </button>

        {/* BACK TO LOGIN */}
        {forgotMode && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <span
              style={{ cursor: "pointer", color: "var(--accent)" }}
              onClick={() => {
                setForgotMode(false);
                setOtpSent(false);
              }}
            >
              Back to Login
            </span>
          </div>
        )}

        <div className="auth-alt-row">
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "var(--accent)", textDecoration: "none" }}>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage; 