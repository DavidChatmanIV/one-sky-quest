import React from "react";
import { List } from "antd";

const data = [
  "Saved trip to Costa Rica 🌴",
  "Reacted to a post in Quest Feed 🔥",
  "Completed travel badge 🧳",
];

const RecentActivity = () => {
  return (
    <List
      header={<div className="font-semibold">Recent Activity</div>}
      bordered
      dataSource={data}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  );
};

export default RecentActivity;
