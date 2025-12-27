import React, { useMemo, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Input,
  Button,
  Space,
  Segmented,
  Empty,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FireOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import "../styles/skystream.css";

const { Content } = Layout;
const { Title, Text } = Typography;

/* ---------------------------
   Reusable SkyrioPill component
   --------------------------- */
function SkyrioPill({
  label,
  pulse = false,
  percent = null,
  onClick,
  title,
  className = "",
}) {
  const clickable = typeof onClick === "function";
  const pct =
    typeof percent === "number" && Number.isFinite(percent)
      ? Math.max(0, Math.min(100, percent))
      : null;

  return (
    <Tag
      title={title}
      className={[
        "sk-pill",
        clickable ? "sk-pill--clickable" : "",
        pulse ? "sk-pill--pulse" : "",
        pct !== null ? "sk-pill--hasPct" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={clickable ? onClick : undefined}
    >
      <span className="sk-pillLabel">{label}</span>

      {pct !== null && (
        <span className="sk-pillPctWrap" aria-hidden="true">
          <span className="sk-pillPctText">{pct}%</span>
          <span className="sk-pillPctBar">
            <span className="sk-pillPctFill" style={{ width: `${pct}%` }} />
          </span>
        </span>
      )}
    </Tag>
  );
}

const TAB_OPTIONS = [
  { key: "forYou", label: "For You" },
  { key: "following", label: "Following" },
  { key: "deals", label: "Deals" },
  { key: "news", label: "News" },
];

export default function SkyStreamPage() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [search, setSearch] = useState("");

  // Demo posts (replace with API later)
  const posts = useMemo(
    () => [
      {
        id: "1",
        tab: "forYou",
        author: "Skyrio",
        time: "just now",
        xp: 10,
        title: "Welcome to SkyStream ✈️",
        body: "Drop your next destination. Earn XP for posting, saving, and booking.",
        tags: ["#welcome", "#Japan", "#Kyoto"],
      },
      {
        id: "2",
        tab: "forYou",
        author: "Guest",
        time: "2m ago",
        xp: 5,
        title: "Planning something soon",
        body: "Looking at a weekend getaway — any city vibe recs?",
        tags: ["#mytrip", "#weekend"],
      },
      {
        id: "3",
        tab: "deals",
        author: "Skyrio",
        time: "10m ago",
        xp: 15,
        title: "Weekend Deal Drop",
        body: "Flash hotel deals are live for coastal cities.",
        tags: ["#deals", "#weekend"],
      },
    ],
    []
  );

  const trending = useMemo(
    () => ["#Japan", "#Kyoto", "#HiddenGem", "#Weekend", "#deals"],
    []
  );

  const hotspots = useMemo(
    () => [
      { label: "Kyoto", pct: 42 },
      { label: "Santorini", pct: 31 },
      { label: "Puerto Rico", pct: 28 },
      { label: "Seoul", pct: 18 },
    ],
    []
  );

  function applyPillFilter(rawLabel) {
    const clean = String(rawLabel || "")
      .trim()
      .replace(/^#/, "");

    if (!clean) return;

    const tag = `#${clean}`;
    setSearch(tag);

    // Smart tab switch (optional but feels great)
    if (clean.toLowerCase().includes("deal")) setActiveTab("deals");
    else setActiveTab("forYou");
  }

  function clearFilters() {
    setSearch("");
    setActiveTab("forYou");
  }

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const qClean = q.replace(/^#/, "");

    return posts
      .filter((p) => p.tab === activeTab)
      .filter((p) => {
        if (!qClean) return true;
        const text = `${p.title || ""} ${p.body || ""}`.toLowerCase();
        const tags = (p.tags || []).map((t) => String(t).toLowerCase());
        return (
          text.includes(qClean) ||
          tags.some((t) => t.replace(/^#/, "").includes(qClean))
        );
      });
  }, [posts, activeTab, search]);

  const activeTag = useMemo(
    () => search.trim().replace(/^#/, "").toLowerCase(),
    [search]
  );

  return (
    <Layout className="skystream">
      <Content className="skystream-content">
        {/* Hero */}
        <div className="skystream-hero">
          <div>
            <Title level={1} className="skystream-title">
              SkyStream
            </Title>
            <Text className="skystream-subtitle">
              Live travel moments across Skyrio
            </Text>
          </div>

          <Button
            className="skystream-postBtn"
            icon={<PlusOutlined />}
            onClick={() => {
              /* open post modal later */
            }}
          >
            Post
          </Button>
        </div>

        {/* Controls */}
        <div className="skystream-controls">
          <Input
            className="skystream-search"
            prefix={<SearchOutlined />}
            placeholder="Search SkyStream"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />

          <Segmented
            className="skystream-tabs"
            value={activeTab}
            onChange={setActiveTab}
            options={TAB_OPTIONS.map((t) => ({ label: t.label, value: t.key }))}
          />
        </div>

        {/* Optional “Search:” chip */}
        {search.trim() && (
          <div className="skystream-searchChipRow">
            <SkyrioPill
              label={`Search: "${search}"`}
              onClick={() => setSearch("")}
              title="Click to clear search"
            />
          </div>
        )}

        {/* Main grid */}
        <Row gutter={[16, 16]} className="skystream-grid">
          {/* Feed */}
          <Col xs={24} lg={16}>
            <Card className="sk-card" title="SkyStream">
              {filteredPosts.length === 0 ? (
                <Empty description="No posts match your filters yet." />
              ) : (
                <div className="sk-feed">
                  {filteredPosts.map((p) => (
                    <div key={p.id} className="sk-post">
                      <div className="sk-postMeta">
                        <Text className="sk-postAuthor">
                          {p.author} · <span className="muted">{p.time}</span>{" "}
                          <span className="muted">+{p.xp} XP</span>
                        </Text>
                      </div>

                      <Title level={4} className="sk-postTitle">
                        {p.title}
                      </Title>

                      <Text className="sk-postBody">{p.body}</Text>

                      <div className="sk-postTags">
                        {(p.tags || []).map((t) => (
                          <SkyrioPill
                            key={t}
                            label={t}
                            pulse={false}
                            className={
                              activeTag &&
                              t.replace(/^#/, "").toLowerCase() === activeTag
                                ? "sk-pill--active"
                                : ""
                            }
                            onClick={() => applyPillFilter(t)}
                            title="Click to filter"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Right rail */}
          <Col xs={24} lg={8}>
            <div className="sk-rail">
              <Card
                className="sk-card"
                title={
                  <span className="sk-cardTitle">
                    Trending <FireOutlined />
                  </span>
                }
                extra={
                  <Button type="link" onClick={() => setSearch("")}>
                    Clear
                  </Button>
                }
              >
                <div className="sk-pillGrid">
                  {trending.map((t, idx) => (
                    <SkyrioPill
                      key={t}
                      label={t}
                      pulse={idx === 0} // ✅ subtle pulse on top pill
                      className={
                        activeTag &&
                        t.replace(/^#/, "").toLowerCase() === activeTag
                          ? "sk-pill--active"
                          : ""
                      }
                      onClick={() => applyPillFilter(t)}
                      title="Click to filter the feed"
                    />
                  ))}
                </div>
              </Card>

              <Card className="sk-card" title="Today’s hotspots">
                <div className="sk-pillGrid">
                  {hotspots.map((h) => (
                    <SkyrioPill
                      key={h.label}
                      label={h.label}
                      percent={h.pct} // ✅ micro-bar + %
                      className={
                        activeTag && h.label.toLowerCase() === activeTag
                          ? "sk-pill--active"
                          : ""
                      }
                      onClick={() => applyPillFilter(h.label)}
                      title="Click to filter by destination"
                    />
                  ))}
                </div>
              </Card>

              <Card className="sk-card" title="Quick Actions">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    block
                    icon={<ReloadOutlined />}
                    onClick={() => setActiveTab("forYou")}
                  >
                    Reset to For You
                  </Button>

                  <Button block onClick={() => setSearch("")}>
                    Clear Search
                  </Button>

                  <Button
                    block
                    icon={<ThunderboltOutlined />}
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}