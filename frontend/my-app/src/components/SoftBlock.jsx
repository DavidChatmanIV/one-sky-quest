import React, { useState } from "react";
import { Card, Space, Typography, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import AuthModal from "./AuthModal";
import { useAuth } from "../auth/AuthProvider";

const { Title, Text } = Typography;

export default function SoftBlock({
  intent = "continue", // "post" | "save" | "dm" | "continue"
  title,
  body,
  cta = "Log in",
  secondaryCta = "Continue as guest",
  children, // optional “preview” behind the block
  compact = false,
}) {
  const { isAuthed, isGuest, continueAsGuest } = useAuth();
  const [open, setOpen] = useState(false);

  if (isAuthed) return children || null;

  const defaultTitle =
    intent === "post"
      ? "Log in to post ✨"
      : intent === "save"
      ? "Log in to save trips ✨"
      : intent === "dm"
      ? "Log in to message ✨"
      : "Log in to continue ✨";

  const defaultBody =
    intent === "post"
      ? "Posting is tied to your account so your profile and XP stay accurate."
      : intent === "save"
      ? "Saving trips syncs across devices and lets us track budget + XP."
      : intent === "dm"
      ? "Messaging is private and account-based so you can pick up where you left off."
      : "This feature needs an account so it can save your progress.";

  return (
    <>
      <Card
        style={{ borderRadius: 16 }}
        bodyStyle={{ padding: compact ? 14 : 18 }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={10}>
          <Space align="center">
            <LockOutlined />
            <Title level={compact ? 5 : 4} style={{ margin: 0 }}>
              {title || defaultTitle}
            </Title>
          </Space>

          <Text style={{ opacity: 0.9 }}>{body || defaultBody}</Text>

          <Space wrap>
            <Button type="primary" onClick={() => setOpen(true)}>
              {cta}
            </Button>

            {!isGuest && (
              <Button
                onClick={() => {
                  continueAsGuest();
                }}
              >
                {secondaryCta}
              </Button>
            )}
          </Space>

          {children ? (
            <div
              style={{ marginTop: 10, opacity: 0.55, pointerEvents: "none" }}
            >
              {children}
            </div>
          ) : null}
        </Space>
      </Card>

      <AuthModal open={open} onClose={() => setOpen(false)} intent={intent} />
    </>
  );
}