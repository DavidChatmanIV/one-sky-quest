import React, { useState } from "react";
import {
  Modal,
  Input,
  Button,
  List,
  Upload,
  message as AntMessage,
  Tooltip,
} from "antd";
import {
  SmileOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const ChatModal = ({ visible, onClose, user }) => {
  const [messages, setMessages] = useState([
    { sender: user.name, text: "Hey! 👋" },
  ]);
  const [newMsg, setNewMsg] = useState("");

  const handleSend = () => {
    if (newMsg.trim()) {
      setMessages([...messages, { sender: "You", text: newMsg }]);
      setNewMsg("");
    }
  };

  const handleDelete = (index) => {
    const updated = [...messages];
    updated.splice(index, 1);
    setMessages(updated);
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setMessages([
        ...messages,
        {
          sender: "You",
          text: <img src={imageUrl} width="100" alt="uploaded" />,
        },
      ]);
    }
  };

  return (
    <Modal
      title={`Chat with ${user.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        dataSource={messages}
        renderItem={(msg, index) => (
          <List.Item
            actions={[
              <Tooltip title="Delete" key="delete">
                <DeleteOutlined onClick={() => handleDelete(index)} />
              </Tooltip>,
            ]}
          >
            <div>
              <strong>{msg.sender}: </strong> {msg.text}
            </div>
          </List.Item>
        )}
        style={{ maxHeight: 300, overflowY: "auto", marginBottom: "10px" }}
      />
      <Input.TextArea
        rows={2}
        placeholder="Type a message..."
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        onPressEnter={handleSend}
      />
      <div className="flex justify-between mt-2">
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleImageUpload}
        >
          <Button icon={<UploadOutlined />}>Image</Button>
        </Upload>
        <Button
          icon={<SmileOutlined />}
          onClick={() => AntMessage.info("Emoji picker coming soon!")}
        >
          Emoji
        </Button>
        <Button type="primary" onClick={handleSend}>
          Send
        </Button>
      </div>
    </Modal>
  );
};

export default ChatModal;
