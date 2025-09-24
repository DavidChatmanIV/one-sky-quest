import React, { useState } from "react";
import { Modal, Select, Alert } from "antd";

export default function SwitchSeatsModal({ open, onClose, booking }) {
  const pax = (booking?.passengers || []).map((p) => ({
    label: `${p.firstName} ${p.lastName} — ${p.seatLabel}`,
    value: p.id,
  }));
  const [fromId, setFromId] = useState();
  const [toId, setToId] = useState();

  const confirm = async () => {
    await fetch(`/api/bookings/${booking.id}/seats/swap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        segmentId: booking.segmentId,
        fromPassengerId: fromId,
        toPassengerId: toId,
      }),
    });
    onClose();
  };

  return (
    <Modal
      title="Switch seats"
      open={open}
      onCancel={onClose}
      onOk={confirm}
      okButtonProps={{ disabled: !fromId || !toId || fromId === toId }}
    >
      <Alert
        type="info"
        message="Swap seats between two travelers on this booking."
        showIcon
        style={{ marginBottom: 12 }}
      />
      <Select
        placeholder="Traveler A"
        options={pax}
        onChange={setFromId}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <Select
        placeholder="Traveler B"
        options={pax}
        onChange={setToId}
        style={{ width: "100%" }}
      />
    </Modal>
  );
}
