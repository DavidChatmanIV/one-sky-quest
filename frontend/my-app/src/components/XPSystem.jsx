import React from "react";
import { Typography, Card, Row, Col, Progress, Button } from "antd";

const { Title, Paragraph } = Typography;

const XPSystem = () => {
  return (
    <section style={{ background: "#f0f5ff", padding: "60px 20px" }}>
      <div
        style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}
      >
        <Title level={2}>🏅 Earn XP & Unlock Rewards</Title>
        <Paragraph>
          Every trip, review, and share helps you level up. Unlock badges and
          perks along the way!
        </Paragraph>

        <Row gutter={[24, 24]} style={{ marginTop: "40px" }} justify="center">
          <Col xs={24} md={10}>
            <Card bordered>
              <Title level={4}>Your Progress</Title>
              <p>Level 3 Explorer</p>
              <Progress percent={65} status="active" strokeColor="#52c41a" />
              <p style={{ marginTop: 8 }}>650 XP / 1000 XP to reach Level 4</p>
              <Button type="primary" style={{ marginTop: 16 }}>
                View My Rewards
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={10}>
            <Card bordered>
              <Title level={4}>Next Reward</Title>
              <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
                <li>🎫 $10 Travel Voucher</li>
                <li>🎒 OSQ Exclusive Badge</li>
                <li>🚀 Priority Access to Beta Features</li>
              </ul>
              <Button type="dashed" style={{ marginTop: 16 }}>
                Learn How to Earn More XP
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default XPSystem;
