import React, { useState, useEffect } from "react";
import { Card, Tag, Row, Col, Empty, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const SavedExcursions = () => {
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("savedExcursions");
    if (stored) {
      setSavedTrips(JSON.parse(stored));
    }
  }, []);

  const handleRemove = (id) => {
    const updated = savedTrips.filter((trip) => trip.id !== id);
    setSavedTrips(updated);
    localStorage.setItem("savedExcursions", JSON.stringify(updated));
  };

  return (
    <section className="px-4 md:px-12 py-12 bg-gray-50 dark:bg-[#0f172a] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        💾 Saved Excursions
      </h2>

      {savedTrips.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Empty description="No excursions saved yet." />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {savedTrips.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                hoverable
                className="transition-all duration-300 hover:scale-[1.02] shadow-md"
                cover={
                  <img
                    alt={item.title}
                    src={item.image}
                    className="h-48 w-full object-cover rounded-t-md"
                  />
                }
              >
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm mb-2">
                  <EnvironmentOutlined /> {item.location}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map((tag) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Button
                  danger
                  size="small"
                  onClick={() => handleRemove(item.id)}
                  className="mt-1"
                >
                  🗑 Remove
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default SavedExcursions;
