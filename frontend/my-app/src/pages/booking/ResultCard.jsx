import React, { useMemo } from "react";
import { Card, Typography, Space, Tag, Button } from "antd";
import SaveTripButton from "../../components/trips/SaveTripButton";

const { Title, Text } = Typography;

export default function ResultCard({ trip, onSaveTrip }) {
  const title = useMemo(() => trip?.name || trip?.title || "Stay", [trip]);

  const location = useMemo(() => {
    const city = trip?.city || "";
    const country = trip?.country || "";
    const join = [city, country].filter(Boolean).join(", ");
    return join || "Location";
  }, [trip]);

  const price = useMemo(() => {
    const p = trip?.price ?? trip?.nightly ?? null;
    return typeof p === "number" ? `$${p}` : p ? String(p) : null;
  }, [trip]);

  return (
    <Card
      bordered={false}
      className="osq-surface"
      style={{ overflow: "hidden" }}
      cover={
        trip?.image ? (
          <img
            src={trip.image}
            alt={title}
            style={{ width: "100%", height: 180, objectFit: "cover" }}
            loading="lazy"
          />
        ) : null
      }
    >
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ paddingRight: 10 }}>
            <Title level={5} style={{ margin: 0 }}>
              {title}
            </Title>
            <Text type="secondary">{location}</Text>
          </div>

          {price && <Tag color="gold">{price}</Tag>}
        </div>

        {trip?.badge && <Tag color="purple">{trip.badge}</Tag>}

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          {/* ✅ Guest-gated Save */}
          <SaveTripButton
            onSaveConfirmed={() => {
              // ✅ only runs if authed
              onSaveTrip?.(trip);
            }}
          />

          <Button type="primary" onClick={() => console.log("Book", trip)}>
            View
          </Button>
        </div>
      </Space>
    </Card>
  );
}
