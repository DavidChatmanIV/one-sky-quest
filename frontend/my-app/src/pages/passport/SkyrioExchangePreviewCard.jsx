import React, { useMemo } from "react";
import { Card, Typography, Space, Tag, Button, Tooltip, Progress } from "antd";
import {
  LockOutlined,
  GiftOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SkyrioExchangePreviewCard({
  level = 0,
  balanceXp = 0,
  nextLevelGoal = 250, // safe default for the mini progress
  featuredDrop = "Priority Support Week",
  ctaLabel = "Open Exchange",
}) {
  const pct = useMemo(() => {
    const safeGoal = Math.max(1, Number(nextLevelGoal) || 1);
    const safeBal = Math.max(0, Number(balanceXp) || 0);
    return Math.min(100, Math.round((safeBal / safeGoal) * 100));
  }, [balanceXp, nextLevelGoal]);

  return (
    <Card bordered={false} className="osq-surface skx-card">
      <div className="skx-head">
        <div>
          <Title level={5} className="skx-title">
            Skyrio — Exchange
          </Title>
          <Text type="secondary" className="skx-sub">
            Spend XP like currency. Earn it by traveling.{" "}
            <span className="skx-preview">(Preview)</span>
          </Text>
        </div>

        <Space size={8} wrap>
          <Tag className="skx-chip skx-chip--soft">Soft Launch</Tag>
          <Tag className="skx-chip skx-chip--soon" icon={<LockOutlined />}>
            Coming Soon
          </Tag>
        </Space>
      </div>

      <div className="skx-body">
        {/* Row 1 */}
        <div className="skx-row">
          <div className="skx-rowLeft">
            <ThunderboltOutlined className="skx-ico" />
            <div>
              <div className="skx-label">XP Balance</div>
              <div className="skx-value">{Number(balanceXp) || 0} XP</div>
            </div>
          </div>

          <div className="skx-right">
            <Text type="secondary" className="skx-mini">
              Level {level} • Earn from bookings + quests
            </Text>
          </div>
        </div>

        {/* Row 2 */}
        <div className="skx-progress">
          <div className="skx-progressTop">
            <Text className="skx-label">Progress to first redeem</Text>
            <Text type="secondary" className="skx-mini">
              {Number(balanceXp) || 0}/{Number(nextLevelGoal) || 250} XP
            </Text>
          </div>
          <Progress percent={pct} showInfo={false} />
        </div>

        {/* Row 3 */}
        <div className="skx-row skx-row--perk">
          <div className="skx-rowLeft">
            <GiftOutlined className="skx-ico" />
            <div>
              <div className="skx-label">Featured Drop</div>
              <div className="skx-value">{featuredDrop}</div>
            </div>
          </div>

          <Tooltip title="Exchange opens after Soft Launch. You'll redeem XP here.">
            <Button className="skx-cta" disabled>
              {ctaLabel}
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}