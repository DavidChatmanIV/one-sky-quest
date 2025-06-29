import React from "react";
import { Typography, Avatar, Space, Button } from "antd";

const { Title, Paragraph } = Typography;

const WelcomeBack = ({
  name = "Traveler",
  avatar = "/images/default-avatar.png",
}) => {
  return (
    <section
      className="py-10 px-4 text-center"
      style={{ backgroundColor: "#e6f7ff" }}
    >
      <Space direction="vertical" size="middle" align="center">
        <Avatar src={avatar} size={100} />
        <Title level={2}>👋 Welcome Back, {name}!</Title>
        <Paragraph>
          Ready to pick up where you left off? Let’s plan your next big journey.
        </Paragraph>
        <Button type="primary" size="large">
          View Saved Trips
        </Button>
      </Space>
    </section>
  );
};

export default WelcomeBack;
