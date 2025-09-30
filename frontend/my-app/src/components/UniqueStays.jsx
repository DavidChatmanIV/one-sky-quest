import React, { useState } from "react";
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
  // simple local hover index to raise the hovered card
  const [hoverIdx, setHoverIdx] = useState(-1);

  return (
    <section
      id="unique-stays"
      style={{
        background: "#f8f9fa",
        padding: "60px 20px",
        overflow: "visible",
        scrollMarginTop: "var(--nav-h, 64px)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          🌟 Explore Unique Stays
        </Title>
        <Paragraph style={{ maxWidth: 600, margin: "0 auto", fontSize: 16 }}>
          Find extraordinary accommodations that turn every night into an
          experience.
        </Paragraph>
      </div>

      <Row
        gutter={[24, 24]}
        justify="center"
        style={{ overflow: "visible" }} // prevent hover clipping
      >
        {stays.map((stay, index) => (
          <Col
            xs={24}
            sm={12}
            md={8}
            key={index}
            style={{ overflow: "visible" }}
          >
            <Card
              hoverable
              cover={
                <img
                  src={stay.image}
                  alt={stay.title}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    display: "block",
                  }}
                  loading="lazy"
                />
              }
              style={{
                borderRadius: 12,
                // ⚠️ removed overflow: "hidden" to avoid clipping on hover
                transform:
                  hoverIdx === index ? "translateY(-4px) scale(1.03)" : "none",
                boxShadow:
                  hoverIdx === index
                    ? "0 14px 28px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.06)"
                    : "0 6px 14px rgba(0,0,0,0.05)",
                transition: "transform .25s ease, box-shadow .25s ease",
                willChange: "transform",
                position: "relative",
                zIndex: hoverIdx === index ? 3 : 1,
                background: "#fff",
              }}
              bodyStyle={{ padding: "16px 20px", overflow: "visible" }}
              onMouseEnter={() => setHoverIdx(index)}
              onMouseLeave={() => setHoverIdx(-1)}
            >
              <Title level={4} style={{ marginBottom: 8 }}>
                {stay.title}
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {stay.desc}
              </Paragraph>
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
