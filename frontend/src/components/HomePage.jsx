// /src/components/HomePage.jsx
import React from "react";
import { Layout, Typography, Button } from "antd";
import HeroSection from "./HeroSection";
import TravelAssistant from "./TravelAssistant";
import FeaturedTrips from "./FeaturedTrips";
import ExploreDeals from "./ExploreDeals";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <Layout>
      <Content style={{ background: "#f9f9f9" }}>
        <HeroSection />

        <div
          style={{
            padding: "4rem 2rem",
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Title level={1}>🌍 Welcome to One Sky Quest</Title>
          <Paragraph style={{ fontSize: "1.2rem" }}>
            Your perfect trip starts here. Discover, plan, and book
            unforgettable adventures all in one place.
          </Paragraph>
          <Button type="primary" size="large" href="/book">
            Start Planning
          </Button>
        </div>

        <TravelAssistant />
        <FeaturedTrips />
        <ExploreDeals />
      </Content>
    </Layout>
  );
};

export default HomePage;
