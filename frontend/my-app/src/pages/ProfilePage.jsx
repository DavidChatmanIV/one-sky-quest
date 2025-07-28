import React, { useState } from "react";
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
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  MessageOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import PageLayout from "../components/PageLayout";
import ThemeSelector from "../components/profile/ThemeSelector";
import AvatarCustomizer from "../components/profile/AvatarCustomizer";
import ProfileMusic from "../components/profile/ProfileMusic";
import ReferralBox from "../components/profile/ReferralBox";

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

const showXpToast = (xp, reason) => {
  message.success(`+${xp} XP earned for ${reason}!`);
};

const ProfilePage = () => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState(
    "\ud83c\udf0d Exploring the world one trip at a time..."
  );
  const [theme, setTheme] = useState({
    bg: "bg-white",
    font: "font-sans text-gray-800",
  });
  const [avatar, setAvatar] = useState({
    avatarUrl: null,
    borderFx: "ring-2 ring-pink-500 animate-pulse",
  });

  const user = {
    username: "David",
    referralCode: "ONE_DAVID123",
    referralsCount: 3,
  };

  const handleAddXp = (amount, reason = "") => {
    setXp((prevXp) => {
      const newXp = prevXp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        message.success(`\ud83c\udf89 Level Up! You reached Level ${newLevel}`);
      }
      if (reason) showXpToast(amount, reason);
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
        className={`px-4 md:px-10 py-8 bg-white min-h-screen text-gray-800 space-y-10 ${theme.font}`}
      >
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="rounded-2xl shadow-lg p-6">
            <Row gutter={[16, 16]} align="middle">
              <Col
                xs={24}
                md={6}
                className="flex justify-center md:justify-start"
              >
                <Avatar
                  size={120}
                  icon={!avatar.avatarUrl && <UserOutlined />}
                  src={avatar.avatarUrl}
                  className={`transition-all duration-500 ${avatar.borderFx}`}
                />
              </Col>
              <Col xs={24} md={18}>
                <Title level={2} className="font-bold text-gray-800">
                  👋 Welcome back,{" "}
                  <span className="text-blue-600">{user?.username}</span>
                </Title>
                <Text className="text-md text-gray-600 italic">
                  Level {level} —{" "}
                  <span className="font-semibold">{getLevelTitle(level)}</span>
                </Text>
                <Progress
                  percent={xp % 100}
                  showInfo={false}
                  strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                  className="transition-all duration-700 mt-2"
                />
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleAddXp(10)}
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                  >
                    ✨ +10 XP
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleAddXp(20, "sharing a travel memory")}
                    className="bg-pink-500 text-white hover:bg-pink-600 rounded-full"
                  >
                    📸 Share Travel Memory
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
          </Card>
        </motion.div>

        {/* Status Input */}
        <Card className="rounded-xl shadow-md p-4">
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
        </Card>

        {/* Referral System */}
        <ReferralBox user={user} />

        {/* Theme Picker */}
        <ThemeSelector onThemeChange={setTheme} />

        {/* Avatar Customizer */}
        <AvatarCustomizer onAvatarChange={setAvatar} />

        <Divider />

        {/* Top 8 Friends */}
        <Card className="rounded-xl shadow-md p-4">
          <Title level={4}>🌟 Top 8 Friends</Title>
          <Row gutter={[12, 12]} justify="center">
            {top8Sample.map((friend, idx) => (
              <Col xs={8} sm={6} md={4} key={idx} className="text-center">
                <Tooltip title={`View ${friend.name}'s profile`}>
                  <Avatar
                    size={72}
                    src={friend.img}
                    className="border-[3px] border-indigo-500 hover:scale-110 rounded-full transition-transform duration-300"
                  />
                </Tooltip>
                <Text className="block mt-2 font-semibold">{friend.name}</Text>
              </Col>
            ))}
          </Row>
        </Card>

        <Divider />

        {/* Badges */}
        <Card className="rounded-xl shadow-md p-4">
          <Title level={4}>🎖️ Badges</Title>
          <Row gutter={[16, 16]} justify="start">
            {badgeTitles.map((title, index) => (
              <Col key={index}>
                <Tooltip title={`Earned at Level ${index + 1}`}>
                  <Card
                    hoverable
                    className={`rounded-xl shadow-md w-[160px] text-center ${
                      level === index + 1
                        ? "border-2 border-yellow-400 animate-pulse"
                        : ""
                    }`}
                  >
                    <img
                      src={getBadgeIcon(index + 1)}
                      alt={title}
                      className="rounded-t-xl"
                    />
                    <div className="py-2 font-semibold text-sm">{title}</div>
                  </Card>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Profile Music */}
        <Card className="rounded-xl shadow-sm p-4 bg-gradient-to-r from-pink-100 to-blue-100">
          <Title level={4}>🎵 Add Profile Music</Title>
          <ProfileMusic />
        </Card>
      </section>
    </PageLayout>
  );
};

export default ProfilePage;
