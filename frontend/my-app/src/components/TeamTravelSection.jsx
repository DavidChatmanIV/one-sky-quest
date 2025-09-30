import React from "react";
import { Card, Button, Typography } from "antd";
import { TeamOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const TeamTravelSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16 px-4 sm:px-8 md:px-16 lg:px-32">
      <Card
        variant="borderless"
        className="rounded-2xl shadow-lg text-center"
        style={{ background: "#f9fafb" }}
      >
        <Button type="primary" size="large" ghost className="mb-4">
          🧢 Team Travel?
        </Button>

        <Title level={3}>
          <TeamOutlined /> Plan as a Team. Travel as One.
        </Title>

        <Paragraph type="secondary" className="text-base max-w-xl mx-auto">
          Whether you're organizing a school trip, team retreat, or family
          reunion — we’ll help you coordinate stays and flights that fit
          everyone’s schedule.
        </Paragraph>

        <Button
          type="primary"
          shape="round"
          icon={<CalendarOutlined />}
          size="large"
          onClick={() => navigate("/team-travel")}
          className="mt-6 hover:scale-105 transition-transform duration-300"
        >
          Help Me Coordinate
        </Button>
      </Card>
    </section>
  );
};

export default TeamTravelSection;
