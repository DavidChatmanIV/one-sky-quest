import React from "react";
import { Space, Tooltip } from "antd";

const ReactionBar = ({ reactions }) => {
  return (
    <Space>
      <Tooltip title="Like">
        <span>👍 {reactions.like || 0}</span>
      </Tooltip>
      <Tooltip title="Fire">
        <span>🔥 {reactions.fire || 0}</span>
      </Tooltip>
      <Tooltip title="Clap">
        <span>👏 {reactions.clap || 0}</span>
      </Tooltip>
    </Space>
  );
};

export default ReactionBar;
