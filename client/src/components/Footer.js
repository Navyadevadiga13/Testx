import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

function Footer() {
  return (
    <footer
      className="footer-compact"
      style={{
        background: "#ffffff",
        borderTop: "1px solid rgba(25, 253, 145, 0.2)",
        padding: "1.8rem 5vw",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* LEFT - BRAND */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: "800",
              color: "#111111",
            }}
          >
            WiZdom{" "}
            <span
              style={{
                color: "#19fd91",
              }}
            >
              Ed
            </span>
          </h2>

          <p
            style={{
              margin: 0,
              color: "#555",
              fontSize: "0.9rem",
              lineHeight: "1.5",
            }}
          >
            IELTS • TOEFL • GRE Preparation Platform
          </p>
        </div>

        {/* CENTER - COPYRIGHT */}
        <div
          style={{
            color: "#444",
            fontSize: "0.9rem",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          © 2026{" "}
          <span
            style={{
              color: "#19fd91",
              fontWeight: "700",
            }}
          >
            WiZdom Ed
          </span>
          . All rights reserved.
        </div>

        {/* RIGHT - CONTACT */}
        <div
          style={{
            display: "flex",
            gap: "1.8rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* EMAIL */}
          <a
            href="mailto:hello@wizx.org"
            style={{
              color: "#333",
              fontSize: "0.9rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "0.3s",
              fontWeight: "500",
            }}
            onMouseOver={(e) => {
              e.target.style.color = "#19fd91";
            }}
            onMouseOut={(e) => {
              e.target.style.color = "#333";
            }}
          >
            <FiMail style={{ color: "#19fd91" }} />
            hello@wizx.org
          </a>

          {/* PHONE */}
          <a
            href="tel:+918169600408"
            style={{
              color: "#333",
              fontSize: "0.9rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "0.3s",
              fontWeight: "500",
            }}
            onMouseOver={(e) => {
              e.target.style.color = "#19fd91";
            }}
            onMouseOut={(e) => {
              e.target.style.color = "#333";
            }}
          >
            <FiPhone style={{ color: "#19fd91" }} />
            +91-8169600408
          </a>

          {/* ADDRESS */}
          <div
            style={{
              color: "#333",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              lineHeight: "1.6",
              fontWeight: "500",
            }}
          >
            <FiMapPin
              style={{
                color: "#19fd91",
                marginTop: "3px",
              }}
            />

            <span>
              Wizdom Ed., First Floor, Takshila Building,
              <br />
              Opp Janatha Delux Patthumudi,
              <br />
              Ballalbhag, Mangaluru – 575003
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;