import React from "react";
import { Tag } from "antd";

export default function VisaList({ visas = [] }) {
  if (!visas.length)
    return (
      <div className="muted" style={{ marginTop: 6 }}>
        No visas added.
      </div>
    );

  return (
    <div className="ph-list">
      {visas.map((v) => (
        <div className="ph-item" key={v.id}>
          <div className="ph-item__left">
            <div className="ph-item__title">{v.country}</div>
            <div className="ph-item__sub">
              {v.type} · Expires: {v.expires}
            </div>
          </div>

          <Tag
            className={`status-tag ${
              String(v.status).toLowerCase().includes("approved")
                ? "approved"
                : "pending"
            }`}
          >
            {v.status}
          </Tag>
        </div>
      ))}
    </div>
  );
}