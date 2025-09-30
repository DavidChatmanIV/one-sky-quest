import React from "react";
import { Card, Tabs, Affix } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

export default function SectionTabs({ activeKey, onChange }) {
  const items = [
    { key: "overview", label: "Overview", icon: <PlayCircleOutlined /> },
    { key: "friends", label: "Friends" },
    { key: "memories", label: "Memories" },
    { key: "badges", label: "Badges" },
    { key: "customize", label: "Customization" },
  ];

  return (
    <Affix offsetTop={64}>
      <Card style={{ marginTop: 12, borderRadius: 14, padding: 0 }}>
        <Tabs activeKey={activeKey} onChange={onChange} items={items} />
      </Card>
    </Affix>
  );
}
