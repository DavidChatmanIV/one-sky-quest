import React, { useMemo, useRef, useState, useEffect } from "react";
import { Input, Button, Typography, message, notification, Tag } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import BoardingPassToast from "../components/BoardingPassToast";
import { useAuthModal } from "../auth/AuthModalController";

import galaxyLogin from "../assets/LoginBoardingpass/galaxy-login.png"; // ✅ same bg as login
import "../styles/LoginBoardingPass.css";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const nav = useNavigate();
  const location = useLocation();
  const authModal = useAuthModal();

  const successHandledRef = useRef(false);

  const redirectTo = useMemo(() => {
    const from = location.state?.from;
    if (typeof from === "string" && from.trim().startsWith("/")) return from;
    return "/dashboard";
  }, [location.state]);

  const passenger = useMemo(() => {
    const raw =
      (formData.username || "").trim() ||
      (formData.name || "").trim() ||
      (formData.email || "").trim();

    if (!raw) return "Explorer";
    const cleaned = raw.includes("@") ? raw.split("@")[0] : raw;
    return cleaned.length > 18 ? cleaned.slice(0, 18) + "…" : cleaned;
  }, [formData.username, formData.name, formData.email]);

  useEffect(() => {
    if (!loading) setIsScanning(false);
  }, [loading]);

  const handleRegister = async () => {
    if (loading) return;
    if (successHandledRef.current) return;

    const name = (formData.name || "").trim();
    const username = (formData.username || "").trim();
    const email = (formData.email || "").trim();
    const password = formData.password || "";
    const confirmPassword = formData.confirmPassword || "";

    if (!email || !password) {
      message.warning("Email and password are required.");
      return;
    }
    if (password.length < 8) {
      message.warning("Use at least 8 characters for your password.");
      return;
    }
    if (confirmPassword && confirmPassword !== password) {
      message.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    setIsScanning(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          username: username || undefined,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      const displayName =
        data.user?.name || data.user?.username || passenger || "Explorer";

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

      authModal?.closeAuthModal?.();
      nav(redirectTo, { replace: true });
    } catch (err) {
      successHandledRef.current = false;
      message.error(err.message || "Registration failed");
      setIsScanning(false);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  const routeLabel = redirectTo === "/dashboard" ? "Dashboard" : redirectTo;

  return (
    <AuthLayout>
      <div className="sk-authWrap">
        <div className="sk-authHero">
          <Title level={1} className="sk-authTitle">
            Create your passport
          </Title>
          <Text className="sk-authSubtitle">
            Start earning XP and unlock your first stamp.
          </Text>
        </div>

        <div
          className={`sk-pass ${isScanning ? "isScanning" : ""}`}
          style={{ "--sk-pass-bg": `url(${galaxyLogin})` }} // ✅ add same bg
          onKeyDown={onKeyDown}
          role="form"
          aria-busy={loading ? "true" : "false"}
        >
          <div className="sk-passScan" aria-hidden="true" />

          <div className="sk-passHeader">
            <div className="sk-passBrand">
              <div className="sk-dot" aria-hidden />
              <Text className="sk-passBrandText">Skyrio</Text>
            </div>

            <Tag className="sk-passChip">
              NEW <span className="sk-chipSep">•</span> Gate A1
            </Tag>
          </div>

          <div className="sk-passBig">
            <Text className="sk-passLabel">SIGN-UP PASS</Text>
          </div>

          <div className="sk-passRow">
            <div className="sk-passCol">
              <Text className="sk-passMiniLabel">Passenger</Text>
              <Text className="sk-passPassenger">{passenger}</Text>
            </div>
            <div className="sk-passCol sk-passColRight">
              <Text className="sk-passMiniLabel">Status</Text>
              <Text className="sk-passValue">
                {loading ? "Issuing…" : "Ready"}
              </Text>
            </div>
          </div>

          <div className="sk-passRoute">
            <div className="sk-routeCol">
              <Text className="sk-passMiniLabel">From</Text>
              <Text className="sk-passValue">Register</Text>
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

          <div className="sk-passPerforation" aria-hidden="true">
            <span className="sk-notch left" />
            <span className="sk-notch right" />
            <span className="sk-perfLine" />
          </div>

          <div className="sk-passForm">
            <div className="sk-field">
              <Text className="sk-formLabel">Name (optional)</Text>
              <Input
                prefix={<UserOutlined />}
                placeholder="Name (optional)"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoComplete="name"
                onFocus={() => setIsScanning(true)}
                onBlur={() => !loading && setIsScanning(false)}
              />
            </div>

            <div className="sk-field">
              <Text className="sk-formLabel">Username (recommended)</Text>
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                autoComplete="username"
                onFocus={() => setIsScanning(true)}
                onBlur={() => !loading && setIsScanning(false)}
              />
            </div>

            <div className="sk-field">
              <Text className="sk-formLabel">Email</Text>
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                autoComplete="email"
                onFocus={() => setIsScanning(true)}
                onBlur={() => !loading && setIsScanning(false)}
              />
            </div>

            <div className="sk-field">
              <Text className="sk-formLabel">Password</Text>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoComplete="new-password"
                onFocus={() => setIsScanning(true)}
                onBlur={() => !loading && setIsScanning(false)}
              />
            </div>

            <div className="sk-field">
              <Text className="sk-formLabel">Confirm password</Text>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                autoComplete="new-password"
                onFocus={() => setIsScanning(true)}
                onBlur={() => !loading && setIsScanning(false)}
              />
            </div>

            <Button
              type="primary"
              block
              loading={loading}
              onClick={handleRegister}
              className="sk-passCTA"
            >
              🎟️ Issue Boarding Pass
            </Button>

            <div className="sk-authFooter">
              <Text className="sk-footerText">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => authModal?.setAuthModalMode?.("login")}
                  className="sk-footerLink"
                >
                  Log in
                </button>
              </Text>
            </div>
          </div>

          <div className="sk-passBarcode" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>

          <div aria-live="polite" className="sr-only">
            {loading ? "Creating account…" : ""}
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