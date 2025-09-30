// /src/components/ExploreDeals.jsx
import React, { useState } from "react";
import { Tabs, Card, Row, Col, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

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
      title: "Thailand Adventure 🇹🇭",
      price: "$699 package",
      image: "https://source.unsplash.com/400x250/?thailand,island",
    },
  ],
  cruises: [
    {
      title: "Caribbean Cruise 🛳️",
      price: "$599/person",
      image: "https://source.unsplash.com/400x250/?cruise,sea",
    },
    {
      title: "Mediterranean Explorer 🧭",
      price: "$899/person",
      image: "https://source.unsplash.com/400x250/?mediterranean,cruise",
    },
  ],
};

const ExploreDeals = () => {
  const [activeTab, setActiveTab] = useState("flights");

  const renderDeals = () =>
    dealsData[activeTab]?.map((deal, index) => (
      <Col
        xs={24}
        sm={12}
        md={8}
        key={index}
        data-aos="zoom-in-up"
        data-aos-delay={index * 100}
      >
        <Card
          hoverable
          cover={
            <img
              alt={deal.title}
              src={deal.image}
              style={{ height: "200px", objectFit: "cover" }}
            />
          }
        >
          <Card.Meta
            title={deal.title}
            description={
              <div style={{ marginTop: "0.5rem" }}>
                <p>{deal.price}</p>
                <Button type="link" href="/book" style={{ padding: 0 }}>
                  Book Now →
                </Button>
              </div>
            }
          />
        </Card>
      </Col>
    ));

  return (
    <section style={{ padding: "4rem 1rem", backgroundColor: "#f8f9fa" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <Title level={2}>🔎 Explore Travel Deals by Type</Title>
        <Paragraph>
          Find amazing deals tailored to your travel goals — from solo trips to
          family getaways.
        </Paragraph>

        <Tabs
          defaultActiveKey="flights"
          centered
          onChange={(key) => setActiveTab(key)}
          style={{ marginTop: "2rem" }}
          data-aos="fade-up"
          data-aos-delay="200"
          items={Object.keys(dealsData).map((key) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            key,
          }))}
        />

        <Row gutter={[24, 24]} justify="center" style={{ marginTop: "2rem" }}>
          {renderDeals()}
        </Row>
      </div>
    </section>
  );
};

export default ExploreDeals;
