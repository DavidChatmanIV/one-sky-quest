import React, { useEffect, useState } from "react";
import { Table, Tag, Select, message, Card, Typography, Space } from "antd";
import { fetchAdminUsers, updateUserRole } from "../services/adminUserService";

const { Title, Text } = Typography;
const roleOptions = [
  { label: "User", value: "user" },
  { label: "Support", value: "support" },
  { label: "Admin", value: "admin" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingId(userId);
      const updated = await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: updated.role } : u))
      );
      message.success(`Role updated to "${role}"`);
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => text || record.username || "(No name)",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role, record) => (
        <Space>
          <Tag
            color={
              role === "admin" ? "red" : role === "support" ? "blue" : "default"
            }
          >
            {role || "user"}
          </Tag>
          <Select
            size="small"
            value={role || "user"}
            options={roleOptions}
            loading={updatingId === record._id}
            onChange={(value) => handleRoleChange(record._id, value)}
          />
        </Space>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
    },
  ];

  return (
    <Card
      style={{ margin: 24 }}
      bodyStyle={{ padding: 24 }}
      className="osq-admin-card"
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={3}>User Management</Title>
        <Text type="secondary">
          View all registered users, check their roles, and promote trusted
          members to admin or support.
        </Text>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 10 }}
        />
      </Space>
    </Card>
  );
}