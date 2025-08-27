import React from "react";
import { Card, Progress, Typography, Tooltip, Space } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// You can later replace this with real user data from backend
const MOCK_XP = {
  level: 5,
  currentXP: 4200,
  nextLevelXP: 5000,
};

const BookingXPBar = ({ level, currentXP, nextLevelXP }) => {
  const xp = currentXP ?? MOCK_XP.currentXP;
  const nextXP = nextLevelXP ?? MOCK_XP.nextLevelXP;
  const levelNum = level ?? MOCK_XP.level;

  const percent = Math.min((xp / nextXP) * 100, 100);

  return (
    <Card
      bordered={false}
      style={{
        marginBottom: 24,
        background: "#f0f5ff",
        borderLeft: "5px solid #1890ff",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={5} style={{ margin: 0 }}>
          <ThunderboltOutlined /> XP Progress – Level {levelNum}
        </Title>

        <Tooltip
          title={`${nextXP - xp} XP to Level ${levelNum + 1}`}
          placement="topLeft"
        >
          <Progress
            percent={parseFloat(percent.toFixed(1))}
            strokeColor="#1890ff"
            trailColor="#d6e4ff"
            showInfo={false}
            status="active"
          />
        </Tooltip>

        <Text type="secondary">
          {xp.toLocaleString()} XP / {nextXP.toLocaleString()} XP
        </Text>
      </Space>
    </Card>
  );
};

export default BookingXPBar;
