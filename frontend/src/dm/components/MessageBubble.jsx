import React from "react";
import { Card } from "antd";

const MessageBubble = ({ text, from }) => {
  const isMine = from === "me";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <Card
        style={{
          maxWidth: "70%",
          background: isMine ? "#e6f7ff" : "#fafafa",
        }}
      >
        {text}
      </Card>
    </div>
  );
};

export default MessageBubble;
