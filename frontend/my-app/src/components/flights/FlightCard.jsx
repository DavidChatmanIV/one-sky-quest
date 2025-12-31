import React from "react";
import { Card, Typography, Space, Tag, Button } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ArrowRightOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

function fmtTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "—";
  }
}
function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}
function fmtDuration(mins) {
  if (!mins && mins !== 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export default function FlightCard({
  flight,
  saved,
  onSave,
  onUnsave,
  onCheckout,
}) {
  const {
    airline,
    airlineCode,
    flightNumber,
    origin,
    destination,
    departAt,
    arriveAt,
    durationMinutes,
    stops,
    cabin,
    price,
    badges = [],
  } = flight;

  return (
    <Card
      className="sk-flightCard"
      hoverable
      style={{ borderRadius: 18 }}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={10}>
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Space size={10} align="center">
            <div className="sk-flightLogo">{airlineCode || "✈️"}</div>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {airline || "Airline"}
              </Title>
              <Text type="secondary">
                {flightNumber || "—"} · {String(cabin || "ECONOMY")}
              </Text>
            </div>
          </Space>

          <Space>
            {badges.slice(0, 2).map((b) => (
              <Tag key={b} className="sk-badgeTag">
                {b}
              </Tag>
            ))}
          </Space>
        </Space>

        <div className="sk-flightRow">
          <div className="sk-flightCol">
            <Text className="sk-flightTime">{fmtTime(departAt)}</Text>
            <Text type="secondary">{origin}</Text>
            <Text className="sk-flightDate">{fmtDate(departAt)}</Text>
          </div>

          <div className="sk-flightMid">
            <Text type="secondary" className="sk-flightMeta">
              {fmtDuration(durationMinutes)} ·{" "}
              {stops === 0 ? "Nonstop" : `${stops} stop`}
            </Text>
            <SwapRightOutlined className="sk-flightArrow" />
          </div>

          <div className="sk-flightCol" style={{ textAlign: "right" }}>
            <Text className="sk-flightTime">{fmtTime(arriveAt)}</Text>
            <Text type="secondary">{destination}</Text>
            <Text className="sk-flightDate">{fmtDate(arriveAt)}</Text>
          </div>
        </div>

        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <div>
            <Text type="secondary">Total</Text>
            <div className="sk-flightPrice">
              {price?.currency || "USD"} {Number(price?.total || 0).toFixed(2)}
            </div>
          </div>

          <Space>
            <Button
              type="text"
              className={`sk-saveBtn ${saved ? "isSaved" : ""}`}
              icon={saved ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => (saved ? onUnsave?.(flight.id) : onSave?.(flight))}
            >
              {saved ? "Saved" : "Save"}
            </Button>

            <Button
              type="primary"
              className="sk-checkoutBtn"
              icon={<ArrowRightOutlined />}
              onClick={() => onCheckout?.(flight)}
            >
              Checkout
            </Button>
          </Space>
        </Space>
      </Space>
    </Card>
  );
}