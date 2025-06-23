import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message } from "antd";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    fetch("/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.json())
    .then((data) => setBookings(data))
    .catch(() => message.error("Failed to fetch bookings"))
    .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "User", dataIndex: "userEmail", key: "userEmail" },
    { title: "Destination", dataIndex: "destination", key: "destination" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "confirmed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
  ];

  return loading ? (
    <Spin />
  ) : (
    <Table dataSource={bookings} columns={columns} rowKey="_id" />
  );
};

export default ManageBookings;
