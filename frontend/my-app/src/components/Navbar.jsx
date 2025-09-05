import React, { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { Button, Dropdown } from "antd";
import { RobotOutlined, DownOutlined } from "@ant-design/icons";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [aiChoice, setAiChoice] = useState("Questy"); // "Questy" | "Sora"

  // Demo auth toggle – replace with your real auth hooks later
  const handleAuthClick = () => {
    if (loggedIn) {
      // TODO: call your logout action
      setLoggedIn(false);
      navigate("/"); // optional redirect after logout
    } else {
      navigate("/login");
    }
  };

  const aiMenu = (
    <div className="ai-menu">
      <button
        className={`ai-option ${aiChoice === "Questy" ? "active" : ""}`}
        onClick={() => setAiChoice("Questy")}
      >
        <RobotOutlined /> <span>Questy</span>
      </button>
      <button
        className={`ai-option ${aiChoice === "Sora" ? "active" : ""}`}
        onClick={() => setAiChoice("Sora")}
      >
        <RobotOutlined /> <span>Sora</span>
      </button>
    </div>
  );

  return (
    <>
      {/* TOP NAV */}
      <header className="osq-navbar">
        <div className="nav-left">
          <button
            className="brand"
            onClick={() => navigate("/")}
            aria-label="One Sky Quest Home"
          >
            <span className="dot" />
            One Sky
          </button>

          <NavLink to="/booking" className="nav-link">
            Book
          </NavLink>
          <NavLink to="/feed" className="nav-link">
            Feed
          </NavLink>
          <NavLink to="/unique-stays" className="nav-link">
            Unique Stays
          </NavLink>
          <NavLink to="/last-minute" className="nav-link">
            Last-Minute
          </NavLink>
          <NavLink to="/team-travel" className="nav-link">
            Team Travel
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            Profile
          </NavLink>
        </div>

        {/* Right-side actions: Log in/Log out • Questy/Sora • Notifications • Start Planning */}
        <div className="nav-right">
          {/* Log in / Log out */}
          <Button type="link" className="nav-link" onClick={handleAuthClick}>
            {loggedIn ? "Log out" : "Log in"}
          </Button>

          {/* Questy/Sora Switch */}
          <Dropdown
            overlay={aiMenu}
            trigger={["click"]}
            overlayClassName="ai-dropdown"
            placement="bottomRight"
          >
            <Button type="link" className="nav-link" aria-haspopup="menu">
              {aiChoice}{" "}
              <DownOutlined style={{ fontSize: 12, marginLeft: 6 }} />
            </Button>
          </Dropdown>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="btn icon"
            aria-label="Notifications"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
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

          {/* Start Planning CTA */}
          <Button
            className="btn cta start-btn"
            onClick={() => navigate("/booking")}
          >
            Start Planning
          </Button>
        </div>
      </header>

      {/* STICKY SUB NAV */}
      <div className="osq-subnav">
        <NavLink to="/membership" className="pill">
          👑 Membership
        </NavLink>
        <NavLink to="/tutorial" className="pill">
          📖 Tutorial
        </NavLink>
        <Link
          to="/sky-vault"
          className="skyvault-badge"
          aria-label="Open Sky Vault XP Store"
        >
          <span className="dot" />
          Sky Vault
        </Link>
      </div>
    </>
  );
}
