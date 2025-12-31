import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

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

  const value = useMemo(
    () => ({
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
    }),
    [user, token, isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthProvider;