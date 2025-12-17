import React, { useState } from "react";
import { Space, Button, Tooltip } from "antd";
import {
  SwapOutlined,
  InteractionOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import SeatMapModal from "../seat/SeatMapModal";
import SwitchSeatsModal from "../seat/SwitchSeatsModal";
import CancelBookingModal from "./CancelBookingModal";

export default function BookingActions({ booking }) {
  const [showSeat, setShowSeat] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  return (
    <>
      <Space wrap size="middle">
        <Tooltip title="Pick a different seat">
          <Button
            icon={<InteractionOutlined />}
            onClick={() => setShowSeat(true)}
          >
            Change seat
          </Button>
        </Tooltip>
        <Tooltip title="Swap seats within this booking">
          <Button icon={<SwapOutlined />} onClick={() => setShowSwap(true)}>
            Switch seats
          </Button>
        </Tooltip>
        <Tooltip title="Cancel your booking">
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => setShowCancel(true)}
          >
            Cancel booking
          </Button>
        </Tooltip>
      </Space>

      <SeatMapModal
        open={showSeat}
        onClose={() => setShowSeat(false)}
        booking={booking}
      />
      <SwitchSeatsModal
        open={showSwap}
        onClose={() => setShowSwap(false)}
        booking={booking}
      />
      <CancelBookingModal
        open={showCancel}
        onClose={() => setShowCancel(false)}
        booking={booking}
      />
    </>
  );
}
