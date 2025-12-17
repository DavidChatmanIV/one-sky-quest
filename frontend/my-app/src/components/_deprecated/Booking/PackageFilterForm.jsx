import React from "react";
import { Form, Input, Select, Button, Row, Col, Typography, Card } from "antd";

const { Title } = Typography;
const { Option } = Select;

const PackageFilterForm = ({ setPackageResults, showToast }) => {
  const [form] = Form.useForm();

  const handleSearch = async (values) => {
    const query = new URLSearchParams(values).toString();

    try {
      const res = await fetch(`/api/packages?${query}`);
      const packages = await res.json();

      if (!packages.length) {
        showToast?.("No packages found.", "info");
        setPackageResults([]);
        return;
      }

      setPackageResults(packages);
      showToast?.("✅ Packages loaded!");
    } catch (err) {
      console.error("Package fetch error:", err);
      showToast?.("❌ Failed to load packages.", "error");
    }
  };

  return (
    <Card className="max-w-5xl mx-auto mt-12 shadow-md">
      <Title level={3} className="text-center text-blue-700">
        📦 Explore Travel Packages
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        className="mt-6"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item name="destination" label="Destination">
              <Input placeholder="e.g. Rome" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item name="type" label="Type">
              <Select placeholder="Any Type">
                <Option value="">Any Type</Option>
                <Option value="luxury">Luxury</Option>
                <Option value="adventure">Adventure</Option>
                <Option value="romantic">Romantic</Option>
                <Option value="family">Family</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item name="maxPrice" label="Max Price">
              <Select placeholder="Choose max price">
                <Option value="500">$500</Option>
                <Option value="1000">$1000</Option>
                <Option value="2000">$2000</Option>
              </Select>
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
                Apply Filters
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default PackageFilterForm;
