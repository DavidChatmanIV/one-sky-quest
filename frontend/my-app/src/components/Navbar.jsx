import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Avatar, Dropdown, Button, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import "../styles/Navbar.css";
import { useAuth } from "../hooks/useAuth";

import logo from "../assets/logo/skyrio-logo.png";

const navItems = [
  { label: "Discover", to: "/" },
  { label: "Book", to: "/booking" },
  { label: "SkyStream", to: "/skystream" },
  { label: "Passport", to: "/passport", className: "passport-pill" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const auth = useAuth?.();
  const user = auth?.user || null;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayName = useMemo(() => {
    return (
      user?.name ||
      user?.username ||
      (user?.email ? user.email.split("@")[0] : "")
    );
  }, [user]);

  const isLoggedIn = !!user;

  const handleLogout = () => {
    if (auth?.logout) auth.logout();
    else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    message.success("See you next trip ✈️");
    navigate("/");
  };

  const avatarMenu = {
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        onClick: () => navigate("/dashboard"),
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Log out",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <header className={`sk-nav ${scrolled ? "is-scrolled is-compact" : ""}`}>
      <div className="sk-nav-inner">
        {/* LEFT: Brand */}
        <button
          className="sk-brand"
          onClick={() => navigate("/")}
          type="button"
        >
          <img
            src={logo}
            alt="Skyrio"
            className="sk-logoImg"
            draggable="false"
          />
          <span className="sk-logoText">Skyrio</span>
        </button>

        {/* CENTER */}
        <div className="sk-mid">
          <nav className="sk-links" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `sk-link ${item.className || ""} ${
                    isActive ? "is-active" : ""
                  }`.trim()
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="sk-actions">
          {/* ✅ Desktop-only actions wrapper (fixes duplicate buttons) */}
          <div className="sk-actions-desktop">
            {!isLoggedIn ? (
              <>
                <Button
                  type="primary"
                  className="sk-btnPrimary"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>

                <Button
                  className="sk-btnGhost"
                  type="default"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
              </>
            ) : (
              <div className="sk-user">
                <span className="sk-hello">Hey, {displayName}</span>

                <Dropdown
                  menu={avatarMenu}
                  placement="bottomRight"
                  trigger={["click"]}
                  overlayClassName="sk-dropdown"
                >
                  <button
                    className="sk-avatarBtn"
                    type="button"
                    aria-label="Account menu"
                  >
                    <Avatar
                      size={34}
                      src={user?.avatarUrl}
                      icon={!user?.avatarUrl ? <UserOutlined /> : null}
                    />
                  </button>
                </Dropdown>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`hamburger ${mobileOpen ? "is-open" : ""}`}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Glow line */}
      <div className="sk-glowline" />

      {/* MOBILE PANEL */}
      <div className={`mobile-panel ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-panel-inner">
          <nav className="mobile-list">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `mobile-item ${isActive ? "active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mobile-actions">
            {!isLoggedIn ? (
              <Button
                type="primary"
                className="mobile-primary"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
            ) : (
              <Button danger onClick={handleLogout}>
                Log out
              </Button>
            )}
          </div>
        </div>

        <button
          className="mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      </div>
    </header>
  );
}