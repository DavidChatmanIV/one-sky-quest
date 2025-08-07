import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Button,
  Dropdown,
  Empty,
  List,
  Tabs,
  Tooltip,
  Typography,
  Spin,
  Avatar,
} from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  GiftOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { motion as MotionDiv } from "framer-motion";

const { Text } = Typography;

// 🟡 Icon map for types
const iconMap = {
  xp: <GiftOutlined className="text-green-500" />,
  trip: <CheckCircleOutlined className="text-blue-500" />,
  message: <MessageOutlined className="text-purple-500" />,
};

// 🕒 Time ago formatter
const timeAgo = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

// 🧠 Filter by tab
const byTab = (items, key) => {
  if (key === "mentions") return items.filter((i) => i.type === "mention");
  if (key === "system") return items.filter((i) => i.type === "system");
  return items;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("all");
  const [busy, setBusy] = useState(false);
  const panelRef = useRef(null);

  // 🔄 Fetch notifications
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

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      setBusy(true);
      await fetch("/api/notifications/read-all", { method: "PUT" });
      await fetchNotifications();
    } catch (err) {
      console.error("❌ Failed to mark all as read:", err);
    } finally {
      setBusy(false);
    }
  };

  // ❌ Clear all
  const clearAll = async () => {
    try {
      setBusy(true);
      await fetch("/api/notifications/clear", { method: "DELETE" });
      await fetchNotifications();
    } catch (err) {
      console.error("❌ Failed to clear notifications:", err);
    } finally {
      setBusy(false);
    }
  };

  // 🟢 Fetch on open
  useEffect(() => {
    if (visible) {
      fetchNotifications();
      const t = setTimeout(() => panelRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // 🔢 Count unread
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );
  const filtered = useMemo(
    () => byTab(notifications, activeKey),
    [notifications, activeKey]
  );

  // 📥 Dropdown Panel
  const dropdownContent = (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white w-[320px] max-h-[420px] overflow-y-auto p-3 shadow-lg rounded-md"
      tabIndex={-1}
      ref={panelRef}
    >
      <div className="flex justify-between items-center mb-2">
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          size="small"
          items={[
            {
              key: "all",
              label: `All ${unreadCount ? `(${unreadCount})` : ""}`,
            },
            { key: "mentions", label: "Mentions" },
            { key: "system", label: "System" },
          ]}
        />
        <div className="flex gap-1">
          <Tooltip title="Mark all as read">
            <Button
              icon={<CheckCircleOutlined />}
              type="text"
              onClick={markAllAsRead}
              disabled={busy || unreadCount === 0}
            />
          </Tooltip>
          <Tooltip title="Clear all">
            <Button
              icon={<DeleteOutlined />}
              type="text"
              danger
              onClick={clearAll}
              disabled={busy || notifications.length === 0}
            />
          </Tooltip>
        </div>
      </div>

      {/* 🔄 States */}
      {loading || busy ? (
        <div className="flex justify-center py-6">
          <Spin />
        </div>
      ) : filtered.length === 0 ? (
        <Empty
          description="You're all caught up!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={filtered}
          renderItem={(item) => (
            <List.Item
              className={!item.read ? "bg-gray-50 rounded-md px-2" : "px-2"}
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
                      {timeAgo(item.createdAt)} ago
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

  // 🔔 Trigger
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
}
