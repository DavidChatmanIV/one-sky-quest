import React, { useState } from "react";
import { Avatar, Card, Input, Button, Typography, Tooltip, Space } from "antd";
import {
  SmileOutlined,
  MessageOutlined,
  SendOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const { Title, Text, Paragraph } = Typography;

const samplePosts = [
  {
    id: 1,
    user: "Jayden",
    avatar: "/images/users/jayden.jpg",
    content: "Just landed in Tokyo ✈️ Can't wait to explore!",
    reactions: 3,
    comments: ["Enjoy it!", "Take pics for us! 📸"],
  },
  {
    id: 2,
    user: "Zara",
    avatar: "/images/users/zara.jpg",
    content: "Sunsets in Santorini never get old 🌅",
    reactions: 7,
    comments: [],
  },
];

const QuestFeed = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [postContent, setPostContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handlePost = () => {
    if (!postContent.trim()) return;
    const newEntry = {
      id: posts.length + 1,
      user: "David",
      avatar: "/images/users/david.jpg",
      content: postContent,
      reactions: 0,
      comments: [],
    };
    setPosts([newEntry, ...posts]);
    setPostContent("");
    setShowEmojiPicker(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/images/questfeed-bg.png')" }}
    >
      <div className="max-w-3xl mx-auto backdrop-blur-md bg-white/80 p-6 rounded-xl shadow-xl">
        {/* 🔹 Navigation Links */}
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            <HomeOutlined className="mr-1" />
            Home
          </Link>
          <Link
            to="/profile"
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            <UserOutlined className="mr-1" />
            Profile
          </Link>
        </div>

        <Title level={2} className="text-center text-indigo-700 drop-shadow">
          🌐 Quest Feed
        </Title>
        <Paragraph className="text-center text-gray-600 mb-4">
          Share your journey. Connect with travelers. Earn XP for engaging. 🧭
        </Paragraph>

        {/* 🔹 Post Composer */}
        <Card className="mb-6">
          <Input.TextArea
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Where are you off to? ✍️"
            showCount
            maxLength={280}
          />
          <div className="mt-2 flex justify-between items-center">
            <Button
              icon={<SmileOutlined />}
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              Emoji
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handlePost}
              disabled={!postContent.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Post
            </Button>
          </div>

          {/* 🔹 Emoji Picker */}
          {showEmojiPicker && (
            <div className="mt-2 max-w-xs rounded-xl border border-gray-300 shadow-md">
              <Picker
                data={data}
                onEmojiSelect={(emoji) => {
                  setPostContent((prev) => prev + emoji.native);
                  setShowEmojiPicker(false); // Auto-close after selection
                }}
                theme="light"
                emojiSize={20}
                maxFrequentRows={2}
                previewPosition="none"
              />
            </div>
          )}
        </Card>

        {/* 🔹 Posts Feed */}
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {posts.map((post) => (
            <Card key={post.id} className="w-full shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Avatar src={post.avatar} />
                <Text strong>{post.user}</Text>
              </div>
              <Paragraph>{post.content}</Paragraph>

              <div className="flex items-center justify-between">
                <Space>
                  <Tooltip title="React">
                    <Button
                      shape="circle"
                      icon={<SmileOutlined />}
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="Comment">
                    <Button
                      shape="circle"
                      icon={<MessageOutlined />}
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="Likes">
                    <Text type="secondary">👍 {post.reactions}</Text>
                  </Tooltip>
                </Space>
                <Text type="secondary">{post.comments.length} comments</Text>
              </div>

              {post.comments.length > 0 && (
                <div className="mt-3 space-y-1">
                  {post.comments.map((comment, idx) => (
                    <Text key={idx} type="secondary" className="block">
                      💬 {comment}
                    </Text>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default QuestFeed;
