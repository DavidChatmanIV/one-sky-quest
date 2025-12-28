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

export default function SkyStreamPage() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [search, setSearch] = useState("");

  /* ---------------------------
     ✅ Following / Followers counts
  --------------------------- */
  const [stats, setStats] = useState({
    followingCount: 0,
    followersCount: 0,
  });

  /* ---------------------------
     ✅ AUTH USER ID (FINAL FORM)
  --------------------------- */
  const userId = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      return u?.id || u?._id || null;
    } catch {
      return null;
    }
  }, []);

  /* ---------------------------
    Fetch passport stats
  --------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      if (!userId) {
        setStats({ followingCount: 0, followersCount: 0 });
        return;
      }

      try {
        const res = await fetch("/api/passport/stats", {
          headers: { "x-user-id": userId },
        });

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return;

        const data = await res.json();
        if (!cancelled && data?.ok) {
          setStats({
            followingCount:
              data?.user?.followingCount ?? data?.followingCount ?? 0,
            followersCount:
              data?.user?.followersCount ?? data?.followersCount ?? 0,
          });
        }
      } catch {
        // silent fail
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* ---------------------------
     Feed Hook
  --------------------------- */
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

  /* ---------------------------
     UI helpers
  --------------------------- */
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

  function applyPillFilter(label) {
    const clean = String(label || "").replace(/^#/, "");
    if (!clean) return;
    setSearch(`#${clean}`);
    setActiveTab(clean.toLowerCase().includes("deal") ? "deals" : "forYou");
  }

  function clearFilters() {
    setSearch("");
    setActiveTab("forYou");
  }

  /* ---------------------------
     Follow user
  --------------------------- */
  async function handleFollow(targetUserId) {
    if (!userId) {
      message.info("Sign in to follow travelers.");
      return;
    }

    try {
      const res = await fetch(`/api/follow/${targetUserId}`, {
        method: "POST",
        headers: { "x-user-id": userId },
      });

      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Follow failed");
      }

      message.success("Followed");

      // refresh stats instantly
      const s = await fetch("/api/passport/stats", {
        headers: { "x-user-id": userId },
      });
      const sd = await s.json();
      if (sd?.ok) {
        setStats({
          followingCount: sd?.user?.followingCount ?? 0,
          followersCount: sd?.user?.followersCount ?? 0,
        });
      }
    } catch (e) {
      message.error(e.message || "Could not follow");
    }
  }

  const emptyDescription =
    activeTab === "following"
      ? "Follow travelers to see their posts here."
      : "No posts match your filters yet.";

  /* ===========================
     RENDER
  =========================== */
  return (
    <Layout className="skystream">
      <Content className="skystream-content">
        {/* Hero */}
        <div className="skystream-hero">
          <div>
            <Title level={1}>SkyStream</Title>
            <Text className="skystream-subtitle">
              Live travel moments across Skyrio
            </Text>
          </div>

          <Button icon={<PlusOutlined />}>Post</Button>
        </div>

        {/* Controls */}
        <div className="skystream-controls">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search SkyStream"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />

          <Segmented
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
        </div>

        {/* Feed */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card>
              {error ? (
                <Empty description={error} />
              ) : loading ? (
                <Text className="muted">Loading…</Text>
              ) : posts.length === 0 ? (
                <Empty description={emptyDescription} />
              ) : (
                posts.map((p) => (
                  <div key={p._id} className="sk-post">
                    <Text strong>{p.authorId?.username || "Traveler"}</Text>
                    <p>{p.body}</p>

                    <Button
                      size="small"
                      onClick={() => handleFollow(p.authorId?._id)}
                    >
                      Follow
                    </Button>
                  </div>
                ))
              )}

              {hasMore && (
                <Button block onClick={loadMore} loading={loadingMore}>
                  Load more
                </Button>
              )}
            </Card>
          </Col>

          {/* Right rail */}
          <Col xs={24} lg={8}>
            <Card title="Trending">
              {trending.map((t, i) => (
                <SkyrioPill
                  key={t}
                  label={t}
                  pulse={i === 0}
                  onClick={() => applyPillFilter(t)}
                />
              ))}
            </Card>

            <Card title="Today’s hotspots">
              {hotspots.map((h) => (
                <SkyrioPill
                  key={h.label}
                  label={h.label}
                  percent={h.pct}
                  onClick={() => applyPillFilter(h.label)}
                />
              ))}
            </Card>

            <Card title="Quick Actions">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button icon={<ReloadOutlined />} onClick={clearFilters}>
                  Reset
                </Button>
                <Button icon={<ThunderboltOutlined />} onClick={clearFilters}>
                  Clear All
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}