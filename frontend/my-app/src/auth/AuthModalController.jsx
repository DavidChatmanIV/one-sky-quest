import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext(null);

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  // ------------------------
  // Auth state (user/token)
  // ------------------------
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  // ------------------------
  // Auth Modal state (GLOBAL)
  // ------------------------
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" | "signup"

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") setUser(safeParse(e.newValue));
      if (e.key === "token") setToken(e.newValue || null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isAuthed = !!(token || user?.id || user?._id);

  // ✅ Modal helpers
  const openAuthModal = useCallback(({ mode } = {}) => {
    if (mode === "signup" || mode === "login") setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      // auth
      user,
      token,
      isAuthed,

      login: ({ user: nextUser, token: nextToken } = {}) => {
        if (nextUser) {
          setUser(nextUser);
          localStorage.setItem("user", JSON.stringify(nextUser));
        }
        if (nextToken) {
          setToken(nextToken);
          localStorage.setItem("token", nextToken);
        }
      },

      logout: () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      },

      setUser,
      setToken,

      // modal
      authModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      setAuthModalOpen,
      setAuthModalMode,
    }),
    [
      user,
      token,
      isAuthed,
      authModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Existing hook (keep)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ✅ NEW hook (fixes your error)
export function useAuthModal() {
  const ctx = useAuth();
  return {
    openAuthModal: ctx.openAuthModal,
    closeAuthModal: ctx.closeAuthModal,
    authModalOpen: ctx.authModalOpen,
    authModalMode: ctx.authModalMode,
    setAuthModalMode: ctx.setAuthModalMode,
  };
}

export default AuthProvider;