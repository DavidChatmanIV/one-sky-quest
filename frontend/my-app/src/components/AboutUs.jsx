import React from "react";
import { Typography, Card } from "antd";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <section className="bg-white py-12 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <Card bordered className="shadow-lg">
          <Title level={2}>About One Sky Quest</Title>
          <Paragraph>
            One Sky Quest was born from the idea that travel should be seamless,
            fun, and full of discovery. Whether you're planning a solo
            adventure, a romantic escape, or a team getaway — our platform
            combines intelligent tools, vibrant communities, and smart budgeting
            so you can focus on what matters most: the experience.
          </Paragraph>
          <Paragraph>
            Our team is made up of passionate explorers, tech lovers, and
            problem solvers — all working to build a better way to travel. We
            believe everyone deserves amazing trips without the hassle.
          </Paragraph>
        </Card>
      </div>
    </section>
  );
};

export default AboutUs;
