import React, { useState } from "react";
import { Avatar, Select, Upload, Typography } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const fxOptions = [
  { label: "✨ Glow", value: "ring-2 ring-pink-500 animate-pulse" },
  { label: "🥇 Gold", value: "ring-2 ring-yellow-500" },
  { label: "🌊 Aqua", value: "ring-2 ring-cyan-400 animate-pulse" },
  { label: "🧊 Frost", value: "ring-2 ring-blue-300 blur-sm" },
  { label: "🚫 None", value: "" },
];

const AvatarCustomizer = ({ onAvatarChange }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [borderFx, setBorderFx] = useState(fxOptions[0].value);

  const handleUpload = (info) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
      onAvatarChange({ avatarUrl: reader.result, borderFx });
    };
    reader.readAsDataURL(info.file.originFileObj);
  };

  const handleFxChange = (value) => {
    setBorderFx(value);
    onAvatarChange({ avatarUrl, borderFx: value });
  };

  return (
    <div className="mt-8">
      <Title level={4}>🧑‍🎨 Customize Avatar</Title>

      <div className="flex items-center gap-6 flex-wrap mt-4">
        {/* Avatar preview */}
        <Avatar
          size={100}
          icon={!avatarUrl && <UserOutlined />}
          src={avatarUrl}
          className={`transition-all duration-500 ${borderFx}`}
        />

        {/* Upload and style selector */}
        <div className="space-y-3">
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUpload}
          >
            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">
              <UploadOutlined /> Upload Avatar
            </button>
          </Upload>

          <div>
            <Text strong>Select Border Style:</Text>
            <Select
              className="ml-2 min-w-[160px]"
              defaultValue={fxOptions[0].value}
              onChange={handleFxChange}
            >
              {fxOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
