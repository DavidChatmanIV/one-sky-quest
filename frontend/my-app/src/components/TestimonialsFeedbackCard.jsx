import React, { useMemo, useState } from "react";
import {
  Card,
  Tabs,
  Rate,
  Avatar,
  Tag,
  Button,
  Space,
  Typography,
  Divider,
  Input,
  message,
} from "antd";
import {
  MessageOutlined,
  StarOutlined,
  BulbOutlined,
  CommentOutlined,
} from "@ant-design/icons";

import "../styles/TestimonialsFeedbackCard.css";

const { Text, Title } = Typography;

// --- Demo data ---
const SAMPLE_TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "Booked a last-minute Bali stay on OSQ — smooth filters, great price, and the XP boost is a nice touch.",
    name: "Leah M.",
    rating: 5,
    trip: "Bali",
    avatar: "L",
    tag: "Great value",
  },
  {
    id: "t2",
    quote:
      "Paris itinerary from the AI builder was on point. I tweaked a few picks and saved under budget.",
    name: "Marcus D.",
    rating: 5,
    trip: "Paris",
    avatar: "M",
    tag: "AI Builder",
  },
  {
    id: "t3",
    quote:
      "Team Travel map helped us choose a hotel near the tournament fields — parents were happy, kids happier.",
    name: "Cara R.",
    rating: 4,
    trip: "Orlando",
    avatar: "C",
    tag: "Team Travel",
  },
];

const SAMPLE_FEEDBACK = [
  { id: "f1", text: "More eco stays please 🌱", meta: "Feature request" },
  { id: "f2", text: "Sorting by guest rating is clutch", meta: "UX note" },
  { id: "f3", text: "Love the warm theme — easy on the eyes", meta: "Design" },
  { id: "f4", text: "Add child-friendly filters to Cruises?", meta: "Idea" },
  {
    id: "f5",
    text: "XP popups feel rewarding, not spammy",
    meta: "Gamification",
  },
];

export default function TestimonialsFeedbackCard({
  title = "Testimonials & Feedback",
  cardHeight = 360,
  autoplayMs = 6500,
  onLeaveFeedback,
}) {
  const [activeKey, setActiveKey] = useState("testimonials");
  const [expanded, setExpanded] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState(SAMPLE_FEEDBACK);

  const handleAddFeedback = (text) => {
    const value = text.trim();
    if (!value) return;
    setFeedbackItems((prev) => [
      { id: `u${Date.now()}`, text: value, meta: "New" },
      ...prev,
    ]);
    message.success("+20 XP — thanks for the quick feedback!");
  };

  const tabs = useMemo(
    () => [
      {
        key: "testimonials",
        label: (
          <Space size={6}>
            <StarOutlined />
            <span>Traveler Testimonials</span>
          </Space>
        ),
        children: (
          <RotatingTestimonials
            items={SAMPLE_TESTIMONIALS}
            height={cardHeight}
            autoplayMs={autoplayMs}
          />
        ),
      },
      {
        key: "feedback",
        label: (
          <Space size={6}>
            <MessageOutlined />
            <span>Quick Feedback</span>
          </Space>
        ),
        children: (
          <QuickFeedbackList
            items={feedbackItems}
            height={cardHeight}
            expanded={expanded}
            onAdd={handleAddFeedback}
          />
        ),
      },
    ],
    [cardHeight, autoplayMs, expanded, feedbackItems]
  );

  return (
    <Card
      className="osq-card testimonials-card"
      bordered={false}
      bodyStyle={{ padding: 14 }}
      style={{
        height: cardHeight,
        overflow: "hidden", // <— ensure nothing bleeds below the card
      }}
    >
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Space align="center" className="justify-between w-full">
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
          <Tag bordered={false} className="osq-soft-tag">
            Social proof
          </Tag>
        </Space>

        <Tabs
          activeKey={activeKey}
          onChange={(k) => {
            setActiveKey(k);
            if (k !== "feedback") setExpanded(false);
          }}
          items={tabs}
          className="osq-tabs"
          animated={{ inkBar: true, tabPane: true }}
          tabBarGutter={8}
          size="small"
        />

        <Divider className="osq-divider" />

        <Space className="justify-between w-full">
          <Space size={6}>
            <BulbOutlined className="osq-dim-icon" />
            <Text type="secondary" className="osq-helper">
              Share your experience to help others plan smarter.
            </Text>
          </Space>

          <Space size={6}>
            {activeKey === "feedback" && (
              <Button
                size="small"
                type="text"
                className="osq-ghost-btn"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Show less" : "Show more"}
              </Button>
            )}
            <Button
              size="small"
              type="primary"
              shape="round"
              className="osq-cta"
              onClick={() =>
                onLeaveFeedback ? onLeaveFeedback() : alert("+20 XP earned!")
              }
            >
              Leave feedback • +20 XP
            </Button>
          </Space>
        </Space>
      </Space>
    </Card>
  );
}

/* ---------------------------
 * Rotating Testimonials
 * --------------------------- */
function RotatingTestimonials({ items, height, autoplayMs }) {
  // Reserve a bit more room for header/tabs/footer so nothing overflows.
  const RESERVED = 176; // was 136 — increased to prevent overlap
  const contentH = Math.max(150, height - RESERVED);

  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      autoplayMs
    );
    return () => clearInterval(id);
  }, [items.length, autoplayMs]);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const item = items[index];

  return (
    <div className="osq-panel" style={{ height: contentH }}>
      <FadeSwap key={item.id}>
        <div className="osq-panel-inner">
          <CommentOutlined className="osq-quote-icon" />
          <Text className="osq-quote">“{item.quote}”</Text>

          <Space className="osq-meta" wrap>
            <Avatar size={28}>{item.avatar}</Avatar>
            <Text strong>{item.name}</Text>
            <Rate disabled defaultValue={item.rating} className="osq-rate" />
            <Tag bordered={false} className="osq-soft-tag">
              {item.tag}
            </Tag>
            <Tag bordered={false} className="osq-soft-tag">
              {item.trip}
            </Tag>
          </Space>
        </div>
      </FadeSwap>

      <div className="osq-controls">
        <Button size="small" className="osq-ghost-btn" onClick={prev}>
          Prev
        </Button>
        <span className="osq-progress">
          {index + 1} / {items.length}
        </span>
        <Button size="small" className="osq-ghost-btn" onClick={next}>
          Next
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------
 * Quick Feedback List
 * --------------------------- */
function QuickFeedbackList({ items, height, expanded, onAdd }) {
  const RESERVED = 176; // match testimonials panel
  const contentH = Math.max(150, height - RESERVED);
  const [text, setText] = useState("");

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    onAdd?.(v);
    setText("");
  };

  return (
    <div
      className={`osq-panel ${expanded ? "" : "osq-mask-fade"}`}
      style={{
        height: contentH,
        overflowY: expanded ? "auto" : "hidden", // scroll within card when expanded
      }}
    >
      <div className="osq-panel-inner osq-feedback-list">
        {/* Input row */}
        <div className="osq-feedback-input">
          <Input.TextArea
            className="osq-input"
            placeholder="Share a quick note (max 140 chars)…"
            maxLength={140}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 3 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <Button
            size="small"
            type="primary"
            disabled={!text.trim()}
            onClick={submit}
          >
            Post
          </Button>
        </div>

        {/* Items */}
        {items.map((f, i) => (
          <div
            key={f.id}
            className={`osq-feedback-row${
              i === items.length - 1 ? " last" : ""
            }`}
          >
            <Tag bordered={false} className="osq-soft-tag shrink-0">
              {f.meta}
            </Tag>
            <Text
              className={`osq-feedback-text ${expanded ? "" : "line-clamp-2"}`}
            >
              {f.text}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------
 * Minimal fade transition wrapper
 * --------------------------- */
function FadeSwap({ children }) {
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    setShow(false);
    const id = setTimeout(() => setShow(true), 40);
    return () => clearTimeout(id);
  }, [children]);
  return (
    <div className={`transition-opacity ${show ? "opacity-100" : "opacity-0"}`}>
      {children}
    </div>
  );
}
