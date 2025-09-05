import React from "react";
import { Card, Button } from "antd";
import { Link } from "react-router-dom";

export default function OneSkyPerksCard() {
  return (
    <Card
      variant="borderless"
      className="osq-card perk-tiles"
      styles={{ body: { padding: 18 } }}
    >
      <h3 style={{ marginBottom: 4 }}>One Sky Perks</h3>
      <p className="perk-sub">Unlock rewards, deals, and XP as you travel.</p>

      <div className="perk-tiles-grid">
        {[
          {
            emoji: "⭐",
            title: "XP Rewards",
            desc: "Earn XP for every booking and level up your profile.",
          },
          {
            emoji: "✅",
            title: "Trusted Partners",
            desc: "Only highly-rated, licensed providers.",
          },
          {
            emoji: "🌀",
            title: "Flexible Cancellation",
            desc: "Free cancellation on most bookings.",
          },
          {
            emoji: "⚡",
            title: "Fast-Track Service",
            desc: "Premium members skip the wait.",
          },
          {
            emoji: "💎",
            title: "Exclusive Deals",
            desc: "Unlock better prices and bundles with OSQ perks.",
          },
        ].map((p) => (
          <div className="perk-tile" key={p.title}>
            <span className="perk-emoji">{p.emoji}</span>
            <div className="perk-copy">
              <div className="perk-title">{p.title}</div>
              <div className="perk-desc">{p.desc}</div>
            </div>
          </div>
        ))}

        {/* Special tile */}
        <div className="perk-tile">
          <span className="perk-emoji">✈️</span>
          <div className="perk-copy">
            <div className="perk-title">Sky Vault</div>
            <div className="perk-desc">
              Redeem badges, themes, and travel boosts.
            </div>
          </div>
          <Link to="/sky-vault">
            <Button size="small" className="btn-orange btn-pill">
              Open
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
