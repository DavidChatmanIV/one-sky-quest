import React, { useState } from "react";
import { Layout, Typography, Tabs, Card, Badge } from "antd";
import {
  StarOutlined,
  ClockCircleOutlined,
  BellOutlined,
  TrophyOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";

// Components
import SavedExcursions from "../components/excursions/SavedExcursions";
import UpcomingBookings from "../components/dashboard/UpcomingBookings";
import TravelAlerts from "../components/dashboard/TravelAlerts";
import XPBadgeCard from "../components/dashboard/XPBadgeCard";
import FeedbackForm from "../components/FeedbackForm";

const { Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabItems = [
    {
      key: "overview",
      label: (
        <span>
          <HomeOutlined /> Overview
        </span>
      ),
      children: (
        <Card bordered={false}>
          <h3>Welcome to your dashboard!</h3>
          <p>
            Track your saved trips, progress, and travel alerts all in one
            place.
          </p>
        </Card>
      ),
    },
    {
      key: "saved-trips",
      label: (
        <span>
          <StarOutlined /> Saved Trips
        </span>
      ),
      children: <SavedExcursions />,
    },
    {
      key: "upcoming",
      label: (
        <span>
          <ClockCircleOutlined /> Upcoming
        </span>
      ),
      children: <UpcomingBookings />,
    },
    {
      key: "alerts",
      label: (
        <span>
          <Badge dot>
            <BellOutlined /> Alerts
          </Badge>
        </span>
      ),
      children: <TravelAlerts />,
    },
    {
      key: "xp",
      label: (
        <span>
          <TrophyOutlined /> XP & Badges
        </span>
      ),
      children: <XPBadgeCard />,
    },
    {
      key: "settings",
      label: (
        <span>
          <SettingOutlined /> Settings
        </span>
      ),
      children: (
        <Card bordered={false}>
          <p>Update your profile and preferences here.</p>
        </Card>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen bg-white p-6">
      <Content className="max-w-6xl mx-auto">
        <Title level={2}>📊 Dashboard</Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          animated
        />

        {/* Feedback Form at the bottom */}
        <div style={{ marginTop: 48 }}>
          <FeedbackForm />
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
