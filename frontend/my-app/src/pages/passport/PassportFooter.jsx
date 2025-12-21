// src/components/skystream/SkyStreamHeader.jsx
import React, { useMemo } from "react";
import { Card, Space, Typography, Segmented, Input, Button, Tag } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

// If you already have it, keep path consistent
import { useAuth } from "../../hooks/useAuth";

const { Title, Text } = Typography;

export default function SkyStreamHeader({
  brand = "Skyrio",

  activeTab = "forYou",
  onTabChange,
  tabOptions = [],

  search = "",
  onSearchChange,

  xpToday = 0,
  onCompose,
}) {
  const auth = useAuth();

  // ✅ Real user display name
  const displayName = useMemo(() => {
    const u = auth?.user;
    if (!u) return "Guest";
    return (
      u.username || u.name || (u.email ? u.email.split("@")[0] : "Explorer")
    );
  }, [auth?.user]);

  return (
    <Card className="sk-headerCard" bordered={false}>
      <div className="sk-headerRow">
        <div className="sk-headerLeft">
          <Title level={4} className="sk-headerTitle">
            {brand} • SkyStream
          </Title>
          <Text className="sk-muted">
            Welcome, <span className="sk-strong">{displayName}</span>
          </Text>
        </div>

        <div className="sk-headerRight">
          <Tag className="sk-xpPill">
            <ThunderboltOutlined /> XP Today: {Number(xpToday || 0)}
          </Tag>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="btn-orange"
            onClick={onCompose}
          >
            Post
          </Button>
        </div>
      </div>

      <div className="sk-headerControls">
        <Segmented
          value={activeTab}
          options={tabOptions}
          onChange={(val) => onTabChange?.(val)}
          className="sk-tabs"
        />

        <Input
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search SkyStream..."
          className="sk-search"
        />
      </div>
    </Card>
  );
}