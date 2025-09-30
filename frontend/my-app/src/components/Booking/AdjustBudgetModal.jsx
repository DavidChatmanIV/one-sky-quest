import React from "react";
import { Modal, Row, Col, Slider, Typography, Divider, Space } from "antd";
import { useBudget } from "../../context/useBudget";

const { Text, Title } = Typography;

export default function AdjustBudgetModal({ open, onClose }) {
  const { mode, travelers, personalCap, groupCap, categories, setCategories } =
    useBudget();

  const cap = mode === "group" ? groupCap : personalCap;
  const perPerson = mode === "group" && travelers ? groupCap / travelers : null;

  // simple split controller – keeps total at ~100
  const handleChange = (key, val) => {
    const next = { ...categories, [key]: val };
    // normalize to 100 without importing a chart lib
    const sum = Object.values(next).reduce((a, b) => a + b, 0) || 1;
    const normalized = Object.fromEntries(
      Object.entries(next).map(([k, v]) => [k, Math.round((v / sum) * 100)])
    );
    setCategories(normalized);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText="Done"
      title="Adjust Budget"
      width={680}
    >
      <Space direction="vertical" size={12} className="w-full">
        <Title level={5} className="!mb-1">
          Allocation
        </Title>
        <Text type="secondary">
          Tune how you expect to spend. (Used for your summary chart and tips.)
        </Text>

        <Row gutter={24} align="middle">
          <Col xs={24} md={12}>
            <Donut
              flights={categories.flights}
              stays={categories.stays}
              food={categories.food}
              activities={categories.activities}
            />
          </Col>
          <Col xs={24} md={12}>
            <SliderRow
              label="Flights"
              value={categories.flights}
              onChange={(v) => handleChange("flights", v)}
            />
            <SliderRow
              label="Stays"
              value={categories.stays}
              onChange={(v) => handleChange("stays", v)}
            />
            <SliderRow
              label="Food"
              value={categories.food}
              onChange={(v) => handleChange("food", v)}
            />
            <SliderRow
              label="Activities"
              value={categories.activities}
              onChange={(v) => handleChange("activities", v)}
            />
          </Col>
        </Row>

        <Divider />

        <SummaryLine label="Total budget" value={currency(cap)} />
        {perPerson !== null && (
          <SummaryLine label="Target per person" value={currency(perPerson)} />
        )}
      </Space>
    </Modal>
  );
}

function SliderRow({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="flex items-center justify-between mb-1">
        <Text>{label}</Text>
        <Text type="secondary">{value}%</Text>
      </div>
      <Slider min={0} max={100} value={value} onChange={onChange} />
    </div>
  );
}

// Lightweight SVG donut (no external libs)
function Donut({ flights, stays, food, activities, size = 180, stroke = 14 }) {
  const parts = [
    { key: "Flights", val: flights },
    { key: "Stays", val: stays },
    { key: "Food", val: food },
    { key: "Activities", val: activities },
  ];
  const total = parts.reduce((a, b) => a + b.val, 0) || 1;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  let offset = 0;
  const segs = parts.map((p, i) => {
    const frac = p.val / total;
    const len = circ * frac;
    const seg = (
      <circle
        key={p.key}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${len} ${circ - len}`}
        strokeDashoffset={-offset}
        // use default colors; your global theme will tint via parent
        stroke={["#8ab4ff", "#a0e0a7", "#ffd684", "#ff9bb0"][i % 4]}
      />
    );
    offset += len;
    return seg;
  });

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke="#eee"
          strokeOpacity="0.2"
          strokeWidth={stroke}
        />
        {segs}
      </svg>
    </div>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <Text type="secondary">{label}</Text>
      <Text strong>{value}</Text>
    </div>
  );
}

const currency = (n) => `$${Number(n ?? 0).toLocaleString()}`;
