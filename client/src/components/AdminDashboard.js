// src/components/AdminDashboard.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import getApiBaseUrl from "../utils/api";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getCategory = (testName = "") => {
  const n = testName.toLowerCase();
  if (n.includes("ielts")) return "IELTS";
  if (n.includes("toefl")) return "TOEFL";
  if (n.includes("gre")) return "GRE";
  return "Other";
};

const getSection = (testName = "") => {
  const n = testName.toLowerCase();
  if (n.includes("reading")) return "Reading";
  if (n.includes("listening")) return "Listening";
  if (n.includes("writing")) return "Writing";
  if (n.includes("speaking")) return "Speaking";
  if (n.includes("verbal")) return "Verbal";
  if (n.includes("quant")) return "Quantitative";
  if (n.includes("analytical") || n.includes("awa")) return "Analytical";
  return "";
};

const getDisplayScore = (test) => {
  const result = test?.result || {};
  if (result.toeflScore !== undefined && result.toeflScore !== null) return `${result.toeflScore}/30`;
  if (result.bandScore !== undefined && result.bandScore !== null) return `Band ${result.bandScore}`;
  if (getCategory(test?.testName) === "GRE" && getSection(test?.testName) === "Analytical" && result.score !== undefined)
    return `${result.score}/6`;
  if (result.task1Band !== undefined || result.task2Band !== undefined) {
    const t1 = result.task1Band ?? "—";
    const t2 = result.task2Band ?? "—";
    return `T1: ${t1} / T2: ${t2}`;
  }
  if (result.rawScore !== undefined && result.total !== undefined) return `${result.rawScore}/${result.total}`;
  if (result.score !== undefined && result.score !== null) return result.score;
  if (result.rawScore !== undefined && result.rawScore !== null) return result.rawScore;
  return "—";
};

const TIPS = {
  IELTS: {
    Reading: ["Practice skimming and scanning techniques.", "Read academic articles daily to improve speed.", "Focus on understanding passage structure and keywords."],
    Listening: ["Listen to podcasts, news, and lectures daily.", "Practice note-taking while listening.", "Focus on catching keywords and numbers accurately."],
    Writing: ["Work on task response and coherence.", "Practice writing introductions and conclusions.", "Learn to use a variety of sentence structures and vocabulary."],
    Speaking: ["Speak English daily, even alone.", "Record yourself and review pronunciation.", "Expand your answers with examples and opinions."],
  },
  TOEFL: {
    Reading: ["Practice skimming and scanning passages under time pressure.", "Read academic and news articles daily.", "Work on identifying main ideas and author's purpose."],
    Listening: ["Listen to TED Talks, lectures, and academic podcasts.", "Practice note-taking while listening.", "Focus on identifying key arguments and transitions."],
    Writing: ["Practice integrated and independent essay structures.", "Work on clear thesis statements and coherent paragraphs.", "Expand academic vocabulary and vary sentence structure."],
    Speaking: ["Record yourself and listen back for clarity.", "Practice speaking on academic topics spontaneously.", "Work on pacing, pronunciation, and linking ideas."],
  },
  GRE: {
    Verbal: ["Build vocabulary with GRE word lists daily.", "Practice reading comprehension with dense passages.", "Work on text completion and sentence equivalence."],
    Quantitative: ["Review core math concepts — algebra, geometry, statistics.", "Practice data interpretation and quantitative comparisons.", "Time yourself strictly on problem sets."],
    Analytical: ["Practice Issue and Argument essay templates.", "Focus on clear thesis and well-structured arguments.", "Read sample high-scoring AWA essays for reference."],
  },
};

// Ranks a user by their most recent test activity so whoever took a
// test most recently surfaces first. Users who haven't taken any test
// yet (no lastTestDate) fall back to their account creation time, and
// rank below anyone with actual test activity — see getUserSortRank.
const getUserTimestamp = (user) => {
  if (user?.lastTestDate) return new Date(user.lastTestDate).getTime();
  if (user?.createdAt) return new Date(user.createdAt).getTime();
  if (user?._id && typeof user._id === "string" && user._id.length >= 8) {
    return parseInt(user._id.substring(0, 8), 16) * 1000;
  }
  return 0;
};

const getUserSortRank = (user) => {
  const hasTaken = !!user?.lastTestDate;
  return { hasTaken, timestamp: getUserTimestamp(user) };
};

const PAGE_SIZE_USERS = 8;
const PAGE_SIZE_TESTS = 8;

// ─────────────────────────────────────────────
// Design tokens — muted dark palette, accent used sparingly
// ─────────────────────────────────────────────
const C = {
  bg: "#0a0b0d",
  surface: "#111318",
  surfaceRaised: "#161920",
  border: "#22262e",
  borderSoft: "#1a1d23",
  text: "#eef1f4",
  textMuted: "#9aa1ac",
  textFaint: "#5c6470",
  accent: "#3ddc97",
  accentSoft: "rgba(61,220,151,0.12)",
  accentBorder: "rgba(61,220,151,0.35)",
  danger: "#f0616b",
  fontStack:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const AVATAR_COLORS = ["#5b8def", "#3ddc97", "#f0a63d", "#e2618b", "#8a6df0", "#3dc0dc"];
const avatarColorFor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ─────────────────────────────────────────────
// Small presentational pieces
// ─────────────────────────────────────────────

const Spinner = ({ label = "Loading..." }) => (
  <div style={{ padding: "4rem", textAlign: "center", color: C.textMuted, fontFamily: C.fontStack, fontSize: "0.9rem" }}>{label}</div>
);

const ErrorBanner = ({ message }) => (
  <div style={{ padding: "1rem 1.25rem", background: "rgba(240,97,107,0.08)", border: `1px solid rgba(240,97,107,0.25)`, borderRadius: "10px", color: C.danger, fontFamily: C.fontStack, fontSize: "0.88rem" }}>
    {message}
  </div>
);

const BackButton = ({ onClick, label = "Back" }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: C.surface,
      color: C.textMuted,
      border: `1px solid ${C.border}`,
      padding: "8px 14px",
      borderRadius: "8px",
      fontSize: "0.82rem",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "20px",
      fontFamily: C.fontStack,
      transition: "all 0.15s ease",
    }}
    onMouseOver={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = "#33383f"; }}
    onMouseOut={(e) => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
  >
    <span style={{ fontSize: "0.95rem", lineHeight: 1 }}>←</span> {label}
  </button>
);

const Breadcrumbs = ({ items }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "18px", fontFamily: C.fontStack }}>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span style={{ color: C.textFaint, fontSize: "0.8rem" }}>/</span>}
        {item.onClick ? (
          <button
            onClick={item.onClick}
            style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "0.82rem", fontWeight: "600", padding: 0 }}
          >
            {item.label}
          </button>
        ) : (
          <span style={{ color: C.text, fontSize: "0.82rem", fontWeight: "700" }}>{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

const SortSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      background: C.surface,
      color: C.text,
      border: `1px solid ${C.border}`,
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "0.83rem",
      fontWeight: "500",
      cursor: "pointer",
      fontFamily: C.fontStack,
      outline: "none",
    }}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
  for (let p = start; p <= end; p++) pages.push(p);

  const btnStyle = (active, disabled) => ({
    minWidth: "32px",
    padding: "7px 10px",
    borderRadius: "7px",
    border: `1px solid ${active ? C.accentBorder : C.border}`,
    background: active ? C.accentSoft : "transparent",
    color: disabled ? C.textFaint : active ? C.accent : C.textMuted,
    fontSize: "0.78rem",
    fontWeight: "600",
    cursor: disabled ? "default" : "pointer",
    fontFamily: C.fontStack,
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "24px", flexWrap: "wrap" }}>
      <button style={btnStyle(false, page === 1)} onClick={() => onPageChange(1)} disabled={page === 1}>« First</button>
      <button style={btnStyle(false, page === 1)} onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹ Prev</button>
      {start > 1 && <span style={{ color: C.textFaint }}>…</span>}
      {pages.map((p) => (
        <button key={p} style={btnStyle(p === page, false)} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      {end < totalPages && <span style={{ color: C.textFaint }}>…</span>}
      <button style={btnStyle(false, page === totalPages)} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next ›</button>
      <button style={btnStyle(false, page === totalPages)} onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>Last »</button>
    </div>
  );
};

const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const color = avatarColorFor(name || "?");
  return (
    <div
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        background: `${color}22`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.85rem",
        fontWeight: "700",
        flexShrink: 0,
        border: `1px solid ${color}40`,
      }}
    >
      {initial}
    </div>
  );
};

const QuestionBreakdownTable = ({ breakdown }) => {
  const rows = Object.entries(breakdown);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
      {rows.map(([key, value], idx) => {
        const question = value?.question || value?.prompt || `Question ${idx + 1}`;
        const userAns = value?.user ?? value?.studentAnswer ?? value?.selected ?? "—";
        const correctAns = value?.correctAnswer ?? value?.answer ?? (typeof value?.correct === "string" || typeof value?.correct === "number" ? value.correct : "—");
        let isCorrect = value?.isCorrect;
        if (isCorrect === undefined) {
          isCorrect = userAns !== "—" && correctAns !== "—" ? String(userAns).trim().toLowerCase() === String(correctAns).trim().toLowerCase() : null;
        }
        return (
          <div
            key={key}
            style={{
              background: C.surface,
              border: `1px solid ${isCorrect === true ? "rgba(61,220,151,0.3)" : isCorrect === false ? "rgba(240,97,107,0.3)" : C.border}`,
              borderRadius: "10px",
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "0.86rem", color: C.text, fontWeight: "600", flex: 1 }}>{idx + 1}. {question}</div>
              {isCorrect !== null && (
                <span style={{
                  fontSize: "0.7rem", fontWeight: "700", padding: "3px 10px", borderRadius: "20px",
                  background: isCorrect ? "rgba(61,220,151,0.1)" : "rgba(240,97,107,0.1)",
                  color: isCorrect ? C.accent : C.danger,
                  border: `1px solid ${isCorrect ? "rgba(61,220,151,0.3)" : "rgba(240,97,107,0.3)"}`,
                  height: "fit-content",
                }}>
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "24px", marginTop: "10px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "0.78rem", color: C.textMuted }}>Student answer: <strong style={{ color: C.text }}>{String(userAns)}</strong></div>
              <div style={{ fontSize: "0.78rem", color: C.textMuted }}>Correct answer: <strong style={{ color: C.accent }}>{String(correctAns)}</strong></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const WritingTaskBreakdown = ({ breakdown }) => {
  const tasks = Object.entries(breakdown);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "14px" }}>
      {tasks.map(([taskId, task]) => (
        <div key={taskId} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: C.text }}>{task.title || taskId}</div>
            {task.wordCount !== undefined && (
              <span style={{
                fontSize: "0.72rem", fontWeight: "700", padding: "3px 10px", borderRadius: "20px",
                background: task.meetsMinimum ? "rgba(61,220,151,0.1)" : "rgba(240,97,107,0.1)",
                color: task.meetsMinimum ? C.accent : C.danger,
                border: `1px solid ${task.meetsMinimum ? "rgba(61,220,151,0.3)" : "rgba(240,97,107,0.3)"}`,
              }}>
                {task.wordCount} words {task.meetsMinimum ? "✓" : `(min: ${task.minWords ?? "?"})`}
              </span>
            )}
          </div>
          {task.prompt && (
            <div style={{ background: C.bg, border: `1px solid ${C.borderSoft}`, borderRadius: "8px", padding: "12px 14px", marginBottom: "12px" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Prompt</div>
              <p style={{ fontSize: "0.82rem", color: C.textMuted, lineHeight: "1.65", margin: 0, whiteSpace: "pre-wrap" }}>{task.prompt}</p>
            </div>
          )}
          <div style={{ fontSize: "0.65rem", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Student Response</div>
          {task.response ? (
            <p style={{ fontSize: "0.84rem", color: C.text, lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap", maxHeight: "220px", overflowY: "auto", background: C.bg, border: `1px solid ${C.borderSoft}`, borderRadius: "8px", padding: "14px" }}>
              {task.response}
            </p>
          ) : (
            <p style={{ fontSize: "0.82rem", color: C.textFaint, fontStyle: "italic", margin: 0 }}>No response submitted.</p>
          )}
        </div>
      ))}
    </div>
  );
};

const EssayBlock = ({ label, text }) => {
  if (!text) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "18px", marginTop: "14px" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>{label}</div>
      <p style={{ fontSize: "0.84rem", color: C.text, lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "260px", overflowY: "auto" }}>{text}</p>
    </div>
  );
};

function AdminDashboard() {
  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userResults, setUserResults] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  const [userSort, setUserSort] = useState("recent");
  const [testSort, setTestSort] = useState("recent");

  const [userPage, setUserPage] = useState(1);
  const [testPage, setTestPage] = useState(1);

  const getToken = () => localStorage.getItem("adminToken");

  const authFetch = useCallback(
    async (path) => {
      const token = getToken();
      if (!token) { navigate("/admin"); return null; }
      const res = await fetch(`${API_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
        return null;
      }
      return res;
    },
    [API_URL, navigate]
  );

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await authFetch("/auth/admin/users");
        if (!res) return;
        const data = await res.json();
        if (res.ok) setUsers(data.users || []);
        else setError(data.msg || "Failed to load users");
      } catch (err) {
        console.error("Admin users fetch error:", err);
        setError("Server error while loading users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [authFetch]);

  const handleViewUser = async (user) => {
    setLoading(true);
    setError("");
    setSelectedUser(user);
    setTestPage(1);
    setTestSort("recent");
    try {
      const res = await authFetch(`/auth/admin/user/${user._id}/results`);
      if (!res) return;
      const data = await res.json();
      if (res.ok) { setUserResults(data.results || []); setView("tests"); }
      else setError(data.msg || "Failed to load user results");
    } catch (err) {
      console.error("Admin user results fetch error:", err);
      setError("Server error while loading test results");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (test) => { setSelectedTest(test); setView("detail"); };
  const handleLogoutAdmin = () => { localStorage.removeItem("adminToken"); navigate("/admin"); };

  const handleBack = () => {
    if (view === "tests") { setView("list"); setSelectedUser(null); setUserResults([]); }
    else if (view === "detail") { setView("tests"); setSelectedTest(null); }
    else navigate("/");
  };

  // Sort users so that anyone with test activity ranks above anyone
  // without any (getUserSortRank.hasTaken), then order by most/least
  // recent activity timestamp within each of those two groups based
  // on the selected sort direction. This is what makes "took a test
  // today" surface at the very top of the list.
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = users;
    if (q) list = list.filter((u) => (u.fullname || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q));
    return [...list].sort((a, b) => {
      const rankA = getUserSortRank(a);
      const rankB = getUserSortRank(b);
      if (rankA.hasTaken !== rankB.hasTaken) {
        return rankA.hasTaken ? -1 : 1;
      }
      const diff = rankB.timestamp - rankA.timestamp;
      return userSort === "recent" ? diff : -diff;
    });
  }, [users, search, userSort]);

  const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE_USERS));
  const pagedUsers = filteredUsers.slice((userPage - 1) * PAGE_SIZE_USERS, userPage * PAGE_SIZE_USERS);

  useEffect(() => { setUserPage(1); }, [search, userSort]);

  const sortedTests = useMemo(() => {
    return [...userResults].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return testSort === "recent" ? diff : -diff;
    });
  }, [userResults, testSort]);

  const testTotalPages = Math.max(1, Math.ceil(sortedTests.length / PAGE_SIZE_TESTS));
  const pagedTests = sortedTests.slice((testPage - 1) * PAGE_SIZE_TESTS, testPage * PAGE_SIZE_TESTS);

  useEffect(() => { setTestPage(1); }, [testSort, userResults]);

  const Shell = ({ children }) => (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg, padding: "3rem 1.5rem", fontFamily: C.fontStack }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", color: C.text, letterSpacing: "-0.3px" }}>Admin Dashboard</h1>
            <p style={{ margin: "6px 0 0", color: C.textMuted, fontSize: "0.86rem", fontWeight: "400" }}>
              Manage users and review test performance
            </p>
          </div>
          <button
            onClick={handleLogoutAdmin}
            style={{
              background: "transparent", color: C.danger, border: `1px solid rgba(240,97,107,0.35)`,
              padding: "0.55rem 1.2rem", borderRadius: "8px", fontSize: "0.83rem", fontWeight: "600",
              cursor: "pointer", whiteSpace: "nowrap", fontFamily: C.fontStack,
            }}
          >
            Log Out
          </button>
        </div>
        <BackButton onClick={handleBack} label={view === "list" ? "Back to Site" : "Back"} />
        {children}
      </div>
    </div>
  );

  const tableWrap = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" };
  const tableHead = { display: "grid", padding: "14px 22px", background: C.surfaceRaised, fontSize: "0.7rem", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.7px", borderBottom: `1px solid ${C.border}` };
  const tableRow = { display: "grid", padding: "16px 22px", borderTop: `1px solid ${C.borderSoft}`, alignItems: "center", transition: "background 0.12s ease" };

  const OutlineBtn = ({ onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        background: "transparent", color: C.accent, border: `1px solid ${C.accentBorder}`,
        padding: "7px 16px", borderRadius: "7px", fontSize: "0.78rem", fontWeight: "600",
        cursor: "pointer", fontFamily: C.fontStack, transition: "all 0.15s ease",
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = C.accentSoft; }}
      onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );

  if (view === "list") {
    return (
      <Shell>
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: "220px", padding: "12px 16px", background: C.surface,
              border: `1px solid ${C.border}`, borderRadius: "9px", color: C.text,
              fontSize: "0.88rem", fontFamily: C.fontStack, outline: "none",
            }}
          />
          <SortSelect value={userSort} onChange={setUserSort} options={[
            { value: "recent", label: "Sort: Recent first" },
            { value: "old", label: "Sort: Oldest first" },
          ]} />
        </div>

        {loading && <Spinner label="Loading users..." />}
        {!loading && error && <ErrorBanner message={error} />}

        {!loading && !error && (
          <>
            <div style={tableWrap}>
              <div style={{ ...tableHead, gridTemplateColumns: "2.2fr 2.2fr 1.6fr 1fr" }}>
                <div>User</div><div>Email</div><div>Study Preference</div><div style={{ textAlign: "right" }}>Action</div>
              </div>
              {pagedUsers.length === 0 && (
                <div style={{ padding: "3rem", textAlign: "center", color: C.textFaint, fontSize: "0.88rem" }}>No users found.</div>
              )}
              {pagedUsers.map((u) => (
                <div key={u._id} style={{ ...tableRow, gridTemplateColumns: "2.2fr 2.2fr 1.6fr 1fr" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Avatar name={u.fullname} />
                    <span style={{ color: C.text, fontSize: "0.88rem", fontWeight: "600" }}>{u.fullname || "—"}</span>
                  </div>
                  <div style={{ color: C.textMuted, fontSize: "0.85rem" }}>{u.email}</div>
                  <div style={{ color: C.textMuted, fontSize: "0.85rem" }}>{u.study_preference || "—"}</div>
                  <div style={{ textAlign: "right" }}>
                    <OutlineBtn onClick={() => handleViewUser(u)}>View</OutlineBtn>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={userPage} totalPages={userTotalPages} onPageChange={setUserPage} />
          </>
        )}
      </Shell>
    );
  }

  if (view === "tests") {
    return (
      <Shell>
        <Breadcrumbs items={[{ label: "Users", onClick: () => setView("list") }, { label: selectedUser?.fullname || "User" }]} />

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "20px 22px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <Avatar name={selectedUser?.fullname} />
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: "700", color: C.text }}>{selectedUser?.fullname}</div>
            <div style={{ fontSize: "0.83rem", color: C.textMuted, marginTop: "2px" }}>{selectedUser?.email}</div>
            {selectedUser?.phone && <div style={{ fontSize: "0.78rem", color: C.textFaint, marginTop: "2px" }}>{selectedUser.phone}</div>}
          </div>
        </div>

        {loading && <Spinner label="Loading test history..." />}
        {!loading && error && <ErrorBanner message={error} />}

        {!loading && !error && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
              <SortSelect value={testSort} onChange={setTestSort} options={[
                { value: "recent", label: "Sort: Recent first" },
                { value: "old", label: "Sort: Oldest first" },
              ]} />
            </div>

            <div style={tableWrap}>
              <div style={{ ...tableHead, gridTemplateColumns: "2fr 1.3fr 1fr 1fr" }}>
                <div>Test Name</div><div>Date</div><div>Score</div><div style={{ textAlign: "right" }}>Action</div>
              </div>
              {pagedTests.length === 0 && (
                <div style={{ padding: "3rem", textAlign: "center", color: C.textFaint, fontSize: "0.88rem" }}>No tests taken yet.</div>
              )}
              {pagedTests.map((test) => (
                <div key={test._id} style={{ ...tableRow, gridTemplateColumns: "2fr 1.3fr 1fr 1fr" }}>
                  <div style={{ color: C.text, fontSize: "0.86rem", fontWeight: "600" }}>{test.testName}</div>
                  <div style={{ color: C.textMuted, fontSize: "0.8rem" }}>
                    {formatDate(test.date)}<br />
                    <span style={{ fontSize: "0.72rem", color: C.textFaint }}>{formatTime(test.date)}</span>
                  </div>
                  <div style={{ color: C.accent, fontSize: "0.86rem", fontWeight: "700" }}>{getDisplayScore(test)}</div>
                  <div style={{ textAlign: "right" }}>
                    <OutlineBtn onClick={() => handleViewDetail(test)}>View Detailed</OutlineBtn>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={testPage} totalPages={testTotalPages} onPageChange={setTestPage} />
          </>
        )}
      </Shell>
    );
  }

  if (view === "detail" && selectedTest) {
    const result = selectedTest.result || {};
    const category = getCategory(selectedTest.testName);
    const section = getSection(selectedTest.testName);
    const tips = TIPS[category]?.[section] || [];
    const breakdown = result.breakdown;
    const breakdownEntries = breakdown ? Object.values(breakdown) : [];
    const isWritingTaskShape = breakdownEntries.some((v) => v && typeof v === "object" && ("response" in v || "prompt" in v));
    const isQuestionShape = !isWritingTaskShape && breakdownEntries.some((v) => v && typeof v === "object" && ("correct" in v || "isCorrect" in v || "user" in v));

    return (
      <Shell>
        <Breadcrumbs items={[
          { label: "Users", onClick: () => setView("list") },
          { label: selectedUser?.fullname || "User", onClick: () => setView("tests") },
          { label: selectedTest.testName },
        ]} />

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "26px", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: "700", color: C.text }}>{selectedTest.testName}</div>
              <div style={{ fontSize: "0.82rem", color: C.textMuted, marginTop: "6px" }}>
                Taken on {formatDate(selectedTest.date)} at {formatTime(selectedTest.date)}
              </div>
            </div>
            <div style={{
              background: C.accentSoft, color: C.accent, border: `1px solid ${C.accentBorder}`,
              padding: "10px 22px", borderRadius: "10px", fontSize: "1.2rem", fontWeight: "700",
              textAlign: "center", minWidth: "100px",
            }}>
              {getDisplayScore(selectedTest)}
            </div>
          </div>

          <EssayBlock label="Task 1 — Response" text={result.essayTask1} />
          <EssayBlock label="Task 2 — Response" text={result.essayTask2} />
          <EssayBlock label="Essay Response" text={result.essay} />

          {isWritingTaskShape && (
            <>
              <div style={{ fontSize: "0.88rem", fontWeight: "700", color: C.text, marginTop: "28px", marginBottom: "4px" }}>Task-by-Task Responses</div>
              <WritingTaskBreakdown breakdown={breakdown} />
            </>
          )}

          {isQuestionShape && (
            <>
              <div style={{ fontSize: "0.88rem", fontWeight: "700", color: C.text, marginTop: "28px", marginBottom: "4px" }}>Answer Comparison</div>
              <QuestionBreakdownTable breakdown={breakdown} />
            </>
          )}

          {!isWritingTaskShape && !isQuestionShape && !result.essay && !result.essayTask1 && !result.essayTask2 && (
            <div style={{ marginTop: "22px", padding: "18px", background: C.bg, border: `1px solid ${C.borderSoft}`, borderRadius: "10px", color: C.textFaint, fontSize: "0.85rem", textAlign: "center" }}>
              No detailed response data available for this attempt.
            </div>
          )}

          {tips.length > 0 && (
            <div style={{ marginTop: "26px", background: C.surfaceRaised, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: C.accent, marginBottom: "12px" }}>
                Areas to Improve — {section || category}
              </div>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.84rem", color: C.textMuted, lineHeight: "1.95" }}>
                {tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  return null;
}
export default AdminDashboard;