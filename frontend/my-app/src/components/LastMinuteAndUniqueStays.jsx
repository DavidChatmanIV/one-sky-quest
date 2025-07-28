import React from "react";
import { Row, Col, Card, Typography, Button, Tag } from "antd";

const { Title, Paragraph } = Typography;

const lastMinuteDeals = [
  { title: "🏝️ Bahamas – 3 nights", desc: "From $399 all-inclusive" },
  { title: "🏙️ NYC – Weekend Escape", desc: "Boutique hotel, $199" },
  { title: "🌲 Oregon Cabin Retreat", desc: "2-night mountain getaway" },
];

const uniqueStays = [
  {
    title: "🌲 Luxury Treehouse, Oregon",
    type: "Treehouse",
    desc: "Sleep among the pines with skylight views and a wood-fire hot tub.",
    img: "/images/treehouse.jpg",
  },
  {
    title: "🏝️ Overwater Bungalow, Maldives",
    type: "Bungalow",
    desc: "Wake up over turquoise waters with steps into the sea.",
    img: "/images/bungalow.jpg",
  },
];

const LastMinuteAndUniqueStays = () => (
  <section className="py-12 px-4 bg-gray-50" data-aos="fade-up">
    <div className="text-center mb-12">
      <Title level={2}>⏳ Last-Minute Escapes</Title>
      <Paragraph>Quick getaways for the spontaneous traveler.</Paragraph>
    </div>

    <Row gutter={[24, 24]} justify="center">
      {lastMinuteDeals.map((deal, i) => (
        <Col xs={24} sm={12} md={8} key={i}>
          <Card hoverable>
            <Title level={4}>{deal.title}</Title>
            <Paragraph>{deal.desc}</Paragraph>
          </Card>
        </Col>
      ))}
    </Row>

    <div className="text-center my-12">
      <Title level={2}>🏕️ Explore Unique Stays</Title>
      <Paragraph>
        From treehouses to overwater bungalows — stay somewhere unforgettable.
      </Paragraph>
    </div>

    <Row gutter={[24, 24]} justify="center">
      {uniqueStays.map((stay, i) => (
        <Col xs={24} sm={12} md={10} key={i}>
          <Card
            hoverable
            cover={
              <img
                src={stay.img}
                alt={stay.title}
                style={{
                  borderRadius: "12px 12px 0 0",
                  height: 200,
                  objectFit: "cover",
                }}
              />
            }
          >
            <Tag color="purple">{stay.type}</Tag>
            <Title level={4}>{stay.title}</Title>
            <Paragraph>{stay.desc}</Paragraph>
            <Button type="link">Explore Stay</Button>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
);

export default LastMinuteAndUniqueStays;
