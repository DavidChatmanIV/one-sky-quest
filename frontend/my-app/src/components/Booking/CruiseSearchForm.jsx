import React from "react";
import {
  Form,
  InputNumber,
  Select,
  DatePicker,
  Radio,
  Button,
  Row,
  Col,
  Typography,
  Card,
} from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const CruiseSearchForm = ({ onSearch }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Cruise search values:", values);
    if (onSearch) onSearch(values);
  };

  return (
    <Card
      className="shadow-md"
      style={{
        maxWidth: 800,
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: "16px",
      }}
    >
      <Title level={3} className="text-center mb-6">
        🛳️ Cruise Search Form
      </Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        initialValues={{ roomType: "balcony", passengers: 2 }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="departurePort"
              label="Departure Port"
              rules={[{ required: true, message: "Select departure port" }]}
            >
              <Select placeholder="Select a port">
                <Option value="miami">Miami, FL</Option>
                <Option value="ft-lauderdale">Fort Lauderdale, FL</Option>
                <Option value="new-york">New York, NY</Option>
                <Option value="los-angeles">Los Angeles, CA</Option>
                <Option value="seattle">Seattle, WA</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="destination"
              label="Destination Region"
              rules={[{ required: true, message: "Choose a region" }]}
            >
              <Select placeholder="Where are you headed?">
                <Option value="caribbean">Caribbean</Option>
                <Option value="mediterranean">Mediterranean</Option>
                <Option value="alaska">Alaska</Option>
                <Option value="europe">Northern Europe</Option>
                <Option value="asia">Asia</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="cruiseLine"
              label="Cruise Line"
              rules={[{ required: true, message: "Pick a cruise line" }]}
            >
              <Select placeholder="Select cruise line">
                <Option value="royal">Royal Caribbean</Option>
                <Option value="carnival">Carnival</Option>
                <Option value="norwegian">Norwegian</Option>
                <Option value="disney">Disney Cruise Line</Option>
                <Option value="msc">MSC Cruises</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="travelDates"
              label="Travel Dates"
              rules={[{ required: true, message: "Choose your travel dates" }]}
            >
              <RangePicker className="w-full" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="roomType"
              label="Room Type"
              rules={[{ required: true, message: "Pick a room type" }]}
            >
              <Radio.Group>
                <Radio.Button value="interior">Interior</Radio.Button>
                <Radio.Button value="oceanview">Oceanview</Radio.Button>
                <Radio.Button value="balcony">Balcony</Radio.Button>
                <Radio.Button value="suite">Suite</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="passengers"
              label="Number of Passengers"
              rules={[{ required: true, message: "Enter passenger count" }]}
            >
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit" size="large">
            Search Cruises
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CruiseSearchForm;
