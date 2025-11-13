import React from "react";
import { Typography } from "antd";
const { Text } = Typography;

export default function BoardingPassToast({
  name = "Explorer",
  routeFrom = "Home",
  routeTo = "Dashboard",
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px dashed rgba(255,255,255,.25)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px dashed rgba(255,255,255,.18)",
        }}
      >
        <Text style={{ fontWeight: 700 }}>Skyrio Boarding Pass</Text>
        <Text type="secondary" style={{ float: "right" }}>
          ✈️
        </Text>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 8,
          alignItems: "center",
          padding: 12,
        }}
      >
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            FROM
          </Text>
          <br />
          <Text style={{ fontWeight: 600 }}>{routeFrom}</Text>
        </div>
        <div style={{ fontSize: 18, lineHeight: "1" }}>→</div>
        <div style={{ textAlign: "right" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            TO
          </Text>
          <br />
          <Text style={{ fontWeight: 600 }}>{routeTo}</Text>
        </div>
      </div>
      <div style={{ padding: "0 12px 12px" }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          PASSENGER
        </Text>
        <br />
        <Text style={{ fontWeight: 600 }}>{name}</Text>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>
          Enjoy your XP boost for today’s check-in ✨
        </div>
      </div>
    </div>
  );
}
