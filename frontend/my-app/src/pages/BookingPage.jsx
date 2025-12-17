import React, { useMemo, useState } from "react";
import {
  Layout,
  Typography,
  Segmented,
  Button,
  Tag,
  Space,
  Input,
  DatePicker,
  Dropdown,
  Menu,
  Modal,
  InputNumber,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import "../styles/bookingPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const TAB_OPTIONS = [
  { key: "stays", label: "Stays" },
  { key: "flights", label: "Flights" },
  { key: "cars", label: "Cars" },
  { key: "cruises", label: "Cruises" },
  { key: "excursions", label: "Excursions" },
  { key: "packages", label: "Packages" },
  { key: "lastMinute", label: "Last-Minute" },
];

const QUICK_TAGS = [
  "Beach Weekend",
  "Adventure Escape",
  "City Vibes",
  "Events Nearby",
  "Romantic Getaway",
];

function GuestsDropdown({ value, onChange }) {
  const menu = (
    <Menu
      items={[
        { key: "1a1r", label: "1 adult • 1 room" },
        { key: "2a1r", label: "2 adults • 1 room" },
        { key: "2a2r", label: "2 adults • 2 rooms" },
        { key: "4a2r", label: "4 adults • 2 rooms" },
      ]}
      onClick={(info) => onChange?.(info.key)}
    />
  );

  const labelMap = {
    "1a1r": "1 adult • 1 room",
    "2a1r": "2 adults • 1 room",
    "2a2r": "2 adults • 2 rooms",
    "4a2r": "4 adults • 2 rooms",
  };

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button className="sk-inputBtn" icon={<UserOutlined />}>
        {labelMap[value] || "2 adults • 1 room"}
      </Button>
    </Dropdown>
  );
}

function StayCard() {
  return (
    <div className="sk-stayCard">
      <div className="sk-stayMedia" />
      <div className="sk-stayMeta">
        <div className="sk-stayTitleRow">
          <div>
            <div className="sk-stayTitle">Lisbon, Portugal</div>
            <div className="sk-stayPrice">From $1,120</div>
          </div>
          <Button className="sk-cta" size="middle">
            + Add to Plan
          </Button>
        </div>

        <Space size={8} wrap className="sk-stayTags">
          <Tag className="sk-tag">City</Tag>
          <Tag className="sk-tag">Europe</Tag>
          <Tag className="sk-tag">Within Budget</Tag>
          <Tag className="sk-tag">★ Popular</Tag>
        </Space>
      </div>
    </div>
  );
}

function BudgetPanel() {
  const [mode, setMode] = useState("Solo");

  // budget state (default 2500, but loads from localStorage)
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("sk_budget");
    return saved ? Number(saved) : 2500;
  });

  // example “current plan total” (swap with real planned items later)
  const planTotal = 1150;
  const underBy = Math.max(0, budget - planTotal);

  const [open, setOpen] = useState(false);
  const [draftBudget, setDraftBudget] = useState(budget);

  const saveBudget = () => {
    setBudget(draftBudget);
    localStorage.setItem("sk_budget", String(draftBudget));
    setOpen(false);
  };

  return (
    <div className="sk-budgetCard">
      <div className="sk-budgetHeader">
        <div className="sk-budgetTitle">Budget</div>

        <Space size={8}>
          <Button
            className="sk-ghostBtn"
            icon={<SettingOutlined />}
            onClick={() => {
              setDraftBudget(budget);
              setOpen(true);
            }}
          >
            Set Budget
          </Button>

          <Segmented
            size="small"
            options={["Solo", "Group"]}
            value={mode}
            onChange={setMode}
          />
        </Space>
      </div>

      <div className="sk-budgetStat">
        <div className="sk-budgetValue">
          ${underBy.toLocaleString()} under your budget.
        </div>
        <div className="sk-budgetSub">
          Budget: ${budget.toLocaleString()} • Planned: $
          {planTotal.toLocaleString()}
        </div>
      </div>

      <div className="sk-budgetBlock">
        <div className="sk-budgetBlockTitle">Planned items</div>
        <div className="sk-budgetEmpty">No items added yet</div>
      </div>

      <Modal
        title="Set your trip budget"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={saveBudget}
        okText="Save"
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ color: "rgba(255,255,255,0.75)" }}>
            Choose a budget that Skyrio will help you stay under.
          </div>

          <InputNumber
            style={{ width: "100%" }}
            min={100}
            step={50}
            value={draftBudget}
            onChange={(v) => setDraftBudget(Number(v || 0))}
            formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => String(v).replace(/\$\s?|(,*)/g, "")}
          />
        </div>
      </Modal>
    </div>
  );
}

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState("stays");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState(null);
  const [guests, setGuests] = useState("2a1r");

  const headerPills = useMemo(
    () => [{ label: "XP 60" }, { label: "0 saved trips" }, { label: "1 new" }],
    []
  );

  const onSearch = () => {
    console.log({ activeTab, destination, dates, guests });
  };

  return (
    <Layout className="sk-bookingPage">
      <Content className="sk-wrap">
        {/* HERO */}
        <div className="sk-hero">
          <Title level={1} className="sk-heroTitle">
            Book Your Next Adventure ✨
          </Title>

          <div className="sk-pillRow">
            {headerPills.map((p) => (
              <div key={p.label} className="sk-pill">
                {p.label}
              </div>
            ))}
          </div>

          <Text className="sk-heroHint">
            Smart Plan AI will optimize this trip for budget &amp; XP.
          </Text>
        </div>

        {/* SEARCH + BUDGET ROW */}
        <div className="sk-grid">
          {/* LEFT */}
          <div className="sk-left">
            <div className="sk-glass">
              {/* Tabs */}
              <div className="sk-tabs">
                {TAB_OPTIONS.map((t) => (
                  <button
                    key={t.key}
                    className={`sk-tab ${
                      activeTab === t.key ? "isActive" : ""
                    }`}
                    onClick={() => setActiveTab(t.key)}
                    type="button"
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Unified Search Row */}
              <div className="sk-searchRow">
                <Input
                  className="sk-input"
                  prefix={<EnvironmentOutlined />}
                  placeholder="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  allowClear
                />

                <DatePicker.RangePicker
                  className="sk-input"
                  suffixIcon={<CalendarOutlined />}
                  value={dates}
                  onChange={(val) => setDates(val)}
                />

                <GuestsDropdown value={guests} onChange={setGuests} />

                <Button
                  className="sk-searchBtn"
                  icon={<SearchOutlined />}
                  onClick={onSearch}
                >
                  Search +50 XP
                </Button>
              </div>

              {/* Quick tags */}
              <div className="sk-quickTags">
                {QUICK_TAGS.map((tag) => (
                  <button className="sk-chip" key={tag} type="button">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="sk-results">
              <StayCard />
            </div>
          </div>

          {/* RIGHT */}
          <div className="sk-right">
            <div className="sk-sticky">
              <BudgetPanel />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}