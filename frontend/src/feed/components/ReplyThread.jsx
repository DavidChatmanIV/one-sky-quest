import React from "react";
import { List, Comment } from "antd";

const ReplyThread = ({ replies }) => {
  return (
    <List
      dataSource={replies}
      itemLayout="horizontal"
      renderItem={(reply, idx) => (
        <Comment key={idx} author="User" content={<p>{reply}</p>} />
      )}
      className="mt-2"
    />
  );
};

export default ReplyThread;
