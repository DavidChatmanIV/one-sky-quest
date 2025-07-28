import React from "react";
import { Tabs } from "antd";

const ProfileTabs = ({ dream, activity }) => {
  const items = [
    { key: "1", label: "🌍 Dream Destinations", children: dream },
    { key: "2", label: "📜 Recent Activity", children: activity },
  ];

  return <Tabs defaultActiveKey="1" items={items} className="mt-6" />;
};

export default ProfileTabs;
