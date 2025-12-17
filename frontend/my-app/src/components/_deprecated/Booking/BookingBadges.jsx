import React from "react";
import { Card, Row, Col, Tooltip, Tag } from "antd";
import {
  CrownOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  FireOutlined,
  ThunderboltOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const badgeData = [
  {
    title: "🌟 Premium Member",
    description: "Exclusive discounts, early access, and loyalty perks.",
    icon: <CrownOutlined style={{ color: "#faad14", fontSize: 24 }} />,
    color: "gold",
  },
  {
    title: "⚡ Fast Booker",
    description: "Booked in under 2 minutes? You’re lightning quick.",
    icon: <ThunderboltOutlined style={{ color: "#722ed1", fontSize: 24 }} />,
    color: "purple",
  },
  {
    title: "🌱 Eco Traveler",
    description: "Frequently selects hybrid or electric vehicles.",
    icon: <EnvironmentOutlined style={{ color: "#52c41a", fontSize: 24 }} />,
    color: "green",
  },
  {
    title: "🔥 Last-Minute Hero",
    description: "Booked within 3 hours of travel? You made it happen.",
    icon: <FireOutlined style={{ color: "#ff4d4f", fontSize: 24 }} />,
    color: "red",
  },
  {
    title: "🚀 XP Pro",
    description: "Reached over 10,000 XP. You’re soaring!",
    icon: <RocketOutlined style={{ color: "#1890ff", fontSize: 24 }} />,
    color: "blue",
  },
  {
    title: "💖 Community Favorite",
    description: "Your profile has lots of views and trip saves.",
    icon: <HeartOutlined style={{ color: "#eb2f96", fontSize: 24 }} />,
    color: "magenta",
  },
];

const BookingBadges = () => {
  return (
    <Card
      title="🏅 Your OSQ Badges"
      bordered={false}
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[16, 24]}>
        {badgeData.map((badge, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Tooltip title={badge.description}>
              <Tag
                icon={badge.icon}
                color={badge.color}
                style={{
                  fontSize: 16,
                  padding: "6px 12px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {badge.title}
              </Tag>
            </Tooltip>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default BookingBadges;
