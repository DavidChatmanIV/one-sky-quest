import React from "react";
import { Card, Row, Col, Button, Tooltip } from "antd";
import { RightOutlined } from "@ant-design/icons";

const flightData = [
  {
    id: 1,
    airline: "Delta Air Lines",
    from: "Newark (EWR)",
    to: "Los Angeles (LAX)",
    departTime: "8:00 AM",
    arriveTime: "11:20 AM",
    price: 249,
    class: "Economy",
    image: "/images/flights/delta.png",
  },
  {
    id: 2,
    airline: "Emirates",
    from: "JFK (NYC)",
    to: "Dubai (DXB)",
    departTime: "9:30 PM",
    arriveTime: "6:45 PM +1",
    price: 899,
    class: "Business",
    image: "/images/flights/emirates.png",
  },
  {
    id: 3,
    airline: "JetBlue",
    from: "Boston (BOS)",
    to: "Orlando (MCO)",
    departTime: "12:15 PM",
    arriveTime: "3:20 PM",
    price: 129,
    class: "Economy",
    image: "/images/flights/jetblue.png",
  },
];

const FlightListings = () => {
  return (
    <div className="px-4 sm:px-8 py-6">
      <h2 className="text-2xl font-bold mb-6">✈️ Available Flights</h2>
      <Row gutter={[24, 24]}>
        {flightData.map((flight) => (
          <Col key={flight.id} xs={24} sm={24} md={12} lg={8}>
            <Card
              hoverable
              className="rounded-2xl shadow-md"
              cover={
                <img
                  alt={flight.airline}
                  src={flight.image}
                  className="h-40 object-contain p-4 bg-gray-50"
                />
              }
            >
              <h3 className="text-lg font-semibold">{flight.airline}</h3>
              <p className="text-sm text-gray-600 mb-1">
                {flight.from} <RightOutlined /> {flight.to}
              </p>
              <p className="text-sm text-gray-500">
                🕒 {flight.departTime} → {flight.arriveTime}
              </p>
              <p className="text-sm mt-2 text-gray-700">
                Class: {flight.class}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-indigo-600 font-bold text-lg">
                  ${flight.price}
                </span>
                <Tooltip title="Book this flight">
                  <Button type="primary" size="small">
                    Book Now
                  </Button>
                </Tooltip>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FlightListings;
