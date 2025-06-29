import React from "react";
import { Typography, Row, Col, Button } from "antd";

const { Title, Paragraph } = Typography;

const SocialCommunity = () => {
  return (
    <section style={{ background: "#fafafa", padding: "60px 20px" }}>
      <Row justify="center">
        <Col xs={24} md={20} lg={16}>
          <Title level={2} style={{ textAlign: "center" }}>
            👥 Social & Community
          </Title>
          <Paragraph style={{ textAlign: "center" }}>
            Connect with travelers, share your experiences, and join group
            adventures. One Sky Quest isn’t just a platform — it's a movement.
          </Paragraph>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Button type="primary" size="large">
              Join the Quest Feed
            </Button>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default SocialCommunity;
