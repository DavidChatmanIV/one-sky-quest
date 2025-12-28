import React, { useMemo, useState,} from "react";
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
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FireOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import "../styles/skystream.css";
import { useSkystreamFeed } from "../hooks/useSkystreamFeed";

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

  // ✅ grab auth user id (until JWT middleware is final)
  const userId = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.id || u?._id || null;
    } catch {
      return null;
    }
  }, []);

  const {
    items: posts,
    loading,
    error,
    hasMore,
    loadMore,
    loadingMore,
  } = useSkystreamFeed({
    tab: activeTab,
    search,
    userId,
    pageSize: 20,
  });

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

    // Smart tab switch
    if (clean.toLowerCase().includes("deal")) setActiveTab("deals");
    else if (activeTab === "following") {
      // keep following if user is in following tab
      setActiveTab("following");
    } else setActiveTab("forYou");
  }

  function clearFilters() {
    setSearch("");
    setActiveTab("forYou");
  }

  const activeTag = useMemo(
    () => search.trim().replace(/^#/, "").toLowerCase(),
    [search]
  );

  async function handleFollow(targetUserId) {
    if (!userId) {
      message.info("Sign in to follow travelers.");
      return;
    }
    if (!targetUserId) return;

    try {
      const res = await fetch(`/api/follow/${targetUserId}`, {
        method: "POST",
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Follow failed");
      }
      message.success(data.followed ? "Followed" : "Already following");
    } catch (e) {
      message.error(e.message || "Could not follow");
    }
  }

  // helpful empty messages
  const emptyDescription =
    activeTab === "following"
      ? "Follow travelers to see their posts here."
      : "No posts match your filters yet.";

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
              {error ? (
                <div style={{ padding: 8 }}>
                  <Empty description={error} />
                </div>
              ) : loading ? (
                <div style={{ padding: 10 }}>
                  <Text className="muted">Loading…</Text>
                </div>
              ) : posts.length === 0 ? (
                <div>
                  <Empty description={emptyDescription} />
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 12,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button onClick={() => setActiveTab("forYou")}>
                      Go to For You
                    </Button>
                    <Button onClick={() => setSearch("")}>Clear Search</Button>
                    <Button
                      icon={<ThunderboltOutlined />}
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="sk-feed">
                  {posts.map((p) => {
                    const author = p.authorId || {};
                    const authorName =
                      author?.name || author?.username || "Traveler";
                    const authorUsername = author?.username
                      ? `@${author.username}`
                      : "";
                    const createdAt = p.createdAt
                      ? new Date(p.createdAt).toLocaleString()
                      : "";

                    return (
                      <div key={p._id || p.id} className="sk-post">
                        <div className="sk-postMeta">
                          <div className="sk-postMetaLeft">
                            <Text className="sk-postAuthor">
                              {authorName}{" "}
                              <span className="muted">
                                {authorUsername ? `· ${authorUsername}` : ""}
                                {createdAt ? ` · ${createdAt}` : ""}
                              </span>
                              {typeof p.xpAward === "number" &&
                                p.xpAward > 0 && (
                                  <span className="muted">
                                    {" "}
                                    · +{p.xpAward} XP
                                  </span>
                                )}
                            </Text>
                          </div>

                          <div className="sk-postMetaRight">
                            <Button
                              size="small"
                              className="sk-followBtn"
                              onClick={() => handleFollow(author?._id)}
                            >
                              Follow
                            </Button>
                          </div>
                        </div>

                        {p.title ? (
                          <Title level={4} className="sk-postTitle">
                            {p.title}
                          </Title>
                        ) : null}

                        {p.body ? (
                          <Text className="sk-postBody">{p.body}</Text>
                        ) : null}

                        <div className="sk-postTags">
                          {(p.tags || []).map((t) => {
                            const key = `${p._id || p.id}-${t}`;
                            const isActive =
                              activeTag &&
                              String(t).replace(/^#/, "").toLowerCase() ===
                                activeTag;

                            return (
                              <SkyrioPill
                                key={key}
                                label={t}
                                className={isActive ? "sk-pill--active" : ""}
                                onClick={() => applyPillFilter(t)}
                                title="Click to filter"
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div className="sk-loadMoreRow">
                    {hasMore ? (
                      <Button
                        block
                        className="sk-loadMoreBtn"
                        onClick={loadMore}
                        loading={loadingMore}
                      >
                        Load more
                      </Button>
                    ) : (
                      <Text className="muted">You’re all caught up.</Text>
                    )}
                  </div>
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
                      pulse={idx === 0} // subtle pulse for #1 trending
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
                      percent={h.pct}
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