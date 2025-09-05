import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Typography,
  Space,
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import "../styles/team-travel.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function TeamTravelPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // TODO: wire to your generator logic
    console.log("Team travel values:", values);
  };

  return (
    <div className="tt-wrap">
      {/* Top bar with Home */}
      <div className="tt-header">
        <Space size={10} className="tt-left">
          <Link to="/" className="tt-home-btn">
            <HomeOutlined />
            <span>Home</span>
          </Link>
          <div className="tt-sep" />
          <Text className="tt-breadcrumb">Team Travel</Text>
        </Space>
      </div>

      <main className="tt-main">
        <Card className="tt-card" bordered={false}>
          <div className="tt-title">
            <TeamOutlined />
            <Title level={2} className="tt-h2">
              Team Travel Planner
            </Title>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="tt-form"
            initialValues={{ travelers: 10 }}
          >
            <Form.Item
              name="groupName"
              label="Team / Family Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a team or family name",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="E.g., Johnson Family Reunion"
                className="tt-input"
              />
            </Form.Item>

            <Form.Item
              name="travelers"
              label="Number of Travelers"
              rules={[
                { required: true, message: "Please enter the group size" },
              ]}
            >
              <InputNumber
                size="large"
                min={1}
                className="tt-input-number"
                placeholder="10"
              />
            </Form.Item>

            <Form.Item
              name="destination"
              label="Destination"
              rules={[{ required: true, message: "Please add a destination" }]}
            >
              <Input
                size="large"
                prefix={<EnvironmentOutlined />}
                placeholder="E.g., Cancun, Mexico"
                className="tt-input"
              />
            </Form.Item>

            <Form.Item
              name="dates"
              label="Preferred Travel Dates"
              rules={[{ required: true, message: "Choose a date range" }]}
            >
              <RangePicker
                size="large"
                className="tt-range"
                suffixIcon={<CalendarOutlined />}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" size="large" className="tt-submit">
                Generate Options
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </main>
    </div>
  );
}
