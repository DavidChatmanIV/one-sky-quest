import React, { useRef } from "react";
import {
  Avatar,
  Button,
  Space,
  Select,
  Typography,
  Upload,
  message,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

/**
 * Props:
 *  - avatar: { avatarUrl: string|null, borderStyle: string }
 *  - onAvatarChange: (nextAvatar) => void
 *  - borderStyles: Record<string, React.CSSProperties>
 */
const AvatarCustomizer = ({ avatar, onAvatarChange, borderStyles }) => {
  const fileInputRef = useRef(null);

  const handlePick = () => fileInputRef.current?.click();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onAvatarChange({ ...avatar, avatarUrl: reader.result });
      message.success("Avatar updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleBorderChange = (value) => {
    onAvatarChange({ ...avatar, borderStyle: value });
  };

  const borderStyle =
    borderStyles?.[avatar.borderStyle] || borderStyles?.None || {};

  return (
    <div>
      <Space size="large" align="center" wrap>
        {/* Preview uses the SAME avatar state as the header */}
        <div style={{ display: "grid", placeItems: "center" }}>
          <Avatar
            size={88}
            icon={!avatar.avatarUrl && <UserOutlined />}
            src={avatar.avatarUrl}
            style={{
              borderRadius: "9999px",
              background: "#f8fafc",
              ...borderStyle,
            }}
          />
          <Text type="secondary" style={{ marginTop: 8, fontSize: 12 }}>
            Preview (same as header)
          </Text>
        </div>

        <Space direction="vertical" size={8}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <Button icon={<UploadOutlined />} onClick={handlePick}>
            Upload Avatar
          </Button>

          <div>
            <Text style={{ marginRight: 8 }}>Select Border Style:</Text>
            <Select
              value={avatar.borderStyle}
              style={{ width: 160 }}
              onChange={handleBorderChange}
              options={Object.keys(borderStyles || {}).map((k) => ({
                value: k,
                label: k,
              }))}
            />
          </div>
        </Space>
      </Space>
    </div>
  );
};

export default AvatarCustomizer;
