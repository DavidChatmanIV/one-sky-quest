import React, { useEffect, useState } from "react";
import {
  Layout,
  Avatar,
  Dropdown,
  Badge,
  Button,
  Typography,
  Grid,
  Space,
} from "antd";
import {
  HomeOutlined,
  CompassOutlined,
  StarOutlined,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  MoreOutlined,
  DownOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Notifications from "./Notifications";
import { useAssistant } from "../context/AssistantContext.jsx";
import "../styles/Navbar.css";

const { Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const navLinks = [
  { path: "/", label: "Home", icon: <HomeOutlined /> },
  { path: "/questfeed", label: "Feed", icon: <CompassOutlined /> },
  { path: "/profile", label: "Profile", icon: <UserOutlined /> },
  { path: "/dm", label: "DMs", icon: <MessageOutlined /> },
  { path: "/booking", label: "Book", icon: <StarOutlined /> },
  { path: "/membership", label: "Plans", icon: <CrownOutlined /> },
];

const assistantOptions = [
  {
    key: "sora",
    label: (
      <div className="osq-option">
        <img src="/assets/sora.png" alt="Sora" className="osq-avatar" />
        <div className="osq-meta">
          <div className="osq-name">Sora</div>
          <div className="osq-sub">Chill & Helpful</div>
        </div>
      </div>
    ),
  },
  {
    key: "questy",
    label: (
      <div className="osq-option">
        <img src="/assets/questy.png" alt="Questy" className="osq-avatar" />
        <div className="osq-meta">
          <div className="osq-name">Questy</div>
          <div className="osq-sub">Fun & Fast-Paced</div>
        </div>
      </div>
    ),
  },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { assistant, setAssistant } = useAssistant();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("🔴 Failed to load notifications:", err.message);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("osq_assistant");
    if (saved) setAssistant(saved);
  }, [setAssistant]);

  useEffect(() => {
    localStorage.setItem("osq_assistant", assistant);
  }, [assistant]);

  // ✅ Auto-show tutorial once per login
  useEffect(() => {
    if (isLoggedIn && !localStorage.getItem("osq_tutorial_seen")) {
      setShowTutorialModal(true);
      localStorage.setItem("osq_tutorial_seen", "true");
    }
  }, [isLoggedIn]);

  const profileMenuItems = [
    { key: "profile", label: <Link to="/profile">👤 My Profile</Link> },
    { key: "trips", label: <Link to="/saved-trips">💾 Saved Trips</Link> },
    {
      key: "logout",
      label: <span>🚪 Logout</span>,
      onClick: () => {
        localStorage.removeItem("token");
        window.location.href = "/";
      },
    },
  ];

  const moreMenuItems = [
    { key: "about", label: <Link to="/about">ℹ️ About</Link> },
  ];

  const assistantMenuItems = assistantOptions.map((o) => ({
    key: o.key,
    label: o.label,
    onClick: () => setAssistant(o.key),
  }));

  return (
    <>
      <Header
        className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-white/40 shadow-md"
        style={{ padding: "0.5rem 1rem" }}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* 🌍 Brand */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-700 hover:text-indigo-900 tracking-wide"
          >
            🌍 One <span className="text-orange-500">Sky</span> Quest
          </Link>

          {/* 🔹 Navigation Links */}
          <div className="flex gap-5 items-center">
            {navLinks.map(({ path, label, icon }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative text-sm flex flex-col items-center justify-center ${
                    isActive
                      ? "text-indigo-700 font-semibold"
                      : "text-gray-500 hover:text-indigo-600"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-full h-1 bg-indigo-600 rounded-full animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* 🔧 User Tools */}
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            {!isLoggedIn ? (
              <>
                <Link to="/signup">
                  <Button size="small" type="primary">
                    ✍️ Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="small" type="default">
                    🔑 Log In
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* 🔔 Notifications */}
                <Dropdown
                  menu={{ items: [] }}
                  popupRender={() => <Notifications />}
                  trigger={["click"]}
                  overlayStyle={{ zIndex: 1500 }}
                >
                  <Badge count={unreadCount} size="small" offset={[0, 5]}>
                    <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                  </Badge>
                </Dropdown>

                {/* ⋯ More Menu */}
                <Dropdown menu={{ items: moreMenuItems }} trigger={["click"]}>
                  <MoreOutlined style={{ fontSize: 18, cursor: "pointer" }} />
                </Dropdown>

                {/* 👤 Profile Menu */}
                <Dropdown
                  menu={{ items: profileMenuItems }}
                  trigger={["click"]}
                >
                  <Avatar icon={<UserOutlined />} className="cursor-pointer" />
                </Dropdown>

                {/* 💳 View Plans */}
                <Link to="/membership">
                  <Button size="small" type="default">
                    💳 View Plans
                  </Button>
                </Link>

                {/* 🔁 Replay Tutorial */}
                <Button
                  size="small"
                  onClick={() => {
                    console.log("✅ Replay Tutorial clicked");
                    localStorage.removeItem("osq_tutorial_seen");
                    setShowTutorialModal(true);
                  }}
                >
                  🔁 Replay Tutorial
                </Button>
              </>
            )}

            {/* 🤖 Assistant Switcher */}
            <Dropdown
              menu={{ items: assistantMenuItems }}
              trigger={["click"]}
              placement={isMobile ? "bottom" : "bottomRight"}
            >
              <button
                type="button"
                className="osq-assistant-btn"
                aria-label="Choose assistant"
              >
                <Space size={8}>
                  <img
                    src={
                      assistant === "sora"
                        ? "/assets/sora.png"
                        : "/assets/questy.png"
                    }
                    alt={assistant}
                    className="osq-avatar osq-avatar--current"
                  />
                  {!isMobile && (
                    <Text className="osq-assistant-text">
                      {assistant === "sora" ? "Sora" : "Questy"}
                    </Text>
                  )}
                  <DownOutlined className="osq-caret" />
                </Space>
              </button>
            </Dropdown>
          </div>
        </div>
      </Header>

      {/* 🔁 Tutorial Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-black text-lg"
              onClick={() => setShowTutorialModal(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2">
              Welcome to One Sky Quest ✈️
            </h2>
            <p className="text-gray-700 mb-4">
              This short tutorial will walk you through trip planning, booking,
              and earning XP!
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
              <li>Explore deals on the homepage</li>
              <li>Use “Build My Trip” for smart planning</li>
              <li>Bookmark trips and share with friends</li>
              <li>Earn XP, badges, and unlock hidden perks</li>
              <li>Smart Budget Tracker</li>
            </ul>
            <div className="text-right">
              <Button
                type="primary"
                onClick={() => setShowTutorialModal(false)}
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
