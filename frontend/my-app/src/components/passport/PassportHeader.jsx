import React from "react";
import {
  Card,
  Typography,
  Space,
  Avatar,
  Tag,
  Progress,
  Button,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  ShareAltOutlined,
  CopyOutlined,
  CrownOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PassportHeader({
  name = "Explorer",
  username = "traveler",
  tier = "Free", // Free | Standard | Premium
  xp = 260,
  xpGoal = 500,
  location = "New Jersey",
  onCopyReferral,
  onShare,
  onUpgrade,
}) {
  const pct = Math.min(100, Math.round((xp / Math.max(1, xpGoal)) * 100));

  return (
    <Card
      className="sk-card"
      style={{
        borderRadius: 18,
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.12)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          background:
            "linear-gradient(135deg, rgba(255,138,42,.18), rgba(122,60,58,.14), rgba(58,42,114,.18))",
          borderBottom: "1px solid rgba(255,255,255,.10)",
        }}
      >
        <Space
          align="start"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <Space align="center" size={12}>
            <Avatar size={52} icon={<UserOutlined />} />
            <div>
              <Space align="center" size={10}>
                <Title
                  level={4}
                  style={{ margin: 0, color: "rgba(255,255,255,.95)" }}
                >
                  {name}
                </Title>
                <Tag
                  icon={<CrownOutlined />}
                  style={{
                    marginInlineStart: 0,
                    border: "1px solid rgba(255,255,255,.15)",
                    background: "rgba(255,255,255,.06)",
                    color: "rgba(255,255,255,.9)",
                    fontWeight: 700,
                  }}
                >
                  {tier}
                </Tag>
              </Space>

              <Text style={{ color: "rgba(255,255,255,.70)" }}>
                @{username} • {location}
              </Text>
            </div>
          </Space>

          <Space>
            <Tooltip title="Share your passport">
              <Button ghost icon={<ShareAltOutlined />} onClick={onShare} />
            </Tooltip>
            <Tooltip title="Copy referral / invite">
              <Button ghost icon={<CopyOutlined />} onClick={onCopyReferral} />
            </Tooltip>
            <Button type="primary" className="btn-orange" onClick={onUpgrade}>
              Upgrade
            </Button>
          </Space>
        </Space>

        <div style={{ marginTop: 14 }}>
          <Space direction="vertical" size={6} style={{ width: "100%" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text style={{ color: "rgba(255,255,255,.85)", fontWeight: 700 }}>
                XP Progress
              </Text>
              <Text style={{ color: "rgba(255,255,255,.75)" }}>
                {xp} / {xpGoal} XP
              </Text>
            </Space>
            <Progress percent={pct} showInfo />
          </Space>
        </div>
      </div>
    </Card>
  );
}