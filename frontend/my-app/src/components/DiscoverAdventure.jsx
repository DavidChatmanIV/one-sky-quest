import React, { useState, useEffect } from "react";
import { Typography, Button, Input, DatePicker } from "antd";
import { CompassOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "../styles/DiscoverAdventure.css";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const categories = ["Flights", "Hotels", "Packages", "Cars", "Cruises"];

const DiscoverAdventure = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dates, setDates] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const params = new URLSearchParams();
    if (from) params.set("from", from.trim());
    if (to) params.set("to", to.trim());
    if (dates?.[0]) params.set("start", dates[0].format("YYYY-MM-DD"));
    if (dates?.[1]) params.set("end", dates[1].format("YYYY-MM-DD"));
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <section
      className={`discover-section ${isDarkMode ? "dark" : "light"} ${
        isVisible ? "fade-in" : ""
      }`}
    >
      <div className="overlay-gradient" />

      <div className="discover-content">
        <Title level={1} className="discover-title">
          🌍 Discover Your Next Adventure
        </Title>

        <Paragraph className="discover-subtitle">
          Book smarter. Travel freer. Earn XP as you explore the world.
          <br />
          Plan smarter. Travel better. One Sky, Endless Adventures.
        </Paragraph>

        <Link to="/booking">
          <Button size="large" type="primary" className="start-btn">
            ✈️ Start Your Quest
          </Button>
        </Link>

        <div className="category-buttons">
          {categories.map((label) => (
            <Button
              key={label}
              type="primary"
              icon={<CompassOutlined />}
              className="category-btn"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* 🔎 Pill-style, single-row search */}
        <form
          className="search-form search-form--inline search-form--pill"
          onSubmit={handleSubmit}
          aria-label="Search trips"
        >
          <Input
            placeholder="e.g. JFK"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="search-input"
            allowClear
            aria-label="From"
          />
          <Input
            placeholder="e.g. LAX"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="search-input"
            allowClear
            aria-label="To"
          />
          <RangePicker
            className="date-picker"
            onChange={(vals) => setDates(vals)}
            allowClear
            aria-label="Dates"
          />
          <Button
            htmlType="submit"
            type="primary"
            icon={<SearchOutlined />}
            className="search-btn"
          >
            Search
          </Button>
        </form>

        <div className="scroll-indicator">↓ Scroll to explore</div>

        <div className="mt-6">
          <Button
            size="small"
            className="toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DiscoverAdventure;
