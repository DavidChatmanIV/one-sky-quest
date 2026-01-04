import React, { useState, useRef, useMemo } from "react";
import { Input, Button, message, Typography, notification } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import BoardingPassToast from "../components/BoardingPassToast";
import AuthLayout from "../layout/AuthLayout";

import "../styles/AuthCard.css";
import "../styles/login.css";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const location = useLocation();

  // Prevent duplicate toast/nav if remounts or double-clicks happen
  const successHandledRef = useRef(false);

  // Where to go after login (ProtectedRoute sets state.from)
  const redirectTo = useMemo(() => {
    const from = location.state?.from;
    if (typeof from === "string" && from.trim().startsWith("/")) return from;
    return "/dashboard";
  }, [location.state]);

  const handleLogin = async () => {
    if (loading) return;
    if (successHandledRef.current) return;

    const emailOrUsername = (formData.emailOrUsername || "").trim();
    const password = formData.password || "";

    if (!emailOrUsername || !password) {
      message.warning("Enter your email/username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token (and user) for later API calls
      localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      const displayName =
        data.user?.name ||
        data.user?.username ||
        (data.user?.email ? data.user.email.split("@")[0] : "Explorer");

      successHandledRef.current = true;

      notification.open({
        message: null,
        description: (
          <BoardingPassToast
            name={displayName}
            routeFrom="Login"
            routeTo={redirectTo === "/dashboard" ? "Dashboard" : redirectTo}
          />
        ),
        placement: "topRight",
        duration: 3,
        style: { background: "transparent", boxShadow: "none", padding: 0 },
      });

      message.success(`Welcome aboard, ${displayName} ✈️`);

      // Redirect back to protected page they originally requested
      nav(redirectTo, { replace: true });
    } catch (err) {
      successHandledRef.current = false;
      message.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <AuthLayout>
      {/* Brand header */}
      <div className="auth-top">
        <div className="brand-row">
          <div className="brand-dot" aria-hidden />
          <span className="brand-text">Skyrio</span>
        </div>

        <Title level={2} className="auth-title">
          Welcome back, Explorer
        </Title>

        <Text className="auth-subtitle">
          Check in fast. Earn XP. Keep it moving.
        </Text>
      </div>

      {/* Boarding Pass Card */}
      <div className="pass" onKeyDown={onKeyDown} role="form">
        <div className="pass-notch" aria-hidden />

        <div className="pass-header">
          <div className="pass-airline">
            <span className="pass-chip" aria-hidden />
            <span className="pass-airline-name">Skyrio Boarding Pass</span>
          </div>

          <div className="pass-mini">
            <Text className="pass-mini-label">Gate</Text>
            <div className="pass-mini-pill">SKY</div>
          </div>
        </div>

        <div className="pass-route">
          <div className="route-col">
            <Text className="route-label">From</Text>
            <div className="route-value">Login</div>
          </div>

          <div className="route-mid" aria-hidden>
            ✈️
          </div>

          <div className="route-col right">
            <Text className="route-label">To</Text>
            <div className="route-value">
              {redirectTo === "/dashboard" ? "Dashboard" : redirectTo}
            </div>
          </div>
        </div>

        <div className="pass-divider" aria-hidden />

        <div className="pass-form">
          <Input
            placeholder="Email or username"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={(e) =>
              setFormData({ ...formData, emailOrUsername: e.target.value })
            }
            autoComplete="username"
          />

          <Input.Password
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            autoComplete="current-password"
          />

          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleLogin}
            className="pass-cta"
          >
            🛫 Confirm Boarding
          </Button>

          <div className="pass-secondary">
            <Text className="pass-secondary-text">
              New here?{" "}
              <button
                type="button"
                onClick={() => nav("/register")}
                className="link-btn"
              >
                Create an account
              </button>
            </Text>
          </div>
        </div>

        <div className="pass-divider dotted" aria-hidden />

        <div className="pass-barcode" aria-hidden>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div aria-live="polite" className="sr-only">
          {loading ? "Signing in…" : ""}
        </div>
      </div>

      <footer className="auth-footer">
        <Text className="footer-text">© {new Date().getFullYear()} Skyrio</Text>
      </footer>
    </AuthLayout>
  );
}