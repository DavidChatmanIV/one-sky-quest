import React, { useState } from "react";
import { Typography, Form, Input, Button, DatePicker, message } from "antd";
import MultiRoomBooking from "../components/Booking/MultiRoomBooking";

const { Title } = Typography;

const TeamTravelPage = () => {
  const [form] = Form.useForm();
  const [travelers, setTravelers] = useState(null);
  const [showRooms, setShowRooms] = useState(false);
  const [, contextHolder] = message.useMessage();

  const handleGenerate = () => {
    const values = form.getFieldsValue();
    if (!values.travelers || values.travelers < 1) {
      message.error("Please enter a valid number of travelers.");
      return;
    }
    setTravelers(values.travelers);
    setShowRooms(true);
    message.success("Team trip setup started! Now assign your rooms.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-8 md:px-16">
      <Title level={2} className="text-center mb-8">
        🧳 Team Travel Planner
      </Title>

      <Form
        form={form}
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
          <Button type="primary" size="large" block onClick={handleGenerate}>
            Generate Options
          </Button>
        </Form.Item>
      </Form>

      {/* 🛏️ Room Planner appears only after Generate */}
      {showRooms && travelers && (
        <div className="max-w-4xl mx-auto mt-12">
          <MultiRoomBooking totalGuests={travelers} />
        </div>
      )}

      {contextHolder}
    </div>
  );
};

export default TeamTravelPage;
