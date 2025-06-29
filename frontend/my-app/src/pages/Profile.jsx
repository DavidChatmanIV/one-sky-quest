import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const Profile = () => {
  return (
    <section style={{ padding: "60px 20px" }}>
      <Title level={2}>👤 Your Profile</Title>
      <Paragraph>
        Welcome to your One Sky Quest profile. More customization coming soon!
      </Paragraph>
    </section>
  );
};

export default Profile;
