import React, { useMemo, useState } from "react";
import {
  Segmented,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Button,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/SearchBar.css"; // Make sure this file includes the white glass + bubble styles

const TAB_OPTIONS = [
  { value: "Stays", label: "Stays", icon: <span>🏠</span> },
  { value: "Flights", label: "Flights", icon: <span>✈️</span> },
  { value: "Cars", label: "Cars", icon: <span>🚗</span> },
  { value: "Cruises", label: "Cruises", icon: <span>🛳️</span>, badge: "New" },
  { value: "Packages", label: "Packages", icon: <span>🎁</span> },
  { value: "Adventures", label: "Adventures", icon: <span>✨</span> },
];

export default function UnifiedSearchBar() {
  const [tab, setTab] = useState("Stays");
  const navigate = useNavigate();

  const placeLabel = useMemo(() => {
    switch (tab) {
      case "Flights":
        return "From / To";
      case "Cars":
        return "Pick-up location";
      case "Cruises":
        return "Departure port or region";
      case "Packages":
        return "City or resort";
      case "Adventures":
        return "City or landmark";
      default:
        return "City, landmark, or address";
    }
  }, [tab]);

  return (
    <div className="skyrio-search skyrio-search--compact">
      {/* --- White glass segmented bar with orange bubble --- */}
      <div className="tab-switcher glass-white" role="tablist">
        <Segmented
          block
          size="large"
          value={tab}
          onChange={(v) => setTab(v)}
          options={TAB_OPTIONS.map((o) => ({
            value: o.value,
            label: (
              <span className="tab-pill">
                <span aria-hidden className="seg-emoji">
                  {o.icon}
                </span>
                <span className="tab-pill-text">{o.label}</span>
                {o.badge ? (
                  <span className="tab-pill-badge ant-badge-status-text">
                    {o.badge}
                  </span>
                ) : null}
              </span>
            ),
          }))}
        />
        <span aria-hidden className="orange-glass-bubble" />
      </div>

      {/* --- Input Grid --- */}
      <Row gutter={[12, 12]} className="skyrio-search__grid">
        {/* Shared Input */}
        <Col xs={24} md={8}>
          <Input size="large" placeholder={placeLabel} allowClear />
        </Col>

        {/* ===== STAYS ===== */}
        {tab === "Stays" && (
          <>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Start date"
              />
            </Col>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="End date"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder="2 adults · 1 room"
                options={[
                  { label: "1 adult · 1 room", value: "1-1" },
                  { label: "2 adults · 1 room", value: "2-1" },
                ]}
              />
            </Col>
          </>
        )}

        {/* ===== FLIGHTS ===== */}
        {tab === "Flights" && (
          <>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Depart"
              />
            </Col>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Return (optional)"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder="Economy · 1"
                options={[
                  { label: "Economy · 1", value: "eco-1" },
                  { label: "Business · 1", value: "biz-1" },
                ]}
              />
            </Col>
          </>
        )}

        {/* ===== CARS ===== */}
        {tab === "Cars" && (
          <>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Pick-up date"
              />
            </Col>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Return date"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder="Driver age"
                options={[
                  { label: "25+", value: "25" },
                  { label: "21–24", value: "21-24" },
                ]}
              />
            </Col>
          </>
        )}

        {/* ===== CRUISES ===== */}
        {tab === "Cruises" && (
          <>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Sail date"
              />
            </Col>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Return date"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder="2 travelers · Balcony"
                options={[
                  { label: "2 travelers · Interior", value: "2-int" },
                  { label: "2 travelers · Oceanview", value: "2-ocv" },
                  { label: "2 travelers · Balcony", value: "2-bal" },
                  { label: "2 travelers · Suite", value: "2-ste" },
                ]}
              />
            </Col>
          </>
        )}

        {/* ===== PACKAGES ===== */}
        {tab === "Packages" && (
          <>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Start date"
              />
            </Col>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="End date"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder="2 travelers"
                options={[
                  { label: "1 traveler", value: "1" },
                  { label: "2 travelers", value: "2" },
                  { label: "3 travelers", value: "3" },
                ]}
              />
            </Col>
          </>
        )}

        {/* ===== ADVENTURES ===== */}
        {tab === "Adventures" && (
          <>
            <Col xs={12} md={6}>
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Date"
              />
            </Col>
            <Col xs={12} md={4}>
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder="Time"
                options={[
                  { label: "Morning", value: "am" },
                  { label: "Afternoon", value: "pm" },
                  { label: "Evening", value: "eve" },
                ]}
              />
            </Col>
          </>
        )}

        {/* ===== SEARCH BUTTON ===== */}
        <Col xs={24}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate(`/search/${tab.toLowerCase()}`)}
            >
              Search • Earn +50 XP
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
