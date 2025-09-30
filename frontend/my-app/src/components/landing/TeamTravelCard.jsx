import React from "react";
import { Card, Typography, Input, Button, Space, Tag } from "antd";
import {
  TeamOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function TeamTravelCard({
  onStart = () => console.log("Start Team Trip"),
}) {
  return (
    <Card
      className="osq-card team-travel"
      bordered={false}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {/* Title */}
        <Space align="center">
          <TeamOutlined />
          <Title level={4} style={{ margin: 0, color: "#fff" }}>
            Team Travel
          </Title>
        </Space>

        {/* Subtitle */}
        <Text className="tt-sub" style={{ color: "#fff" }}>
          Plan tournaments and group trips together. Compare hotels, food, and
          kid-friendly spots near the venue.
        </Text>

        {/* Input + Map Button */}
        <Space.Compact style={{ width: "100%" }}>
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder="Enter venue or address"
            className="tt-input"
          />
          <Button type="default">Map</Button>
        </Space.Compact>

        {/* Chips */}
        <Space wrap size={[8, 8]}>
          <Tag className="tt-chip" icon={<CompassOutlined />}>
            Near venue
          </Tag>
          <Tag className="tt-chip" icon={<CoffeeOutlined />}>
            Kid &amp; adult options
          </Tag>
        </Space>

        {/* CTA */}
        <Button type="primary" block className="btn-orange" onClick={onStart}>
          Start a Team Trip
        </Button>
      </Space>
    </Card>
  );
}
