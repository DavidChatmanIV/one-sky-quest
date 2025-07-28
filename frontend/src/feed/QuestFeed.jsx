import React, { useState } from "react";
import { Typography, Divider } from "antd";
import NewPostForm from "./components/NewPostForm";
import FeedItem from "./components/FeedItem";

const { Title } = Typography;

const QuestFeed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "David",
      content: "Just landed in Tokyo! 🇯🇵 Any must-visit spots?",
      reactions: { like: 4, fire: 2 },
      replies: ["Check out Shibuya crossing!", "Don't skip the ramen spots 🍜"],
    },
  ]);

  const handleNewPost = (text) => {
    const newPost = {
      id: Date.now(),
      author: "David",
      content: text,
      reactions: {},
      replies: [],
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Title level={2}>🌍 Quest Feed</Title>
      <NewPostForm onPost={handleNewPost} />
      <Divider />
      {posts.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default QuestFeed;
