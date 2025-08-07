import React from "react";
import { Typography, Form, Input, Button, DatePicker } from "antd";

const { Title } = Typography;

const TeamTravelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-8 md:px-16">
      <Title level={2} className="text-center mb-8">
        🧳 Team Travel Planner
      </Title>
      <Form
        layout="vertical"
        className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md"
      >
        <Form.Item label="Team / Family Name" name="groupName">
          <Input placeholder="E.g., Johnson Family Reunion" />
        </Form.Item>

        <Form.Item label="Number of Travelers" name="travelers">
          <Input type="number" min={1} placeholder="10" />
        </Form.Item>

        <Form.Item label="Destination" name="destination">
          <Input placeholder="E.g., Cancun, Mexico" />
        </Form.Item>

        <Form.Item label="Preferred Travel Dates" name="dates">
          <DatePicker.RangePicker className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" size="large" block>
            Generate Options
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TeamTravelPage;
