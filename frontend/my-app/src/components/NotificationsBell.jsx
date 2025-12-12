import { Badge, Button, Dropdown, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  markNotificationRead,
} from "../services/notificationsService";

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);
  const nav = useNavigate();

  // Load from backend
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // You can pass options here e.g. { limit: 10 }
        const list = await fetchNotifications({ limit: 10, sort: "desc" });
        if (isMounted) setNotifications(list);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    }

    load();

    // Optional: refresh every few minutes as a fallback
    const interval = setInterval(load, 1000 * 60 * 2); // 2 minutes
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleClickNotification = async (n) => {
    try {
      // Optimistic read flag
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === n._id ? { ...item, isRead: true } : item
        )
      );

      // Persist read state
      await markNotificationRead(n._id);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      // optional: revert state or show toast
    }

    // Click-to-open navigation based on targetType
    switch (n.targetType) {
      case "booking":
      case "trip":
        if (n.targetId) nav(`/bookings/${n.targetId}`);
        else nav("/bookings");
        break;

      case "dm":
        if (n.targetId) nav(`/dm/${n.targetId}`);
        else nav("/dm");
        break;

      case "profile":
        if (n.targetId) nav(`/profile/${n.targetId}`);
        else nav("/profile");
        break;

      case "external":
        if (n.link) {
          window.open(n.link, "_blank", "noopener,noreferrer");
        } else {
          nav("/dashboard");
        }
        break;

      default:
        // "none" or unknown → dashboard or a notifications page
        nav("/dashboard");
        break;
    }
  };

  const items =
    notifications.length > 0
      ? notifications.map((n) => ({
          key: n._id,
          label: (
            <div
              style={{
                maxWidth: 260,
                cursor: "pointer",
                opacity: n.isRead ? 0.7 : 1,
              }}
              onClick={() => handleClickNotification(n)}
            >
              <strong>{n.title || "Notification"}</strong>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{n.message}</div>
            </div>
          ),
        }))
      : [
          {
            key: "empty",
            label: <Empty description="No new notifications" />,
          },
        ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
      <Badge count={unreadCount} overflowCount={9} offset={[-4, 6]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          aria-label="Notifications"
        />
      </Badge>
    </Dropdown>
  );
}
