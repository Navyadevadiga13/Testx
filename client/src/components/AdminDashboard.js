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

// ── Category / section detection from testName ──
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

// ── Tips dictionary (shared across dashboard, mirrors ProfilePage tips) ──
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

// ── Helper: get a sortable timestamp from a user (createdAt, or fallback to ObjectId's embedded timestamp) ──
const getUserTimestamp = (user) => {
  if (user?.createdAt) return new Date(user.createdAt).getTime();
  // Mongo ObjectIds encode creation time in their first 4 bytes (hex).
  if (user?._id && typeof user._id === "string" && user._id.length >= 8) {
    return parseInt(user._id.substring(0, 8), 16) * 1000;
  }
  return 0;
};

const PAGE_SIZE_USERS = 8;
const PAGE_SIZE_TESTS = 8;

// ─────────────────────────────────────────────
// Small presentational pieces
// ─────────────────────────────────────────────

const Spinner = ({ label = "Loading..." }) => (
  <div style={{ padding: "4rem", textAlign: "center", color: "#7fd8ac" }}>{label}</div>
);

const ErrorBanner = ({ message }) => (
  <div style={{ padding: "2rem", textAlign: "center", color: "#ff6b6b" }}>{message}</div>
);

const BackButton = ({ onClick, label = "Back" }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "#111111",
      color: "#19fd91",
      border: "1px solid #2a3a32",
      padding: "8px 16px",
      borderRadius: "8px",
      fontSize: "0.82rem",
      fontWeight: "700",
      cursor: "pointer",
      marginBottom: "18px",
    }}
  >
    <span style={{ fontSize: "1rem", lineHeight: 1 }}>←</span> {label}
  </button>
);

const Breadcrumbs = ({ items }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span style={{ color: "#3a5a4a" }}>/</span>}
        {item.onClick ? (
          <button
            onClick={item.onClick}
            style={{
              background: "none",
              border: "none",
              color: "#19fd91",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "700",
              padding: 0,
            }}
          >
            {item.label}
          </button>
        ) : (
          <span style={{ color: "#f5f5f5", fontSize: "0.85rem", fontWeight: "700" }}>{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Sort dropdown ──
const SortSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      background: "#0a0a0a",
      color: "#e8f8f0",
      border: "1px solid #2a2a2a",
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "0.85rem",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// ── Pagination controls ──
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
  for (let p = start; p <= end; p++) pages.push(p);

  const btnStyle = (active) => ({
    minWidth: "34px",
    padding: "7px 10px",
    borderRadius: "6px",
    border: `1px solid ${active ? "#19fd91" : "#2a2a2a"}`,
    background: active ? "rgba(25,253,145,0.12)" : "#0a0a0a",
    color: active ? "#19fd91" : "#c8c8c8",
    fontSize: "0.8rem",
    fontWeight: "700",
    cursor: "pointer",
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
      <button style={btnStyle(false)} onClick={() => onPageChange(1)} disabled={page === 1}>
        « First
      </button>
      <button style={btnStyle(false)} onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        ‹ Prev
      </button>
      {start > 1 && <span style={{ color: "#5a5a5a" }}>…</span>}
      {pages.map((p) => (
        <button key={p} style={btnStyle(p === page)} onClick={() => onPageChange(p)}>
          {p}
        </button>
      ))}
      {end < totalPages && <span style={{ color: "#5a5a5a" }}>…</span>}
      <button style={btnStyle(false)} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        Next ›
      </button>
      <button style={btnStyle(false)} onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
        Last »
      </button>
    </div>
  );
};

// ── Question-by-question breakdown table (per-question style results) ──
const QuestionBreakdownTable = ({ breakdown }) => {
  const rows = Object.entries(breakdown);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
      {rows.map(([key, value], idx) => {
        const question = value?.question || value?.prompt || `Question ${idx + 1}`;
        const userAns = value?.user ?? value?.studentAnswer ?? value?.selected ?? "—";
        const correctAns = value?.correctAnswer ?? value?.answer ?? (typeof value?.correct === "string" || typeof value?.correct === "number" ? value.correct : "—");
        let isCorrect = value?.isCorrect;
        if (isCorrect === undefined) {
          isCorrect =
            userAns !== "—" && correctAns !== "—"
              ? String(userAns).trim().toLowerCase() === String(correctAns).trim().toLowerCase()
              : null;
        }
        return (
          <div
            key={key}
            style={{
              background: "#0a0a0a",
              border: `1px solid ${isCorrect === true ? "#1a7a4a" : isCorrect === false ? "#7a1a1a" : "#2a2a2a"}`,
              borderRadius: "8px",
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "0.85rem", color: "#f5f5f5", fontWeight: "600", flex: 1 }}>
                {idx + 1}. {question}
              </div>
              {isCorrect !== null && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    padding: "2px 10px",
                    borderRadius: "20px",
                    background: isCorrect ? "rgba(25,253,145,0.1)" : "rgba(255,82,82,0.1)",
                    color: isCorrect ? "#19fd91" : "#ff6b6b",
                    border: `1px solid ${isCorrect ? "rgba(25,253,145,0.3)" : "rgba(255,82,82,0.3)"}`,
                    height: "fit-content",
                  }}
                >
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "8px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "0.78rem", color: "#9a9a9a" }}>
                Student answer: <strong style={{ color: "#f5f5f5" }}>{String(userAns)}</strong>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#9a9a9a" }}>
                Correct answer: <strong style={{ color: "#19fd91" }}>{String(correctAns)}</strong>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Writing task breakdown (prompt + response cards, e.g. TOEFL integrated tasks) ──
const WritingTaskBreakdown = ({ breakdown }) => {
  const tasks = Object.entries(breakdown);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
      {tasks.map(([taskId, task]) => (
        <div key={taskId} style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: "800", color: "#f5f5f5" }}>{task.title || taskId}</div>
            {task.wordCount !== undefined && (
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: task.meetsMinimum ? "rgba(25,253,145,0.1)" : "rgba(255,82,82,0.1)",
                  color: task.meetsMinimum ? "#19fd91" : "#ff6b6b",
                  border: `1px solid ${task.meetsMinimum ? "rgba(25,253,145,0.3)" : "rgba(255,82,82,0.3)"}`,
                }}
              >
                {task.wordCount} words {task.meetsMinimum ? "✅" : `❌ (min: ${task.minWords ?? "?"})`}
              </span>
            )}
          </div>
          {task.prompt && (
            <div style={{ background: "#000000", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: "700", color: "#19fd91", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>Prompt</div>
              <p style={{ fontSize: "0.8rem", color: "#c8c8c8", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>{task.prompt}</p>
            </div>
          )}
          <div style={{ fontSize: "0.65rem", fontWeight: "700", color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Student Response</div>
          {task.response ? (
            <p style={{ fontSize: "0.82rem", color: "#f5f5f5", lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap", maxHeight: "220px", overflowY: "auto", background: "#000000", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px" }}>
              {task.response}
            </p>
          ) : (
            <p style={{ fontSize: "0.82rem", color: "#5a5a5a", fontStyle: "italic", margin: 0 }}>No response submitted.</p>
          )}
        </div>
      ))}
    </div>
  );
};

const EssayBlock = ({ label, text }) => {
  if (!text) return null;
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "16px", marginTop: "12px" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#19fd91", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>📝 {label}</div>
      <p style={{ fontSize: "0.82rem", color: "#f5f5f5", lineHeight: "1.8", margin: 0, whiteSpace: "pre-wrap", maxHeight: "260px", overflowY: "auto" }}>{text}</p>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

function AdminDashboard() {
  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  const [view, setView] = useState("list"); // "list" | "tests" | "detail"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userResults, setUserResults] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  // Sorting: "recent" (newest first) | "old" (oldest first)
  const [userSort, setUserSort] = useState("recent");
  const [testSort, setTestSort] = useState("recent");

  // Pagination
  const [userPage, setUserPage] = useState(1);
  const [testPage, setTestPage] = useState(1);

  const getToken = () => localStorage.getItem("adminToken");

  const authFetch = useCallback(
    async (path) => {
      const token = getToken();
      if (!token) {
        navigate("/admin");
        return null;
      }
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

  // ── Load user list ──
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await authFetch("/auth/admin/users");
        if (!res) return;
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
        } else {
          setError(data.msg || "Failed to load users");
        }
      } catch (err) {
        console.error("Admin users fetch error:", err);
        setError("Server error while loading users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [authFetch]);

  // ── Load a specific user's test results ──
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
      if (res.ok) {
        setUserResults(data.results || []);
        setView("tests");
      } else {
        setError(data.msg || "Failed to load user results");
      }
    } catch (err) {
      console.error("Admin user results fetch error:", err);
      setError("Server error while loading test results");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (test) => {
    setSelectedTest(test);
    setView("detail");
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  // Back button behavior per view:
  // - list  -> leaves the admin dashboard entirely (goes to site home)
  // - tests -> back to user list
  // - detail -> back to that user's test list
  const handleBack = () => {
    if (view === "tests") {
      setView("list");
      setSelectedUser(null);
      setUserResults([]);
    } else if (view === "detail") {
      setView("tests");
      setSelectedTest(null);
    } else {
      navigate("/");
    }
  };

  // ── Filter + sort + paginate: users ──
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = users;
    if (q) {
      list = list.filter(
        (u) => (u.fullname || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      const diff = getUserTimestamp(b) - getUserTimestamp(a); // newest first by default
      return userSort === "recent" ? diff : -diff;
    });
    return sorted;
  }, [users, search, userSort]);

  const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE_USERS));
  const pagedUsers = filteredUsers.slice((userPage - 1) * PAGE_SIZE_USERS, userPage * PAGE_SIZE_USERS);

  // Reset to page 1 whenever the search or sort changes
  useEffect(() => {
    setUserPage(1);
  }, [search, userSort]);

  // ── Sort + paginate: a user's tests ──
  const sortedTests = useMemo(() => {
    const sorted = [...userResults].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime(); // newest first by default
      return testSort === "recent" ? diff : -diff;
    });
    return sorted;
  }, [userResults, testSort]);

  const testTotalPages = Math.max(1, Math.ceil(sortedTests.length / PAGE_SIZE_TESTS));
  const pagedTests = sortedTests.slice((testPage - 1) * PAGE_SIZE_TESTS, testPage * PAGE_SIZE_TESTS);

  useEffect(() => {
    setTestPage(1);
  }, [testSort, userResults]);

  // ─────────────────────────────────────────
  // Page shell — pure black, full-bleed
  // ─────────────────────────────────────────
  const Shell = ({ children }) => (
    <div style={{ minHeight: "100vh", width: "100%", background: "#000000", padding: "2.5rem 1rem" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: "900", color: "#ffffff" }}>Admin Dashboard</h1>
            <p style={{ margin: "6px 0 0", color: "#19fd91", fontSize: "0.85rem", fontWeight: "500" }}>
              Manage users and review test performance
            </p>
          </div>
          <button
            onClick={handleLogoutAdmin}
            style={{
              background: "transparent",
              color: "#ff6b6b",
              border: "1px solid rgba(255,107,107,0.4)",
              padding: "0.6rem 1.4rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              whiteSpace: "nowrap",
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

  // ─────────────────────────────────────────
  // View: user list
  // ─────────────────────────────────────────
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
              flex: 1,
              minWidth: "220px",
              padding: "12px 16px",
              background: "#0a0a0a",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              color: "#f5f5f5",
              fontSize: "0.9rem",
            }}
          />
          <SortSelect
            value={userSort}
            onChange={setUserSort}
            options={[
              { value: "recent", label: "Sort: Recent first" },
              { value: "old", label: "Sort: Oldest first" },
            ]}
          />
        </div>

        {loading && <Spinner label="Loading users..." />}
        {!loading && error && <ErrorBanner message={error} />}

        {!loading && !error && (
          <>
            <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: "14px", overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2.5fr 1fr",
                  padding: "14px 20px",
                  background: "#111111",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "#7fd8ac",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                <div>Name</div>
                <div>Email</div>
                <div style={{ textAlign: "right" }}>Action</div>
              </div>

              {pagedUsers.length === 0 && (
                <div style={{ padding: "3rem", textAlign: "center", color: "#5a5a5a" }}>No users found.</div>
              )}

              {pagedUsers.map((u) => (
                <div
                  key={u._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2.5fr 1fr",
                    padding: "16px 20px",
                    borderTop: "1px solid #1e1e1e",
                    alignItems: "center",
                  }}
                >
                  <div style={{ color: "#f5f5f5", fontSize: "0.88rem", fontWeight: "600" }}>{u.fullname || "—"}</div>
                  <div style={{ color: "#9a9a9a", fontSize: "0.85rem" }}>{u.email}</div>
                  <div style={{ textAlign: "right" }}>
                    <button
                      onClick={() => handleViewUser(u)}
                      style={{
                        background: "transparent",
                        color: "#19fd91",
                        border: "1px solid rgba(25,253,145,0.45)",
                        padding: "8px 18px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
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

  // ─────────────────────────────────────────
  // View: a user's test history
  // ─────────────────────────────────────────
  if (view === "tests") {
    return (
      <Shell>
        <Breadcrumbs
          items={[
            { label: "Users", onClick: () => setView("list") },
            { label: selectedUser?.fullname || "User" },
          ]}
        />

        <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#f5f5f5" }}>{selectedUser?.fullname}</div>
          <div style={{ fontSize: "0.85rem", color: "#9a9a9a", marginTop: "2px" }}>{selectedUser?.email}</div>
          {selectedUser?.phone && <div style={{ fontSize: "0.8rem", color: "#5a5a5a", marginTop: "2px" }}>{selectedUser.phone}</div>}
        </div>

        {loading && <Spinner label="Loading test history..." />}
        {!loading && error && <ErrorBanner message={error} />}

        {!loading && !error && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
              <SortSelect
                value={testSort}
                onChange={setTestSort}
                options={[
                  { value: "recent", label: "Sort: Recent first" },
                  { value: "old", label: "Sort: Oldest first" },
                ]}
              />
            </div>

            <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: "14px", overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.3fr 1fr 1fr",
                  padding: "14px 20px",
                  background: "#111111",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "#7fd8ac",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                <div>Test Name</div>
                <div>Date</div>
                <div>Score</div>
                <div style={{ textAlign: "right" }}>Action</div>
              </div>

              {pagedTests.length === 0 && (
                <div style={{ padding: "3rem", textAlign: "center", color: "#5a5a5a" }}>No tests taken yet.</div>
              )}

              {pagedTests.map((test) => (
                <div
                  key={test._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.3fr 1fr 1fr",
                    padding: "16px 20px",
                    borderTop: "1px solid #1e1e1e",
                    alignItems: "center",
                  }}
                >
                  <div style={{ color: "#f5f5f5", fontSize: "0.85rem", fontWeight: "600" }}>{test.testName}</div>
                  <div style={{ color: "#9a9a9a", fontSize: "0.8rem" }}>
                    {formatDate(test.date)}
                    <br />
                    <span style={{ fontSize: "0.72rem", color: "#5a5a5a" }}>{formatTime(test.date)}</span>
                  </div>
                  <div style={{ color: "#19fd91", fontSize: "0.85rem", fontWeight: "700" }}>{getDisplayScore(test)}</div>
                  <div style={{ textAlign: "right" }}>
                    <button
                      onClick={() => handleViewDetail(test)}
                      style={{
                        background: "transparent",
                        color: "#19fd91",
                        border: "1px solid rgba(25,253,145,0.4)",
                        padding: "7px 14px",
                        borderRadius: "6px",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      View Detailed
                    </button>
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

  // ─────────────────────────────────────────
  // View: detailed test review
  // ─────────────────────────────────────────
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
        <Breadcrumbs
          items={[
            { label: "Users", onClick: () => setView("list") },
            { label: selectedUser?.fullname || "User", onClick: () => setView("tests") },
            { label: selectedTest.testName },
          ]}
        />

        <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: "14px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#f5f5f5" }}>{selectedTest.testName}</div>
              <div style={{ fontSize: "0.8rem", color: "#9a9a9a", marginTop: "4px" }}>
                Taken on {formatDate(selectedTest.date)} at {formatTime(selectedTest.date)}
              </div>
            </div>
            <div
              style={{
                background: "#19fd91",
                color: "#000000",
                padding: "10px 22px",
                borderRadius: "10px",
                fontSize: "1.3rem",
                fontWeight: "900",
                textAlign: "center",
                minWidth: "100px",
              }}
            >
              {getDisplayScore(selectedTest)}
            </div>
          </div>

          {/* Essay-style responses stored directly on result (IELTS Writing / GRE Analytical) */}
          <EssayBlock label="Task 1 — Response" text={result.essayTask1} />
          <EssayBlock label="Task 2 — Response" text={result.essayTask2} />
          <EssayBlock label="Essay Response" text={result.essay} />

          {/* Breakdown: writing tasks (prompt + response per task) */}
          {isWritingTaskShape && (
            <>
              <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "#f5f5f5", marginTop: "24px", marginBottom: "4px" }}>
                Task-by-Task Responses
              </div>
              <WritingTaskBreakdown breakdown={breakdown} />
            </>
          )}

          {/* Breakdown: per-question comparison (Reading/Listening/Verbal/Quant style) */}
          {isQuestionShape && (
            <>
              <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "#f5f5f5", marginTop: "24px", marginBottom: "4px" }}>
                Answer Comparison
              </div>
              <QuestionBreakdownTable breakdown={breakdown} />
            </>
          )}

          {!isWritingTaskShape && !isQuestionShape && !result.essay && !result.essayTask1 && !result.essayTask2 && (
            <div style={{ marginTop: "20px", padding: "16px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "8px", color: "#5a5a5a", fontSize: "0.85rem", textAlign: "center" }}>
              No detailed response data available for this attempt.
            </div>
          )}

          {/* Improvement tips */}
          {tips.length > 0 && (
            <div style={{ marginTop: "24px", background: "#111111", border: "1px solid #1e1e1e", borderRadius: "10px", padding: "18px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#19fd91", marginBottom: "10px" }}>
                💡 Areas to Improve — {section || category}
              </div>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.83rem", color: "#c8c8c8", lineHeight: "1.9" }}>
                {tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
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