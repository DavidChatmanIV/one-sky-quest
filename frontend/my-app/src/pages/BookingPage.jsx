import React, { useMemo, useState } from "react";
import {
  Layout,
  Typography,
  Space,
  Segmented,
  Button,
  Input,
  DatePicker,
  Card,
  Tag,
  Progress,
  Row,
  Col,
  InputNumber,
  Divider,
} from "antd";
import { SearchOutlined, SaveOutlined, TeamOutlined } from "@ant-design/icons";

import heroImg from "../assets/Booking/skyrio-hero.jpg"; // ✅ adjust if needed
import "../styles/BookingPage.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function BookingPage() {
  // ----------------------------
  // Tabs
  // ----------------------------
  const [tab, setTab] = useState("Stays");

  // ----------------------------
  // Quick Filters (customizable toggles)
  // ----------------------------
  const quickFilters = useMemo(
    () => ["Under $500", "Luxury", "Unwind", "Adventure", "Romantic"],
    []
  );
  const [activeFilters, setActiveFilters] = useState(["Under $500"]);

  const toggleFilter = (label) => {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const clearFilters = () => setActiveFilters([]);

  // ----------------------------
  // Budget (customizable)
  // ----------------------------
  const [budgetTotal, setBudgetTotal] = useState(2500);
  const [used, setUsed] = useState(920);

  const [expenseAmount, setExpenseAmount] = useState(150);
  const [expenseLabel, setExpenseLabel] = useState("Dinner & Drinks");

  const left = useMemo(
    () => Math.max(0, (budgetTotal || 0) - (used || 0)),
    [budgetTotal, used]
  );

  const percent = useMemo(() => {
    const total = Number(budgetTotal || 0);
    const u = Number(used || 0);
    if (!total || total <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((u / total) * 100)));
  }, [budgetTotal, used]);

  const addExpense = () => {
    const amt = Number(expenseAmount || 0);
    if (!amt || amt <= 0) return;
    setUsed((prev) => Number(prev || 0) + amt);
  };

  return (
    <Layout
      className="sk-booking"
      style={{
        ["--sk-bg"]: `url(${heroImg})`,
      }}
    >
      {/* ================= HERO ================= */}
      <div className="sk-booking-hero">
        <Title className="sk-hero-title">Book Your Next Adventure ✨</Title>

        <Space size="middle" className="sk-hero-pills">
          <div className="sk-pill">⚡ XP 60</div>
          <div className="sk-pill">💾 8 Saved</div>
          <div className="sk-pill">👁 Price Watch Off</div>
        </Space>

        <Text className="sk-hero-sub">
          Smart Plan AI will optimize this trip for budget & XP
        </Text>

        {/* ================= TABS ================= */}
        <Segmented
          className="sk-booking-tabs sk-orange-segmented"
          value={tab}
          onChange={setTab}
          options={[
            "Stays",
            "Flights",
            "Cars",
            "Saved",
            "Cruises",
            "Excursions",
            "Packages",
            "Last-Minute",
          ]}
        />

        {/* ================= SEARCH BAR ================= */}
        <div className="sk-search-bar">
          <Input className="sk-glass-input" placeholder="New York (JFK)" />
          <RangePicker className="sk-orange-picker" />
          <Button className="sk-btn-orange">Rewards</Button>
          <Button className="sk-btn-orange">Price Watch</Button>
          <Button icon={<SearchOutlined />} className="sk-btn-orange">
            Search
          </Button>
        </div>

        {/* ================= ACTION ROW ================= */}
        <Space className="sk-action-row">
          <Button className="sk-btn-orange">Sort: Recommended</Button>
          <Button className="sk-btn-orange" icon={<SaveOutlined />}>
            Save Trip
          </Button>
          <Button className="sk-btn-orange" icon={<TeamOutlined />}>
            Teams Travel
          </Button>
        </Space>

        {/* ================= QUICK FILTERS ================= */}
        <Space className="sk-filters" wrap>
          {quickFilters.map((f) => {
            const active = activeFilters.includes(f);
            return (
              <button
                key={f}
                type="button"
                className={`sk-qf ${active ? "is-active" : ""}`}
                onClick={() => toggleFilter(f)}
              >
                {f}
              </button>
            );
          })}

          <button
            type="button"
            className="sk-qf sk-qf-clear"
            onClick={clearFilters}
          >
            Clear quick filters →
          </button>
        </Space>
      </div>

      {/* ================= RESULTS ================= */}
      <Row gutter={24} className="sk-results-wrap">
        <Col span={16}>
          <Title level={4} className="sk-section-title">
            Results
          </Title>

          <Card className="sk-result-card" bordered={false}>
            <Row gutter={16} align="middle">
              <Col span={6}>
                <div className="sk-result-img" />
              </Col>

              <Col span={12}>
                <Title level={5} className="sk-card-title">
                  Skyrio Select Stay – Deluxe
                </Title>
                <Text className="sk-muted">New York → Miami</Text>
                <div style={{ marginTop: 10 }}>
                  <Space>
                    <Tag color="green">Best Value</Tag>
                    <Tag>Free cancellation</Tag>
                  </Space>
                </div>
              </Col>

              <Col span={6} className="sk-price">
                $168 total
              </Col>
            </Row>
          </Card>
        </Col>

        {/* ================= BUDGET ================= */}
        <Col span={8}>
          <Card className="sk-budget-card" bordered={false}>
            <Title level={4} className="sk-card-title">
              Trip Budget
            </Title>

            <div className="sk-budget-top">
              <Text className="sk-muted">Total Budget</Text>
              <InputNumber
                className="sk-number sk-orange-number"
                prefix="$"
                value={budgetTotal}
                min={0}
                step={50}
                onChange={(v) => setBudgetTotal(Number(v || 0))}
              />
            </div>

            <Title className="sk-budget-left">
              ${left.toLocaleString()} Left
            </Title>

            <Progress percent={percent} showInfo={false} />
            <Text className="sk-muted">
              Used: ${Number(used || 0).toLocaleString()}
            </Text>

            <Divider className="sk-divider" />

            <div className="sk-budget-input">
              <Text className="sk-muted">Add Expense</Text>

              <InputNumber
                className="sk-number sk-orange-number"
                prefix="$"
                value={expenseAmount}
                min={0}
                step={10}
                onChange={(v) => setExpenseAmount(Number(v || 0))}
              />

              <Input
                className="sk-glass-input"
                value={expenseLabel}
                onChange={(e) => setExpenseLabel(e.target.value)}
                placeholder="Category (e.g., Dinner & Drinks)"
              />

              <Button className="sk-btn-orange" onClick={addExpense}>
                Add
              </Button>

              <Text className="sk-budget-hint">
                Tip: Later we’ll save categories + history per trip.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}