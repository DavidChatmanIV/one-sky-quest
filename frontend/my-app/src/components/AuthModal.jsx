import React, { useMemo, useState } from "react";
import {
  Modal,
  Tabs,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Divider,
} from "antd";
import { useAuth } from "../auth/AuthProvider";

const { Text } = Typography;

export default function AuthModal({ open, onClose, intent = "continue" }) {
  const { login, signup, continueAsGuest } = useAuth();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (intent === "post") return "Log in to post ✨";
    if (intent === "save") return "Log in to save trips ✨";
    if (intent === "dm") return "Log in to message ✨";
    return "Log in to continue ✨";
  }, [intent]);

  async function onLogin(values) {
    setLoading(true);
    try {
      const ok = await login(values);
      if (ok) onClose?.();
    } finally {
      setLoading(false);
    }
  }

  async function onSignup(values) {
    setLoading(true);
    try {
      const ok = await signup(values);
      if (ok) onClose?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={title}
      destroyOnClose
    >
      <Text style={{ display: "block", marginBottom: 12, opacity: 0.9 }}>
        Guest browsing is always allowed. Some features need an account so your
        stuff can save.
      </Text>

      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: "login",
            label: "Log in",
            children: (
              <Form layout="vertical" onFinish={onLogin}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="you@email.com" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password placeholder="••••••••" />
                </Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  block
                  loading={loading}
                >
                  Log in
                </Button>
              </Form>
            ),
          },
          {
            key: "signup",
            label: "Sign up",
            children: (
              <Form layout="vertical" onFinish={onSignup}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="David" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="you@email.com" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, min: 6 }]}
                >
                  <Input.Password placeholder="6+ characters" />
                </Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  block
                  loading={loading}
                >
                  Create account
                </Button>
              </Form>
            ),
          },
        ]}
      />

      <Divider style={{ margin: "14px 0" }} />

      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          onClick={() => {
            continueAsGuest();
            onClose?.();
          }}
          block
        >
          Continue as guest
        </Button>
        <Text type="secondary" style={{ fontSize: 12 }}>
          You can upgrade to an account anytime. Guest mode won’t save posts,
          DMs, or trips.
        </Text>
      </Space>
    </Modal>
  );
}