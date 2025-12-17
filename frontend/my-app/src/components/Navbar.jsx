import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Button, Dropdown, Avatar, Tooltip, message } from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "../styles/Navbar.css";

import BookMenu from "./BookMenu";
import NotificationsBell from "./NotificationsBell.jsx";
import TutorialModal from "../components/TutorialModal"; // adjust if needed

// If you already have useAuth, use it.
// If you don't, you can temporarily set user to null and it will fall back to Log in.
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const auth = useAuth?.(); // safe call if hook exists
  const user = auth?.user || null;

  const [aiChoice, setAiChoice] = useState("Questy");
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ scroll animation state
  const [scrolled, setScrolled] = useState(false);

  // ✅ tutorial modal open state (replay 30-sec tour)
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const isBooking = pathname.startsWith("/booking");
  const isMemberSection =
    pathname.startsWith("/membership") || pathname.startsWith("/sky-vault");
  const isTeamTravel = pathname.startsWith("/team-travel");

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ✅ Animate navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Display name = actual username (fallbacks)
  const displayName = useMemo(() => {
    return (
      user?.name ||
      user?.username ||
      (user?.email ? user.email.split("@")[0] : "")
    );
  }, [user]);

  const isLoggedIn = !!user;

  // ✅ single auth behavior
  const handleLoginClick = () => navigate("/login");

  const handleLogout = () => {
    if (auth?.logout) auth.logout();
    else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    message.success("See you next trip ✈️");
    navigate("/");
  };

  // 🔽 Membership dropdown (kept)
  const membershipMenu = {
    items: [
      {
        key: "membership",
        label: <NavLink to="/membership">👑 Membership</NavLink>,
      },
      { key: "vault", label: <NavLink to="/sky-vault">💎 Sky Vault</NavLink> },
    ],
  };

  // 🔽 AI switcher dropdown (kept)
  const aiMenu = {
    items: [
      { key: "Questy", label: "Questy" },
      { key: "Sora", label: "Sora" },
    ],
    onClick: ({ key }) => setAiChoice(key),
  };

  // ✅ Avatar dropdown (authenticated)
  const avatarMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Profile",
        onClick: () => navigate("/profile"),
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Settings",
        onClick: () => navigate("/settings"),
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Log out",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <>
      {/* ===================== TOP NAV ===================== */}
      <header className={`osq-navbar ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-left">
          {/* Brand */}
          <button
            className="brand"
            onClick={() => navigate("/")}
            aria-label="Skyrio Home"
          >
            <span className="dot" />
            Skyrio
          </button>

          {/* Desktop pillars */}
          <div className="nav-pillars-desktop">
            <BookMenu />
            {isBooking && <span className="active-underline" />}

            <NavLink to="/feed" className="nav-link">
              Feed
            </NavLink>

            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>

            <Dropdown menu={membershipMenu} placement="bottomLeft">
              <button
                className={`nav-link ${isMemberSection ? "active" : ""}`}
                type="button"
              >
                Membership <DownOutlined className="chev" />
              </button>
            </Dropdown>

            <NavLink
              to="/team-travel"
              className={`nav-link ${isTeamTravel ? "active" : ""}`}
            >
              Team Travel
            </NavLink>
          </div>
        </div>

        {/* Right actions */}
        <div className="nav-right">
          {/* Hamburger (mobile only) */}
          <button
            className={`hamburger ${mobileOpen ? "is-open" : ""}`}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Desktop actions */}
          <div className="nav-actions-desktop">
            {/* ✅ Replay Tour (icon only) */}
            <Tooltip title="Replay 30-sec tour">
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={() => setTutorialOpen(true)}
                aria-label="Replay tour"
                className="nav-tour-btn"
              />
            </Tooltip>

            <Dropdown menu={aiMenu} placement="bottomRight">
              <Button type="link" className="nav-link" aria-haspopup="menu">
                {aiChoice} <DownOutlined className="chev" />
              </Button>
            </Dropdown>

            <NotificationsBell />

            <Button
              className="btn cta start-btn"
              onClick={() => navigate("/booking")}
            >
              Start Planning
            </Button>

            {/* Auth swap: Log in -> Avatar dropdown */}
            {!isLoggedIn ? (
              <Button
                type="link"
                className="nav-link"
                onClick={handleLoginClick}
              >
                Log in
              </Button>
            ) : (
              <div className="nav-user">
                <span className="nav-hello">Hey, {displayName} 👋</span>
                <Dropdown
                  menu={avatarMenu}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <button
                    className="nav-avatar-btn"
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
        </div>
      </header>

      {/* Tutorial Modal */}
      <TutorialModal
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
      />

      {/* ===================== SUBNAV ===================== */}
      <div className="osq-subnav">
        <button className="pill" onClick={() => setTutorialOpen(true)}>
          📖 Tutorial
        </button>
      </div>

      {/* ===================== MOBILE PANEL ===================== */}
      <div className={`mobile-panel ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-panel-inner">
          <nav className="mobile-list">
            <button
              className={`mobile-item ${isBooking ? "active" : ""}`}
              onClick={() => navigate("/booking")}
            >
              Book
            </button>

            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `mobile-item ${isActive ? "active" : ""}`
              }
            >
              Feed
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `mobile-item ${isActive ? "active" : ""}`
              }
            >
              Profile
            </NavLink>

            <NavLink
              to="/membership"
              className={({ isActive }) =>
                `mobile-item ${isActive || isMemberSection ? "active" : ""}`
              }
            >
              Membership
            </NavLink>

            <NavLink
              to="/sky-vault"
              className={({ isActive }) =>
                `mobile-sub ${isActive ? "active" : ""}`
              }
            >
              — Sky Vault
            </NavLink>

            <NavLink
              to="/team-travel"
              className={({ isActive }) =>
                `mobile-item ${isActive ? "active" : ""}`
              }
            >
              Team Travel
            </NavLink>
          </nav>

          <div className="mobile-actions">
            <button
              className="mobile-ai"
              onClick={() =>
                setAiChoice(aiChoice === "Questy" ? "Sora" : "Questy")
              }
            >
              Assistant: {aiChoice}
            </button>

            <Button
              className="btn cta start-btn"
              onClick={() => navigate("/booking")}
            >
              Start Planning
            </Button>

            {!isLoggedIn ? (
              <Button
                type="link"
                className="mobile-login"
                onClick={handleLoginClick}
              >
                Log in
              </Button>
            ) : (
              <>
                <div className="mobile-hello">Hey, {displayName} 👋</div>
                <Button
                  type="link"
                  className="mobile-login"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            )}
          </div>
        </div>

        <button
          className="mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      </div>
    </>
  );
}