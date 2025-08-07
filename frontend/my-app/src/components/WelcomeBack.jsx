import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Skeleton,
  Avatar,
  Typography,
  Progress,
  Space,
  Tag,
  Result,
  Button,
  Tooltip,
} from "antd";
import { UserOutlined, TrophyOutlined, StarOutlined } from "@ant-design/icons";
import { getProfile } from "../services/profileService";

const { Title, Text } = Typography;

function timeOfDayGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function calcProgress(xp = 0, level = 1) {
  const nextLevelAt = Math.max(100, level * 100); // swap with your real formula later
  const current = Math.min(xp % nextLevelAt, nextLevelAt);
  return Math.round((current / nextLevelAt) * 100);
}

export default function WelcomeBack({ userId }) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProfile({ userId });
        if (mounted) setState({ data, loading: false, error: null });
      } catch (err) {
        if (mounted)
          setState({
            data: null,
            loading: false,
            error: err?.message || "Failed to load profile",
          });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const greeting = useMemo(() => timeOfDayGreeting(), []);
  const progress = useMemo(
    () => calcProgress(state.data?.xp, state.data?.level),
    [state.data?.xp, state.data?.level]
  );

  if (state.loading) {
    return (
      <Card className="welcomeCard fadeIn">
        <Space align="start">
          <Skeleton.Avatar active size={64} shape="circle" />
          <div style={{ minWidth: 240 }}>
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: "60%" }} />
          </div>
        </Space>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Result
        status="warning"
        title="We couldn't load your profile"
        subTitle={state.error}
        extra={
          <Button onClick={() => window.location.reload()} type="primary">
            Retry
          </Button>
        }
      />
    );
  }

  const {
    firstName,
    avatarUrl,
    level,
    xp,
    nextBadge,
    savedTrips = 0,
    unread = 0,
    username,
  } = state.data || {};

  return (
    <Card className="welcomeCard fadeIn" bodyStyle={{ padding: 20 }}>
      <Space
        align="start"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Space align="center">
          <Avatar size={64} src={avatarUrl} icon={<UserOutlined />} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {greeting}, {firstName || username || "Traveler"} 👋
            </Title>
            <Space wrap size="small">
              <Tag icon={<StarOutlined />} color="blue">
                Level {level ?? 1}
              </Tag>
              <Tag color="default">XP {xp ?? 0}</Tag>
              {typeof savedTrips === "number" && (
                <Tag color="green">{savedTrips} saved trips</Tag>
              )}
              {typeof unread === "number" && unread > 0 && (
                <Tag color="red">{unread} new</Tag>
              )}
            </Space>
          </div>
        </Space>

        {nextBadge && (
          <Tooltip title={`Next badge: ${nextBadge.name}`}>
            <Space>
              <TrophyOutlined />
              <Text strong>{nextBadge.name}</Text>
            </Space>
          </Tooltip>
        )}
      </Space>

      <div style={{ marginTop: 16 }}>
        <Text type="secondary">Progress to next level</Text>
        <Progress percent={progress} status="active" showInfo />
      </div>

      <style jsx>{`
        .fadeIn {
          opacity: 0;
          transform: translateY(6px);
          animation: fadeInUp 320ms ease-out forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}
