// src/pages/passport/PassportFooter.jsx
import React, { useMemo, useState } from "react";
import { Card, Typography, Space, Button, Input, Tag } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// IMPORTANT: PassportFooter is inside /pages/passport, so hook path is:
import { useAuth } from "../../hooks/useAuth";

const { Title, Text } = Typography;

export default function PassportFooter() {
  const nav = useNavigate();
  const auth = useAuth();

  const [search, setSearch] = useState("");

  const displayName = useMemo(() => {
    const u = auth?.user;
    if (!u) return "Guest";
    return (
      u.username || u.name || (u.email ? u.email.split("@")[0] : "Explorer")
    );
  }, [auth?.user]);

  const xpToday = 0; // soft-launch placeholder

  return (
    <>
      {/* You can keep your other footer stuff ABOVE this if you want */}

      {/* ✅ SkyStream preview card (SINGLE search bar) */}
      <Card className="sk-card" bordered={false} style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Title level={4} style={{ margin: 0 }}>
              Skyrio • SkyStream
            </Title>
            <Text type="secondary">Welcome, {displayName}</Text>
          </div>

          <Tag icon={<ThunderboltOutlined />} style={{ margin: 0 }}>
            XP Today: {xpToday}
          </Tag>

          <Button
            type="primary"
            className="btn-orange"
            icon={<PlusOutlined />}
            onClick={() => nav("/skystream")}
          >
            Post
          </Button>
        </div>

        {/* ✅ ONLY ONE SEARCH INPUT */}
        <div style={{ marginTop: 12 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search SkyStream..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            onPressEnter={() =>
              nav(`/skystream?search=${encodeURIComponent(search)}`)
            }
          />
        </div>
      </Card>

      {/* You can keep your other footer stuff BELOW this if you want */}
    </>
  );
}
