import React from "react";
import { Avatar, Tag, Typography } from "antd";
import { CheckCircleFilled, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function TopEightItemFriend({
  name = "Explorer",
  username = "user",
  vibe = "",
  verified = false,
  mutuals,
  isDragging = false,
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 10,
        border: "1px solid rgba(255,255,255,.12)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))",
        backdropFilter: "blur(10px)",
        boxShadow: isDragging ? "0 10px 26px rgba(0,0,0,.35)" : "none",
        minHeight: 92,
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      <Avatar
        size={44}
        icon={<UserOutlined />}
        style={{
          border: "2px solid rgba(255,255,255,.18)",
          background: "rgba(0,0,0,.25)",
        }}
      />

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Text
            style={{
              color: "rgba(255,255,255,.92)",
              fontWeight: 800,
              lineHeight: 1.1,
            }}
            ellipsis
          >
            {name}
          </Text>

          {verified ? <CheckCircleFilled style={{ color: "#a78bfa" }} /> : null}
        </div>

        <Text style={{ color: "rgba(255,255,255,.70)", fontSize: 12 }} ellipsis>
          @{username}
        </Text>

        <div
          style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}
        >
          {vibe ? (
            <Tag
              color="purple"
              style={{ borderRadius: 999, marginInlineEnd: 0 }}
            >
              {vibe}
            </Tag>
          ) : null}

          {typeof mutuals === "number" ? (
            <Tag color="gold" style={{ borderRadius: 999, marginInlineEnd: 0 }}>
              {mutuals}+ mutuals
            </Tag>
          ) : null}
        </div>
      </div>
    </div>
  );
}