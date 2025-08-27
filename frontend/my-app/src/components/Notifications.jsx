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
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const { Text } = Typography;

/* icon per notification type */
const iconMap = {
  xp: <GiftOutlined className="text-green-500" />,
  trip: <CheckCircleOutlined className="text-blue-500" />,
  message: <MessageOutlined className="text-purple-500" />,
};

/* small relative-time helper */
const timeAgo = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

/* tab filtering */
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
  const navigate = useNavigate();

  /* initial fetch when panel opens */
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ load notifications:", err);
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setBusy(true);
      await fetch("/api/notifications/read-all", { method: "PUT" });
      await fetchNotifications();
      toast.success("Marked all as read");
    } catch (err) {
      console.error("❌ mark all as read:", err);
      toast.error("Could not mark all as read");
    } finally {
      setBusy(false);
    }
  };

  const clearAll = async () => {
    try {
      setBusy(true);
      await fetch("/api/notifications/clear", { method: "DELETE" });
      await fetchNotifications();
      toast("Notifications cleared", { icon: "🧹" });
    } catch (err) {
      console.error("❌ clear notifications:", err);
      toast.error("Could not clear notifications");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchNotifications();
      const t = setTimeout(() => panelRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [visible]);

  /* ✅ Realtime via WebSocket with safe close (no try/catch, no linter warnings) */
  useEffect(() => {
    if (!visible) return;

    let ws; // current socket
    let reconnectTimer; // timeout id
    let tries = 0; // backoff counter

    const url =
      (location.protocol === "https:" ? "wss://" : "ws://") +
      location.host +
      "/ws/notifications";

    const safeClose = () => {
      if (
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING)
      ) {
        ws.close();
      }
    };

    const connect = () => {
      ws = new WebSocket(url);

      ws.onopen = () => {
        tries = 0;
      };

      ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload.type === "new" && payload.data) {
            setNotifications((prev) => [payload.data, ...prev]);
            // optional toast preview
            toast(payload.data?.title || "New notification", { icon: "🔔" });
          } else if (payload.type === "bulk" && Array.isArray(payload.data)) {
            setNotifications(payload.data);
          } else if (payload.type === "update" && payload.data?.id) {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.data.id ? payload.data : n))
            );
          } else if (payload.type === "clear") {
            setNotifications([]);
          }
        } catch (e) {
          console.warn("WS message parse error:", e);
        }
      };

      ws.onclose = () => {
        tries = Math.min(tries + 1, 5);
        const delay = Math.min(8000, 500 * 2 ** tries);
        reconnectTimer = window.setTimeout(connect, delay);
      };

      // Guard-close; no try/catch needed
      ws.onerror = () => {
        safeClose();
      };
    };

    connect();

    return () => {
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      safeClose();
    };
  }, [visible]);

  /* derived values */
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );
  const filtered = useMemo(
    () => byTab(notifications, activeKey),
    [notifications, activeKey]
  );

  /* per-item click: optimistic mark-as-read + navigate if route present */
  const handleItemClick = (item) => {
    try {
      if (item?.id && !item.read) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );
        fetch(`/api/notifications/${encodeURIComponent(item.id)}/read`, {
          method: "PUT",
        }).catch(() => {});
      }
      if (item?.route && typeof item.route === "string") {
        setVisible(false);
        navigate(item.route);
      }
    } catch (e) {
      console.warn("onNotificationClick error:", e);
    }
  };

  /* custom dropdown content */
  const dropdownPanel = (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      ref={panelRef}
      tabIndex={-1}
      className="bg-white w-[90vw] max-w-[360px] max-h-[70vh] overflow-y-auto p-3 shadow-lg rounded-md"
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
              className={`px-2 rounded-md ${
                !item.read ? "bg-gray-50" : ""
              } cursor-pointer`}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item);
              }}
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

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      open={visible}
      onOpenChange={setVisible}
      dropdownRender={() => dropdownPanel}
    >
      <Badge count={unreadCount} size="small">
        <BellOutlined className="text-xl cursor-pointer" />
      </Badge>
    </Dropdown>
  );
}
