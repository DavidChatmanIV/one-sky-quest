import React from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function QuestFeedHeader({ userName = "Traveler", subtitle }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "☀️";
    if (hour < 18) return "🌆";
    return "🌙";
  };

  return (
    <div
      className="feed-header glass soft-shadow"
      style={{ marginBottom: "1rem" }}
    >
      <Title level={2} className="feed-title" style={{ marginBottom: 4 }}>
        {getGreeting()}, {userName} {getEmoji()}
      </Title>
      <Paragraph
        className="feed-sub"
        style={{ color: "var(--muted)", marginBottom: 0 }}
      >
        {subtitle || "See travel updates, tips, and wins from the community."}
      </Paragraph>
    </div>
  );
}

QuestFeedHeader.propTypes = {
  userName: PropTypes.string,
  subtitle: PropTypes.string,
};
