import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { Avatar, Dropdown, Button, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

import "../styles/Navbar.css";
import logo from "../assets/logo/skyrio-logo-mark-512.png"; 

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

  const navTheme = useMemo(() => {
    if (pathname.startsWith("/passport")) return "theme-passport";
    if (pathname.startsWith("/booking")) return "theme-book";
    if (pathname.startsWith("/skystream")) return "theme-skystream";
    return "theme-discover";
  }, [pathname]);

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
      reason: "Log in to access your Passport, DMs, and saved trips.",
    });

  const openSignup = () =>
    openAuth({
      intent: "signup",
      reason: "Create an account to save trips and join SkyStream.",
    });

  return (
    <header className={`sk-nav ${navTheme} ${scrolled ? "is-compact" : ""}`}>
      <div className="sk-nav-inner">
        {/* LEFT */}
        <div className="sk-left">
          <button
            className="sk-brand"
            onClick={() => navigate("/")}
            type="button"
            aria-label="Go to homepage"
          >
            <span className="sk-logoWrap" aria-hidden="true">
              <img
                src={logo}
                alt="Skyrio"
                className="sk-logoImg"
                draggable="false"
              />
            </span>
          </button>
        </div>

        {/* CENTER */}
        <nav className="sk-centerNav" aria-label="Primary">
          <div className="sk-navPills">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `sk-link ${isActive ? "is-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* RIGHT */}
        <div className="sk-right">
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
                      size={36}
                      src={user?.avatarUrl}
                      icon={!user?.avatarUrl ? <UserOutlined /> : null}
                    />
                  </button>
                </Dropdown>
              )}
            </div>
          )}

          {/* MOBILE HAMBURGER */}
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
    </header>
  );
}