import React from "react";
import { Card, Col, Row, Empty, Button, message } from "antd";

const sampleTrips = [
  {
    id: 1,
    destination: "Tokyo, Japan",
    dates: "Aug 15 - Aug 25",
    price: "$1,250",
  },
  {
    id: 2,
    destination: "Barcelona, Spain",
    dates: "Sept 10 - Sept 18",
    price: "$980",
  },
];

const SavedTrips = () => {
  const handleRemove = (id) => {
    message.info(`Trip ${id} removed (mock logic)`);
    // In production: remove from state or backend
  };

  return (
    <section style={{ padding: "2rem" }}>
      <h2 className="text-xl font-semibold mb-4">💾 Your Saved Trips</h2>

      {sampleTrips.length === 0 ? (
        <Empty description="No saved trips yet." />
      ) : (
        <Row gutter={[16, 16]}>
          {sampleTrips.map((trip) => (
            <Col xs={24} sm={12} md={8} key={trip.id}>
              <Card
                title={trip.destination}
                variant="outlined" // ✅ Updated here
                actions={[
                  <Button type="link" onClick={() => handleRemove(trip.id)}>
                    ❌ Remove
                  </Button>,
                  <Button type="link">📆 Book Now</Button>,
                ]}
              >
                <p>🗓️ {trip.dates}</p>
                <p>💰 {trip.price}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default SavedTrips;
