import React from "react";
import { Card, Space, Typography, Avatar } from "antd";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function QuestFeedPreview({
  item = {
    name: "Cara",
    text: "visited Chiang Mai recently. Incredible street food and temples!",
    time: "2h ago",
    avatar: undefined,
  },
}) {
  return (
    <Card
      variant="borderless"
      className="osq-card"
      styles={{ body: { padding: 16 } }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={8}>
        <Text type="secondary">Quest Feed</Text>
        <Space align="start">
          <Avatar src={item.avatar} />
          <div>
            <Text strong>{item.name}</Text>
            <div>
              <Text>
                {item.text}{" "}
                <span role="img" aria-label="pin">
                  📌
                </span>
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {item.time}
            </Text>
          </div>
        </Space>
        <Link to="/feed">
          Open Feed <ArrowRightOutlined />
        </Link>
      </Space>
    </Card>
  );
}
