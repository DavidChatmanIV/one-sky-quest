import React, { useState } from "react";
import { Card, Avatar, Typography, Button, Row, Col, Tag, Tooltip } from "antd";
import {
  MessageOutlined,
  HeartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import TrendingTopics from "../components/questfeed/TrendingTopics";

const { Title, Paragraph } = Typography;

const mockPosts = [
  {
    id: 1,
    username: "Jayden",
    avatar: "/images/avatar1.png",
    destination: "Tokyo, Japan",
    content: "Just landed in Tokyo 🛫 Can't wait to explore!",
    likes: 3,
    comments: 2,
    tags: ["#Tokyo", "#Japan", "#AdventureXP"],
  },
  {
    id: 2,
    username: "Zara",
    avatar: "/images/avatar2.png",
    destination: "Santorini, Greece",
    content: "Sunsets in Santorini never get old 🌅",
    likes: 7,
    comments: 0,
    tags: ["#Santorini", "#Sunsets", "#HiddenGem"],
  },
];

const QuestFeed = () => {
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [activeTagFilter, setActiveTagFilter] = useState(null);

  const handleDMClick = () => navigate("/dm");

  const handleEmojiSelect = (emoji) => {
    alert(`You selected: ${emoji.native}`);
    setShowEmojiPicker(null);
  };

  const filteredPosts = activeTagFilter
    ? mockPosts.filter((post) => post.tags?.includes(activeTagFilter))
    : mockPosts;

  return (
    <section className="py-10 px-4 bg-gray-50 min-h-screen" id="quest-feed">
      <Title level={2} className="text-center mb-6">
        🌍 Quest Feed
      </Title>
      <Paragraph className="text-center text-gray-600 mb-8">
        Share your journey. Connect with travelers. Earn XP for engaging. ✈️
      </Paragraph>

      <Row gutter={[24, 24]} align="start">
        {/* 🔹 Main Feed Column */}
        <Col xs={24} md={16}>
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} bordered hoverable>
                <Card.Meta
                  avatar={<Avatar src={post.avatar} />}
                  title={
                    <span className="font-semibold">
                      {post.username} •{" "}
                      <span className="text-gray-500">{post.destination}</span>
                    </span>
                  }
                  description={
                    <Paragraph className="mt-2 mb-0">{post.content}</Paragraph>
                  }
                />

                <div className="flex justify-between mt-4 px-2">
                  <Button type="text" icon={<HeartOutlined />}>
                    {post.likes}
                  </Button>
                  <Button
                    type="text"
                    icon={<MessageOutlined />}
                    onClick={handleDMClick}
                  >
                    {post.comments}
                  </Button>
                  <Button
                    type="text"
                    icon={<SmileOutlined />}
                    onClick={() =>
                      setShowEmojiPicker(
                        showEmojiPicker === post.id ? null : post.id
                      )
                    }
                  />
                </div>

                {showEmojiPicker === post.id && (
                  <div className="mt-2">
                    <Picker onSelect={handleEmojiSelect} />
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <Tag
                      key={tag}
                      color="blue"
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveTagFilter(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </Card>
            ))}

            {activeTagFilter && (
              <div className="text-center mt-6">
                <Button onClick={() => setActiveTagFilter(null)}>
                  Clear Filter ({activeTagFilter})
                </Button>
              </div>
            )}
          </div>
        </Col>

        {/* 🔹 Trending Sidebar Column */}
        <Col xs={24} md={8}>
          <div
            style={{
              backgroundColor: "#f0f9ff",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px dashed #91d5ff", // ⬅️ Dev-only outline
            }}
          >
            <TrendingTopics onTagSelect={setActiveTagFilter} />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default QuestFeed;
