import React from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Checkbox,
  Row,
  Col,
  Card,
  Divider,
  message,
} from "antd";
import { CarOutlined, SearchOutlined } from "@ant-design/icons";

// Extract Ant Design components
const { Option } = Select;

// Car type options
const carTypes = [
  "Economy",
  "Compact",
  "Midsize",
  "SUV",
  "Luxury",
  "Convertible",
  "Van",
];

// Extra services users can select
const extraOptions = [
  { label: "GPS Navigation", value: "gps" },
  { label: "Child Seat", value: "child-seat" },
  { label: "Additional Driver", value: "additional-driver" },
  { label: "Roadside Assistance", value: "roadside-assistance" },
];

const CarSearchForm = ({ onSearch }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const formatted = {
      ...values,
      pickupDate: values.pickupDate?.format("YYYY-MM-DD"),
      pickupTime: values.pickupTime?.format("HH:mm"),
      dropoffDate: values.dropoffDate?.format("YYYY-MM-DD"),
      dropoffTime: values.dropoffTime?.format("HH:mm"),
    };

    if (onSearch) {
      onSearch(formatted); // Trigger callback with search data
    }

    message.success("Searching for cars...");
  };

  return (
    <Card
      title={
        <span>
          <CarOutlined /> Car Rental Search
        </span>
      }
      bordered={false}
      style={{ marginBottom: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          carType: "Economy",
          extras: [],
        }}
      >
        {/* Location Fields */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="pickupLocation"
              label="Pick-Up Location"
              rules={[{ required: true, message: "Enter a pick-up location" }]}
            >
              <Input placeholder="e.g., Newark Airport" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="dropoffLocation"
              label="Drop-Off Location"
              rules={[{ required: true, message: "Enter a drop-off location" }]}
            >
              <Input placeholder="e.g., Manhattan" />
            </Form.Item>
          </Col>
        </Row>

        {/* Date & Time Pickers */}
        <Row gutter={16}>
          <Col xs={12} md={6}>
            <Form.Item
              name="pickupDate"
              label="Pick-Up Date"
              rules={[{ required: true, message: "Select a pick-up date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={12} md={6}>
            <Form.Item
              name="pickupTime"
              label="Pick-Up Time"
              rules={[{ required: true, message: "Select a time" }]}
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
          </Col>

          <Col xs={12} md={6}>
            <Form.Item
              name="dropoffDate"
              label="Drop-Off Date"
              rules={[{ required: true, message: "Select a drop-off date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={12} md={6}>
            <Form.Item
              name="dropoffTime"
              label="Drop-Off Time"
              rules={[{ required: true, message: "Select a time" }]}
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
          </Col>
        </Row>

        {/* Car type and extras */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="carType" label="Car Type">
              <Select>
                {carTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="extras" label="Optional Extras">
              <Checkbox.Group options={extraOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            block
          >
            Search Cars
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CarSearchForm;
