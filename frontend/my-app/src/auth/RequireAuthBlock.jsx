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
    <div className="sk-authBlock">
      <Card className="sk-authBlockCard" bordered={false}>
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Title level={4} className="sk-authBlockTitle">
            Log in to access {feature}
          </Title>

          <Text type="secondary" className="sk-authBlockSub">
            Create a free Skyrio account to unlock this and keep your travel
            info in one place.
          </Text>

          <Space wrap className="sk-authBlockActions">
            <Button
              type="primary"
              className="sk-authBlockPrimary"
              onClick={() => auth?.openAuthModal?.({ mode: "login" })}
            >
              Log in
            </Button>

            <Button
              className="sk-authBlockSecondary"
              onClick={() => auth?.openAuthModal?.({ mode: "signup" })}
            >
              Create account
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
}