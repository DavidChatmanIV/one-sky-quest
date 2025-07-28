import React from "react";
import { Typography, Avatar, Button } from "antd";

const { Text } = Typography;

const WelcomeBack = () => {
  return (
    <div className="bg-blue-50 border-b border-gray-200 py-3 px-6 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            style={{ backgroundColor: "#dbeafe", color: "#1e3a8a" }}
          >
            👤
          </Avatar>
          <div>
            <Text strong className="text-lg">
              👋 Welcome Back, David!
            </Text>
            <p className="text-xs text-gray-500 m-0">
              Let's plan your next big journey.
            </p>
          </div>
        </div>
        <Button size="small" type="default">
          View Saved Trips
        </Button>
      </div>
    </div>
  );
};

export default WelcomeBack;
