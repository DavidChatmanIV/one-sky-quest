import React from "react";
import { Card, Row, Col, Button, Tooltip } from "antd";
import { CompassOutlined } from "@ant-design/icons";

const cruiseData = [
  {
    id: 1,
    cruiseLine: "Royal Caribbean",
    destination: "Bahamas",
    duration: "4 Nights",
    price: 499,
    image: "/images/cruises/royal.jpg",
  },
  {
    id: 2,
    cruiseLine: "Carnival Cruise",
    destination: "Caribbean",
    duration: "5 Nights",
    price: 569,
    image: "/images/cruises/carnival.jpg",
  },
  {
    id: 3,
    cruiseLine: "Norwegian",
    destination: "Alaska",
    duration: "7 Nights",
    price: 899,
    image: "/images/cruises/norwegian.jpg",
  },
];

const CruiseListings = () => {
  return (
    <div className="px-4 sm:px-8 py-6">
      <h2 className="text-2xl font-bold mb-6">🛳 Featured Cruises</h2>
      <Row gutter={[24, 24]}>
        {cruiseData.map((cruise) => (
          <Col key={cruise.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="rounded-xl shadow-md"
              cover={
                <img
                  alt={cruise.cruiseLine}
                  src={cruise.image}
                  className="h-48 w-full object-cover"
                />
              }
            >
              <h3 className="text-lg font-semibold">{cruise.cruiseLine}</h3>
              <p className="text-sm text-gray-600">{cruise.destination}</p>
              <p className="text-sm text-gray-500 mb-2">{cruise.duration}</p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold text-lg">
                  ${cruise.price}
                  <span className="text-sm text-gray-500"> / person</span>
                </span>
                <Tooltip title="Book this cruise">
                  <Button
                    type="primary"
                    icon={<CompassOutlined />}
                    size="small"
                  >
                    Book
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

export default CruiseListings;
