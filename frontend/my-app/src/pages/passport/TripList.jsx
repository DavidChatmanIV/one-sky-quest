import React from "react";
import { Tag } from "antd";

export default function TripList({ trips = [] }) {
  if (!trips.length)
    return (
      <div className="muted" style={{ marginTop: 6 }}>
        No trips yet.
      </div>
    );

  return (
    <div className="ph-list">
      {trips.map((t) => (
        <div className="ph-item" key={t.id}>
          <div className="ph-item__left">
            <div className="ph-item__title">{t.title}</div>
            <div className="ph-item__sub">{t.dates}</div>
            <div className="ph-tags">
              {(t.tags || []).map((x, i) => (
                <Tag className="note-tag" key={i}>
                  {x}
                </Tag>
              ))}
            </div>
          </div>

          <Tag className={`status-tag ${(t.status || "").toLowerCase()}`}>
            {t.status}
          </Tag>
        </div>
      ))}
    </div>
  );
}