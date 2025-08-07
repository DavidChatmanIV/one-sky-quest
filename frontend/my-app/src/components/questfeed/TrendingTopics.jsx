import React, { useState, useEffect } from "react";
import { Card, List, Tag, Tooltip, Button, message } from "antd";
import {
  FireOutlined,
  RiseOutlined,
  PlusOutlined,
  CheckOutlined,
} from "@ant-design/icons";

// Sample data (you can later replace this with real API data)
const trendingTags = [
  { tag: "#Tokyo", posts: 124, xpBoost: true },
  { tag: "#HiddenGem", posts: 90, xpBoost: true },
  { tag: "#Sunsets", posts: 75 },
  { tag: "#CulturalTrips", posts: 66 },
  { tag: "#AdventureXP", posts: 59, xpBoost: true },
];

const TrendingTopics = ({ onTagSelect }) => {
  const [followedTags, setFollowedTags] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("followedTags")) || [];
    setFollowedTags(stored);
  }, []);

  const handleFollow = (tag) => {
    const updated = [...new Set([...followedTags, tag])];
    setFollowedTags(updated);
    localStorage.setItem("followedTags", JSON.stringify(updated));
    message.success(`You're now following ${tag}`);
  };

  const isFollowed = (tag) => followedTags.includes(tag);

  return (
    <Card
      title={
        <span>
          <FireOutlined /> Trending Now
        </span>
      }
      style={{
        marginTop: 24,
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <List
        size="small"
        dataSource={trendingTags}
        renderItem={(item) => (
          <List.Item
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Tag
              color="geekblue"
              style={{ cursor: "pointer", fontSize: 14 }}
              onClick={() => onTagSelect(item.tag)}
            >
              {item.tag}
            </Tag>

            {item.xpBoost && (
              <Tooltip title="XP Boost tag!">
                <RiseOutlined style={{ color: "#faad14" }} />
              </Tooltip>
            )}

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "#888" }}>
                {item.posts} posts
              </span>

              {isFollowed(item.tag) ? (
                <Tooltip title="Following">
                  <CheckOutlined style={{ color: "green" }} />
                </Tooltip>
              ) : (
                <Tooltip title="Follow tag for alerts">
                  <Button
                    size="small"
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => handleFollow(item.tag)}
                  />
                </Tooltip>
              )}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TrendingTopics;
