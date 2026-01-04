import React, { useMemo, useRef, useState } from "react";
import { Input, Button, message, Typography, notification } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import BoardingPassToast from "../components/BoardingPassToast";
import "../styles/login.css";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const location = useLocation();

  // Prevent duplicate toast/nav if remounts or double-clicks happen
  const successHandledRef = useRef(false);

  // Where to go after register (ProtectedRoute sets state.from)
  const redirectTo = useMemo(() => {
    const from = location.state?.from;
    if (typeof from === "string" && from.trim().startsWith("/")) return from;
    return "/dashboard";
  }, [location.state]);

  const handleRegister = async () => {
    if (loading) return;
    if (successHandledRef.current) return;

    const name = (formData.name || "").trim();
    const username = (formData.username || "").trim();
    const email = (formData.email || "").trim();
    const password = formData.password || "";

    if (!email || !password) {
      message.warning("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      message.warning("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email,
        password,
      };

      // Optional fields (backend supports them)
      if (name) payload.name = name;
      if (username) payload.username = username;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Registration failed");

      // ✅ NEW response shape:
      // return res.status(201).json({ token, user: buildPublicUser(user) });
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
            routeFrom="Register"
            routeTo={redirectTo === "/dashboard" ? "Dashboard" : redirectTo}
          />
        ),
        placement: "topRight",
        duration: 3,
        style: { background: "transparent", boxShadow: "none", padding: 0 },
      });

      message.success(`Account created. Welcome aboard, ${displayName} ✈️`);

      nav(redirectTo, { replace: true });
    } catch (err) {
      successHandledRef.current = false;
      message.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Optional: press Enter to register
  const onKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="auth-page">
      {/* Soft background glows */}
      <div className="glow g1" aria-hidden />
      <div className="glow g2" aria-hidden />
      <div className="glow g3" aria-hidden />

      <div className="auth-shell">
        {/* Brand header */}
        <div className="auth-top">
          <div className="brand-row">
            <div className="brand-dot" aria-hidden />
            <span className="brand-text">Skyrio</span>
          </div>

          <Title level={2} className="auth-title">
            Create your passport
          </Title>

          <Text className="auth-subtitle">
            Start earning XP and unlock your first stamp.
          </Text>
        </div>

        {/* Boarding Pass Card */}
        <div className="pass" onKeyDown={onKeyDown} role="form">
          {/* Ticket notch */}
          <div className="pass-notch" aria-hidden />

          <div className="pass-header">
            <div className="pass-airline">
              <span className="pass-chip" aria-hidden />
              <span className="pass-airline-name">Skyrio Sign-Up Pass</span>
            </div>

            <div className="pass-mini">
              <Text className="pass-mini-label">Gate</Text>
              <div className="pass-mini-pill">NEW</div>
            </div>
          </div>

          <div className="pass-route">
            <div className="route-col">
              <Text className="route-label">From</Text>
              <div className="route-value">Register</div>
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
              className="auth-input"
              placeholder="Name (optional)"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              autoComplete="name"
            />

            <Input
              className="auth-input"
              placeholder="Username (optional)"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              autoComplete="username"
            />

            <Input
              className="auth-input"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              autoComplete="email"
            />

            <Input.Password
              className="auth-input"
              placeholder="Password (6+ characters)"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              autoComplete="new-password"
            />

            <Button
              type="primary"
              block
              loading={loading}
              onClick={handleRegister}
              className="pass-cta"
            >
              🎟 Create Account
            </Button>

            <div className="pass-secondary">
              <Text className="pass-secondary-text">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => nav("/login")}
                  className="link-btn"
                >
                  Log in
                </button>
              </Text>
            </div>
          </div>

          <div className="pass-divider dotted" aria-hidden />

          {/* Barcode */}
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

          {/* a11y live region */}
          <div aria-live="polite" className="sr-only">
            {loading ? "Creating account…" : ""}
          </div>
        </div>

        <footer className="auth-footer">
          <Text className="footer-text">
            © {new Date().getFullYear()} Skyrio
          </Text>
        </footer>
      </div>
    </div>
  );
}