import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  Typography,
  Divider,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Family"];
const BED_TYPES = ["Twin", "Queen", "King", "Bunk"];
const ROLE_TAGS = ["Parent", "Coach", "Player", "Chaperone"];

// 🔹 Default config for a room
const createDefaultRoom = () => ({
  type: "Standard",
  adults: 2,
  children: 0,
  bedType: "Queen",
  role: "",
});

const MultiRoomBooking = ({ totalGuests = 0, onConfirm }) => {
  const [rooms, setRooms] = useState([createDefaultRoom()]);

  // 🔹 Auto-generate rooms when totalGuests is passed
  useEffect(() => {
    if (totalGuests > 0) {
      const suggestedCount = Math.ceil(totalGuests / 2);
      const newRooms = Array.from(
        { length: suggestedCount },
        createDefaultRoom
      );
      setRooms(newRooms);
    }
  }, [totalGuests]);

  const addRoom = () => setRooms([...rooms, createDefaultRoom()]);

  const removeRoom = (index) => setRooms(rooms.filter((_, i) => i !== index));

  const updateRoom = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  const getRoomPrice = (room) => {
    let base = 100;
    if (room.type === "Deluxe") base += 50;
    if (room.type === "Suite") base += 100;
    if (room.type === "Family") base += 80;
    return base + room.adults * 25 + room.children * 10;
  };

  const totalCost = rooms.reduce((sum, room) => sum + getRoomPrice(room), 0);

  const handleContinue = () => {
    const saved = JSON.parse(localStorage.getItem("savedGroupRooms") || "[]");
    localStorage.setItem(
      "savedGroupRooms",
      JSON.stringify([...saved, ...rooms])
    );
    if (onConfirm) onConfirm(rooms);
  };

  return (
    <Card title="🛏️ Group Room Booking" className="shadow-lg">
      <Title level={4}>Book Rooms for Your Group</Title>
      <Text type="secondary">
        Add multiple rooms and configure guests, beds, and roles easily.
      </Text>
      <Divider />

      {rooms.map((room, index) => (
        <Card
          key={index}
          type="inner"
          title={`Room ${index + 1}`}
          className="mb-4 bg-white rounded-lg"
          extra={
            rooms.length > 1 && (
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => removeRoom(index)}
              />
            )
          }
        >
          <Form layout="vertical">
            <Form.Item label="Room Type">
              <Select
                value={room.type}
                onChange={(val) => updateRoom(index, "type", val)}
              >
                {ROOM_TYPES.map((type) => (
                  <Option key={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Bed Preference">
              <Select
                value={room.bedType}
                onChange={(val) => updateRoom(index, "bedType", val)}
              >
                {BED_TYPES.map((bed) => (
                  <Option key={bed}>{bed}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Adults">
              <InputNumber
                min={1}
                max={6}
                value={room.adults}
                onChange={(val) => updateRoom(index, "adults", val)}
              />
            </Form.Item>

            <Form.Item label="Children">
              <InputNumber
                min={0}
                max={6}
                value={room.children}
                onChange={(val) => updateRoom(index, "children", val)}
              />
            </Form.Item>

            <Form.Item label="Assign Room Role (Optional)">
              <Select
                allowClear
                value={room.role}
                onChange={(val) => updateRoom(index, "role", val)}
                placeholder="Choose a role"
              >
                {ROLE_TAGS.map((tag) => (
                  <Option key={tag}>{tag}</Option>
                ))}
              </Select>
            </Form.Item>

            <Text type="success">
              💵 Estimated: ${getRoomPrice(room)} for this room
            </Text>
          </Form>
        </Card>
      ))}

      <Button
        type="dashed"
        onClick={addRoom}
        icon={<PlusOutlined />}
        className="w-full my-4"
      >
        Add Another Room
      </Button>

      <Divider />
      <Title level={5}>Total Cost: ${totalCost}</Title>
      <Button type="primary" size="large" block onClick={handleContinue}>
        Continue to Traveler Info
      </Button>
    </Card>
  );
};

export default MultiRoomBooking;
