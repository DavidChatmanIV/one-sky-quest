import React, { useMemo } from "react";
import { Card, Typography, Space, Tag, Button, List } from "antd";
import { CrownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function MembershipCard({
  tier = "Free", // Free | Standard | Premium
  perks = [
    "Earn XP on bookings + activity",
    "Basic price alerts + saved trips",
    "Passport stamps + profile perks",
  ],
  onUpgrade,
  onCompare,
}) {
  const tierColor = useMemo(() => {
    if (tier === "Premium") return "gold";
    if (tier === "Standard") return "purple";
    return "default";
  }, [tier]);

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
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Space>
            <CrownOutlined />
            <Title
              level={4}
              style={{ margin: 0, color: "rgba(255,255,255,.95)" }}
            >
              Membership Tier
            </Title>
          </Space>

          <Tag color={tierColor} style={{ fontWeight: 800 }}>
            {tier}
          </Tag>
        </Space>

        <Text style={{ color: "rgba(255,255,255,.75)" }}>
          Your tier unlocks perks across Skyrio.
        </Text>

        <List
          size="small"
          dataSource={perks}
          renderItem={(item) => (
            <List.Item style={{ border: "none", padding: "4px 0" }}>
              <Text style={{ color: "rgba(255,255,255,.88)" }}>• {item}</Text>
            </List.Item>
          )}
        />

        <Space>
          <Button type="primary" className="btn-orange" onClick={onUpgrade}>
            Upgrade
          </Button>
          <Button ghost onClick={onCompare}>
            Compare tiers
          </Button>
        </Space>
      </Space>
    </Card>
  );
}