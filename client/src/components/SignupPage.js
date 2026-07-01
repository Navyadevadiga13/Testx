

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import getApiBaseUrl from "../utils/api";

// const API_URL = getApiBaseUrl();

// function SignupPage() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData(e.target);
//     const payload = Object.fromEntries(formData.entries());

//     if (payload.password !== payload.confirm) {
//       alert("Passwords do not match!");
//       setLoading(false);
//       return;
//     }

//     if (payload.phone.length !== 10) {
//       alert("Phone number must be 10 digits");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fullname: payload.fullname,
//           phone: payload.phone,
//           email: payload.email,
//           password: payload.password
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         alert("Account created successfully!");
//         navigate("/");
//       } else {
//         const msg = data.errors ? data.errors[0].msg : data.msg;
//         alert(msg || "Signup failed");
//       }

//     } catch (err) {
//       console.error("Connection Error:", err);
//       alert("Could not connect to server.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* -------------------- STYLES -------------------- */

// const containerStyle = {
//   minHeight: "calc(100vh - 80px)", // subtract navbar height
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   background: "var(--bg-main)",
//   paddingTop: "120px" // pushes form slightly downward
// };

//   const formBoxStyle = {
//     width: "100%",
//     maxWidth: "480px",
//     background: "var(--bg-card)",
//     color: "var(--text-main)",
//     borderRadius: "16px",
//     boxShadow: "0 9px 40px rgba(17,28,23,0.3)",
//     padding: "2.7rem 2rem"
//   };

//   const formGroupStyle = {
//     marginBottom: "1.09rem",
//     display: "flex",
//     flexDirection: "column",
//     width: "100%"
//   };

//   const labelStyle = {
//     fontWeight: "600",
//     fontSize: "1rem",
//     marginBottom: "4px",
//     textAlign: "left"
//   };

//   const inputStyle = {
//     width: "100%",
//     background: "var(--input-bg)",
//     color: "var(--text-main)",
//     border: "1.3px solid var(--input-border)",
//     borderRadius: "7px",
//     padding: ".85rem 1rem",
//     fontSize: "1rem"
//   };

//   const buttonStyle = {
//     width: "100%",
//     fontWeight: "600",
//     fontSize: "1.11rem",
//     borderRadius: "9px",
//     marginTop: "14px",
//     padding: "1rem",
//     border: "none",
//     background: "var(--btn-bg)",
//     color: "var(--btn-text)",
//     cursor: "pointer"
//   };

//   const rowStyle = {
//     display: "flex",
//     gap: "16px"
//   };

//   const inputWrapStyle = {
//     position: "relative",
//     display: "flex",
//     alignItems: "center"
//   };

//   const eyeBtnStyle = {
//     position: "absolute",
//     right: "13px",
//     top: "50%",
//     transform: "translateY(-50%)",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "1.2rem"
//   };

//   /* ------------------------------------------------ */

//   return (
//     <div style={containerStyle}>
//       <form style={formBoxStyle} onSubmit={handleSubmit}>
//         <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "6px" }}>
//           Create Your Account
//         </h2>

//         <div style={{ textAlign: "center", marginBottom: "24px" }}>
//           Begin your journey of self-discovery.
//         </div>

//         {/* Full Name + Phone Row */}
//         <div style={rowStyle}>
//           <div style={formGroupStyle}>
//             <label style={labelStyle}>Full Name</label>
//             <input
//               style={inputStyle}
//               required
//               type="text"
//               name="fullname"
//               placeholder="Enter your full name"
//             />
//           </div>

//         <input
//   style={inputStyle}
//   required
//   type="tel"
//   name="phone"
//   placeholder="Enter phone number"
//   maxLength="10"
//   pattern="[0-9]{10}"
//   inputMode="numeric"
//   onInput={(e) => {
//     e.target.value = e.target.value.replace(/[^0-9]/g, "");
//   }}
// />
//         </div>

//         <div style={formGroupStyle}>
//           <label style={labelStyle}>Email Address</label>
//           <input
//             style={inputStyle}
//             required
//             type="email"
//             name="email"
//             placeholder="Enter your email address"
//           />
//         </div>

//         <div style={formGroupStyle}>
//           <label style={labelStyle}>Password</label>
//           <div style={inputWrapStyle}>
//             <input
//               style={{ ...inputStyle, paddingRight: "2.3rem" }}
//               required
//               type={showPassword ? "text" : "password"}
//               name="password"
//               minLength="6"
//               placeholder="Min 6 chars"
//             />
//             <button
//               type="button"
//               style={eyeBtnStyle}
//               onClick={() => setShowPassword(v => !v)}
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </button>
//           </div>
//         </div>

//         <div style={formGroupStyle}>
//           <label style={labelStyle}>Confirm Password</label>
//           <div style={inputWrapStyle}>
//             <input
//               style={{ ...inputStyle, paddingRight: "2.3rem" }}
//               required
//               type={showConfirm ? "text" : "password"}
//               name="confirm"
//               placeholder="Confirm your password"
//             />
//             <button
//               type="button"
//               style={eyeBtnStyle}
//               onClick={() => setShowConfirm(v => !v)}
//             >
//               {showConfirm ? "🙈" : "👁️"}
//             </button>
//           </div>
//         </div>

//         <button style={buttonStyle} type="submit" disabled={loading}>
//           {loading ? "Creating..." : "Create Account"}
//         </button>

//         <div style={{ textAlign: "center", marginTop: "16px" }}>
// Already have an account?     
// <Link to="/login" style={{ color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>
//    Log In
// </Link>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default SignupPage;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

const API_URL = getApiBaseUrl();

function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    if (payload.password !== payload.confirm) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (payload.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: payload.fullname,
          phone: payload.phone,
          email: payload.email,
          city: payload.city,
          study_preference: payload.study_preference,
          password: payload.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Account created successfully!");
        navigate("/");
      } else {
        const msg = data.errors ? data.errors[0].msg : data.msg;
        alert(msg || "Signup failed");
      }

    } catch (err) {
      console.error("Connection Error:", err);
      alert("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- STYLES -------------------- */

const containerStyle = {
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--bg-main)",
  paddingTop: "120px"
};

  const formBoxStyle = {
    width: "100%",
    maxWidth: "480px",
    background: "var(--bg-card)",
    color: "var(--text-main)",
    borderRadius: "16px",
    boxShadow: "0 9px 40px rgba(17,28,23,0.3)",
    padding: "2.7rem 2rem"
  };

  const formGroupStyle = {
    marginBottom: "1.09rem",
    display: "flex",
    flexDirection: "column",
    width: "100%"
  };

  const labelStyle = {
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "4px",
    textAlign: "left"
  };

  const inputStyle = {
    width: "100%",
    background: "var(--input-bg)",
    color: "var(--text-main)",
    border: "1.3px solid var(--input-border)",
    borderRadius: "7px",
    padding: ".85rem 1rem",
    fontSize: "1rem"
  };

  const buttonStyle = {
    width: "100%",
    fontWeight: "600",
    fontSize: "1.11rem",
    borderRadius: "9px",
    marginTop: "14px",
    padding: "1rem",
    border: "none",
    background: "var(--btn-bg)",
    color: "var(--btn-text)",
    cursor: "pointer"
  };

  const rowStyle = {
    display: "flex",
    gap: "16px"
  };

  const inputWrapStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center"
  };

  const eyeBtnStyle = {
    position: "absolute",
    right: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem"
  };

  /* ------------------------------------------------ */

  return (
    <div style={containerStyle}>
      <form style={formBoxStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "6px" }}>
          Create Your Account
        </h2>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          Begin your journey of self-discovery.
        </div>

        {/* Full Name + Phone Row */}
        <div style={rowStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              required
              type="text"
              name="fullname"
              placeholder="Enter your full name"
            />
          </div>

  <div style={formGroupStyle}>
  <label style={labelStyle}>Phone</label>
  <input
    style={inputStyle}
    required
    type="tel"
    name="phone"
    placeholder="Enter phone number"
    maxLength="10"
    pattern="[0-9]{10}"
    inputMode="numeric"
    onInput={(e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    }}
  />
</div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Email Address</label>
          <input
            style={inputStyle}
            required
            type="email"
            name="email"
            placeholder="Enter your email address"
          />
        </div>

        {/* NEW: City */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>City</label>
          <input
            style={inputStyle}
            required
            type="text"
            name="city"
            placeholder="Enter your city"
          />
        </div>

        {/* NEW: Study Preference */}
<div style={formGroupStyle}>
  <label style={labelStyle}>Study Preference</label>
  <select
    style={{
      ...inputStyle,
      backgroundColor: "#ffffff",
      color: "#000000"
    }}
    required
    name="study_preference"
  >
    <option value="">Select preference</option>
 <option value="">Select preference</option>
<option value="India">Study in India</option>
<option value="Abroad">Study Abroad</option>
<option value="Both">Both</option>
  </select>
</div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Password</label>
          <div style={inputWrapStyle}>
            <input
              style={{ ...inputStyle, paddingRight: "2.3rem" }}
              required
              type={showPassword ? "text" : "password"}
              name="password"
              minLength="6"
              placeholder="Min 6 chars"
            />
            <button
              type="button"
              style={eyeBtnStyle}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Confirm Password</label>
          <div style={inputWrapStyle}>
            <input
              style={{ ...inputStyle, paddingRight: "2.3rem" }}
              required
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              style={eyeBtnStyle}
              onClick={() => setShowConfirm(v => !v)}
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button style={buttonStyle} type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          Already have an account?     
          <Link to="/login" style={{ color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>
            {" "}Log In
          </Link>
        </div>
      </form>
    </div>
  );
}
export default SignupPage;