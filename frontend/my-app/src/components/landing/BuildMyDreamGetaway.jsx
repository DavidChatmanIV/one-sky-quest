import React from "react";
import { Card, Typography, Button, Space } from "antd";
import { RocketOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/** Build My Dream Getaway
 *  Clear entrypoint to your AI Trip Builder.
 *  Distinct from AISuggestsCard (which shows a recommendation).
 */
export default function BuildMyDreamGetaway({ onOpen }) {
  return (
    <Card
      className="osq-card dream-getaway-card"
      bordered={false}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Space size={8} align="center">
          <RocketOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Build My Dream Getaway
          </Title>
        </Space>
        <Text type="secondary">
          Let AI design your perfect escape—tailored to your vibe, budget, and
          dates.
        </Text>
        <Button type="primary" onClick={onOpen}>
          Start Building
        </Button>
      </Space>
    </Card>
  );
}
