import React from "react";
import { Card, Row, Col, Button, Typography, Tag } from "antd";

const { Title, Paragraph } = Typography;

const plans = [
  {
    name: "Free Explorer",
    price: "$0/month",
    perks: [
      "✅ Access to booking & Quest Feed",
      "✅ Earn XP & unlock badges",
      "✅ Save up to 3 trips",
    ],
    tag: "Free",
  },
  {
    name: "Standard Member",
    price: "$5/month",
    perks: [
      "⭐ All Free Explorer perks",
      "⭐ Unlimited saved trips",
      "⭐ 2X XP Boost on bookings",
      "⭐ Birthday travel perk",
    ],
    tag: "Popular",
  },
  {
    name: "Premium Voyager",
    price: "$15/month",
    perks: [
      "🚀 All Standard perks",
      "🚀 Exclusive deals & upgrades",
      "🚀 Priority support & concierge",
      "🚀 Weekly XP bonus",
    ],
    tag: "Best Value",
  },
];

const MembershipPlans = () => {
  return (
    <div className="py-10 px-4 bg-white text-center">
      <Title level={2}>🌟 Membership Plans</Title>
      <Paragraph>Choose the tier that matches your travel energy.</Paragraph>

      <Row gutter={[16, 16]} justify="center" className="mt-8">
        {plans.map((plan, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              title={
                <div>
                  {plan.name}
                  <br />
                  <Tag
                    color={index === 0 ? "gray" : index === 1 ? "blue" : "gold"}
                  >
                    {plan.tag}
                  </Tag>
                </div>
              }
              bordered={false}
              className="shadow-md hover:shadow-xl transition"
            >
              <Paragraph className="text-xl font-semibold mb-4">
                {plan.price}
              </Paragraph>
              <ul className="text-left space-y-2">
                {plan.perks.map((perk, i) => (
                  <li key={i}>{perk}</li>
                ))}
              </ul>
              <Button
                type="primary"
                block
                className="mt-6 bg-indigo-600 hover:bg-indigo-700"
              >
                {index === 0 ? "You're on this plan" : "Upgrade Now"}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MembershipPlans;
