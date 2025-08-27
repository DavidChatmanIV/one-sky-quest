import React, { useState, useEffect } from "react";
import { Typography, Button } from "antd";
import {
  SendOutlined,
  HomeOutlined,
  GiftOutlined,
  CarOutlined,
  CompassOutlined,
  ExperimentOutlined, // simple, built-in icon for Cruises
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/DiscoverAdventure.css";

// Correct sibling imports
import FlightSearchForm from "./Booking/FlightSearchForm.jsx";
import StaySearchForm from "./Booking/StaySearchForm.jsx";
import PackageFilterForm from "./Booking/PackageFilterForm.jsx";
import CarSearchForm from "./Booking/CarSearchForm.jsx";
import CruiseSearchForm from "./Booking/CruiseSearchForm.jsx";

const { Title, Paragraph } = Typography;

const CATEGORY_META = [
  { key: "flights", label: "Flights", icon: <SendOutlined /> },
  { key: "hotels", label: "Hotels", icon: <HomeOutlined /> },
  { key: "packages", label: "Packages", icon: <GiftOutlined /> },
  { key: "cars", label: "Cars", icon: <CarOutlined /> },
  { key: "cruises", label: "Cruises", icon: <ExperimentOutlined /> }, // replaced ShipOutlined
];

export default function DiscoverAdventure() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("flights");

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const renderForm = () => {
    switch (activeCategory) {
      case "flights":
        return <FlightSearchForm />;
      case "hotels":
        return <StaySearchForm />;
      case "packages":
        return <PackageFilterForm />;
      case "cars":
        return <CarSearchForm />;
      case "cruises":
        return <CruiseSearchForm />;
      default:
        return null;
    }
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

        {/* Simple category pills */}
        <div
          className="category-buttons"
          role="tablist"
          aria-label="Search type"
        >
          {CATEGORY_META.map(({ key, label, icon }) => (
            <Button
              key={key}
              role="tab"
              aria-selected={activeCategory === key}
              onClick={() => setActiveCategory(key)}
              type={activeCategory === key ? "primary" : "default"}
              icon={icon}
              className={`category-btn ${
                activeCategory === key ? "category-btn--active" : ""
              }`}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Swapped search panel */}
        <div className="search-form" aria-live="polite">
          {renderForm()}
        </div>

        <div className="scroll-indicator">↓ Scroll to explore</div>

        <div className="mt-6">
          <Button
            size="small"
            className="toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            icon={<CompassOutlined />}
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </Button>
        </div>
      </div>
    </section>
  );
}
