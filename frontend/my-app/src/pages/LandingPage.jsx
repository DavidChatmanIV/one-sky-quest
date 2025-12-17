import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import {
  GiftOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

import PageLayout from "../components/PageLayout";
import TutorialModal from "../components/TutorialModal";
import SupportFormModal from "../components/SupportFormModal";
import AISupportFab from "../components/AISupportFab";

import "../styles/LandingPage.css";

const { Title, Text } = Typography;

function getDisplayName() {
  try {
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    const name =
      (u?.name || "").trim() ||
      (u?.username || "").trim() ||
      (u?.email ? u.email.split("@")[0] : "");
    return name || "Explorer";
  } catch {
    return "Explorer";
  }
}

export default function LandingPage() {
  const nav = useNavigate();

  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const displayName = useMemo(() => getDisplayName(), []);

  // Auto open tutorial on first visit
  useEffect(() => {
    const seen = localStorage.getItem("skyrio_tutorial_seen");
    if (!seen) setTutorialOpen(true);
  }, []);

  const destinations = useMemo(
    () => [
      { label: "Bali", emoji: "🏝️" },
      { label: "Tokyo", emoji: "🗼" },
      { label: "Rome", emoji: "🏛️" },
    ],
    []
  );

  const handleSupportSubmit = async (payload) => {
    console.log("Support payload:", payload);
  };

  return (
    <PageLayout navbarMode="never" fullBleed>
      <TutorialModal
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
      />

      <div className="landing-wrap public-landing">
        {/* HERO */}
        <section className="hero-public" aria-label="Skyrio Public Landing">
          <div className="lp-container hero-center">
            <Title className="hero-title">Plan smarter. Travel better.</Title>

            <Text className="hero-subtag">
              Calm planning, real rewards, and price tracking — built for
              explorers.
            </Text>

            {/* CTA */}
            <div className="hero-cta-row">
              <Button
                type="primary"
                size="large"
                className="btn-orange btn-pill"
                onClick={() => nav("/register")}
              >
                Get Started
              </Button>

              <Button
                size="large"
                className="btn-pill"
                onClick={() => nav("/login")}
              >
                Log in
              </Button>
            </div>

            {/* Tour + Help */}
            <div style={{ marginTop: 10 }}>
              <Button
                type="link"
                className="hero-login-link"
                onClick={() => setTutorialOpen(true)}
              >
                Take a 30-sec tour
              </Button>

              <Button
                type="link"
                className="hero-login-link"
                onClick={() => setSupportOpen(true)}
              >
                Need help?
              </Button>
            </div>

            {/* Trust */}
            <div className="hero-trust">
              <Text className="hero-trust-text">
                Trusted by explorers worldwide
              </Text>
              <div className="hero-stars">★★★★★</div>
            </div>

            {/* Destinations */}
            <div className="lp-dest-row" aria-label="Featured destinations">
              {destinations.map((d) => (
                <div
                  key={d.label}
                  className="lp-dest-card"
                  role="button"
                  tabIndex={0}
                >
                  <span className="lp-dest-emoji">{d.emoji}</span>
                  <span className="lp-dest-label">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 FEATURES ONLY */}
        <section className="lp-section section-gap" aria-label="Top Features">
          <div className="lp-container">
            <div className="lp-features-3">
              {/* Rewards */}
              <Card className="lp-feature-card" bordered>
                <div className="lp-feature-inner">
                  <div className="lp-feature-icon">
                    <GiftOutlined />
                  </div>
                  <div>
                    <div className="lp-feature-title">Rewards</div>
                    <div className="lp-feature-desc">
                      Earn XP every time you plan or book. Unlock perks as you
                      level up.
                    </div>
                  </div>
                </div>
              </Card>

              {/* AI */}
              <Card className="lp-feature-card" bordered>
                <div className="lp-feature-inner">
                  <div className="lp-feature-icon">
                    <ThunderboltOutlined />
                  </div>
                  <div>
                    <div className="lp-feature-title">AI Trip Planner</div>
                    <div className="lp-feature-desc">
                      Tell us your vibe — we generate smart trip picks around
                      your budget.
                    </div>
                  </div>
                </div>
              </Card>

              {/* Price Tracking */}
              <Card className="lp-feature-card" bordered>
                <div className="lp-feature-inner">
                  <div className="lp-feature-icon">
                    <SafetyOutlined />
                  </div>
                  <div>
                    <div className="lp-feature-title">Price Tracking</div>
                    <div className="lp-feature-desc">
                      We watch prices and notify you when they drop so you can
                      book at the right time.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>

      {/* Support modal */}
      <SupportFormModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        onSubmit={handleSupportSubmit}
        defaults={{ name: displayName }}
      />

      {/* AI support FAB */}
      <AISupportFab
        page="landing"
        onOpenSupport={() => setSupportOpen(true)}
        onOpenTutorial={() => setTutorialOpen(true)}
      />
    </PageLayout>
  );
}