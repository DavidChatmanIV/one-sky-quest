import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Typography,
  Tooltip,
  Input,
  message,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  MessageOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import PageLayout from "../components/PageLayout";
import ThemeSelector from "../components/profile/ThemeSelector";
import AvatarCustomizer from "../components/profile/AvatarCustomizer";
import ProfileMusic from "../components/profile/ProfileMusic";

const { Title, Text } = Typography;

const badgeTitles = [
  "New Explorer",
  "Wanderer",
  "Trailblazer",
  "Globetrotter",
  "Jet Setter",
  "World Builder",
];

const top8Sample = [
  { name: "Emily", img: "/images/users/emily.jpg" },
  { name: "Jayden", img: "/images/users/jayden.jpg" },
  { name: "Luna", img: "/images/users/luna.jpg" },
  { name: "Kai", img: "/images/users/kai.jpg" },
  { name: "Zara", img: "/images/users/zara.jpg" },
  { name: "Leo", img: "/images/users/leo.jpg" },
  { name: "Ava", img: "/images/users/ava.jpg" },
  { name: "Noah", img: "/images/users/noah.jpg" },
];

const ProfilePage = () => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState(
    "🌍 Exploring the world one trip at a time..."
  );
  const [theme, setTheme] = useState({
    bg: "bg-white",
    font: "font-sans text-gray-800",
  });
  const [avatar, setAvatar] = useState({
    avatarUrl: null,
    borderFx: "ring-2 ring-pink-500 animate-pulse",
  });

  const handleAddXp = (amount) => {
    setXp((prevXp) => {
      const newXp = prevXp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      if (newLevel > level) {
        message.success(`🎉 Level Up! You reached Level ${newLevel}`);
        setLevel(newLevel);
      }
      return newXp;
    });
  };

  const getLevelTitle = (lvl) =>
    badgeTitles[Math.min(lvl - 1, badgeTitles.length - 1)];

  const getBadgeIcon = (lvl) =>
    `/images/badges/badge-${Math.min(lvl, badgeTitles.length)}.jpg`;

  return (
    <PageLayout>
      <section
        className={`px-4 md:px-8 pt-6 pb-10 space-y-6 transition-all duration-500 ${theme.bg} ${theme.font}`}
      >
        {/* 🔹 Profile Header */}
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6} className="flex justify-center md:justify-start">
            <Avatar
              size={120}
              icon={!avatar.avatarUrl && <UserOutlined />}
              src={avatar.avatarUrl}
              className={`transition-all duration-500 ${avatar.borderFx}`}
            />
          </Col>
          <Col xs={24} md={18}>
            <Title level={3}>Welcome, David</Title>
            <Text>
              Level {level}: {getLevelTitle(level)}
            </Text>
            <Progress
              percent={xp % 100}
              showInfo={false}
              strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
              className="transition-all duration-700"
            />
            <div className="mt-2 flex gap-2">
              <Button icon={<PlusOutlined />} onClick={() => handleAddXp(10)}>
                +10 XP
              </Button>
              <Tooltip title="Send a message">
                <Button icon={<MessageOutlined />} />
              </Tooltip>
              <Tooltip title="Add friend">
                <Button icon={<UserAddOutlined />} />
              </Tooltip>
            </div>
          </Col>
        </Row>

        {/* 🔹 Status Input */}
        <div className="mt-4">
          <Title level={4}>✍️ Status</Title>
          <Input.TextArea
            rows={2}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            maxLength={140}
            showCount
            placeholder="What's your current vibe? 🧘‍♂️✈️🔥"
            className="mt-2"
          />
        </div>

        {/* 🔹 Theme Picker */}
        <ThemeSelector onThemeChange={setTheme} />

        {/* 🔹 Avatar Customizer */}
        <AvatarCustomizer onAvatarChange={setAvatar} />

        <Divider />

        {/* 🔹 Top 8 Friends */}
        <div>
          <Title level={4}>🌟 Top 8 Friends</Title>
          <Row gutter={[12, 12]}>
            {top8Sample.map((friend, idx) => (
              <Col xs={6} sm={4} md={3} key={idx} className="text-center">
                <Tooltip title={friend.name}>
                  <Avatar
                    size={64}
                    src={friend.img}
                    className="hover:scale-110 transition-transform duration-300 border-2 border-blue-500"
                  />
                </Tooltip>
                <Text className="block mt-1 text-sm">{friend.name}</Text>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        {/* 🔹 Badges */}
        <Title level={4}>🎖️ Badges</Title>
        <Row gutter={[16, 16]}>
          {badgeTitles.map((title, index) => (
            <Col key={index}>
              <Card
                cover={
                  <img
                    src={getBadgeIcon(index + 1)}
                    alt={title}
                    className={`rounded-t ${
                      level === index + 1
                        ? "animate-pulse ring-2 ring-blue-500"
                        : ""
                    }`}
                  />
                }
                hoverable
                className="w-[150px]"
              >
                <Card.Meta title={title} />
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        {/* 🔹 Profile Music */}
        <Title level={4}>🎵 Add Profile Music</Title>
        <ProfileMusic />
      </section>
    </PageLayout>
  );
};

export default ProfilePage;
