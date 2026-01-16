import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { Modal } from "antd";

// ✅ Put your real forms here if you have them:
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

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

  // ✅ Modal helpers (keep)
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

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* ✅ Render the modal (clean + responsive shell) */}
      <Modal
        open={authModalOpen}
        onCancel={closeAuthModal}
        footer={null}
        centered
        destroyOnClose
        className="sk-authModal"
        width={560}
        maskClosable
        styles={{
          body: { padding: 0 },
          content: { padding: 0, borderRadius: 18, overflow: "hidden" },
        }}
      >
        <div className="sk-authShell">
          <div className="sk-authScroll">
            {authModalMode === "signup" ? <RegisterPage /> : <LoginPage />}
          </div>
        </div>
      </Modal>
    </AuthContext.Provider>
  );
}

// ✅ Existing hook (keep)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ✅ Existing hook (keep)
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