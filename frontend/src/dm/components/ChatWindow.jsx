import React, { useState } from "react";
import { Typography, Divider } from "antd";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const { Title } = Typography;

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([
    { from: "them", text: "Hey! Ready for the group trip?" },
    { from: "me", text: "Always! ✈️" },
  ]);

  if (!conversation) {
    return <div className="p-6">Select a conversation to begin chatting.</div>;
  }

  const handleSend = (text) => {
    setMessages([...messages, { from: "me", text }]);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <Title level={4}>{conversation.name}</Title>
      <Divider />
      <div className="flex-grow overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.text} from={msg.from} />
        ))}
      </div>
      <Divider />
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
