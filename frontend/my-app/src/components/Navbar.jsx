import React, { useEffect, useState } from "react";
import { Layout, Avatar, Dropdown, Badge } from "antd";
import { UserOutlined, MoreOutlined, BellOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";

const { Header } = Layout;

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/notifications");
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
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const profileMenuItems = [
    { key: "profile", label: <Link to="/profile">👤 My Profile</Link> },
    { key: "trips", label: <Link to="/saved-trips">💾 Saved Trips</Link> },
    {
      key: "logout",
      label: <span>🚪 Logout</span>,
      onClick: () => console.log("Logging out..."),
    },
  ];

  const moreMenuItems = [
    { key: "about", label: <Link to="/about">ℹ️ About</Link> },
  ];

  return (
    <Header
      className="!bg-white !text-black shadow-md border-b border-gray-200 px-4 sm:px-6 py-2"
      style={{ position: "sticky", top: 0, zIndex: 1000, width: "100%" }}
    >
      <div className="flex justify-between items-center">
        {/* 🌐 Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold !text-blue-600">
            One <span className="!text-orange-500">Sky</span> Quest
          </Link>

          {/* 🧭 Main Navigation */}
          <nav className="hidden md:flex gap-4 text-sm font-medium">
            <Link to="/">🏠 Home</Link>
            <Link to="/booking">📅 Booking</Link>
            <Link to="/questfeed">🗺️ Quest Feed</Link>
            <Link to="/saved-excursions">💾 My Excursions</Link>
          </nav>
        </div>

        {/* 🔧 Tools */}
        <div className="hidden lg:flex gap-4 text-sm font-medium text-gray-600 items-center">
          <span>Flights</span>
          <span>Hotels</span>
          <span>Packages</span>
          <span>Cars</span>
          <span>Cruises</span>

          {/* 🔔 Notifications */}
          <Dropdown
            menu={{ items: [] }}
            popupRender={() => <Notifications />}
            placement="bottomRight"
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

          {/* 👤 Profile Avatar Dropdown */}
          <Dropdown menu={{ items: profileMenuItems }} trigger={["click"]}>
            <Avatar icon={<UserOutlined />} className="ml-2 cursor-pointer" />
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
