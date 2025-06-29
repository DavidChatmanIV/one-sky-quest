import React from "react";
import { Typography, Card, Row, Col, Button } from "antd";

const { Title, Paragraph } = Typography;

const featured = [
  {
    title: "Bali, Indonesia 🇮🇩",
    desc: "Surf, temples, sunsets — Bali has it all. A top pick for digital nomads and adventurers.",
    image: "/images/featured-bali.jpg",
  },
  {
    title: "Barcelona, Spain 🇪🇸",
    desc: "From Gaudí’s masterpieces to tapas by the beach — Barcelona blends culture and relaxation.",
    image: "/images/featured-barcelona.jpg",
  },
];

const FeaturedDestination = () => {
  return (
    <section className="py-10 px-4" style={{ background: "#fffefc" }}>
      <Title level={2} className="text-center">
        🌍 Featured Destination
      </Title>
      <Paragraph
        className="text-center"
        style={{ maxWidth: 600, margin: "0 auto 2rem" }}
      >
        Handpicked destinations you won’t want to miss. Explore the most
        sought-after spots.
      </Paragraph>

      <Row gutter={[24, 24]} justify="center">
        {featured.map((place, index) => (
          <Col xs={24} sm={12} md={10} key={index}>
            <Card
              hoverable
              cover={
                <img
                  src={place.image}
                  alt={place.title}
                  style={{ height: 220, objectFit: "cover" }}
                />
              }
              style={{ borderRadius: 12 }}
            >
              <Title level={4}>{place.title}</Title>
              <Paragraph>{place.desc}</Paragraph>
              <Button type="link">Explore More</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default FeaturedDestination;
