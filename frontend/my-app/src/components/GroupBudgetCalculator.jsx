import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  InputNumber,
  Select,
  Slider,
  Divider,
  Tag,
  Space,
  Tooltip,
  Switch,
} from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

/** ---------- CONFIG / PRICING MODEL (adjust anytime) ---------- */
const FLIGHT_CLASS_MULTIPLIER = {
  basic: 0.85,
  economy: 1.0,
  premium: 1.35,
  business: 2.1,
  first: 3.0,
};

const FOOD_PLAN_PER_DAY = {
  allInclusive: 70, // covers most meals
  payPerMeal: 45, // avg across b/l/d
  roomService: 90, // convenience markup
};

const ACTIVITY_INTENSITY = {
  none: { label: "No activity", perDay: 0 },
  minimal: { label: "Minimal activity", perDay: 20 },
  moderate: { label: "Moderate activity", perDay: 45 },
  high: { label: "Highly active", perDay: 90 },
};

/** ---------- SHARED CARD STYLE TO MATCH SMART BUDGET ---------- */
const cardStyle = {
  maxWidth: 980,
  margin: "0 auto",
  borderRadius: 12,
  boxShadow: "0 6px 22px rgba(0,0,0,0.08)",
};

/** ---------- COMPONENT ---------- */
const GroupBudgetSmart = () => {
  // Core trip setup
  const [travelers, setTravelers] = useState(2);
  const [nights, setNights] = useState(5);

  // Flights
  const [flightClass, setFlightClass] = useState("economy");
  const [baseFlightPrice, setBaseFlightPrice] = useState(300); // per person base before class
  const [includeFlights, setIncludeFlights] = useState(true);

  // Stays (priced by nights)
  const [nightlyRate, setNightlyRate] = useState(140); // total room per night

  // Food
  const [foodPlan, setFoodPlan] = useState("payPerMeal");

  // Activities
  const [activityLevel, setActivityLevel] = useState("minimal");

  // Optional: persist lightweight state (comment out if you don’t want localStorage yet)
  useEffect(() => {
    const state = {
      travelers,
      nights,
      flightClass,
      baseFlightPrice,
      includeFlights,
      nightlyRate,
      foodPlan,
      activityLevel,
    };
    localStorage.setItem("osq_group_budget_v2", JSON.stringify(state));
  }, [
    travelers,
    nights,
    flightClass,
    baseFlightPrice,
    includeFlights,
    nightlyRate,
    foodPlan,
    activityLevel,
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("osq_group_budget_v2");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setTravelers(s.travelers ?? 2);
        setNights(s.nights ?? 5);
        setFlightClass(s.flightClass ?? "economy");
        setBaseFlightPrice(s.baseFlightPrice ?? 300);
        setIncludeFlights(s.includeFlights ?? true);
        setNightlyRate(s.nightlyRate ?? 140);
        setFoodPlan(s.foodPlan ?? "payPerMeal");
        setActivityLevel(s.activityLevel ?? "minimal");
      } catch {}
    }
  }, []);

  /** ---------- CALCULATIONS ---------- */
  const {
    flightCostTotal,
    stayCostTotal,
    foodCostTotal,
    activityCostTotal,
    grandTotal,
    perPerson,
  } = useMemo(() => {
    const classMult = FLIGHT_CLASS_MULTIPLIER[flightClass] ?? 1;
    const flightPerPerson = includeFlights ? baseFlightPrice * classMult : 0;
    const flightCost = flightPerPerson * travelers;

    const stayTotal = nights * nightlyRate; // whole room/apartment price * nights
    // Optionally divide stays by travelers if you want per-person lodging split at the end.

    const foodPerPersonPerDay = FOOD_PLAN_PER_DAY[foodPlan] ?? 0;
    const foodTotal = foodPerPersonPerDay * nights * travelers;

    const activityPerDay = ACTIVITY_INTENSITY[activityLevel]?.perDay ?? 0;
    const activityTotal = activityPerDay * nights * travelers;

    const total = flightCost + stayTotal + foodTotal + activityTotal;
    const per = travelers > 0 ? total / travelers : 0;

    return {
      flightCostTotal: flightCost,
      stayCostTotal: stayTotal,
      foodCostTotal: foodTotal,
      activityCostTotal: activityTotal,
      grandTotal: total,
      perPerson: per,
    };
  }, [
    travelers,
    nights,
    flightClass,
    baseFlightPrice,
    includeFlights,
    nightlyRate,
    foodPlan,
    activityLevel,
  ]);

  return (
    <section style={{ padding: "32px 16px", background: "#f5f7fb" }}>
      <Card style={cardStyle}>
        <Space
          align="center"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <DollarCircleOutlined />
          <Title level={3} style={{ margin: 0 }}>
            Group Budget (Smart Style)
          </Title>
        </Space>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginTop: 8 }}
        >
          Smooth, clean, and simple. Tune filters—totals update instantly.
        </Text>

        <Divider />

        {/* Top Row: Trip Basics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Text strong>Travelers</Text>
            <InputNumber
              min={1}
              value={travelers}
              onChange={setTravelers}
              style={{ width: "100%", marginTop: 8 }}
            />
            <Text type="secondary">How many people are going?</Text>
          </Col>

          <Col xs={24} md={8}>
            <Text strong>Nights</Text>
            <InputNumber
              min={1}
              value={nights}
              onChange={setNights}
              style={{ width: "100%", marginTop: 8 }}
            />
            <Text type="secondary">
              Stays are based on days/nights (not price tiers).
            </Text>
          </Col>

          <Col xs={24} md={8}>
            <Text strong>Include Flights</Text>
            <div style={{ marginTop: 8 }}>
              <Switch checked={includeFlights} onChange={setIncludeFlights} />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                Toggle if flights apply
              </Text>
            </div>
          </Col>
        </Row>

        <Divider />

        {/* Flights */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Flight Class</Text>
            <Select
              value={flightClass}
              onChange={setFlightClass}
              style={{ width: "100%", marginTop: 8 }}
              disabled={!includeFlights}
            >
              <Option value="basic">Basic</Option>
              <Option value="economy">Economy</Option>
              <Option value="premium">Premium Economy</Option>
              <Option value="business">Business</Option>
              <Option value="first">First Class</Option>
            </Select>
            <Text type="secondary">
              Class multiplies the base fare per person.
            </Text>
          </Col>

          <Col xs={24} md={12}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Text strong>Base Flight Price (per person)</Text>
                <Tooltip title="Before class multiplier">
                  <Tag>Info</Tag>
                </Tooltip>
              </Space>
              <InputNumber
                min={0}
                value={baseFlightPrice}
                onChange={setBaseFlightPrice}
                style={{ width: "100%" }}
                disabled={!includeFlights}
              />
            </Space>
          </Col>
        </Row>

        <Divider />

        {/* Stays */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Nightly Rate (total for room)</Text>
            <InputNumber
              min={0}
              value={nightlyRate}
              onChange={setNightlyRate}
              style={{ width: "100%", marginTop: 8 }}
            />
            <Text type="secondary">Total lodging per night × nights.</Text>
          </Col>

          <Col xs={24} md={12}>
            <Text strong>Food Plan</Text>
            <Select
              value={foodPlan}
              onChange={setFoodPlan}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value="allInclusive">All Inclusive</Option>
              <Option value="payPerMeal">Pay Per Meal</Option>
              <Option value="roomService">Room Service</Option>
            </Select>
            <Text type="secondary">Food costs are per person per day.</Text>
          </Col>
        </Row>

        <Divider />

        {/* Activities */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Text strong>Activities Intensity</Text>
            <Select
              value={activityLevel}
              onChange={setActivityLevel}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value="none">{ACTIVITY_INTENSITY.none.label}</Option>
              <Option value="minimal">
                {ACTIVITY_INTENSITY.minimal.label}
              </Option>
              <Option value="moderate">
                {ACTIVITY_INTENSITY.moderate.label}
              </Option>
              <Option value="high">{ACTIVITY_INTENSITY.high.label}</Option>
            </Select>
            <Text type="secondary">
              More active → more expensive (per person per day).
            </Text>
          </Col>

          <Col xs={24} md={10}>
            <Card style={{ background: "#fafafa", borderRadius: 10 }}>
              <Text type="secondary">Per‑day activity guide</Text>
              <div style={{ marginTop: 8 }}>
                <Tag>Minimal: ${ACTIVITY_INTENSITY.minimal.perDay}/day</Tag>
                <Tag>Moderate: ${ACTIVITY_INTENSITY.moderate.perDay}/day</Tag>
                <Tag>High: ${ACTIVITY_INTENSITY.high.perDay}/day</Tag>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Summary */}
        <Card style={{ background: "#ffffff", borderRadius: 12 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ marginTop: 0 }}>
                Trip Summary
              </Title>
              <Space direction="vertical">
                {includeFlights && (
                  <Text>
                    Flights: <strong>${flightCostTotal.toFixed(2)}</strong>{" "}
                    <Text type="secondary">
                      ({travelers} × ${baseFlightPrice} ×{" "}
                      {FLIGHT_CLASS_MULTIPLIER[flightClass]} class multiplier)
                    </Text>
                  </Text>
                )}
                <Text>
                  Stays: <strong>${stayCostTotal.toFixed(2)}</strong>{" "}
                  <Text type="secondary">
                    ({nights} nights × ${nightlyRate}/night)
                  </Text>
                </Text>
                <Text>
                  Food: <strong>${foodCostTotal.toFixed(2)}</strong>{" "}
                  <Text type="secondary">
                    ({travelers} travelers × {nights} nights × $
                    {FOOD_PLAN_PER_DAY[foodPlan]}/day)
                  </Text>
                </Text>
                <Text>
                  Activities: <strong>${activityCostTotal.toFixed(2)}</strong>{" "}
                  <Text type="secondary">
                    ({travelers} × {nights} × $
                    {ACTIVITY_INTENSITY[activityLevel].perDay}/day)
                  </Text>
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Card style={{ background: "#fafafa", borderRadius: 10 }}>
                <Title level={3} style={{ margin: 0 }}>
                  ${grandTotal.toFixed(2)}
                </Title>
                <Text type="secondary">Total Trip Cost</Text>
                <Divider style={{ margin: "12px 0" }} />
                <Title level={4} style={{ margin: 0 }}>
                  ${perPerson.toFixed(2)}
                </Title>
                <Text type="secondary">Per Person</Text>
                <div style={{ marginTop: 12 }}>
                  <Tag color="blue">{travelers} travelers</Tag>
                  <Tag color="geekblue">{nights} nights</Tag>
                  {includeFlights ? (
                    <Tag color="green">Flights: {flightClass}</Tag>
                  ) : (
                    <Tag color="default">No flights</Tag>
                  )}
                  <Tag color="purple">Food: {foodPlan}</Tag>
                  <Tag color="magenta">Activity: {activityLevel}</Tag>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </Card>
    </section>
  );
};

export default GroupBudgetSmart;
