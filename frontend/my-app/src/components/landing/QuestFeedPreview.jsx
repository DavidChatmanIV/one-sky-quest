import React from "react";
import { Card, Typography, List, Avatar, Button, Space } from "antd";

const { Text } = Typography;

export default function QuestFeedCard({ onOpenFeed }) {
  const items = [
    {
      id: 1,
      user: "Cara",
      ago: "2h",
      text: "Visited Chiang Mai—street food and temples!",
    },
    {
      id: 2,
      user: "Leo",
      ago: "5h",
      text: "Booked Tokyo for Feb—who’s going?",
    },
  ];

  return (
    <Card
      className="osq-card quest-feed"
      bordered={false}
      bodyStyle={{ padding: 16 }}
    >
      <Space
        style={{ width: "100%", justifyContent: "space-between" }}
        align="center"
      >
        <Text strong>Quest Feed</Text>
        <Button type="link" onClick={onOpenFeed}>
          Open Feed →
        </Button>
      </Space>

      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(it) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{it.user[0]}</Avatar>}
              title={<Text strong>{it.user}</Text>}
              description={
                <Text type="secondary">
                  {it.text} • {it.ago} ago
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
