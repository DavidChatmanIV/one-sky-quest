import React, { useState } from "react";
import {
  Layout,
  Typography,
  Input,
  Button,
  Avatar,
  Space,
  Tooltip,
} from "antd";
import {
  SmileOutlined,
  SendOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const { Content, Sider } = Layout;
const { Title } = Typography;

const mockConversations = [
  { id: 1, name: "Jayden", avatar: "/images/users/jayden.jpg" },
  { id: 2, name: "Zara", avatar: "/images/users/zara.jpg" },
];

const DmPage = () => {
  const [selectedUser, setSelectedUser] = useState(mockConversations[0]);
  const [messages, setMessages] = useState([
    { sender: "Jayden", text: "Hey David, where are you off to next?" },
    { sender: "David", text: "Thinking about Barcelona 🇪🇸" },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    setMessages([...messages, { sender: "David", text: inputMsg }]);
    setInputMsg("");
    setShowEmojiPicker(false);
  };

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider width={250} className="bg-white p-4 border-r">
        <Title level={4}>💬 Direct Messages</Title>
        <div className="space-y-4 mt-4">
          {mockConversations.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedUser.id === user.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <Avatar src={user.avatar} icon={<UserOutlined />} />
              <span className="font-medium">{user.name}</span>
            </div>
          ))}
        </div>
      </Sider>

      {/* Chat Area */}
      <Layout>
        <Content className="bg-gray-50 p-6 flex flex-col justify-between">
          <div className="mb-4">
            <Title level={4}>🧑‍💬 Chatting with {selectedUser.name}</Title>

            {/* Chat Messages */}
            <div className="space-y-3 mt-4 max-h-[65vh] overflow-y-auto pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "David" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      msg.sender === "David"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="relative">
            <Input.TextArea
              rows={2}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type a message..."
              className="rounded-lg"
            />
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Tooltip title="Emoji">
                <Button
                  icon={<SmileOutlined />}
                  shape="circle"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                />
              </Tooltip>
              <Tooltip title="Send">
                <Button
                  icon={<SendOutlined />}
                  shape="circle"
                  type="primary"
                  onClick={handleSend}
                  disabled={!inputMsg.trim()}
                />
              </Tooltip>
            </div>

            {/* ✅ Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-3 z-50 max-w-xs rounded-xl border border-gray-300 shadow-md">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) => {
                    setInputMsg((prev) => prev + emoji.native);
                    setShowEmojiPicker(false);
                  }}
                  theme="light"
                  emojiSize={20}
                  maxFrequentRows={2}
                  previewPosition="none"
                />
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DmPage;
