import React from "react";

function ProfilePage({ onLogout }) {
  return (
    <div style={{ padding: "3rem 0", minHeight: "82vh", background: "var(--bg-main)", display: "flex", justifyContent: "center" }}>
      <div style={{
        maxWidth: 1000, width: "100%", background: "var(--bg-card)", borderRadius: 22, boxShadow: "0 4px 32px #0c170340",
        padding: "2.4rem 1.6rem", margin: "2rem 1rem", color: "var(--text-main)"
      }}>
        <h2 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: 12 }}>Welcome back, Jane!</h2>
        <div style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Here is a summary of your progress and insights.</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.4rem", marginBottom: "2.5rem" }}>
          <SummaryCard label="Completed Tests" value="5" />
          <SummaryCard label="Pending Tests" value="2" />
          <SummaryCard label="Personality Insights" value="8" />
          <SummaryCard label="Score History" value="85%" />
        </div>
        <div style={{
          display: "flex", gap: "1.2rem", flexWrap: "wrap", marginBottom: "2.1rem"
        }}>
          <div style={{ flex: 2, minWidth: 260, background: "var(--bg-main)", borderRadius: 16, padding: "1rem", boxShadow: "0 2px 12px #0001" }}>
            <b>Overall Progress</b>
            <div style={{ height: 126, color: "var(--text-muted)", fontSize: ".95rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Overall Progress Graph
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240, background: "var(--bg-main)", borderRadius: 16, padding: "1rem", boxShadow: "0 2px 12px #0001" }}>
            <b>Recommendations</b>
            <ul style={{ listStyle: "none", padding: 0, fontSize: ".98rem", marginTop: 13 }}>
              <li style={{ margin: "0.8rem 0" }}><span style={{ color: "var(--accent)" }}>✔️</span> Leadership Style Quiz<br /><a href="#" style={{ color: "var(--accent)" }}>Start Now →</a></li>
              <li style={{ margin: "0.8rem 0" }}><span style={{ color: "var(--accent)" }}>✔️</span> Creative Thinking Assessment<br /><a href="#" style={{ color: "var(--accent)" }}>Start Now →</a></li>
              <li style={{ margin: "0.8rem 0" }}><span style={{ color: "var(--accent)" }}>✔️</span> Stress Management Test<br /><a href="#" style={{ color: "var(--accent)" }}>Start Now →</a></li>
            </ul>
          </div>
        </div>
        <div style={{
          marginTop: "1.8rem",
          background: "var(--bg-main)",
          borderRadius: 16,
          padding: "1.1rem 1.2rem",
          boxShadow: "0 2px 12px #0001"
        }}>
          <b>Recent Activity</b>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 13 }}>
            <li style={{ marginBottom: 14 }}>
              <span style={{ color: "var(--accent)" }}>🟢</span> Cognitive Abilities Test<br />
              <span style={{ color: "var(--text-muted)" }}>Sep 28, 2023</span>
              <span style={{ float: "right" }}><b>Score:</b> 92/100 <a href="#" style={{ color: "var(--accent)" }}>View Details</a></span>
            </li>
            <li style={{ marginBottom: 14 }}>
              <span style={{ color: "var(--accent)" }}>🟢</span> Personality Type Indicator<br />
              <span style={{ color: "var(--text-muted)" }}>Aug 15, 2023</span>
              <span style={{ float: "right" }}><b>Type:</b> Innovator <a href="#" style={{ color: "var(--accent)" }}>View Details</a></span>
            </li>
            <li>
              <span style={{ color: "var(--accent)" }}>🟢</span> Emotional Intelligence Quiz<br />
              <span style={{ color: "var(--text-muted)" }}>Jul 01, 2023</span>
              <span style={{ float: "right" }}><b>Result:</b> High EQ <a href="#" style={{ color: "var(--accent)" }}>View Details</a></span>
            </li>
          </ul>
        </div>
        <button onClick={onLogout} className="cta-btn" style={{ marginTop: 30 }}>Log Out</button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div style={{
      background: "var(--bg-main)",
      borderRadius: 12,
      padding: "1.5rem 1.3rem",
      flex: "1 1 140px",
      minWidth: 120,
      boxShadow: "0 2px 10px #0001",
      textAlign: "center"
    }}>
      <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.7rem" }}>{value}</div>
      <div style={{ color: "var(--text-muted)", fontSize: ".97rem", marginTop: 7 }}>{label}</div>
    </div>
  );
}

export default ProfilePage;
