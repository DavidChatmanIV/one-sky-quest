import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Tag,
  Row,
  Col,
  Typography,
  Space,
  Switch,
  Divider,
  Tooltip,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  StarOutlined,
  RocketOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import PageLayout from "../../components/PageLayout";
import "../../styles/Membership.css";

const { Title, Paragraph, Text } = Typography;

/**
 * ✅ Soft-launch note:
 * These are display plans. Checkout route is stubbed.
 * Later you can map these IDs to Stripe priceIds.
 */
const PLANS = [
  {
    id: "free",
    name: "Free Explorer",
    monthly: 0,
    yearly: 0,
    tag: { text: "Free", color: "green" },
    className: "m-card",
    features: [
      { icon: <CheckCircleOutlined />, text: "Access to booking & SkyStream" },
      { icon: <CheckCircleOutlined />, text: "Earn XP & unlock badges" },
      { icon: <CheckCircleOutlined />, text: "Save up to 3 trips" },
    ],
    ctaText: "You’re on this plan",
    disabled: true,
  },
  {
    id: "standard",
    name: "Standard Member",
    monthly: 5,
    yearly: 50, // ~2 months free
    tag: { text: "Popular", color: "blue" },
    className: "m-card m-popular",
    features: [
      { icon: <StarOutlined />, text: "All Free Explorer perks" },
      { icon: <StarOutlined />, text: "Unlimited saved trips" },
      { icon: <StarOutlined />, text: "2× XP Boost on bookings" },
      { icon: <StarOutlined />, text: "Birthday travel perk" },
    ],
    ctaText: "Upgrade Now",
  },
  {
    id: "premium",
    name: "Premium Voyager",
    monthly: 15,
    yearly: 150, // ~2 months free
    tag: { text: "Best Value", color: "gold" },
    className: "m-card m-best",
    features: [
      { icon: <RocketOutlined />, text: "All Standard perks" },
      { icon: <RocketOutlined />, text: "Exclusive deals & upgrades" },
      { icon: <RocketOutlined />, text: "Priority support & concierge" },
      { icon: <RocketOutlined />, text: "Weekly XP bonus" },
    ],
    ctaText: "Upgrade Now",
  },
];

function Price({ amount, period }) {
  return (
    <Paragraph className="m-price" aria-label={`Price ${amount} per ${period}`}>
      ${amount}/{period}
    </Paragraph>
  );
}

export default function MembershipPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("monthly"); // 'monthly' | 'yearly'

  useEffect(() => {
    const prev = document.title;
    document.title = "Skyrio • Membership";
    return () => (document.title = prev);
  }, []);

  const plans = useMemo(() => PLANS, []);

  const handleUpgrade = (planId) => {
    // Soft-launch route stub (wire later to Stripe checkout)
    navigate(`/membership/checkout?plan=${planId}&period=${period}`);
  };

  return (
    <PageLayout fullBleed={false} maxWidth={1180} className="m-wrap">
      {/* Top bar */}
      <div className="m-top">
        <Title level={2} className="m-title">
          Skyrio Membership
        </Title>

        <Paragraph className="m-sub">
          Unlock premium perks, boost your XP, and get exclusive travel tools by
          upgrading your membership.
        </Paragraph>

        <div
          className="m-top-actions"
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <Link to="/" className="m-home-link" aria-label="Back to Home">
            <Button
              type="primary"
              size="large"
              className="m-home-btn"
              icon={<HomeOutlined />}
            >
              Home
            </Button>
          </Link>

          <div
            className="m-billing-toggle"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Text>Monthly</Text>
            <Switch
              checked={period === "yearly"}
              onChange={(v) => setPeriod(v ? "yearly" : "monthly")}
              aria-label="Toggle yearly billing"
            />
            <Space size={6} align="center">
              <Text strong>Yearly</Text>
              <Tooltip title="Save about 2 months vs monthly">
                <Tag color="gold">Save more</Tag>
              </Tooltip>
            </Space>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="m-section">
        <Title level={3} className="m-h3">
          🌟 Membership Plans
        </Title>
        <Paragraph className="m-sub">
          Choose the tier that matches your travel energy.
        </Paragraph>

        <Row gutter={[24, 24]} justify="center">
          {plans.map((p) => {
            const amount = period === "monthly" ? p.monthly : p.yearly;
            const label = period === "monthly" ? "month" : "year";

            return (
              <Col xs={24} md={12} lg={8} key={p.id}>
                <Card
                  title={p.name}
                  bordered={false}
                  className={p.className}
                  extra={<Tag color={p.tag.color}>{p.tag.text}</Tag>}
                >
                  <Price amount={amount} period={label} />

                  <Space
                    direction="vertical"
                    size="middle"
                    className="m-list"
                    style={{ width: "100%" }}
                  >
                    <ul className="m-feature-list">
                      {p.features.map((f, i) => (
                        <li key={i}>
                          {f.icon} <span>{f.text}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      type="primary"
                      disabled={p.disabled}
                      block
                      className="m-cta"
                      onClick={() => !p.disabled && handleUpgrade(p.id)}
                    >
                      {p.ctaText}
                    </Button>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      <Divider />

      {/* Quick notes */}
      <section aria-label="Membership notes" style={{ marginTop: 8 }}>
        <Space direction="vertical" size={4}>
          <Text type="secondary">
            Prices shown in USD. You can switch plans or cancel anytime.
          </Text>
          <Text type="secondary">
            Yearly plans are billed up front and offer ~2 months free compared
            to monthly.
          </Text>
        </Space>
      </section>
    </PageLayout>
  );
}