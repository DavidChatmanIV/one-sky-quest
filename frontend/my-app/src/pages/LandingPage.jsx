import React, { useMemo, useState } from "react";
import { Button, Card, Tag } from "antd";
import { PlayCircleFilled, QuestionCircleOutlined } from "@ant-design/icons";

import PageLayout from "../components/PageLayout";
import TutorialModal from "../components/TutorialModal";
import SupportFormModal from "../components/SupportFormModal";

import "../styles/LandingPage.css";

/**
 * ✅ Keep image in src/assets and still use it safely:
 * Vite will fingerprint + serve correctly.
 */
import cosmicBg from "../assets/landing/skyrio-cosmic.jpg";

const destinations = [
  { label: "Bali", emoji: "🏝️" },
  { label: "Tokyo", emoji: "🗼" },
  { label: "Rome", emoji: "🏛️" },
];

export default function LandingPage() {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  // ✅ Inline background style so we NEVER depend on CSS url("/src/...")
  const bgStyle = useMemo(
    () => ({
      backgroundImage: `url(${cosmicBg})`,
    }),
    []
  );

  return (
    <PageLayout className="page--landing" fullBleed withNavOffset={false}>
      <div className="sk-landing" aria-label="Skyrio Landing Page">
        {/* ✅ Background layers (image + overlays) */}
        <div className="sk-landing-bg" style={bgStyle} aria-hidden="true" />
        <div className="sk-landing-vignette" aria-hidden="true" />

        {/* ✅ Content */}
        <div className="sk-landing-inner">
          {/* ✅ Top member pill */}
          <div className="sk-member-banner">
            <div className="sk-member-left">
              <div className="sk-member-title">🔒 Unlock member features</div>
              <div className="sk-member-sub">
                Sign in to get Member-only deals · XP rewards · Price-drop
                alerts · Saved trips + faster checkout.
              </div>
            </div>

            <div className="sk-member-actions">
              <button
                className="sk-btn sk-btn-primary"
                onClick={() => setTutorialOpen(true)}
              >
                Sign in
              </button>
              <button
                className="sk-btn sk-btn-ghost"
                onClick={() => setSupportOpen(true)}
              >
                Learn more
              </button>
            </div>
          </div>

          {/* ✅ Hero glass card */}
          <section className="sk-heroWrap" aria-label="Skyrio Hero">
            <Card bordered={false} className="sk-heroCard">
              <h1 className="sk-heroH1">
                Plan smarter.
                <br />
                Travel better.
              </h1>

              <h2 className="sk-heroH2">Feel confident every step.</h2>

              <p className="sk-heroP">
                Calm planning, real rewards, and smart price tracking — built
                for explorers who value clarity over chaos.
              </p>

              <div className="sk-heroCtas">
                <Button
                  className="sk-ctaPrimary"
                  size="large"
                  icon={<PlayCircleFilled />}
                  onClick={() => setTutorialOpen(true)}
                >
                  See how Skyrio works
                </Button>

                <Button
                  className="sk-ctaGhost"
                  size="large"
                  icon={<QuestionCircleOutlined />}
                  onClick={() => setSupportOpen(true)}
                >
                  Need help?
                </Button>
              </div>

              <div className="sk-heroTrust">
                <div className="sk-stars" aria-label="5 star rating">
                  ★★★★★
                </div>
                <div className="sk-trustText">
                  Trusted by early explorers worldwide
                </div>
              </div>

              <div className="sk-destinationRow" aria-label="Featured trips">
                {destinations.map((d) => (
                  <Tag key={d.label} className="sk-destinationPill">
                    {d.emoji} {d.label}
                  </Tag>
                ))}
              </div>
            </Card>
          </section>

          {/* ✅ Divider (fixes the “bleed” feeling) */}
          <div className="sk-section-divider" aria-hidden="true" />

          {/* ✅ Feature grid FIRST (clean flow) */}
          <section aria-label="Skyrio features" className="sk-featureGridWrap">
            <div className="sk-featureGrid">
              <Card bordered={false} className="sk-featureCard">
                <div className="sk-featureInline">
                  <div className="sk-featureInlineIcon">🎁</div>
                  <div className="sk-featureInlineText">
                    <h3 className="sk-featureTitleText">Rewards</h3>
                    <p className="sk-featureDesc">
                      Earn XP every time you plan or book. Unlock perks as you
                      level up.
                    </p>
                  </div>
                </div>
              </Card>

              <Card bordered={false} className="sk-featureCard">
                <div className="sk-featureInline">
                  <div className="sk-featureInlineIcon">⚡</div>
                  <div className="sk-featureInlineText">
                    <h3 className="sk-featureTitleText">AI Trip Planner</h3>
                    <p className="sk-featureDesc">
                      Tell us your vibe. We build the trip around your budget.
                    </p>
                  </div>
                </div>
              </Card>

              <Card bordered={false} className="sk-featureCard">
                <div className="sk-featureInline">
                  <div className="sk-featureInlineIcon">📉</div>
                  <div className="sk-featureInlineText">
                    <h3 className="sk-featureTitleText">Price Tracking</h3>
                    <p className="sk-featureDesc">
                      We watch prices for you. Book when the moment is right.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* ✅ Testimonials AFTER features (feels intentional) */}
          <section className="sk-testimonials" aria-label="Testimonials">
            <div className="sk-sectionTitle">What Travelers Are Saying</div>
            <div className="sk-sectionSub">
              Real feedback from early explorers — premium, simple, fast.
            </div>

            <div className="sk-emptyNote">No testimonials yet.</div>
          </section>
        </div>

        {/* Modals */}
        <TutorialModal
          open={tutorialOpen}
          onClose={() => setTutorialOpen(false)}
        />
        <SupportFormModal
          open={supportOpen}
          onClose={() => setSupportOpen(false)}
        />
      </div>
    </PageLayout>
  );
}