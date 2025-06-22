// /src/components/TravelAssistant.jsx
import React, { useState } from "react";
import {
  Avatar,
  Input,
  Button,
  Modal,
  Tooltip,
  Card,
  Form,
  InputNumber,
  Select,
  Typography,
  Badge,
} from "antd";
import {
  RobotOutlined,
  AudioOutlined,
  CheckCircleTwoTone,
  CloseOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const TravelAssistant = () => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(
    "Hi! I’m Questy 🌍 Where do you want to go?"
  );
  const [voice, setVoice] = useState(false);
  const [form] = Form.useForm();
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = () => {
    let answer = "Let me think... 🤔";

    if (query.toLowerCase().includes("july") && query.includes("1000")) {
      answer = "Try Bali, Portugal, or Colombia! 🇵🇹🇨🇴 All under $1000 in July.";
    } else if (query.toLowerCase().includes("hidden gem")) {
      answer =
        "Hidden Gem Alert! Check out Snaefellsnes Peninsula in Iceland 🇮🇸";
    }

    setResponse(answer);
    setQuery("");

    if (voice && window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance(answer);
      window.speechSynthesis.speak(msg);
    }
  };

  const handleFormSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      setSubmittedData(values);
      setLoading(false);
    }, 1000); // simulate loading
  };

  return (
    <>
      {/* 💬 Floating Avatar Button */}
      <Tooltip title="Need travel help?">
        <div
          className="fixed bottom-6 right-6 z-50 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setVisible(true)}
          data-aos="fade-left"
          data-aos-delay="300"
        >
          <Badge count="AI" style={{ backgroundColor: "#52c41a" }}>
            <Avatar
              size={64}
              icon={<RobotOutlined />}
              className="avatar-bounce"
              style={{ backgroundColor: "#1890ff" }}
            />
          </Badge>
        </div>
      </Tooltip>

      {/* 🧠 Questy Chat Modal */}
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        centered
        closeIcon={<CloseOutlined />}
        bodyStyle={{
          padding: "2rem",
          textAlign: "center",
          borderRadius: "12px",
        }}
      >
        <Title level={4} style={{ marginBottom: 8 }}>
          🤖 Questy, your AI Travel Buddy
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 20 }}>
          {response}
        </Paragraph>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask: Where should I go in July under $1000?"
          className="mb-3"
        />
        <Button type="primary" block onClick={handleAsk}>
          Ask Questy 🎯
        </Button>
        <Button
          type={voice ? "dashed" : "default"}
          block
          className="mt-2"
          icon={<AudioOutlined />}
          onClick={() => setVoice(!voice)}
        >
          {voice ? "Voice On 🎤" : "Voice Off"}
        </Button>
      </Modal>

      {/* ✨ Form-Based AI Trip Builder */}
      <section
        style={{
          padding: "4rem 1rem",
          background: "linear-gradient(to right, #e6f7ff, #f0f5ff)",
        }}
      >
        <Card
          style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}
          bordered={false}
          bodyStyle={{ padding: "2.5rem" }}
          data-aos="zoom-in"
        >
          <Title level={2}>✨ Build Your Perfect Trip with AI</Title>
          <Paragraph>
            Personalized travel planning — tailored to your budget, vibe, and
            destination.
          </Paragraph>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            style={{ marginTop: "2rem" }}
          >
            <Form.Item
              name="destination"
              label="Where do you want to go?"
              rules={[
                { required: true, message: "Please enter a destination" },
              ]}
            >
              <Input placeholder="e.g., Tokyo, Bali, Rome" />
            </Form.Item>

            <Form.Item
              name="budget"
              label="Your Budget ($)"
              rules={[{ required: true, message: "Please enter a budget" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={100}
                max={20000}
                step={50}
                placeholder="e.g., 1500"
              />
            </Form.Item>

            <Form.Item
              name="vibe"
              label="Trip Vibe"
              rules={[{ required: true, message: "Please select a vibe" }]}
            >
              <Select placeholder="Select vibe">
                <Option value="relaxing">🌴 Relaxing</Option>
                <Option value="adventurous">⛰️ Adventurous</Option>
                <Option value="romantic">💖 Romantic</Option>
                <Option value="cultural">🏛️ Cultural</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Generate My Trip
              </Button>
            </Form.Item>
          </Form>

          {submittedData && !loading && (
            <div
              style={{
                marginTop: "2rem",
                backgroundColor: "#f6ffed",
                padding: "1.5rem",
                borderRadius: "10px",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "1.5rem" }}
              />
              <Title level={4} style={{ marginTop: 10 }}>
                🎉 Trip Ready!
              </Title>
              <p>
                <strong>Destination:</strong> {submittedData.destination}
              </p>
              <p>
                <strong>Budget:</strong> ${submittedData.budget}
              </p>
              <p>
                <strong>Vibe:</strong> {submittedData.vibe}
              </p>
              <p style={{ fontStyle: "italic", color: "#888" }}>
                (AI suggestions coming soon!)
              </p>
            </div>
          )}
        </Card>
      </section>
    </>
  );
};

export default TravelAssistant;
