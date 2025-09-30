import React from "react";
import { Card, Row, Col, Tag, Empty } from "antd";
import { CarOutlined } from "@ant-design/icons";

const ListingsSection = ({ listings = [] }) => {
  if (!listings.length) {
    return (
      <Empty description="No car listings found" style={{ marginTop: 40 }} />
    );
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ marginBottom: 16 }}>
        <CarOutlined /> Available Cars
      </h2>

      <Row gutter={[16, 24]}>
        {listings.map((car, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              title={car.name}
              bordered
              hoverable
              extra={<Tag color="blue">{car.type}</Tag>}
            >
              <p>
                <strong>Price:</strong> ${car.price} / day
              </p>
              <p>
                <strong>Pickup:</strong> {car.pickupLocation} — {car.pickupDate}{" "}
                @ {car.pickupTime}
              </p>
              <p>
                <strong>Dropoff:</strong> {car.dropoffLocation} —{" "}
                {car.dropoffDate} @ {car.dropoffTime}
              </p>

              {car.extras?.length > 0 && (
                <>
                  <p>
                    <strong>Extras:</strong>
                  </p>
                  {car.extras.map((extra, i) => (
                    <Tag color="green" key={i}>
                      {extra}
                    </Tag>
                  ))}
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListingsSection;
