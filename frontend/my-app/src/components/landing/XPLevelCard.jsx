import React from "react";
import { Card, Space, Typography, Progress, Badge } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function XPLevelCard({ level = "Globetrotter", percent = 80 }) {
  return (
    <Card
      variant="borderless"
      className="osq-card"
      styles={{ body: { padding: 16 } }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={8}>
        <Text type="secondary">XP Level</Text>
        <Space align="center" size={8}>
          <Badge
            count={<ThunderboltOutlined />}
            style={{ background: "var(--osq-pill)" }}
          />
          <Text strong>{level}</Text>
          <Text type="secondary" style={{ marginLeft: "auto" }}>
            {percent}%
          </Text>
        </Space>
        <Progress
          percent={percent}
          showInfo={false}
          strokeColor={"var(--osq-accent)"}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Earn XP with every booking.
        </Text>
      </Space>
    </Card>
  );
}
