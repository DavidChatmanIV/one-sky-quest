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

const TAB_OPTIONS = [
  { value: "Stays", label: "Stays", icon: <span>🏠</span> },
  { value: "Flights", label: "Flights", icon: <span>✈️</span> },
  { value: "Cars", label: "Cars", icon: <span>🚗</span> },
  { value: "Cruises", label: "Cruises", icon: <span>🛳️</span> }, // ✅ fixed: add value
  { value: "Packages", label: "Packages", icon: <span>🎁</span> },
  { value: "Excursions", label: "Excursions", icon: <span>🧭</span> },
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
      case "Packages":
        return "City or resort";
      case "Excursions":
        return "City or landmark";
      case "Cruises":
        return "Departure port or region"; // ✅ new
      default:
        return "City, landmark, or address";
    }
  }, [tab]);

  return (
    <div className="osq-search-card">
      <div className="osq-search-tabs osq-tabs-rounded">
        <Segmented
          options={TAB_OPTIONS.map((o) => ({
            value: o.value,
            label: (
              <span className="seg-item">
                <span className="seg-emoji" aria-hidden>
                  {o.icon}
                </span>
                <span className="seg-text">{o.label}</span>
              </span>
            ),
          }))}
          value={tab}
          onChange={(val) => setTab(val)}
          size="large"
          block
        />
      </div>

      {/* Shared row: tailor fields per tab */}
      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        {/* Where / Port / From-To */}
        <Col xs={24} md={8}>
          <Input
            className="osq-where"
            size="large"
            placeholder={placeLabel}
            allowClear
          />
        </Col>

        {/* ===== STAYS ===== */}
        {tab === "Stays" && (
          <>
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Start date"
              />
            </Col>
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="End date"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                className="osq-travelers-btn"
                size="large"
                style={{ width: "100%" }}
                placeholder="2 adults · 1 room"
                classNames={{ popup: "osq-select-popup" }}
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
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Depart"
              />
            </Col>
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Return (optional)"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                className="osq-travelers-btn"
                size="large"
                style={{ width: "100%" }}
                placeholder="Economy · 1"
                classNames={{ popup: "osq-select-popup" }}
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
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Pick-up date"
              />
            </Col>
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Return date"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                className="osq-travelers-btn"
                size="large"
                style={{ width: "100%" }}
                placeholder="Driver age"
                classNames={{ popup: "osq-select-popup" }}
                options={[
                  { label: "25+", value: "25" },
                  { label: "21–24", value: "21-24" },
                ]}
              />
            </Col>
          </>
        )}

        {/* ===== CRUISES (NEW) ===== */}
        {tab === "Cruises" && (
          <>
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Sail date"
              />
            </Col>
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Return date"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                className="osq-travelers-btn"
                size="large"
                style={{ width: "100%" }}
                placeholder="2 travelers · Balcony"
                classNames={{ popup: "osq-select-popup" }}
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
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Start date"
              />
            </Col>
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="End date"
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                className="osq-travelers-btn"
                size="large"
                style={{ width: "100%" }}
                placeholder="2 travelers"
                classNames={{ popup: "osq-select-popup" }}
                options={[
                  { label: "1 traveler", value: "1" },
                  { label: "2 travelers", value: "2" },
                  { label: "3 travelers", value: "3" },
                ]}
              />
            </Col>
          </>
        )}

        {/* ===== EXCURSIONS ===== */}
        {tab === "Excursions" && (
          <>
            <Col xs={12} md={6} className="osq-date">
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                placeholder="Date"
              />
            </Col>
            <Col xs={12} md={4}>
              <Select
                className="osq-travelers-btn"
                size="large"
                style={{ width: "100%" }}
                placeholder="Time"
                classNames={{ popup: "osq-select-popup" }}
                options={[
                  { label: "Morning", value: "am" },
                  { label: "Afternoon", value: "pm" },
                  { label: "Evening", value: "eve" },
                ]}
              />
            </Col>
          </>
        )}

        {/* Search CTA */}
        <Col xs={24}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              className="osq-search-btn"
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
