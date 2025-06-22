import React from "react";
import { Avatar, Typography } from "antd";

const { Paragraph } = Typography;

const ProfileHeader = ({ user }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar size={80} src={user.avatar} />
      <div>
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-gray-500">{user.location}</p>
        <Paragraph type="secondary">{user.bio}</Paragraph>
      </div>
    </div>
  );
};

export default ProfileHeader;
