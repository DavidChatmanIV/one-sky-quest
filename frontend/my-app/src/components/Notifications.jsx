import React, { useEffect, useState } from "react";
import { List, Button, Spin, Typography, Avatar, Empty } from "antd";
import {
  GiftOutlined,
  MessageOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion as MotionDiv } from "framer-motion"; // ✅ Renamed for ESLint

const { Text } = Typography;

const iconMap = {
  xp: <GiftOutlined className="text-green-500" />,
  trip: <CheckCircleOutlined className="text-blue-500" />,
  message: <MessageOutlined className="text-purple-500" />,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("❌ Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PUT" });
      fetchNotifications();
    } catch (err) {
      console.error("❌ Error marking as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white w-[320px] max-h-[400px] overflow-y-auto p-4 shadow-lg rounded-md"
    >
      <div className="flex justify-between items-center mb-3">
        <Text strong className="text-base">
          🔔 Notifications
        </Text>
        <Button size="small" type="text" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      {loading ? (
        <Spin className="flex justify-center" />
      ) : notifications.length === 0 ? (
        <Empty description="You're all caught up!" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={!item.read ? "bg-gray-100 rounded-sm px-2" : "px-2"}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={iconMap[item.type] || <MessageOutlined />}
                    className="bg-gray-100"
                  />
                }
                title={<Text strong>{item.title || "Notification"}</Text>}
                description={
                  <div>
                    <Text type="secondary" className="block text-sm">
                      {item.message}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </MotionDiv>
  );
};

export default Notifications;
