import React, { useState } from "react";
import { Input, Button, Avatar, Space, Tooltip, message } from "antd";
import {
  SmileOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";

export default function FeedComposer({ onPosted }) {
  const [value, setValue] = useState("");
  const [posting, setPosting] = useState(false);

  async function handlePost() {
    if (!value.trim()) return;
    setPosting(true);
    // TODO: replace with API call
    const post = {
      id: String(Date.now()),
      user: { name: "David", handle: "@onesky.david", verified: true },
      time: "now",
      location: "—",
      text: value,
      tags: [],
      xp: 25,
      likes: 0,
    };
    onPosted?.(post);
    setValue("");
    setPosting(false);
    message.success("Shared to your Quest Feed!");
  }

  return (
    <div className="qf-composer qf-card">
      <Avatar size={40} className="qf-avatar">
        D
      </Avatar>
      <Input.TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoSize={{ minRows: 2, maxRows: 5 }}
        placeholder="Where are you off to? ✈️"
        className="qf-input"
      />
      <div className="qf-composer-actions">
        <Space size={10} wrap>
          <Tooltip title="Emoji">
            <SmileOutlined />
          </Tooltip>
          <Tooltip title="Add photo">
            <PictureOutlined />
          </Tooltip>
          <Tooltip title="Add location">
            <EnvironmentOutlined />
          </Tooltip>
        </Space>
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={posting}
          onClick={handlePost}
          className="qf-cta"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
