import React, { useState } from "react";
import { Typography, Form, Input, Button, Select, Collapse, Space } from "antd";
import { HomeOutlined, RocketOutlined, RobotOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAssistant } from "../context/AssistantContext"; 
import "../styles/SmartPlan.css";

const { Title, Text } = Typography;
const { Option } = Select;

/* ------------ Options ------------ */
const FLIGHT_CLASSES = ["Economy", "Premium Economy", "Business", "First"];

const FOOD_PLAN_OPTIONS = [
  { label: "All-inclusive", value: "all-inclusive" },
  { label: "Pay per meal", value: "pay-per-meal" },
  { label: "Room service focused", value: "room-service" },
];

/* ------------ Component ------------ */
export default function TravelAssistant() {
  const { assistant } = useAssistant();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // NEW: which preset is selected
  const [selectedPreset, setSelectedPreset] = useState(null);

  // NEW: apply preset & highlight
  const applyPreset = (key) => {
    const presets = {
      solo: {
        destination: "Paris",
        days: 3,
        flightClass: "Economy",
      },
      friends: {
        destination: "Barcelona",
        days: 5,
        flightClass: "Economy",
      },
      luxury: {
        destination: "Maldives",
        days: 7,
        flightClass: "Business",
      },
    };
    form.setFieldsValue(presets[key] || {});
    setSelectedPreset(key);
  };

  const onFinish = (values) => {
    console.log("Trip form:", values);
    setLoading(true);
    setTimeout(() => setLoading(false), 1500); // mock API delay
  };

  return (
    <div className="ta-wrap">
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* Home Button */}
        <Link to="/" className="ta-home">
          <HomeOutlined /> Home
        </Link>

        {/* Heading */}
        <Title level={3} style={{ color: "white", margin: 0 }}>
          ✨ Build Your Perfect Trip with AI
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.85)" }}>
          You’re using <b>{assistant.toLowerCase()}</b>. Switch anytime in the
          navbar.
        </Text>

        {/* Quick start */}
        <div className="ta-prefills ta-quickstart">
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>
            Quick start <i>(optional)</i>
          </Text>
          <Space wrap>
            <Button
              className={selectedPreset === "solo" ? "active" : ""}
              onClick={() => applyPreset("solo")}
            >
              Solo Travel
            </Button>
            <Button
              className={selectedPreset === "friends" ? "active" : ""}
              onClick={() => applyPreset("friends")}
            >
              Friends Trip
            </Button>
            <Button
              className={selectedPreset === "luxury" ? "active" : ""}
              onClick={() => applyPreset("luxury")}
            >
              Luxury Escape
            </Button>
          </Space>
          <Text type="secondary" style={{ color: "rgba(255,255,255,0.6)" }}>
            Or skip this and fill in the fields below.
          </Text>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="ta-glass"
        >
          <Form.Item
            label={<span style={{ color: "white" }}>Destination</span>}
            name="destination"
            rules={[{ required: true, message: "Enter a destination" }]}
          >
            <Input placeholder="Where do you want to go? (e.g., Tokyo)" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "white" }}>Trip Length (days)</span>}
            name="days"
            rules={[{ required: true, message: "Enter trip length" }]}
          >
            <Input placeholder="e.g., 5" type="number" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "white" }}>Flight Class</span>}
            name="flightClass"
          >
            <Select
              placeholder="Select flight class"
              popupClassName="ta-select-dark"
            >
              {FLIGHT_CLASSES.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Collapse ghost>
            <Collapse.Panel
              header={
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  More options (budget, vibe, food, activity)
                </span>
              }
              key="more"
            >
              <Form.Item
                label={<span style={{ color: "white" }}>Food Plan</span>}
                name="foodPlan"
              >
                <Select
                  placeholder="Select food plan"
                  options={FOOD_PLAN_OPTIONS}
                  popupClassName="ta-select-dark"
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: "white" }}>Budget Range</span>}
                name="budget"
              >
                <Input placeholder="e.g., under $1000" />
              </Form.Item>

              <Form.Item
                label={
                  <span style={{ color: "white" }}>Preferred Activities</span>
                }
                name="activities"
              >
                <Input placeholder="e.g., hiking, museums, nightlife" />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={
                  assistant === "Questy" ? (
                    <RocketOutlined />
                  ) : (
                    <RobotOutlined />
                  )
                }
              >
                {loading
                  ? "Generating..."
                  : assistant === "Questy"
                  ? "Quick Generate"
                  : "Generate My Trip"}
              </Button>
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
}
