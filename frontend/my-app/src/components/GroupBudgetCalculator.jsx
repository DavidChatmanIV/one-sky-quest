import React, { useState } from "react";
import { Typography, Card, InputNumber, Row, Col, Button, Divider } from "antd";

const { Title, Paragraph } = Typography;

const GroupBudgetCalculator = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [groupSize, setGroupSize] = useState(1);
  const [perPerson, setPerPerson] = useState(0);

  const calculateSplit = () => {
    if (groupSize > 0) {
      setPerPerson((totalBudget / groupSize).toFixed(2));
    }
  };

  return (
    <section className="py-10 px-4" style={{ backgroundColor: "#ffffff" }}>
      <Title level={2} className="text-center">
        💸 Group Budget Calculator
      </Title>
      <Paragraph
        className="text-center"
        style={{ maxWidth: 600, margin: "0 auto 2rem" }}
      >
        Traveling together? Easily split trip costs and budget smarter with your
        group.
      </Paragraph>

      <Row justify="center">
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 12 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <label>Total Trip Cost ($)</label>
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  value={totalBudget}
                  onChange={setTotalBudget}
                />
              </Col>
              <Col span={12}>
                <label>Number of People</label>
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  value={groupSize}
                  onChange={setGroupSize}
                />
              </Col>
            </Row>

            <Divider />

            <Button type="primary" block onClick={calculateSplit}>
              Calculate Per Person
            </Button>

            {perPerson > 0 && (
              <div style={{ marginTop: 16, fontSize: 18, textAlign: "center" }}>
                Each person pays: <strong>${perPerson}</strong>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default GroupBudgetCalculator;
