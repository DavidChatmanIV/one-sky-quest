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
      endsAt: Date.now() + 12 * 3600e3,
      discountPct: 50,
    },
    {
      id: "bali",
      city: "Bali",
      price: "$516",
      endsAt: Date.now() + 12 * 3600e3,
      discountPct: 40,
    },
  ],
  onViewAll,
  onOpen,
  loading = false,
}) {
  const rows = useMemo(() => deals.slice(0, 4), [deals]);
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
      bordered={false}
      className={`card glass deals ${isSoon ? "soon" : ""}`}
      loading={loading}
      bodyStyle={{ padding: 16 }}
      style={{ height: "100%" }}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Text className="card-eyebrow">Limited Deals</Text>

        {/* horizontal pills */}
        <div className="scroll-x" style={{ display: "flex", gap: 10 }}>
          {rows.map((d) => (
            <button
              key={d.id}
              className="deal-pill"
              onClick={() => onOpen && onOpen(d)}
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
