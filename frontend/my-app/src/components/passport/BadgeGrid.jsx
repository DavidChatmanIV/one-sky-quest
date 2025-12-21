import React from "react";
import { Card, Typography, Space, Tag, Tooltip } from "antd";
import { StarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function BadgeGrid({
  title = "Badges",
  badges = [
    { name: "Explorer", desc: "Completed your first trip plan", earned: true },
    { name: "Wanderer", desc: "Saved 5 trips", earned: true },
    { name: "Trailblazer", desc: "Booked a stay", earned: false },
    { name: "Globetrotter", desc: "Visited 3 countries", earned: false },
  ],
}) {
  return (
    <Card
      className="sk-card"
      style={{
        borderRadius: 16,
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.12)",
      }}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Space align="center">
          <StarOutlined />
          <Title
            level={4}
            style={{ margin: 0, color: "rgba(255,255,255,.95)" }}
          >
            {title}
          </Title>
        </Space>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {badges.map((b) => (
            <Tooltip key={b.name} title={b.desc}>
              <div
                style={{
                  borderRadius: 14,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,.12)",
                  background: b.earned
                    ? "rgba(255,255,255,.08)"
                    : "rgba(255,255,255,.04)",
                  opacity: b.earned ? 1 : 0.65,
                  cursor: "default",
                }}
              >
                <Space direction="vertical" size={4}>
                  <Space
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <Text
                      style={{
                        color: "rgba(255,255,255,.92)",
                        fontWeight: 800,
                      }}
                    >
                      {b.name}
                    </Text>
                    <Tag style={{ margin: 0 }}>
                      {b.earned ? "Earned" : "Locked"}
                    </Tag>
                  </Space>
                  <Text
                    style={{ color: "rgba(255,255,255,.70)", fontSize: 12 }}
                  >
                    {b.desc}
                  </Text>
                </Space>
              </div>
            </Tooltip>
          ))}
        </div>
      </Space>
    </Card>
  );
}
