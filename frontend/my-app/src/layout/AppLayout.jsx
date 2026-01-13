import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Navbar from "../components/Navbar";
import "../styles/Navbar.css";
import "../styles/appLayout.css";

/* ✅ IMPORTANT: load Skyrio theme system */
import "../styles/skyrio-theme.css";

const { Header, Content, Footer } = Layout;

/* -------------------------------------------
   Route → Theme Mapper
-------------------------------------------- */
function themeForPath(pathname) {
  if (pathname.startsWith("/booking")) return "sk-theme-book";
  if (pathname.startsWith("/passport")) return "sk-theme-passport";
  if (pathname.startsWith("/skystream")) return "sk-theme-social";
  return "sk-theme-discover";
}

export default function AppLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  /* ✅ Landing stays untouched */
  const isLanding = pathname === "/";

  /* -------------------------------------------
     Scroll Detection (Navbar polish)
  -------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* -------------------------------------------
     Auth Meta (passed to Navbar)
  -------------------------------------------- */
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

  /* -------------------------------------------
     Shell Classes (theme-driven)
  -------------------------------------------- */
  const shellClass = isLanding
    ? "osq-shell"
    : `osq-shell sk-appShell ${themeForPath(pathname)}`;

  const shellStyle = {
    minHeight: "100vh",
  };

  return (
    <Layout className={shellClass} style={shellStyle}>
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