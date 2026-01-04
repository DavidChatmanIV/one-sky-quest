import React, { useMemo, useState } from "react";
import {
  Card,
  Typography,
  Space,
  Switch,
  Button,
  InputNumber,
  message,
  Tag,
} from "antd";
import { ThunderboltOutlined, SettingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminQuickControls({
  isAdmin,
  onSeasonToggle,
  onXpAward,
  onFeatureToggle,
}) {
  const [seasonLive, setSeasonLive] = useState(false);
  const [xpAward, setXpAward] = useState(50);

  const [features, setFeatures] = useState({
    rewards: true,
    xpBoosts: false,
    betaMusic: true,
  });

  const featureList = useMemo(
    () => [
      { key: "rewards", label: "Rewards System" },
      { key: "xpBoosts", label: "XP Boost Events" },
      { key: "betaMusic", label: "Profile Music (Beta)" },
    ],
    []
  );

  if (!isAdmin) return null;

  return (
    <Card bordered={false} className="osq-surface" style={{ marginTop: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }} size={10}>
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Title level={5} style={{ margin: 0 }}>
            <SettingOutlined /> Admin Quick Controls
          </Title>
          <Tag color="gold">Admin</Tag>
        </Space>

        <Text type="secondary">
          Soft-launch controls for seasons, XP awards, and feature toggles.
          (Safe mode)
        </Text>

        {/* Season toggle */}
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <div>
            <Text strong>Season Live</Text>
            <div>
              <Text type="secondary">Turn seasonal rewards on/off.</Text>
            </div>
          </div>

          <Switch
            checked={seasonLive}
            onChange={(v) => {
              setSeasonLive(v);
              onSeasonToggle?.(v);
              message.success(v ? "Season is now LIVE" : "Season is now OFF");
            }}
          />
        </div>

        {/* XP award */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <Text strong>Award XP (test)</Text>
            <div>
              <Text type="secondary">Give yourself XP for testing UI.</Text>
            </div>
          </div>

          <Space>
            <InputNumber
              min={10}
              max={1000}
              value={xpAward}
              onChange={(v) => setXpAward(Number(v || 0))}
            />
            <Button
              icon={<ThunderboltOutlined />}
              onClick={() => {
                onXpAward?.(xpAward);
                message.success(`Awarded ${xpAward} XP (test)`);
              }}
            >
              Award
            </Button>
          </Space>
        </div>

        {/* Feature toggles */}
        <div>
          <Text strong>Feature Toggles</Text>
          <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
            {featureList.map((f) => (
              <div
                key={f.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <Text>{f.label}</Text>
                <Switch
                  checked={!!features[f.key]}
                  onChange={(v) => {
                    setFeatures((prev) => ({ ...prev, [f.key]: v }));
                    onFeatureToggle?.(f.key, v);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </Space>
    </Card>
  );
}