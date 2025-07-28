import React from "react";
import { Typography } from "antd";
import "./HeroSection.css";

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  return (
    <div className="hero-container" data-aos="fade-in">
      <img src="/images/beach-hero.jpg" alt="Beach" className="hero-image" />
      <div className="hero-overlay">
        <Title level={1} style={{ color: "#fff" }}>
          Discover Your Next Adventure
        </Title>
        <Paragraph style={{ color: "#dce8f2", fontSize: "1.2rem" }}>
          Plan smarter, travel farther, live better.
        </Paragraph>
      </div>
    </div>
  );
};

export default HeroSection;
