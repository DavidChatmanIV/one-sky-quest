import React from "react";
import { Card, Space, Typography, Button } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

export default function AIPlannerCard() {
  return (
    <Card
      variant="borderless"
      className="osq-card ai-banner"
      styles={{ body: { padding: 20 } }}
    >
      <Space direction="vertical" size={12}>
        <Title level={3} className="title-white" style={{ margin: 0 }}>
          Plan Smarter with AI
        </Title>
        <Text className="muted-on-dark">
          Plan smarter with personalized routes, ideas, and budget-friendly
          picks.
        </Text>
        <Link to="/travel-assistant">
          <Button className="btn-orange" size="large" icon={<RobotOutlined />}>
            Smart Plan
          </Button>
        </Link>
      </Space>
    </Card>
  );
}
