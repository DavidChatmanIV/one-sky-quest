import React, { useMemo, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Progress,
  Row,
  Typography,
  Tooltip,
  Input,
  message,
  Card,
  Space,
  Tag,
  theme,
  Select,
} from "antd";
import {
  UserOutlined,
  MessageOutlined,
  UserAddOutlined,
  HolderOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import PageLayout from "../components/PageLayout";
import ThemeSelector from "../components/profile/ThemeSelector";
import ProfileMusic from "../components/profile/ProfileMusic";
import ReferralBox from "../components/profile/ReferralBox";

const { Title, Text, Paragraph } = Typography;

// ------------------- constants -------------------
const BADGE_TITLES = [
  "New Explorer",
  "Wanderer",
  "Trailblazer",
  "Globetrotter",
  "Jet Setter",
  "World Builder",
];

const TOP8_SAMPLE = [
  { id: "Emily", name: "Emily", img: "/images/users/emily.jpg" },
  { id: "Jayden", name: "Jayden", img: "/images/users/jayden.jpg" },
  { id: "Luna", name: "Luna", img: "/images/users/luna.jpg" },
  { id: "Kai", name: "Kai", img: "/images/users/kai.jpg" },
  { id: "Zara", name: "Zara", img: "/images/users/zara.jpg" },
  { id: "Leo", name: "Leo", img: "/images/users/leo.jpg" },
  { id: "Ava", name: "Ava", img: "/images/users/ava.jpg" },
  { id: "Noah", name: "Noah", img: "/images/users/noah.jpg" },
];

const BORDER_STYLES = {
  None: { border: "2px solid rgba(0,0,0,0.06)" },
  Glow: {
    border: "2px solid #60a5fa",
    boxShadow: "0 0 0 3px rgba(96,165,250,0.25)",
  },
  Gold: {
    border: "2px solid #eab308",
    boxShadow: "0 0 0 3px rgba(234,179,8,0.20)",
  },
  Rose: {
    border: "2px solid #f43f5e",
    boxShadow: "0 0 0 3px rgba(244,63,94,0.20)",
  },
};

// ------------------- helpers -------------------
const showXpToast = (xp, reason) => {
  if (reason) message.success(`+${xp} XP earned for ${reason}!`);
  else message.success(`+${xp} XP earned!`);
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const levelFromXp = (xp) => Math.floor(xp / 100) + 1;
const progressToNext = (xp) => xp % 100;
const xpToNext = (xp) => 100 - progressToNext(xp);

// ------------------- section wrapper -------------------
const Section = ({ title, subtitle, extra, children }) => {
  const { token } = theme.useToken();
  return (
    <Card
      className="rounded-2xl"
      style={{ borderRadius: token.borderRadiusLG, overflow: "hidden" }}
      bodyStyle={{ padding: 16 }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            {subtitle ? (
              <Text type="secondary" style={{ fontSize: 13 }}>
                {subtitle}
              </Text>
            ) : null}
          </Space>
        </Col>
        <Col>{extra}</Col>
      </Row>
      {children}
    </Card>
  );
};

// ------------------- Sortable friend -------------------
const SortableFriend = ({ friend }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: friend.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    cursor: "grab",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center"
    >
      <div
        style={{
          position: "relative",
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "3px solid rgba(24, 144, 255, 0.25)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          transition: "transform .2s ease",
        }}
        className="hover:scale-110"
      >
        <HolderOutlined
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            fontSize: 14,
            color: "rgba(0,0,0,0.4)",
          }}
        />
        <Avatar
          size={72}
          src={friend.img}
          alt={friend.name}
          style={{ background: "#f5f5f5" }}
        />
      </div>
      <Text style={{ marginTop: 6, fontSize: 12, fontWeight: 500 }}>
        {friend.name}
      </Text>
    </div>
  );
};

// ------------------- Page -------------------
const ProfilePage = () => {
  const { token } = theme.useToken();

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState(
    "🌍 Exploring the world one trip at a time..."
  );
  const [themeChoice, setThemeChoice] = useState({
    bg: "bg-white",
    font: "font-sans text-gray-800",
  });

  // avatar at top (like socials)
  const [avatar, setAvatar] = useState({
    avatarUrl: null,
    borderStyle: "Glow",
  });

  // Top 8 reorderable list
  const [top8, setTop8] = useState(TOP8_SAMPLE);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const user = useMemo(
    () => ({
      username: "David",
      referralCode: "ONE_DAVID123",
      referralsCount: 3,
    }),
    []
  );

  const handleAddXp = (amount, reason = "") => {
    setXp((prev) => {
      const nx = prev + amount;
      const nl = levelFromXp(nx);
      if (nl > level) {
        setLevel(nl);
        message.success(`🎉 Level Up! You reached Level ${nl}`);
      }
      if (amount > 0) showXpToast(amount, reason);
      return nx;
    });
  };

  // Real actions → XP
  const handleShareMemory = () => handleAddXp(20, "sharing a travel memory");
  const handleSendMessage = () => handleAddXp(5, "sending a message");
  const handleAddFriend = () => handleAddXp(25, "adding a friend");

  // inline avatar edit (upload + border select)
  const fileInputRef = useRef(null);
  const onPickFile = () => fileInputRef.current?.click();
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar((prev) => ({ ...prev, avatarUrl: reader.result }));
      handleAddXp(10, "customizing avatar");
      message.success("Avatar updated!");
    };
    reader.readAsDataURL(file);
  };

  const levelTitle = useMemo(() => {
    const idx = Math.max(0, Math.min(level - 1, BADGE_TITLES.length - 1));
    return BADGE_TITLES[idx];
  }, [level]);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = top8.findIndex((f) => f.id === active.id);
    const newIndex = top8.findIndex((f) => f.id === over.id);
    setTop8(arrayMove(top8, oldIndex, newIndex));
    handleAddXp(5, "reordering Top 8");
  };

  // clamp percent to 0–100 and reuse
  const percentToNext = clamp(progressToNext(xp), 0, 100);

  return (
    <PageLayout>
      <section
        className={`px-4 md:px-10 py-16 min-h-screen ${themeChoice.font}`}
        style={{ background: token.colorBgLayout, color: token.colorText }}
      >
        {/* ------------------- TOP PROFILE SECTION (avatar + XP + actions + music) ------------------- */}
        <Card
          className="rounded-2xl shadow-sm"
          bodyStyle={{ padding: 16 }}
          style={{ borderRadius: token.borderRadiusLG }}
        >
          <Row align="top" gutter={[24, 12]}>
            {/* LEFT: Avatar + XP ring + quick edit */}
            <Col flex="none">
              <div style={{ position: "relative", width: 128, height: 128 }}>
                <Progress
                  type="dashboard"
                  percent={percentToNext}
                  size={128}
                  strokeWidth={10}
                  trailColor={token.colorFillQuaternary}
                  strokeColor={token.colorPrimary}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Avatar
                    size={88}
                    icon={!avatar.avatarUrl && <UserOutlined />}
                    src={avatar.avatarUrl}
                    className="transition-all duration-300"
                    style={{
                      borderRadius: "9999px",
                      background: "#f8fafc",
                      ...(BORDER_STYLES[avatar.borderStyle] ||
                        BORDER_STYLES.None),
                    }}
                  />
                </div>
              </div>

              {/* Inline avatar controls */}
              <Space direction="vertical" size={6} style={{ marginTop: 8 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFile}
                  style={{ display: "none" }}
                />
                <Button icon={<UploadOutlined />} onClick={onPickFile}>
                  Change Avatar
                </Button>
                <div>
                  <Text type="secondary" style={{ marginRight: 8 }}>
                    Border:
                  </Text>
                  <Select
                    size="small"
                    value={avatar.borderStyle}
                    style={{ width: 140 }}
                    onChange={(val) =>
                      setAvatar((p) => ({ ...p, borderStyle: val }))
                    }
                    options={Object.keys(BORDER_STYLES).map((k) => ({
                      value: k,
                      label: k,
                    }))}
                  />
                </div>
              </Space>
            </Col>

            {/* RIGHT: Level tags, progress bar, actions, and 🎵 Profile Music */}
            <Col flex="auto">
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Space wrap>
                  <Tag color="blue">Level {level}</Tag>
                  <Tag color="green">{levelTitle}</Tag>
                  <Text type="secondary">{xpToNext(xp)} XP to next level</Text>
                </Space>

                <Progress
                  percent={percentToNext}
                  showInfo={false}
                  strokeColor={token.colorSuccess}
                />

                <Space wrap>
                  <Button onClick={handleShareMemory}>Share Memory</Button>
                  <Tooltip title="Send a message">
                    <Button
                      icon={<MessageOutlined />}
                      onClick={handleSendMessage}
                      aria-label="Send message"
                    />
                  </Tooltip>
                  <Tooltip title="Add friend">
                    <Button
                      icon={<UserAddOutlined />}
                      onClick={handleAddFriend}
                      aria-label="Add friend"
                    />
                  </Tooltip>
                </Space>

                <Divider style={{ margin: 8 }} />

                {/* 🎵 Profile Music lives here */}
                <ProfileMusic />
              </Space>
            </Col>
          </Row>
        </Card>

        <Divider style={{ margin: "24px 0" }} />

        {/* ------------------- STATUS ------------------- */}
        <Section
          title="✍️ Status"
          subtitle="Let friends know your vibe."
          extra={
            <Text type="secondary">{140 - (status?.length || 0)} left</Text>
          }
        >
          <Input.TextArea
            rows={2}
            value={status}
            maxLength={140}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="What's your current vibe? 🧘‍♂️✈️🔥"
            aria-label="Status message"
          />
        </Section>

        {/* ------------------- REFERRALS ------------------- */}
        <Section
          title="🎁 Referral Rewards"
          subtitle="Invite friends. Earn XP and perks."
        >
          <ReferralBox user={user} />
        </Section>

        {/* ------------------- THEME (left) + KEEP EXPLORING (right) ------------------- */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Section title="🎨 Theme" subtitle="Make it feel like home.">
              <ThemeSelector onThemeChange={setThemeChoice} />
            </Section>
          </Col>

          <Col xs={24} md={12}>
            <Card
              className="rounded-2xl shadow-sm"
              bodyStyle={{ padding: 16 }}
              style={{ borderRadius: token.borderRadiusLG, height: "100%" }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Keep exploring. Keep leveling.
              </Title>
              <Paragraph type="secondary" style={{ margin: "6px 0 12px" }}>
                Post a memory, invite a friend, or customize your profile to
                earn XP.
              </Paragraph>
              <Space wrap>
                <Button
                  type="primary"
                  onClick={() => handleAddXp(15, "updating profile")}
                >
                  Update Profile (+15 XP)
                </Button>
                <Button onClick={() => handleAddXp(25, "inviting a friend")}>
                  Invite a Friend (+25 XP)
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* ------------------- TOP 8 (sortable) ------------------- */}
        <Section
          title="🌟 Top 8 Friends"
          subtitle="Drag to reorder your travel circle."
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={top8.map((f) => f.id)}
              strategy={rectSortingStrategy}
            >
              <Row gutter={[12, 16]} justify="start">
                {top8.map((friend) => (
                  <Col xs={8} sm={6} md={4} key={friend.id}>
                    <SortableFriend friend={friend} />
                  </Col>
                ))}
              </Row>
            </SortableContext>
          </DndContext>
        </Section>

        {/* ------------------- BADGES ------------------- */}
        <Section title="🎖️ Badges" subtitle="Milestones you’ve unlocked.">
          <Row gutter={[12, 12]}>
            {BADGE_TITLES.map((title, index) => {
              const lvl = index + 1;
              const isCurrent = level === lvl;
              return (
                <Col xs={12} sm={8} md={6} lg={4} key={index}>
                  <Card
                    hoverable
                    bodyStyle={{ padding: 8, textAlign: "center" }}
                    style={{
                      borderRadius: token.borderRadiusLG,
                      border: isCurrent
                        ? `2px solid ${token.colorWarningBorder}`
                        : undefined,
                      boxShadow: isCurrent
                        ? "0 6px 20px rgba(0,0,0,0.08)"
                        : undefined,
                    }}
                  >
                    <img
                      src={`/images/badges/badge-${lvl}.jpg`}
                      alt={title}
                      style={{
                        width: "100%",
                        borderRadius: token.borderRadiusLG,
                      }}
                    />
                    <div
                      style={{
                        padding: "8px 4px",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {title}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Earned at Level {lvl}
                    </Text>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Section>
      </section>
    </PageLayout>
  );
};

export default ProfilePage;
