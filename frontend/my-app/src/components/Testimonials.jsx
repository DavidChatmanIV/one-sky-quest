import React from "react";
import { Typography, Card, Row, Col, Rate } from "antd";

const { Title, Paragraph } = Typography;

const testimonials = [
  {
    name: "Sarah M.",
    feedback:
      "One Sky Quest helped me find the perfect solo trip to Bali. The AI planner nailed it!",
    rating: 5,
  },
  {
    name: "Jake T.",
    feedback:
      "Booked my family’s spring break in minutes. Great deals, great UX.",
    rating: 4,
  },
  {
    name: "Nina P.",
    feedback:
      "The team travel tool was a game changer for our soccer club’s travel planning.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-10 px-4" style={{ background: "#fff" }}>
      <Title level={2} className="text-center">
        🗣️ What Travelers Are Saying?
      </Title>
      <Paragraph className="text-center">
        Real stories from real adventurers using One Sky Quest.
      </Paragraph>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: 24 }}>
        {testimonials.map((review, index) => (
          <Col xs={24} md={8} key={index}>
            <Card>
              <Paragraph>"{review.feedback}"</Paragraph>
              <Rate disabled defaultValue={review.rating} />
              <Paragraph strong style={{ marginTop: 8 }}>
                {review.name}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Testimonials;
