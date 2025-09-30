import React from "react";
import { Typography, Card, Space, Tag } from "antd";
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const alerts = [
  {
    type: "warning",
    title: "Weather Delay in NYC",
    description: "Heavy snowstorms are causing flight delays out of JFK today.",
    icon: <ExclamationCircleOutlined />,
    color: "gold",
    bg: "#fff8e6",
  },
  {
    type: "info",
    title: "Visa Update – Japan",
    description:
      "Japan now allows 90-day stays for U.S. travelers without a visa.",
    icon: <InfoCircleOutlined />,
    color: "blue",
    bg: "#f0f7ff",
  },
  {
    type: "error",
    title: "Airport Strike – Paris",
    description:
      "Charles de Gaulle Airport staff on strike. Expect major delays.",
    icon: <CloseCircleOutlined />,
    color: "red",
    bg: "#fff1f0",
  },
];

const RealTimeAlerts = () => {
  return (
    <section style={{ padding: "40px 20px", background: "#fafafa" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          📢 Real-Time Travel Alerts
        </Title>
        <Paragraph type="secondary">
          Stay informed with updates that impact your travel.
        </Paragraph>
      </div>

      <Space
        direction="vertical"
        size="large"
        style={{ display: "flex", maxWidth: 800, margin: "0 auto" }}
      >
        {alerts.map((alert, idx) => (
          <Card
            key={idx}
            style={{
              background: alert.bg,
              borderRadius: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
            }}
            hoverable
            onClick={() => console.log(`Clicked alert: ${alert.title}`)}
          >
            <Space align="start" size="middle">
              <Tag
                color={alert.color}
                style={{
                  fontSize: 16,
                  padding: "4px 10px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {alert.icon}
              </Tag>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {alert.title}
                </Title>
                <Paragraph style={{ margin: 0 }} type="secondary">
                  {alert.description}
                </Paragraph>
              </div>
            </Space>
          </Card>
        ))}
      </Space>
    </section>
  );
};

export default RealTimeAlerts;
