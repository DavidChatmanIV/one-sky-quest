import React from "react";
import {
  Typography,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Form,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Booking = () => {
  const onFinish = (values) => {
    console.log("Search criteria:", values);
    // Later: navigate or send to backend
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <Title level={2} className="text-center mb-2">
          🏨 Book Your Next Stay
        </Title>
        <Paragraph className="text-center mb-8">
          Search for the best hotels, flights, and packages — all in one place.
        </Paragraph>

        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="destination"
                label="Destination"
                rules={[{ required: true }]}
              >
                <Input placeholder="Where do you want to go?" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="dates"
                label="Travel Dates"
                rules={[{ required: true }]}
              >
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="travelers"
                label="Travelers"
                rules={[{ required: true }]}
              >
                <Select placeholder="Number of travelers">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Option key={num} value={num}>
                      {num}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={24} className="text-center mt-4">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
                size="large"
              >
                Search Deals
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Booking;
