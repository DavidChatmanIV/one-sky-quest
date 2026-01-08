import React, { useState, useRef, useMemo, useEffect } from "react";
import { Input, Button, message, Typography, notification, Tag } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import BoardingPassToast from "../components/BoardingPassToast";
import AuthLayout from "../layout/AuthLayout";

import "../styles/LoginBoardingPass.css";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // ✨ scan animation state
  const [isScanning, setIsScanning] = useState(false);

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

  // 🧠 Passenger auto-updates (premium)
  const passenger = useMemo(() => {
    const raw = (formData.emailOrUsername || "").trim();
    if (!raw) return "Explorer";

    const cleaned = raw.includes("@") ? raw.split("@")[0] : raw;
    return cleaned.length > 18 ? cleaned.slice(0, 18) + "…" : cleaned;
  }, [formData.emailOrUsername]);

  // Stop scan if loading finishes (safety)
  useEffect(() => {
    if (!loading) setIsScanning(false);
  }, [loading]);

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
    setIsScanning(true);

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
        (data.user?.email ? data.user.email.split("@")[0] : passenger);

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
      nav(redirectTo, { replace: true });
    } catch (err) {
      successHandledRef.current = false;
      message.error(err.message || "Login failed");
      setIsScanning(false);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const routeLabel = redirectTo === "/dashboard" ? "Dashboard" : redirectTo;

  return (
    <AuthLayout>
      <div className="sk-authWrap">
        {/* Minimal hero (boarding pass is the star) */}
        <div className="sk-authHero">
          <Title level={1} className="sk-authTitle">
            Welcome back, Explorer
          </Title>
          <Text className="sk-authSubtitle">
            Check in fast. Earn XP. Keep it moving.
          </Text>
        </div>

        {/* Boarding Pass */}
        <div
          className={`sk-pass ${isScanning ? "isScanning" : ""}`}
          onKeyDown={onKeyDown}
          role="form"
          aria-busy={loading ? "true" : "false"}
        >
          <div className="sk-passScan" aria-hidden="true" />

          {/* Header */}
          <div className="sk-passHeader">
            <div className="sk-passBrand">
              <div className="sk-dot" aria-hidden />
              <Text className="sk-passBrandText">Skyrio</Text>
            </div>

            <Tag className="sk-passChip">
              SKY <span className="sk-chipSep">•</span> Gate A3
            </Tag>
          </div>

          <div className="sk-passBig">
            <Text className="sk-passLabel">BOARDING PASS</Text>
          </div>

          {/* Passenger + status */}
          <div className="sk-passRow">
            <div className="sk-passCol">
              <Text className="sk-passMiniLabel">Passenger</Text>
              <Text className="sk-passPassenger">{passenger}</Text>
            </div>
            <div className="sk-passCol sk-passColRight">
              <Text className="sk-passMiniLabel">Status</Text>
              <Text className="sk-passValue">
                {loading ? "Checking in…" : "Ready"}
              </Text>
            </div>
          </div>

          {/* Route */}
          <div className="sk-passRoute">
            <div className="sk-routeCol">
              <Text className="sk-passMiniLabel">From</Text>
              <Text className="sk-passValue">Login</Text>
            </div>

            <div className="sk-routeLine" aria-hidden="true">
              <span className="sk-plane">✈</span>
              <span className="sk-routeDash" />
            </div>

            <div className="sk-routeCol sk-routeColRight">
              <Text className="sk-passMiniLabel">To</Text>
              <Text className="sk-passValue">{routeLabel}</Text>
            </div>
          </div>

          {/* Perforation */}
          <div className="sk-passPerforation" aria-hidden="true">
            <span className="sk-notch left" />
            <span className="sk-notch right" />
            <span className="sk-perfLine" />
          </div>

          {/* Form */}
          <div className="sk-passForm">
            <div className="sk-field">
              <Text className="sk-formLabel">Email or username</Text>
              <Input
                prefix={<UserOutlined />}
                placeholder="Email or username"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={(e) =>
                  setFormData({ ...formData, emailOrUsername: e.target.value })
                }
                autoComplete="username"
                onFocus={() => setIsScanning(true)}
                onBlur={() => !loading && setIsScanning(false)}
              />
            </div>

            <div className="sk-field">
              <Text className="sk-formLabel">Password</Text>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoComplete="current-password"
                onFocus={() => setIsScanning(true)}
                onBlur={() => !loading && setIsScanning(false)}
              />
            </div>

            <Button
              type="primary"
              block
              loading={loading}
              onClick={handleLogin}
              className="sk-passCTA"
            >
              🛫 Confirm Boarding
            </Button>

            <div className="sk-authFooter">
              <Text className="sk-footerText">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => nav("/register")}
                  className="sk-footerLink"
                >
                  Create a boarding pass
                </button>
              </Text>
            </div>
          </div>

          {/* Barcode */}
          <div className="sk-passBarcode" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>

          <div aria-live="polite" className="sr-only">
            {loading ? "Signing in…" : ""}
          </div>
        </div>

        <footer className="sk-authCopyright">
          <Text className="sk-fineText">
            © {new Date().getFullYear()} Skyrio
          </Text>
        </footer>
      </div>
    </AuthLayout>
  );
}
