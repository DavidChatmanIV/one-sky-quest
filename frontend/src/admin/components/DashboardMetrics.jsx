import React from "react";
import { Row, Col, Card, Statistic } from "antd";

const DashboardMetrics = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Total Bookings" value={152} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Registered Users" value={84} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Active Trips" value={39} />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardMetrics;
