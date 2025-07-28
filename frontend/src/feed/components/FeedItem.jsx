import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
import ReactionBar from "./ReactionBar";
import ReplyThread from "./ReplyThread";

const { Paragraph, Text } = Typography;

const FeedItem = ({ post }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <Card className="mb-4" title={<Text strong>{post.author}</Text>}>
      <Paragraph>{post.content}</Paragraph>
      <ReactionBar reactions={post.reactions} />
      <Button
        size="small"
        onClick={() => setShowReplies(!showReplies)}
        className="mt-2"
      >
        {showReplies ? "Hide Replies" : "Show Replies"}
      </Button>
      {showReplies && <ReplyThread replies={post.replies} />}
    </Card>
  );
};

export default FeedItem;
