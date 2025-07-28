import React from "react";
import {
  Typography,
  Card,
  Input,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
} from "antd";
import {
  BulbOutlined,
  SmileOutlined,
  HeartOutlined,
  FireOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const BuildTripAI = () => {
  return (
    <section style={{ padding: "60px 20px", backgroundColor: "#ffffff" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Title level={2}>✨ Build Your Perfect Trip with AI</Title>
        <Paragraph>
          Plan smarter with personalized recommendations — all tailored to your
          vibe, budget, and goals.
        </Paragraph>
      </div>

      <Card style={{ maxWidth: 700, margin: "0 auto", borderRadius: 12 }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Input placeholder="🌍 Where do you want to go?" />
          </Col>
          <Col span={12}>
            <InputNumber
              min={100}
              max={10000}
              style={{ width: "100%" }}
              placeholder="💵 Budget ($)"
            />
          </Col>
          <Col span={12}>
            <Select placeholder="💫 Trip Vibe" style={{ width: "100%" }}>
              <Option value="relaxing">
                <SmileOutlined /> Relaxing
              </Option>
              <Option value="adventurous">
                <FireOutlined /> Adventurous
              </Option>
              <Option value="romantic">
                <HeartOutlined /> Romantic
              </Option>
              <Option value="cultural">
                <BankOutlined /> Cultural
              </Option>
            </Select>
          </Col>
          <Col span={24}>
            <Button type="primary" block icon={<BulbOutlined />}>
              Generate Itinerary
            </Button>
          </Col>
        </Row>
      </Card>
    </section>
  );
};

export default BuildTripAI;
