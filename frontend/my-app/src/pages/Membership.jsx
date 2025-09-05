import React from "react";
import { Card, Button, Tag, Row, Col, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import {
  CheckCircleOutlined,
  StarOutlined,
  RocketOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import "../styles/Membership.css";

const { Title, Paragraph } = Typography;

export default function Membership() {
  return (
    <div className="m-wrap">
      {/* top bar with Home */}
      <div className="m-top">
        <Title level={2} className="m-title">
          One Sky Quest Membership
        </Title>
        <Paragraph className="m-sub">
          Unlock premium perks, boost your XP, and get exclusive travel tools by
          upgrading your membership.
        </Paragraph>

        <Link to="/" className="m-home-link">
          <Button
            type="primary"
            size="large"
            className="m-home-btn"
            icon={<HomeOutlined />}
          >
            Home
          </Button>
        </Link>
      </div>

      <div className="m-section">
        <Title level={3} className="m-h3">
          🌟 Membership Plans
        </Title>
        <Paragraph className="m-sub">
          Choose the tier that matches your travel energy.
        </Paragraph>

        <Row gutter={[24, 24]} justify="center">
          {/* Free */}
          <Col xs={24} md={12} lg={8}>
            <Card
              title="Free Explorer"
              bordered={false}
              className="m-card"
              extra={<Tag color="green">Free</Tag>}
            >
              <Paragraph className="m-price">$0/month</Paragraph>
              <Space direction="vertical" size="middle" className="m-list">
                <p>
                  <CheckCircleOutlined /> Access to booking & Quest Feed
                </p>
                <p>
                  <CheckCircleOutlined /> Earn XP & unlock badges
                </p>
                <p>
                  <CheckCircleOutlined /> Save up to 3 trips
                </p>
                <Button type="primary" disabled block className="m-cta">
                  You’re on this plan
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Standard */}
          <Col xs={24} md={12} lg={8}>
            <Card
              title="Standard Member"
              bordered={false}
              className="m-card m-popular"
              extra={<Tag color="blue">Popular</Tag>}
            >
              <Paragraph className="m-price">$5/month</Paragraph>
              <Space direction="vertical" size="middle" className="m-list">
                <p>
                  <StarOutlined /> All Free Explorer perks
                </p>
                <p>
                  <StarOutlined /> Unlimited saved trips
                </p>
                <p>
                  <StarOutlined /> 2× XP Boost on bookings
                </p>
                <p>
                  <StarOutlined /> Birthday travel perk
                </p>
                <Button type="primary" block className="m-cta">
                  Upgrade Now
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Premium */}
          <Col xs={24} md={12} lg={8}>
            <Card
              title="Premium Voyager"
              bordered={false}
              className="m-card m-best"
              extra={<Tag color="gold">Best Value</Tag>}
            >
              <Paragraph className="m-price">$15/month</Paragraph>
              <Space direction="vertical" size="middle" className="m-list">
                <p>
                  <RocketOutlined /> All Standard perks
                </p>
                <p>
                  <RocketOutlined /> Exclusive deals & upgrades
                </p>
                <p>
                  <RocketOutlined /> Priority support & concierge
                </p>
                <p>
                  <RocketOutlined /> Weekly XP bonus
                </p>
                <Button type="primary" block className="m-cta">
                  Upgrade Now
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
