import React from "react";
import { Card, Row, Col, Button, Tooltip } from "antd";
import { CarOutlined } from "@ant-design/icons";

const carData = [
  {
    id: 1,
    company: "Hertz",
    model: "Toyota Camry",
    location: "LAX Airport",
    price: 55,
    image: "/images/cars/camry.jpg",
  },
  {
    id: 2,
    company: "Enterprise",
    model: "Jeep Wrangler",
    location: "Newark (EWR)",
    price: 72,
    image: "/images/cars/wrangler.jpg",
  },
  {
    id: 3,
    company: "Avis",
    model: "BMW 3 Series",
    location: "Miami Intl (MIA)",
    price: 95,
    image: "/images/cars/bmw.jpg",
  },
];

const CarListings = () => {
  return (
    <div className="px-4 sm:px-8 py-6">
      <h2 className="text-2xl font-bold mb-6">🚗 Available Rental Cars</h2>
      <Row gutter={[24, 24]}>
        {carData.map((car) => (
          <Col key={car.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="rounded-xl shadow-lg"
              cover={
                <img
                  alt={car.model}
                  src={car.image}
                  className="h-48 w-full object-cover"
                />
              }
            >
              <h3 className="text-lg font-semibold">{car.model}</h3>
              <p className="text-sm text-gray-600">{car.company}</p>
              <p className="text-sm text-gray-500 mb-2">{car.location}</p>

              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold text-lg">
                  ${car.price}
                  <span className="text-sm text-gray-500"> / day</span>
                </span>
                <Tooltip title="Book this car">
                  <Button type="primary" icon={<CarOutlined />} size="small">
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

export default CarListings;
