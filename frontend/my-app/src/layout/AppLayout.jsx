import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Navbar from "../components/Navbar"; // ✅ this is your Navbar.jsx
import "../styles/Navbar.css"; // ✅ navbar styles
import "../styles/appLayout.css"; // keep your layout styles

const { Header, Content, Footer } = Layout;

export default function AppLayout() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // ✅ scroll animation trigger
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ keep RBAC available (use in Navbar dropdown later if you want)
  const role = user?.role || "user";
  const isAdmin = role === "admin" || role === "manager";

  // optional: expose these to Navbar later via props if you want
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

  return (
    <Layout style={{ minHeight: "100vh" }} className="osq-shell">
      {/* ✅ AntD header gets your navbar classes so CSS applies */}
      <Header className={`osq-navbar ${scrolled ? "is-scrolled" : ""}`}>
        {/* ✅ Navbar controls all nav items (remove inline nav from AppLayout) */}
        <Navbar {...authMeta} />
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