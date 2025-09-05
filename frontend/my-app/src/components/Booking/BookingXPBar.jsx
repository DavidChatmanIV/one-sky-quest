import React from "react";
import { Card, Progress, Typography, Tooltip, Space, Tag } from "antd";
import {
  ThunderboltOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

// Optional mock fallback (kept from your version)
const MOCK = {
  level: 5,
  xp: 4200,
  cap: 5000,
};


export default function BookingXPBar(props) {
  const {
    level = props.level ?? MOCK.level,
    // absolute inputs (your current API)
    currentXP,
    nextLevelXP,
    // per-level inputs (alternative API)
    xp,
    capPerLevel = 100,
    className = "",
  } = props;

  // Choose data source: absolute (currentXP/nextLevelXP) > per-level (xp/capPerLevel) > mock
  const useAbsolute =
    typeof currentXP === "number" && typeof nextLevelXP === "number";
  const total = useAbsolute ? currentXP : typeof xp === "number" ? xp : MOCK.xp;
  const cap = useAbsolute
    ? nextLevelXP
    : typeof xp === "number"
    ? capPerLevel
    : MOCK.cap;

  const percent = Math.min(Math.max(cap ? (total / cap) * 100 : 0, 0), 100);
  const remaining = Math.max(cap - total, 0);

  return (
    <Card
      variant="borderless"
      className={`osq-card-glass ${className}`}
      styles={{ body: { padding: 16 } }}
    >
      <Space direction="vertical" size={8} className="w-full">
        <Space align="center" className="justify-between w-full">
          <Space align="center" size={8}>
            <ThunderboltOutlined />
            <Title level={5} style={{ margin: 0 }}>
              XP Progress — Level {level}
            </Title>
            <Tooltip title="Earn XP with searches, planning, and bookings.">
              <InfoCircleOutlined style={{ opacity: 0.7 }} />
            </Tooltip>
          </Space>

          <Tag
            icon={<TrophyOutlined />}
            color="gold"
            style={{ borderRadius: 999 }}
          >
            Next level at {cap.toLocaleString()} XP
          </Tag>
        </Space>

        <Tooltip
          title={`${remaining.toLocaleString()} XP to Level ${level + 1}`}
        >
          <Progress
            percent={Math.round(percent)}
            showInfo={false}
            status="active"
            strokeColor="#6aa8ff"
            trailColor="#2a2c4b"
          />
        </Tooltip>

        <Space className="justify-between w-full" size={4}>
          <Text type="secondary">
            {total.toLocaleString()} XP / {cap.toLocaleString()} XP
          </Text>
          <Text>{Math.round(percent)}%</Text>
        </Space>
      </Space>
    </Card>
  );
}
