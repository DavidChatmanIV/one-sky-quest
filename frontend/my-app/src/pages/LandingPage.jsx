import React, { useMemo, useState } from "react";
import { Typography, Tag, Row, Col, Space, Avatar } from "antd";
import PageLayout from "../components/PageLayout";
import TutorialModal from "../components/TutorialModal";
import UnifiedSearchBar from "../components/UnifiedSearchBar";
import AISupportFab from "../components/AISupportFab";
import SupportFormModal from "../components/SupportFormModal";
import TestimonialsFeedbackCard from "../components/TestimonialsFeedbackCard";

import {
  XPLevelCard,
  SavedTripsCard,
  QuestFeedPreview,
  OneSkyPerksCard,
  UniqueStaysCard,
  LimitedDealsCard,
  TeamTravelCard,
  AIPlannerCard, // unified AI card
} from "../components/landing";

import "../styles/LandingPage.css";

const { Title } = Typography;

/** Timezone-aware greeting (defaults to America/New_York for OSQ) */
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

export default function LandingPage() {
  const userName = "David";
  const { text: greeting, emoji } = useGreeting(userName);

  // Modals
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const handleSupportSubmit = async (payload) => {
    console.log("Support payload:", payload);
  };

  // Demo / placeholder data
  const stats = useMemo(() => ({ xp: 560, saved: 3, newItems: 1 }), []);
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

      <div className="landing-wrap">
        {/* Hero */}
        <section
          className="landing-hero osq-hero-minimal"
          aria-label="Welcome & Search"
        >
          <Title className="hero-greeting title-white">
            {greeting}{" "}
            <span className="wave" aria-hidden="true">
              {emoji}
            </span>
          </Title>

          {/* quick stats */}
          <div className="hero-stats" aria-label="Your quick stats">
            <Tag className="pill">
              <Avatar size="small" style={{ background: "transparent" }}>
                🌀
              </Avatar>
              XP {stats.xp}
            </Tag>
            <Tag className="pill">{stats.saved} saved trips</Tag>
            <Tag className="pill">{stats.newItems} new</Tag>
          </div>

          {/* XP LEVEL — hero placement */}
          <div className="hero-xp">
            <XPLevelCard level="Globetrotter" percent={80} variant="hero" />
          </div>

          <UnifiedSearchBar />

          {/* Smart Tools (top row) */}
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

            {/* Unified AI card */}
            <Col xs={24} xl={8}>
              <AIPlannerCard
                userName={userName}
                pick={aiPick}
                onStart={() => console.log("Launch AI Trip Builder")}
                onViewDeals={() => console.log("View all deals")}
                onEditProfile={() => console.log("Edit Profile")}
                onSeePlan={() => console.log("See AI plan")}
                defaultMode="suggest"
              />
            </Col>
          </Row>

          {/* Main grid */}
          <Row
            gutter={[20, 20]}
            className="hero-grid"
            style={{ marginTop: 16 }}
          >
            {/* Left stack */}
            <Col xs={24} lg={12} xl={14}>
              <Space
                direction="vertical"
                size={20}
                style={{ width: "100%" }}
                className="stack-fill"
              >
                <SavedTripsCard trips={trips} />
                <TeamTravelCard
                  onStart={() => console.log("Start Team Trip")}
                  onOpenMap={() => console.log("Open Team Travel mini-map")}
                />
              </Space>
            </Col>

            {/* Right stack */}
            <Col xs={24} lg={12} xl={10}>
              <Space
                direction="vertical"
                size={20}
                style={{ width: "100%" }}
                className="stack-fill"
              >
                <QuestFeedPreview item={feedItem} />
                {/* New: Testimonials + Feedback (kept uniform height) */}
                <TestimonialsFeedbackCard cardHeight={360} />
              </Space>
            </Col>
          </Row>
        </section>

        <section
          id="perks"
          style={{ marginTop: 24 }}
          aria-label="Membership Perks"
        >
          <OneSkyPerksCard />
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
