
import React, { useMemo, useState } from "react";
import {
  Typography,
  Input,
  Select,
  Button,
  Card,
  Form,
  Divider,
  Tag,
  Space,
  Alert,
  Radio,
  InputNumber,
  Tooltip,
  Collapse,
} from "antd";
import {
  RobotOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
  RocketOutlined,
  CoffeeOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { useAssistant } from "../context/AssistantContext";

const { Title, Paragraph, Text } = Typography;

/* ---------- Options ---------- */
const BUDGET_OPTIONS = [
  { label: "$100", value: 100 },
  { label: "$500", value: 500 },
  { label: "$1,000+", value: 1000 },
  { label: "$2,500+", value: 2500 },
  { label: "$5,000+", value: 5000 },
];

const VIBE_OPTIONS = [
  { label: "🌴 Relaxing", value: "relaxing" },
  { label: "⛰️ Adventurous", value: "adventurous" },
  { label: "💖 Romantic", value: "romantic" },
  { label: "🏛️ Cultural", value: "cultural" },
  { label: "🎉 Nightlife/Party", value: "party" },
];

const FLIGHT_CLASS_OPTIONS = [
  { label: "Basic Economy", value: "basic" },
  { label: "Economy", value: "economy" },
  { label: "Premium Economy", value: "premium-economy" },
  { label: "Business", value: "business" },
  { label: "First Class", value: "first" },
];

const FOOD_PLAN_OPTIONS = [
  { label: "All-inclusive", value: "all-inclusive" },
  { label: "Pay per meal", value: "pay-per-meal" },
  { label: "Room service focused", value: "room-service" },
];

/* ---------- Demo generator (simple, feels intelligent) ---------- */
const mockGeneratePlan = async (params) => {
  const {
    destination,
    budget = 0,
    vibe,
    tripDays = 3,
    flightClass = "economy",
    activityLevel = "minimal",
    travelType = "solo",
    travelers = 1,
    foodPlan = "pay-per-meal",
  } = params;

  // Tiny multipliers to make the demo feel “alive”
  const classMult =
    {
      basic: 0.9,
      economy: 1.0,
      "premium-economy": 1.25,
      business: 1.8,
      first: 2.4,
    }[flightClass] ?? 1;

  const activityMult =
    {
      none: 0.85,
      minimal: 1.0,
      moderate: 1.2,
      high: 1.5,
    }[activityLevel] ?? 1;

  const foodMult =
    {
      "pay-per-meal": 1.0,
      "room-service": 1.25,
      "all-inclusive": 1.35,
    }[foodPlan] ?? 1;

  const people =
    travelType === "group" ? Math.max(Number(travelers) || 2, 2) : 1;
  const basePerDay = Math.max(
    80,
    Math.min(budget || 1000, 6000) / Math.max(tripDays, 1)
  );
  const estPerPerson = basePerDay * classMult * activityMult * foodMult;
  const estTrip = estPerPerson * tripDays * people;

  // Fake price band
  const low = Math.round(estTrip * 0.85);
  const high = Math.round(estTrip * 1.15);
  const fmt = (n) => n.toLocaleString();

  await new Promise((r) => setTimeout(r, 700));
  return {
    title: `Your ${vibe || "personalized"} trip to ${destination}`,
    summary:
      "Here’s a starter plan tailored to your vibe, budget, and time. Refine it anytime with AI.",
    estCost: `$${fmt(low)} – $${fmt(high)}`,
    bullets: [
      `Stay in a ${
        budget >= 1000 ? "boutique" : "budget-friendly"
      } hotel near the center`,
      vibe === "adventurous"
        ? "Guided outdoor excursion"
        : vibe === "relaxing"
        ? "Spa afternoon + sunset spot"
        : vibe === "romantic"
        ? "Scenic dinner + evening walk"
        : vibe === "party"
        ? "Nightlife district pass + late check-out"
        : "Top museums + local market",
      "Use public transit/day pass to cut costs",
    ],
    tags: [
      travelType,
      vibe || "custom",
      budget >= 2500 ? "premium" : "value",
      destination?.toLowerCase?.() || "",
    ],
  };
};

/* ---------- Component ---------- */
export default function TravelAssistant() {
  const { assistant = "Sora" } = useAssistant();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Reactively show/hide travelers based on form value
  const travelType = Form.useWatch("travelType", form) || "solo";

  const PrimaryIcon = assistant === "Questy" ? RocketOutlined : RobotOutlined;
  const primaryLabel = loading
    ? "Generating"
    : assistant === "Questy"
    ? "Quick Generate"
    : "Generate My Trip";

  const handleFinish = async (values) => {
    try {
      setError(null);
      setLoading(true);
      setResult(null);
      const data = await mockGeneratePlan(values);
      setResult(data);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setResult(null);
    setError(null);
  };

  const applyPreset = (preset) => {
    const presets = {
      soloWeekend: {
        destination: "Miami",
        budget: 1000,
        vibe: "party",
        flightClass: "economy",
        foodPlan: "pay-per-meal",
        activityLevel: "minimal",
        tripDays: 3,
        travelType: "solo",
        travelers: 1,
      },
      friendsTrip: {
        destination: "Cancún",
        budget: 2500,
        vibe: "relaxing",
        flightClass: "premium-economy",
        foodPlan: "all-inclusive",
        activityLevel: "moderate",
        tripDays: 5,
        travelType: "group",
        travelers: 4,
      },
      luxuryEscape: {
        destination: "Tokyo",
        budget: 5000,
        vibe: "cultural",
        flightClass: "business",
        foodPlan: "room-service",
        activityLevel: "minimal",
        tripDays: 7,
        travelType: "solo",
        travelers: 1,
      },
    };
    const values = presets[preset];
    form.setFieldsValue(values);
    setResult(null);
    setError(null);
  };

  // Nice defaults
  const initialValues = useMemo(
    () => ({
      destination: "",
      budget: 1000,
      vibe: "relaxing",
      flightClass: "economy",
      foodPlan: "pay-per-meal",
      activityLevel: "minimal",
      tripDays: 5,
      travelType: "solo",
      travelers: 1,
    }),
    []
  );

  return (
    <section
      id="ai-builder"
      className="w-full py-12 px-4 bg-gray-50"
      aria-label="AI Trip Builder"
    >
      <div className="flex flex-col items-center justify-center">
        <Card
          className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-2xl border border-gray-100"
          bordered={false}
        >
          <Title level={4} className="text-center">
            ✨ Build Your Perfect Trip with AI
          </Title>
          <Paragraph className="text-center mb-2">
            You’re using <b>{assistant}</b>. Switch anytime in the navbar.
          </Paragraph>
          <Paragraph className="text-center mb-4">
            Plan smarter with personalized recommendations — tailored to your
            vibe, budget, and goals.
          </Paragraph>

          {/* Quick Prefill */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 mb-6">
            <Text type="secondary">Quick Prefill:</Text>
            <Space wrap>
              <Button size="small" onClick={() => applyPreset("soloWeekend")}>
                Solo Weekend
              </Button>
              <Button size="small" onClick={() => applyPreset("friendsTrip")}>
                Friends Trip
              </Button>
              <Button size="small" onClick={() => applyPreset("luxuryEscape")}>
                Luxury Escape
              </Button>
            </Space>
          </div>

          {error && (
            <Alert
              role="status"
              type="error"
              message={error}
              showIcon
              className="mb-4"
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
            className="space-y-2"
            initialValues={initialValues}
          >
            {/* BASIC */}
            <Form.Item
              name="destination"
              label={<Text strong>Destination</Text>}
              rules={[
                { required: true, message: "Please enter a destination" },
              ]}
            >
              <Input
                size="large"
                placeholder="Where do you want to go? (e.g., Tokyo)"
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="travelType"
              label={<Text strong>Travel Type</Text>}
            >
              <Radio.Group size="large">
                <Radio.Button value="solo">
                  <UserOutlined /> Solo
                </Radio.Button>
                <Radio.Button value="group">
                  <TeamOutlined /> Group
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {travelType === "group" && (
              <Form.Item
                name="travelers"
                label={<Text strong>Number of Travelers</Text>}
                rules={[{ required: true, message: "Add traveler count" }]}
              >
                <InputNumber
                  min={2}
                  max={20}
                  className="w-full"
                  size="large"
                  placeholder="How many people?"
                />
              </Form.Item>
            )}

            <Form.Item
              name="tripDays"
              label={
                <span>
                  Trip Length (days) <ScheduleOutlined />
                </span>
              }
              tooltip="We’ll base stays around your number of days."
              rules={[
                { required: true, message: "Select trip length in days" },
              ]}
            >
              <InputNumber min={1} max={30} className="w-full" size="large" />
            </Form.Item>

            <Form.Item
              name="flightClass"
              label={
                <span>
                  Flight Class <RocketOutlined />
                </span>
              }
              tooltip="Filter flight options by cabin class."
            >
              <Select size="large" options={FLIGHT_CLASS_OPTIONS} />
            </Form.Item>

            {/* ADVANCED */}
            <Collapse
              className="bg-white"
              items={[
                {
                  key: "advanced",
                  label: (
                    <Text strong>
                      More options (budget, vibe, food, activity)
                    </Text>
                  ),
                  children: (
                    <div className="pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item
                          name="budget"
                          label={<Text strong>Your Budget</Text>}
                        >
                          <Select
                            size="large"
                            placeholder="Your Budget ($)"
                            options={BUDGET_OPTIONS}
                            allowClear
                          />
                        </Form.Item>
                        <Form.Item
                          name="vibe"
                          label={<Text strong>Trip Vibe</Text>}
                        >
                          <Select
                            size="large"
                            placeholder="Trip Vibe"
                            options={VIBE_OPTIONS}
                            allowClear
                          />
                        </Form.Item>
                      </div>

                      <Form.Item
                        name="foodPlan"
                        label={
                          <span>
                            Food & Dining <CoffeeOutlined />
                          </span>
                        }
                        tooltip="Pick the style that fits your trip."
                      >
                        <Select size="large" options={FOOD_PLAN_OPTIONS} />
                      </Form.Item>

                      <Form.Item
                        name="activityLevel"
                        label={
                          <span>
                            Activity Level{" "}
                            <Tooltip title="Higher activity usually increases total cost (tours, gear, guides).">
                              <Text type="secondary">(affects budget)</Text>
                            </Tooltip>
                          </span>
                        }
                      >
                        <Radio.Group
                          size="large"
                          className="flex flex-col gap-2"
                        >
                          <Radio value="none">
                            No activity — spa, rest, poolside
                          </Radio>
                          <Radio value="minimal">Minimal — light outings</Radio>
                          <Radio value="moderate">
                            Moderate — daily activities/tours
                          </Radio>
                          <Radio value="high">
                            Highly Active — adventure, multi-day excursions
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  ),
                },
              ]}
            />

            <Space.Compact block className="mt-3">
              <Button
                type="primary"
                icon={<PrimaryIcon />}
                size="large"
                htmlType="submit"
                loading={loading}
              >
                {primaryLabel}
              </Button>
              <Button
                size="large"
                onClick={resetForm}
                icon={<ReloadOutlined />}
                disabled={loading}
              >
                Reset
              </Button>
            </Space.Compact>
          </Form>

          {result && (
            <>
              <Divider className="my-6" />
              <Card bordered className="bg-gray-50">
                <Title level={5} className="!mb-1">
                  {result.title}
                </Title>
                <Paragraph className="!mb-2">{result.summary}</Paragraph>
                <Paragraph className="!mb-1">
                  <Text strong>Estimated Cost:</Text> {result.estCost}
                </Paragraph>
                <ul className="list-disc pl-5 mt-2">
                  {result.bullets.map((b, i) => (
                    <li key={i} className="mb-1">
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.tags?.map((t, i) => (
                    <Tag key={`${t || "tag"}-${i}`}>{t}</Tag>
                  ))}
                </div>
                <Space className="mt-4" wrap>
                  <Button type="default">Save Trip</Button>
                  <Button type="link">Refine with AI</Button>
                </Space>
              </Card>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}
