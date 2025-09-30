console.log("[COMP] QuestFeed v2025 flat rows LOADED");

import React, { useState } from "react";
import {
  Avatar,
  Typography,
  Button,
  Tag,
  Tooltip,
  Tabs,
  Affix,
  Input,
  Badge,
  Skeleton,
} from "antd";
import {
  MessageOutlined,
  HeartOutlined,
  SmileOutlined,
  PlusOutlined,
  SendOutlined,
  ThunderboltOutlined,
  StarOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// ✅ Emoji-mart v5
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import TrendingTopics from "./questfeed/TrendingTopics";
import TripCard from "../components/feed/TripCard"; // ⬅️ NEW

const { Paragraph } = Typography;

/* ---------- utils ---------- */
function compactNumber(n) {
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
}

/* ---------- Bottom bar (mobile) ---------- */
function BottomTabBar({ onCompose }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(2,6,23,0.9)] backdrop-blur border-t border-white/20 dark:border-white/10">
      <div className="h-14 grid grid-cols-5 items-center text-slate-700 dark:text-slate-300">
        <button className="h-full" aria-label="Home">
          <HomeOutlined className="block mx-auto text-[22px]" />
        </button>
        <button className="h-full" aria-label="Search">
          <SearchOutlined className="block mx-auto text-[22px]" />
        </button>
        <button className="h-full" onClick={onCompose} aria-label="Compose">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white mx-auto">
            <PlusOutlined />
          </span>
        </button>
        <button className="h-full" aria-label="Activity">
          <HeartOutlined className="block mx-auto text-[22px]" />
        </button>
        <button className="h-full" aria-label="Profile">
          <UserOutlined className="block mx-auto text-[22px]" />
        </button>
      </div>
    </nav>
  );
}

/* ---------- Composer ---------- */
function Composer({ onPost }) {
  const [value, setValue] = useState("");
  const pct = Math.min(100, Math.round((value.length / 280) * 100));
  const disabled = !value.trim();

  return (
    <div className="px-3 sm:px-4 py-3 sm:py-4">
      <div className="flex items-start gap-3">
        <Avatar src="/images/avatar-you.png" size={40} className="mt-1" />
        <div className="min-w-0 flex-1">
          <Input.TextArea
            id="composer-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 6 }}
            maxLength={280}
            placeholder="Where are you off to? ✍🏽"
            className="!bg-transparent !border !border-slate-200/70 dark:!border-white/10 !rounded-2xl !px-3 !py-2 !text-slate-800 dark:!text-slate-100"
            onPressEnter={(e) => {
              if ((e.ctrlKey || e.metaKey) && !disabled) {
                onPost(value);
                setValue("");
              }
            }}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Button size="small" icon={<SmileOutlined />}>
                Emoji
              </Button>
              <span>{pct}%</span>
              <span className="hidden sm:inline">
                Tip: ⌘/Ctrl + Enter to post
              </span>
            </div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              disabled={disabled}
              onClick={() => {
                onPost(value);
                setValue("");
              }}
              className="rounded-full"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 h-px bg-slate-200/70 dark:bg-white/10" />
    </div>
  );
}

/* ---------- Timeline row (flat, hairline divider) ---------- */
function ListRow({ post, onDMClick, onEmojiClick }) {
  return (
    <div className="group relative px-3 sm:px-4 py-3 sm:py-4">
      <div className="absolute bottom-0 left-14 right-0 h-px bg-slate-200/60 dark:bg-white/10" />
      <div className="flex items-start gap-3">
        <Avatar src={post.avatar} size={40} className="mt-1" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 leading-none">
            <span className="font-medium text-slate-900 dark:text-white">
              {post.username}
            </span>
            <span className="text-xs text-slate-500">• {post.destination}</span>
            <span className="hidden sm:inline text-xs text-emerald-600 dark:text-emerald-400">
              <Badge color="green" /> Verified
            </span>
          </div>

          <Paragraph className="mt-1.5 mb-0 text-[15px] text-slate-800 dark:text-slate-200">
            {post.content}
          </Paragraph>

          {/* ⬇️ Quote Post + Trip embed (optional) */}
          {(post.quote || post.trip) && (
            <div className="quote-post mt-3">
              {post.quote && (
                <>
                  <div className="quote-meta">
                    {post.quote.username && (
                      <span className="quote-username">
                        {post.quote.username}
                      </span>
                    )}
                    {post.quote.meta}
                  </div>
                  {post.quote.text && (
                    <div className="quote-text">{post.quote.text}</div>
                  )}
                </>
              )}

              {post.trip && (
                <TripCard
                  href={post.trip.href}
                  image={post.trip.image}
                  destination={post.trip.destination}
                  dates={post.trip.dates}
                  price={post.trip.price}
                  people={post.trip.people}
                  tags={post.trip.tags}
                />
              )}
            </div>
          )}

          {!!post.tags?.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag
                  key={tag}
                  className="rounded-full px-3 py-1 text-[11px] bg-slate-50 dark:bg-white/10 border-none"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-5 text-slate-500 dark:text-slate-400">
            <Button
              type="text"
              size="small"
              icon={<HeartOutlined />}
              className="!px-0 hover:!text-white hover:!bg-white/10 dark:hover:!text-white active:opacity-70"
            >
              {compactNumber(post.likes)}
            </Button>
            <Button
              type="text"
              size="small"
              icon={<MessageOutlined />}
              onClick={onDMClick}
              className="!px-0 hover:!text-white hover:!bg-white/10 dark:hover:!text-white active:opacity-70"
            >
              {compactNumber(post.comments)}
            </Button>
            <Button
              type="text"
              size="small"
              icon={<SmileOutlined />}
              onClick={onEmojiClick}
              className="!px-0 hover:!text-white hover:!bg-white/10 dark:hover:!text-white active:opacity-70"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function QuestFeed() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("forYou");
  const [loading] = useState(false);

  // ⬇️ UPDATED: first post includes quote + trip embed
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "Jayden",
      avatar: "/images/avatar1.png",
      destination: "Tokyo, Japan",
      content: "Just landed in Tokyo 🛫 Can't wait to explore!",
      likes: 5630,
      comments: 1520,
      tags: ["#Tokyo", "#Japan", "#AdventureXP"],
      quote: {
        username: "Zara",
        meta: "Santorini, Greece · Verified",
        text: "Sunsets in Santorini never get old 🌅",
      },
      trip: {
        href: "/trip/123",
        image: "/assets/trips/santorini.jpg",
        destination: "Santorini, Greece",
        dates: "Apr 10–14 · 4 nights",
        price: "$682",
        people: "2 travelers",
        tags: ["Nonstop", "4.7★", "Free breakfast"],
      },
    },
    {
      id: 2,
      username: "Zara",
      avatar: "/images/avatar2.png",
      destination: "Santorini, Greece",
      content: "Sunsets in Santorini never get old 🌅",
      likes: 76000,
      comments: 1800,
      tags: ["#Santorini", "#Sunsets", "#HiddenGem"],
    },
  ]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(null);

  const handleDMClick = () => navigate("/dm");

  function handlePost(text) {
    const optimistic = {
      id: Date.now(),
      username: "You",
      avatar: "/images/avatar-you.png",
      destination: "Posting…",
      content: text,
      likes: 0,
      comments: 0,
      tags: ["#New"],
      _optimistic: true,
    };
    setPosts((p) => [optimistic, ...p]);
  }

  return (
    <section className="min-h-[100dvh] bg-slate-50 dark:bg-[#0b1020] pb-24 quest-feed">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(2,6,23,0.9)] backdrop-blur border-b border-white/20 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between">
          <button
            className="p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Menu"
          >
            ☰
          </button>
          <div className="font-semibold">Quest Feed</div>
          <div className="flex items-center gap-2">
            <Tooltip title="Weekly XP Event">
              <Button
                size="small"
                icon={<ThunderboltOutlined />}
                className="rounded-full"
              >
                XP
              </Button>
            </Tooltip>
            <Tooltip title="Premium Perks">
              <Button
                size="small"
                icon={<StarOutlined />}
                className="rounded-full"
              >
                Pro
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-6xl px-2 sm:px-4">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "forYou", label: "For You" },
              { key: "following", label: "Following" },
              { key: "trending", label: "Trending" },
              { key: "news", label: "News" },
            ]}
            className="!mb-0 !px-0"
            moreIcon={null}
          />
          <div className="h-[2px] bg-indigo-500/80 rounded-full w-16" />
        </div>
      </header>

      {/* Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0 lg:gap-8">
        {/* Left column */}
        <div className="min-w-0">
          <Affix offsetTop={12}>
            <div>
              <Composer onPost={handlePost} />
            </div>
          </Affix>

          {/* top hairline for list */}
          <div className="border-t border-slate-200/60 dark:border-white/10" />

          {/* Loading skeletons */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-3 sm:px-4 py-3">
                <div className="flex gap-3">
                  <Skeleton.Avatar active size="large" />
                  <div className="flex-1">
                    <Skeleton.Input
                      active
                      size="small"
                      className="!w-1/3 !h-3 !rounded"
                    />
                    <Skeleton
                      active
                      paragraph={{ rows: 2 }}
                      title={false}
                      className="!mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}

          {/* Timeline rows */}
          {posts.map((post) => (
            <div key={post.id}>
              <ListRow
                post={post}
                onDMClick={handleDMClick}
                onEmojiClick={() =>
                  setShowEmojiPicker(
                    showEmojiPicker === post.id ? null : post.id
                  )
                }
              />
              {showEmojiPicker === post.id && (
                <div className="px-3 sm:px-4 -mt-2 mb-2">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => {
                      alert(`Selected: ${emoji.native}`); // replace with reaction API later
                      setShowEmojiPicker(null);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right column */}
        <aside className="hidden lg:block pt-4">
          <TrendingTopics onTagSelect={(tag) => console.log("Filter:", tag)} />
        </aside>
      </div>

      {/* Floating compose (desktop) */}
      <div className="hidden lg:block fixed bottom-6 right-6">
        <Tooltip title="New post">
          <Button
            type="primary"
            shape="round"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => document.getElementById("composer-input")?.focus()}
          />
        </Tooltip>
      </div>

      {/* Mobile bottom bar */}
      <BottomTabBar
        onCompose={() => document.getElementById("composer-input")?.focus()}
      />
    </section>
  );
}
