import React, { useMemo, useState } from "react";

export default function TrendingPanel() {
  const base = useMemo(
    () => [
      { tag: "#Japan", count: 36 },
      { tag: "#Kyoto", count: 20 },
      { tag: "#HiddenGem", count: 16 },
      { tag: "#Weekend", count: 12 },
    ],
    []
  );

  const [items, setItems] = useState(base);

  return (
    <section className="skystream-panel">
      <div className="skystream-panelhead">
        <span>Trending 🔥</span>
        <button className="skystream-panelclear" onClick={() => setItems([])}>
          Clear
        </button>
      </div>

      <div className="skystream-trendingchips">
        {items.map((x) => (
          <div className="skystream-trendchip" key={x.tag}>
            <span className="skystream-trendtag">{x.tag}</span>
            <span className="skystream-trendcount">{x.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}