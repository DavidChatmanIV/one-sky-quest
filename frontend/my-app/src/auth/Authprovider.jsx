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

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") setUser(safeParse(e.newValue));
      if (e.key === "token") setToken(e.newValue || null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isAuthed = !!(token || user?.id || user?._id);

  /**
   * ✅ Imperative setter used by login/signup flows
   */
  const setSession = useCallback(
    ({ user: nextUser, token: nextToken } = {}) => {
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
  }, []);

  /**
   * ✅ Async login that matches AuthModal usage:
   * AuthModal calls: login(values) where values = { email, password }
   */
  const login = useCallback(
    async ({ email, password } = {}) => {
      if (!email || !password) return false;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // allow UI to show error message if returned
        throw new Error(data?.message || "Login failed");
      }

      // expected shape: { token, user }
      setSession({ token: data?.token, user: data?.user });
      return true;
    },
    [setSession]
  );

  /**
   * ✅ Async signup that matches AuthModal usage:
   * AuthModal calls: signup(values) where values = { name, email, password }
   */
  const signup = useCallback(
    async ({ name, email, password } = {}) => {
      if (!name || !email || !password) return false;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Signup failed");
      }

      setSession({ token: data?.token, user: data?.user });
      return true;
    },
    [setSession]
  );

  /**
   * ✅ Guest mode: clears session and stores a guest flag if you want it
   */
  const continueAsGuest = useCallback(() => {
    logout();
    localStorage.setItem("skyrio_guest", "1");
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthed,

      // session helpers
      setSession,
      logout,

      // async flows for AuthModal
      login,
      signup,
      continueAsGuest,

      // exposed setters (optional)
      setUser,
      setToken,
    }),
    [user, token, isAuthed, setSession, logout, login, signup, continueAsGuest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * ✅ export hook so every component can do: const auth = useAuth()
 */
export function useAuth() {
  const ctx = React.useContext(AuthContext);
  return ctx;
}