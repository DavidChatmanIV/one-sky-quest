// /src/components/FeaturedTrips.jsx
import React from "react";
import { Card, Row, Col, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const trips = [
  {
    title: "Bali Bliss 🌴",
    image: "https://source.unsplash.com/400x300/?bali,beach",
    description: "Relax on world-class beaches with jungle escapes.",
    link: "/book?dest=bali",
  },
  {
    title: "Tokyo Adventure 🗼",
    image: "https://source.unsplash.com/400x300/?tokyo,city",
    description: "Dive into a vibrant culture and futuristic city life.",
    link: "/book?dest=tokyo",
  },
  {
    title: "Rome Romance 🇮🇹",
    image: "https://source.unsplash.com/400x300/?rome,italy",
    description: "Experience timeless beauty, history, and pasta.",
    link: "/book?dest=rome",
  },
];

const FeaturedTrips = () => {
  return (
    <section style={{ padding: "4rem 1rem", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <Title level={2}>🌍 Featured Trips</Title>
        <Paragraph>
          Discover our most popular destinations hand-picked by travelers like
          you.
        </Paragraph>

        <Row gutter={[24, 24]} justify="center" style={{ marginTop: "2rem" }}>
          {trips.map((trip, index) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              key={trip.title}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            >
              <Card
                hoverable
                cover={
                  <img
                    alt={trip.title}
                    src={trip.image}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                  />
                }
              >
                <Card.Meta
                  title={trip.title}
                  description={
                    <div style={{ marginTop: "0.5rem" }}>
                      <p>{trip.description}</p>
                      <Button
                        type="link"
                        href={trip.link}
                        style={{ padding: 0 }}
                      >
                        Explore →
                      </Button>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default FeaturedTrips;
