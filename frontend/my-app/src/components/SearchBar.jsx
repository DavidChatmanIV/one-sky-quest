import React, { useState } from "react";
import { Segmented, Badge } from "antd";
import {
  CarOutlined,
  GiftOutlined,
  SendOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Ship, Mountain } from "lucide-react";
import "../styles/SearchBar.css";

const TABS = [
  { key: "stays", label: "Stays", icon: <HomeOutlined /> },
  { key: "flights", label: "Flights", icon: <SendOutlined /> },
  { key: "cars", label: "Cars", icon: <CarOutlined /> },
  { key: "adventures", label: "Adventures", icon: <Mountain size={16} /> },
  { key: "cruises", label: "Cruises", icon: <Ship size={16} />, badge: "New" },
  { key: "packages", label: "Packages", icon: <GiftOutlined /> },
];

const Pill = ({ icon, text, badge }) => (
  <span className="tab-pill">
    {icon}
    <span className="tab-pill-text">{text}</span>
    {badge ? (
      <Badge color="#ff8a2a" className="tab-pill-badge" text={badge} />
    ) : null}
  </span>
);

export default function SearchBar({
  onSearch = () => {},
  values = {
    where: "",
    start: "",
    end: "",
    guests: "2 adults · 1 room",
    mode: "stays",
  },
  setValues = () => {},
}) {
  const [tab, setTab] = useState(values.mode ?? "stays");
  const update = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e?.target ? e.target.value : e }));

  const options = TABS.map((t) => ({
    value: t.key,
    label: <Pill icon={t.icon} text={t.label} badge={t.badge} />,
  }));
  const handleTab = (next) => {
    setTab(next);
    setValues((v) => ({ ...v, mode: next }));
  };

  console.log("[SearchBar] render mode:", tab); // sanity check

  return (
    <div className="osq-search skyrio-search skyrio-search--compact">
      {/* NEW Segmented switcher */}
      <div className="tab-switcher glass-white" role="tablist">
        <Segmented
          block
          size="large"
          value={tab}
          onChange={handleTab}
          options={options}
        />
        <span aria-hidden className="orange-glass-bubble" />
      </div>

      {/* Inputs (unchanged) */}
      <div className="skyrio-search__grid">
        <label className="field">
          <span className="field__label">Where to?</span>
          <div className="field__control">
            <span className="field__icon">📍</span>
            <input
              className="input"
              placeholder="City, landmark, or address"
              value={values.where}
              onChange={update("where")}
            />
          </div>
        </label>

        <label className="field">
          <span className="field__label">Start date</span>
          <div className="field__control">
            <span className="field__icon">📅</span>
            <input
              type="date"
              className="input"
              value={values.start}
              onChange={update("start")}
            />
          </div>
        </label>

        <label className="field">
          <span className="field__label">End date</span>
          <div className="field__control">
            <span className="field__icon">📅</span>
            <input
              type="date"
              className="input"
              value={values.end}
              onChange={update("end")}
            />
          </div>
        </label>

        <label className="field">
          <span className="field__label">Guests & rooms</span>
          <div className="field__control">
            <span className="field__icon">👥</span>
            <input
              className="input"
              value={values.guests}
              onChange={update("guests")}
            />
          </div>
        </label>

        <div className="field field--cta">
          <button className="search-btn" onClick={onSearch}>
            Search • Earn +50 XP
          </button>
          <div className="smart">
            <span className="zap">⚡</span>Smart Plan AI
          </div>
        </div>
      </div>
    </div>
  );
}
