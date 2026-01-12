import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Navbar from "../components/Navbar";
import "../styles/Navbar.css";
import "../styles/appLayout.css";

/* ✅ IMPORTANT: load Skyrio theme system */
import "../styles/skyrio-theme.css";

/* ✅ Option A: Vite-safe background import */
import galaxy from "../assets/Background/skyrio-galaxy.png";

const { Header, Content, Footer } = Layout;

function themeForPath(pathname) {
  if (pathname.startsWith("/booking")) return "sk-theme-book";
  if (pathname.startsWith("/passport")) return "sk-theme-passport";
  if (pathname.startsWith("/skystream")) return "sk-theme-social"; // optional
  return "sk-theme-discover";
}

export default function AppLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // ✅ Landing stays untouched
  const isLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const role = user?.role || "user";
  const isAdmin = role === "admin" || role === "manager";

  const authMeta = useMemo(
    () => ({
      isAuthenticated: !!user,
      displayName:
        user?.name ||
        user?.username ||
        (user?.email ? user.email.split("@")[0] : "Explorer"),
      isAdmin,
      role,
    }),
    [user, isAdmin, role]
  );

  // ✅ Put theme class + bg var on the Layout itself (guaranteed in DOM)
  const shellClass = isLanding
    ? "osq-shell"
    : `osq-shell sk-appShell ${themeForPath(pathname)}`;

  const shellStyle = isLanding
    ? { minHeight: "100vh" }
    : {
        minHeight: "100vh",
        "--sk-bg-image": `url(${galaxy})`,
      };

  return (
    <Layout style={shellStyle} className={shellClass}>
      <Header className={`osq-navbar ${scrolled ? "is-scrolled" : ""}`}>
        <Navbar {...authMeta} />
      </Header>

      <Content className="osq-main">
        <Outlet />
      </Content>

      <Footer
        style={{
          textAlign: "center",
          background: "transparent",
          color: "rgba(255,255,255,0.65)",
        }}
      >
        © {new Date().getFullYear()} Skyrio
      </Footer>
    </Layout>
  );
}
