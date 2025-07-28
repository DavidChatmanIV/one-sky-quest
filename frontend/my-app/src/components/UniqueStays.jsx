import React from "react";
import { Typography, Card, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const stays = [
  {
    title: "Treehouse in Costa Rica 🌴",
    description: "Live among the trees with stunning views of the rainforest.",
    image: "https://source.unsplash.com/400x250/?treehouse,nature",
  },
  {
    title: "Glass Igloo in Finland ❄️",
    description: "Sleep under the stars and Northern Lights in comfort.",
    image: "https://source.unsplash.com/400x250/?igloo,finland",
  },
];

const UniqueStay = () => {
  return (
    <section style={{ padding: "60px 20px", background: "#f7f7f7" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        🌟 Explore Unique Stays
      </Title>
      <Paragraph
        style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 40px" }}
      >
        Find extraordinary accommodations that turn every night into an
        experience.
      </Paragraph>
      <Row gutter={[24, 24]} justify="center">
        {stays.map((stay, idx) => (
          <Col xs={24} sm={12} md={8} lg={6} key={idx}>
            <Card hoverable cover={<img alt={stay.title} src={stay.image} />}>
              <Card.Meta title={stay.title} description={stay.description} />
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default UniqueStay;
