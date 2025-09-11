// =============================
// File: src/pages/BookingPage.jsx
// =============================
import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Space,
  Divider,
  Input,
  DatePicker,
  Select,
  Switch,
  InputNumber,
  Slider,
} from "antd";

// IMPORTANT: AntD reset BEFORE your CSS so overrides win
import "antd/dist/reset.css";
import "../styles/BookingPage.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function BookingPage() {
  // ===== Tabs =====
  const [activeTab, setActiveTab] = useState("stays");
  const tabs = [
    { key: "stays", label: "Stays", icon: "🏠" },
    { key: "flights", label: "Flights", icon: "✈️" },
    { key: "cars", label: "Cars", icon: "🚗" },
    { key: "cruises", label: "Cruises", icon: "🛳️" },
    { key: "excursions", label: "Excursions", icon: "🧭" },
    { key: "packages", label: "Packages", icon: "🧳" },
  ];

  // ===== Budget state =====
  const [budgetMode, setBudgetMode] = useState("solo"); // 'solo' | 'group'
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budget, setBudget] = useState({
    solo: { total: 1500, spent: 150 },
    group: { total: 3000, spent: 600 },
  });

  const activeBudget = budget[budgetMode];
  const pct = useMemo(() => {
    if (!activeBudget.total) return 0;
    return Math.max(
      0,
      Math.min(100, Math.round((activeBudget.spent / activeBudget.total) * 100))
    );
  }, [activeBudget.total, activeBudget.spent]);

  const statusClass = useMemo(() => {
    if (!activeBudget.total) return "ok";
    const ratio = activeBudget.spent / activeBudget.total;
    if (ratio < 0.8) return "ok";
    if (ratio < 1) return "warn";
    return "over";
  }, [activeBudget.total, activeBudget.spent]);

  const statusText = useMemo(() => {
    const { total, spent } = activeBudget;
    if (!total) return "Set a budget to track spending";
    const diff = total - spent;
    if (diff > total * 0.2)
      return `You're still $${diff.toLocaleString()} under your budget`;
    if (diff >= 0) return `You're close — $${diff.toLocaleString()} left`;
    return `Over by $${Math.abs(diff).toLocaleString()}`;
  }, [activeBudget]);

  const setActiveBudget = (next) =>
    setBudget((prev) => ({
      ...prev,
      [budgetMode]: { ...prev[budgetMode], ...next },
    }));

  // ===== Dynamic search fields per tab =====
  const GuestsSelect = (
    <Select
      defaultValue="2 guests"
      style={{ width: "100%" }}
      options={[
        { value: "1 guest", label: "1 guest" },
        { value: "2 guests", label: "2 guests" },
        { value: "3 guests", label: "3 guests" },
        { value: "4+ guests", label: "4+ guests" },
      ]}
    />
  );

  const RoomsSelect = (
    <Select
      defaultValue="1 room"
      style={{ width: "100%" }}
      options={[
        { value: "1 room", label: "1 room" },
        { value: "2 rooms", label: "2 rooms" },
        { value: "3 rooms", label: "3 rooms" },
      ]}
    />
  );

  function renderSearchGrid() {
    switch (activeTab) {
      case "flights":
        return (
          <div className="search-grid">
            <div className="cell">
              <Input placeholder="From (city or airport)" />
            </div>
            <div className="cell">
              <Input placeholder="To (city or airport)" />
            </div>
            <div className="cell" style={{ gridColumn: "span 2" }}>
              <RangePicker style={{ width: "100%" }} />
            </div>
            <div className="cell">
              <Select
                defaultValue="1 adult"
                style={{ width: "100%" }}
                options={[
                  { value: "1 adult", label: "1 adult" },
                  { value: "2 adults", label: "2 adults" },
                  { value: "3 adults", label: "3 adults" },
                  { value: "family", label: "Family" },
                ]}
              />
            </div>
            <div className="cell">
              <Select
                defaultValue="Economy"
                style={{ width: "100%" }}
                options={[
                  { value: "economy", label: "Economy" },
                  { value: "premium", label: "Premium Economy" },
                  { value: "business", label: "Business" },
                  { value: "first", label: "First" },
                ]}
              />
            </div>
          </div>
        );

      case "cars":
        return (
          <div className="search-grid">
            <div className="cell" style={{ gridColumn: "span 2" }}>
              <Input placeholder="Pick-up location (city, airport, station)" />
            </div>
            <div className="cell">
              <DatePicker
                showTime
                style={{ width: "100%" }}
                placeholder="Pick-up date & time"
              />
            </div>
            <div className="cell">
              <DatePicker
                showTime
                style={{ width: "100%" }}
                placeholder="Drop-off date & time"
              />
            </div>
            <div className="cell">
              <Select
                defaultValue="Driver age 30+"
                style={{ width: "100%" }}
                options={[
                  { value: "21-24", label: "Driver age 21–24" },
                  { value: "25-29", label: "Driver age 25–29" },
                  { value: "30+", label: "Driver age 30+" },
                ]}
              />
            </div>
          </div>
        );

      case "cruises":
        return (
          <div className="search-grid">
            <div className="cell">
              <Input placeholder="Destination / Region" />
            </div>
            <div className="cell">
              <Input placeholder="Departure port (optional)" />
            </div>
            <div className="cell" style={{ gridColumn: "span 2" }}>
              <RangePicker style={{ width: "100%" }} />
            </div>
            <div className="cell">{GuestsSelect}</div>
            <div className="cell">
              <Select
                defaultValue="Any cruise line"
                style={{ width: "100%" }}
                options={[
                  { value: "any", label: "Any cruise line" },
                  { value: "royal", label: "Royal Caribbean" },
                  { value: "carnival", label: "Carnival" },
                  { value: "msc", label: "MSC" },
                ]}
              />
            </div>
          </div>
        );

      case "excursions":
        return (
          <div className="search-grid">
            <div className="cell" style={{ gridColumn: "span 2" }}>
              <Input placeholder="Where? (city, landmark, region)" />
            </div>
            <div className="cell">
              <DatePicker style={{ width: "100%" }} placeholder="Date" />
            </div>
            <div className="cell">{GuestsSelect}</div>
            <div className="cell" style={{ gridColumn: "span 2" }}>
              <Input placeholder="Activity / keyword (e.g., museum, hike, food tour)" />
            </div>
          </div>
        );

      case "packages":
        return (
          <div className="search-grid">
            <div className="cell">
              <Input placeholder="Origin (city or airport)" />
            </div>
            <div className="cell">
              <Input placeholder="Destination (city or airport)" />
            </div>
            <div className="cell" style={{ gridColumn: "span 2" }}>
              <RangePicker style={{ width: "100%" }} />
            </div>
            <div className="cell">{GuestsSelect}</div>
            <div className="cell">{RoomsSelect}</div>
          </div>
        );

      case "stays":
      default:
        return (
          <div className="search-grid">
            <div className="cell" style={{ gridColumn: "span 2" }}>
              <span>🔍</span>
              <Input
                placeholder="Where to? (city, landmark, region)"
                allowClear
              />
            </div>
            <div className="cell" style={{ gridColumn: "span 2" }}>
              <RangePicker style={{ width: "100%" }} />
            </div>
            <div className="cell">{GuestsSelect}</div>
            <div className="cell">{RoomsSelect}</div>
          </div>
        );
    }
  }

  return (
    <div className="booking-page">
      {/* Floating Home button */}
      <a className="home-fab" href="/">
        🏠 Home
      </a>

      <div className="booking-wrap">
        {/* ================= HERO ================= */}
        <section className="hero">
          <Title level={2}>Good evening, David 📚</Title>
          <h1>Book Your Next Adventure ✨</h1>
          <p className="sub"></p>

          <Space className="pills" size={8} wrap>
            <span className="pill">★ XP $60</span>
            <span className="pill">Saved trips</span>
            <span className="pill">1 New</span>
          </Space>
        </section>

        {/* ================= SEARCH SHELL ================= */}
        <div className="search-shell">
          <div className="search-head">
            <div className="cat-tabs">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={`pill ${activeTab === t.key ? "active" : ""}`}
                  aria-pressed={activeTab === t.key}
                  onClick={() => setActiveTab(t.key)}
                >
                  <span style={{ fontSize: 16 }}>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            <div className="ai-toggle">
              <span>Smart Plan AI</span>
              <span className="dot" />
              <Switch defaultChecked size="small" />
            </div>
          </div>

          {/* Dynamic inputs */}
          {renderSearchGrid()}

          <div className="search-actions">
            <Button className="btn-ghost">Filters</Button>
            <button className="btn-search">🔎 Search</button>
          </div>

          <div className="quick-chips">
            <button className="chip">Beach Weekend</button>
            <button className="chip">Adventure Escape</button>
            <button className="chip">City Vibes</button>
            <button className="chip">Events Nearby</button>
            <button className="chip">Romantic Getaway</button>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <div className="results">
              <div className="results-label center">
                Showing 3 stays options
              </div>

              {/* Demo Card */}
              <Card
                className="card"
                bordered={false}
                bodyStyle={{ padding: 0 }}
              >
                <div className="thumb" />
                <div className="body">
                  <div className="title">Lisbon</div>
                  <div className="meta">📍 From 1120</div>
                  <Space size={[8, 8]} wrap style={{ marginTop: 8 }}>
                    <span className="tag">City</span>
                    <span className="tag">Europe</span>
                    <span className="tag budget-ok">Within budget</span>
                    <span className="tag">⭐</span>
                  </Space>
                  <div style={{ marginTop: 10 }}>
                    <button className="btn-search" style={{ height: 40 }}>
                      + Add to plan
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          {/* ===== Sidebar / Budget ===== */}
          <Col xs={24} md={8}>
            <div className="sidebar-card">
              <div className="sidebar-head">
                <div className="sidebar-title">Budget</div>
                <Button
                  type="text"
                  className="adjust-btn"
                  onClick={() => setBudgetOpen((v) => !v)}
                >
                  ⚙️ {budgetOpen ? "Done" : "Adjust"}
                </Button>
              </div>

              {/* Mode switch */}
              <div className="sidebar-mode">
                <button
                  className={budgetMode === "solo" ? "active" : ""}
                  onClick={() => setBudgetMode("solo")}
                >
                  Solo
                </button>
                <button
                  className={budgetMode === "group" ? "active" : ""}
                  onClick={() => setBudgetMode("group")}
                >
                  Group
                </button>
              </div>

              {/* Status + progress */}
              <div className={`budget-status ${statusClass}`}>
                {statusText} ⓘ
              </div>
              <div className="progress">
                <span style={{ width: `${pct}%` }} />
              </div>

              {/* Controls */}
              {budgetOpen && (
                <div className="sidebar-controls">
                  <div className="control-row">
                    <label>Total budget</label>
                    <InputNumber
                      min={0}
                      prefix="$"
                      value={activeBudget.total}
                      onChange={(v) =>
                        setActiveBudget({ total: Number(v || 0) })
                      }
                    />
                  </div>

                  <div className="control-row">
                    <label>Planned spend</label>
                    <InputNumber
                      min={0}
                      prefix="$"
                      value={activeBudget.spent}
                      onChange={(v) =>
                        setActiveBudget({
                          spent: Math.min(Number(v || 0), activeBudget.total),
                        })
                      }
                    />
                  </div>

                  <div className="control-row">
                    <label>Adjust spend</label>
                    <Slider
                      value={Math.min(activeBudget.spent, activeBudget.total)}
                      max={Math.max(0, activeBudget.total)}
                      onChange={(v) => setActiveBudget({ spent: v })}
                    />
                  </div>

                  <div className="control-hint">
                    Tip: switch to <b>Group</b> to track a separate budget.
                  </div>
                </div>
              )}

              <Divider style={{ borderColor: "rgba(255,255,255,.14)" }} />
              <Text className="meta">Planned items</Text>
              <Card
                bordered={false}
                style={{ marginTop: 8, background: "rgba(255,255,255,.04)" }}
              >
                <Text className="meta">Nothing added yet</Text>
              </Card>

              <Button block style={{ marginTop: 12 }} className="btn-ghost">
                🔔 Subscribe to price drops
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
