import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Form, Input, Button, Rate, message } from "antd";
import { StarFilled } from "@ant-design/icons";
import "../../styles/testimonials.css";

const { Title, Text } = Typography;

/* ---------------------------------------
   Utils
---------------------------------------- */
function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function getUserFromLocalStorage() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ---------------------------------------
   Constants
---------------------------------------- */
const STORAGE_KEY = "skyrio_testimonials";
const XP_REWARD = 25;

/* ---------------------------------------
   Component
---------------------------------------- */
export default function Testimonials() {
  const user = useMemo(getUserFromLocalStorage, []);
  const loggedIn = !!user;

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  const [testimonials, setTestimonials] = useState(() =>
    safeParse(localStorage.getItem(STORAGE_KEY), [])
      // only approved show (future-proof)
      .filter((t) => t.approved !== false)
      .slice(-6)
      .reverse()
  );

  /* ---------------------------------------
     Fade-in on scroll
  ---------------------------------------- */
  useEffect(() => {
    const el = document.getElementById("testimonials-section");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ---------------------------------------
     XP Reward
  ---------------------------------------- */
  const awardXP = (amount) => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return false;

      const u = JSON.parse(raw);
      const next = {
        ...u,
        xp: Number(u?.xp || 0) + Number(amount),
      };

      localStorage.setItem("user", JSON.stringify(next));
      return true;
    } catch {
      return false;
    }
  };

  /* ---------------------------------------
     Submit
  ---------------------------------------- */
  const onSubmit = async (values) => {
    if (!loggedIn) {
      message.warning("Please log in to leave feedback.");
      return;
    }

    setSubmitting(true);

    const entry = {
      id: Date.now(),
      name: user?.name || user?.username || "Explorer",
      rating: values.rating,
      comment: values.comment,
      createdAt: new Date().toISOString(),
      approved: true, // ⬅ future admin toggle
    };

    const updated = [entry, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    awardXP(XP_REWARD);
    message.success(`Thanks! You earned +${XP_REWARD} XP ✨`);

    form.resetFields();
    setSubmitting(false);
  };

  /* ---------------------------------------
     Render
  ---------------------------------------- */
  return (
    <section
      id="testimonials-section"
      className={`sk-testimonials ${visible ? "show" : ""}`}
    >
      <Title level={3} style={{ color: "#fff" }}>
        What Travelers Are Saying
      </Title>

      <div className="sk-testimonials-grid">
        {testimonials.length === 0 && (
          <Text type="secondary">No testimonials yet.</Text>
        )}

        {testimonials.map((t) => (
          <Card key={t.id} className="sk-testimonial-card">
            <Rate disabled value={t.rating} character={<StarFilled />} />
            <Text className="sk-testimonial-text">“{t.comment}”</Text>
            <Text type="secondary" className="sk-testimonial-author">
              — {t.name}
            </Text>
          </Card>
        ))}
      </div>

      {/* ---------------------------------------
          Feedback Form (Logged-in only)
      ---------------------------------------- */}
      {loggedIn && (
        <Card className="sk-feedback-card">
          <Title level={4} style={{ color: "#fff" }}>
            Leave Feedback
          </Title>

          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="comment"
              label="Your experience"
              rules={[{ required: true, min: 10 }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="btn-orange"
            >
              Submit & Earn XP
            </Button>
          </Form>
        </Card>
      )}
    </section>
  );
}