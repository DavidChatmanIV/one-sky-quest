import React from "react";
import { Typography, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function TopEightItemPlace({
  name = "Location",
  country = "",
  badge = "",
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
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <EnvironmentOutlined style={{ color: "rgba(255,255,255,.85)" }} />
        <div style={{ minWidth: 0 }}>
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
          <div>
            <Text style={{ color: "rgba(255,255,255,.70)", fontSize: 12 }}>
              {country}
            </Text>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {badge ? (
          <Tag
            color="volcano"
            style={{
              borderRadius: 999,
              marginInlineEnd: 0,
            }}
          >
            {badge}
          </Tag>
        ) : null}

        <Tag
          color="default"
          style={{
            borderRadius: 999,
            marginInlineEnd: 0,
            background: "rgba(0,0,0,.18)",
            borderColor: "rgba(255,255,255,.14)",
            color: "rgba(255,255,255,.86)",
          }}
        >
          Passport Pick
        </Tag>
      </div>
    </div>
  );
}