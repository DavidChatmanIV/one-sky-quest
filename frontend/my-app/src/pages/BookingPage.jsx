import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Layout,
  Typography,
  Segmented,
  Button,
  Space,
  AutoComplete,
  DatePicker,
  Modal,
  InputNumber,
  Drawer,
  Divider,
  Switch,
  Tag,
  Card,
  Row,
  Col,
  Badge,
  message,
  Tooltip,
  Dropdown,
  Tour,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  CopyOutlined,
  SaveOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/BookingPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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

const SORT_OPTIONS = [
  { key: "recommended", label: "Recommended" },
  { key: "priceLow", label: "Price: Low → High" },
  { key: "priceHigh", label: "Price: High → Low" },
  { key: "rating", label: "Guest rating" },
  { key: "stars", label: "Star rating" },
];

const VIBE_CHIPS = [
  { key: "under500", label: "Under $500" },
  { key: "under1000", label: "Under $1000" },
  { key: "luxury", label: "Luxury" },
  { key: "unwind", label: "Unwind" },
  { key: "adventure", label: "Adventure" },
  { key: "romantic", label: "Romantic" },
  { key: "family", label: "Family" },
];

/**
 * ✅ Quick filters (single-active)
 * - Shows an “on” state
 * - Applies a preset set of vibes (and optional tab)
 * - Tiny “Clear” button (no clutter)
 */
const QUICK_FILTERS = [
  {
    key: "beachWeekend",
    label: "Beach Weekend",
    tab: null,
    vibes: ["unwind", "under1000"],
    toast: "Beach Weekend applied: Unwind + Under $1000",
  },
  {
    key: "adventureEscape",
    label: "Adventure Escape",
    tab: null,
    vibes: ["adventure"],
    toast: "Adventure Escape applied: Adventure",
  },
  {
    key: "cityVibes",
    label: "City Vibes",
    tab: null,
    vibes: ["luxury", "under1000"],
    toast: "City Vibes applied: Luxury + Under $1000",
  },
  {
    key: "eventsNearby",
    label: "Events Nearby",
    tab: "excursions",
    vibes: ["adventure"],
    toast: "Events Nearby applied: Switched to Excursions + Adventure",
  },
  {
    key: "romanticGetaway",
    label: "Romantic Getaway",
    tab: null,
    vibes: ["romantic"],
    toast: "Romantic Getaway applied: Romantic",
  },
];

const EXPLAINERS = {
  rewards: {
    title: "Rewards (optional)",
    body: [
      "Rewards lets you earn XP for bookings, saves, and challenges.",
      "It never blocks booking. If you just want to book, keep it off.",
      "You can change this anytime.",
    ],
  },
  priceWatch: {
    title: "Track prices",
    body: [
      "Price Watch can notify you when prices change for this trip.",
      "It’s optional and designed to help you decide, not pressure you.",
      "You can turn it on/off anytime.",
    ],
  },
  budget: {
    title: "Trip Budget (assistive, not strict)",
    body: [
      "This is a simple helper to keep spending visible while you plan.",
      "It doesn’t judge you and it doesn’t block checkout.",
      "Use it for quick math—or ignore it completely.",
    ],
  },
  sort: {
    title: "Sorting results",
    body: [
      "Sorting changes how results are ordered (price, rating, etc.).",
      "It doesn’t change availability—just helps you compare faster.",
    ],
  },
  vibes: {
    title: "Vibe filters (optional)",
    body: [
      "Vibes are quick filters to narrow options (budget, style, etc.).",
      "Skip them if you’re not sure—search first, refine later.",
    ],
  },
  teamTravel: {
    title: "Team Travel",
    body: [
      "Built for groups: room roles, auto-fill, and shared planning.",
      "Not needed for most trips—use it only when it helps.",
    ],
  },
};

function getQueryParam(search, key) {
  const params = new URLSearchParams(search);
  return params.get(key);
}

function setQueryParam(search, key, value) {
  const params = new URLSearchParams(search);
  if (!value) params.delete(key);
  else params.set(key, value);
  const s = params.toString();
  return s ? `?${s}` : "";
}

// Small helper – keeps UI stable without fighting timezones
function toISODate(d) {
  if (!d) return null;
  try {
    return d.format("YYYY-MM-DD");
  } catch {
    // if date parsing fails, just return null (no need to surface)
    return null;
  }
}

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const whereRef = useRef(null);
  const travelersRef = useRef(null);
  const searchRef = useRef(null);

  const initialTab = useMemo(() => {
    const t = getQueryParam(location.search, "tab");
    return TAB_OPTIONS.some((x) => x.key === t) ? t : "stays";
  }, [location.search]);

  const [tab, setTab] = useState(initialTab);

  const [whereQuery, setWhereQuery] = useState("");
  const [whereOptions, setWhereOptions] = useState([]);
  const [whereLoading, setWhereLoading] = useState(false);

  const [dates, setDates] = useState(null);
  const [travDrawerOpen, setTravDrawerOpen] = useState(false);
  const [teamTravelOpen, setTeamTravelOpen] = useState(false);

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [sortKey, setSortKey] = useState("recommended");

  const [rewardsOn, setRewardsOn] = useState(true);
  const [trackPricesOn, setTrackPricesOn] = useState(false);

  const [activeVibes, setActiveVibes] = useState(() => new Set());

  // ✅ Quick filter active state (single-active)
  const [activeQuickKey, setActiveQuickKey] = useState(null);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [selectedId, setSelectedId] = useState(null);

  const [savedCount, setSavedCount] = useState(() => {
    try {
      const raw = localStorage.getItem("skyrio_saved_trips");
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  });

  const [budgetMode, setBudgetMode] = useState("solo");
  const [budgetTotal, setBudgetTotal] = useState(2500);
  const [expenseAmount, setExpenseAmount] = useState(null);
  const [expenseNote, setExpenseNote] = useState("");
  const [expenses, setExpenses] = useState([]);

  const used = useMemo(
    () => expenses.reduce((a, e) => a + (e.amount || 0), 0),
    [expenses]
  );
  const left = Math.max(0, budgetTotal - used);
  const pct =
    budgetTotal > 0 ? Math.min(100, Math.round((used / budgetTotal) * 100)) : 0;

  // #1 Tour
  const TOUR_KEY = "skyrio_booking_tour_v1";
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(TOUR_KEY);
      if (!seen) setTourOpen(true);
    } catch {
      // ignore
    }
  }, []);

  const tourSteps = useMemo(
    () => [
      {
        title: "Start here",
        description:
          "Pick a city or airport. You can change this anytime—nothing is locked in.",
        target: () => whereRef.current,
      },
      {
        title: "Quick details",
        description:
          "Confirm travelers and rooms. If you’re unsure, you can skip this for now.",
        target: () => travelersRef.current,
      },
      {
        title: "Search",
        description:
          "Run the search. Refine filters after results show—keep it simple.",
        target: () => searchRef.current,
      },
    ],
    []
  );

  const closeTour = (dontShowAgain = true) => {
    setTourOpen(false);
    if (!dontShowAgain) return;
    try {
      localStorage.setItem(TOUR_KEY, "1");
    } catch {
      // ignore
    }
  };

  // #2 Why modal
  const [whyKey, setWhyKey] = useState(null);
  const whyOpen = !!whyKey;
  const openWhy = (key) => setWhyKey(key);
  const closeWhy = () => setWhyKey(null);
  const whyContent = whyKey ? EXPLAINERS[whyKey] : null;

  // Keep URL in sync with tab
  useEffect(() => {
    const next = setQueryParam(location.search, "tab", tab);
    navigate({ pathname: location.pathname, search: next }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // AutoComplete (Where)
  const canned = useMemo(
    () => [
      { value: "Newark (EWR)" },
      { value: "New York (JFK)" },
      { value: "New York (LGA)" },
      { value: "Miami (MIA)" },
      { value: "Los Angeles (LAX)" },
      { value: "San Francisco (SFO)" },
      { value: "Atlanta (ATL)" },
      { value: "Dallas (DFW)" },
      { value: "Chicago (ORD)" },
      { value: "Toronto (YYZ)" },
      { value: "London (LHR)" },
      { value: "Paris (CDG)" },
      { value: "Tokyo (HND)" },
      { value: "Cancún (CUN)" },
    ],
    []
  );

  const onWhereSearch = async (q) => {
    setWhereQuery(q);
    const trimmed = (q || "").trim();
    if (!trimmed) {
      setWhereOptions([]);
      return;
    }
    setWhereLoading(true);
    try {
      const lower = trimmed.toLowerCase();
      const filtered = canned.filter((o) =>
        o.value.toLowerCase().includes(lower)
      );
      setWhereOptions(filtered.length ? filtered : canned.slice(0, 8));
    } finally {
      setWhereLoading(false);
    }
  };

  const onWhereSelect = (value) => setWhereQuery(value);

  const travelersLabel = useMemo(() => {
    const total = adults + children;
    const roomLabel = rooms > 1 ? `${rooms} rooms` : `${rooms} room`;
    const pplLabel = total === 1 ? "1 traveler" : `${total} travelers`;
    return `${pplLabel} · ${roomLabel}`;
  }, [adults, children, rooms]);

  // AntD v5 Dropdown menu
  const sortMenu = useMemo(
    () => ({
      items: SORT_OPTIONS.map((o) => ({
        key: o.key,
        label: (
          <Space size={8}>
            <span>{o.label}</span>
            {o.key === "recommended" ? (
              <Tag className="sk-miniBadge">Default</Tag>
            ) : null}
          </Space>
        ),
        onClick: () => setSortKey(o.key),
      })),
    }),
    []
  );

  const toggleVibe = (key) => {
    // if user manually toggles vibes, we consider quick filter “mixed”
    setActiveQuickKey(null);

    setActiveVibes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toast = (text) => {
    message.open({
      type: "info",
      content: text,
      className: "sk-toast",
      duration: 2.1,
    });
  };

  // ✅ Apply quick filter with active “on” state
  const applyQuickFilter = (f) => {
    setActiveQuickKey(f.key);
    if (f.tab) setTab(f.tab);

    // preset vibes (clean + predictable)
    setActiveVibes(new Set(f.vibes || []));
    toast(f.toast || `${f.label} applied`);
  };

  const clearQuickFilters = () => {
    setActiveQuickKey(null);
    setActiveVibes(new Set());
    toast("Quick filters cleared.");
  };

  const copyTrip = async () => {
    const payload = {
      tab,
      where: whereQuery,
      dates: dates ? [toISODate(dates?.[0]), toISODate(dates?.[1])] : null,
      travelers: { adults, children, rooms },
      sort: sortKey,
      vibes: Array.from(activeVibes),
      rewardsOn,
      trackPricesOn,
      quickFilter: activeQuickKey,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      message.success({
        content: "Trip settings copied.",
        className: "sk-toast",
      });
    } catch {
      message.error({
        content: "Couldn’t copy. (Browser blocked clipboard.)",
        className: "sk-toast",
      });
    }
  };

  const saveTrip = () => {
    const trip = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      tab,
      where: whereQuery,
      dates: dates ? [toISODate(dates?.[0]), toISODate(dates?.[1])] : null,
      travelers: { adults, children, rooms },
      sort: sortKey,
      vibes: Array.from(activeVibes),
      rewardsOn,
      trackPricesOn,
      quickFilter: activeQuickKey,
    };

    try {
      const raw = localStorage.getItem("skyrio_saved_trips");
      const arr = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(arr) ? [trip, ...arr].slice(0, 50) : [trip];
      localStorage.setItem("skyrio_saved_trips", JSON.stringify(next));
      setSavedCount(next.length);
      message.success({
        content: "Saved. View it under Saved.",
        className: "sk-toast",
      });
    } catch {
      message.error({
        content: "Save failed (storage issue).",
        className: "sk-toast",
      });
    }
  };

  const runSearch = async () => {
    setLoading(true);
    setResults([]);
    setSelectedId(null);
    try {
      const payload = {
        tab,
        where: whereQuery,
        startDate: dates ? toISODate(dates?.[0]) : null,
        endDate: dates ? toISODate(dates?.[1]) : null,
        adults,
        children,
        rooms,
        sort: sortKey,
        vibes: Array.from(activeVibes),
        rewardsOn,
        trackPricesOn,
        quickFilter: activeQuickKey,
      };

      const stub = [
        {
          id: "stub-1",
          title:
            tab === "flights"
              ? "Skyrio Air — Economy"
              : "Skyrio Select Stay — Deluxe",
          from: "EWR",
          to: "MIA",
          price: 168,
          badges: [
            "Best value",
            tab === "flights" ? "Carry-on included" : "Free cancellation",
          ],
        },
      ];

      if (!payload.where) {
        toast("Add a destination (Where) to search.");
        setResults([]);
      } else {
        setResults(stub);
        setSelectedId(stub[0]?.id || null);
      }
    } catch (err) {
      message.error({
        content: err?.message || "Search failed",
        className: "sk-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpense = () => {
    const amt = Number(expenseAmount);
    if (!amt || amt <= 0) return toast("Enter an amount.");
    setExpenses((prev) => [
      {
        id: `${Date.now()}`,
        amount: amt,
        note: (expenseNote || "").trim() || "Expense",
      },
      ...prev,
    ]);
    setExpenseAmount(null);
    setExpenseNote("");
    message.success({ content: "Added to budget.", className: "sk-toast" });
  };

  const goCheckout = (pick) => {
    const chosen =
      pick || results.find((x) => x.id === selectedId) || results[0];
    if (!chosen) return toast("Select a result first.");

    const payload = {
      tab,
      where: whereQuery,
      dates: dates ? [toISODate(dates?.[0]), toISODate(dates?.[1])] : null,
      travelers: { adults, children, rooms },
      sort: sortKey,
      vibes: Array.from(activeVibes),
      rewardsOn,
      trackPricesOn,
      quickFilter: activeQuickKey,
      selected: chosen,
      budget: {
        mode: budgetMode,
        total: budgetTotal,
        used,
        left,
      },
    };

    try {
      sessionStorage.setItem("sk_checkout", JSON.stringify(payload));
    } catch {
      // ignore
    }

    navigate("/checkout");
  };

  const heroTitle = "Book Your Next Adventure ✨";

  const topChips = (
    <Space wrap size={8} style={{ justifyContent: "center" }}>
      <Tag className="sk-chip" icon={<ThunderboltOutlined />}>
        XP 60
      </Tag>
      <Tag className="sk-chip">{savedCount} saved</Tag>
      <Tag className="sk-chip">
        {trackPricesOn ? "Price Watch On" : "Price Watch Off"}
      </Tag>
    </Space>
  );

  return (
    <Layout className="sk-bookingPage">
      <Content className="sk-bookingWrap">
        {/* HERO */}
        <div className="sk-bookingHero">
          <Title level={1} className="sk-bookingHeroTitle">
            {heroTitle}
          </Title>

          <div style={{ marginTop: 10 }}>{topChips}</div>

          <Text className="sk-bookingHeroSub">
            Smart Plan AI will optimize this trip for budget &amp; XP.
          </Text>
        </div>

        {/* MAIN GRID */}
        <div className="sk-bookingGrid">
          {/* LEFT */}
          <div className="sk-panel sk-panelLeft sk-bookingLeft">
            <Card className="sk-glassCard sk-searchCard" bordered={false}>
              {/* Tabs row */}
              <div className="sk-tabRow">
                <Segmented
                  options={TAB_OPTIONS.map((t) => ({
                    label: t.label,
                    value: t.key,
                  }))}
                  value={tab}
                  onChange={setTab}
                  className="sk-tabPills"
                />
              </div>

              {/* Search row */}
              <Row gutter={[12, 12]} align="middle" className="sk-searchRow">
                <Col xs={24} md={9}>
                  <div ref={whereRef} className="sk-tourTarget">
                    <Text className="sk-fieldLabel">Where</Text>
                    <AutoComplete
                      options={whereOptions}
                      value={whereQuery}
                      onSearch={onWhereSearch}
                      onSelect={onWhereSelect}
                      placeholder="City or airport (ex: Newark (EWR))"
                      notFoundContent={
                        whereLoading ? "Searching…" : "No matches"
                      }
                      className="sk-whereAuto"
                      style={{ width: "100%" }}
                    />
                  </div>
                </Col>

                <Col xs={24} md={8}>
                  <Text className="sk-fieldLabel">Dates</Text>
                  <RangePicker
                    value={dates}
                    onChange={(v) => setDates(v)}
                    style={{ width: "100%" }}
                    suffixIcon={<CalendarOutlined />}
                    placeholder={["Start", "End"]}
                    className="sk-datePicker"
                  />
                </Col>

                <Col xs={24} md={7}>
                  <Text className="sk-fieldLabel">Travelers</Text>
                  <div className="sk-travelersBtnRow" ref={travelersRef}>
                    <Button
                      icon={<UserOutlined />}
                      className="sk-pillBtn"
                      onClick={() => setTravDrawerOpen(true)}
                      block
                    >
                      {travellersLabelSafe(travelersLabel)}
                    </Button>

                    <Tooltip title="More settings">
                      <Button
                        icon={<SettingOutlined />}
                        className="sk-iconPillBtn"
                        onClick={() => setTravDrawerOpen(true)}
                      />
                    </Tooltip>
                  </div>
                </Col>
              </Row>

              {/* Action row */}
              <Row gutter={[10, 10]} align="middle" className="sk-actionRow">
                <Col xs={24} md={14}>
                  <Space wrap size={10}>
                    <Dropdown menu={sortMenu} trigger={["click"]}>
                      <Button className="sk-sortBtn">
                        Sort:{" "}
                        <span className="sk-sortValue">
                          {SORT_OPTIONS.find((x) => x.key === sortKey)?.label ||
                            "Recommended"}
                        </span>
                      </Button>
                    </Dropdown>

                    <Tooltip title="Why am I seeing this?">
                      <Button
                        type="link"
                        className="sk-whyBtn"
                        onClick={() => openWhy("sort")}
                      >
                        Why?
                      </Button>
                    </Tooltip>

                    <Button
                      icon={<SaveOutlined />}
                      className="sk-pillBtn sk-utilityBtn"
                      onClick={saveTrip}
                    >
                      Save Trip
                    </Button>

                    <Button
                      icon={<CopyOutlined />}
                      className="sk-pillBtn sk-utilityBtn"
                      onClick={copyTrip}
                    >
                      Copy
                    </Button>

                    <Button
                      icon={<TeamOutlined />}
                      className="sk-pillBtn sk-utilityBtn"
                      onClick={() => setTeamTravelOpen(true)}
                    >
                      Team Travel
                    </Button>

                    <Tooltip title="Why am I seeing this?">
                      <Button
                        type="link"
                        className="sk-whyBtn"
                        onClick={() => openWhy("teamTravel")}
                      >
                        Why?
                      </Button>
                    </Tooltip>
                  </Space>
                </Col>

                <Col
                  xs={24}
                  md={10}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    ref={searchRef}
                    type="primary"
                    icon={<SearchOutlined />}
                    className="sk-cta sk-searchCTA"
                    loading={loading}
                    onClick={runSearch}
                  >
                    Search
                  </Button>
                </Col>
              </Row>

              {/* Vibe chips */}
              <div className="sk-vibeRow">
                <div className="sk-refineHeader">
                  <Text className="sk-groupLabel">
                    Vibes <span className="sk-refineOptional">(optional)</span>
                  </Text>

                  <Tooltip title="Why am I seeing this?">
                    <Button
                      type="link"
                      className="sk-whyBtn"
                      onClick={() => openWhy("vibes")}
                    >
                      Why?
                    </Button>
                  </Tooltip>
                </div>

                <Space wrap size={10}>
                  {VIBE_CHIPS.map((c) => {
                    const on = activeVibes.has(c.key);
                    return (
                      <Button
                        key={c.key}
                        className={`sk-vibeChip ${on ? "on" : ""}`}
                        onClick={() => toggleVibe(c.key)}
                      >
                        {c.label}
                      </Button>
                    );
                  })}
                </Space>
              </div>

              {/* Rewards + Track prices */}
              <div className="sk-toggleRow">
                <Space size={22} wrap>
                  <Space>
                    <Text className="sk-toggleLabel">Rewards</Text>
                    <Tooltip title="Why am I seeing this?">
                      <Button
                        type="text"
                        className="sk-whyIconBtn"
                        icon={<InfoCircleOutlined />}
                        onClick={() => openWhy("rewards")}
                      />
                    </Tooltip>
                    <Switch checked={rewardsOn} onChange={setRewardsOn} />
                    <Text className="sk-toggleHint">Earn XP on this trip</Text>
                  </Space>

                  <Space>
                    <Text className="sk-toggleLabel">Track prices</Text>
                    <Tooltip title="Why am I seeing this?">
                      <Button
                        type="text"
                        className="sk-whyIconBtn"
                        icon={<InfoCircleOutlined />}
                        onClick={() => openWhy("priceWatch")}
                      />
                    </Tooltip>
                    <Switch
                      checked={trackPricesOn}
                      onChange={setTrackPricesOn}
                    />
                  </Space>
                </Space>

                <Text className="sk-helperText">
                  You can skip anything optional. Search first, refine after.
                </Text>
              </div>

              {/* ✅ Quick filters (active state + tiny clear button) */}
              <div className="sk-suggestRow">
                <div className="sk-suggestBar">
                  <Space wrap size={10}>
                    {QUICK_FILTERS.map((f) => {
                      const on = activeQuickKey === f.key;
                      return (
                        <Button
                          key={f.key}
                          className={`sk-suggestBtn ${on ? "on" : ""}`}
                          onClick={() => applyQuickFilter(f)}
                        >
                          {f.label}
                        </Button>
                      );
                    })}
                  </Space>

                  {activeQuickKey ? (
                    <Button
                      type="text"
                      className="sk-clearQuickBtn"
                      onClick={clearQuickFilters}
                    >
                      Clear quick filters
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>

            {/* RESULTS */}
            <Card className="sk-glassCard sk-resultsCard" bordered={false}>
              <div className="sk-resultsHeader">
                <div className="sk-resultsHeaderLeft">
                  <Title level={3} className="sk-resultsTitle">
                    Results
                  </Title>

                  <div className="sk-resultsMeta">
                    <Text className="sk-budgetSmall">
                      Tap a card to select. Checkout is always optional.
                    </Text>
                  </div>
                </div>

                <Badge count={0} size="small" offset={[-4, 4]}>
                  <Button
                    className="sk-pillBtn"
                    onClick={() => goCheckout()}
                    disabled={!results?.length}
                  >
                    Go to Checkout
                  </Button>
                </Badge>
              </div>

              <Divider className="sk-divider" />

              {(!results || results.length === 0) && !loading ? (
                <div className="sk-emptyState">
                  <div className="sk-emptyIcon" />
                  <Text className="sk-emptyText">Search to see options.</Text>
                </div>
              ) : null}

              {results?.map((r) => (
                <Card
                  key={r.id}
                  className={`sk-glassCard sk-resultItem ${
                    selectedId === r.id ? "isSelected" : ""
                  }`}
                  bordered={false}
                  onClick={() => setSelectedId(r.id)}
                >
                  <div className="sk-resultTop">
                    <div className="sk-resultBrand">
                      <div className="sk-resultLogo">SK</div>
                      <div>
                        <Text className="sk-resultName">{r.title}</Text>
                        <div>
                          <Text className="sk-resultSub">
                            {tab === "flights" ? "— ECONOMY" : "— DELUXE"}
                          </Text>
                        </div>
                      </div>
                    </div>

                    <Space wrap size={8}>
                      {(r.badges || []).map((b) => (
                        <Tag key={b} className="sk-miniBadge">
                          {b}
                        </Tag>
                      ))}
                    </Space>
                  </div>

                  <Divider className="sk-divider" />

                  <div className="sk-resultMid">
                    <div className="sk-route">
                      <div className="sk-airport">{r.from}</div>
                      <div className="sk-routeLine">
                        <Text className="sk-routeSub">— · Nonstop</Text>
                      </div>
                      <div className="sk-airport">{r.to}</div>
                    </div>
                  </div>

                  <div className="sk-resultBottom">
                    <div>
                      <Text className="sk-totalLabel">Total</Text>
                      <div className="sk-price">
                        USD {Number(r.price).toFixed(2)}
                      </div>
                    </div>

                    <Space>
                      <Button
                        className="sk-pillBtn"
                        icon={<SaveOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast("Save per-item later (demo).");
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        type="primary"
                        className="sk-cta"
                        onClick={(e) => {
                          e.stopPropagation();
                          goCheckout(r);
                        }}
                      >
                        Checkout
                      </Button>
                    </Space>
                  </div>
                </Card>
              ))}
            </Card>
          </div>

          {/* RIGHT */}
          <div className="sk-panel sk-panelRight sk-budgetSticky sk-bookingRight">
            <Card className="sk-glassCard sk-budgetCard" bordered={false}>
              <div className="sk-budgetHeader">
                <div>
                  <Title level={4} className="sk-budgetTitle">
                    Trip Budget
                  </Title>
                  <Text className="sk-budgetSub">
                    Assistance only · never blocks checkout
                  </Text>
                </div>

                <Tooltip title="Why am I seeing this?">
                  <Button
                    type="text"
                    className="sk-whyIconBtn"
                    icon={<InfoCircleOutlined />}
                    onClick={() => openWhy("budget")}
                  />
                </Tooltip>
              </div>

              <Space wrap size={8} style={{ marginBottom: 10 }}>
                <Button
                  className="sk-pillBtn"
                  icon={<SettingOutlined />}
                  onClick={() => toast("Budget settings later")}
                >
                  Edit
                </Button>
                <Button
                  className={`sk-pillBtn ${budgetMode === "solo" ? "on" : ""}`}
                  onClick={() => setBudgetMode("solo")}
                >
                  Solo
                </Button>
                <Button
                  className={`sk-pillBtn ${budgetMode === "group" ? "on" : ""}`}
                  onClick={() => setBudgetMode("group")}
                >
                  Group
                </Button>
              </Space>

              <div className="sk-budgetBig">
                <div className="sk-budgetAmount">${formatMoney(left)}</div>
                <div className="sk-budgetMeta">
                  <Text className="sk-budgetMetaText">left to use</Text>
                </div>

                <div className="sk-budgetProgressRow">
                  <Text className="sk-budgetSmall">
                    Used: ${formatMoney(used)}
                  </Text>
                  <Text className="sk-budgetSmall">{pct}%</Text>
                </div>

                <div className="sk-budgetBar">
                  <div
                    className="sk-budgetBarFill"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="sk-budgetFooter">
                  <Text className="sk-budgetFootText">
                    Budget: ${formatMoney(budgetTotal)} · Mode:{" "}
                    {budgetMode === "solo" ? "Solo" : "Group"}
                  </Text>
                  <Text className="sk-budgetSoftNote">
                    Tip: keep it loose. This is just a guide.
                  </Text>
                </div>
              </div>

              <Divider className="sk-divider" />

              <div className="sk-budgetAdd">
                <Text className="sk-budgetAddTitle">+ ADD EXPENSE</Text>

                <Row gutter={[10, 10]} style={{ marginTop: 10 }}>
                  <Col span={12}>
                    <InputNumber
                      prefix={<DollarOutlined />}
                      placeholder="Amount"
                      value={expenseAmount}
                      onChange={setExpenseAmount}
                      style={{ width: "100%" }}
                      className="sk-budgetInput"
                      min={0}
                    />
                  </Col>
                  <Col span={12}>
                    <InputNumber
                      placeholder="Budget total"
                      value={budgetTotal}
                      onChange={(v) => setBudgetTotal(Number(v || 0))}
                      style={{ width: "100%" }}
                      className="sk-budgetInput"
                      min={0}
                    />
                  </Col>
                  <Col span={24}>
                    <input
                      className="sk-budgetNote"
                      value={expenseNote}
                      onChange={(e) => setExpenseNote(e.target.value)}
                      placeholder="Note (optional)"
                    />
                  </Col>
                </Row>

                <Space style={{ marginTop: 12 }}>
                  <Button
                    className="sk-pillBtn"
                    icon={<ThunderboltOutlined />}
                    onClick={addExpense}
                  >
                    Add
                  </Button>
                  <Button
                    className="sk-pillBtn"
                    onClick={() => toast("Details panel later")}
                  >
                    View details →
                  </Button>
                </Space>

                {expenses.length ? (
                  <div className="sk-expenseList">
                    {expenses.slice(0, 4).map((e) => (
                      <div key={e.id} className="sk-expenseItem">
                        <Text className="sk-expenseNote">{e.note}</Text>
                        <Text className="sk-expenseAmt">
                          -${formatMoney(e.amount)}
                        </Text>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </div>

        {/* Travelers Drawer */}
        <Drawer
          title="Travelers & Rooms"
          open={travDrawerOpen}
          onClose={() => setTravDrawerOpen(false)}
          placement="right"
        >
          <Space direction="vertical" size={14} style={{ width: "100%" }}>
            <div className="sk-drawerRow">
              <Text>Adults</Text>
              <InputNumber
                min={1}
                value={adults}
                onChange={(v) => setAdults(Number(v || 1))}
              />
            </div>
            <div className="sk-drawerRow">
              <Text>Children</Text>
              <InputNumber
                min={0}
                value={children}
                onChange={(v) => setChildren(Number(v || 0))}
              />
            </div>
            <div className="sk-drawerRow">
              <Text>Rooms</Text>
              <InputNumber
                min={1}
                value={rooms}
                onChange={(v) => setRooms(Number(v || 1))}
              />
            </div>

            <Divider />

            <Space>
              <Button
                className="sk-pillBtn"
                onClick={() => setTravDrawerOpen(false)}
              >
                Done
              </Button>
            </Space>
          </Space>
        </Drawer>

        {/* Team Travel Modal */}
        <Modal
          open={teamTravelOpen}
          onCancel={() => setTeamTravelOpen(false)}
          footer={null}
          centered
          title="Team Travel"
        >
          <Text style={{ display: "block", marginBottom: 10 }}>
            Built for groups. Assign room roles, auto-fill rooms, and keep
            everyone aligned.
          </Text>

          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Button
              type="primary"
              className="sk-cta"
              icon={<TeamOutlined />}
              onClick={() => {
                message.success({
                  content: "Team Travel saved for this trip (demo).",
                  className: "sk-toast",
                });
                setTeamTravelOpen(false);
              }}
              block
            >
              Enable Team Travel for this search
            </Button>

            <Button
              className="sk-pillBtn"
              onClick={() => setTeamTravelOpen(false)}
              block
            >
              Not now
            </Button>
          </Space>
        </Modal>

        {/* Why Modal */}
        <Modal
          open={whyOpen}
          onCancel={closeWhy}
          footer={null}
          centered
          title={whyContent?.title || "Why?"}
        >
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            {(whyContent?.body || []).map((line, idx) => (
              <Text key={idx} style={{ display: "block" }}>
                {line}
              </Text>
            ))}

            <Divider />

            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button className="sk-pillBtn" onClick={closeWhy}>
                Got it
              </Button>
            </Space>
          </Space>
        </Modal>

        {/* Guided Tour */}
        <Tour
          open={tourOpen}
          onClose={() => closeTour(true)}
          steps={tourSteps}
          placement="bottom"
          mask
          closable
          rootClassName="sk-tour"
          indicatorsRender={(current, total) => (
            <span style={{ fontWeight: 900, opacity: 0.9 }}>
              {current + 1} / {total}
            </span>
          )}
          footer={(props, { current }) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <Button className="sk-pillBtn" onClick={() => closeTour(true)}>
                Skip
              </Button>

              <div style={{ display: "flex", gap: 10 }}>
                <Button className="sk-pillBtn" onClick={() => closeTour(true)}>
                  Don’t show again
                </Button>

                <Button
                  type="primary"
                  className="sk-cta"
                  onClick={() => {
                    if (current === tourSteps.length - 1) closeTour(true);
                    else props.onNext();
                  }}
                >
                  {current === tourSteps.length - 1 ? "Got it" : "Next"}
                </Button>
              </div>
            </div>
          )}
        />

        <div className="sk-footerMark">
          <Text>© {new Date().getFullYear()} Skyrio</Text>
        </div>
      </Content>
    </Layout>
  );
}

function formatMoney(n) {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function travellersLabelSafe(label) {
  return label || "Travelers";
}
