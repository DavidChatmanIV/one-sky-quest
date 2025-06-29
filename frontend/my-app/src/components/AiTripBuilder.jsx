import React from "react";
import { Typography, Input, Button, Select, Space, Card } from "antd";
import { RobotOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const AiTripBuilder = () => {
  return (
    <section className="bg-white py-16 text-center">
      <Card
        style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}
        bordered={false}
      >
        <Title level={3}>✨ Build Your Perfect Trip with AI</Title>
        <Paragraph>
          Plan smarter with personalized recommendations — all tailored to your
          vibe, budget, and goals.
        </Paragraph>

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Input placeholder="Where do you want to go?" />

          <Space wrap style={{ width: "100%", justifyContent: "center" }}>
            <Select placeholder="Your Budget ($)" style={{ width: 160 }}>
              <Option value="low">Low</Option>
              <Option value="mid">Mid</Option>
              <Option value="high">High</Option>
            </Select>

            <Select placeholder="Trip Vibe" style={{ width: 160 }}>
              <Option value="relaxing">🌴 Relaxing</Option>
              <Option value="adventurous">⛰️ Adventurous</Option>
              <Option value="romantic">💖 Romantic</Option>
              <Option value="cultural">🏛️ Cultural</Option>
            </Select>
          </Space>

          <Button type="primary" icon={<RobotOutlined />}>
            Generate My Trip
          </Button>
        </Space>
      </Card>
    </section>
  );
};

export default AiTripBuilder;
