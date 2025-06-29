import React from "react";
import { Typography, Card, Form, Input, Select, Button, Row, Col } from "antd";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const BuildMyDreamTrip = () => {
  return (
    <section className="py-12 px-4" style={{ backgroundColor: "#f5f5f5" }}>
      <Title level={2} className="text-center">
        🌟 Build My Dream Trip
      </Title>
      <Paragraph
        className="text-center"
        style={{ maxWidth: 600, margin: "0 auto 2rem" }}
      >
        Share your dream destination, budget, and vibe — and we’ll help you
        craft the perfect getaway.
      </Paragraph>

      <Row justify="center">
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 12 }}>
            <Form layout="vertical">
              <Form.Item label="Dream Destination">
                <Input placeholder="Bali, Tokyo, Greece..." />
              </Form.Item>

              <Form.Item label="Budget ($)">
                <Input type="number" placeholder="e.g. 1500" />
              </Form.Item>

              <Form.Item label="Trip Vibe">
                <Select placeholder="Choose your vibe">
                  <Option value="luxury">🌟 Luxury</Option>
                  <Option value="adventure">⛰️ Adventure</Option>
                  <Option value="romantic">💖 Romantic</Option>
                  <Option value="chill">🌴 Chill & Relaxed</Option>
                  <Option value="cultural">🏛️ Cultural</Option>
                </Select>
              </Form.Item>

              <Button type="primary" block>
                Build My Dream Trip
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default BuildMyDreamTrip;
