import React from "react";
import { Card, Space, Avatar, Button, Tag, Typography, Badge } from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  FireOutlined,
  MoreOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

function Reaction({ icon, count, active, onClick, label }) {
  return (
    <Button
      type={active ? "primary" : "text"}
      size="small"
      icon={icon}
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
    >
      <span style={{ marginLeft: 4 }}>{count}</span>
    </Button>
  );
}

export default function PostCard({ post, onReact }) {
  const { author, time, text, image, tags, reactions, userReaction, replies } =
    post;

  return (
    <Card
      className="osq-card post"
      bordered={false}
      bodyStyle={{ padding: 16 }}
    >
      <Space align="start" style={{ width: "100%" }} size={12}>
        <Avatar size={40} src={author.avatar} alt={`${author.name} avatar`} />
        <div style={{ flex: 1 }}>
          <Space
            align="baseline"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <div>
              <Text strong>{author.name}</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                {time}
              </Text>
            </div>
            <Button
              type="text"
              icon={<MoreOutlined />}
              aria-label="Post menu"
            />
          </Space>

          <div className="post-body">
            <Text style={{ whiteSpace: "pre-wrap" }}>{text}</Text>

            {image && (
              <div className="post-image">
                <img
                  src={image}
                  alt="" // ✅ simple valid alt
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            <div className="post-tags">
              {tags?.map((t) => (
                <Tag key={t} className="pill">
                  {t}
                </Tag>
              ))}
            </div>
          </div>

          <div className="post-actions">
            <Space wrap>
              <Reaction
                icon={<LikeOutlined />}
                count={reactions.like}
                active={userReaction === "like"}
                onClick={() => onReact(post.id, "like")}
                label="Like"
              />
              <Reaction
                icon={<FireOutlined />}
                count={reactions.wow}
                active={userReaction === "wow"}
                onClick={() => onReact(post.id, "wow")}
                label="Wow"
              />
              <Reaction
                icon={<MessageOutlined />}
                count={reactions.laugh}
                active={userReaction === "laugh"}
                onClick={() => onReact(post.id, "laugh")}
                label="Laugh"
              />
            </Space>

            <Badge count={replies} offset={[8, -2]}>
              <Button type="text" size="small">
                View thread
              </Button>
            </Badge>
          </div>
        </div>
      </Space>
    </Card>
  );
}
