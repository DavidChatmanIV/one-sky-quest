import React from "react";
import { Form, Input, Button, Row, Col, Typography, Card } from "antd";

const { Title } = Typography;

// ✅ Props: setStayResults, selectedType, showToast
const StaySearchForm = ({
  setStayResults,
  selectedType = "hotel",
  showToast,
}) => {
  const [form] = Form.useForm();

  const handleSearch = async (values) => {
    const { destination, dates, travelers } = values;

    try {
      const res = await fetch(
        `/api/hotels?location=${destination}&type=${selectedType}`
      );
      const stays = await res.json();

      if (!stays.length) {
        showToast?.("No stays found.", "info");
        setStayResults([]);
        return;
      }

      setStayResults(stays);
      showToast?.("✅ Stays loaded!");
    } catch (err) {
      console.error("Stay search failed:", err);
      showToast?.("❌ Failed to load stays.", "error");
    }
  };

  return (
    <Card className="max-w-5xl mx-auto mt-12 shadow-md">
      <Title level={3} className="text-center text-blue-700">
        🔍 Search Stays
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        className="mt-6"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="destination"
              label="Where to?"
              rules={[{ required: true, message: "Enter a destination" }]}
            >
              <Input placeholder="City or Country" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="dates"
              label="Check-in / Check-out"
              rules={[{ required: true, message: "Enter travel dates" }]}
            >
              <Input placeholder="e.g. Jul 10 – Jul 15" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="travelers"
              label="Travelers"
              rules={[{ required: true, message: "Enter travelers info" }]}
            >
              <Input placeholder="2 travelers, 1 room" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="bg-blue-600 hover:bg-blue-700"
              >
                🔍 Search
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default StaySearchForm;
