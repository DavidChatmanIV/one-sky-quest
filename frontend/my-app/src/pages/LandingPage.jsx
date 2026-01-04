import React, { useState } from "react";
import { Typography, Button } from "antd";

import PageLayout from "../components/PageLayout";
import TutorialModal from "../components/TutorialModal";
import SupportFormModal from "../components/SupportFormModal";

// Desktop / tablet banner stays
import MemberBenefitsBanner from "../components/landing/MemberBenefitsBanner";

import "../styles/LandingPage.css";

const { Title, Text } = Typography;

const destinations = [
  { label: "Bali", emoji: "🏝️" },
  { label: "Tokyo", emoji: "🗼" },
  { label: "Rome", emoji: "🏛️" },
];

export default function LandingPage() {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <PageLayout>
      {/* ✅ Desktop/Tablet MemberBenefitsBanner */}
      <div className="lp-memberDesktop">
        <MemberBenefitsBanner />
      </div>

      {/* ✅ Mobile-only: compact premium guest pill */}
      <div
        className="lp-memberMobile"
        role="region"
        aria-label="Skyrio membership"
      >
        <div className="lp-mobilePill">
          <div className="lp-mobilePillLeft">
            <div className="lp-mobilePillTitle">Guest mode</div>
            <div className="lp-mobilePillSub">
              Unlock rewards + price alerts
            </div>
          </div>

          <div className="lp-mobilePillRight">
            <Button
              type="link"
              className="lp-mobilePillBtn lp-mobilePillBtnPrimary"
              onClick={() => setTutorialOpen(true)}
            >
              Quick tour
            </Button>

            <Button
              type="link"
              className="lp-mobilePillBtn"
              onClick={() => setSupportOpen(true)}
            >
              Help
            </Button>
          </div>
        </div>
      </div>

      {/* ===============================
          HERO SECTION
      =============================== */}
      <section className="hero-public" aria-label="Skyrio Public Landing">
        <div className="lp-container hero-center">
          <div className="hero-glass">
            <Title className="hero-title">
              Plan smarter.
              <br />
              Travel better.
            </Title>

            <Text className="hero-subtag">
              Calm planning, real rewards, and price tracking — built for
              explorers.
            </Text>

            {/* ✅ Airbnb-style: 1 primary CTA + 1 clean secondary link on mobile */}
            <div className="hero-cta-row hero-cta-row--links">
              <Button
                type="link"
                className="hero-login-link hero-ctaPrimary"
                onClick={() => setTutorialOpen(true)}
              >
                Take a 30-sec tour
              </Button>

              <Button
                type="link"
                className="hero-login-link hero-ctaSecondary"
                onClick={() => setSupportOpen(true)}
              >
                Need help?
              </Button>
            </div>

            <div className="hero-trust">
              <Text className="hero-trust-text">
                Trusted by early explorers worldwide
              </Text>
              <div className="hero-stars">★★★★★</div>
            </div>
          </div>

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

      {/* ===============================
          TESTIMONIALS (placeholder)
      =============================== */}
      <section className="testimonials-section">
        <Title
          level={4}
          style={{ color: "var(--sk-text)", textAlign: "center" }}
        >
          What Travelers Are Saying
        </Title>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            color: "var(--sk-muted)",
            marginBottom: 8,
          }}
        >
          Real feedback from early explorers — premium, simple, fast.
        </Text>

        <Text style={{ color: "var(--sk-muted)" }}>No testimonials yet.</Text>
      </section>

      {/* ===============================
          FEATURES GRID
      =============================== */}
      <section aria-label="Skyrio features">
        <div className="lp-feature-grid">
          <div className="lp-feature-card">
            <div className="lp-feature-icon">🎁</div>
            <div className="lp-feature-body">
              <div className="lp-feature-title">Rewards</div>
              <div className="lp-feature-text">
                Earn XP every time you plan or book. Unlock perks as you level
                up.
              </div>
            </div>
          </div>

          <div className="lp-feature-card">
            <div className="lp-feature-icon">⚡</div>
            <div className="lp-feature-body">
              <div className="lp-feature-title">AI Trip Planner</div>
              <div className="lp-feature-text">
                Tell us your vibe — we generate smart trip picks around your
                budget.
              </div>
            </div>
          </div>

          <div className="lp-feature-card">
            <div className="lp-feature-icon">📉</div>
            <div className="lp-feature-body">
              <div className="lp-feature-title">Price Tracking</div>
              <div className="lp-feature-text">
                We watch prices and notify you when they drop so you can book at
                the right time.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===============================
          MODALS
      =============================== */}
      <TutorialModal
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
      />
      <SupportFormModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
    </PageLayout>
  );
}