import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Space, Tag, Typography, message } from "antd";
import { UserOutlined, GiftOutlined, CrownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/* =========================================================
   PassportIdentity
   - Soft-launch ready
   - No ESLint issues
   - Renewal reward persisted per year
   ========================================================= */

export default function PassportIdentity({ user }) {
  /* -----------------------------------------
     Year-scoped storage key
     ----------------------------------------- */
  const yearKey = new Date().getFullYear();
  const STORAGE_KEY = `skyrio_passport_renew_claimed_${yearKey}`;

  const [renewClaimed, setRenewClaimed] = useState(false);

  /* -----------------------------------------
     Load claimed state on mount
     ----------------------------------------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setRenewClaimed(true);
    } catch (err) {
      // localStorage may be unavailable (private mode)
      console.warn("Could not read renewal claim state:", err);
    }
  }, [STORAGE_KEY]);

  /* -----------------------------------------
     Derived values
     ----------------------------------------- */
  const issuedAt = useMemo(() => {
    if (!user?.createdAt) return "—";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user?.createdAt]);

  /* -----------------------------------------
     ✅ claimRenewReward (FIXED + SAFE)
     ----------------------------------------- */
  const claimRenewReward = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      setRenewClaimed(true);
    } catch (err) {
      // localStorage can fail in private browsing / disabled storage
      console.warn("Renew reward storage failed:", err);
    }

    // Soft-launch feedback (XP logic can hook here later)
    message.success("Renewal reward claimed! 🎟️ +50 XP");
  };

  /* -----------------------------------------
     Render
     ----------------------------------------- */
  return (
    <div className="tp-card osq-surface" style={{ padding: 18 }}>
      {/* Top Row */}
      <div className="tp-top">
        <Text className="tp-title">DIGITAL PASSPORT</Text>

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