import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";

const { Title } = Typography;

const BookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { name, email, tripDetails } = values;
    setLoading(true);

    try {
      const res = await fetch("/api/bookings/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          tripDetails,
          type: "hotel", // can be dynamic later
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      message.success(data.message || "✅ Booking confirmed!");
      localStorage.setItem(
        "savedTrips",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("savedTrips") || "[]"),
          { name, email, tripDetails },
        ])
      );

      form.resetFields();
    } catch (err) {
      console.error("Booking error:", err);
      message.error("❌ There was a problem booking your trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="max-w-2xl mx-auto shadow-lg"
      bodyStyle={{ padding: "2rem" }}
    >
      <Title level={3} className="text-center mb-6">
        🗓️ Book Your Trip
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Form.Item
          name="name"
          label="Your Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Your Name" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Your Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="Your Email" size="large" />
        </Form.Item>

        <Form.Item
          name="tripDetails"
          label="Trip Details"
          rules={[{ required: true, message: "Enter trip details" }]}
        >
          <Input.TextArea
            placeholder="Trip Details..."
            rows={4}
            size="large"
            className="resize-none"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Book Now
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BookingForm;
