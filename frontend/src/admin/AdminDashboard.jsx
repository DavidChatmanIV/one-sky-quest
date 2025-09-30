import React, { useEffect } from "react";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import DashboardMetrics from "./components/DashboardMetrics";

const { Sider, Content } = Layout;

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    fetch("/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220}>
        <AdminSidebar />
      </Sider>
      <Layout>
        <AdminHeader />
        <Content className="p-6 bg-gray-50">
          <DashboardMetrics />
          {/* 🔜 Add: ManageBookings, ManageUsers, Analytics, etc. */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
