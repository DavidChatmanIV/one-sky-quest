import React, { useMemo, useState, useEffect } from "react";
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
  Badge,
  message,
  Dropdown,
  Menu,
  Avatar,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  TagsOutlined,
  SaveOutlined,
  StarOutlined,
  MoreOutlined,
} from "@ant-design/icons";

import "../styles/skystream.css";
import { useSkystreamFeed } from "../hooks/useSkystreamFeed";
import { safeJson } from "../lib/safeJson";

const { Content } = Layout;
const { Title, Text } = Typography;

/* ---------------------------
   Reusable SkyrioPill
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
        clickable && "sk-pill--clickable",
        pulse && "sk-pill--pulse",
        pct !== null && "sk-pill--hasPct",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={clickable ? onClick : undefined}
    >
      <span className="sk-pillLabel">{label}</span>

      {pct !== null && (
        <span className="sk-pillPctWrap">
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

const FEED_PRESETS = [
  { key: "passport", label: "For You (Passport)" },
  { key: "near", label: "Near Me" },
  { key: "deals", label: "Deals Drop" },
  { key: "gems", label: "Hidden Gems" },
];

function PostCard({ p, onFollow }) {
  const author = p.authorId?.username || p.authorName || "Traveler";
  const handle = p.authorId?.handle || p.handle || "@traveler";
  const verified = !!p.verified;

  return (
    <div className="sk-postCard">
      <div className="sk-postTop">
        <div className="sk-postIdentity">
          <Avatar size={42} src={p.avatarUrl} />
          <div className="sk-postWho">
            <div className="sk-postNameRow">
              <span className="sk-postName">{author}</span>
              <span className="sk-postHandle">{handle}</span>
              {verified && <span className="sk-postVerified">verified</span>}
            </div>
            <div className="sk-postMetaLine">
              {p.metaLine || "Skyrio Traveler"} {p.city ? `• ${p.city}` : ""}
            </div>
          </div>
        </div>

        <Button
          className="sk-ghostIconBtn"
          icon={<MoreOutlined />}
          type="text"
        />
      </div>

      <div className="sk-postText">
        <Text className="sk-postBody">{p.body}</Text>
        {!!p.tags?.length && (
          <div className="sk-postTagsRow">
            {p.tags.map((t) => (
              <span key={t} className="sk-postTagLink">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {!!p.imageUrl && (
        <div className="sk-postMedia">
          <img src={p.imageUrl} alt="" />
        </div>
      )}

      {!!p.tripCard && (
        <div className="sk-tripMini">
          <div className="sk-tripMiniLeft">
            {p.tripCard.thumb ? (
              <img className="sk-tripMiniThumb" src={p.tripCard.thumb} alt="" />
            ) : (
              <div className="sk-tripMiniThumb sk-tripMiniThumb--empty" />
            )}
            <div className="sk-tripMiniText">
              <div className="sk-tripMiniTitle">{p.tripCard.title}</div>
              <div className="sk-tripMiniSub">{p.tripCard.sub}</div>
            </div>
          </div>

          <Button className="sk-tripMiniBtn" size="small">
            Save to trip
          </Button>
        </div>
      )}

      <div className="sk-postActionsRow">
        <span className="sk-postAction">💬 {p.replyCount ?? "—"}</span>
        <span className="sk-postAction">🔁 {p.repostCount ?? "—"}</span>
        <span className="sk-postAction">❤️ {p.likeCount ?? "—"}</span>
        <span className="sk-postAction">🔖 Save</span>

        <Button className="sk-followBtn" size="small" onClick={onFollow}>
          Follow
        </Button>
      </div>

      <Divider className="sk-divider" />
    </div>
  );
}

export default function SkyStreamPage() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [search, setSearch] = useState("");
  const [feedPreset, setFeedPreset] = useState("passport");

  /* ✅ counts */
  const [stats, setStats] = useState({
    followingCount: 0,
    followersCount: 0,
  });

  /* ✅ auth user id */
  const userId = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.id || u?._id || null;
    } catch {
      return null;
    }
  }, []);

  /* fetch passport stats (Option B + C) */
  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      if (!userId) {
        setStats({ followingCount: 0, followersCount: 0 });
        return;
      }

      const data = await safeJson("/api/passport/stats", {
        headers: { "x-user-id": userId },
      });

      // Option B: page-level context log (dev only)
      if (!data) {
        if (import.meta.env.DEV) {
          console.warn(
            "[SkyStream] passport stats unavailable (demo/guest/API)"
          );
        }
        return;
      }

      if (!cancelled && data?.ok) {
        setStats({
          followingCount:
            data?.user?.followingCount ?? data?.followingCount ?? 0,
          followersCount:
            data?.user?.followersCount ?? data?.followersCount ?? 0,
        });
      } else if (import.meta.env.DEV && data?.ok === false) {
        console.warn("[SkyStream] passport stats ok=false:", data);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* feed hook */
  const {
    items: apiPosts,
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

  /* Right rail data */
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

  const dealDrops = useMemo(
    () => [
      {
        title: "Tokyo, Japan",
        price: "$640 RT",
        note: "Selected dates • 30% Off",
      },
      {
        title: "Santorini, GR",
        price: "$899 RT",
        note: "Summer trips • 23% Off",
      },
    ],
    []
  );

  function applyPillFilter(label) {
    const clean = String(label || "").replace(/^#/, "");
    if (!clean) return;
    setSearch(`#${clean}`);
    setActiveTab(clean.toLowerCase().includes("deal") ? "deals" : "forYou");
  }

  function clearFilters() {
    setSearch("");
    setActiveTab("forYou");
    setFeedPreset("passport");
  }

  async function handleFollow(targetUserId) {
    if (!userId) {
      message.info("Sign in to follow travelers.");
      return;
    }
    if (!targetUserId) return;

    try {
      const data = await safeJson(`/api/follow/${targetUserId}`, {
        method: "POST",
        headers: { "x-user-id": userId },
      });

      if (!data || data?.ok === false) {
        throw new Error(data?.error || "Follow failed");
      }

      message.success("Followed");

      // Optional: refresh stats right after follow
      const sd = await safeJson("/api/passport/stats", {
        headers: { "x-user-id": userId },
      });

      if (sd?.ok) {
        setStats({
          followingCount: sd?.user?.followingCount ?? sd?.followingCount ?? 0,
          followersCount: sd?.user?.followersCount ?? sd?.followersCount ?? 0,
        });
      }
    } catch (e) {
      message.error(e?.message || "Could not follow");
    }
  }

  /* ✅ MOCK FALLBACK so design shows even if API is down */
  const MOCK_POSTS = useMemo(
    () => [
      {
        _id: "m1",
        authorName: "Peter Chen",
        handle: "@petertravels",
        verified: true,
        metaLine: "Skyrio Traveler",
        body: "Hidden gem! 🌸 Discover this secret trail in Kyoto away from the crowd! Peaceful and beautiful.",
        tags: ["#Kyoto", "#HiddenGem"],
        imageUrl:
          "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1600&q=80",
        tripCard: {
          title: "Kyoto • Hidden Gem",
          sub: "3 days • September 2024",
          thumb:
            "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=240&q=80",
        },
        replyCount: "15.2",
        repostCount: "3.5K",
        likeCount: "2.3K",
      },
      {
        _id: "m2",
        authorName: "Caitlyn James",
        handle: "@cjames",
        verified: true,
        metaLine: "verified Traveler",
        body: "Like this travel short asap — Santorini at golden hour is unreal. #Weekend",
        tags: ["#Weekend"],
        imageUrl:
          "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&w=1600&q=80",
        replyCount: "4.1",
        repostCount: "1.1K",
        likeCount: "5.2K",
      },
    ],
    []
  );

  const posts = error ? MOCK_POSTS : apiPosts;

  const emptyDescription =
    activeTab === "following"
      ? "Follow travelers to see their posts here."
      : "No posts match your filters yet.";

  const feedMenu = (
    <Menu
      onClick={({ key }) => setFeedPreset(key)}
      items={FEED_PRESETS.map((f) => ({ key: f.key, label: f.label }))}
    />
  );

  const currentFeedLabel =
    FEED_PRESETS.find((f) => f.key === feedPreset)?.label ||
    "For You (Passport)";

  return (
    <Layout className="skystream">
      <Content className="skystream-content">
        {/* Desktop title (keep minimal like mock) */}
        <div className="skystream-hero sk-only-desktop">
          <div>
            <Title level={1} className="skystream-title">
              SkyStream
            </Title>
            <Text className="skystream-subtitle">Live travel moments</Text>
          </div>
        </div>

        <Row gutter={[14, 14]}>
          {/* LEFT RAIL (desktop only) */}
          <Col xs={24} lg={6} className="sk-only-desktop">
            <Card className="sk-card sk-leftRail" bordered={false}>
              <div className="sk-leftNav">
                <div className="sk-leftItem">🏠 Home</div>
                <div className="sk-leftItem">
                  🔥 Explore <span className="sk-leftBadge">5</span>
                </div>
                <div className="sk-leftItem">🔔 Alerts</div>
                <div className="sk-leftItem">💬 DMs</div>
                <div className="sk-leftItem sk-leftItemActive">🧠 SkyFeeds</div>
                <div className="sk-leftItem">👥 Circles</div>
                <div className="sk-leftItem">💾 Saved</div>
                <div className="sk-leftItem">🛂 Passport</div>
              </div>

              <div className="sk-leftSectionTitle">SkyFeeds</div>
              <div className="sk-leftFeeds">
                {FEED_PRESETS.map((f) => (
                  <div
                    key={f.key}
                    className={[
                      "sk-leftFeed",
                      f.key === feedPreset && "sk-leftFeedActive",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setFeedPreset(f.key)}
                  >
                    {f.label}
                  </div>
                ))}
              </div>

              <Button className="sk-leftCTA" block>
                + Create Feed
              </Button>
            </Card>
          </Col>

          {/* CENTER */}
          <Col xs={24} lg={12}>
            {/* Top controls (match mock: search + feed dropdown on same row) */}
            <div className="sk-centerTop">
              <Input
                className="skystream-search"
                prefix={<SearchOutlined />}
                placeholder="Search SkyStream"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />

              <div className="sk-centerTopRight">
                <Dropdown overlay={feedMenu} trigger={["click"]}>
                  <Button className="sk-feedSelect">
                    {currentFeedLabel} <span className="sk-caret">▾</span>
                  </Button>
                </Dropdown>

                <Button className="sk-starBtn" icon={<StarOutlined />} />
              </div>
            </div>

            {/* Composer card */}
            <Card className="sk-card sk-composer" bordered={false}>
              <div className="sk-composerRow">
                <Input
                  className="sk-composerInput"
                  prefix={<SearchOutlined />}
                  placeholder="Share your latest travel moment..."
                />
                <Button className="skystream-postBtn">Post</Button>
              </div>

              <div className="sk-composerChips">
                <Button className="sk-chip" icon={<PictureOutlined />}>
                  Photo
                </Button>
                <Button className="sk-chip" icon={<VideoCameraOutlined />}>
                  Video
                </Button>
                <Button className="sk-chip" icon={<EnvironmentOutlined />}>
                  Location
                </Button>
                <Button className="sk-chip" icon={<TagsOutlined />}>
                  Travel Tags
                </Button>
                <Button className="sk-chip" icon={<SaveOutlined />}>
                  Save
                </Button>
              </div>
            </Card>

            {/* Tabs row */}
            <div className="sk-tabsRow">
              <Segmented
                className="skystream-tabs"
                value={activeTab}
                onChange={setActiveTab}
                options={TAB_OPTIONS.map((t) =>
                  t.key === "following"
                    ? {
                        value: t.key,
                        label: (
                          <span>
                            Following
                            <Badge
                              count={stats.followingCount}
                              showZero
                              size="small"
                              offset={[6, -2]}
                            />
                          </span>
                        ),
                      }
                    : { value: t.key, label: t.label }
                )}
              />

              <Button
                className="sk-resetBtn"
                icon={<ReloadOutlined />}
                onClick={clearFilters}
              >
                Reset Filters
              </Button>
            </div>

            {/* Feed */}
            <Card className="sk-card sk-feedCard" bordered={false}>
              {loading && !error ? (
                <Text className="muted">Loading…</Text>
              ) : posts.length === 0 ? (
                <Empty description={emptyDescription} />
              ) : (
                <div className="sk-feed">
                  {error && (
                    <div className="sk-softError">
                      Feed is in demo mode (API not available). Showing sample
                      posts.
                    </div>
                  )}

                  {posts.map((p) => (
                    <PostCard
                      key={p._id}
                      p={p}
                      onFollow={() => handleFollow(p.authorId?._id)}
                    />
                  ))}
                </div>
              )}

              {hasMore && !error && (
                <div className="sk-loadMoreRow">
                  <Button
                    className="sk-loadMoreBtn"
                    block
                    onClick={loadMore}
                    loading={loadingMore}
                  >
                    Load more
                  </Button>
                </div>
              )}
            </Card>
          </Col>

          {/* RIGHT RAIL */}
          <Col xs={24} lg={6}>
            <div className="sk-rail">
              <Card className="sk-card" title="Trending" bordered={false}>
                <div className="sk-pillGrid">
                  {trending.map((t, i) => (
                    <SkyrioPill
                      key={t}
                      label={t}
                      pulse={i === 0}
                      onClick={() => applyPillFilter(t)}
                    />
                  ))}
                </div>
              </Card>

              <Card
                className="sk-card"
                title="Today’s hotspots"
                bordered={false}
              >
                <div className="sk-pillGrid">
                  {hotspots.map((h) => (
                    <SkyrioPill
                      key={h.label}
                      label={h.label}
                      percent={h.pct}
                      onClick={() => applyPillFilter(h.label)}
                    />
                  ))}
                </div>
              </Card>

              <Card className="sk-card" title="Deal Drops" bordered={false}>
                <Space direction="vertical" style={{ width: "100%" }} size={10}>
                  {dealDrops.map((d) => (
                    <div key={d.title} className="sk-dealMini">
                      <div className="sk-dealMiniTitle">{d.title}</div>
                      <div className="sk-dealMiniPrice">{d.price}</div>
                      <div className="sk-dealMiniNote">{d.note}</div>
                    </div>
                  ))}
                </Space>
              </Card>

              <Card className="sk-card" title="Quick Actions" bordered={false}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button icon={<ReloadOutlined />} onClick={clearFilters}>
                    Reset
                  </Button>
                  <Button icon={<ThunderboltOutlined />} onClick={clearFilters}>
                    Clear All
                  </Button>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Mobile FAB */}
        <Button
          className="sk-fabPost sk-only-mobile"
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
        />
      </Content>
    </Layout>
  );
}
