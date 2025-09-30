import React, { useMemo } from "react";
import { Card, Space, Typography, Button } from "antd";

const { Text } = Typography;

/**
 * LimitedDealsCard
 * Props:
 * - deals: [{ id, city, price, endsAt (Date|string|ms), discountPct }]
 * - onViewAll: () => void
 * - onOpen: (deal) => void
 * - loading: boolean
 */
export default function LimitedDealsCard({
  deals = [
    {
      id: "lis",
      city: "Lisbon",
      price: "$120",
      endsAt: Date.now() + 12 * 3600e3,
      discountPct: 35,
    },
    {
      id: "pdc",
      city: "Playa Del Carmen",
      price: "$256",
      endsAt: Date.now() + 10 * 3600e3,
      discountPct: 50,
    },
    {
      id: "bali",
      city: "Bali",
      price: "$516",
      endsAt: Date.now() + 22 * 3600e3,
      discountPct: 40,
    },
  ],
  onViewAll = () => {},
  onOpen = () => {},
  loading = false,
}) {
  // Show up to 4 quick pills
  const rows = useMemo(() => deals.slice(0, 4), [deals]);

  // Flag the card if any deal ends within 12h
  const isSoon = rows.some(
    (d) => new Date(d.endsAt).getTime() - Date.now() < 12 * 3600e3
  );

  const hoursLeft = (endsAt) => {
    const ms = new Date(endsAt).getTime() - Date.now();
    const h = Math.max(0, Math.floor(ms / 3600e3));
    return `${h}h left`;
  };

  return (
    <Card
      variant="borderless" // ✅ AntD v5: replaces bordered={false}
      styles={{ body: { padding: 16 } }} // ✅ AntD v5: replaces bodyStyle
      className={`card glass deals ${isSoon ? "soon" : ""}`}
      loading={loading}
      style={{ height: "100%" }}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Text className="card-eyebrow">Limited Deals</Text>

        {/* Horizontal scrollable pills */}
        <div className="scroll-x" style={{ display: "flex", gap: 10 }}>
          {rows.map((d) => (
            <button
              key={d.id}
              className="deal-pill"
              onClick={() => onOpen(d)}
              aria-label={`Open deal for ${d.city}`}
              style={{ textAlign: "left" }}
            >
              <div className="deal-city">{d.city}</div>

              <div className="deal-meta">
                <span className="price" style={{ fontWeight: 600 }}>
                  {d.price}
                </span>
                <span className="time"> • {hoursLeft(d.endsAt)}</span>
              </div>

              {typeof d.discountPct === "number" && (
                <div style={{ fontSize: 12, opacity: 0.9 }}>
                  Save {d.discountPct}%
                </div>
              )}

              <div className="bar">
                <i />
              </div>
            </button>
          ))}
        </div>

        <Button block onClick={onViewAll} className="cta ghost">
          View all deals
        </Button>
      </Space>
    </Card>
  );
}
