import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import "../styles/QuestFeed.css";

/* ------------ Animated Tab Switcher ------------ */
function TabSwitcher({ tabs, value, onChange }) {
  const wrapRef = useRef(null);
  const btnRefs = useRef([]);

  // stable array of button refs
  btnRefs.current = useMemo(
    () => tabs.map((_, i) => btnRefs.current[i] ?? React.createRef()),
    [tabs]
  );

  // calculate indicator position/size
  const recalc = useCallback(() => {
    const i = Math.max(
      0,
      tabs.findIndex((t) => t.key === value)
    );
    const btn = btnRefs.current[i]?.current;
    const wrap = wrapRef.current;
    if (!btn || !wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    wrap.style.setProperty(
      "--qf-ind-left",
      `${btnRect.left - wrapRect.left}px`
    );
    wrap.style.setProperty("--qf-ind-width", `${btnRect.width}px`);
  }, [tabs, value]);

  // mount/update/resize/font-load
  useLayoutEffect(() => {
    recalc();

    const hasRO = typeof window !== "undefined" && "ResizeObserver" in window;
    const ro = hasRO ? new ResizeObserver(recalc) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);

    const onResize = () => recalc();
    window.addEventListener("resize", onResize);

    if (document?.fonts?.ready) {
      document.fonts.ready.then(recalc).catch(() => {});
    }

    const raf = requestAnimationFrame(recalc);
    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [recalc]);

  return (
    <div
      ref={wrapRef}
      className="qf-switch"
      role="tablist"
      aria-label="Feed views"
      style={{ "--qf-ind-left": "6px", "--qf-ind-width": "0px" }}
    >
      <span
        className="qf-switch-indicator"
        style={{
          transform: `translateX(var(--qf-ind-left))`,
          width: "var(--qf-ind-width)",
        }}
        aria-hidden="true"
      />
      {tabs.map((t, i) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            ref={btnRefs.current[i]}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={`qf-tab ${active ? "is-active" : ""}`}
            onClick={() => onChange(t.key)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const dir = e.key === "ArrowRight" ? 1 : -1;
                const next =
                  (tabs.findIndex((x) => x.key === value) + dir + tabs.length) %
                  tabs.length;
                onChange(tabs[next].key);
              }
            }}
          >
            {t.icon && <span className="qf-tab-ico">{t.icon}</span>}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------- Page ---------------------- */
export default function QuestFeed() {
  const TABS = [
    { key: "forYou", label: "For You", icon: "✨" },
    { key: "trending", label: "Trending", icon: "🔥" },
    { key: "friends", label: "Friends Only", icon: "👥" },
  ];

  const [view, setView] = useState(
    () => localStorage.getItem("osq-feed-view") || "forYou"
  );
  useEffect(() => localStorage.setItem("osq-feed-view", view), [view]);

  return (
    <div className="qf-wrap">
      {/* Top bar */}
      <div className="qf-topbar">
        {/* Home navigates to landing page */}
        <Link to="/" className="home-btn" aria-label="Go to Home">
          <span className="home-ico">🏠</span>
          <span className="home-txt">Home</span>
        </Link>

        <TabSwitcher tabs={TABS} value={view} onChange={setView} />
      </div>

      {/* Header */}
      <header className="qf-header">
        <h1 className="qf-title">✨ Quest Feed</h1>
        <p className="qf-subtitle">
          Your window into what travelers are exploring today
        </p>
      </header>

      {/* Greeting */}
      <section className="greeting-banner" aria-label="Personal greeting">
        <h2 className="greeting-text">Good afternoon, David 🌆</h2>
      </section>

      {/* Grid */}
      <div className="qf-grid">
        <main className="qf-main">
          {view === "forYou" && (
            <>
              {/* Composer */}
              <div className="composer card">
                <input
                  className="composer-input"
                  placeholder="Where are you off to? ✈️"
                  aria-label="Create a post"
                />
                <div className="composer-actions">
                  <div className="composer-icons" aria-hidden="true">
                    <span>📷</span>
                    <span>🎥</span>
                    <span>📍</span>
                  </div>
                  <button className="cta-btn">Post</button>
                </div>
              </div>

              {/* Example feed item */}
              <article className="feed card">
                <div className="feed-head">
                  <div className="avatar">J</div>
                  <div className="meta">
                    <div className="name-row">
                      <span className="name">Jayden</span>
                      <span className="verified">✓</span>
                      <span className="handle">@jay</span>
                      <span className="dot">•</span>
                      <span className="date">Apr 23</span>
                    </div>
                    <div className="location">Tokyo, Japan</div>
                  </div>
                </div>

                <p className="feed-text">
                  Just landed in Tokyo 🇯🇵 — can’t wait to explore!
                </p>

                <div className="feed-tags">
                  <span className="tag">#Tokyo</span>
                  <span className="tag">#Japan</span>
                  <span className="tag">#AdventureXP</span>
                </div>

                <div className="feed-footer">
                  <button className="link">💬 Reply</button>
                  <button className="link">🔁 Re-share</button>
                  <button className="link">🔗 Share</button>
                  <div className="xp-pill">+78 XP</div>
                </div>
              </article>
            </>
          )}

          {view === "trending" && (
            <div className="card qf-placeholder">
              <h3>Trending Now</h3>
              <p>Hot routes, tags, and must-see trips will appear here.</p>
            </div>
          )}

          {view === "friends" && (
            <div className="card qf-placeholder">
              <h3>Friends Only</h3>
              <p>Posts from people you follow will show here.</p>
            </div>
          )}
        </main>

        <aside className="qf-side">
          <section className="panel card">
            <h3 className="panel-title">Trending 🔥</h3>
            <div className="chip-row">
              <span className="hashtag">#Japan</span>
              <span className="hashtag">#Kyoto</span>
              <span className="hashtag">#HiddenGem</span>
              <span className="hashtag">#Weekend</span>
              <span className="hashtag">#Sunsets</span>
              <span className="hashtag">#Foodie</span>
            </div>
          </section>

          <section className="panel card">
            <h3 className="panel-title">Today’s hotspots</h3>
            <ul className="hot-list">
              <li>
                <span>Kyoto</span>
                <span className="delta">+42%</span>
              </li>
              <li>
                <span>Santorini</span>
                <span className="delta">+31%</span>
              </li>
              <li>
                <span>Puerto Rico</span>
                <span className="delta">+24%</span>
              </li>
              <li>
                <span>Seoul</span>
                <span className="delta">+18%</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <button className="fab" aria-label="Create post">
        ＋
      </button>
    </div>
  );
}
