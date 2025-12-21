import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, Typography, Space, Button, Tag } from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  SaveOutlined,
  DragOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function safeParseJSON(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function reorder(list, fromIdx, toIdx) {
  const next = [...list];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
}

export default function TopEight({
  title = "Top 8",
  subtitle = "",
  storageKey,
  defaultItems = [],
  canEdit = true,
  renderItem,
}) {
  const [items, setItems] = useState(defaultItems);
  const [locked, setLocked] = useState(true);
  const [dragFrom, setDragFrom] = useState(null);

  // load persisted order
  useEffect(() => {
    if (!storageKey) {
      setItems(defaultItems);
      return;
    }
    const raw = localStorage.getItem(storageKey);
    const saved = raw ? safeParseJSON(raw, null) : null;

    if (Array.isArray(saved) && saved.length) setItems(saved);
    else setItems(defaultItems);
  }, [storageKey, defaultItems]);

  const save = useCallback(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
    setLocked(true);
  }, [items, storageKey]);

  const startEdit = useCallback(() => setLocked(false), []);
  const lockNow = useCallback(() => setLocked(true), []);

  const canDrag = canEdit && !locked;

  const headerRight = useMemo(() => {
    if (!canEdit) {
      return (
        <Tag color="default" style={{ borderRadius: 999 }}>
          View Only
        </Tag>
      );
    }

    if (locked) {
      return (
        <Space size={8}>
          <Tag color="purple" style={{ borderRadius: 999 }}>
            <LockOutlined /> Locked
          </Tag>
          <Button size="small" icon={<UnlockOutlined />} onClick={startEdit}>
            Edit Order
          </Button>
        </Space>
      );
    }

    return (
      <Space size={8}>
        <Tag color="gold" style={{ borderRadius: 999 }}>
          <DragOutlined /> Editing
        </Tag>
        <Button
          size="small"
          icon={<SaveOutlined />}
          type="primary"
          onClick={save}
        >
          Save
        </Button>
        <Button size="small" icon={<LockOutlined />} onClick={lockNow}>
          Lock
        </Button>
      </Space>
    );
  }, [canEdit, locked, save, startEdit, lockNow]);

  return (
    <Card
      style={{
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.12)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))",
        backdropFilter: "blur(10px)",
      }}
      bodyStyle={{ padding: 14 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div>
          <Title
            level={5}
            style={{ margin: 0, color: "rgba(255,255,255,.92)" }}
          >
            {title}
          </Title>
          {subtitle ? (
            <Text style={{ color: "rgba(255,255,255,.68)" }}>{subtitle}</Text>
          ) : null}
        </div>
        <div>{headerRight}</div>
      </div>

      {/* MySpace grid feel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {items.slice(0, 8).map((item, idx) => {
          const key = item?.id ?? `${title}_${idx}`;
          const isDragging = dragFrom === idx;

          return (
            <div
              key={key}
              draggable={canDrag}
              onDragStart={() => setDragFrom(idx)}
              onDragEnd={() => setDragFrom(null)}
              onDragOver={(e) => {
                if (!canDrag) return;
                e.preventDefault();
              }}
              onDrop={() => {
                if (!canDrag) return;
                if (dragFrom === null || dragFrom === idx) return;
                setItems((prev) => reorder(prev, dragFrom, idx));
                setDragFrom(null);
              }}
              style={{
                cursor: canDrag ? "grab" : "default",
                opacity: isDragging ? 0.6 : 1,
                transform: isDragging ? "scale(0.98)" : "none",
                transition: "transform 120ms ease, opacity 120ms ease",
              }}
              title={canDrag ? "Drag to reorder" : undefined}
            >
              {renderItem?.(item, { index: idx, locked, isDragging }) || (
                <div
                  style={{
                    borderRadius: 14,
                    padding: 10,
                    border: "1px solid rgba(255,255,255,.12)",
                    background: "rgba(0,0,0,.18)",
                    color: "white",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{item?.name || "Item"}</div>
                  <div style={{ opacity: 0.75, fontSize: 12 }}>
                    {item?.username || item?.country || ""}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* tiny hint */}
      <div style={{ marginTop: 10, opacity: 0.7, fontSize: 12 }}>
        {canEdit
          ? locked
            ? "Locked to prevent accidental changes."
            : "Drag tiles to reorder. Save when you’re done."
          : "Order is locked."}
      </div>
    </Card>
  );
}