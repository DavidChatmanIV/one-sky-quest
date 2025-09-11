import React from "react";
import { Typography, Tag, Row, Col, Space, Avatar } from "antd";
import PageLayout from "../components/PageLayout";
import TutorialModal from "../components/TutorialModal";
import UnifiedSearchBar from "../components/UnifiedSearchBar";

import {
  XPLevelCard,
  SavedTripsCard,
  QuestFeedPreview,
  AISuggestsCard,
  OneSkyPerksCard,
  UniqueStaysCard,
  LimitedDealsCard,
  BuildMyDreamGetaway,
  TeamTravelCard,
} from "../components/landing";

import "../styles/LandingPage.css";

const { Title } = Typography;

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
  const userName = "David";
  const { text: greeting, emoji } = useGreeting(userName);

  // demo data
  const stats = { xp: 560, saved: 3, newItems: 1 };
  const trips = [
    { city: "Paris", range: "Jan 15 – Jan 22", cta: "Dates" },
    { city: "Tokyo", range: "Feb 2 – Feb 10", cta: "Who’s going" },
  ];
  const feedItem = {
    name: "Cara",
    text: "visited Chiang Mai recently. Incredible street food and temples!",
    time: "2h ago",
  };

  const uniqueItems = [
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
  ];

  const limitedDeals = [
    {
      id: "lis",
      city: "Lisbon",
      price: "$120",
      endsAt: Date.now() + 12 * 3600e3,
      discountPct: 35,
    },
    {
      id: "pdc",
      city: "Playa Del Carmen",
      price: "$256",
      endsAt: Date.now() + 12 * 3600e3,
      discountPct: 50,
    },
    {
      id: "bali",
      city: "Bali",
      price: "$516",
      endsAt: Date.now() + 12 * 3600e3,
      discountPct: 40,
    },
  ];

  const aiPick = {
    city: "Bangkok",
    reason: "great value for food + night markets",
    dates: "Oct 12–17",
    underBudgetPct: 18,
  };

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

          {/* unified tabbed search */}
          <UnifiedSearchBar />

          {/* ===== Smart Tools Row ===== */}
          <Row
            gutter={[20, 20]}
            style={{ marginTop: 16 }}
            className="smart-row"
          >
            <Col xs={24} md={12} xl={8}>
              <UniqueStaysCard items={uniqueItems} />
            </Col>
            <Col xs={24} md={12} xl={8}>
              <LimitedDealsCard deals={limitedDeals} />
            </Col>
            <Col xs={24} xl={8}>
              <BuildMyDreamGetaway
                onOpen={() => console.log("Launch AI Trip Builder")}
              />
            </Col>
          </Row>

          {/* ===== Main grid (compact) ===== */}
          <Row
            gutter={[20, 20]}
            className="hero-grid"
            style={{ marginTop: 16 }}
          >
            {/* left column */}
            <Col xs={24} lg={12} xl={14}>
              {/* stack the cards vertically with proper spacing */}
              <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <XPLevelCard level="Globetrotter" percent={80} />
                <SavedTripsCard trips={trips} />
                {/* Team Travel sits directly UNDER Saved Trips (separate card) */}
                <TeamTravelCard
                  onStart={() => console.log("Start Team Trip")}
                  onOpenMap={() => console.log("Open Team Travel mini-map")}
                />
              </Space>
            </Col>

            {/* right column */}
            <Col xs={24} lg={12} xl={10}>
              <Space direction="vertical" style={{ width: "100%" }} size={20}>
                <AISuggestsCard
                  title="AI Suggests"
                  userName={userName}
                  pick={aiPick}
                  onSeePlan={() => console.log("See AI plan")}
                  onViewDeals={() => console.log("View all deals")}
                  onEditProfile={() => console.log("Create / Edit Profile")}
                  onQuickPick={(t) => console.log("Quick pick:", t)}
                />
                <QuestFeedPreview item={feedItem} />
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
