import React from "react";
import { Typography, Tag } from "antd";
import { FireFilled } from "@ant-design/icons";

const { Title } = Typography;

export default function TrendingSidebar() {
  const trending = [
    "Japan",
    "Kyoto",
    "HiddenGem",
    "Weekend",
    "Sunsets",
    "Foodie",
  ];
  const hotspots = [
    { place: "Kyoto", pct: "+42%" },
    { place: "Santorini", pct: "+31%" },
    { place: "Puerto Rico", pct: "+24%" },
    { place: "Seoul", pct: "+18%" },
  ];

  return (
    <aside className="qf-side">
      <div className="qf-sidecard qf-card">
        <Title level={5} className="qf-side-title">
          Trending <FireFilled />
        </Title>
        <div className="qf-trend-tags">
          {trending.map((t) => (
            <Tag key={t} className="qf-tag pill">
              #{t}
            </Tag>
          ))}
        </div>
      </div>

      <div className="qf-sidecard qf-card">
        <Title level={5} className="qf-side-title">
          Today’s hotspots
        </Title>
        <div className="qf-hotspots">
          {hotspots.map((h) => (
            <div key={h.place} className="qf-hot">
              <span>{h.place}</span>
              <span className="qf-hot-pct">{h.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
