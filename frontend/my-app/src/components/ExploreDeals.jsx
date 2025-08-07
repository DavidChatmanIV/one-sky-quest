import React from "react";
import { Tabs, Card, Row, Col, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const deals = {
  Flights: [
    { from: "New York", to: "Paris", price: 399, img: "/images/ny-paris.jpg" },
    {
      from: "Los Angeles",
      to: "Tokyo",
      price: 499,
      img: "/images/la-tokyo.jpg",
    },
  ],
  Hotels: [
    { from: "Paris", to: "", price: 199, img: "/images/paris-hotel.jpg" },
    { from: "Tokyo", to: "", price: 299, img: "/images/tokyo-hotel.jpg" },
  ],
  Packages: [
    { from: "NYC", to: "Rome", price: 899, img: "/images/ny-rome.jpg" },
    { from: "LA", to: "London", price: 799, img: "/images/la-london.jpg" },
  ],
};

const ExploreDeals = () => {
  return (
    <section style={{ background: "#f9f9f9", padding: "40px 16px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        🔍 Explore Travel Deals by Type
      </Title>

      <Tabs defaultActiveKey="Flights" centered>
        {Object.entries(deals).map(([type, items]) => (
          <Tabs.TabPane tab={type} key={type}>
            <Row gutter={[24, 24]} justify="center">
              {items.map((deal, i) => (
                <Col xs={24} sm={12} md={8} key={i}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={`${deal.from} to ${deal.to}`}
                        src={deal.img}
                        style={{
                          height: 180,
                          objectFit: "cover",
                          borderRadius: "8px 8px 0 0",
                        }}
                      />
                    }
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Title level={4} style={{ marginBottom: 4 }}>
                      {deal.from} → {deal.to} ✈️
                    </Title>
                    <Text strong style={{ fontSize: 18 }}>
                      ${deal.price}
                    </Text>
                    <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
                      Limited-time offer <ArrowRightOutlined />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </section>
  );
};

export default ExploreDeals;
