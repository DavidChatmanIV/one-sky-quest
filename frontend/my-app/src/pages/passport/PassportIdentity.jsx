import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Space, Tag, Typography, message } from "antd";
import { UserOutlined, GiftOutlined, CrownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/* =========================================================
   PassportIdentity
   - variant="card"  (default) = original card UI
   - variant="inline"          = compact section to embed in Hero
   ========================================================= */

export default function PassportIdentity({ user, variant = "card" }) {
  const yearKey = new Date().getFullYear();
  const STORAGE_KEY = `skyrio_passport_renew_claimed_${yearKey}`;

  const [renewClaimed, setRenewClaimed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setRenewClaimed(true);
    } catch (err) {
      console.warn("Could not read renewal claim state:", err);
    }
  }, [STORAGE_KEY]);

  const issuedAt = useMemo(() => {
    if (!user?.createdAt) return "—";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user?.createdAt]);

  const claimRenewReward = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      setRenewClaimed(true);
    } catch (err) {
      console.warn("Renew reward storage failed:", err);
    }

    message.success("Renewal reward claimed! 🎟️ +50 XP");
  };

  /* =========================
     INLINE MODE (for Hero)
  ========================= */
  if (variant === "inline") {
    return (
      <div className="pp-identityInline">
        <div className="pp-identityChips">
          <Tag className="chip">Verified</Tag>
          <Tag className="chip">Global Access</Tag>
        </div>

        <div className="pp-identityActions">
          <Button
            icon={<GiftOutlined />}
            className="subtle-btn"
            onClick={claimRenewReward}
            disabled={renewClaimed}
          >
            {renewClaimed ? "Renewal Claimed ✔️" : "Claim Renewal Reward"}
          </Button>
        </div>

        <div className="pp-identityMeta">
          <span className="passport-meta__k">Issued</span>
          <span className="passport-meta__v">{issuedAt}</span>
          <span className="passport-meta__k">Expires</span>
          <span className="passport-meta__v">Dec 31, {yearKey}</span>
        </div>
      </div>
    );
  }

  /* =========================
     CARD MODE (original)
  ========================= */
  return (
    <div
      className="passport-identity tp-card osq-surface"
      style={{ padding: 18 }}
    >
      {/* Top Row */}
      <div className="tp-top">
        <Tag className="tp-tier" icon={<CrownOutlined />}>
          Explorer
        </Tag>
      </div>

      {/* Identity */}
      <Space align="center" size={14} className="tp-id">
        <Avatar size={56} icon={<UserOutlined />} className="tp-avatar" />

        <div className="tp-identity">
          <Title level={4} className="tp-name">
            {user?.name || "Skyrio Explorer"}
          </Title>
          <Text className="tp-tagline">Passport Holder</Text>
        </div>
      </Space>

      {/* Chips */}
      <div className="tp-chips">
        <Tag className="chip">Verified</Tag>
        <Tag className="chip">Global Access</Tag>
      </div>

      {/* Actions */}
      <div className="tp-actions">
        <Button
          icon={<GiftOutlined />}
          className="subtle-btn"
          onClick={claimRenewReward}
          disabled={renewClaimed}
        >
          {renewClaimed ? "Renewal Claimed ✔️" : "Claim Renewal Reward"}
        </Button>
      </div>

      {/* Passport Meta */}
      <div className="passport-meta">
        <div className="passport-meta__row">
          <span className="passport-meta__k">Issued</span>
          <span className="passport-meta__v">{issuedAt}</span>

          <span className="passport-meta__k">Expires</span>
          <span className="passport-meta__v">Dec 31, {yearKey}</span>
        </div>
      </div>
    </div>
  );
}