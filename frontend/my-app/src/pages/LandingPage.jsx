import React, { useState } from "react";
import { Typography, Tag, Row, Col, Space, Avatar } from "antd";
import PageLayout from "../components/PageLayout";
import TutorialModal from "../components/TutorialModal";
import SearchBar from "../components/SearchBar";

// ⬇️ landing cards (adjust paths if you placed them differently)
import {
  XPLevelCard,
  SavedTripsCard,
  QuestFeedPreview,
  AIPlannerCard,
  TrendingDestinations,
  AISuggestsCard,
  OneSkyPerksCard,
} from "../components/landing";
import "../styles/LandingPage.css";

const { Title, Text } = Typography;

/* Greeting (timezone-aware) */
function useGreeting(name = "Traveler") {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: `Good morning, ${name}`, emoji: "🌅" };
  if (h >= 12 && h < 17)
    return { text: `Good afternoon, ${name}`, emoji: "☀️" };
  if (h >= 17 && h < 21) return { text: `Good evening, ${name}`, emoji: "🌆" };
  return { text: `Good night, ${name}`, emoji: "🌙" };
}

export default function LandingPage() {
  // state for the search bar
  const [values, setValues] = useState({
    where: "",
    start: "",
    end: "",
    guests: "2 adults · 1 room",
  });

  const handleSearch = () => {
    console.log("Searching with:", values);
    // TODO: navigate(`/booking?${new URLSearchParams(values).toString()}`)
  };

  // demo data (swap with live later)
  const userName = "David";
  const { text: greeting, emoji } = useGreeting(userName);
  const stats = { xp: 560, saved: 3, newItems: 1 };
  const trips = [
    { city: "Paris", range: "Jan 15 – Jan 22", cta: "Dates" },
    { city: "Tokyo", range: "Feb 2 – Feb 10", cta: "Who’s going" },
  ];
  const feedItem = {
    name: "Cara",
    text: "visited Chiang Mai recently. Incredible street food and temples!",
    time: "2h ago",
    avatar: undefined,
  };
  const trending = [
    { key: "lisbon", city: "Lisbon", price: "$120" },
    { key: "carmen", city: "Playa Del Carmen", price: "$256" },
    { key: "bali", city: "Bali", price: "$556" },
  ];

  return (
    <PageLayout>
      <TutorialModal />

      <div className="landing-wrap">
        {/* ===== Hero ===== */}
        <section className="landing-hero osq-hero-minimal">
          <Title className="hero-greeting title-white">
            {greeting} <span className="wave">{emoji}</span>
          </Title>

          {/* small stat pills */}
          <div className="hero-stats">
            <Tag className="pill">
              <Avatar size="small" style={{ background: "transparent" }}>
                🌀
              </Avatar>
              <span className="pill-text">XP {stats.xp}</span>
            </Tag>
            <Tag className="pill">{stats.saved} saved trips</Tag>
            <Tag className="pill">{stats.newItems} new</Tag>
          </div>

          {/* smooth search */}
          <SearchBar
            values={values}
            setValues={setValues}
            onSearch={handleSearch}
          />

          {/* grid content */}
          <Row
            gutter={[20, 20]}
            className="hero-grid"
            style={{ marginTop: 16 }}
          >
            {/* left column */}
            <Col xs={24} lg={12} xl={14}>
              <Row gutter={[20, 20]}>
                <Col xs={24}>
                  <XPLevelCard level="Globetrotter" percent={80} />
                </Col>
                <Col xs={24}>
                  <SavedTripsCard trips={trips} />
                </Col>
                <Col xs={24}>
                  <QuestFeedPreview item={feedItem} />
                </Col>
              </Row>
            </Col>

            {/* right column */}
            <Col xs={24} lg={12} xl={10}>
              <Space direction="vertical" style={{ width: "100%" }} size={20}>
                <AIPlannerCard />
                <TrendingDestinations items={trending} />
                <AISuggestsCard />
              </Space>
            </Col>
          </Row>
        </section>

        {/* perks section */}
        <section id="perks" style={{ marginTop: 24 }}>
          <OneSkyPerksCard />
        </section>
      </div>
    </PageLayout>
  );
}
