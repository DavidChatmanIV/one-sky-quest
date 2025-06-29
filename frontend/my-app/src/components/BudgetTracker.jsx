import React, { useState } from "react";
import { Typography, InputNumber, Progress, Card } from "antd";

const { Title, Paragraph } = Typography;

const BudgetTracker = () => {
  const [budget, setBudget] = useState(1000); // default budget

  const allocations = {
    Flights: 0.35,
    Stays: 0.3,
    Food: 0.2,
    Activities: 0.15,
  };

  return (
    <section className="py-10 px-4 bg-gray-50" id="budget-tracker">
      <Title level={2} className="text-center">
        💰 Smart Budget Tracker
      </Title>
      <Paragraph className="text-center text-gray-600 mb-6">
        Plan how to spend your travel money wisely.
      </Paragraph>

      <div className="max-w-md mx-auto mb-8 text-center">
        <InputNumber
          value={budget}
          min={100}
          max={20000}
          formatter={(value) => `$ ${value}`}
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={(val) => setBudget(val)}
          className="w-full"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {Object.entries(allocations).map(([category, percent]) => (
          <Card key={category} title={category}>
            <Progress
              percent={Math.round((budget * percent * 100) / budget)}
              format={() => `$${Math.round(budget * percent)}`}
              status="active"
              strokeColor="#1677ff"
            />
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BudgetTracker;
