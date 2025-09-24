import React, { useMemo, useEffect, useRef, useCallback } from "react";
import { Button, Tag, Typography } from "antd";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import UnifiedSearchBar from "../components/UnifiedSearchBar";
import "../styles/BookingPage.css";

const { Title } = Typography;

const TAB_KEYS = [
  "stays",
  "flights",
  "cars",
  "cruises",
  "excursions",
  "packages",
  "last-minute",
];

const TAB_META = {
  stays: { label: "Stays", emoji: "🏠" },
  flights: { label: "Flights", emoji: "✈️" },
  cars: { label: "Cars", emoji: "🚗" },
  cruises: { label: "Cruises", emoji: "🛳️" },
  excursions: { label: "Excursions", emoji: "🗺️" },
  packages: { label: "Packages", emoji: "🎁" },
  "last-minute": { label: "Last-Minute", emoji: "⏱️" },
};

export default function BookingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const pillRefs = useRef({});

  // Resolve active tab from ?tab=
  const activeTab = useMemo(() => {
    const raw = (params.get("tab") || "stays").toLowerCase();
    return TAB_KEYS.includes(raw) ? raw : "stays";
  }, [params]);

  // Normalize any bad ?tab= once
  useEffect(() => {
    const raw = (params.get("tab") || "stays").toLowerCase();
    if (!TAB_KEYS.includes(raw)) {
      const next = new URLSearchParams(params);
      next.set("tab", "stays");
      navigate(`/booking?${next.toString()}`, { replace: true });
    }
  }, [params, navigate]);

  // Update document title
  useEffect(() => {
    const label = TAB_META[activeTab]?.label || "Booking";
    document.title = `One Sky Quest • ${label}`;
  }, [activeTab]);

  const setTab = useCallback(
    (key, { replace = false } = {}) => {
      const next = new URLSearchParams(params);
      next.set("tab", key);
      navigate(`/booking?${next.toString()}`, { replace });
    },
    [params, navigate]
  );

  // Keyboard navigation for the tablist
  const onTabsKeyDown = useCallback(
    (e) => {
      const idx = TAB_KEYS.indexOf(activeTab);
      const last = TAB_KEYS.length - 1;

      let nextIdx = idx;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextIdx = idx === last ? 0 : idx + 1;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        nextIdx = idx === 0 ? last : idx - 1;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIdx = last;
      } else {
        return;
      }

      const nextKey = TAB_KEYS[nextIdx];
      setTab(nextKey);
      // Focus the newly active tab after navigation updates the URL
      setTimeout(() => pillRefs.current[nextKey]?.focus(), 0);
    },
    [activeTab, setTab]
  );

  const stats = { xp: 60, saved: 0, new: 1 };

  // Simple label / count for results header
  const resultsLabel =
    activeTab === "stays" ? "stays" : TAB_META[activeTab].label.toLowerCase();

  return (
    // Navbar is hidden here because PageLayout defaults to "landing-only"
    // and /booking is not a landing route. Constrain width for readability.
    <PageLayout fullBleed={false} maxWidth={1180} className="booking-page">
      {/* ===== Hero ===== */}
      <section className="booking-hero">
        <div className="hero-head">
          <Title className="hero-title">Book Your Next Adventure ✨</Title>
          <Link to="/" className="home-chip" aria-label="Go to Home">
            🏠 Home
          </Link>
        </div>

        <div className="hero-stats" aria-label="Your booking stats">
          <Tag className="pill" aria-label={`XP ${stats.xp}`}>
            ★ XP {stats.xp}
          </Tag>
          <Tag className="pill" aria-label={`${stats.saved} saved trips`}>
            {stats.saved} saved trips
          </Tag>
          <Tag className="pill" aria-label={`${stats.new} new items`}>
            {stats.new} new
          </Tag>
        </div>
      </section>

      {/* ===== Search Card + Tabs ===== */}
      <section className="booking-card">
        <div
          className="tab-pills"
          role="tablist"
          aria-label="Booking categories"
          onKeyDown={onTabsKeyDown}
        >
          {TAB_KEYS.map((k) => {
            const { label, emoji } = TAB_META[k];
            const active = k === activeTab;
            return (
              <button
                key={k}
                ref={(el) => (pillRefs.current[k] = el || undefined)}
                role="tab"
                id={`tab-${k}`}
                aria-selected={active}
                aria-controls={`panel-${k}`}
                tabIndex={active ? 0 : -1}
                className={`tab-pill ${active ? "active" : ""}`}
                onClick={() => setTab(k)}
              >
                <span className="emoji" aria-hidden="true">
                  {emoji}
                </span>
                {label}
              </button>
            );
          })}
          <div className="grow" />

          {/* Fake toggle for now; hook to state later */}
          <div
            className="smart-toggle"
            role="switch"
            aria-checked="true"
            tabIndex={0}
          >
            <span>Smart Plan AI</span>
            <div className="fake-toggle">
              <span className="dot on" />
            </div>
          </div>
        </div>

        {/* Unified search — hide its own internal category tabs */}
        <div
          className="search-shell"
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          <UnifiedSearchBar activeTab={activeTab} showCategoryTabs={false} />
        </div>

        <div className="quick-themes" aria-label="Quick themes">
          {[
            "Beach Weekend",
            "Adventure Escape",
            "City Vibes",
            "Events Nearby",
            "Romantic Getaway",
          ].map((t) => (
            <button
              className="chip"
              key={t}
              onClick={() => console.log("Theme:", t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* ===== Results + Budget (demo) ===== */}
      <section className="results-wrap">
        <div className="results-card">
          <div className="results-head" aria-live="polite">
            Showing <b>3</b> {resultsLabel} options
          </div>

          <div className="results-placeholder" />

          <div className="result-footer">
            <div className="result-meta">
              <span className="muted">Lisbon • From $1,120</span>
              <span className="tag">City</span>
              <span className="tag">Europe</span>
              <span className="tag ok">Within budget</span>
              <span className="tag star" aria-label="Top pick">
                ★
              </span>
            </div>
            <Button type="primary" className="cta-add">
              + Add to plan
            </Button>
          </div>
        </div>

        <aside className="budget-card">
          <div className="budget-head">
            <div className="title">Budget</div>
            <button className="adjust" aria-label="Adjust budget">
              ⚙️ Adjust
            </button>
          </div>

          <div className="seg-toggle" role="tablist" aria-label="Budget mode">
            <button className="seg active" role="tab" aria-selected>
              Solo
            </button>
            <button className="seg" role="tab" aria-selected="false">
              Group
            </button>
          </div>

          <div className="under-budget" aria-live="polite">
            You’re still $1,350 under your budget ✓
          </div>
          <div className="bar">
            <span style={{ width: "22%" }} />
          </div>

          <div className="planned">
            <div className="planned-title">Planned items</div>
            <div className="planned-empty">Nothing added yet</div>
          </div>

          <button className="subscribe">🔔 Subscribe to price drops</button>
        </aside>
      </section>
    </PageLayout>
  );
}
