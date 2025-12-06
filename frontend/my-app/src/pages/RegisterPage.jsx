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
    <div className="login-wrap">
      {/* --- Header / Hero --- */}
      <div className="login-hero">
        <div className="logo-row">
          <div className="brand-dot" aria-hidden />
          <Text className="brand">Skyrio</Text>
        </div>
        <Title level={2} className="welcome">
          Create your Skyrio account
        </Title>
        <Text className="tagline">
          Start earning XP, saving trips, and planning smarter.
        </Text>
      </div>

      {/* --- Glass card --- */}
      <div className="login-card-wrap">
        <div className="passport-stamp" aria-hidden />
        <Card
          title="Sign Up"
          className="login-card"
          style={{ width: 400, borderRadius: 16, textAlign: "center" }}
        >
          <Input
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange("username")}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Full name (optional)"
            name="name"
            value={formData.name}
            onChange={handleChange("name")}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange("email")}
            style={{ marginBottom: 10 }}
          />
          <Input.Password
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange("password")}
            style={{ marginBottom: 10 }}
          />
          <Input.Password
            placeholder="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            style={{ marginBottom: 16 }}
          />

          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleRegister}
            className="cta"
          >
            ✈️ Create Account
          </Button>

          <div style={{ marginTop: 12 }}>
            <Text type="secondary">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => nav("/login")}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#40a9ff",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Log in
              </button>
            </Text>
          </div>

          {/* a11y live region */}
          <div aria-live="polite" style={{ height: 0, overflow: "hidden" }}>
            {loading ? "Creating your account…" : ""}
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
