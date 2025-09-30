import React from "react";
import { Typography, Card } from "antd";
import ProfileHeader from "./components/ProfileHeader";
import XPStats from "./components/XPStats";
import DreamDestinations from "./components/DreamDestinations";
import RecentActivity from "./components/RecentActivity";
import ProfileTabs from "./components/ProfileTabs";

const { Title } = Typography;

const mockUser = {
  name: "David",
  avatar: "/images/profile.jpg",
  location: "New Jersey, USA",
  bio: "Building the future of travel with One Sky Quest ✈️",
  xp: 2450,
  level: 7,
};

const ProfilePage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Title level={2}>🎒 Welcome back, {mockUser.name}!</Title>
      <ProfileHeader user={mockUser} />
      <XPStats xp={mockUser.xp} level={mockUser.level} />
      <ProfileTabs
        dream={<DreamDestinations />}
        activity={<RecentActivity />}
      />
    </div>
  );
};

export default ProfilePage;
