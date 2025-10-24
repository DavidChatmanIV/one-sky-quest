import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Link, useLocation } from "react-router-dom";
import { Button, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "../styles/Navbar.css";

//  Use the Link-based menu for reliable routing
import BookMenu from "./BookMenu";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [loggedIn, setLoggedIn] = useState(false);
  const [aiChoice, setAiChoice] = useState("Questy");
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Demo auth toggle — replace with real auth later
  const handleAuthClick = () => {
    if (loggedIn) {
      setLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  // 🔽 Membership dropdown (kept as-is)
  const membershipMenu = {
    items: [
      {
        key: "membership",
        label: <NavLink to="/membership">👑 Membership</NavLink>,
      },
      { key: "vault", label: <NavLink to="/sky-vault">💎 Sky Vault</NavLink> },
    ],
  };

  // 🔽 AI switcher dropdown (kept as-is)
  const aiMenu = {
    items: [
      { key: "Questy", label: "Questy" },
      { key: "Sora", label: "Sora" },
    ],
    onClick: ({ key }) => setAiChoice(key),
  };

  return (
    <>
      {/* ===================== TOP NAV ===================== */}
      <header className="osq-navbar">
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
            {/* Replaces old inline Dropdown with Link-based BookMenu */}
            <BookMenu />
            {/* highlight when on /booking */}
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
            <Button type="link" className="nav-link" onClick={handleAuthClick}>
              {loggedIn ? "Log out" : "Log in"}
            </Button>

            <Dropdown menu={aiMenu} placement="bottomRight">
              <Button type="link" className="nav-link" aria-haspopup="menu">
                {aiChoice} <DownOutlined className="chev" />
              </Button>
            </Dropdown>

            <Link
              to="/notifications"
              className="btn icon"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3a6 6 0 0 0-6 6v2.2c0 .6-.2 1.2-.6 1.7L4 14.5c-.5.7 0 1.7.9 1.7H19c.9 0 1.4-1 .9-1.7l-1.4-1.6c-.4-.5-.6-1.1-.6-1.7V9a6 6 0 0 0-6-6Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M9.8 18.5a2.2 2.2 0 0 0 4.4 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span className="notif-dot" />
            </Link>

            <Button
              className="btn cta start-btn"
              onClick={() => navigate("/booking")}
            >
              Start Planning
            </Button>
          </div>
        </div>
      </header>

      {/* ===================== SUBNAV ===================== */}
      <div className="osq-subnav">
        <NavLink to="/tutorial" className="pill">
          📖 Tutorial
        </NavLink>
      </div>

      {/* ===================== MOBILE PANEL ===================== */}
      <div className={`mobile-panel ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-panel-inner">
          <nav className="mobile-list">
            {/* Keep Book as a simple button on mobile */}
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
            <NavLink
              to="/tutorial"
              className={({ isActive }) =>
                `mobile-item ${isActive ? "active" : ""}`
              }
            >
              Tutorial
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
            <Button
              type="link"
              className="mobile-login"
              onClick={handleAuthClick}
            >
              {loggedIn ? "Log out" : "Log in"}
            </Button>
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
