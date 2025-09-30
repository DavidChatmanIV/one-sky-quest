import React, { useState } from "react";
import {
  Card,
  Space,
  Avatar,
  Input,
  Upload,
  Button,
  Select,
  Tooltip,
  message,
} from "antd";
import {
  PictureOutlined,
  TagOutlined,
  SmileOutlined,
  SendOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const TAGS = [
  "Europe",
  "Asia",
  "City",
  "Beach",
  "Budget",
  "Foodies",
  "Weekend",
  "Wildlife",
  "Romance",
];

export default function Composer({ onPost }) {
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [posting, setPosting] = useState(false);

  const canPost = text.trim() || fileList.length;

  const handlePost = async () => {
    if (!canPost) return;
    try {
      setPosting(true);
      await new Promise((r) => setTimeout(r, 400));
      const file = fileList[0]?.originFileObj;
      const image = file ? URL.createObjectURL(file) : null;

      onPost({
        id: `p-${Date.now()}`,
        author: { name: "David", avatar: "/img/avatars/david.png" },
        time: "Just now",
        text: text.trim(),
        tags,
        image,
        reactions: { like: 0, wow: 0, laugh: 0 },
        userReaction: null,
        replies: 0,
      });

      setText("");
      setTags([]);
      setFileList([]);
      message.success("Posted to Quest Feed");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card
      className="osq-card composer"
      bordered={false}
      bodyStyle={{ padding: 16 }}
      aria-label="Create a post"
    >
      <Space align="start" style={{ width: "100%" }} size={12}>
        <Avatar size={40} src="/img/avatars/david.png" alt="Your avatar" />
        <div style={{ flex: 1 }}>
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="Share tips, ask questions, or post a trip update…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Post text"
            maxLength={1000}
            showCount
          />

          <div className="composer-actions">
            <Space wrap>
              <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                accept="image/*"
                itemRender={(n) => n}
              >
                <Button icon={<PictureOutlined />} size="small">
                  Add image
                </Button>
              </Upload>

              <Select
                mode="multiple"
                allowClear
                placeholder="Add tags"
                value={tags}
                onChange={setTags}
                style={{ minWidth: 220 }}
                options={TAGS.map((t) => ({ value: t, label: t }))}
                suffixIcon={<TagOutlined />}
                maxTagCount="responsive"
                aria-label="Select tags"
              />

              <Tooltip title="Emoji (coming soon)">
                <Button icon={<SmileOutlined />} size="small" disabled />
              </Tooltip>
            </Space>

            <Button
              type="primary"
              icon={posting ? <LoadingOutlined /> : <SendOutlined />}
              disabled={!canPost}
              loading={posting}
              onClick={handlePost}
            >
              Post
            </Button>
          </div>
        </div>
      </Space>
    </Card>
  );
}
