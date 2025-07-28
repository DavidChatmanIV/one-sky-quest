import React from "react";
import { Typography, Input, Select, Button, Card } from "antd";
import { RobotOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const TravelAssistant = () => {
  return (
    <section
      id="ai-trip-builder"
      className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-900"
    >
      <Card className="w-full max-w-xl p-6 shadow-lg">
        <Title level={4} className="text-center">
          ✨ Build Your Perfect Trip with AI
        </Title>
        <Paragraph className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Plan smarter with personalized recommendations — all tailored to your
          vibe, budget, and goals.
        </Paragraph>

        <form className="space-y-4">
          <Input placeholder="Where do you want to go?" size="large" />

          <div className="flex gap-4">
            <Select
              placeholder="Your Budget ($)"
              size="large"
              className="w-1/2"
            >
              <Option value="100">$100</Option>
              <Option value="500">$500</Option>
              <Option value="1000">$1000+</Option>
            </Select>

            <Select placeholder="Trip Vibe" size="large" className="w-1/2">
              <Option value="relaxing">🌴 Relaxing</Option>
              <Option value="adventurous">⛰️ Adventurous</Option>
              <Option value="romantic">💖 Romantic</Option>
              <Option value="cultural">🏛️ Cultural</Option>
            </Select>
          </div>

          <Button
            type="primary"
            icon={<RobotOutlined />}
            size="large"
            className="w-full"
          >
            Generate My Trip
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default TravelAssistant;
