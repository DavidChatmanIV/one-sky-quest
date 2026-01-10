import React, { useMemo, useState } from "react";
import { Button, Tag, Typography } from "antd";
import {
  PlusOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  CarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function monthFromDateString(dateStr) {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return d.getMonth(); // 0-11
  } catch {
    return null;
  }
}

export default function TravelHistory({
  stamps = [],
  trips = [],
  visas = [],
  onAddStamp,
  onAddTrip,
  onAddVisa,
  renewMonthIndex, // 0-11
}) {
  const [showStamps, setShowStamps] = useState(true);
  const [showTrips, setShowTrips] = useState(true);
  const [showVisas, setShowVisas] = useState(true);

  const stampItems = useMemo(() => stamps || [], [stamps]);

  return (
    <div className="osq-surface" style={{ padding: 16 }}>
      <Title level={3} style={{ margin: 0 }}>
        Travel History
      </Title>
      <Text style={{ color: "rgba(255,255,255,.78)" }}>
        Your official record: stamps, trips, and visas.
      </Text>

      {/* STAMPS */}
      <div className="ph-section">
        <div className="ph-section__head">
          <div className="ph-section__title">
            Passport Stamps{" "}
            <Tag className="count-pill">{stampItems.length}</Tag>
          </div>

          {/* ✅ ICON CHIPS */}
          <div className="ph-section__actions pp-travelControls">
            <Button
              className="pp-chipBtn"
              icon={<PlusOutlined />}
              onClick={onAddStamp}
              type="default"
            >
              Add Stamp
            </Button>

            <Button
              className="pp-chipBtn pp-chipBtn--ghost"
              icon={showStamps ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowStamps((v) => !v)}
              type="default"
            >
              {showStamps ? "Hide" : "Show"}
            </Button>
          </div>
        </div>

        {showStamps ? (
          <div className="ph-section__body">
            <div className="stamp-strip">
              {stampItems.map((s) => {
                const m = monthFromDateString(s?.date);
                const glow =
                  typeof renewMonthIndex === "number" && m === renewMonthIndex;

                return (
                  <div
                    key={s.id}
                    className={`stamp-mini ${glow ? "renew-glow" : ""}`}
                    title={glow ? "Renew month glow ✨" : ""}
                  >
                    <div className="stamp-mini__city">{s.city}</div>
                    <div className="stamp-mini__meta">
                      {s.code} • {s.date}
                    </div>
                    <div className="stamp-mini__ring" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* TRIPS */}
      <div className="ph-section">
        <div className="ph-section__head">
          <div className="ph-section__title">
            Trips <Tag className="count-pill">{(trips || []).length}</Tag>
          </div>

          {/* ✅ ICON CHIPS */}
          <div className="ph-section__actions pp-travelControls">
            <Button
              className="pp-chipBtn"
              icon={<EnvironmentOutlined />}
              onClick={onAddTrip}
              type="default"
            >
              Add Trip
            </Button>

            <Button
              className="pp-chipBtn pp-chipBtn--ghost"
              icon={showTrips ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowTrips((v) => !v)}
              type="default"
            >
              {showTrips ? "Hide" : "Show"}
            </Button>
          </div>
        </div>

        {showTrips ? (
          <div className="ph-section__body">
            <div className="ph-list">
              {(trips || []).map((t) => (
                <div key={t.id} className="ph-item">
                  <div>
                    <div className="ph-item__title">{t.title}</div>
                    <div className="ph-item__sub">{t.dates}</div>

                    {t.tags?.length ? (
                      <div className="ph-tags">
                        {t.tags.map((x) => (
                          <Tag key={x}>{x}</Tag>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <Tag
                    className={`status-tag ${String(
                      t.status || ""
                    ).toLowerCase()}`}
                  >
                    {t.status}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* VISAS */}
      <div className="ph-section">
        <div className="ph-section__head">
          <div className="ph-section__title">
            Visas <Tag className="count-pill">{(visas || []).length}</Tag>
          </div>

          {/* ✅ ICON CHIPS */}
          <div className="ph-section__actions pp-travelControls">
            <Button
              className="pp-chipBtn"
              icon={<IdcardOutlined />}
              onClick={onAddVisa}
              type="default"
            >
              Add Visa
            </Button>

            <Button
              className="pp-chipBtn pp-chipBtn--ghost"
              icon={showVisas ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowVisas((v) => !v)}
              type="default"
            >
              {showVisas ? "Hide" : "Show"}
            </Button>
          </div>
        </div>

        {showVisas ? (
          <div className="ph-section__body">
            <div className="ph-list">
              {(visas || []).map((v) => (
                <div key={v.id} className="ph-item">
                  <div>
                    <div className="ph-item__title">{v.country}</div>
                    <div className="ph-item__sub">
                      {v.type} • Expires: {v.expires}
                    </div>
                  </div>

                  <Tag
                    className={`status-tag ${String(
                      v.status || ""
                    ).toLowerCase()}`}
                  >
                    {v.status}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}