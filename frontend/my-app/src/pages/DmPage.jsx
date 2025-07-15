import React, { useState } from "react";
import { Layout, Typography, Input, Button, List, Avatar } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title } = Typography;

const DmPage = () => {
  const [messages, setMessages] = useState([
    { sender: "You", content: "Hey!" },
    { sender: "Ava", content: "Hi! How’s it going?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "You", content: input }]);
    setInput("");
  };

  return (
    <Layout className="min-h-screen">
      <Sider width={250} className="bg-white p-4 shadow-md">
        <Title level={4}>💬 Chats</Title>
        <List
          itemLayout="horizontal"
          dataSource={[{ name: "Ava" }, { name: "Liam" }]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.name[0]}</Avatar>}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Sider>
      <Layout>
        <Content className="p-6 bg-gray-50">
          <Title level={4}>Conversation with Ava</Title>
          <div className="h-96 overflow-y-auto mb-4 border rounded p-3 bg-white">
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.sender}:</strong> {msg.content}
              </p>
            ))}
          </div>
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Type your message..."
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
              Send
            </Button>
          </Input.Group>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DmPage;
