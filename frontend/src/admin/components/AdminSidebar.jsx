import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const AdminSidebar = () => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["dashboard"]}
      style={{ height: "100%", borderRight: 0 }}
    >
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        Dashboard
      </Menu.Item>
      <Menu.Item key="users" icon={<UserOutlined />}>
        Users
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default AdminSidebar;
