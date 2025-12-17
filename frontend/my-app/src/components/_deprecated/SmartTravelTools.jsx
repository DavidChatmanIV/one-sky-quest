import React from "react";
import { Typography, Row, Col, Card } from "antd";
import {
  BellOutlined,
  ThunderboltOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const tools = [
  {
    icon: <BellOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
    title: "Real-Time Alerts & Updates",
    description: "Stay updated on flight delays, weather changes, and more.",
  },
  {
    icon: (
      <ThunderboltOutlined style={{ fontSize: "32px", color: "#faad14" }} />
    ),
    title: "Offline Mode",
    description: "Access your trip details even without internet connection.",
  },
  {
    icon: (
      <CloudDownloadOutlined style={{ fontSize: "32px", color: "#52c41a" }} />
    ),
    title: "Smart Sync",
    description: "Sync across devices so your plans are always up-to-date.",
  },
];

const SmartTravelTools = () => (
  <section className="bg-white py-12 px-6 text-center">
    <Title level={3}>🧠 Smart Travel Tools</Title>
    <Paragraph>Tools to make your travel smoother and smarter.</Paragraph>

    <Row gutter={[16, 16]} justify="center">
      {tools.map((tool, index) => (
        <Col key={index} xs={24} sm={12} md={8}>
          <Card hoverable>
            <div className="text-3xl mb-2">{tool.icon}</div>
            <Title level={4}>{tool.title}</Title>
            <Paragraph>{tool.description}</Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
);

export default SmartTravelTools;
