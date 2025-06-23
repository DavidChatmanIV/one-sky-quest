import React from "react";
import { Layout, Button, Space, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <Header className="sticky top-0 z-10 bg-white shadow-md px-6 flex justify-between items-center">
      <Title level={4} style={{ margin: 0 }}>
        ✈️ One Sky Quest Admin Dashboard
      </Title>
      <Space>
        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default AdminHeader;
