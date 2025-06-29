import React from "react";
import { Typography, Tabs, Card, Row, Col } from "antd";

const { Title } = Typography;

const dealsData = {
  flights: [
    {
      title: "New York → Paris ✈️",
      price: "$399",
      image: "https://source.unsplash.com/400x250/?airplane,travel",
    },
    {
      title: "Los Angeles → Tokyo ✈️",
      price: "$499",
      image: "https://source.unsplash.com/400x250/?japan,airplane",
    },
  ],
  hotels: [
    {
      title: "Bali Beach Resort 🏖️",
      price: "$89/night",
      image: "https://source.unsplash.com/400x250/?bali,resort",
    },
    {
      title: "Paris Boutique Hotel 🗼",
      price: "$120/night",
      image: "https://source.unsplash.com/400x250/?paris,hotel",
    },
  ],
  packages: [
    {
      title: "Rome + Amalfi Coast 🇮🇹",
      price: "$799 package",
      image: "https://source.unsplash.com/400x250/?italy,travel",
    },
    {
      title: "Thailand Explorer 🇹🇭",
      price: "$699 package",
      image: "https://source.unsplash.com/400x250/?thailand,island",
    },
  ],
};

const ExploreDeals = () => {
  return (
    <section className="bg-gray-100 py-12 px-6 text-center">
      <Title level={3}>🔎 Explore Travel Deals by Type</Title>
      <Tabs defaultActiveKey="flights" centered>
        {Object.entries(dealsData).map(([key, deals]) => (
          <Tabs.TabPane
            tab={key.charAt(0).toUpperCase() + key.slice(1)}
            key={key}
          >
            <Row gutter={[16, 16]} justify="center">
              {deals.map((deal, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <Card
                    cover={<img alt={deal.title} src={deal.image} />}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    <Card.Meta title={deal.title} description={deal.price} />
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
