// src/layout/AppLayout.jsx
import React from "react";
import { Layout, Typography, Space, Button, message } from "antd";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/appLayout.css"; // layout-specific styles

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export default function AppLayout() {
  const { user, loading, logout } = useAuth();
  const nav = useNavigate();

  const isAuthenticated = !!user;

  const displayName =
    user?.name ||
    user?.username ||
    (user?.email ? user.email.split("@")[0] : "Explorer");

  const handleLogout = () => {
    // Use hook's logout if available, otherwise fallback
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    message.success("See you next trip, Explorer ✈️");
    nav("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }} className="osq-shell">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          background: "rgba(10, 8, 29, 0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "999px",
              background:
                "radial-gradient(circle at 30% 30%, #ffb347, #ff5f6d)",
            }}
          />
          <Link to="/" style={{ color: "#fff", fontWeight: 600 }}>
            Skyrio
          </Link>
        </div>

        {/* Right side: nav links + auth controls */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Space size="middle">
            <Link to="/booking" style={{ color: "#fff" }}>
              Booking
            </Link>
            <Link to="/feed" style={{ color: "#fff" }}>
              Feed
            </Link>
            <Link to="/profile" style={{ color: "#fff" }}>
              Passport
            </Link>
            <Link to="/dashboard" style={{ color: "#fff" }}>
              Dashboard
            </Link>
          </Space>

          {loading ? (
            <Text style={{ color: "#fff", marginLeft: 16 }}>Loading…</Text>
          ) : isAuthenticated ? (
            <Space size="small" style={{ marginLeft: 16 }}>
              <Text style={{ color: "#fff" }}>Hi, {displayName}</Text>
              <Button size="small" onClick={handleLogout}>
                Log out
              </Button>
            </Space>
          ) : (
            <Space size="small" style={{ marginLeft: 16 }}>
              <Button
                size="small"
                type="link"
                onClick={() => nav("/login")}
                style={{ color: "#fff" }}
              >
                Log in
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() => nav("/register")}
              >
                Join Skyrio
              </Button>
            </Space>
          )}
        </div>
      </Header>

      <Content className="osq-main">
        <Outlet />
      </Content>

      <Footer
        style={{
          textAlign: "center",
          background: "transparent",
          color: "#999",
        }}
      >
        © {new Date().getFullYear()} Skyrio
      </Footer>
    </Layout>
  );
}