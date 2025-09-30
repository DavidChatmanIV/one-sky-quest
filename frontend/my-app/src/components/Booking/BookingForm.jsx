import React, { useEffect, useMemo } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Tag,
} from "antd";
import { RocketOutlined, HomeOutlined, GiftOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const BUNDLE_TYPES = [
  { label: "✈️ Flight + 🏨 Hotel", value: "flight_hotel" },
  { label: "✈️ Flight + 🏨 Hotel + 🚗 Car", value: "flight_hotel_car" },
  { label: "🏨 Hotel + 🚗 Car", value: "hotel_car" },
];

export default function PackageSearchForm({ onSearch }) {
  const [form] = Form.useForm();

  const DEFAULTS = useMemo(
    () => ({
      bundleType: "flight_hotel",
      origin: "EWR",
      destination: "MIA",
      travelers: 2,
      rooms: 1,
      dates: null,
    }),
    []
  );

  useEffect(() => {
    onSearch?.(DEFAULTS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    const values = await form.validateFields();
    onSearch?.(values);
  };

  return (
    <Card
      bordered={false}
      className="osq-packages-form osq-search-card"
      style={{ background: "var(--surface, #141628)" }}
      bodyStyle={{ padding: 16 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        initialValues={DEFAULTS}
        validateTrigger="onBlur"
      >
        <Row gutter={12}>
          <Col xs={24} md={8}>
            <Form.Item
              name="bundleType"
              label="Bundle"
              rules={[{ required: true }]}
            >
              <Select
                options={BUNDLE_TYPES}
                suffixIcon={<GiftOutlined />}
                popupMatchSelectWidth={240}
                dropdownClassName="osq-dark-dropdown"
                popupClassName="osq-dark-dropdown"
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </Form.Item>
          </Col>

          <Col xs={12} md={4}>
            <Form.Item
              name="origin"
              label="From"
              tooltip="City or airport"
              rules={[{ required: true, message: "Enter an origin" }]}
            >
              <Input prefix={<RocketOutlined />} placeholder="EWR" />
            </Form.Item>
          </Col>

          <Col xs={12} md={4}>
            <Form.Item
              name="destination"
              label="To"
              tooltip="City or airport"
              rules={[{ required: true, message: "Enter a destination" }]}
            >
              <Input prefix={<HomeOutlined />} placeholder="MIA" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item name="dates" label="Dates">
              <RangePicker
                allowEmpty={[true, true]}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={12} md={4}>
            <Form.Item
              name="travelers"
              label="Travelers"
              rules={[{ required: true, message: "Enter travelers" }]}
            >
              <InputNumber
                min={1}
                max={12}
                step={1}
                precision={0}
                controls
                keyboard
                inputMode="numeric"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={12} md={4}>
            <Form.Item
              name="rooms"
              label="Rooms"
              rules={[{ required: true, message: "Enter rooms" }]}
            >
              <InputNumber
                min={1}
                max={8}
                step={1}
                precision={0}
                controls
                keyboard
                inputMode="numeric"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={16} style={{ display: "flex", alignItems: "end" }}>
            <div style={{ width: "100%", display: "flex", gap: 8 }}>
              <Tag style={{ alignSelf: "center" }} color="orange">
                Bundled deals save vs. booking separately
              </Tag>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: "auto" }}
              >
                Find Packages
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
