import React, { useState } from "react";
import { Card, Typography, Input, Button, Space, Tag } from "antd";
import {
  TeamOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function TeamTravelCard({
  /** Layout:
   *  - "rich": full UI (venue input, chips, CTA)
   *  - "compact": small outlined card
   */
  mode = "rich",

  // Shared props
  title = "Team Travel",
  desc = "Plan rooms, roles, and schedules in minutes.",

  // Rich mode props/handlers
  placeholder = "Enter venue or address",
  onStart = () => console.log("Start Team Trip"),
  onMap = () => console.log("Open Map"),
  onVenueChange = () => {},

  // Compact mode handler
  onOpen = () => {},
}) {
  const [venue, setVenue] = useState("");

  if (mode === "compact") {
    // --- COMPACT (merged from the simple card) ---
    return (
      <Card variant="outlined" styles={{ body: { padding: 16 } }} hoverable>
        <Title level={5} style={{ marginBottom: 8 }}>
          {title}
        </Title>
        <Paragraph style={{ marginBottom: 12 }}>{desc}</Paragraph>
        <Button type="primary" onClick={onOpen}>
          Open
        </Button>
      </Card>
    );
  }

  // --- RICH (merged from the fuller card) ---
  return (
    <Card
      className="osq-card team-travel"
      variant="filled" // AntD v5-safe
      styles={{ body: { padding: 16 } }} // replaces bodyStyle
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Space align="center">
          <TeamOutlined />
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
        </Space>

        <Text className="tt-sub">
          Plan tournaments and group trips together. Compare hotels, food, and
          kid-friendly spots near the venue.
        </Text>

        <Space.Compact style={{ width: "100%" }}>
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder={placeholder}
            className="tt-input"
            value={venue}
            onChange={(e) => {
              setVenue(e.target.value);
              onVenueChange(e.target.value);
            }}
            allowClear
          />
          <Button onClick={() => onMap(venue)}>Map</Button>
        </Space.Compact>

        <Space wrap size={[8, 8]}>
          <Tag className="tt-chip" icon={<CompassOutlined />}>
            Near venue
          </Tag>
          <Tag className="tt-chip" icon={<CoffeeOutlined />}>
            Kid & adult options
          </Tag>
        </Space>

        <Button
          type="primary"
          block
          className="btn-orange"
          onClick={() => onStart(venue)}
        >
          Start a Team Trip
        </Button>
      </Space>
    </Card>
  );
}
