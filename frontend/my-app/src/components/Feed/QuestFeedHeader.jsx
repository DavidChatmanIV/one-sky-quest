import React from "react";
import PropTypes from "prop-types";

export default function QuestFeedHeader({ userName = "Traveler", subtitle }) {
  // helper to pick greeting based on time
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
    <header className="qf-header" style={{ marginBottom: "1rem" }}>
      <h1 className="hero-greeting" style={{ color: "var(--text-1)" }}>
        {getGreeting()}, {userName} {getEmoji()}
      </h1>
      {subtitle && (
        <p className="qf-sub" style={{ color: "var(--muted)" }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}

QuestFeedHeader.propTypes = {
  userName: PropTypes.string,
  subtitle: PropTypes.string,
};
