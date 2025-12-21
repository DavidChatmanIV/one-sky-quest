import React from "react";
import { Card, Typography, Space, Button, Progress, List, Tag } from "antd";
import { GiftOutlined, ThunderboltOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function RewardsExchangeCard({
  xpBalance = 260,
  nextRewardAt = 500,
  items = [
    { name: "5% off Hotels", cost: 200, tag: "Starter" },
    {
      name: "XP Boost (24h)",
      cost: 350,
      tag: "Boost",
      icon: <ThunderboltOutlined />,
    },
    { name: "Priority Support (7 days)", cost: 450, tag: "Pro" },
  ],
  onRedeem,
  onViewAll,
}) {
  const pct = Math.min(
    100,
    Math.round((xpBalance / Math.max(1, nextRewardAt)) * 100)
  );

  return (
    <Card
      className="sk-card"
      style={{
        borderRadius: 16,
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.12)",
      }}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Space>
            <GiftOutlined />
            <Title
              level={4}
              style={{ margin: 0, color: "rgba(255,255,255,.95)" }}
            >
              Skyrio Exchange
            </Title>
          </Space>

          <Tag style={{ fontWeight: 900 }}>{xpBalance} XP</Tag>
        </Space>

        <Text style={{ color: "rgba(255,255,255,.75)" }}>
          Redeem XP for discounts, boosts, and perks.
        </Text>

        <div>
          <Text
            style={{
              color: "rgba(255,255,255,.85)",
              display: "block",
              marginBottom: 6,
            }}
          >
            Next reward at {nextRewardAt} XP
          </Text>
          <Progress percent={pct} showInfo />
        </div>

        <List
          size="small"
          dataSource={items}
          renderItem={(item) => (
            <List.Item style={{ border: "none", padding: "6px 0" }}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Space>
                  {item.icon ? item.icon : null}
                  <Text style={{ color: "rgba(255,255,255,.9)" }}>
                    {item.name}
                  </Text>
                  <Tag>{item.tag}</Tag>
                </Space>

                <Button
                  size="small"
                  type="primary"
                  className="btn-orange"
                  onClick={() => onRedeem?.(item)}
                  disabled={xpBalance < item.cost}
                >
                  Redeem {item.cost}
                </Button>
              </Space>
            </List.Item>
          )}
        />

        <Button ghost onClick={onViewAll}>
          View full catalog
        </Button>
      </Space>
    </Card>
  );
}