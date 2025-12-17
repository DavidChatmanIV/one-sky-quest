import React from "react";
import { Card, Rate, Button, Row, Col, Tooltip } from "antd";
import { EnvironmentOutlined, SaveOutlined } from "@ant-design/icons";

const hotelData = [
  {
    id: 1,
    name: "Skyline Luxury Hotel",
    location: "Tokyo, Japan",
    price: 199,
    rating: 4.5,
    image: "/images/hotels/hotel1.jpg",
  },
  {
    id: 2,
    name: "Coastal Dream Inn",
    location: "Santorini, Greece",
    price: 149,
    rating: 4.2,
    image: "/images/hotels/hotel2.jpg",
  },
  {
    id: 3,
    name: "Urban Nest Suites",
    location: "New York City, USA",
    price: 229,
    rating: 4.7,
    image: "/images/hotels/hotel3.jpg",
  },
];

const HotelListings = () => {
  return (
    <div className="px-4 sm:px-8 py-6">
      <Row gutter={[24, 24]}>
        {hotelData.map((hotel) => (
          <Col key={hotel.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <img
                  alt={hotel.name}
                  src={hotel.image}
                  className="h-48 w-full object-cover"
                />
              }
              className="rounded-2xl shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                <Tooltip title="Save Trip">
                  <Button shape="circle" icon={<SaveOutlined />} />
                </Tooltip>
              </div>

              <p className="text-sm text-gray-600 flex items-center mb-1">
                <EnvironmentOutlined className="mr-1" />
                {hotel.location}
              </p>

              <Rate
                allowHalf
                disabled
                defaultValue={hotel.rating}
                className="mb-2"
              />

              <div className="flex justify-between items-center mt-2">
                <p className="text-base font-bold text-blue-600">
                  ${hotel.price}{" "}
                  <span className="text-sm text-gray-500">/ night</span>
                </p>
                <Button type="primary" size="small">
                  Book Now
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HotelListings;
