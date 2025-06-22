import React from "react";
import { Layout } from "antd";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import DashboardMetrics from "./components/DashboardMetrics";

const { Sider, Content } = Layout;

const AdminDashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220}>
        <AdminSidebar />
      </Sider>
      <Layout>
        <AdminHeader />
        <Content className="p-6 bg-gray-50">
          <DashboardMetrics />
          {/* 🔜 Replace with bookings, users, analytics, etc. */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
