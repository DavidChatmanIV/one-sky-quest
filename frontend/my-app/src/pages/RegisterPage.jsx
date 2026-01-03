import React, { useRef, useState } from "react";
import { Input, Button, message, Card, Typography, notification } from "antd";
import { useNavigate } from "react-router-dom";
import BoardingPassToast from "../components/BoardingPassToast";
import "../styles/login.css"; // reuse same layout styles for now

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const successHandledRef = useRef(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    if (loading) return;

    const { username, name, email, password, confirmPassword } = formData;

    // basic client-side validation
    if (!username || !email || !password) {
      message.error("Username, email, and password are required");
      return;
    }
    if (password.length < 6) {
      message.error("Password should be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save token + user
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const displayName =
        data.user?.name ||
        data.user?.username ||
        (data.user?.email ? data.user.email.split("@")[0] : "Explorer");

      if (!successHandledRef.current) {
        successHandledRef.current = true;

        notification.open({
          message: null,
          description: (
            <BoardingPassToast
              name={displayName}
              routeFrom="Sign Up"
              routeTo="Dashboard"
            />
          ),
          placement: "topRight",
          duration: 3,
          style: { background: "transparent", boxShadow: "none", padding: 0 },
        });

        message.success(`Welcome aboard, ${displayName} ✈️`);
        nav("/dashboard");
      }
    } catch (err) {
      console.error("[Register] error:", err);
      message.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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
            Create your Skyrio account
          </Title>

          <Text className="auth-subtitle">
            Start earning XP, saving trips, and planning smarter.
          </Text>
        </div>

        {/* Boarding Pass Card (same as login styling) */}
        <div className="pass" role="form">
          <div className="pass-notch" aria-hidden />

          <div className="pass-header">
            <div className="pass-airline">
              <span className="pass-chip" aria-hidden />
              <span className="pass-airline-name">Skyrio Sign Up</span>
            </div>

            <div className="pass-mini">
              <Text className="pass-mini-label">Gate</Text>
              <div className="pass-mini-pill">SKY</div>
            </div>
          </div>

          <div className="pass-route">
            <div className="route-col">
              <Text className="route-label">From</Text>
              <div className="route-value">Sign Up</div>
            </div>

            <div className="route-mid" aria-hidden>
              ✈️
            </div>

            <div className="route-col right">
              <Text className="route-label">To</Text>
              <div className="route-value">Dashboard</div>
            </div>
          </div>

          <div className="pass-divider" aria-hidden />

          <div className="pass-form">
            <Input
              className="auth-input"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange("username")}
              autoComplete="username"
            />

            <Input
              className="auth-input"
              placeholder="Full name (optional)"
              name="name"
              value={formData.name}
              onChange={handleChange("name")}
              autoComplete="name"
            />

            <Input
              className="auth-input"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange("email")}
              autoComplete="email"
            />

            <Input.Password
              className="auth-input"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange("password")}
              autoComplete="new-password"
            />

            <Input.Password
              className="auth-input"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              autoComplete="new-password"
            />

            <Button
              type="primary"
              block
              loading={loading}
              onClick={handleRegister}
              className="pass-cta"
            >
              ✈️ Create Account
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
            {loading ? "Creating your account…" : ""}
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
