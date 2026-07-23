// Reads the `exp` claim out of a JWT without verifying its signature —
// good enough for a client-side "is this worth sending to the server"
// check, since the server still verifies the signature on every request.
function decodeJwtExpiry(token) {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenValid(token = localStorage.getItem("token")) {
  if (!token) return false;
  const expiresAt = decodeJwtExpiry(token);
  if (expiresAt === null) return true; // not a decodable JWT — let the server be the judge
  return Date.now() < expiresAt;
}

// Clears a stale/expired token so the rest of the app (isLoggedIn state,
// header UI) stops treating the visitor as signed in.
export function clearExpiredSession() {
  localStorage.removeItem("token");
}
