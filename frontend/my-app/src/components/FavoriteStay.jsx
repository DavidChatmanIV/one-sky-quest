import React from "react";
import { Card, Button, Tag, Typography, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const stays = [
  {
    tag: "Luxury",
    emoji: "✨",
    title: "Santorini Cliffside Villa",
    location: "Greece",
    image: "/images/santorini.jpg",
  },
  {
    tag: "Glamping",
    emoji: "🏕️",
    title: "Desert Dome Retreat",
    location: "Utah, USA",
    image: "/images/desert-dome.jpg",
  },
  {
    tag: "Cozy",
    emoji: "🏔️",
    title: "Alpine Chalet Hideaway",
    location: "Switzerland",
    image: "/images/alpine-chalet.jpg",
  },
];

const FavoriteStay = () => {
  return (
    <section style={{ padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>🌟 Discover Your New Favorite Stay</Title>
        <Paragraph style={{ color: "#555" }}>
          Handpicked properties designed for dream getaways and unforgettable
          experiences.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {stays.map((stay, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  alt={stay.title}
                  src={stay.image}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                />
              }
              style={{
                borderRadius: "8px",
              }}
            >
              <Tag color="gold" style={{ borderRadius: "12px" }}>
                {stay.emoji} {stay.tag}
              </Tag>
              <Title level={4} style={{ marginTop: "0.5rem" }}>
                {stay.emoji} {stay.title}
              </Title>
              <Paragraph style={{ color: "#777", marginBottom: "1rem" }}>
                {stay.location}
              </Paragraph>
              <Button type="primary" block>
                View Stay
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default FavoriteStay;
