import React from "react";
import { Tabs, Card } from "antd";
import XPBadgeCard from "../components/dashboard/XPBadgeCard"; 

const tabItems = [
  {
    key: "overview",
    label: "🏠 Overview",
    children: (
      <Card variant="borderless">
        <h3>Welcome to your dashboard!</h3>
        <p>Here’s a quick summary of your travel stats and activity.</p>
      </Card>
    ),
  },
  {
    key: "saved-trips",
    label: "💾 Saved Trips",
    children: (
      <Card variant="borderless">
        <p>You haven’t saved any trips yet.</p>
      </Card>
    ),
  },
  {
    key: "xp",
    label: "🏆 XP & Badges",
    children: <XPBadgeCard />, 
  },
  {
    key: "settings",
    label: "⚙️ Profile Settings",
    children: (
      <Card variant="borderless">
        <p>Update your profile and preferences here.</p>
      </Card>
    ),
  },
];

const Dashboard = () => {
  return (
    <div className="p-4">
      <Tabs defaultActiveKey="overview" items={tabItems} />
    </div>
  );
};

export default Dashboard;
