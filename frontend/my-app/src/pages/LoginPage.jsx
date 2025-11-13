import React, { useState, useRef } from "react";
import { Input, Button, message, Card, Typography, notification } from "antd";
import { useNavigate } from "react-router-dom";
import BoardingPassToast from "../components/BoardingPassToast";
import "../styles/login.css";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // Prevent duplicate toast/nav if remounts or double-clicks happen
  const successHandledRef = useRef(false);

  const handleLogin = async () => {
    if (loading) return; // double-click guard
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);

      if (!successHandledRef.current) {
        successHandledRef.current = true;

        notification.open({
          message: null,
          description: (
            <BoardingPassToast
              name={formData.email.split("@")[0] || "Explorer"}
              routeFrom="Login"
              routeTo="Dashboard"
            />
          ),
          placement: "topRight",
          duration: 3,
          style: { background: "transparent", boxShadow: "none", padding: 0 },
        });

        message.success("Welcome aboard, Explorer ✈️");
        nav("/dashboard");
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* --- Header / Hero --- */}
      <div className="login-hero">
        <div className="logo-row">
          <div className="brand-dot" aria-hidden />
          <Text className="brand">Skyrio</Text>
        </div>
        <Title level={2} className="welcome">
          Welcome back, Explorer
        </Title>
        <Text className="tagline">
          Smarter planning. Real rewards. Built for explorers.
        </Text>
      </div>

      {/* --- Glass card + Passport Stamp --- */}
      <div className="login-card-wrap">
        <div className="passport-stamp" aria-hidden />
        <Card
          title="Log In"
          className="login-card"
          style={{ width: 400, borderRadius: 16, textAlign: "center" }}
        >
          <Input
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            style={{ marginBottom: 12 }}
          />
          <Input.Password
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            style={{ marginBottom: 16 }}
          />
          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleLogin}
            className="cta"
          >
            🛫 Board Now
          </Button>

          {/* a11y live region */}
          <div aria-live="polite" style={{ height: 0, overflow: "hidden" }}>
            {loading ? "Signing in…" : ""}
          </div>
        </Card>
      </div>

      {/* --- Footer --- */}
      <footer className="login-footer">
        <Text type="secondary">© {new Date().getFullYear()} Skyrio</Text>
      </footer>
    </div>
  );
}
