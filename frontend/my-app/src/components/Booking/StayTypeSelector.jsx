import React, { useState } from "react";
import { Typography, Card, Row, Col, message } from "antd";

const { Title } = Typography;

const stayTypes = [
  { type: "hotel", label: "🏨 Hotel" },
  { type: "airbnb", label: "🏡 Airbnb" },
  { type: "cabin", label: "🌲 Cabin" },
];

const StayTypeSelector = ({ onTypeSelect }) => {
  const [selectedType, setSelectedType] = useState("hotel");

  const handleSelect = (type) => {
    setSelectedType(type);
    message.success(`Showing: ${type.toUpperCase()} stays`);
    if (onTypeSelect) onTypeSelect(type); // 🔄 Notify parent
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 text-center">
      <Title level={4} className="text-blue-700 mb-2">
        🏨 Stay Your Way
      </Title>
      <p className="text-gray-500 mb-4">Choose your preferred type of stay:</p>

      <Row gutter={[16, 16]} justify="center">
        {stayTypes.map(({ type, label }) => (
          <Col xs={24} sm={8} key={type}>
            <Card
              hoverable
              onClick={() => handleSelect(type)}
              className={`transition duration-300 cursor-pointer text-lg font-medium rounded-xl ${
                selectedType === type
                  ? "border-blue-600 bg-blue-50"
                  : "bg-white"
              }`}
              style={{ padding: "1.5rem", borderWidth: 2 }}
            >
              {label}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StayTypeSelector;
