import React from "react";
import { Card, Col, Row } from "antd";

const mockDestinations = [
  { name: "Tokyo", image: "/images/tokyo.jpg" },
  { name: "Santorini", image: "/images/santorini.jpg" },
  { name: "Bali", image: "/images/bali.jpg" },
];

const DreamDestinations = () => {
  return (
    <Row gutter={[16, 16]}>
      {mockDestinations.map((dest) => (
        <Col xs={24} sm={12} md={8} key={dest.name}>
          <Card
            hoverable
            cover={<img alt={dest.name} src={dest.image} />}
            title={dest.name}
          />
        </Col>
      ))}
    </Row>
  );
};

export default DreamDestinations;
