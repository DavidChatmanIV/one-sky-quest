import React, { useRef, useState } from "react";
import {
  Card,
  Row,
  Col,
  Space,
  Typography,
  Progress,
  Avatar,
  Tooltip,
  Button,
  Select,
  Divider,
  Input,
  message,
} from "antd";
import {
  UserOutlined,
  MessageOutlined,
  UserAddOutlined,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const BORDER_STYLES = {
  None: { border: "2px solid rgba(0,0,0,0.06)" },
  Glow: {
    border: "2px solid #60a5fa",
    boxShadow: "0 0 0 3px rgba(96,165,250,0.25)",
  },
  Gold: {
    border: "2px solid #eab308",
    boxShadow: "0 0 0 3px rgba(234,179,8,0.20)",
  },
  Rose: {
    border: "2px solid #f43f5e",
    boxShadow: "0 0 0 3px rgba(244,63,94,0.20)",
  },
};

export default function ProfileHeader({
  className,
  style,
  level,
  levelTitle,
  xpToNext,
  percent,
  avatar,
  setAvatar,
  banner,
  onShareMemory,
  onSendMessage,
  onAddFriend,
  ...rest
}) {
  const fileInputRef = useRef(null);
  const [musicUrl, setMusicUrl] = useState("");

  const onPickFile = () => fileInputRef.current?.click();
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return message.error("Please choose an image.");
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar?.((prev) => ({ ...prev, avatarUrl: reader.result }));
      message.success("Avatar updated!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card
      className={`osq-surface ${className || ""}`}
      data-surface={rest["data-surface"] ?? "1"}
      styles={{ body: { padding: 0 } }}
      style={{ borderRadius: 16, overflow: "hidden", ...(style || {}) }}
    >
      <div
        style={{
          backgroundImage: `url(${banner?.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.25)",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Row align="middle" gutter={[24, 12]}>
            <Col flex="none">
              <div style={{ position: "relative", width: 128, height: 128 }}>
                <Progress
                  type="dashboard"
                  percent={percent}
                  size={128}
                  strokeWidth={10}
                  trailColor="rgba(255,255,255,0.2)"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Avatar
                    size={88}
                    icon={!avatar?.avatarUrl && <UserOutlined />}
                    src={avatar?.avatarUrl}
                    style={{
                      borderRadius: "9999px",
                      background: "#f8fafc",
                      ...(BORDER_STYLES[avatar?.borderStyle] ||
                        BORDER_STYLES.None),
                    }}
                  />
                </div>
              </div>
            </Col>

            <Col flex="auto">
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Title level={2} style={{ margin: 0, color: "#fff" }}>
                  David
                </Title>
                <Paragraph
                  style={{ margin: 0, color: "rgba(255,255,255,0.9)" }}
                >
                  {banner?.tagline}
                </Paragraph>

                <Space wrap>
                  <span className="chip chip--blue">Level {level}</span>
                  <span className="chip chip--green">{levelTitle}</span>
                  <Text style={{ opacity: 0.92 }}>
                    {xpToNext} XP to next level
                  </Text>
                </Space>

                <Space wrap>
                  <Button onClick={onShareMemory}>Share Memory</Button>
                  <Tooltip title="Send a message">
                    <Button
                      icon={<MessageOutlined />}
                      onClick={onSendMessage}
                    />
                  </Tooltip>
                  <Tooltip title="Add friend">
                    <Button icon={<UserAddOutlined />} onClick={onAddFriend} />
                  </Tooltip>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => message.info("Open banner editor (todo)")}
                  />
                </Space>

                <Divider
                  style={{ margin: 8, borderColor: "rgba(255,255,255,0.15)" }}
                />

                {/* Inline profile music */}
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    placeholder="Paste Apple Music, Spotify, or YouTube link"
                    onPressEnter={() =>
                      musicUrl && message.success("Profile music set")
                    }
                  />
                  <Button
                    type="primary"
                    onClick={() =>
                      musicUrl && message.success("Profile music set")
                    }
                  >
                    Set
                  </Button>
                </Space.Compact>
              </Space>
            </Col>

            <Col flex="none">
              <Space direction="vertical" size={6}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFile}
                  style={{ display: "none" }}
                />
                <Button icon={<UploadOutlined />} onClick={onPickFile}>
                  Change Avatar
                </Button>
                <div>
                  <Text
                    type="secondary"
                    style={{ marginRight: 8, color: "#fff" }}
                  >
                    Border:
                  </Text>
                  <Select
                    size="small"
                    value={avatar?.borderStyle}
                    style={{ width: 140 }}
                    onChange={(val) =>
                      setAvatar?.((p) => ({ ...p, borderStyle: val }))
                    }
                    options={Object.keys(BORDER_STYLES).map((k) => ({
                      value: k,
                      label: k,
                    }))}
                  />
                </div>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
}
