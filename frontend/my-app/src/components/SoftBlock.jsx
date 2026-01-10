import React from "react";
import { Card, Space, Typography, Button, Tag } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useAuthModal } from "../auth/AuthModalController";
import { useAuth } from "../auth/AuthProvider";

const { Title, Text } = Typography;

export default function SoftBlock({
  intent = "continue",
  title,
  body,
  subtitle,

  cta,
  secondaryCta = "Continue as guest",

  primaryLabel,
  primaryIntent = "signup",
  secondaryLabel,
  secondaryIntent = "login",

  badge,
  compact = false,
  children,
}) {
  const { isAuthed, isGuest, continueAsGuest } = useAuth();
  const { openAuth } = useAuthModal();

  // ✅ compute strings without hooks
  const resolvedTitle =
    title ||
    (intent === "post"
      ? "Log in to post ✨"
      : intent === "save"
      ? "Log in to save trips ✨"
      : intent === "dm"
      ? "Log in to message ✨"
      : intent === "passport"
      ? "Create an account to access your Digital Passport"
      : "Log in to continue ✨");

  const resolvedBody =
    subtitle ||
    body ||
    (intent === "post"
      ? "Posting is tied to your account so your profile and XP stay accurate."
      : intent === "save"
      ? "Saving trips syncs across devices and lets us track budget + XP."
      : intent === "dm"
      ? "Messaging is private and account-based so you can pick up where you left off."
      : intent === "passport"
      ? "Your Passport saves XP, badges, and trips so your progress stays synced."
      : "This feature needs an account so it can save your progress.");

  const resolvedPrimaryLabel = primaryLabel || cta || "Sign up";
  const resolvedSecondaryLabel = secondaryLabel || "Log in";

  // ✅ safe to early return now (no hooks below)
  if (isAuthed) return children || null;

  const triggerAuth = (nextIntent) =>
    openAuth?.({ intent: nextIntent || intent });

  return (
    <div
      style={{
        minHeight: compact ? "auto" : "70vh",
        display: "grid",
        placeItems: "center",
        padding: compact ? 0 : 24,
      }}
    >
      <Card
        style={{ maxWidth: 560, width: "100%", borderRadius: 16 }}
        bodyStyle={{ padding: compact ? 14 : 18 }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={10}>
          <Space align="center">
            <LockOutlined />
            {badge ? <Tag style={{ marginLeft: 8 }}>{badge}</Tag> : null}
          </Space>

          <Title level={compact ? 5 : 3} style={{ margin: 0 }}>
            {resolvedTitle}
          </Title>

          <Text style={{ opacity: 0.9 }}>{resolvedBody}</Text>

          <Space wrap style={{ marginTop: 10 }}>
            <Button type="primary" onClick={() => triggerAuth(primaryIntent)}>
              {resolvedPrimaryLabel}
            </Button>

            {/* ✅ For Passport you usually want NO guest option */}
            {intent === "passport" ? (
              <Button onClick={() => triggerAuth(secondaryIntent)}>
                {resolvedSecondaryLabel}
              </Button>
            ) : secondaryCta && typeof continueAsGuest === "function" ? (
              !isGuest ? (
                <Button onClick={() => continueAsGuest()}>
                  {secondaryCta}
                </Button>
              ) : null
            ) : (
              <Button onClick={() => triggerAuth(secondaryIntent)}>
                {resolvedSecondaryLabel}
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
    </div>
  );
}