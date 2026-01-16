import React, { useMemo } from "react";
import { Card, Typography, Space, Tag, Button, Tooltip, Progress } from "antd";
import {
  LockOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SkyrioExchangePreviewCard({
  // keep your existing props (so nothing breaks)
  level = 0,
  balanceXp = 0,
  nextLevelGoal = 250,
  featuredDrop = "Priority Support Week",
  ctaLabel = "Open Exchange",

  // add optional mockup props (non-breaking)
  tierLabel = "Free Explorer",
  expiresLabel = "Issued—Expires: Dec 31, 2026",

  // behavior toggles (safe defaults)
  disabled = true, // soft launch locked by default
  onOpen, // optional handler
}) {
  const pct = useMemo(() => {
    const safeGoal = Math.max(1, Number(nextLevelGoal) || 1);
    const safeBal = Math.max(0, Number(balanceXp) || 0);
    return Math.min(100, Math.round((safeBal / safeGoal) * 100));
  }, [balanceXp, nextLevelGoal]);

  const safeXp = Number(balanceXp) || 0;
  const safeLevel = Number(level) || 0;
  const safeGoal = Number(nextLevelGoal) || 250;

  const handleOpen = () => {
    if (disabled) return;
    if (typeof onOpen === "function") onOpen();
  };

  return (
    <Card bordered={false} className="osq-surface skx-card">
      {/* ✅ Mockup Top Bar */}
      <div className="skx-top">
        <div className="skx-left">
          <div className="skx-titleRow">
            <div className="skx-badgeDot" />
            <Title level={5} className="skx-title">
              Skyrio — Exchange
            </Title>
          </div>

          <Text className="skx-sub">
            Spend XP like currency. Earn it by traveling.
            <span className="skx-subMuted"> (Preview)</span>
          </Text>

          <Space size={8} className="skx-tags" wrap>
            <Tag className="skx-pill" bordered={false}>
              Soft Launch
            </Tag>
            <Tag
              className="skx-pill skx-pillGhost"
              bordered={false}
              icon={<LockOutlined />}
            >
              Coming Soon
            </Tag>
          </Space>
        </div>

        <div className="skx-right">
          <div className="skx-xp">
            <span className="skx-xpLabel">XP</span>
            <span className="skx-xpValue">{safeXp}</span>
          </div>

          <div className="skx-actions">
            <button
              className="skx-iconBtn"
              aria-label="Boost"
              type="button"
              onClick={(e) => e.preventDefault()}
            >
              <ThunderboltOutlined />
            </button>
            <button
              className="skx-iconBtn"
              aria-label="Rewards"
              type="button"
              onClick={(e) => e.preventDefault()}
            >
              <GiftOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Mockup divider glow */}
      <div className="skx-divider" />

      {/* ✅ Body (merged: your progress + mockup mini module) */}
      <div className="skx-body">
        {/* Row: Balance + Level */}
        <div className="skx-row">
          <div className="skx-rowLeft">
            <ThunderboltOutlined className="skx-ico" />
            <div>
              <div className="skx-label">XP Balance</div>
              <div className="skx-value">{safeXp} XP</div>
            </div>
          </div>

          <div className="skx-right">
            <Text className="skx-mini">
              Level {safeLevel} • Earn from bookings + quests
            </Text>
          </div>
        </div>

        {/* Progress */}
        <div className="skx-progress">
          <div className="skx-progressTop">
            <Text className="skx-label">Progress to first redeem</Text>
            <Text className="skx-mini">
              {safeXp}/{safeGoal} XP
            </Text>
          </div>
          <Progress percent={pct} showInfo={false} />
        </div>

        {/* ✅ Mockup “Featured Drop” mini module */}
        <div className="skx-mini">
          <div className="skx-miniLeft">
            <div className="skx-miniIcon">
              <GiftOutlined />
            </div>
            <div>
              <Text className="skx-miniTitle">Featured Drop</Text>
              <div className="skx-miniSub">{featuredDrop || tierLabel}</div>
              <div className="skx-miniSub2">{expiresLabel}</div>
            </div>
          </div>

          <Tooltip
            title={
              disabled
                ? "Exchange opens after Soft Launch. You'll redeem XP here."
                : ""
            }
          >
            <Button
              className="skx-cta"
              type="primary"
              icon={<ArrowRightOutlined />}
              disabled={disabled}
              onClick={handleOpen}
            >
              {ctaLabel}
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}