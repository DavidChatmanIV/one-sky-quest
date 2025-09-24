import React from "react";
import { FloatButton } from "antd";
import { MessageOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const AISupportFab = () => {
  return (
    <FloatButton.Group
      trigger="click"
      type="primary"
      style={{ right: 24, bottom: 24 }}
      icon={<MessageOutlined />}
    >
      {/* AI Support */}
      <FloatButton
        icon={<MessageOutlined />}
        tooltip="AI Support"
        onClick={() => {
          console.log("AI Support clicked!");
        }}
      />

      {/* Tutorial */}
      <FloatButton
        icon={<QuestionCircleOutlined />}
        tooltip="Tutorial"
        onClick={() => {
          console.log("Tutorial clicked!");
        }}
      />
    </FloatButton.Group>
  );
};

export default AISupportFab; // ✅ default export fixes your error
