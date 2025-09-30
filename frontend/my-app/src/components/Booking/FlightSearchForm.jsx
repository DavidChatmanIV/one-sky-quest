import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Typography,
  Card,
} from "antd";

const { Title } = Typography;

const FlightSearchForm = ({ setFlightResults, showToast }) => {
  const [form] = Form.useForm();

  const handleSearch = async (values) => {
    const { from, to, dates, travelers } = values;

    try {
      const res = await fetch(
        `/api/flights?from=${from}&to=${to}&dates=${dates}&travelers=${travelers}`
      );
      const flights = await res.json();

      if (!flights.length) {
        showToast?.("No flights found.", "info");
        setFlightResults([]);
        return;
      }

      setFlightResults(flights);
      showToast?.("✅ Flights loaded!");
    } catch (err) {
      console.error("Flight search failed:", err);
      showToast?.("❌ Failed to load flights.", "error");
    }
  };

  return (
    <Card className="max-w-5xl mx-auto mt-12 shadow-md">
      <Title level={3} className="text-center text-blue-700">
        ✈️ Find Flights
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        className="mt-6"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              name="from"
              label="From"
              rules={[{ required: true, message: "Enter departure location" }]}
            >
              <Input placeholder="City or Airport" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item
              name="to"
              label="To"
              rules={[{ required: true, message: "Enter destination" }]}
            >
              <Input placeholder="City or Airport" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item
              name="dates"
              label="Dates"
              rules={[{ required: true, message: "Enter travel dates" }]}
            >
              <Input placeholder="e.g. Jul 1 – Jul 5" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item
              name="travelers"
              label="Travelers"
              initialValue={1}
              rules={[{ required: true, message: "Enter number of travelers" }]}
            >
              <InputNumber min={1} className="w-full" />
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
                Search Flights
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FlightSearchForm;
