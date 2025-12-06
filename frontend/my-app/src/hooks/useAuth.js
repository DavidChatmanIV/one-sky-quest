import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch /api/profile/me automatically when the hook loads
   * This verifies the JWT and returns the real logged-in user.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchMe() {
      try {
        setLoading(true);

        const res = await fetch("/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // If token invalid or expired
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (!cancelled) setUser(null);
          }

          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load profile");
        }

        const data = await res.json();
        if (!cancelled) {
          setUser(data.user || null);
          setError(null);

          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useAuth] error:", err);
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMe();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * login()
   * Save token + user manually (used after register or login)
   */
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * logout()
   * Clear all authentication & user data
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return {
    user,
    setUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
