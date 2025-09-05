import { useEffect, useState } from "react";
import { Switch, Tooltip } from "antd";
import { SunTwoTone, BulbTwoTone } from "@ant-design/icons";

/**
 * ThemeToggle
 * - dark (default)  => uses :root tokens
 * - day (light)     => uses [data-theme="day"] tokens from theme.css
 */
export default function ThemeToggle({ size = "default" }) {
  const [theme, setTheme] = useState("dark");

  // On mount: pick saved theme or system preference
  useEffect(() => {
    const saved = localStorage.getItem("osq-theme");
    if (saved === "dark" || saved === "day") {
      setTheme(saved);
      document.documentElement.setAttribute(
        "data-theme",
        saved === "day" ? "day" : "dark"
      );
      return;
    }
    const prefersLight = window.matchMedia?.(
      "(prefers-color-scheme: light)"
    ).matches;
    const initial = prefersLight ? "day" : "dark";
    setTheme(initial);
    document.documentElement.setAttribute(
      "data-theme",
      initial === "day" ? "day" : "dark"
    );
  }, []);

  // Toggle handler
  const onChange = (checked) => {
    const next = checked ? "day" : "dark";
    setTheme(next);
    localStorage.setItem("osq-theme", next);
    document.documentElement.setAttribute(
      "data-theme",
      next === "day" ? "day" : "dark"
    );
  };

  return (
    <Tooltip title={theme === "day" ? "Switch to Dark" : "Switch to Day"}>
      <Switch
        checked={theme === "day"}
        onChange={onChange}
        size={size}
        checkedChildren={
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <SunTwoTone twoToneColor="#facc15" /> Day
          </span>
        }
        unCheckedChildren={
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <BulbTwoTone twoToneColor="#60a5fa" /> Dark
          </span>
        }
        style={{ minWidth: 96 }}
      />
    </Tooltip>
  );
}
