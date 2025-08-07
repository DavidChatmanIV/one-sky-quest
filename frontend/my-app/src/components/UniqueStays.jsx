import React from "react";
import { Typography, Card, Row, Col, Button } from "antd";

const { Title, Paragraph } = Typography;

const stays = [
  {
    title: "Treehouse in Costa Rica 🌴",
    desc: "Live among the trees with stunning views of the rainforest.",
    image: "/images/treehouse-costa-rica.jpg",
  },
  {
    title: "Glass Igloo in Finland ❄️",
    desc: "Sleep under the stars and Northern Lights in comfort.",
    image: "/images/glass-igloo-finland.jpg",
  },
];

const UniqueStays = () => {
  return (
    <section style={{ background: "#f8f9fa", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          🌟 Explore Unique Stays
        </Title>
        <Paragraph style={{ maxWidth: 600, margin: "0 auto", fontSize: 16 }}>
          Find extraordinary accommodations that turn every night into an
          experience.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {stays.map((stay, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  src={stay.image}
                  alt={stay.title}
                  style={{
                    height: 200,
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
              }
              style={{
                borderRadius: 12,
                overflow: "hidden",
                transition: "transform 0.3s ease",
              }}
              bodyStyle={{ padding: "16px 20px" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Title level={4} style={{ marginBottom: 8 }}>
                {stay.title}
              </Title>
              <Paragraph type="secondary">{stay.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Button type="primary" size="large">
          View More Unique Stays
        </Button>
      </div>
    </section>
  );
};

export default UniqueStays;
