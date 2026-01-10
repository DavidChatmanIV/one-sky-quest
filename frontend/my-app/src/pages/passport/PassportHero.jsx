import React from "react";
import { Card, Space, Avatar, Typography, Tag, Button, Progress } from "antd";
import {
  UserOutlined,
  ShareAltOutlined,
  CopyOutlined,
  CrownOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PassportHero({
  name = "Explorer",
  handle = "@explorer",
  levelLabel = "Explorer",
  levelNumber = 1,
  nextTier = "Wanderer",
  xp = 0,
  xpToNext = 100,
  membership = "Free Explorer",
  expires = "Dec 31, 2026",
  onShare,
  onCopy,
}) {
  const pct = Math.max(0, Math.min(100, Math.round((xp / xpToNext) * 100)));

  return (
    <Card className="pp-hero" bordered={false}>
      <div className="pp-heroGrid">
        {/* Left: Identity */}
        <div className="pp-heroLeft">
          <div className="pp-avatarGlow">
            <Avatar size={72} icon={<UserOutlined />} />
          </div>

          <div className="pp-id">
            <Title level={2} className="pp-title">
              {name}
            </Title>
            <Text className="pp-handle">
              {handle} · {levelLabel} · Level {levelNumber}
            </Text>

            <div className="pp-chips">
              <Tag className="pp-chip">Passport Holder</Tag>
            </div>

            <div className="pp-meta">
              <Text className="pp-metaLine">Passport Expires: {expires}</Text>
            </div>
          </div>
        </div>

        {/* Center: XP Ring */}
        <div className="pp-heroCenter">
          <div className="pp-xpRing">
            <Progress type="circle" percent={pct} size={140} strokeWidth={8} />
            <div className="pp-xpText">
              <Text className="pp-nextTier">{nextTier}</Text>
              <div className="pp-levelBig">Level {levelNumber + 1}</div>
              <Text className="pp-xpSmall">
                {xp} / {xpToNext} XP
              </Text>
            </div>
          </div>
          <Text className="pp-xpHint">
            {xpToNext - xp} XP to next badge — {nextTier}
          </Text>
        </div>

        {/* Right: Membership + Actions */}
        <div className="pp-heroRight">
          <div className="pp-membership">
            <Tag className="pp-membershipTag" icon={<CrownOutlined />}>
              {membership}
            </Tag>
            <Text className="pp-expire">Issued—Expires: {expires}</Text>
          </div>

          <Space>
            <Button
              className="pp-ghostBtn"
              icon={<CopyOutlined />}
              onClick={onCopy}
            >
              Copy Link
            </Button>
            <Button
              className="pp-ctaBtn"
              icon={<ShareAltOutlined />}
              onClick={onShare}
            >
              Share
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
}