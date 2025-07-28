import React from "react";
import { Alert, Typography, Card } from "antd";

const { Title, Paragraph } = Typography;

const alerts = [
  {
    type: "warning",
    message: "⚠️ Weather Delay in NYC",
    description: "Heavy snowstorms are causing flight delays out of JFK today.",
  },
  {
    type: "info",
    message: "🛂 Visa Update - Japan",
    description:
      "Japan now allows 90-day stays for U.S. travelers without a visa.",
  },
  {
    type: "error",
    message: "🚨 Airport Strike - Paris",
    description:
      "Charles de Gaulle Airport staff on strike. Expect major delays.",
  },
];

const RealTimeAlerts = () => {
  return (
    <section className="py-10 px-4 bg-white" id="real-time-alerts">
      <Title level={2} className="text-center">
        📢 Real-Time Travel Alerts
      </Title>
      <Paragraph className="text-center text-gray-600 mb-6">
        Stay informed with updates that impact your travel.
      </Paragraph>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {alerts.map((alert, index) => (
          <Card key={index}>
            <Alert
              message={alert.message}
              description={alert.description}
              type={alert.type}
              showIcon
            />
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RealTimeAlerts;
