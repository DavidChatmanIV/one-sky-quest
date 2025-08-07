import React, { useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Row,
  Col,
  Tag,
  Tooltip,
  Tabs,
  Affix,
} from "antd";
import {
  MessageOutlined,
  HeartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import "../styles/QuestFeed.css";
import TrendingTopics from "../components/questfeed/TrendingTopics";

const { Title, Paragraph } = Typography;

const QuestFeed = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("forYou");
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [activeTagFilter, setActiveTagFilter] = useState(null);

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

  const filteredPosts = activeTagFilter
    ? mockPosts.filter((p) => p.tags.includes(activeTagFilter))
    : mockPosts;

  const handleDMClick = () => navigate("/dm");

  const renderFeed = (list) => (
    <div className="space-y-6">
      {list.map((post) => (
        <Card key={post.id} className="feed-card" hoverable>
          <Card.Meta
            avatar={<Avatar src={post.avatar} />}
            title={
              <span className="username">
                {post.username} •{" "}
                <span className="text-gray-500">{post.destination}</span>
              </span>
            }
            description={
              <Paragraph className="feed-content">{post.content}</Paragraph>
            }
          />
          <div className="feed-meta flex justify-between mt-4 px-2">
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
                setShowEmojiPicker(showEmojiPicker === post.id ? null : post.id)
              }
            />
          </div>

          {showEmojiPicker === post.id && (
            <div className="mt-2">
              <Picker
                onSelect={(emoji) => {
                  alert(`Selected: ${emoji.native}`);
                  setShowEmojiPicker(null);
                }}
              />
            </div>
          )}

          <div className="reactions mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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
    </div>
  );

  return (
    <section className="quest-feed">
      <Title level={2} className="text-center mb-2">
        🌍 Quest Feed
      </Title>
      <Paragraph className="text-center text-gray-500 mb-6">
        Discover. Post. React. Connect with global travelers ✈️
      </Paragraph>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div>
          {/* Composer + Tabs */}
          <Affix offsetTop={12}>
            <div>{/* 🚧 Composer Placeholder */}</div>
          </Affix>

          <Tabs activeKey={activeTab} onChange={setActiveTab} animated>
            <Tabs.TabPane key="forYou" tab="For You">
              {renderFeed(filteredPosts)}
            </Tabs.TabPane>
            <Tabs.TabPane key="following" tab="Following">
              {renderFeed(filteredPosts)}
            </Tabs.TabPane>
            <Tabs.TabPane key="trending" tab="Trending">
              {renderFeed(filteredPosts)}
            </Tabs.TabPane>
            <Tabs.TabPane key="news" tab="News">
              <Paragraph>
                📰 Coming soon: Travel news from around the world!
              </Paragraph>
            </Tabs.TabPane>
            <Tabs.TabPane key="popular" tab="Popular">
              {renderFeed(filteredPosts)}
            </Tabs.TabPane>
          </Tabs>
        </div>

        {/* 🔹 Sidebar */}
        <div className="hidden lg:block">
          <TrendingTopics onTagSelect={setActiveTagFilter} />
        </div>
      </div>
    </section>
  );
};

export default QuestFeed;
