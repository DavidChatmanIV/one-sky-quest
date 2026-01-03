import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Avatar, Dropdown, Button, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

import "../styles/Navbar.css";
import logo from "../assets/logo/skyrio-logo.png";

import { useAuth } from "../auth/useAuth";
import { useAuthModal } from "../auth/AuthModalController";

const navItems = [
  { label: "Discover", to: "/" },
  { label: "Book", to: "/booking" },
  { label: "SkyStream", to: "/skystream" },
  { label: "Passport", to: "/passport" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const auth = useAuth();
  const { openAuth } = useAuthModal();

  const isAuthed = !!auth?.isAuthed;
  const isGuest = !!auth?.isGuest;

  const user =
    auth?.user ||
    (() => {
      try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayName = useMemo(() => {
    return (
      user?.name ||
      user?.username ||
      (user?.email ? user.email.split("@")[0] : "") ||
      (isGuest ? "Guest" : "")
    );
  }, [user, isGuest]);

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

  const openLogin = () =>
    openAuth({
      intent: "login",
      reason: "Log in to access your Passport, DMs, and saves.",
    });

  const openSignup = () =>
    openAuth({
      intent: "signup",
      reason: "Create an account to save trips and join SkyStream.",
    });

  // ✅ Keep text OFF for now (your logo already carries brand)
  const SHOW_BRAND_TEXT = false;

  return (
    <header className={`sk-nav ${scrolled ? "is-scrolled is-compact" : ""}`}>
      <div className="sk-nav-inner">
        {/* LEFT */}
        <div className="sk-left">
          <button
            className="sk-brand"
            onClick={() => navigate("/")}
            type="button"
            aria-label="Home"
          >
            <img src={logo} alt="Skyrio" className="sk-logoImg" />
            {SHOW_BRAND_TEXT ? (
              <span className="sk-logoText">Skyrio</span>
            ) : null}
          </button>
        </div>

        {/* CENTER */}
        <nav className="sk-centerNav" aria-label="Primary">
          <div className="sk-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `sk-link ${isActive ? "is-active" : ""}`
                }
              >
                <span className="sk-linkLabel">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* RIGHT */}
        <div className="sk-right">
          <div className="sk-actions">
            <div className="sk-actions-desktop">
              {!isAuthed ? (
                <>
                  <Button className="sk-btnGhost" onClick={openLogin}>
                    Log in
                  </Button>
                  <Button
                    type="primary"
                    className="sk-btnPrimary"
                    onClick={openSignup}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <div className="sk-user">
                  <span className="sk-hello">
                    Hey, {displayName}
                    {isGuest ? " ✨" : ""}
                  </span>

                  {isGuest ? (
                    <Button
                      type="primary"
                      className="sk-btnPrimary"
                      onClick={openSignup}
                    >
                      Upgrade
                    </Button>
                  ) : (
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
                          az
                          size={34}
                          src={user?.avatarUrl}
                          icon={!user?.avatarUrl ? <UserOutlined /> : null}
                        />
                      </button>
                    </Dropdown>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className={`hamburger ${mobileOpen ? "is-open" : ""}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {/* Optional glow line (now subtle) */}
      <div className="sk-glowline" />

      {/* MOBILE PANEL */}
      <div className={`mobile-panel ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-panel-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="mobile-item"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          {!isAuthed ? (
            <>
              <Button className="mobile-ghost" onClick={openLogin}>
                Log in
              </Button>
              <Button
                type="primary"
                className="mobile-primary"
                onClick={openSignup}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              {isGuest ? (
                <Button
                  type="primary"
                  className="mobile-primary"
                  onClick={openSignup}
                >
                  Upgrade
                </Button>
              ) : null}
              <Button danger onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}