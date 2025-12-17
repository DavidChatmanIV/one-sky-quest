import React from "react";
import { Card, Button, Row, Col, Rate, Tooltip } from "antd";
import {
  SaveOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  HomeOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const packageData = [
  {
    id: 1,
    title: "Tokyo Adventure Package",
    location: "Tokyo, Japan",
    price: 1249,
    rating: 4.8,
    image: "/images/packages/tokyo.jpg",
    includes: ["Flight", "4-Star Hotel", "2 Tours"],
  },
  {
    id: 2,
    title: "Greek Island Escape",
    location: "Santorini, Greece",
    price: 999,
    rating: 4.6,
    image: "/images/packages/greece.jpg",
    includes: ["Flight", "Boutique Hotel", "Sunset Cruise"],
  },
  {
    id: 3,
    title: "NYC City Lights",
    location: "New York, USA",
    price: 899,
    rating: 4.5,
    image: "/images/packages/nyc.jpg",
    includes: ["Round Trip", "Hotel", "Broadway Show"],
  },
];

const PackageListings = () => {
  return (
    <div className="px-4 sm:px-8 py-6">
      <h2 className="text-2xl font-bold mb-6">🌟 Featured Travel Packages</h2>
      <Row gutter={[24, 24]}>
        {packageData.map((pkg) => (
          <Col key={pkg.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <img
                  alt={pkg.title}
                  src={pkg.image}
                  className="h-48 w-full object-cover"
                />
              }
              className="rounded-2xl shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{pkg.title}</h3>
                <Tooltip title="Save Package">
                  <Button shape="circle" icon={<SaveOutlined />} />
                </Tooltip>
              </div>

              <p className="text-sm text-gray-600 flex items-center mb-1">
                <EnvironmentOutlined className="mr-1" />
                {pkg.location}
              </p>

              <Rate
                allowHalf
                disabled
                defaultValue={pkg.rating}
                className="mb-2"
              />

              <ul className="text-sm text-gray-700 mb-3 space-y-1">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-center">
                    {item.includes("Flight") && (
                      <RocketOutlined className="mr-2" />
                    )}
                    {item.includes("Hotel") && (
                      <HomeOutlined className="mr-2" />
                    )}
                    {item.includes("Tour") ||
                    item.includes("Cruise") ||
                    item.includes("Show") ? (
                      <CompassOutlined className="mr-2" />
                    ) : null}
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center mt-2">
                <p className="text-base font-bold text-indigo-600">
                  ${pkg.price}
                  <span className="text-sm text-gray-500"> / person</span>
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

export default PackageListings;
