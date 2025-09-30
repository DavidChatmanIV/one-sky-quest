import React, { useState } from "react";
import { Modal, Radio, Typography, Alert } from "antd";

const { Text } = Typography;

export default function CancelBookingModal({ open, onClose, booking }) {
  const [reason, setReason] = useState("change_of_plans");
  const freeWindow =
    booking?.isWithin24h && (booking?.daysUntilDeparture ?? 0) >= 7;

  const confirm = async () => {
    await fetch(`/api/bookings/${booking.id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    onClose();
  };

  return (
    <Modal
      title="Cancel booking"
      open={open}
      onCancel={onClose}
      onOk={confirm}
      okText="Confirm cancel"
      okButtonProps={{ danger: true }}
    >
      {freeWindow ? (
        <Alert
          type="success"
          message="Free 24‑hour cancellation applies."
          showIcon
        />
      ) : (
        <Alert
          type="warning"
          message="A cancellation fee or travel credit may apply."
          showIcon
        />
      )}

      <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
        Reason (optional)
      </Text>
      <Radio.Group
        onChange={(e) => setReason(e.target.value)}
        value={reason}
        style={{ display: "grid", gap: 8, marginTop: 8 }}
      >
        <Radio value="change_of_plans">Change of plans</Radio>
        <Radio value="price_found_elsewhere">Found a better price</Radio>
        <Radio value="illness_emergency">Illness/Emergency</Radio>
        <Radio value="other">Other</Radio>
      </Radio.Group>
    </Modal>
  );
}
