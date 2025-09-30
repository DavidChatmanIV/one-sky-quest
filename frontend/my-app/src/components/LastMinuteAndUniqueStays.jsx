import React from "react";
import { Row, Col, Card, Typography, Button, Tag, Divider } from "antd";

const { Title, Paragraph } = Typography;

const lastMinuteDeals = [
  { id: 1, title: "🏝️ Bahamas – 3 nights", desc: "From $399 all-inclusive" },
  { id: 2, title: "🏙️ NYC – Weekend Escape", desc: "Boutique hotel, $199" },
  { id: 3, title: "🌲 Oregon Cabin Retreat", desc: "2-night mountain getaway" },
];

const uniqueStays = [
  {
    id: 1,
    title: "🌲 Luxury Treehouse, Oregon",
    type: "Treehouse",
    desc: "Sleep among the pines with skylight views and a wood-fire hot tub.",
    img: "/images/treehouse.jpg",
  },
  {
    id: 2,
    title: "🏝️ Overwater Bungalow, Maldives",
    type: "Bungalow",
    desc: "Wake up over turquoise waters with steps into the sea.",
    img: "/images/bungalow.jpg",
  },
];

const SectionHeader = ({ emoji, title, subtitle }) => (
  <div className="text-center mb-8">
    <Title level={2} style={{ marginBottom: 8 }}>
      {emoji} {title}
    </Title>
    <Paragraph style={{ color: "#667085", marginBottom: 0 }}>
      {subtitle}
    </Paragraph>
    <Divider style={{ marginTop: 16, marginBottom: 0 }} />
  </div>
);

const cardClass =
  "rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5";

const LastMinuteAndUniqueStays = () => (
  <section className="py-12 bg-gray-50" data-aos="fade-up">
    <div className="max-w-6xl mx-auto px-4">
      {/* Last-Minute Escapes */}
      <SectionHeader
        emoji="⏳"
        title="Last-Minute Escapes"
        subtitle="Quick getaways for the spontaneous traveler."
      />

      <Row gutter={[20, 20]} justify="center">
        {lastMinuteDeals.map(({ id, title, desc }) => (
          <Col key={id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              bordered={false}
              className={cardClass}
              bodyStyle={{
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Title level={4} style={{ marginBottom: 6 }}>
                {title}
              </Title>
              <Paragraph style={{ marginBottom: 0 }}>{desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Unique Stays */}
      <div className="mt-12" />
      <SectionHeader
        emoji="🏕️"
        title="Explore Unique Stays"
        subtitle="From treehouses to overwater bungalows — stay somewhere unforgettable."
      />

      <Row gutter={[20, 20]} justify="center">
        {uniqueStays.map(({ id, title, type, desc, img }) => (
          <Col key={id} xs={24} sm={12} md={10}>
            <Card
              hoverable
              bordered={false}
              className={cardClass}
              cover={
                <div className="overflow-hidden rounded-t-2xl">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-52 object-cover transition-transform duration-500 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              }
            >
              <div className="mb-2">
                <Tag color="purple">{type}</Tag>
              </div>
              <Title level={4} style={{ marginBottom: 6 }}>
                {title}
              </Title>
              <Paragraph style={{ marginBottom: 12 }}>{desc}</Paragraph>
              <Button type="link" aria-label={`Explore ${title}`}>
                Explore Stay
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  </section>
);

export default LastMinuteAndUniqueStays;
