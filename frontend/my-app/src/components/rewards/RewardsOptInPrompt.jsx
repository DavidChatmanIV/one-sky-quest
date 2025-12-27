import React, { useEffect, useState } from "react";
import { Modal, Typography, Switch, Space, Button } from "antd";

const { Title, Text } = Typography;

export default function RewardsOptInPrompt({ open, onClose, onConfirm }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (open) setEnabled(true);
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <Title level={4} style={{ margin: 0 }}>
          Turn on rewards?
        </Title>
      }
    >
      <Text style={{ display: "block", marginBottom: 12 }}>
        Earn XP for bookings, saves, and challenges. Totally optional — you can
        book normally either way.
      </Text>

      <Space style={{ marginBottom: 16 }}>
        <Text>Rewards:</Text>
        <Switch checked={enabled} onChange={setEnabled} />
      </Space>

      <Space style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onClose}>Not now</Button>
        <Button type="primary" onClick={() => onConfirm(enabled)}>
          Save
        </Button>
      </Space>
    </Modal>
  );
}