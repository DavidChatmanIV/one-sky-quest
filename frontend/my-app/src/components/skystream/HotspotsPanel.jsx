import React from "react";

export default function HotspotsPanel() {
  const items = [
    { place: "Kyoto", pct: "+42" },
    { place: "Santorini", pct: "+31" },
    { place: "Puerto Rico", pct: "+28" },
    { place: "Seoul", pct: "+18" },
  ];

  return (
    <section className="skystream-panel">
      <div className="skystream-panelhead">
        <span>Today's hotspots</span>
        <span />
      </div>

      <div className="skystream-hotlist">
        {items.map((x) => (
          <div className="skystream-hotbar" key={x.place}>
            <span>{x.place}</span>
            <span className="skystream-hotpct">{x.pct}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}