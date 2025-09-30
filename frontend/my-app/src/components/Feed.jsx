import React from "react";
import { Card, Avatar, Typography, Space, Button } from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

// Dummy feed data (replace with props or API later)
const posts = [
  {
    id: 1,
    user: "Ava Travels",
    avatar: null,
    content:
      "Just booked a trip to Tokyo ✈️ Can’t wait to explore Shibuya and eat ramen!",
    date: "2h ago",
  },
  {
    id: 2,
    user: "Sky Wanderer",
    avatar: null,
    content: "Weekend getaway to Miami 🌴🔥 Sun, sand, and ocean breeze!",
    date: "5h ago",
  },
  {
    id: 3,
    user: "Nomad Joe",
    avatar: null,
    content: "Paris in the fall is magical 🍂🇫🇷 Louvre + croissants all day!",
    date: "1d ago",
  },
];

export default function Feed() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px" }}>
      <h2 style={{ color: "#fff", marginBottom: "16px" }}>Quest Feed</h2>

      {posts.map((post) => (
        <Card
          key={post.id}
          className="osq-feed-card"
          style={{ marginBottom: "16px", borderRadius: "12px" }}
        >
          <Space align="start" style={{ width: "100%" }}>
            <Avatar size="large" icon={<UserOutlined />} src={post.avatar} />
            <div style={{ flex: 1 }}>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Text strong>{post.user}</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {post.date}
                </Text>
                <Text>{post.content}</Text>
              </Space>

              {/* Actions */}
              <Space size="large" style={{ marginTop: "8px" }}>
                <Button type="text" icon={<LikeOutlined />} size="small">
                  Like
                </Button>
                <Button type="text" icon={<MessageOutlined />} size="small">
                  Comment
                </Button>
                <Button type="text" icon={<ShareAltOutlined />} size="small">
                  Share
                </Button>
              </Space>
            </div>
          </Space>
        </Card>
      ))}
    </div>
  );
}
