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
  Drawer,
  Divider,
  Switch,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  SettingOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import "../styles/BookingPage.css";

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

/* ---------------- Guests Dropdown ---------------- */

function GuestsDropdown({ value, onChange, className = "" }) {
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
      <Button className={`sk-fieldBtn ${className}`} icon={<UserOutlined />}>
        {labelMap[value] || "2 adults • 1 room"}
      </Button>
    </Dropdown>
  );
}

/* ---------------- Stay Card (WITH WATCH) ---------------- */

function StayCard({ watchPayload }) {
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [loading, setLoading] = useState(false);

  const createWatch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/watches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(watchPayload),
      });

      if (!res.ok) throw new Error("Failed to watch");
      const data = await res.json();

      setWatchId(data?._id || data?.watch?._id || null);
      setWatching(true);
      message.success("Watching price ✅");
    } catch {
      message.error("Couldn’t start watching. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeWatch = async () => {
    if (!watchId) {
      setWatching(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/watches/${watchId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to remove watch");

      setWatching(false);
      setWatchId(null);
      message.success("Watch removed");
    } catch {
      message.error("Couldn’t remove watch. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sk-stayCard">
      <div className="sk-stayMedia" />
      <div className="sk-stayMeta">
        <div className="sk-stayTitleRow">
          <div>
            <div className="sk-stayTitle">Lisbon, Portugal</div>
            <div className="sk-stayPrice">From $1,120</div>
          </div>

          <Space size={8}>
            <Button className="sk-cta">+ Add to Plan</Button>

            <Button
              className="sk-ghostBtn"
              loading={loading}
              onClick={watching ? removeWatch : createWatch}
            >
              {watching ? "Watching ✅" : "Watch 🔔"}
            </Button>
          </Space>
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

//* ---------------- Budget Panel ---------------- */

function BudgetPanel() {
  const [mode, setMode] = useState("Solo");

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("sk_trip_budget");
    return saved ? Number(saved) : 2500;
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const raw = localStorage.getItem("sk_trip_expenses");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [openBudget, setOpenBudget] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [draftBudget, setDraftBudget] = useState(budget);

  const [amount, setAmount] = useState(null);
  const [note, setNote] = useState("");

  const planTotal = useMemo(
    () => expenses.reduce((sum, x) => sum + (Number(x.amount) || 0), 0),
    [expenses]
  );

  const remaining = Math.max(0, budget - planTotal);
  const usedPct =
    budget > 0 ? Math.min(100, Math.round((planTotal / budget) * 100)) : 0;

  const saveBudget = () => {
    const next = Number(draftBudget || 0);
    setBudget(next);
    localStorage.setItem("sk_trip_budget", String(next));
    setOpenBudget(false);
    message.success("Budget updated ✅");
  };

  const addExpense = () => {
    const v = Number(amount || 0);
    if (!v || v <= 0) return message.warning("Enter an amount.");

    const item = {
      id: crypto?.randomUUID?.() || String(Date.now()),
      amount: v,
      note: (note || "").trim(),
      ts: Date.now(),
    };

    const next = [item, ...expenses].slice(0, 50);
    setExpenses(next);
    localStorage.setItem("sk_trip_expenses", JSON.stringify(next));

    setAmount(null);
    setNote("");
    message.success(`Added $${v.toLocaleString()} ✅`);
  };

  const removeExpense = (id) => {
    const next = expenses.filter((x) => x.id !== id);
    setExpenses(next);
    localStorage.setItem("sk_trip_expenses", JSON.stringify(next));
  };

  const clearAll = () => {
    setExpenses([]);
    localStorage.setItem("sk_trip_expenses", JSON.stringify([]));
    message.success("Cleared ✅");
  };

  return (
    <div className="sk-budgetCard sk-budgetCard--premium">
      <div className="sk-budgetHeader">
        <div>
          <div className="sk-budgetTitle">Trip Budget</div>
          <div className="sk-budgetHint">Quick add • instant progress</div>
        </div>

        <Space size={8}>
          <Button
            className="sk-ghostBtn"
            icon={<SettingOutlined />}
            onClick={() => {
              setDraftBudget(budget);
              setOpenBudget(true);
            }}
          >
            Edit
          </Button>

          <Segmented
            size="small"
            options={["Solo", "Group"]}
            value={mode}
            onChange={setMode}
          />
        </Space>
      </div>

      {/* Hero */}
      <div className="sk-budgetHero">
        <div className="sk-budgetRemaining">
          ${remaining.toLocaleString()}
          <span className="sk-budgetRemainingSub"> left to use</span>
        </div>

        <div className="sk-budgetMetaRow">
          <span>Used: ${planTotal.toLocaleString()}</span>
          <span>{usedPct}%</span>
        </div>

        <div className="sk-budgetBar">
          <div className="sk-budgetBarFill" style={{ width: `${usedPct}%` }} />
        </div>

        <div className="sk-budgetSub">
          Budget: ${budget.toLocaleString()} • Mode: {mode}
        </div>
      </div>

      {/* Quick Add */}
      <div className="sk-budgetQuickAdd">
        <div className="sk-budgetSectionTitle">+ Add Expense</div>

        <div className="sk-budgetAddRow">
          <InputNumber
            className="sk-budgetAmount"
            prefix="$"
            min={1}
            step={5}
            value={amount}
            onChange={setAmount}
            placeholder="Amount"
          />
          <Input
            className="sk-budgetNote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            onPressEnter={addExpense}
          />
        </div>

        <div className="sk-budgetActions">
          <Button
            className="sk-cta sk-budgetAddBtn"
            onClick={addExpense}
            icon={<SaveOutlined />}
          >
            Add
          </Button>

          <Button className="sk-ghostBtn" onClick={() => setOpenDetails(true)}>
            View details →
          </Button>
        </div>
      </div>

      {/* Budget Modal */}
      <Modal
        title="Set your trip budget"
        open={openBudget}
        onCancel={() => setOpenBudget(false)}
        onOk={saveBudget}
        okText="Save"
      >
        <InputNumber
          style={{ width: "100%" }}
          min={100}
          step={50}
          value={draftBudget}
          onChange={(v) => setDraftBudget(Number(v || 0))}
        />
      </Modal>

      {/* Details Drawer */}
      <Drawer
        title="Budget Details"
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        placement="right"
        width={380}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div className="sk-budgetDetailPills">
            <div className="sk-budgetPill">
              <div className="sk-budgetPillLabel">Budget</div>
              <div className="sk-budgetPillValue">
                ${budget.toLocaleString()}
              </div>
            </div>
            <div className="sk-budgetPill">
              <div className="sk-budgetPillLabel">Used</div>
              <div className="sk-budgetPillValue">
                ${planTotal.toLocaleString()}
              </div>
            </div>
            <div className="sk-budgetPill">
              <div className="sk-budgetPillLabel">Left</div>
              <div className="sk-budgetPillValue">
                ${remaining.toLocaleString()}
              </div>
            </div>
          </div>

          <Divider style={{ borderColor: "rgba(255,255,255,.12)" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,.85)", fontWeight: 700 }}>
              Recent expenses
            </Text>
            <Button size="small" danger onClick={clearAll}>
              Clear
            </Button>
          </div>

          {expenses.length === 0 ? (
            <Text style={{ color: "rgba(255,255,255,.7)" }}>
              No expenses yet. Add your first one from the card.
            </Text>
          ) : (
            <div className="sk-budgetList">
              {expenses.map((x) => (
                <div key={x.id} className="sk-budgetItem">
                  <div>
                    <div className="sk-budgetItemAmt">
                      ${Number(x.amount).toLocaleString()}
                    </div>
                    <div className="sk-budgetItemNote">
                      {x.note || "Expense"}
                      <span className="sk-budgetItemTime">
                        {" "}
                        • {new Date(x.ts).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="small"
                    className="sk-ghostBtn"
                    onClick={() => removeExpense(x.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}

/* ---------------- Booking Page ---------------- */

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState("stays");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState(null);
  const [guests, setGuests] = useState("2a1r");

  // ✅ Landing-style filters + toggles
  const [filters, setFilters] = useState([]);
  const [rewardsOn, setRewardsOn] = useState(true);
  const [trackPrices, setTrackPrices] = useState(false);

  const toggleFilter = (label) => {
    setFilters((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const headerPills = useMemo(
    () => [{ label: "XP 60" }, { label: "0 saved trips" }, { label: "1 new" }],
    []
  );

  const handleSearch = () => {
    message.success("Searching…");
    // hook into your real search later
  };

  return (
    <Layout className="sk-bookingPage">
      <Content className="sk-wrap">
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
            Smart Plan AI will optimize this trip for budget & XP.
          </Text>
        </div>

        <div className="sk-grid">
          <div className="sk-left">
            <div className="sk-glass">
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

              {/* ✅ Landing-style search bar */}
              <div className="sk-searchBar">
                <div className="sk-searchBarRow">
                  <div className="sk-field sk-field--dest">
                    <EnvironmentOutlined className="sk-fieldIcon" />
                    <Input
                      className="sk-fieldInput"
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      allowClear
                      bordered={false}
                    />
                  </div>

                  <div className="sk-field sk-field--dates">
                    <DatePicker.RangePicker
                      className="sk-fieldPicker"
                      value={dates}
                      onChange={setDates}
                      bordered={false}
                      suffixIcon={<CalendarOutlined className="sk-fieldIcon" />}
                    />
                  </div>

                  <GuestsDropdown value={guests} onChange={setGuests} />

                  <Button
                    className="sk-askSoraBtn"
                    onClick={() =>
                      message.info("Sora suggestions (hook later)")
                    }
                  >
                    ⚡ Ask Sora
                  </Button>

                  <Button
                    className="sk-searchBtn2"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>

                <div className="sk-filterPills">
                  {[
                    "Under $500",
                    "Under $1000",
                    "Luxury",
                    "Chill",
                    "Adventure",
                    "Romantic",
                    "Family",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`sk-filterPill ${
                        filters.includes(p) ? "isOn" : ""
                      }`}
                      onClick={() => toggleFilter(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="sk-searchToggles">
                  <div className="sk-toggleRow">
                    <span className="sk-toggleLabel">Rewards</span>
                    <Switch checked={rewardsOn} onChange={setRewardsOn} />
                  </div>

                  <div className="sk-toggleRow">
                    <span className="sk-toggleLabel">Track prices</span>
                    <Switch checked={trackPrices} onChange={setTrackPrices} />
                  </div>
                </div>

                <div className="sk-quickTags sk-quickTags--below">
                  {QUICK_TAGS.map((tag) => (
                    <button key={tag} className="sk-chip" type="button">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sk-results">
              <StayCard
                watchPayload={{
                  type: activeTab,
                  destination: destination || "Lisbon, Portugal",
                  dates: dates
                    ? dates.map((d) => d?.toISOString?.() || String(d))
                    : null,
                  guests,
                  filters,
                  rewardsOn,
                  trackPrices,
                }}
              />
            </div>
          </div>

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
