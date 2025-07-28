import React, { useState } from "react";
import { Input, Button, Space } from "antd";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <Space className="w-full" style={{ display: "flex" }}>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={handleSend}
        placeholder="Type a message..."
      />
      <Button type="primary" onClick={handleSend}>
        Send
      </Button>
    </Space>
  );
};

export default MessageInput;
