// src/pages/SkyStreamPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Empty,
  Modal,
  Input,
  Button,
  Space,
  Tag,
  message,
} from "antd";
import {
  PlusOutlined,
  LikeOutlined,
  MessageOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import SkyStreamHeader from "../components/skystream/SkyStreamHeader";
import "../styles/skystream.css";

// If you already have this hook, keep your import path:
import { useAuth } from "../hooks/useAuth";

const { Content } = Layout;
const { Title, Text } = Typography;

const TAB_OPTIONS = [
  { key: "forYou", label: "For You" },
  { key: "following", label: "Following" },
  { key: "trending", label: "Trending" },
  { key: "news", label: "News" },
];

export default function SkyStreamPage() {
  const auth = useAuth();

  // ✅ Soft launch: XP starts at 0 unless backend provides it
  const [xpToday, setXpToday] = useState(0);

  const [activeTab, setActiveTab] = useState("forYou");
  const [search, setSearch] = useState("");

  const [composeOpen, setComposeOpen] = useState(false);
  const [composeText, setComposeText] = useState("");

  // ✅ Always show REAL username (no "David" hardcode)
  const displayName = useMemo(() => {
    const u = auth?.user;
    if (!u) return "Guest";
    return (
      u.username || u.name || (u.email ? u.email.split("@")[0] : "Explorer")
    );
  }, [auth?.user]);

  // ✅ If you later add /api/profile, this is safe:
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        // if you don't have this endpoint yet, it will fail and we keep 0
        const res = await fetch("/api/profile/me", { credentials: "include" });
        if (!res.ok) throw new Error("profile fetch failed");
        const data = await res.json();
        if (!ignore) setXpToday(Number(data?.xpToday ?? 0));
      } catch {
        if (!ignore) setXpToday(0);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // Soft-launch demo feed (safe and simple)
  const posts = useMemo(() => {
    return [
      {
        id: "p1",
        user: "Skyrio",
        tag: "#welcome",
        title: "Welcome to SkyStream ✈️",
        body: "Drop your next destination. Earn XP for posting, saving, and booking.",
        time: "just now",
        likes: 12,
        comments: 3,
        xp: 10,
      },
      {
        id: "p2",
        user: displayName,
        tag: "#mytrip",
        title: "Planning something soon",
        body: "Looking at a weekend getaway — any city vibe recs?",
        time: "2m ago",
        likes: 0,
        comments: 0,
        xp: 5,
      },
      {
        id: "p3",
        user: "Travel Desk",
        tag: "#deals",
        title: "Price drop alert idea",
        body: "Post-launch: price tracking + seasonal best-month hints will be 🔥",
        time: "15m ago",
        likes: 21,
        comments: 7,
        xp: 15,
      },
    ];
  }, [displayName]);

  // ✅ Single source of truth for search + tab filtering
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base =
      activeTab === "following"
        ? posts.filter((p) => p.user === displayName) // simple soft-launch behavior
        : activeTab === "trending"
        ? posts.filter((p) => (p.likes ?? 0) >= 10)
        : activeTab === "news"
        ? posts.filter((p) => p.tag === "#deals" || p.tag === "#news")
        : posts;

    if (!q) return base;

    return base.filter((p) => {
      const blob = `${p.title} ${p.body} ${p.user} ${p.tag}`.toLowerCase();
      return blob.includes(q);
    });
  }, [posts, activeTab, search, displayName]);

  const trendingTags = useMemo(() => {
    return [
      { tag: "#deals", icon: <FireOutlined /> },
      { tag: "#weekend", icon: <ThunderboltOutlined /> },
      { tag: "#food", icon: <FireOutlined /> },
      { tag: "#beach", icon: <FireOutlined /> },
      { tag: "#hiddenGems", icon: <ThunderboltOutlined /> },
    ];
  }, []);

  const openCompose = () => setComposeOpen(true);

  const submitPost = () => {
    if (!composeText.trim()) {
      message.warning("Write something quick first.");
      return;
    }
    // Soft launch: just confirm. Later wire to backend.
    message.success("Posted to SkyStream ✅");
    setComposeText("");
    setComposeOpen(false);
  };

  return (
    <Layout className="skystream-wrap">
      <Content className="skystream-content">
        <SkyStreamHeader
          brand="Skyrio"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabOptions={TAB_OPTIONS}
          search={search}
          onSearchChange={setSearch}
          xpToday={xpToday}
          onCompose={openCompose}
        />

        <Row gutter={[16, 16]} style={{ marginTop: 14 }}>
          {/* FEED */}
          <Col xs={24} lg={16}>
            <Card className="sk-card sk-feedCard" bordered={false}>
              <div className="sk-feedHeader">
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    SkyStream
                  </Title>
                  <Text className="sk-muted">
                    Your travel feed — simple, fast, premium.
                  </Text>
                </div>

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="btn-orange"
                  onClick={openCompose}
                >
                  Post
                </Button>
              </div>

              <div className="sk-feedList">
                {filtered.length === 0 ? (
                  <Empty
                    description={
                      <span className="sk-muted">
                        No posts match that search.
                      </span>
                    }
                  />
                ) : (
                  filtered.map((p) => (
                    <Card
                      key={p.id}
                      className="sk-post"
                      bordered={false}
                      hoverable
                    >
                      <div className="sk-postTop">
                        <div className="sk-postMeta">
                          <Text className="sk-postUser">{p.user}</Text>
                          <Text className="sk-dot">•</Text>
                          <Text className="sk-muted">{p.time}</Text>
                        </div>

                        <Tag className="sk-tag" bordered={false}>
                          {p.tag}
                        </Tag>
                      </div>

                      <Title level={5} className="sk-postTitle">
                        {p.title}
                      </Title>

                      <Text className="sk-postBody">{p.body}</Text>

                      <div className="sk-postActions">
                        <Button
                          type="text"
                          icon={<LikeOutlined />}
                          className="sk-actionBtn"
                        >
                          {p.likes}
                        </Button>

                        <Button
                          type="text"
                          icon={<MessageOutlined />}
                          className="sk-actionBtn"
                        >
                          {p.comments}
                        </Button>

                        <div className="sk-xpChip">
                          <ThunderboltOutlined /> <span>+{p.xp} XP</span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </Col>

          {/* RIGHT SIDE (PREMIUM, SIMPLE) */}
          <Col xs={24} lg={8}>
            <Card className="sk-card" bordered={false}>
              <Title level={5} style={{ marginTop: 0 }}>
                Trending
              </Title>

              <Space wrap>
                {trendingTags.map((t) => (
                  <Tag
                    key={t.tag}
                    className="sk-trendTag"
                    onClick={() => setSearch(t.tag)}
                  >
                    {t.icon} {t.tag}
                  </Tag>
                ))}
              </Space>

              <div className="sk-divider" />

              <Title level={5} style={{ marginTop: 0 }}>
                Quick Actions
              </Title>

              <Space direction="vertical" style={{ width: "100%" }} size={10}>
                <Button
                  className="sk-ghostBtn"
                  onClick={() => setActiveTab("forYou")}
                >
                  Reset to For You
                </Button>
                <Button className="sk-ghostBtn" onClick={() => setSearch("")}>
                  Clear Search
                </Button>
                <Button className="sk-ghostBtn" onClick={openCompose}>
                  Create a Post
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* COMPOSE MODAL */}
        <Modal
          title="Post to SkyStream"
          open={composeOpen}
          onCancel={() => setComposeOpen(false)}
          footer={
            <Space>
              <Button onClick={() => setComposeOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                className="btn-orange"
                onClick={submitPost}
              >
                Post
              </Button>
            </Space>
          }
        >
          <Text className="sk-muted">
            Keep it simple for soft launch. You can add images, tags, and
            threads post-launch.
          </Text>

          <Input.TextArea
            value={composeText}
            onChange={(e) => setComposeText(e.target.value)}
            placeholder="What’s your next move? ✈️"
            rows={5}
            style={{ marginTop: 10 }}
          />
        </Modal>
      </Content>
    </Layout>
  );
}
