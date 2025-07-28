import React, { useState } from "react";
import ReplyThread from "./ReplyThread";
import EmojiReactions from "./EmojiReactions";
import { Input, Button } from "antd";

const FeedItem = ({ comment, commentId, handleReact, handleReply }) => {
  const [replyText, setReplyText] = useState("");

  const onReplySubmit = () => {
    if (replyText.trim()) {
      handleReply(commentId, replyText.trim());
      setReplyText("");
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
      {/* Comment Text */}
      <p className="text-sm text-gray-800 dark:text-gray-100">{comment.text}</p>

      {/* Emoji Reactions */}
      <div className="mt-2">
        <EmojiReactions
          counts={comment.reactions}
          onReact={(type) => handleReact(commentId, type)}
        />
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <ReplyThread replies={comment.replies} />
      )}

      {/* Reply Input */}
      <div className="mt-3 flex gap-2">
        <Input
          size="small"
          placeholder="Write a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="flex-1"
        />
        <Button type="primary" size="small" onClick={onReplySubmit}>
          Reply
        </Button>
      </div>
    </div>
  );
};

export default FeedItem;
