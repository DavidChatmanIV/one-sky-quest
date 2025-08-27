import React, { useMemo } from "react";
import { Layout, Dropdown, Button, Space, Avatar, Badge } from "antd";
import {
  BookOutlined,
  CompassOutlined,
  StarOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  FlagOutlined,
  DownOutlined,
  UserOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  LoginOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Notifications from "./Notifications.jsx";
import { useAssistant } from "../context/AssistantContext.jsx"; 
import "../styles/Navbar.css";

const { Header } = Layout;

/* ---------- Routes ---------- */
const PATHS = {
  booking: "/booking",
  feed: "/questfeed",
  profile: "/profile",
  uniqueStays: "/unique-stays",
  lastMinute: "/last-minute",
  buildTripAI: "/build-trip#ai-builder",
  teamTravel: "/team-travel",
  membership: "/membership",
};

/* Primary (center) */
const PRIMARY = [
  { path: PATHS.booking, label: "Book", icon: <BookOutlined /> },
  { path: PATHS.feed, label: "Feed", icon: <CompassOutlined /> },
  { path: PATHS.uniqueStays, label: "Unique Stays", icon: <StarOutlined /> },
  {
    path: PATHS.lastMinute,
    label: "Last-Minute",
    icon: <ThunderboltOutlined />,
  },
];

/* ---------- Helpers ---------- */
const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p?.[0]?.toUpperCase() ?? "")
    .join("") || "U";
const firstName = (name = "") =>
  (name.trim().split(/\s+/)[0] || "").slice(0, 16);
const safeJSON = (s, fb = null) => {
  try {
    return JSON.parse(s);
  } catch {
    return fb;
  }
};

/* Navbar*/
export default function Navbar({
  onOpenTutorial,
  user: userProp = null, // { name, avatarUrl } | null
  onLogin, // optional: () => void
  onLogout, // optional: () => void
} = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { assistant = "sora", setAssistant = () => {} } = useAssistant() ?? {};

  // ----- Auth fallbacks (work even without a real backend yet) -----
  const goLogin =
    onLogin ??
    (() => {
      navigate("/login");
    });

  const goLogout =
    onLogout ??
    (() => {
      try {
        localStorage.removeItem("osq_token");
        localStorage.removeItem("osq_user");
        sessionStorage.clear();
        // If you set a cookie for auth, expire it as well:
        // document.cookie = "osq_token=; Max-Age=0; path=/";
      } catch (err) {
        // keep catch non-empty to satisfy eslint(no-empty)
        console.warn("Logout cleanup failed:", err);
      } finally {
        navigate("/");
      }
    });

  // If no prop user, infer from localStorage so the menu/UI still works pre-auth
  const token = userProp ? true : !!localStorage.getItem("osq_token");
  const inferredUser = safeJSON(localStorage.getItem("osq_user"), null);
  const user = userProp || (token && inferredUser) || null;
  const isAuthed = !!user || !!token;

  const isActive = (p) =>
    p === "/" ? location.pathname === "/" : location.pathname.startsWith(p);

  const assistantMenuItems = [
    { key: "sora", label: "Sora (Calm & Helpful)" },
    { key: "questy", label: "Questy (Fun & Fast)" },
  ];

  // ---- Account dropdown items + click handler (AntD v5 style) ----
  const accountItems = useMemo(() => {
    return isAuthed
      ? [
          {
            key: "profile",
            label: <Link to={PATHS.profile}>Profile</Link>,
            icon: <UserOutlined />,
          },
          { key: "settings", label: "Settings", icon: <SettingOutlined /> },
          { type: "divider" },
          { key: "logout", label: "Log out", icon: <LogoutOutlined /> },
        ]
      : [
          { key: "login", label: "Log in", icon: <LoginOutlined /> },
          {
            key: "signup",
            label: <Link to="/signup">Sign up</Link>,
            icon: <UserOutlined />,
          },
        ];
  }, [isAuthed]);

  const onAccountClick = ({ key }) => {
    if (key === "login") return goLogin();
    if (key === "logout") return goLogout();
    if (key === "profile") return navigate(PATHS.profile);
    if (key === "settings") return navigate("/settings");
    if (key === "signup") return navigate("/signup");
  };

  return (
    <div>
      {/* ===== Top bar ===== */}
      <Header className="osq-header">
        <div className="osq-header-grid">
          {/* Left: Brand */}
          <Link to="/" className="logo-link" aria-label="One Sky Quest">
            <Avatar size={28} style={{ background: "#1677ff" }}>
              🌍
            </Avatar>
            <span className="logo-text">One Sky Quest</span>
          </Link>

          {/* Center: Primary */}
          <nav aria-label="Primary" className="osq-nav">
            <ul className="nav-list">
              {PRIMARY.map((l) => (
                <li key={l.path} className="nav-item">
                  <Link
                    to={l.path}
                    className={`nav-link ${isActive(l.path) ? "active" : ""}`}
                    title={l.label}
                  >
                    <span className="nav-icon">{l.icon}</span>
                    <span className="nav-label">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Account + Assistant + Notifs + CTA */}
          <div className="osq-right">
            {/* Account (Login / Avatar dropdown) */}
            <Dropdown
              trigger={["click"]}
              menu={{ items: accountItems, onClick: onAccountClick }}
            >
              <Button className="nav-button account-btn">
                <Space size={6}>
                  {isAuthed ? (
                    <Avatar size={20} src={user?.avatarUrl}>
                      {initials(user?.name)}
                    </Avatar>
                  ) : (
                    <Avatar
                      size={20}
                      style={{ background: "#f1f5f9", color: "#334155" }}
                    >
                      <LoginOutlined />
                    </Avatar>
                  )}
                  <span className="account-name hide-sm">
                    {isAuthed ? firstName(user?.name || "Account") : "Log in"}
                  </span>
                  <DownOutlined style={{ fontSize: 10, opacity: 0.7 }} />
                </Space>
              </Button>
            </Dropdown>

            {/* Assistant switcher */}
            <Dropdown
              trigger={["click"]}
              menu={{
                selectedKeys: [assistant],
                items: assistantMenuItems,
                onClick: ({ key }) => setAssistant?.(key),
              }}
            >
              <Button className="nav-button">
                <Space size={6}>
                  <Avatar size={20} style={{ background: "#e6f4ff" }}>
                    {assistant === "questy" ? "Q" : "S"}
                  </Avatar>
                  <span className="hide-sm">
                    {assistant === "questy" ? "Questy" : "Sora"}
                  </span>
                  <DownOutlined style={{ fontSize: 10, opacity: 0.7 }} />
                </Space>
              </Button>
            </Dropdown>

            <Badge offset={[-2, 6]}>
              <Notifications />
            </Badge>

            <Button
              type="primary"
              className="start-btn"
              icon={<RocketOutlined />}
              onClick={() => navigate(PATHS.buildTripAI)}
            >
              Start Planning
            </Button>
          </div>
        </div>
      </Header>

      {/* ===== Sub-bar ===== */}
      <div className="osq-subbar">
        <div className="subbar-inner">
          <nav aria-label="Secondary">
            <ul className="subnav-list">
              <li className="subnav-item">
                <Link
                  to={PATHS.teamTravel}
                  className={`subnav-link ${
                    isActive(PATHS.teamTravel) ? "active" : ""
                  }`}
                >
                  <span className="subnav-icon">
                    <FlagOutlined />
                  </span>
                  <span>Team Travel</span>
                </Link>
              </li>
              <li className="subnav-item">
                <Link
                  to={PATHS.profile}
                  className={`subnav-link ${
                    isActive(PATHS.profile) ? "active" : ""
                  }`}
                >
                  <span className="subnav-icon">
                    <UserOutlined />
                  </span>
                  <span>Profile</span>
                </Link>
              </li>
              <li className="subnav-item">
                <Link to={PATHS.membership} className="subnav-link">
                  <span className="subnav-icon">
                    <StarOutlined />
                  </span>
                  <span>Membership</span>
                </Link>
              </li>
              <li className="subnav-item">
                <button
                  type="button"
                  className="subnav-link"
                  onClick={() => onOpenTutorial?.()}
                >
                  <span className="subnav-icon">
                    <InfoCircleOutlined />
                  </span>
                  <span>Tutorial</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
