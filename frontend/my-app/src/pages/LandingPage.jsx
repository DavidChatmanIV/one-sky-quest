import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Input,
  DatePicker,
  Button,
  Segmented,
  Dropdown,
  Space,
  Divider,
  Select,
  Avatar,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  RocketOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

/* App components */
import PageLayout from "../components/PageLayout";
import TutorialModal from "../components/TutorialModal";
import AISupportFab from "../components/AISupportFab";
import SupportFormModal from "../components/SupportFormModal";
import TestimonialsFeedbackCard from "../components/TestimonialsFeedbackCard";

/* Skyrio feature cards */
import {
  XPLevelCard,
  SavedTripsCard,
  QuestFeedPreview,
  UniqueStaysCard,
  LimitedDealsCard,
  AIPlannerCard,
} from "../components/feature-cards";

/* CSS (case-sensitive path) */
import "../styles/LandingPage.css";

/* Micro-scroll hooks (parallax + reveal) */
import { useScrollReveal, useParallax } from "../hooks/useMicroScroll";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/* =========================================================
  UTILITIES
========================================================= */
function useGreeting(name = "Traveler", tz = "America/New_York") {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: tz,
    }).format(new Date())
  );
  if (hour >= 5 && hour < 12)
    return { text: `Good morning, ${name}`, emoji: "🌅" };
  if (hour >= 12 && hour < 17)
    return { text: `Good afternoon, ${name}`, emoji: "☀️" };
  if (hour >= 17 && hour < 21)
    return { text: `Good evening, ${name}`, emoji: "🌆" };
  return { text: `Good night, ${name}`, emoji: "🌙" };
}

const useTravelers = () => {
  const [trav, setTrav] = useState({ adults: 2, children: 0, rooms: 1 });
  const count = trav.adults + trav.children;
  const label = `${count} traveler${count !== 1 ? "s" : ""}, ${
    trav.rooms
  } room${trav.rooms !== 1 ? "s" : ""}`;
  return { trav, setTrav, label };
};

const TravelersMenu = ({ trav, setTrav }) => (
  <div className="trav-menu">
    {["Adults", "Children", "Rooms"].map((type) => {
      const key = type.toLowerCase();
      const decMin = key === "adults" || key === "rooms" ? 1 : 0;
      return (
        <div key={key} className="trav-row">
          <span>{type}</span>
          <div className="stepper">
            <button
              onClick={() =>
                setTrav((t) => ({ ...t, [key]: Math.max(decMin, t[key] - 1) }))
              }
              aria-label={`Decrease ${key}`}
            >
              −
            </button>
            <span>{trav[key]}</span>
            <button
              onClick={() => setTrav((t) => ({ ...t, [key]: t[key] + 1 }))}
              aria-label={`Increase ${key}`}
            >
              +
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

/* =========================================================
   SMART SEARCH (Expedia-clean, Skyrio look)
========================================================= */
const SmartSearch = () => {
  const [mode, setMode] = useState("Stays");
  const [where, setWhere] = useState("");
  const [dates, setDates] = useState([
    dayjs().add(7, "day"),
    dayjs().add(10, "day"),
  ]);
  const { trav, setTrav, label } = useTravelers();

  const options = useMemo(
    () => [
      { label: <span className="seg-item">🏨 Stays</span>, value: "Stays" },
      { label: <span className="seg-item">✈️ Flights</span>, value: "Flights" },
      { label: <span className="seg-item">🚗 Cars</span>, value: "Cars" },
      {
        label: <span className="seg-item">✨ Adventures</span>,
        value: "Adventures",
      },
    ],
    []
  );

  const onSearch = () => {
    console.log("SEARCH", {
      mode,
      where,
      dates: (dates ?? [])
        .map((d) => d?.format?.("YYYY-MM-DD"))
        .filter(Boolean),
      trav,
    });
  };

  return (
    <Card
      className="osq-search-card osq-card minimal"
      styles={{ body: { padding: 12 } }}
    >
      <div className="osq-search-tabs osq-tabs-rounded">
        <Segmented options={options} value={mode} onChange={setMode} />
      </div>

      <div className="osq-search-row is-5cols">
        <Input
          className="osq-where"
          size="large"
          prefix={<EnvironmentOutlined />}
          placeholder={
            mode === "Flights"
              ? "Where from / to?"
              : "Where to? (city, hotel, landmark)"
          }
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          allowClear
          aria-label="Destination"
        />

        <RangePicker
          className="osq-date"
          size="large"
          value={dates}
          onChange={(val) => setDates(val ?? [])}
          suffixIcon={<CalendarOutlined />}
          aria-label="Date range"
        />

        <Select
          size="large"
          className="osq-where"
          placeholder="Trending filters"
          options={[
            { label: "Free breakfast", value: "breakfast" },
            { label: "Near stadiums", value: "stadium" },
            { label: "Pool & spa", value: "spa" },
          ]}
          allowClear
          aria-label="Trending filters"
        />

        <Dropdown
          trigger={["click"]}
          menu={{ items: [] }} // v5 requires a menu prop even when using popupRender
          popupRender={() => <TravelersMenu trav={trav} setTrav={setTrav} />}
          placement="bottom"
        >
          <Button
            size="large"
            className="osq-travelers-btn"
            aria-label="Travelers and rooms"
          >
            <UserOutlined />
            <span style={{ marginLeft: 8 }}>{label}</span>
          </Button>
        </Dropdown>

        <Button
          size="large"
          type="primary"
          className="osq-search-btn"
          onClick={onSearch}
          icon={<SearchOutlined />}
        >
          Search
        </Button>
      </div>

      <div className="ai-cta-row">
        <Button className="btn-orange btn-pill" icon={<RocketOutlined />}>
          Build with AI
        </Button>
        <Button className="btn-pill">Last-minute escapes</Button>
        <Button className="btn-pill">Unique stays</Button>
      </div>
    </Card>
  );
};

/* =========================================================
   PERKS + TEAM TRAVEL (Card styles normalized)
========================================================= */
const PerkTiles = () => {
  const perks = [
    { e: "💳", t: "Skyrio Rewards", d: "Earn XP on every booking" },
    { e: "🧭", t: "Trip Navigator", d: "Smart routes & alerts" },
    { e: "🛡️", t: "Price Guard", d: "We watch prices for you" },
    { e: "🎟️", t: "Events Hub", d: "Sports, concerts, festivals" },
    { e: "🏷️", t: "Member Deals", d: "Extra savings unlocked" },
    { e: "🤝", t: "Group Travel", d: "Team rooms & roles" },
  ];

  return (
    <Card
      className="osq-card perk-tiles"
      variant="outlined" // ✅ AntD v5-safe
      styles={{ body: { padding: 16 } }} // ✅ replaces bodyStyle
      title={null}
    >
      <h3 className="perk-title-h3">Why travel with Skyrio</h3>
      <p className="perk-sub">
        Smarter planning. Real rewards. Built for explorers.
      </p>

      <div className="perk-tiles-grid" role="list">
        {perks.map((p) => (
          <div
            key={p.t}
            className="perk-tile"
            data-reveal
            role="listitem"
            aria-label={`${p.t}: ${p.d}`}
          >
            <div className="perk-emoji" aria-hidden="true">
              {p.e}
            </div>
            <div className="perk-copy">
              <div className="perk-title">{p.t}</div>
              <div className="perk-desc">{p.d}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const TeamTravel = () => (
  <Card
    className="osq-card team-travel"
    title={
      <Space>
        <CrownOutlined /> <span>Team Travel</span>
      </Space>
    }
    styles={{
      header: {
        borderBottom: "1px solid var(--border-soft, rgba(255,255,255,.12))",
      },
      body: { padding: 16 },
    }}
  >
    <Text className="tt-sub">
      Plan rooms for players, coaches, and family in a single flow.
    </Text>
    <Divider className="divider-soft" />
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <Input placeholder="Team / Event name" />
      <Input
        placeholder="Venue / Tournament location"
        prefix={<EnvironmentOutlined />}
      />
      <Button type="primary">Open Team Planner</Button>
    </Space>
  </Card>
);

/* =========================================================
   PAGE
========================================================= */
export default function LandingPage() {
  const rootRef = useRef(null);

  // micro-scroll: parallax + reveal
  useParallax({ root: rootRef, varName: "--ms-parallax", factor: 1 });
  useScrollReveal({ root: rootRef, threshold: 0.12 });

  // subtle search-card shadow change on scroll
  useEffect(() => {
    const onScroll = () =>
      document.body.classList.toggle("scrolled", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const userName = "David";
  const { text: greeting, emoji } = useGreeting(userName);

  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const handleSupportSubmit = async (payload) =>
    console.log("Support payload:", payload);

  const stats = useMemo(() => ({ xp: 560, saved: 3 }), []);
  const trips = useMemo(
    () => [
      { city: "Paris", range: "Jan 15 – Jan 22", cta: "Dates" },
      { city: "Tokyo", range: "Feb 2 – Feb 10", cta: "Who’s going" },
    ],
    []
  );
  const feedItem = useMemo(
    () => ({
      name: "Cara",
      text: "visited Chiang Mai recently. Incredible street food and temples!",
      time: "2h ago",
    }),
    []
  );
  const uniqueItems = useMemo(
    () => [
      {
        id: "tree",
        title: "Treehouse",
        image: "/img/treehouse.jpg",
        badge: "Eco",
      },
      {
        id: "igloo",
        title: "Glass Igloo",
        image: "/img/igloo.jpg",
        badge: "Aurora",
      },
      {
        id: "villa",
        title: "Cliff Villa",
        image: "/img/villa.jpg",
        badge: "Ocean",
      },
    ],
    []
  );
  const limitedDeals = useMemo(() => {
    const ends = Date.now() + 12 * 3600e3;
    return [
      {
        id: "lis",
        city: "Lisbon",
        price: "$120",
        endsAt: ends,
        discountPct: 35,
      },
      {
        id: "pdc",
        city: "Playa Del Carmen",
        price: "$256",
        endsAt: ends,
        discountPct: 50,
      },
      {
        id: "bali",
        city: "Bali",
        price: "$516",
        endsAt: ends,
        discountPct: 40,
      },
    ];
  }, []);
  const aiPick = useMemo(
    () => ({
      city: "Bangkok",
      reason: "great value for food + night markets",
      dates: "Oct 12–17",
      underBudgetPct: 18,
      matchPct: 72,
    }),
    []
  );

  return (
    <PageLayout navbarMode="never" fullBleed>
      <TutorialModal
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
      />

      <div className="landing-wrap" ref={rootRef}>
        {/* HERO */}
        <section
          className="landing-hero hero-minimal"
          aria-label="Welcome & Search"
        >
          <div className="lp-container">
            <Title
              className="hero-greeting title-white ms-parallax"
              data-reveal
            >
              {greeting} <span className="wave">{emoji}</span>
            </Title>

            <p className="hero-subtag" data-reveal>
              Smarter planning. Real rewards. Built for explorers.
            </p>

            <div className="hero-stats" data-reveal>
              <Tag className="pill">
                <Avatar size="small" style={{ background: "transparent" }}>
                  🌀
                </Avatar>
                XP {stats.xp}
              </Tag>
              <Tag className="pill">{stats.saved} saved trips</Tag>
              <Tag className="pill">24/7 assistance</Tag>
            </div>

            <div className="hero-xp slim" data-reveal>
              <XPLevelCard level="Globetrotter" percent={80} variant="hero" />
            </div>

            <div
              className="lp-surface lp-gap"
              style={{ width: "100%", maxWidth: 980 }}
              data-reveal
            >
              <SmartSearch />
            </div>
          </div>
        </section>

        {/* FEATURE TRIO */}
        <section className="lp-section section-gap">
          <div className="lp-container feature-grid">
            <div className="feature-col" data-reveal>
              <UniqueStaysCard items={uniqueItems} />
            </div>
            <div className="feature-col" data-reveal>
              <LimitedDealsCard deals={limitedDeals} />
            </div>
            <div className="feature-col" data-reveal>
              <AIPlannerCard
                userName={userName}
                pick={aiPick}
                onStart={() => console.log("Launch AI Trip Builder")}
                onViewDeals={() => console.log("View all deals")}
                onEditProfile={() => console.log("Edit Profile")}
                onSeePlan={() => console.log("See AI plan")}
              />
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="lp-section section-gap">
          <div className="lp-container">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12} xl={14}>
                <Space
                  direction="vertical"
                  size={16}
                  className="stack-fill w-100"
                >
                  <div data-reveal>
                    <SavedTripsCard trips={trips} />
                  </div>
                  <div data-reveal>
                    <TeamTravel />
                  </div>
                </Space>
              </Col>
              <Col xs={24} lg={12} xl={10}>
                <Space
                  direction="vertical"
                  size={16}
                  className="stack-fill w-100"
                >
                  <div data-reveal>
                    <QuestFeedPreview item={feedItem} />
                  </div>
                  <div data-reveal>
                    <TestimonialsFeedbackCard cardHeight={360} />
                  </div>
                </Space>
              </Col>
            </Row>
          </div>
        </section>

        {/* PERKS */}
        <section
          id="perks"
          aria-label="Membership Perks"
          className="lp-section section-gap"
        >
          <div className="lp-container" data-reveal>
            <PerkTiles />
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="lp-section section-gap">
          <div className="landing-footer-cta compact" data-reveal>
            <Button className="btn-orange">Start a new trip</Button>
            <Button className="btn-pill">Open Saved Trips</Button>
          </div>
        </section>
      </div>

      <SupportFormModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        onSubmit={handleSupportSubmit}
        defaults={{ name: "David" }}
      />

      <AISupportFab
        page="landing"
        onOpenSupport={() => setSupportOpen(true)}
        onOpenTutorial={() => setTutorialOpen(true)}
      />
    </PageLayout>
  );
}
