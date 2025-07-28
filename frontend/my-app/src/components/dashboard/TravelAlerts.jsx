import React, { useEffect, useState } from "react";
import { Alert, List, Typography, Spin } from "antd";
import {
  ThunderboltOutlined,
  CloudOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const TravelAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Later: Fetch live alerts from backend or API
    const timeout = setTimeout(() => {
      setAlerts([
        {
          id: 1,
          type: "Weather",
          message: "Heavy rain expected in Bangkok. Pack light rain gear.",
          icon: <CloudOutlined />,
        },
        {
          id: 2,
          type: "Security",
          message:
            "Be cautious near popular areas in Barcelona due to recent pickpocketing.",
          icon: <WarningOutlined />,
        },
        {
          id: 3,
          type: "Smart Tip",
          message:
            "Traveling to Japan? JR Rail Pass is now only available online before arrival.",
          icon: <ThunderboltOutlined />,
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <Title level={4}>🚨 Travel Alerts & Tips</Title>

      {loading ? (
        <Spin />
      ) : alerts.length === 0 ? (
        <Text type="secondary">
          No alerts at this time. You're good to go! ✅
        </Text>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={alerts}
          renderItem={(alert) => (
            <List.Item key={alert.id}>
              <Alert
                message={alert.message}
                type={
                  alert.type === "Weather"
                    ? "info"
                    : alert.type === "Security"
                    ? "warning"
                    : "success"
                }
                icon={alert.icon}
                showIcon
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default TravelAlerts;
