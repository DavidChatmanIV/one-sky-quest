import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Avatar,
  Card,
  Input,
  Button,
  Typography,
  Tooltip,
  Space,
  Popover,
  Progress,
  message,
  Empty,
  Divider,
  Badge,
  Tabs,
  Tag,
  List,
  Affix,
} from "antd";
import {
  SmileOutlined,
  MessageOutlined,
  SendOutlined,
  HomeOutlined,
  UserOutlined,
  LikeOutlined,
  LikeFilled,
  FireOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "../styles/QuestFeed.css";

const { Title, Text, Paragraph } = Typography;

const MAX_LEN = 280;
const DRAFT_KEY = "osq_questfeed_draft";

// --- Sample data (swap with API later) ---
const sampleUsers = {
  David: { avatar: "/images/users/david.jpg", following: true },
  Jayden: { avatar: "/images/users/jayden.jpg", following: true },
  Zara: { avatar: "/images/users/zara.jpg", following: false },
  Amara: { avatar: "/images/users/amara.jpg", following: true },
};

const samplePosts = [
  {
    id: 4,
    user: "Amara",
    content: "First morning in Kyoto. Matcha + bamboo forest walk 🌿🍵",
    tags: ["Kyoto", "Japan", "Foodie"],
    reactions: 11,
    youReacted: false,
    comments: ["Magical!", "Try Nishiki Market."],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30m
  },
  {
    id: 3,
    user: "David",
    content: "Planning a YOLO weekend in Puerto Rico—drop must-do spots! 🌴",
    tags: ["PuertoRico", "Weekend"],
    reactions: 5,
    youReacted: false,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5h
  },
  {
    id: 2,
    user: "Zara",
    content: "Sunsets in Santorini never get old 🌅",
    tags: ["Santorini", "Greece", "Sunset"],
    reactions: 7,
    youReacted: false,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h
  },
  {
    id: 1,
    user: "Jayden",
    content: "Just landed in Tokyo ✈️ Can't wait to explore!",
    tags: ["Tokyo", "Japan", "Foodie"],
    reactions: 3,
    youReacted: true,
    comments: ["Enjoy it!", "Take pics for us! 📸"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8h
  },
];

const sampleNews = [
  {
    id: "n1",
    title: "EU rail pass discounts return for fall travel",
    source: "TravelWire",
    time: "2h",
  },
  {
    id: "n2",
    title: "Japan expands eGate for more passport holders",
    source: "Global Trips",
    time: "5h",
  },
  {
    id: "n3",
    title: "Hawaii adds new reef-safe sunscreen guidelines",
    source: "Pacific Daily",
    time: "7h",
  },
];

const popularLocations = [
  { id: "L1", name: "Tokyo", emoji: "🗼", tag: "Tokyo" },
  { id: "L2", name: "Bali", emoji: "🌺", tag: "Bali" },
  { id: "L3", name: "Santorini", emoji: "🏖️", tag: "Santorini" },
  { id: "L4", name: "Iceland", emoji: "❄️", tag: "Iceland" },
  { id: "L5", name: "Kyoto", emoji: "🎋", tag: "Kyoto" },
  { id: "L6", name: "Cancún", emoji: "🌊", tag: "Cancun" },
];

// --- Utils ---
const timeAgo = (iso) => {
  const diff = Math.max(1, Math.floor((Date.now() - new Date(iso)) / 1000));
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

// --- Small components ---
const InlineCommentInput = ({ onSubmit }) => {
  const [val, setVal] = useState("");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Write a comment…"
        onPressEnter={() => {
          if (val.trim()) {
            onSubmit(val);
            setVal("");
          }
        }}
        aria-label="Write a comment"
      />
      <Button
        type="primary"
        onClick={() => {
          if (val.trim()) {
            onSubmit(val);
            setVal("");
          }
        }}
      >
        Send
      </Button>
    </div>
  );
};

const PostCard = ({
  post,
  onToggleLike,
  onToggleComments,
  isCommentsOpen,
  onAddComment,
}) => {
  const userMeta = sampleUsers[post.user] || {};
  return (
    <Card className="shadow-soft rounded border" bodyStyle={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Avatar src={userMeta.avatar} size={40} alt={`${post.user} avatar`} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space size={8} align="center">
              <Text strong>{post.user}</Text>
              <Badge
                color="blue"
                text={
                  <span className="text-muted" style={{ fontSize: 12 }}>
                    • {timeAgo(post.createdAt)}
                  </span>
                }
              />
            </Space>
          </div>

          <Paragraph
            style={{ marginTop: 4, marginBottom: 8, whiteSpace: "pre-wrap" }}
          >
            {post.content}
          </Paragraph>

          {/* Tags */}
          <Space wrap style={{ marginBottom: 8 }}>
            {post.tags?.map((t) => (
              <Tag key={t} bordered>
                #{t}
              </Tag>
            ))}
          </Space>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space size="small" align="center">
              <Tooltip title={post.youReacted ? "Unlike" : "Like"}>
                <Button
                  size="small"
                  shape="round"
                  type={post.youReacted ? "primary" : "default"}
                  icon={post.youReacted ? <LikeFilled /> : <LikeOutlined />}
                  onClick={() => onToggleLike(post.id)}
                  aria-label="Like post"
                >
                  {post.reactions}
                </Button>
              </Tooltip>

              <Tooltip title="Comments">
                <Button
                  size="small"
                  shape="round"
                  icon={<MessageOutlined />}
                  onClick={() => onToggleComments(post.id)}
                  aria-expanded={isCommentsOpen}
                  aria-controls={`comments-${post.id}`}
                >
                  {post.comments.length}
                </Button>
              </Tooltip>
            </Space>

            <Text type="secondary">
              {post.comments.length}{" "}
              {post.comments.length === 1 ? "comment" : "comments"}
            </Text>
          </div>

          {/* Comments */}
          <div
            id={`comments-${post.id}`}
            className={`transition-all ${isCommentsOpen ? "mt-3" : ""}`}
            style={{
              maxHeight: isCommentsOpen ? 384 : 0,
              overflow: "hidden",
            }}
          >
            <Divider style={{ margin: "12px 0" }} />
            <Space direction="vertical" style={{ width: "100%" }}>
              {post.comments.map((c, idx) => (
                <Text key={idx} type="secondary" style={{ display: "block" }}>
                  💬 {c}
                </Text>
              ))}
              <InlineCommentInput
                onSubmit={(text) => onAddComment(post.id, text)}
              />
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
};

const QuestFeed = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [postContent, setPostContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCommentFor, setActiveCommentFor] = useState(null);
  const [activeTab, setActiveTab] = useState("forYou");
  const [activeTag, setActiveTag] = useState(null);
  const composerRef = useRef(null);

  // Draft autosave
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) setPostContent(draft);
  }, []);
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, postContent);
  }, [postContent]);

  // Computed feeds
  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  );

  const followingSet = useMemo(
    () =>
      new Set(
        Object.entries(sampleUsers)
          .filter(([, v]) => v.following)
          .map(([k]) => k)
      ),
    []
  );

  const forYouFeed = sortedPosts;
  const followingFeed = useMemo(
    () => sortedPosts.filter((p) => followingSet.has(p.user)),
    [sortedPosts, followingSet]
  );
  const trendingTags = useMemo(() => {
    const counts = {};
    posts.forEach((p) =>
      (p.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1))
    );
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const filteredByTag = useMemo(() => {
    if (!activeTag) return sortedPosts;
    return sortedPosts.filter((p) => p.tags?.includes(activeTag));
  }, [sortedPosts, activeTag]);

  // Actions
  const handlePost = () => {
    const text = postContent.trim();
    if (!text) return;
    const newEntry = {
      id: posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
      user: "David",
      content: text,
      tags: activeTag ? [activeTag] : [],
      reactions: 0,
      youReacted: false,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([newEntry, ...posts]);
    setPostContent("");
    setShowEmojiPicker(false);
    localStorage.removeItem(DRAFT_KEY);
    message.success("Posted to Quest Feed");
  };

  const toggleReaction = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              youReacted: !p.youReacted,
              reactions: p.youReacted ? p.reactions - 1 : p.reactions + 1,
            }
          : p
      )
    );
  };

  const addComment = (postId, text) => {
    const val = text.trim();
    if (!val) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, val] } : p
      )
    );
    setActiveCommentFor(null);
  };

  const remaining = MAX_LEN - postContent.length;
  const pct = Math.min(100, Math.floor((postContent.length / MAX_LEN) * 100));

  const Composer = (
    <Card
      ref={composerRef}
      className="shadow-soft rounded border"
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Avatar src={sampleUsers.David?.avatar} size={40} alt="Your avatar" />
        <div style={{ flex: 1 }}>
          <Input.TextArea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Where are you off to? ✍️"
            autoSize={{ minRows: 2, maxRows: 6 }}
            maxLength={MAX_LEN}
            onPressEnter={(e) => {
              if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                handlePost();
              }
            }}
            aria-label="Compose a post"
          />
          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Space size="middle" wrap>
              <Popover
                open={showEmojiPicker}
                onOpenChange={setShowEmojiPicker}
                trigger="click"
                placement="bottomLeft"
                content={
                  <div style={{ maxWidth: 280 }}>
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji) =>
                        setPostContent((prev) => prev + emoji.native)
                      }
                      theme="light"
                      emojiSize={20}
                      maxFrequentRows={2}
                      previewPosition="none"
                    />
                  </div>
                }
              >
                <Button icon={<SmileOutlined />} aria-label="Insert emoji">
                  Emoji
                </Button>
              </Popover>

              <Tooltip title={`${remaining} characters left`}>
                <Progress
                  type="circle"
                  percent={pct}
                  size={24}
                  strokeWidth={10}
                />
              </Tooltip>

              {activeTag && (
                <Tag
                  color="processing"
                  closable
                  onClose={() => setActiveTag(null)}
                  style={{ cursor: "pointer" }}
                >
                  Posting to #{activeTag}
                </Tag>
              )}
            </Space>

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handlePost}
              disabled={!postContent.trim()}
              className="shadow-soft"
            >
              Post
            </Button>
          </div>
          <div className="text-muted" style={{ marginTop: 4, fontSize: 12 }}>
            Tip: Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> to post
          </div>
        </div>
      </div>
    </Card>
  );

  // Feed content by tab
  const renderFeed = (list) =>
    list.length === 0 ? (
      <Empty
        description="No posts yet — be the first to share a moment!"
        className="rounded py-10 border"
      />
    ) : (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {list.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={toggleReaction}
            onToggleComments={(id) =>
              setActiveCommentFor(activeCommentFor === id ? null : id)
            }
            isCommentsOpen={activeCommentFor === post.id}
            onAddComment={addComment}
          />
        ))}
      </Space>
    );

  const renderNews = () => (
    <Card className="shadow-soft rounded border">
      <List
        itemLayout="horizontal"
        dataSource={sampleNews}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<GlobalOutlined />}
              title={<Text strong>{item.title}</Text>}
              description={
                <span className="text-muted">
                  {item.source} • {item.time} ago
                </span>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );

  const renderPopular = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
      }}
    >
      {popularLocations.map((loc) => (
        <Card
          key={loc.id}
          hoverable
          className="shadow-soft rounded border"
          onClick={() => {
            setActiveTag(loc.tag);
            setActiveTab("trending");
            message.info(`Filtering by #${loc.tag}`);
          }}
          bodyStyle={{ textAlign: "center" }}
        >
          <div style={{ fontSize: 20 }}>{loc.emoji}</div>
          <div style={{ marginTop: 4, fontWeight: 500 }}>{loc.name}</div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            #{loc.tag}
          </div>
        </Card>
      ))}
    </div>
  );

  // Right Rail (collapsible on mobile)
  const RightRail = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card
        className="shadow-soft rounded border"
        title={
          <span>
            <FireOutlined /> Trending
          </span>
        }
      >
        <Space wrap>
          {trendingTags.length ? (
            trendingTags.map(({ tag, count }) => (
              <Tag
                key={tag}
                color={activeTag === tag ? "processing" : "default"}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                style={{ cursor: "pointer" }}
              >
                #{tag}{" "}
                <span className="text-muted" style={{ fontSize: 12 }}>
                  · {count}
                </span>
              </Tag>
            ))
          ) : (
            <Text type="secondary">No trends yet</Text>
          )}
        </Space>
      </Card>

      <Card
        className="shadow-soft rounded border"
        title={
          <span>
            <CompassOutlined /> Popular
          </span>
        }
      >
        {renderPopular()}
      </Card>

      <Card
        className="shadow-soft rounded border"
        title={
          <span>
            <ThunderboltOutlined /> Quick Tips
          </span>
        }
      >
        <ul
          className="text-muted"
          style={{ marginLeft: 16, fontSize: 14, listStyle: "disc" }}
        >
          <li>Use trending tags for XP boosts.</li>
          <li>Tap a location card to filter your feed.</li>
          <li>Ctrl/⌘ + Enter to post faster.</li>
        </ul>
      </Card>
    </Space>
  );

  const forYouList = useMemo(
    () => (activeTag ? filteredByTag : forYouFeed),
    [activeTag, filteredByTag, forYouFeed]
  );
  const followingList = useMemo(
    () =>
      activeTag
        ? filteredByTag.filter((p) => sampleUsers[p.user]?.following)
        : followingFeed,
    [activeTag, filteredByTag, followingFeed]
  );

  return (
    <div
      className="section osq-hero"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/questfeed-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 16,
      }}
    >
      <div
        className="shadow-soft rounded border"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          // Use surface colors; if you like slight translucency, uncomment the next line:
          // background: "color-mix(in srgb, var(--surface) 88%, transparent)",
          background: "var(--surface)",
          padding: 24,
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Top nav (uses link colors from theme) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Link
            to="/"
            className="font-medium"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <HomeOutlined /> Home
          </Link>
          <Link
            to="/profile"
            className="font-medium"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <UserOutlined /> Profile
          </Link>
        </div>

        <Title level={2} style={{ textAlign: "center" }}>
          🌐 Quest Feed
        </Title>
        <Paragraph
          className="text-muted"
          style={{ textAlign: "center", marginBottom: 16 }}
        >
          For You, Following, trends, news, and places—organized and fast. 🧭
        </Paragraph>

        {/* Layout: Left(feed) / Right(rail) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
          }}
        >
          <div>
            <Affix offsetTop={12}>
              <div>{Composer}</div>
            </Affix>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              animated
              items={[
                {
                  key: "forYou",
                  label: "For You",
                  children: renderFeed(forYouList),
                },
                {
                  key: "following",
                  label: "Following",
                  children: renderFeed(followingList),
                },
                {
                  key: "trending",
                  label: "Trending",
                  children: renderFeed(filteredByTag),
                },
                { key: "news", label: "News", children: renderNews() },
                { key: "popular", label: "Popular", children: renderPopular() },
              ]}
            />
          </div>

          {/* Right rail (desktop) */}
          <div className="lg:block" style={{ display: "none" }}>
            {RightRail}
          </div>
        </div>

        {/* On mobile, show right rail below */}
        <div className="lg:hidden" style={{ marginTop: 24 }}>
          {RightRail}
        </div>
      </div>
    </div>
  );
};

export default QuestFeed;
