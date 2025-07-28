import React, { useEffect, useState } from "react";
import { Layout, Avatar, Dropdown, Badge, Button, Typography } from "antd";
import {
  HomeOutlined,
  CompassOutlined,
  StarOutlined,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Notifications from "./Notifications";

const { Header } = Layout;
const { Text } = Typography;

// 🔗 Navigation Links
const navLinks = [
  { path: "/", label: "Home", icon: <HomeOutlined /> },
  { path: "/questfeed", label: "Feed", icon: <CompassOutlined /> },
  { path: "/profile", label: "Profile", icon: <UserOutlined /> },
  { path: "/dm", label: "DMs", icon: <MessageOutlined /> },
  { path: "/booking", label: "Book", icon: <StarOutlined /> },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const isLoggedIn = !!localStorage.getItem("token");

  // 🔔 Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("🔴 Failed to load notifications:", err.message);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // every 30 sec
    return () => clearInterval(interval);
  }, []);

  // 👤 Profile Menu
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

  // ⋯ More Menu
  const moreMenuItems = [
    { key: "about", label: <Link to="/about">ℹ️ About</Link> },
  ];

  return (
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
          {/* ✅ Show Sign Up / Login if not logged in */}
          {!isLoggedIn && (
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
          )}

          {/* 🔔 Notifications */}
          {isLoggedIn && (
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
          )}

          {/* ⋯ More */}
          <Dropdown menu={{ items: moreMenuItems }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: 18, cursor: "pointer" }} />
          </Dropdown>

          {/* 👤 Profile Dropdown */}
          {isLoggedIn && (
            <Dropdown menu={{ items: profileMenuItems }} trigger={["click"]}>
              <Avatar icon={<UserOutlined />} className="cursor-pointer" />
            </Dropdown>
          )}

          {/* 💳 Membership */}
          <Link to="/membership">
            <Button size="small" type="default">
              💳 View Plans
            </Button>
          </Link>

          {/* 🔁 Replay Tutorial */}
          <Button
            size="small"
            onClick={() => {
              localStorage.removeItem("osq_tutorial_seen");
              window.location.reload();
            }}
          >
            🔁 Replay Tutorial
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
