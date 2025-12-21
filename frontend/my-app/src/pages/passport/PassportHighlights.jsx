import React from "react";
import { Typography, Space, Tag } from "antd";
import { StarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PassportHighlights({
  topPlaces = ["Paris", "Rome", "New York", "Bali"],
  memory = { line1: "Visited 12 countries", line2: "Next badge: Globetrotter" },
}) {
  return (
    <div className="osq-surface" style={{ padding: 16 }}>
      <Title level={3} style={{ margin: 0, color: "#fff" }}>
        Highlights
      </Title>
      <Text className="muted">A quiet flex — clean and meaningful.</Text>

      <div style={{ marginTop: 12 }}>
        <Text style={{ fontWeight: 900, color: "#fff" }}>Top Places</Text>
        <Space size={[8, 8]} wrap style={{ marginTop: 10 }}>
          {topPlaces.map((p) => (
            <Tag key={p} className="chip" icon={<StarOutlined />}>
              {p}
            </Tag>
          ))}
        </Space>
      </div>

      <div style={{ marginTop: 14 }}>
        <Text style={{ fontWeight: 900, color: "#fff" }}>Traveler Memory</Text>
        <div style={{ marginTop: 8 }}>
          <div style={{ color: "#fff", fontWeight: 900 }}>{memory.line1}</div>
          <div className="muted">{memory.line2}</div>
        </div>
      </div>
    </div>
  );
}