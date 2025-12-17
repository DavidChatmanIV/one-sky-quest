import React from "react";
import { Switch, Tooltip } from "antd";

export default function ThemeToggle({ theme, onChange, size = "default" }) {
  const isWarm = theme === "warm";

  return (
    <Tooltip title={isWarm ? "Switch to Dark" : "Switch to Warm"}>
      <Switch
        aria-label={isWarm ? "Switch to dark theme" : "Switch to warm theme"}
        checkedChildren={<span>☀️</span>}
        unCheckedChildren={<span>🌙</span>}
        checked={isWarm}
        onChange={(checked) => onChange(checked ? "warm" : "dark")}
        size={size}
      />
    </Tooltip>
  );
}
