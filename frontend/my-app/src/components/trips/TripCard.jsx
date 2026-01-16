import React, { useMemo } from "react";
import { Card, Typography, Space, Button, Tag } from "antd";
import { HeartOutlined, RightOutlined, CrownOutlined } from "@ant-design/icons";

import TripMeta from "./TripMeta";
import SaveTripButton from "./SaveTripButton";

const { Title, Text } = Typography;

function fallbackCover(destination) {
  // keeps UI stable even without images (soft launch)
  const base = String(destination || "trip")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return `/images/trips/${base}.jpg`;
}

export default function TripCard({
  trip,
  onOpen, // (trip) => void
  onSave, // (trip) => Promise|void
  ctaLabel = "View",
  showSave = true,
  showCta = true,
  featured = false,
}) {
  const t = trip || {};

  const coverUrl = useMemo(() => {
    return (
      t.coverUrl || t.imageUrl || t.photoUrl || fallbackCover(t.destination)
    );
  }, [t.coverUrl, t.imageUrl, t.photoUrl, t.destination]);

  const tags = useMemo(() => {
    const arr = Array.isArray(t.tags) ? t.tags : [];
    const out = [...arr];
    if (t.badge && !out.includes(t.badge)) out.unshift(t.badge);
    if (featured && !out.includes("Featured")) out.unshift("Featured");
    return out.slice(0, 4);
  }, [t.tags, t.badge, featured]);

  return (
    <Card
      bordered={false}
      className={`sk-tripCard osq-surface ${featured ? "isFeatured" : ""}`}
      bodyStyle={{ padding: 14 }}
    >
      {/* Cover */}
      <div className="sk-tripCoverWrap">
        <div
          className="sk-tripCover"
          style={{ backgroundImage: `url(${coverUrl})` }}
          aria-label={`${t.destination || "Trip"} cover`}
        />
        <div className="sk-tripCoverOverlay" />

        <div className="sk-tripTopRow">
          {featured ? (
            <Tag className="sk-tripPill" icon={<CrownOutlined />}>
              Featured
            </Tag>
          ) : null}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <TripMeta
          destination={t.destination || t.name || "Destination"}
          country={t.country}
          city={t.city}
          datesLabel={t.datesLabel}
          nights={t.nights}
          travelers={t.travelers}
          rating={t.rating}
          tags={tags}
          price={t.price}
          currencyLabel={t.currencyLabel}
        />
      </div>

      {/* Actions */}
      {(showSave || showCta) && (
        <div className="sk-tripActions">
          <Space
            wrap
            size={10}
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Space wrap size={10}>
              {showSave ? (
                <SaveTripButton
                  onSaveConfirmed={async () => {
                    await onSave?.(t);
                  }}
                />
              ) : null}
            </Space>

            {showCta ? (
              <Button
                className="pp-ctaBtn"
                icon={<RightOutlined />}
                onClick={() => onOpen?.(t)}
              >
                {ctaLabel}
              </Button>
            ) : null}
          </Space>
        </div>
      )}
    </Card>
  );
}