import React from "react";
import { Card, Avatar, Typography, Button } from "antd";
import { MessageOutlined, HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const mockPosts = [
  {
    id: 1,
    username: "WanderLust_99",
    avatar: "/images/avatar1.png",
    destination: "Bali, Indonesia",
    content: "Just returned from paradise 🌴☀️ You have to visit Ubud!",
    likes: 123,
    comments: 12,
  },
  {
    id: 2,
    username: "NomadicNina",
    avatar: "/images/avatar2.png",
    destination: "Rome, Italy",
    content: "Best pizza of my life! 🍕 Don’t skip Trastevere.",
    likes: 97,
    comments: 8,
  },
];

const QuestFeed = () => {
  const navigate = useNavigate();

  const handleDMClick = () => {
    navigate("/dm"); // ✅ Programmatic navigation
  };

  return (
    <section className="py-10 px-4 bg-gray-50" id="quest-feed">
      <Title level={2} className="text-center mb-6">
        🌍 Quest Feed
      </Title>
      <Paragraph className="text-center text-gray-600 mb-8">
        See what fellow travelers are sharing from their adventures!
      </Paragraph>

      <div className="max-w-3xl mx-auto space-y-6">
        {mockPosts.map((post) => (
          <Card key={post.id} bordered hoverable>
            <Card.Meta
              avatar={<Avatar src={post.avatar} />}
              title={
                <span className="font-semibold">
                  @{post.username} •{" "}
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
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default QuestFeed;
