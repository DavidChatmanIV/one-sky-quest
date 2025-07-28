import React, { useEffect, useState } from "react";
import {
  Badge,
  Dropdown,
  List,
  Button,
  Avatar,
  Typography,
  Empty,
  Spin,
} from "antd";
import {
  BellOutlined,
  GiftOutlined,
  MessageOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion as MotionDiv } from "framer-motion";

const { Text } = Typography;

const iconMap = {
  xp: <GiftOutlined className="text-green-500" />,
  trip: <CheckCircleOutlined className="text-blue-500" />,
  message: <MessageOutlined className="text-purple-500" />,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("❌ Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PUT" });
      fetchNotifications();
    } catch (err) {
      console.error("❌ Failed to mark all as read:", err);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const dropdownContent = (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white w-[320px] max-h-[400px] overflow-y-auto p-3 shadow-lg rounded-md"
    >
      <div className="flex justify-between items-center mb-2">
        <Text strong className="text-base">
          🔔 Notifications
        </Text>
        <Button size="small" type="text" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-4">
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty description="You're all caught up!" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={!item.read ? "bg-gray-100 px-2 rounded-sm" : "px-2"}
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
                  <>
                    <Text type="secondary" className="block text-sm">
                      {item.message}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </MotionDiv>
  );

  return (
    <Dropdown
      overlay={dropdownContent}
      trigger={["click"]}
      placement="bottomRight"
      open={visible}
      onOpenChange={(flag) => setVisible(flag)}
    >
      <Badge count={unreadCount} size="small">
        <BellOutlined className="text-xl cursor-pointer" />
      </Badge>
    </Dropdown>
  );
};

export default Notifications;
