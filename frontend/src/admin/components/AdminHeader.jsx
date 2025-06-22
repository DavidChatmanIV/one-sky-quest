import React from "react";
import { Layout, Typography } from "antd";

const { Header } = Layout;
const { Title } = Typography;

const AdminHeader = () => {
  return (
    <Header className="bg-white px-6 shadow">
      <Title level={4} style={{ margin: 0 }}>
        ✈️ One Sky Quest Admin Dashboard
      </Title>
    </Header>
  );
};

export default AdminHeader;
