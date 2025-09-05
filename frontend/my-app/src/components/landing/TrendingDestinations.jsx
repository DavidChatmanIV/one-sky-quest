import React from "react";
import { Card, Space, Typography } from "antd";

const { Text } = Typography;

/**
 * items: [{ key: "lisbon", city: "Lisbon", price: "$120" }, ...]
 * Note: styles expect CSS vars like --lisbon-img for background-image in your theme.
 */
export default function TrendingDestinations({
  items = [
    { key: "lisbon", city: "Lisbon", price: "$120" },
    { key: "carmen", city: "Playa Del Carmen", price: "$256" },
    { key: "bali", city: "Bali", price: "$556" },
  ],
}) {
  return (
    <Space size={12} className="trend-wrap">
      {items.map((d) => (
        <Card
          key={d.key}
          variant="borderless"
          className="osq-card trend-card"
          cover={
            <div
              className="trend-img"
              style={{ backgroundImage: `var(--${d.key}-img)` }}
            />
          }
        >
          <Space direction="vertical" size={0}>
            <Text strong>{d.city}</Text>
            <Text type="secondary">{d.price}</Text>
          </Space>
        </Card>
      ))}
    </Space>
  );
}
