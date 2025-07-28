import React from "react";
import { Typography, Card, Row, Col, Button, Input, message } from "antd";

const { Title, Paragraph } = Typography;

const gems = [
  {
    title: "Giethoorn, Netherlands 🇳🇱",
    desc: "No roads, just canals. A peaceful village where you paddle to dinner.",
    image: "/images/gem-giethoorn.jpg",
  },
  {
    title: "Chefchaouen, Morocco 🇲🇦",
    desc: "A hidden mountain town painted entirely in shades of blue.",
    image: "/images/gem-chefchaouen.jpg",
  },
];

const HiddenGemFinder = () => {
  const handleSubmit = () => {
    message.success("Thanks! Your hidden gem was submitted.");
  };

  return (
    <section className="py-10 px-4" style={{ background: "#f9f9f9" }}>
      <Title level={2} className="text-center">
        🗺️ Hidden Gem Finder
      </Title>
      <Paragraph
        className="text-center"
        style={{ maxWidth: 600, margin: "0 auto 2rem" }}
      >
        Uncover secret spots loved by locals. Submit your own hidden gem too!
      </Paragraph>

      <Row gutter={[24, 24]} justify="center">
        {gems.map((gem, index) => (
          <Col xs={24} sm={12} md={10} key={index}>
            <Card
              hoverable
              cover={
                <img
                  src={gem.image}
                  alt={gem.title}
                  style={{ height: 220, objectFit: "cover" }}
                />
              }
              style={{ borderRadius: 12 }}
            >
              <Title level={4}>{gem.title}</Title>
              <Paragraph>{gem.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        style={{
          marginTop: "3rem",
          maxWidth: 500,
          marginInline: "auto",
          textAlign: "center",
        }}
      >
        <Title level={4}>Know a Hidden Gem?</Title>
        <Input.TextArea
          placeholder="Type the location and what makes it special..."
          rows={3}
        />
        <Button type="primary" style={{ marginTop: 12 }} onClick={handleSubmit}>
          Submit Hidden Gem
        </Button>
      </div>
    </section>
  );
};

export default HiddenGemFinder;
