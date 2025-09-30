import React from "react";
import { Link } from "react-router-dom";

export default function PerksSection() {
  return (
    <section className="perk-grid-wrap" aria-labelledby="perks-heading">
      {/* Clean header */}
      <header className="perk-header">
        <h3 id="perks-heading" className="perk-title-h">
          One Sky Perks
        </h3>
        <p className="perk-sub">Unlock rewards, deals, and XP as you travel.</p>
      </header>

      {/* Perks Grid */}
      <ul className="perk-grid">
        {/* XP Rewards */}
        <li className="perk">
          <span className="perk-emoji" aria-hidden>
            ⭐
          </span>
          <div className="perk-text">
            <div className="perk-title">XP Rewards</div>
            <div className="perk-desc">
              Earn XP for every booking and level up your profile.
            </div>
          </div>
        </li>

        {/* Trusted Partners */}
        <li className="perk">
          <span className="perk-emoji" aria-hidden>
            ✅
          </span>
          <div className="perk-text">
            <div className="perk-title">Trusted Partners</div>
            <div className="perk-desc">
              Only high-rated, licensed providers.
            </div>
          </div>
        </li>

        {/* Flexible Cancellation */}
        <li className="perk">
          <span className="perk-emoji" aria-hidden>
            🟠
          </span>
          <div className="perk-text">
            <div className="perk-title">Flexible Cancellation</div>
            <div className="perk-desc">Free cancellation on most bookings.</div>
          </div>
        </li>

        {/* Fast-Track Service */}
        <li className="perk">
          <span className="perk-emoji" aria-hidden>
            ⚡
          </span>
          <div className="perk-text">
            <div className="perk-title">Fast-Track Service</div>
            <div className="perk-desc">Premium members skip the wait.</div>
          </div>
        </li>

        {/* Exclusive Deals */}
        <li className="perk">
          <span className="perk-emoji" aria-hidden>
            💎
          </span>
          <div className="perk-text">
            <div className="perk-title">Exclusive Deals</div>
            <div className="perk-desc">
              Unlock better prices and bundles with OSQ perks.
            </div>
          </div>
        </li>

        {/* Sky Vault */}
        <li className="perk">
          <span className="perk-emoji" aria-hidden>
            🗝️
          </span>
          <div className="perk-text">
            <div className="perk-title">Sky Vault</div>
            <div className="perk-desc">
              Your XP store — redeem badges, themes, and travel boosts.
            </div>
          </div>
          <Link to="/sky-vault" className="perk-cta btn-cta">
            Open
          </Link>
        </li>
      </ul>
    </section>
  );
}
