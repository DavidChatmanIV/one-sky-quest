import React from "react";
import { Typography, Row, Col, Card, Checkbox, Calendar } from "antd";

const { Title, Paragraph } = Typography;

const checklistItems = [
  "Passport / ID",
  "Book flights & hotel",
  "Currency exchanged",
  "Travel insurance",
  "Backup charger & adapter",
  "Print or download itinerary",
];

const TravelCalendarChecklist = () => {
  return (
    <section className="py-10 px-4" style={{ background: "#f0f2f5" }}>
      <Title level={2} className="text-center">
        🧳 Travel Calendar & Checklist
      </Title>
      <Paragraph
        className="text-center"
        style={{ maxWidth: 600, margin: "0 auto 2rem" }}
      >
        Stay organized and ready with your trip essentials and a live calendar
        to plan with ease.
      </Paragraph>

      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} md={12}>
          <Card
            title="🗓️ Travel Calendar"
            variant="outlined" // ✅ fixed
            style={{ borderRadius: 12 }}
          >
            <Calendar fullscreen={false} />
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card
            title="✔️ Trip Checklist"
            variant="outlined" // ✅ fixed
            style={{ borderRadius: 12 }}
          >
            {checklistItems.map((item, idx) => (
              <Checkbox key={idx} style={{ display: "block", marginBottom: 8 }}>
                {item}
              </Checkbox>
            ))}
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default TravelCalendarChecklist;
