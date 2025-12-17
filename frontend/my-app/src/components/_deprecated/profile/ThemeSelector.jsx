import React from "react";
import { Select } from "antd";

const { Option } = Select;

const themes = [
  { label: "🌞 Light", value: { bg: "bg-white", font: "text-gray-800" } },
  { label: "🌙 Dark", value: { bg: "bg-gray-900", font: "text-white" } },
  { label: "💖 Pink", value: { bg: "bg-pink-100", font: "text-pink-900" } },
];

const ThemeSelector = ({ onThemeChange }) => {
  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">🎨 Choose Theme</h4>
      <Select
        style={{ width: 240 }}
        placeholder="Select a theme"
        onChange={(value) => onThemeChange(value)}
      >
        {themes.map((theme, index) => (
          <Option key={index} value={theme.value}>
            {theme.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default ThemeSelector;
