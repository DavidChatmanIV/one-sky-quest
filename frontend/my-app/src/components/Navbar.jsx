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

  // close mobile menu on route change
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

  // ✅ block Passport for logged-out OR guest (works for desktop + mobile)
  const handlePassportClick = (e) => {
    const href = e?.currentTarget?.getAttribute("href");
    const isPassport = href === "/passport";

    if (!isPassport) return;

    if (!isAuthed || isGuest) {
      e.preventDefault();
      setMobileOpen(false);
      openAuth({
        intent: isAuthed ? "signup" : "login",
        reason: isGuest
          ? "Guest mode can’t access Passport. Create an account to unlock it."
          : "Log in to access your Digital Passport.",
      });
    }
  };

  return (
    <header className={`sk-nav ${navTheme} ${scrolled ? "is-compact" : ""}`}>
      <div className="sk-nav-inner">
        {/* LEFT */}
        <div className="sk-left">
          <button
            className="sk-brand"
            onClick={() => {
              setMobileOpen(false);
              navigate("/");
            }}
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

        {/* CENTER (desktop nav) */}
        <nav className="sk-centerNav" aria-label="Primary">
          <div className="sk-navPills">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={(e) => {
                  if (item.to === "/passport") handlePassportClick(e);
                }}
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
                  // ✅ KEY FIX for iOS + fixed / glass headers:
                  getPopupContainer={(node) => node.parentElement}
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

      {/* ✅ MOBILE MENU PANEL (this is what you were missing) */}
      {mobileOpen && (
        <div className="sk-mobileMenu" role="dialog" aria-label="Mobile menu">
          <div className="sk-mobileMenuInner">
            {navItems.map((item) => (
              <NavLink
                key={`m-${item.to}`}
                to={item.to}
                end={item.to === "/"}
                onClick={(e) => {
                  if (item.to === "/passport") handlePassportClick(e);
                  else setMobileOpen(false);
                }}
                className={({ isActive }) =>
                  `sk-mobileLink ${isActive ? "is-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="sk-mobileActions">
              {!isAuthed ? (
                <>
                  <Button className="sk-btnGhost" block onClick={openLogin}>
                    Log in
                  </Button>
                  <Button
                    type="primary"
                    className="sk-btnPrimary"
                    block
                    onClick={openSignup}
                  >
                    Sign up
                  </Button>
                </>
              ) : isGuest ? (
                <Button
                  type="primary"
                  className="sk-btnPrimary"
                  block
                  onClick={openSignup}
                >
                  Upgrade
                </Button>
              ) : (
                <Button danger block onClick={handleLogout}>
                  Log out
                </Button>
              )}
            </div>

            <button
              className="sk-mobileClose"
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}