import React from "react";
import { Typography } from "antd";

const { Text, Title } = Typography;

const DEFAULT_TAGS = [
  { tag: "Japan", count: 128 },
  { tag: "Kyoto", count: 96 },
  { tag: "HiddenGem", count: 75 },
  { tag: "Weekend", count: 64 },
  { tag: "Sunsets", count: 58 },
  { tag: "Foodie", count: 51 },
];

const DEFAULT_HOTSPOTS = [
  { name: "Kyoto", delta: "+42%" },
  { name: "Santorini", delta: "+31%" },
  { name: "Puerto Rico", delta: "+24%" },
  { name: "Seoul", delta: "+18%" },
];

export default function TrendingSidebar({
  tags = DEFAULT_TAGS,
  hotspots = DEFAULT_HOTSPOTS,
  onClear,
}) {
  return (
    <div className="sidebar-col">
      {/* Trending */}
      <section className="sidebar-widget qf-card">
        <div className="sidebar-title">
          <span>Trending 🔥</span>
          <button className="clear-btn" onClick={onClear}>
            Clear
          </button>
        </div>
        <div className="trending-tags">
          {tags.map(({ tag, count }) => (
            <span key={tag} className="tag-pill">
              #{tag} {count ? <small>· {count}</small> : null}
            </span>
          ))}
        </div>
      </section>

      {/* Hotspots */}
      <section className="sidebar-widget qf-card">
        <div className="sidebar-title">
          <span>Today’s hotspots</span>
        </div>
        <div className="hotspots">
          {hotspots.map((h) => (
            <div key={h.name} className="hotspot">
              <span>{h.name}</span>
              <small>{h.delta}</small>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Submit tip (optional) */}
      <section
        className="sidebar-widget qf-card"
        style={{ textAlign: "center" }}
      >
        <Title level={5} style={{ color: "#fff", marginBottom: 8 }}>
          Submit a tip
        </Title>
        <Text style={{ color: "rgba(255,255,255,.85)" }}>
          Found a deal or hidden gem? Share it with the community.
        </Text>
      </section>
    </div>
  );
}
