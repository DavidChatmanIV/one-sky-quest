import React from "react";
import { Typography, Form, Input, Button, Row, Col, message } from "antd";

const { Title, Paragraph } = Typography;

const ContactUs = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Contact Form Submitted:", values);
    message.success("Thanks for reaching out! We'll get back to you shortly.");
    form.resetFields();
  };

  return (
    <section style={{ padding: "60px 20px", background: "#f5f5f5" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        📬 Contact Us
      </Title>
      <Paragraph
        style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 40px" }}
      >
        Have a question or need help with your trip? Reach out to our friendly
        support team anytime.
      </Paragraph>

      <Row justify="center">
        <Col xs={24} sm={20} md={14} lg={12}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Your name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: "Please enter a message" }]}
            >
              <Input.TextArea rows={5} placeholder="How can we help?" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </section>
  );
};

export default ContactUs;
