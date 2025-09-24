import React, { useEffect, useState } from "react";
import { Modal, Alert, Row, Col, Button, Space, Typography, Badge } from "antd";

const { Text } = Typography;

export function SeatMapModal({ open, onClose, onConfirm, seatmap, defaultSelectedId }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (open) {
      const def = seatmap?.seats?.find((s) => s.id === defaultSelectedId) || null;
      setSelected(def);
    }
  }, [open, seatmap, defaultSelectedId]);

  const pick = (seat) => {
    if (seat.status !== "available" && seat.status !== "extra") return;
    setSelected(seat);
  };

  const confirm = () => {
    if (!selected) return onClose?.();
    onConfirm?.(selected);
  };

  return (
    <Modal
      title="Choose your seat"
      open={open}
      onCancel={onClose}
      onOk={confirm}
      okButtonProps={{ disabled: !selected }}
      destroyOnClose
    >
      {!seatmap?.seats?.length ? (
        <Alert message="Loading seat map…" type="info" showIcon />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={[8, 8]}>
            {seatmap.seats.map((seat) => (
              <Col key={seat.id} span={6}>
                <Button
                  block
                  onClick={() => pick(seat)}
                  disabled={seat.status === "taken"}
                  type={selected?.id === seat.id ? "primary" : "default"}
                >
                  {seat.label}
                </Button>
              </Col>
            ))}
          </Row>

          <Space size={12}>
            <Badge color="green" text="Available" />
            <Badge color="gray" text="Taken" />
            <Badge color="gold" text="Extra legroom ($)" />
          </Space>

          {selected && (
            <Text>
              You chose: <b>{selected.label}</b>
            </Text>
          )}
        </Space>
      )}
    </Modal>
  );
}

export default SeatMapModal;
