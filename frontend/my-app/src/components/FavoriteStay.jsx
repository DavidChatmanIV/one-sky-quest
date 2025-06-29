import React from "react";
import { Typography, Row, Col, Card, Tag, Button } from "antd";

const { Title, Paragraph } = Typography;

const featuredStays = [
  {
    title: "✨ Santorini Cliffside Villa",
    location: "Greece",
    img: "https://source.unsplash.com/500x300/?santorini,villa",
    tag: "Luxury",
  },
  {
    title: "🏜️ Desert Dome Retreat",
    location: "Utah, USA",
    img: "https://source.unsplash.com/500x300/?desert,glamping",
    tag: "Glamping",
  },
  {
    title: "🏔️ Alpine Chalet Hideaway",
    location: "Switzerland",
    img: "https://source.unsplash.com/500x300/?alps,chalet",
    tag: "Cozy",
  },
];

const FavoriteStay = () => {
  return (
    <section className="py-14 px-4 bg-white" data-aos="fade-up">
      <div className="text-center mb-12">
        <Title level={2}>🌟 Discover Your New Favorite Stay</Title>
        <Paragraph>
          Handpicked properties designed for dream getaways and unforgettable
          experiences.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {featuredStays.map((stay, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  src={stay.img}
                  alt={stay.title}
                  style={{
                    height: 200,
                    objectFit: "cover",
                    borderRadius: "12px 12px 0 0",
                  }}
                />
              }
            >
              <Tag color="gold">{stay.tag}</Tag>
              <Title level={4}>{stay.title}</Title>
              <Paragraph type="secondary">{stay.location}</Paragraph>
              <Button type="primary" size="small">
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
