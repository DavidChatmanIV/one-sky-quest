// src/auth/RequireAuthBlock.jsx
import React from "react";
import { Card, Typography, Button, Space } from "antd";
import { useAuth } from "../hooks/useAuth";

const { Title, Text } = Typography;

export default function RequireAuthBlock({
  feature = "this feature",
  children,
}) {
  const auth = useAuth();
  const isAuthed = !!auth?.user;

  if (isAuthed) return <>{children}</>;

  return (
    <Card style={{ marginTop: 16 }}>
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Title level={4} style={{ margin: 0 }}>
          Log in to access {feature}
        </Title>
        <Text type="secondary">
          Create a free Skyrio account to unlock this and keep your travel info
          in one place.
        </Text>

        <Space wrap style={{ marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() => auth?.openAuthModal?.({ mode: "login" })}
          >
            Log in
          </Button>
          <Button onClick={() => auth?.openAuthModal?.({ mode: "signup" })}>
            Create account
          </Button>
        </Space>
      </Space>
    </Card>
  );
}