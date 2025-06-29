import React from "react";
import { Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const TeamTravel = () => {
  return (
    <section className="text-center py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <Button type="primary" size="large" style={{ marginBottom: 16 }} ghost>
          🧢 Team Travel?
        </Button>
        <Title level={3}>Plan as a Team. Travel as One.</Title>
        <Paragraph>
          Whether you're organizing a school trip, team retreat, or family
          reunion — we’ll help you find accommodations and flights that match
          everyone’s schedule.
        </Paragraph>
        <Button type="default" size="middle">
          Help Me Coordinate
        </Button>
      </div>
    </section>
  );
};

export default TeamTravel;
