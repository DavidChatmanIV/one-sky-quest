import React from "react";
import { Typography, Card, Row, Col, Button } from "antd";

const { Title, Paragraph } = Typography;

const destinations = [
  {
    title: "Bali, Indonesia 🇮🇩",
    desc: "Surf, temples, sunsets — Bali has it all. A top pick for digital nomads and adventurers.",
    image: "/images/bali.jpg",
    link: "#",
  },
  {
    title: "Barcelona, Spain 🇪🇸",
    desc: "From Gaudí’s masterpieces to tapas by the beach — Barcelona blends culture and relaxation.",
    image: "/images/barcelona.jpg",
    link: "#",
  },
];

const FeaturedDestination = () => {
  return (
    <section style={{ padding: "60px 20px", background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          🌍 Featured Destination
        </Title>
        <Paragraph style={{ color: "#555", fontSize: "1.1rem" }}>
          Handpicked destinations you won’t want to miss. Explore the most
          sought-after spots.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {destinations.map((dest, index) => (
          <Col xs={24} sm={12} md={10} lg={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  alt={dest.title}
                  src={dest.image}
                  style={{
                    height: 220,
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                />
              }
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease-in-out",
              }}
              bodyStyle={{ padding: "16px" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Title level={4} style={{ marginBottom: 8 }}>
                {dest.title}
              </Title>
              <Paragraph style={{ color: "#666" }}>{dest.desc}</Paragraph>
              <Button type="link" href={dest.link} style={{ paddingLeft: 0 }}>
                Explore More
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default FeaturedDestination;
