import React, { useEffect, useState } from "react";
import { Card, List, Typography, Tag, Spin } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Later: Replace with real API call
    const timeout = setTimeout(() => {
      setBookings([
        {
          id: 1,
          destination: "Tokyo, Japan",
          date: "2025-08-04",
          type: "Hotel",
          status: "Confirmed",
        },
        {
          id: 2,
          destination: "New York City",
          date: "2025-08-22",
          type: "Flight",
          status: "Booked",
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Card className="shadow-md">
      <Title level={4}>🛫 Your Upcoming Bookings</Title>

      {loading ? (
        <Spin />
      ) : bookings.length === 0 ? (
        <Text type="secondary">You don’t have any upcoming trips yet.</Text>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={bookings}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <span>
                    <CalendarOutlined /> {item.date}
                  </span>
                }
                description={
                  <div className="flex justify-between items-center">
                    <div>
                      <EnvironmentOutlined className="mr-2" />
                      {item.destination}
                    </div>
                    <Tag color={item.status === "Confirmed" ? "green" : "blue"}>
                      {item.type} - {item.status}
                    </Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default UpcomingBookings;
