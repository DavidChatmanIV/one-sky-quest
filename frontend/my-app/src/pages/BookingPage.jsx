import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Typography,
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
  Skeleton,
  Empty,
  Rate,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  SettingOutlined,
  SaveOutlined,
  HeartOutlined,
  HeartFilled,
  CarOutlined,
} from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";

import "../styles/BookingPage.css";

// ✅ New premium flight component
import FlightCard from "../components/flights/FlightCard";

const { Content } = Layout;
const { Title, Text } = Typography;

/* ---------------- Tabs ---------------- */

const TAB_OPTIONS = [
  { key: "stays", label: "Stays" },
  { key: "flights", label: "Flights" },
  { key: "cars", label: "Cars" },
  { key: "saved", label: "Saved" },
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

/* ---------------- Mock Data ---------------- */

const MOCK_STAYS = [
  {
    id: "stay_1",
    title: "Lisbon, Portugal",
    location: "Lisbon • City Center",
    price: 1120,
    rating: 4.6,
    reviews: 1229,
    tags: ["City", "Europe", "Within Budget", "★ Popular"],
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1400&q=60",
    amenities: ["Wi-Fi", "Breakfast", "Gym", "Late checkout", "City view"],
  },
  {
    id: "stay_2",
    title: "Miami, Florida",
    location: "South Beach • Oceanfront",
    price: 680,
    rating: 4.2,
    reviews: 847,
    tags: ["Beach", "Pool", "Couples", "Free cancellation"],
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210e7?auto=format&fit=crop&w=1400&q=60",
    amenities: ["Wi-Fi", "Pool", "Beach access", "Balcony", "Room service"],
  },
  {
    id: "stay_3",
    title: "Tokyo, Japan",
    location: "Shinjuku • Near Transit",
    price: 980,
    rating: 4.8,
    reviews: 391,
    tags: ["Hidden gem", "Transit", "City", "Top rated"],
    image:
      "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1400&q=60",
    amenities: ["Wi-Fi", "Transit access", "Laundry", "Concierge", "City view"],
  },
];

// Old mock flight format (we’ll normalize to FlightCard shape)
const MOCK_FLIGHTS_RAW = [
  {
    id: "flt_1",
    carrierCode: "SK",
    priceLabel: "$168",
    outbound: {
      origin: "EWR",
      destination: "MIA",
      durationLabel: "3h 15m",
      stops: 0,
      departTime: "8:20 AM",
      arriveTime: "11:35 AM",
    },
    tags: ["Best value", "Carry-on included"],
  },
  {
    id: "flt_2",
    carrierCode: "JW",
    priceLabel: "$256",
    outbound: {
      origin: "JFK",
      destination: "LAX",
      durationLabel: "6h 23m",
      stops: 0,
      departTime: "2:05 PM",
      arriveTime: "5:28 PM",
    },
    tags: ["Fastest", "On-time"],
  },
  {
    id: "flt_3",
    carrierCode: "BS",
    priceLabel: "$221",
    outbound: {
      origin: "EWR",
      destination: "SJU",
      durationLabel: "4h 30m",
      stops: 1,
      departTime: "9:10 AM",
      arriveTime: "1:40 PM",
    },
    tags: ["Popular", "1 stop"],
  },
];

const MOCK_CARS = [
  {
    id: "car_1",
    brand: "Toyota",
    model: "Corolla",
    type: "Compact",
    seats: 5,
    bags: 2,
    transmission: "Automatic",
    pickup: "Miami Intl Airport (MIA)",
    pricePerDay: 48,
    rating: 4.6,
    tags: ["Free cancellation", "Great value"],
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=60",
    amenities: ["Unlimited miles", "Free cancellation", "Airport pickup"],
  },
  {
    id: "car_2",
    brand: "Jeep",
    model: "Wrangler",
    type: "SUV",
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    pickup: "Los Angeles (LAX)",
    pricePerDay: 89,
    rating: 4.3,
    tags: ["Unlimited miles", "Popular"],
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=60",
    amenities: ["Unlimited miles", "Flexible pickup", "Insurance options"],
  },
  {
    id: "car_3",
    brand: "Tesla",
    model: "Model 3",
    type: "Electric",
    seats: 5,
    bags: 2,
    transmission: "Automatic",
    pickup: "Newark (EWR)",
    pricePerDay: 104,
    rating: 4.8,
    tags: ["Premium", "EV"],
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=60",
    amenities: ["EV charging", "Premium support", "Express pickup"],
  },
];

/* ---------------- Helpers ---------------- */

function guessAirportCode(text, fallback = "LAX") {
  const t = (text || "").trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(t)) return t;

  const map = {
    "LOS ANGELES": "LAX",
    LA: "LAX",
    "NEW YORK": "JFK",
    NYC: "JFK",
    "SAN FRANCISCO": "SFO",
    MIAMI: "MIA",
    ORLANDO: "MCO",
    CHICAGO: "ORD",
    DALLAS: "DFW",
    ATLANTA: "ATL",
    NEWARK: "EWR",
  };

  return map[t] || fallback;
}

function parseAdultsFromGuestsKey(guestsKey) {
  const k = String(guestsKey || "");
  if (k.startsWith("1")) return 1;
  if (k.startsWith("2")) return 2;
  if (k.startsWith("4")) return 4;
  return 1;
}

function readSavedIds() {
  try {
    const raw = localStorage.getItem("sk_saved_listings");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}
function writeSavedIds(ids) {
  localStorage.setItem("sk_saved_listings", JSON.stringify(ids));
}

function safeParseNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function moneyFromLabel(label) {
  const num = String(label || "").replace(/[^0-9.]/g, "");
  const total = num ? Number(num) : 0;
  return { currency: "USD", total: Number.isFinite(total) ? total : 0 };
}

// ✅ Normalize ANY flight into the shape your new FlightCard expects
function normalizeFlight(f) {
  // Already in new shape?
  if (f?.origin && f?.destination && f?.price?.total !== undefined) return f;

  // Old mock shape?
  const out = f?.outbound || {};
  return {
    id: f?.id || crypto?.randomUUID?.() || String(Date.now()),
    airline: f?.airline || "Skyrio Air",
    airlineCode: f?.carrierCode || "SK",
    flightNumber: f?.flightNumber || "—",
    origin: out?.origin || "—",
    destination: out?.destination || "—",
    departAt: f?.departAt || null,
    arriveAt: f?.arriveAt || null,
    durationMinutes: f?.durationMinutes || null,
    stops: typeof out?.stops === "number" ? out.stops : 0,
    cabin: f?.cabin || "ECONOMY",
    price: f?.price || moneyFromLabel(f?.priceLabel),
    badges: f?.badges || f?.tags || [],
  };
}

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

/* ---------------- Save / Heart Button (mini) ---------------- */

function SaveBtn({ saved, onToggle }) {
  return (
    <Button
      type="text"
      className="sk-saveMini"
      icon={saved ? <HeartFilled /> : <HeartOutlined />}
      onClick={onToggle}
      aria-label={saved ? "Unsave" : "Save"}
    />
  );
}

/* ---------------- Stay Card ---------------- */

function StayCard({ item, saved, onToggleSave, onOpen, watchPayload }) {
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
    } catch (err) {
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
    } catch (err) {
      message.error("Couldn’t remove watch. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sk-stayCard" style={{ marginBottom: 12 }}>
      <div
        className="sk-stayMedia"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="sk-stayMeta">
        <div className="sk-stayTitleRow">
          <div>
            <div className="sk-stayTitle">{item.title}</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              <EnvironmentOutlined /> {item.location}
            </div>
            <div className="sk-stayPrice">
              From ${item.price.toLocaleString()}
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Rate
                allowHalf
                disabled
                value={Math.round(item.rating * 2) / 2}
              />
              <span style={{ opacity: 0.85 }}>
                {item.rating.toFixed(1)} · {item.reviews} reviews
              </span>
            </div>
          </div>

          <Space size={8}>
            <SaveBtn saved={saved} onToggle={onToggleSave} />
            <Button className="sk-ghostBtn" onClick={onOpen}>
              Details
            </Button>
            <Button className="sk-cta">Select</Button>
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
          {(item.tags || []).slice(0, 4).map((t) => (
            <Tag key={t} className="sk-tag">
              {t}
            </Tag>
          ))}
        </Space>
      </div>
    </div>
  );
}

/* ---------------- Car Card ---------------- */

function CarCard({ item, saved, onToggleSave, onOpen }) {
  return (
    <div className="sk-stayCard" style={{ marginBottom: 12 }}>
      <div
        className="sk-stayMedia"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="sk-stayMeta">
        <div className="sk-stayTitleRow">
          <div>
            <div className="sk-stayTitle">
              <CarOutlined /> {item.brand} {item.model} · {item.type}
            </div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              Pickup: {item.pickup}
            </div>
            <div className="sk-stayPrice">${item.pricePerDay}/day</div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Rate
                allowHalf
                disabled
                value={Math.round(item.rating * 2) / 2}
              />
              <span style={{ opacity: 0.85 }}>{item.rating.toFixed(1)}</span>
              <span style={{ opacity: 0.85 }}>
                · {item.seats} seats · {item.bags} bags · {item.transmission}
              </span>
            </div>
          </div>

          <Space size={8}>
            <SaveBtn saved={saved} onToggle={onToggleSave} />
            <Button className="sk-ghostBtn" onClick={onOpen}>
              Details
            </Button>
            <Button className="sk-cta">Select</Button>
          </Space>
        </div>

        <Space size={8} wrap className="sk-stayTags">
          {(item.tags || []).slice(0, 4).map((t) => (
            <Tag key={t} className="sk-tag">
              {t}
            </Tag>
          ))}
        </Space>
      </div>
    </div>
  );
}

/* ---------------- Budget Panel (UNCHANGED) ---------------- */

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
    } catch (err) {
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

          <div style={{ display: "inline-flex" }}>
            <Button
              size="small"
              className={`sk-ghostBtn ${mode === "Solo" ? "isOn" : ""}`}
              onClick={() => setMode("Solo")}
            >
              Solo
            </Button>
            <Button
              size="small"
              className={`sk-ghostBtn ${mode === "Group" ? "isOn" : ""}`}
              onClick={() => setMode("Group")}
              style={{ marginLeft: 6 }}
            >
              Group
            </Button>
          </div>
        </Space>
      </div>

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const qsTab = searchParams.get("tab") || "stays";
  const qsWhere = searchParams.get("where") || "";
  const qsMinRating = safeParseNum(searchParams.get("minRating"), 0);
  const qsTags = (searchParams.get("tags") || "").split(",").filter(Boolean);

  const [activeTab, setActiveTab] = useState(qsTab);
  const [destination, setDestination] = useState(qsWhere);
  const [dates, setDates] = useState(null);
  const [guests, setGuests] = useState("2a1r");

  const [filters, setFilters] = useState(qsTags.length ? qsTags : []);
  const [rewardsOn, setRewardsOn] = useState(true);
  const [trackPrices, setTrackPrices] = useState(false);

  // ✅ flights now store normalized shape for FlightCard
  const [flightResults, setFlightResults] = useState(() =>
    MOCK_FLIGHTS_RAW.map(normalizeFlight)
  );
  const [carsResults, setCarsResults] = useState([]);
  const [staysResults, setStaysResults] = useState(MOCK_STAYS);

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [savedIds, setSavedIds] = useState(() => readSavedIds());

  const minRating = qsMinRating;

  const headerPills = useMemo(
    () => [
      { label: rewardsOn ? "XP 60" : "XP Off" },
      { label: `${savedIds.length} saved` },
      { label: trackPrices ? "Price Watch On" : "Price Watch Off" },
    ],
    [rewardsOn, savedIds.length, trackPrices]
  );

  const updateQS = (patch) => {
    const sp = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (
        v === undefined ||
        v === null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0)
      ) {
        sp.delete(k);
      } else {
        sp.set(k, Array.isArray(v) ? v.join(",") : String(v));
      }
    });
    setSearchParams(sp, { replace: true });
  };

  useEffect(() => {
    updateQS({
      tab: activeTab,
      where: destination,
      minRating: minRating ? String(minRating) : "",
      tags: filters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, destination, filters]);

  const toggleFilter = (label) => {
    setFilters((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const toggleSave = (id) => {
    const next = savedIds.includes(id)
      ? savedIds.filter((x) => x !== id)
      : [...savedIds, id];
    setSavedIds(next);
    writeSavedIds(next);
  };

  const openDetails = (item) => {
    setSelected(item);
    setDetailsOpen(true);
  };

  // ✅ Checkout shell prep
  const goCheckout = (payload) => {
    try {
      sessionStorage.setItem("skyrio_checkout_v1", JSON.stringify(payload));
    } catch (err) {
      // ignore storage errors (private mode / blocked storage)
    }
    navigate("/checkout");
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      if (activeTab === "saved") {
        setLoading(false);
        return;
      }

      if (activeTab === "flights") {
        // ✅ show 1–2 mock cards immediately (even if API fails)
        setFlightResults(MOCK_FLIGHTS_RAW.slice(0, 2).map(normalizeFlight));

        const origin = "JFK";
        const dest = guessAirportCode(destination, "LAX");

        let dateStr = "";
        const start = dates?.[0];
        if (start?.format) dateStr = start.format("YYYY-MM-DD");
        else {
          const d = new Date();
          d.setDate(d.getDate() + 30);
          dateStr = d.toISOString().slice(0, 10);
        }

        const adults = parseAdultsFromGuestsKey(guests);

        const url = `/api/providers/amadeus/flights/search?origin=${encodeURIComponent(
          origin
        )}&dest=${encodeURIComponent(dest)}&date=${encodeURIComponent(
          dateStr
        )}&adults=${adults}&max=12&nonStop=false`;

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.ok) {
          // fallback: more mocks + filter a little
          const q = (destination || "").toLowerCase().trim();
          const fallback = MOCK_FLIGHTS_RAW.filter((f) => {
            if (!q) return true;
            const joined =
              `${f.outbound.origin} ${f.outbound.destination} ${f.carrierCode}`.toLowerCase();
            return joined.includes(q);
          })
            .slice(0, 12)
            .map(normalizeFlight);

          setFlightResults(
            fallback.length ? fallback : MOCK_FLIGHTS_RAW.map(normalizeFlight)
          );
          message.info("Using mock flight results (API unavailable).");
        } else {
          // ✅ normalize whatever backend returns into FlightCard format
          const normalized = (data.results || []).map(normalizeFlight);
          setFlightResults(normalized);
          message.success(`Found ${normalized.length} flights`);
        }

        setLoading(false);
        return;
      }

      if (activeTab === "cars") {
        const q = (destination || "").toLowerCase().trim();
        const filtered = MOCK_CARS.filter((c) => {
          if (!q) return true;
          const joined =
            `${c.brand} ${c.model} ${c.type} ${c.pickup}`.toLowerCase();
          return joined.includes(q);
        }).filter((c) => (minRating ? c.rating >= minRating : true));

        setCarsResults(filtered);
        message.success(`Found ${filtered.length} cars`);
        setLoading(false);
        return;
      }

      if (activeTab === "stays") {
        const q = (destination || "").toLowerCase().trim();
        const filtered = MOCK_STAYS.filter((s) => {
          if (!q) return true;
          const joined = `${s.title} ${s.location}`.toLowerCase();
          return joined.includes(q);
        }).filter((s) => (minRating ? s.rating >= minRating : true));

        setStaysResults(filtered);
        message.success(`Found ${filtered.length} stays`);
        setLoading(false);
        return;
      }

      message.info("This tab will be powered in an upgrade.");
    } catch (e) {
      message.error(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const activeList = useMemo(() => {
    if (activeTab === "flights") return flightResults;
    if (activeTab === "cars") return carsResults;
    if (activeTab === "stays") return staysResults;
    return [];
  }, [activeTab, flightResults, carsResults, staysResults]);

  // ✅ Saved items: build a pool and map by id
  const savedItems = useMemo(() => {
    const pool = [
      ...MOCK_STAYS,
      ...MOCK_CARS,
      ...MOCK_FLIGHTS_RAW.map(normalizeFlight),
      ...staysResults,
      ...carsResults,
      ...flightResults,
    ];

    const map = new Map(pool.map((x) => [x.id, x]));
    return savedIds.map((id) => map.get(id)).filter(Boolean);
  }, [savedIds, staysResults, carsResults, flightResults]);

  const savedGroups = useMemo(() => {
    const flights = [];
    const cars = [];
    const stays = [];

    for (const x of savedItems) {
      const isFlight =
        x?.origin && x?.destination && x?.price?.total !== undefined;
      const isCar = x?.pricePerDay !== undefined;
      if (isFlight) flights.push(x);
      else if (isCar) cars.push(x);
      else stays.push(x);
    }

    return { flights, stays, cars };
  }, [savedItems]);

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
                {TAB_OPTIONS.map((t) => {
                  const isSaved = t.key === "saved";
                  const label = isSaved
                    ? `Saved${
                        savedIds.length > 0 ? ` (${savedIds.length})` : ""
                      }`
                    : t.label;

                  return (
                    <button
                      key={t.key}
                      className={`sk-tab ${
                        activeTab === t.key ? "isActive" : ""
                      }`}
                      onClick={() => setActiveTab(t.key)}
                      type="button"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="sk-searchBar">
                <div className="sk-searchBarRow">
                  <div className="sk-field sk-field--dest">
                    <EnvironmentOutlined className="sk-fieldIcon" />
                    <Input
                      className="sk-fieldInput"
                      placeholder={
                        activeTab === "flights"
                          ? "Where to? (Try LAX, MIA, SFO)"
                          : activeTab === "cars"
                          ? "Pickup city/airport (Try MIA, LAX, EWR)"
                          : "Where to?"
                      }
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      allowClear
                      bordered={false}
                      disabled={activeTab === "saved"}
                    />
                  </div>

                  <div className="sk-field sk-field--dates">
                    <DatePicker.RangePicker
                      className="sk-fieldPicker"
                      value={dates}
                      onChange={setDates}
                      bordered={false}
                      suffixIcon={<CalendarOutlined className="sk-fieldIcon" />}
                      disabled={activeTab === "saved"}
                    />
                  </div>

                  <GuestsDropdown
                    value={guests}
                    onChange={setGuests}
                    className={activeTab === "saved" ? "isDisabled" : ""}
                  />

                  <Button
                    className="sk-askSoraBtn"
                    onClick={() =>
                      message.info("Sora suggestions (hook later)")
                    }
                    disabled={activeTab === "saved"}
                  >
                    ⚡ Ask Sora
                  </Button>

                  <Button
                    className="sk-searchBtn2"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    loading={loading}
                    disabled={activeTab === "saved"}
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
                    {rewardsOn && (
                      <Text style={{ fontSize: 12, opacity: 0.7 }}>
                        Earn XP on this trip
                      </Text>
                    )}
                  </div>

                  <div className="sk-toggleRow">
                    <span className="sk-toggleLabel">Track prices</span>
                    <Switch checked={trackPrices} onChange={setTrackPrices} />
                    {trackPrices && (
                      <Text style={{ fontSize: 12, opacity: 0.7 }}>
                        Price alerts enabled
                      </Text>
                    )}
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
              {activeTab === "saved" ? (
                savedItems.length === 0 ? (
                  <Empty
                    description="No saved items yet. Tap the heart on a stay/flight/car."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <div style={{ display: "grid", gap: 18 }}>
                    {/* ✅ Intentional Saved layout */}
                    {savedGroups.flights.length > 0 && (
                      <div style={{ display: "grid", gap: 10 }}>
                        <div style={{ fontWeight: 900, opacity: 0.92 }}>
                          Saved Flights
                        </div>
                        {savedGroups.flights.map((flight) => (
                          <FlightCard
                            key={flight.id}
                            flight={flight}
                            saved={savedIds.includes(flight.id)}
                            onSave={(f) => {
                              toggleSave(f.id);
                              message.success("Saved ✅");
                            }}
                            onUnsave={(id) => {
                              toggleSave(id);
                              message.info("Removed from Saved");
                            }}
                            onCheckout={(f) =>
                              goCheckout({ type: "flight", flight: f })
                            }
                          />
                        ))}
                      </div>
                    )}

                    {savedGroups.stays.length > 0 && (
                      <div style={{ display: "grid", gap: 10 }}>
                        <div style={{ fontWeight: 900, opacity: 0.92 }}>
                          Saved Stays
                        </div>
                        {savedGroups.stays.map((item) => (
                          <StayCard
                            key={item.id}
                            item={item}
                            saved={savedIds.includes(item.id)}
                            onToggleSave={() => {
                              toggleSave(item.id);
                              message.success(
                                savedIds.includes(item.id)
                                  ? "Removed from Saved"
                                  : "Saved ✅"
                              );
                            }}
                            onOpen={() => openDetails(item)}
                            watchPayload={{
                              type: "stays",
                              destination: destination || item.title,
                              dates: dates
                                ? dates.map((d) =>
                                    d?.toISOString?.()
                                      ? d.toISOString()
                                      : String(d)
                                  )
                                : null,
                              guests,
                              filters,
                              rewardsOn,
                              trackPrices,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {savedGroups.cars.length > 0 && (
                      <div style={{ display: "grid", gap: 10 }}>
                        <div style={{ fontWeight: 900, opacity: 0.92 }}>
                          Saved Cars
                        </div>
                        {savedGroups.cars.map((item) => (
                          <CarCard
                            key={item.id}
                            item={item}
                            saved={savedIds.includes(item.id)}
                            onToggleSave={() => {
                              toggleSave(item.id);
                              message.success(
                                savedIds.includes(item.id)
                                  ? "Removed from Saved"
                                  : "Saved ✅"
                              );
                            }}
                            onOpen={() => openDetails(item)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              ) : loading ? (
                <div style={{ display: "grid", gap: 12 }}>
                  <Skeleton active />
                  <Skeleton active />
                  <Skeleton active />
                </div>
              ) : activeList.length === 0 ? (
                <Empty
                  description={
                    <>
                      <div style={{ fontWeight: 700 }}>No results yet</div>
                      <div style={{ opacity: 0.7, marginTop: 4 }}>
                        Try searching a destination like <b>LAX</b>, <b>MIA</b>,
                        or <b>SFO</b>
                      </div>
                    </>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : activeTab === "flights" ? (
                activeList.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    saved={savedIds.includes(flight.id)}
                    onSave={(f) => {
                      toggleSave(f.id);
                      message.success("Saved ✅");
                    }}
                    onUnsave={(id) => {
                      toggleSave(id);
                      message.info("Removed from Saved");
                    }}
                    onCheckout={(f) =>
                      goCheckout({ type: "flight", flight: f })
                    }
                  />
                ))
              ) : activeTab === "cars" ? (
                activeList.map((item) => (
                  <CarCard
                    key={item.id}
                    item={item}
                    saved={savedIds.includes(item.id)}
                    onToggleSave={() => {
                      toggleSave(item.id);
                      message.success(
                        savedIds.includes(item.id)
                          ? "Removed from Saved"
                          : "Saved ✅"
                      );
                    }}
                    onOpen={() => openDetails(item)}
                  />
                ))
              ) : activeTab === "stays" ? (
                activeList.map((item) => (
                  <StayCard
                    key={item.id}
                    item={item}
                    saved={savedIds.includes(item.id)}
                    onToggleSave={() => {
                      toggleSave(item.id);
                      message.success(
                        savedIds.includes(item.id)
                          ? "Removed from Saved"
                          : "Saved ✅"
                      );
                    }}
                    onOpen={() => openDetails(item)}
                    watchPayload={{
                      type: "stays",
                      destination: destination || item.title,
                      dates: dates
                        ? dates.map((d) =>
                            d?.toISOString?.() ? d.toISOString() : String(d)
                          )
                        : null,
                      guests,
                      filters,
                      rewardsOn,
                      trackPrices,
                    }}
                  />
                ))
              ) : (
                <Empty
                  description="This tab will be powered in an upgrade."
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}

              <Drawer
                title="Details"
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                width={420}
              >
                {!selected ? (
                  <Empty description="No item selected" />
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {/* Flight details (new shape) */}
                    {selected?.origin && selected?.destination ? (
                      <>
                        <div style={{ fontWeight: 900, fontSize: 16 }}>
                          {selected.origin} → {selected.destination}
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          Total:{" "}
                          <b>
                            {selected?.price?.currency || "USD"}{" "}
                            {Number(selected?.price?.total || 0).toFixed(2)}
                          </b>
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          Airline: <b>{selected?.airlineCode || "—"}</b>
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          Cabin: <b>{String(selected?.cabin || "ECONOMY")}</b>
                        </div>

                        <Divider />
                        <Space>
                          <Button
                            className="sk-cta"
                            onClick={() =>
                              goCheckout({ type: "flight", flight: selected })
                            }
                          >
                            Continue to Checkout
                          </Button>
                          <Button
                            className="sk-ghostBtn"
                            onClick={() => {
                              toggleSave(selected.id);
                              message.success(
                                savedIds.includes(selected.id)
                                  ? "Removed from Saved"
                                  : "Saved ✅"
                              );
                            }}
                          >
                            {savedIds.includes(selected.id)
                              ? "Saved ✅"
                              : "Save"}
                          </Button>
                        </Space>
                      </>
                    ) : selected?.pricePerDay ? (
                      <>
                        <div style={{ fontWeight: 900, fontSize: 16 }}>
                          {selected.brand} {selected.model} · {selected.type}
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          Pickup: <b>{selected.pickup}</b>
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          Price: <b>${selected.pricePerDay}/day</b>
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          Specs: <b>{selected.seats}</b> seats ·{" "}
                          <b>{selected.bags}</b> bags ·{" "}
                          <b>{selected.transmission}</b>
                        </div>

                        <Divider />
                        <Text style={{ opacity: 0.9, fontWeight: 800 }}>
                          Perks
                        </Text>
                        <Space size={8} wrap style={{ marginTop: 6 }}>
                          {(selected.amenities || []).map((a) => (
                            <Tag key={a} className="sk-tag">
                              {a}
                            </Tag>
                          ))}
                        </Space>

                        <Divider />
                        <Space>
                          <Button
                            className="sk-cta"
                            onClick={() =>
                              goCheckout({ type: "car", car: selected })
                            }
                          >
                            Continue to Checkout
                          </Button>
                          <Button
                            className="sk-ghostBtn"
                            onClick={() => {
                              toggleSave(selected.id);
                              message.success(
                                savedIds.includes(selected.id)
                                  ? "Removed from Saved"
                                  : "Saved ✅"
                              );
                            }}
                          >
                            {savedIds.includes(selected.id)
                              ? "Saved ✅"
                              : "Save"}
                          </Button>
                        </Space>
                      </>
                    ) : (
                      <>
                        <div style={{ fontWeight: 900, fontSize: 16 }}>
                          {selected.title}
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          Location: <b>{selected.location}</b>
                        </div>
                        <div style={{ opacity: 0.85 }}>
                          From:{" "}
                          <b>
                            $
                            {selected.price?.toLocaleString?.() ||
                              selected.price}
                          </b>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Rate
                            allowHalf
                            disabled
                            value={Math.round((selected.rating || 0) * 2) / 2}
                          />
                          <span style={{ opacity: 0.85 }}>
                            {(selected.rating || 0).toFixed?.(1)} ·{" "}
                            {selected.reviews || 0} reviews
                          </span>
                        </div>

                        <Divider />
                        <Text style={{ opacity: 0.9, fontWeight: 800 }}>
                          Amenities
                        </Text>
                        <Space size={8} wrap style={{ marginTop: 6 }}>
                          {(selected.amenities || []).map((a) => (
                            <Tag key={a} className="sk-tag">
                              {a}
                            </Tag>
                          ))}
                        </Space>

                        <Divider />
                        <Space>
                          <Button
                            className="sk-cta"
                            onClick={() =>
                              goCheckout({ type: "stay", stay: selected })
                            }
                          >
                            Continue to Checkout
                          </Button>
                          <Button
                            className="sk-ghostBtn"
                            onClick={() => {
                              toggleSave(selected.id);
                              message.success(
                                savedIds.includes(selected.id)
                                  ? "Removed from Saved"
                                  : "Saved ✅"
                              );
                            }}
                          >
                            {savedIds.includes(selected.id)
                              ? "Saved ✅"
                              : "Save"}
                          </Button>
                        </Space>
                      </>
                    )}
                  </div>
                )}
              </Drawer>
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