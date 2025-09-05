import { Card, Row, Col } from "antd";
export default function WhyBookOSQ() {
  const items = [
    {
      title: "⭐ XP Rewards",
      desc: "Earn XP for every booking and level up your profile.",
    },
    {
      title: "🕒 Flexible Cancellation",
      desc: "Free cancellation on most bookings.",
    },
    {
      title: "💎 Exclusive Deals",
      desc: "Unlock better prices and bundles with OSQ perks.",
    },
    {
      title: "✅ Trusted Partners",
      desc: "Only high-rated, licensed providers.",
    },
    { title: "⚡ Fast-Track Service", desc: "Premium members skip the wait." },
  ];
  return (
    <Card className="osq-card">
      <Row gutter={[16, 16]}>
        {items.map((it) => (
          <Col xs={24} sm={12} md={8} key={it.title}>
            <div style={{ fontWeight: 700 }}>{it.title}</div>
            <div style={{ opacity: 0.85 }}>{it.desc}</div>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
