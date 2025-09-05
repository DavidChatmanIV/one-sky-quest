import React, { useState } from "react";
import { Card, List, Input, Button, Space, Typography, message } from "antd";
const { Text } = Typography;

export default function Guestbook({ className, style, onEarnXp, ...rest }) {
  const [entries, setEntries] = useState([
    {
      id: "emily",
      name: "Emily",
      note: "Loved your Paris pics! 🇫🇷",
      ts: "2h ago",
    },
  ]);
  const [note, setNote] = useState("");

  const addEntry = () => {
    const val = note.trim();
    if (!val) return;
    const next = {
      id: `${Date.now()}`,
      name: "You",
      note: val,
      ts: "just now",
    };
    setEntries([next, ...entries]);
    setNote("");
    onEarnXp?.(5);
    message.success("Guestbook updated (+5 XP)");
  };

  return (
    <Card
      className={`osq-surface ${className || ""}`}
      data-surface={rest["data-surface"] ?? "2"}
      styles={{ body: { padding: 12 } }}
      style={{ borderRadius: 12, ...(style || {}) }}
      {...rest}
    >
      <div
        style={{
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text strong>Guestbook</Text>
        <Text type="secondary">
          {entries.length} note{entries.length !== 1 ? "s" : ""}
        </Text>
      </div>

      <Space.Compact style={{ width: "100%", marginBottom: 10 }}>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Leave a friendly note…"
          onPressEnter={addEntry}
        />
        <Button type="primary" onClick={addEntry}>
          Post
        </Button>
      </Space.Compact>

      <List
        itemLayout="vertical"
        dataSource={entries}
        renderItem={(it) => (
          <List.Item style={{ padding: "8px 0" }}>
            <List.Item.Meta
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text strong>{it.name}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {it.ts}
                  </Text>
                </div>
              }
              description={<Text>{it.note}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
