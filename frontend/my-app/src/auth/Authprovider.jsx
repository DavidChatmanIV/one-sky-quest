import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AuthContext } from "./authContext";

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

/**
 * ✅ Small helper: normalize id fields so the rest of the app can rely on _id/id
 */
function normalizeUser(u) {
  if (!u || typeof u !== "object") return null;
  const id = u._id || u.id;
  return { ...u, ...(id ? { _id: id, id } : {}) };
}

function pickError(data) {
  return data?.error || data?.message || "Request failed";
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  // ✅ guest flag (Navbar expects auth.isGuest)
  const [guestFlag, setGuestFlag] = useState(
    () => localStorage.getItem("skyrio_guest") === "1"
  );

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") setUser(safeParse(e.newValue));
      if (e.key === "token") setToken(e.newValue || null);
      if (e.key === "skyrio_guest") setGuestFlag(e.newValue === "1");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isAuthed = !!(token || user?.id || user?._id);
  const isGuest = !!guestFlag && !isAuthed;

  /**
   * ✅ Imperative setter used by login/signup flows
   */
  const setSession = useCallback(
    ({ user: nextUser, token: nextToken } = {}) => {
      // ✅ once we have a real session, clear guest mode
      localStorage.removeItem("skyrio_guest");
      setGuestFlag(false);

      if (nextUser) {
        const normalized = normalizeUser(nextUser);
        setUser(normalized);
        localStorage.setItem("user", JSON.stringify(normalized));
      }
      if (nextToken) {
        setToken(nextToken);
        localStorage.setItem("token", nextToken);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // (do not remove guest flag here; continueAsGuest controls it)
  }, []);

  /**
   * ✅ Availability helper (for AuthModal UI)
   * GET /api/auth/available?email=...&username=...
   */
  const available = useCallback(async ({ email, username } = {}) => {
    const params = new URLSearchParams();
    if (email) params.set("email", String(email).trim().toLowerCase());
    if (username) params.set("username", String(username).trim());

    if ([...params.keys()].length === 0) {
      return { ok: false, error: "Provide email and/or username" };
    }

    const res = await fetch(`/api/auth/available?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: pickError(data) };
    return data; // { ok:true, email:{available}, username:{available} }
  }, []);

  /**
   * ✅ Async login that matches your backend:
   * backend reads: { emailOrUsername, password }
   *
   * Supports:
   * - login({ identity, password })
   * - login({ emailOrUsername, password })
   * - login({ email, password })
   */
  const login = useCallback(
    async ({ identity, emailOrUsername, email, password } = {}) => {
      const id = String(identity || emailOrUsername || email || "").trim();
      if (!id || !password) return false;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ emailOrUsername: id, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(pickError(data));

      setSession({ token: data?.token, user: data?.user });
      return true;
    },
    [setSession]
  );

  /**
   * ✅ Async signup that matches your backend:
   * backend accepts: { email, password, name, username }
   *
   * NOTE: name/username are optional on your backend, email+password required.
   */
  const signup = useCallback(
    async ({ name, email, password, username } = {}) => {
      if (!email || !password) return false;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name || "",
          email,
          password,
          username: username || "",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(pickError(data));

      setSession({ token: data?.token, user: data?.user });
      return true;
    },
    [setSession]
  );

  /**
   * ✅ Guest mode: clears session and stores a guest flag
   */
  const continueAsGuest = useCallback(() => {
    logout();
    localStorage.setItem("skyrio_guest", "1");
    setGuestFlag(true);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthed,
      isGuest,

      // session helpers
      setSession,
      logout,

      // async flows
      login,
      signup,
      available,
      continueAsGuest,

      // exposed setters (optional)
      setUser,
      setToken,
    }),
    [
      user,
      token,
      isAuthed,
      isGuest,
      setSession,
      logout,
      login,
      signup,
      available,
      continueAsGuest,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * ✅ export hook so every component can do: const auth = useAuth()
 */
export function useAuth() {
  return React.useContext(AuthContext);
}