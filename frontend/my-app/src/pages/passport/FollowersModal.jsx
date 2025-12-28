import React, { useEffect, useState } from "react";
import {
  Modal,
  List,
  Avatar,
  Typography,
  Button,
  Space,
  Tag,
  Spin,
} from "antd";
const { Text } = Typography;

function FollowerRow({ user }) {
  const display = user.name || user.username || "Traveler";
  const handle = user.username ? `@${user.username}` : "";

  return (
    <List.Item
      className="sk-followRow"
      actions={[
        <Button key="view" size="small" className="sk-followBtn" type="default">
          View
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={user.avatarUrl} />}
        title={
          <Space size={8}>
            <Text className="sk-followName">{display}</Text>
            {user.isOfficial ? (
              <Tag className="sk-officialTag">Official</Tag>
            ) : null}
          </Space>
        }
        description={<Text className="sk-followHandle">{handle}</Text>}
      />
    </List.Item>
  );
}

export default function FollowersModal({
  open,
  onClose,
  mode = "following", // "following" | "followers"
}) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!open) return;

    async function load() {
      setLoading(true);
      try {
        const url =
          mode === "followers"
            ? "/api/passport/followers?limit=25"
            : "/api/passport/following?limit=25";

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (data?.ok) setItems(data.items || []);
      } catch (e) {
        console.error("FollowersModal load error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [open, mode]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={mode === "followers" ? "Followers" : "Following"}
      className="sk-followModal"
    >
      {loading ? (
        <div className="sk-followLoading">
          <Spin />
        </div>
      ) : (
        <List
          dataSource={items}
          renderItem={(u) => <FollowerRow key={u.id} user={u} />}
          locale={{ emptyText: "Nothing here yet." }}
        />
      )}
    </Modal>
  );
}