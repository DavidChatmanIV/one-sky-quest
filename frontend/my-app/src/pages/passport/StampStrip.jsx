import React from "react";

export default function StampStrip({ stamps = [] }) {
  if (!stamps.length)
    return (
      <div className="muted" style={{ marginTop: 6 }}>
        No stamps yet.
      </div>
    );

  return (
    <div className="stamp-strip" role="list">
      {stamps.map((s) => (
        <div className="stamp-mini" role="listitem" key={s.id}>
          <div className="stamp-mini__city">{s.city}</div>
          <div className="stamp-mini__meta">
            {s.code} · {s.date}
          </div>
          <div className="stamp-mini__ring" />
        </div>
      ))}
    </div>
  );
}