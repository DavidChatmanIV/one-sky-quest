import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Rate,
  Form,
  Input,
  Button,
  Space,
  Divider,
  message,
  Statistic,
} from "antd";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const initialTestimonials = [
  {
    name: "Sarah M.",
    feedback:
      "One Sky Quest helped me find the perfect solo trip to Bali. The AI planner nailed it!",
    rating: 5,
  },
  {
    name: "Jake T.",
    feedback:
      "Booked my family’s spring break in minutes. Great deals, great UX.",
    rating: 4,
  },
  {
    name: "Nina P.",
    feedback:
      "The team travel tool was a game changer for our soccer club’s travel planning.",
    rating: 5,
  },
];

const STORAGE_KEY = "osq_testimonials_v1";

const Testimonials = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState(initialTestimonials);

  // Load saved community reviews from localStorage and merge with defaults
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved) && saved.length) {
        setItems((prev) => [...saved, ...prev]);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const avgRating = useMemo(() => {
    if (!items.length) return 0;
    const sum = items.reduce((s, r) => s + Number(r.rating || 0), 0);
    return Math.round((sum / items.length) * 10) / 10;
  }, [items]);

  // Placeholder for wiring to your backend later
  const saveToAPI = async (payload) => {
    // await fetch("/api/testimonials", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    console.debug("Mock saveToAPI()", payload); // use payload to avoid lint warning
    return true; // simulate success
  };

  const onSubmit = async (values) => {
    const payload = {
      name: values.name.trim(),
      feedback: values.feedback.trim(),
      rating: values.rating,
      __community: true,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update + persist community reviews derived from next state
    setItems((prev) => {
      const next = [payload, ...prev];
      const nextCommunity = next.filter((i) => i.__community);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCommunity));
      return next;
    });

    try {
      await saveToAPI(payload);
      message.success("Thanks! Your review was added.");
      form.resetFields();
    } catch (err) {
      console.error("saveToAPI failed:", err);
      message.error(
        "Couldn’t save to the server. Your review is stored locally."
      );
    }
  };

  return (
    <section className="py-10 px-4" style={{ background: "#fff" }}>
      <Title level={2} className="text-center" style={{ marginBottom: 8 }}>
        🗣️ What Travelers Are Saying?
      </Title>
      <Paragraph className="text-center" style={{ marginBottom: 24 }}>
        Real stories from real adventurers using One Sky Quest.
      </Paragraph>

      {/* Summary / Add Review */}
      <Row gutter={[16, 16]} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Col xs={24} md={10}>
          <Card>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Text type="secondary">Community rating</Text>
              <Space align="center">
                <Rate disabled value={Math.round(avgRating)} />
                <Statistic value={avgRating} precision={1} suffix="/ 5" />
              </Space>
              <Text type="secondary">{items.length} total reviews</Text>
            </Space>

            <Divider />

            <Title level={4} style={{ marginTop: 0 }}>
              Add your review
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={onSubmit}
              validateTrigger={["onBlur", "onSubmit"]}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your name" },
                  { max: 40, message: "Keep it under 40 characters" },
                ]}
              >
                <Input placeholder="e.g., Jordan P." />
              </Form.Item>

              <Form.Item
                label="Rating"
                name="rating"
                rules={[{ required: true, message: "Please select a rating" }]}
              >
                <Rate />
              </Form.Item>

              <Form.Item
                label="Your feedback"
                name="feedback"
                rules={[
                  { required: true, message: "Please share a few words" },
                  { min: 10, message: "At least 10 characters" },
                  { max: 280, message: "Max 280 characters" },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={280}
                  placeholder="What did you like about One Sky Quest?"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Space>
                <Button onClick={() => form.resetFields()}>Clear</Button>
                <Button type="primary" htmlType="submit">
                  Submit review
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>

        {/* Reviews grid */}
        <Col xs={24} md={14}>
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: 0 }}>
            {items.map((review, index) => (
              <Col xs={24} sm={12} key={`${review.name}-${index}`}>
                <Card
                  styles={{ body: { minHeight: 160 } }}
                  title={
                    <Space align="center">
                      <Rate disabled value={review.rating} />
                      <Text type="secondary">
                        {Number(review.rating).toFixed(1)}
                      </Text>
                    </Space>
                  }
                  extra={<Text strong>{review.name}</Text>}
                >
                  <Paragraph style={{ marginBottom: 0 }}>
                    “{review.feedback}”
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default Testimonials;
