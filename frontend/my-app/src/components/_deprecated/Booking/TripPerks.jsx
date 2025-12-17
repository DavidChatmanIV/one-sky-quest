import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  StarOutlined,
  ClockCircleOutlined,
  GiftOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const perks = [
  {
    icon: <StarOutlined style={{ fontSize: 24, color: "#fadb14" }} />,
    title: "XP Rewards",
    description: "Earn XP for every car rental, and level up your profile!",
  },
  {
    icon: <ClockCircleOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
    title: "Flexible Cancellation",
    description: "Free cancellation on most bookings — no stress, no problem.",
  },
  {
    icon: <GiftOutlined style={{ fontSize: 24, color: "#eb2f96" }} />,
    title: "Exclusive Deals",
    description: "Unlock better prices and bundles with One Sky Quest perks.",
  },
  {
    icon: <SafetyOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
    title: "Trusted Partners",
    description: "We partner only with licensed, high-rated rental providers.",
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
    title: "Fast-Track Service",
    description: "Premium members skip the wait at the counter and go!",
  },
];

const TripPerks = () => {
  return (
    <Card
      title={<Title level={4}>Why Book With One Sky Quest?</Title>}
      bordered={false}
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[16, 24]}>
        {perks.map((perk, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {perk.icon}
              <div>
                <Text strong>{perk.title}</Text>
                <br />
                <Text type="secondary">{perk.description}</Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default TripPerks;
