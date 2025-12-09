import { Badge, Button, Dropdown, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);

  // TEMP mock fetch — replace with /api/notifications later
  useEffect(() => {
    setNotifications([]);
  }, []);

  const items =
    notifications.length > 0
      ? notifications.map((n, i) => ({
          key: i,
          label: (
            <div style={{ maxWidth: 260 }}>
              <strong>{n.title}</strong>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{n.message}</div>
            </div>
          ),
        }))
      : [
          {
            key: "empty",
            label: <Empty description="No new notifications" />,
          },
        ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
      <Badge count={notifications.length} overflowCount={9} offset={[-4, 6]}>
        <Button
          type="text"
          shape="circle"
          icon={<BellOutlined style={{ fontSize: 20 }} />}
          aria-label="Notifications"
        />
      </Badge>
    </Dropdown>
  );
}
