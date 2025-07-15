import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Input,
  Layout,
  Row,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  MessageOutlined,
  RetweetOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Header, Content } = Layout;

const samplePosts = [
  {
    id: 1,
    user: {
      username: "davidchatman",
      avatar: "/images/avatar-default.jpg",
      bio: "Full-stack dev & world explorer",
    },
    location: "Tokyo, Japan",
    time: "2h",
    text: "Just had the best ramen ever 🍜✨",
    tags: ["#Tokyo", "#FoodieFinds"],
  },
  {
    id: 2,
    user: {
      username: "skybound",
      avatar: "/images/avatar-default.jpg",
      bio: "Chasing sunsets and skyviews",
    },
    location: "Paris, France",
    time: "3h",
    text: "Clouds were unreal today 🌥️",
    tags: ["#SkySnaps", "#HiddenGems"],
  },
];

const QuestFeed = () => {
  const [tagCounts, setTagCounts] = useState({});
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const tagMap = {};
    samplePosts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    setTagCounts(tagMap);
  }, []);

  const filteredPosts = activeTag
    ? samplePosts.filter((post) => post.tags.includes(activeTag))
    : samplePosts;

  return (
    <Layout className="bg-gray-100 min-h-screen">
      <Header className="flex justify-between items-center bg-white px-6 shadow-sm">
        <Title level={3} className="!mb-0">
          One Sky Quest
        </Title>
        <div className="flex gap-6 text-base">
          <a href="/index.html">Home</a>
          <a href="/dm.html">DMs</a>
          <a href="/profile.html">Profile</a>
        </div>
      </Header>

      <Content className="px-4 md:px-24 py-8">
        {/* Post Creator */}
        <Card className="mb-6 max-w-2xl mx-auto">
          <Input.TextArea placeholder="Share your travel update..." rows={4} />
          <Button type="primary" className="mt-2">
            Post
          </Button>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            {filteredPosts.map((post) => (
              <Card key={post.id} className="mb-4 shadow-md">
                <div className="flex items-center mb-3 gap-3">
                  <Tooltip title={post.user.bio}>
                    <Avatar
                      src={post.user.avatar}
                      size={48}
                      alt={post.user.username}
                    />
                  </Tooltip>
                  <div>
                    <Text strong>@{post.user.username}</Text>
                    <div className="text-xs text-gray-500">
                      {post.time} · {post.location}
                    </div>
                  </div>
                </div>
                <Paragraph>{post.text}</Paragraph>
                <div className="flex gap-4 mt-3 text-gray-600 text-sm">
                  <span>
                    <MessageOutlined /> Comment
                  </span>
                  <span>
                    <RetweetOutlined /> ReQuest
                  </span>
                  <span>
                    <StarOutlined /> Quest Point
                  </span>
                </div>
                <div className="mt-2">
                  {post.tags.map((tag) => (
                    <Tag
                      key={tag}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </Card>
            ))}
          </Col>

          <Col xs={24} md={8}>
            <Card>
              <Title level={5}>🌍 Trending Tags</Title>
              {Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([tag, count]) => (
                  <Tag
                    key={tag}
                    color="geekblue"
                    className="cursor-pointer mb-2"
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag} ({count})
                  </Tag>
                ))}
              {activeTag && (
                <Button type="link" onClick={() => setActiveTag(null)}>
                  Clear Filter
                </Button>
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default QuestFeed;
