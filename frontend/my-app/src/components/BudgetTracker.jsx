import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Typography,
  InputNumber,
  Slider,
  Row,
  Col,
  Card,
  Progress,
  message,
  Button,
  Select,
  Collapse,
  Input,
  Space,
  Tag,
  Radio,
  Switch,
} from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

/** =========================
 *  PRICING FLAGS + PROVIDERS
 *  =========================
 *  When you add live API pricing, set useStaticPricing=false and feed rates via props.
 */
const PRICING_FLAGS = {
  useStaticPricing: true, // flip to false when wiring live API
};

// Static fallbacks (used only if useStaticPricing=true)
const STATIC_FLIGHT_CLASS_MULT = {
  Basic: 0.9,
  Economy: 1.0,
  Business: 2.0,
  First: 3.0,
};
const STATIC_FOOD_PLAN_PER_DAY = {
  "All-inclusive": 65,
  "Pay per meal": 50,
  "Room service": 90,
};
const STATIC_ACTIVITY_PER_DAY = {
  "No activity": 0,
  Minimal: 20,
  Moderate: 45,
  High: 85,
};

// Simple getters that switch sources based on flags.
// In the future, pass `pricingOverrides` as a prop with {flightClassMult, foodPerDay, activityPerDay}.
const getFlightClassMult = (cls, pricingOverrides) =>
  (PRICING_FLAGS.useStaticPricing
    ? STATIC_FLIGHT_CLASS_MULT[cls]
    : pricingOverrides?.flightClassMult?.[cls]) ?? 1;

const getFoodRate = (plan, pricingOverrides) =>
  (PRICING_FLAGS.useStaticPricing
    ? STATIC_FOOD_PLAN_PER_DAY[plan]
    : pricingOverrides?.foodPerDay?.[plan]) ?? 0;

const getActivityRate = (level, pricingOverrides) =>
  (PRICING_FLAGS.useStaticPricing
    ? STATIC_ACTIVITY_PER_DAY[level]
    : pricingOverrides?.activityPerDay?.[level]) ?? 0;

/** ==============
 *  STORAGE + MISC
 *  ============== */
const STORAGE_KEY = "osq_budget_v3";
const STORAGE_VERSION = 3;

const PRESET_OPTIONS = [
  "Flights",
  "Stays",
  "Food",
  "Activities",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Insurance",
  "Misc",
];

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f7f",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb",
];

const DEFAULT_TOTAL = 1000;
const DEFAULT_TRIP_DAYS = 5;

const DEFAULT_STATE = {
  totalBudget: DEFAULT_TOTAL,
  tripDays: DEFAULT_TRIP_DAYS,
  pickerValue: ["Flights", "Stays", "Food", "Activities"],

  flights: {
    class: "Economy",
    airlines: { JetBlue: 150, Spirit: 100, Delta: 100 },
  },
  // linkToTrip toggles whether nights mirror tripDays
  stays: { nights: DEFAULT_TRIP_DAYS, nightlyRate: 120, linkToTrip: true },
  food: { plan: "Pay per meal" },
  activities: { level: "Moderate" },

  others: {
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Insurance: 0,
    Misc: 0,
  },
};

const clamp = (n, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;

const parseNum = (v, fb = 0) => {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : fb;
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj?.version !== STORAGE_VERSION) return null;
    return obj.state;
  } catch {
    return null;
  }
};

const save = (state) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: STORAGE_VERSION, state })
  );
};

export default function SmartBudgetTracker({ pricingOverrides }) {
  const [totalBudget, setTotalBudget] = useState(DEFAULT_STATE.totalBudget);
  const [tripDays, setTripDays] = useState(DEFAULT_STATE.tripDays);
  const [pickerValue, setPickerValue] = useState(DEFAULT_STATE.pickerValue);

  const [flights, setFlights] = useState(DEFAULT_STATE.flights);
  const [stays, setStays] = useState(DEFAULT_STATE.stays);
  const [food, setFood] = useState(DEFAULT_STATE.food);
  const [activities, setActivities] = useState(DEFAULT_STATE.activities);
  const [others, setOthers] = useState(DEFAULT_STATE.others);

  const [customInput, setCustomInput] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const saveTimer = useRef(null);
  const mounted = useRef(false);

  // Load
  useEffect(() => {
    const s = load();
    if (s) {
      setTotalBudget(clamp(parseNum(s.totalBudget, DEFAULT_TOTAL), 0));
      setTripDays(clamp(parseNum(s.tripDays, DEFAULT_TRIP_DAYS), 0, 365));
      setPickerValue(
        Array.isArray(s.pickerValue) && s.pickerValue.length
          ? s.pickerValue
          : DEFAULT_STATE.pickerValue
      );
      setFlights(s.flights || DEFAULT_STATE.flights);
      setStays(s.stays || DEFAULT_STATE.stays);
      setFood(s.food || DEFAULT_STATE.food);
      setActivities(s.activities || DEFAULT_STATE.activities);
      setOthers(s.others || DEFAULT_STATE.others);
    }
    mounted.current = true;
  }, []);

  // Auto-save (debounced)
  useEffect(() => {
    if (!mounted.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      save({
        totalBudget,
        tripDays,
        pickerValue,
        flights,
        stays,
        food,
        activities,
        others,
      });
      setSavedAt(new Date());
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [
    totalBudget,
    tripDays,
    pickerValue,
    flights,
    stays,
    food,
    activities,
    others,
  ]);

  // Derived totals
  const flightsBaseTotal = useMemo(
    () =>
      Object.values(flights.airlines || {}).reduce(
        (s, v) => s + parseNum(v, 0),
        0
      ),
    [flights]
  );
  const flightMult = getFlightClassMult(flights.class, pricingOverrides);
  const flightsTotal = useMemo(
    () => Math.round(flightsBaseTotal * (flightMult ?? 1)),
    [flightsBaseTotal, flightMult]
  );

  const staysNights = stays.linkToTrip ? tripDays : stays.nights ?? tripDays;
  const staysTotal =
    clamp(parseNum(staysNights, tripDays), 0) *
    clamp(parseNum(stays.nightlyRate, 0), 0);

  const foodPerDay = getFoodRate(food.plan, pricingOverrides);
  const foodTotal = clamp(tripDays, 0) * foodPerDay;

  const activityPerDay = getActivityRate(activities.level, pricingOverrides);
  const activitiesTotal = clamp(tripDays, 0) * activityPerDay;

  // Unified allocation map
  const allocationForUI = useMemo(() => {
    const base = {};
    if (pickerValue.includes("Flights")) base.Flights = flightsTotal;
    if (pickerValue.includes("Stays")) base.Stays = staysTotal;
    if (pickerValue.includes("Food")) base.Food = foodTotal;
    if (pickerValue.includes("Activities")) base.Activities = activitiesTotal;
    Object.entries(others).forEach(([k, v]) => {
      if (pickerValue.includes(k)) base[k] = clamp(parseNum(v, 0), 0);
    });
    return base;
  }, [
    pickerValue,
    flightsTotal,
    staysTotal,
    foodTotal,
    activitiesTotal,
    others,
  ]);

  const totalUsed = useMemo(
    () => Object.values(allocationForUI).reduce((s, v) => s + v, 0),
    [allocationForUI]
  );
  const remaining = totalBudget - totalUsed;

  // Picker
  const onPickerChange = (values) => {
    const clean = values.filter(Boolean);
    const nextOthers = { ...others };
    clean.forEach((cat) => {
      if (
        !["Flights", "Stays", "Food", "Activities"].includes(cat) &&
        !(cat in nextOthers)
      ) {
        nextOthers[cat] = 0;
      }
    });
    Object.keys(nextOthers).forEach((k) => {
      if (!clean.includes(k)) delete nextOthers[k];
    });
    setOthers(nextOthers);
    setPickerValue(clean);
  };

  // Custom category
  const addCustomCategory = () => {
    const name = customInput.trim();
    if (!name) return;
    if (
      ["Flights", "Stays", "Food", "Activities"].includes(name) ||
      others[name]
    ) {
      message.info("That category already exists.");
      return;
    }
    setOthers((o) => ({ ...o, [name]: 0 }));
    setPickerValue((p) => Array.from(new Set([...p, name])));
    setCustomInput("");
  };

  // Reset
  const handleReset = () => {
    setTotalBudget(DEFAULT_TOTAL);
    setTripDays(DEFAULT_TRIP_DAYS);
    setPickerValue([...DEFAULT_STATE.pickerValue]);
    setFlights({ ...DEFAULT_STATE.flights });
    setStays({ ...DEFAULT_STATE.stays });
    setFood({ ...DEFAULT_STATE.food });
    setActivities({ ...DEFAULT_STATE.activities });
    setOthers({ ...DEFAULT_STATE.others });
    save({
      totalBudget: DEFAULT_TOTAL,
      tripDays: DEFAULT_TRIP_DAYS,
      pickerValue: [...DEFAULT_STATE.pickerValue],
      flights: { ...DEFAULT_STATE.flights },
      stays: { ...DEFAULT_STATE.stays },
      food: { ...DEFAULT_STATE.food },
      activities: { ...DEFAULT_STATE.activities },
      others: { ...DEFAULT_STATE.others },
    });
    setSavedAt(new Date());
    message.success("Budget reset to default.");
  };

  // Handlers
  const updateAirline = (airline, val) =>
    setFlights((f) => ({
      ...f,
      airlines: {
        ...(f.airlines || {}),
        [airline]: clamp(parseNum(val, 0), 0),
      },
    }));

  const addAirline = (name) => {
    const n = name.trim();
    if (!n) return;
    if ((flights.airlines || {})[n]) {
      message.info("Airline already exists.");
      return;
    }
    setFlights((f) => ({ ...f, airlines: { ...(f.airlines || {}), [n]: 0 } }));
  };

  const setOtherValue = (k, v) =>
    setOthers((o) => ({ ...o, [k]: clamp(parseNum(v, 0), 0) }));

  const autoSavedLabel = useMemo(() => {
    if (!savedAt) return "";
    return `Auto-saved ${savedAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }, [savedAt]);

  const chartData = useMemo(
    () =>
      Object.entries(allocationForUI).map(([name, value], i) => ({
        name,
        value,
        fill: COLORS[i % COLORS.length],
      })),
    [allocationForUI]
  );

  return (
    <section className="py-10 px-4 bg-gray-50" id="budget-tracker">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Title level={2} className="mb-1">
              💰 Smart Budget Tracker
            </Title>
            <Paragraph className="text-gray-600 mb-0">
              Pick what to budget for, set trip length, and tune each section.
            </Paragraph>
          </div>
          <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
            {autoSavedLabel}
          </Text>
        </div>

        {/* Top controls */}
        <Row gutter={[16, 16]} className="mt-4 mb-2">
          <Col xs={24} md={12}>
            <Text strong>Total Budget</Text>
            <InputNumber
              value={totalBudget}
              min={0}
              max={200000}
              formatter={(v) => `$ ${v}`}
              parser={(v) => (v ? v.replace(/\$\s?|(,*)/g, "") : "0")}
              onChange={(val) => setTotalBudget(clamp(parseNum(val, 0), 0))}
              className="w-full mt-2"
            />
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Trip Length (days)</Text>
            <InputNumber
              value={tripDays}
              min={0}
              max={365}
              onChange={(val) => {
                const d = clamp(parseNum(val, DEFAULT_TRIP_DAYS), 0, 365);
                setTripDays(d);
                // If stays is linked, keep nights synced
                if (stays.linkToTrip) {
                  setStays((s) => ({ ...s, nights: d }));
                }
              }}
              className="w-full mt-2"
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} md={12}>
            <Button onClick={handleReset} type="default" danger block>
              🔄 Reset All
            </Button>
          </Col>
          <Col xs={24} md={12}>
            {/* Category Picker */}
            <Card bordered={false} bodyStyle={{ padding: 12 }}>
              <Space direction="vertical" className="w-full">
                <Text strong>What do you want to budget for?</Text>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select sections (e.g., Flights, Stays, Food)…"
                  value={pickerValue}
                  onChange={onPickerChange}
                  options={PRESET_OPTIONS.map((o) => ({ label: o, value: o }))}
                  className="w-full"
                />
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="Add custom category (e.g., Souvenirs)"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onPressEnter={addCustomCategory}
                    maxLength={32}
                  />
                  <Button onClick={addCustomCategory} type="primary">
                    Add
                  </Button>
                </Space.Compact>
                <div>
                  {pickerValue.map((cat) => (
                    <Tag key={cat} color="blue" style={{ marginBottom: 8 }}>
                      {cat}
                    </Tag>
                  ))}
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Sections */}
        <Row gutter={[16, 16]}>
          {/* Flights */}
          {pickerValue.includes("Flights") && (
            <Col xs={24} md={12}>
              <Card
                title="Flights"
                extra={<Text type="secondary">${flightsTotal}</Text>}
                bordered={false}
              >
                <Text strong className="block mb-2">
                  Class
                </Text>
                <Select
                  value={flights.class}
                  onChange={(c) => setFlights((f) => ({ ...f, class: c }))}
                  options={Object.keys(STATIC_FLIGHT_CLASS_MULT).map((c) => ({
                    label: c,
                    value: c,
                  }))}
                  className="w-full mb-3"
                />
                {/* mini breakdown */}
                <Paragraph
                  type="secondary"
                  style={{ marginTop: -6, marginBottom: 12 }}
                >
                  Base <Text code>${flightsBaseTotal}</Text> ×{" "}
                  <Text code>{flights.class}</Text> (
                  <Text code>{flightMult}x</Text>) ={" "}
                  <Text code>${flightsTotal}</Text>
                </Paragraph>

                <Collapse ghost>
                  <Panel header="Airlines breakdown" key="airlines">
                    <Space.Compact style={{ width: "100%", marginBottom: 12 }}>
                      <Input
                        placeholder="Add airline (e.g., United)"
                        onPressEnter={(e) => addAirline(e.currentTarget.value)}
                        maxLength={32}
                      />
                      <Button
                        onClick={(e) => {
                          const node = e.currentTarget.previousSibling;
                          addAirline(node?.value || "");
                          if (node) node.value = "";
                        }}
                      >
                        Add
                      </Button>
                    </Space.Compact>
                    {Object.entries(flights.airlines).map(([airline, amt]) => (
                      <div key={airline} style={{ marginBottom: 8 }}>
                        <Space className="w-full" align="center">
                          <Text
                            style={{
                              width: 110,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {airline}
                          </Text>
                          <Slider
                            min={0}
                            max={Math.max(totalBudget, amt)}
                            value={amt}
                            onChange={(v) => updateAirline(airline, v)}
                            tooltip={{ formatter: (v) => `$${v}` }}
                            className="flex-1"
                          />
                          <Text
                            type="secondary"
                            style={{ width: 80, textAlign: "right" }}
                          >
                            ${amt}
                          </Text>
                        </Space>
                      </div>
                    ))}
                  </Panel>
                </Collapse>
              </Card>
            </Col>
          )}

          {/* Stays */}
          {pickerValue.includes("Stays") && (
            <Col xs={24} md={12}>
              <Card
                title="Stays (by nights × nightly rate)"
                extra={<Text type="secondary">${staysTotal}</Text>}
                bordered={false}
              >
                <div className="flex items-center justify-between mb-3">
                  <Text strong>Link nights to trip length</Text>
                  <Switch
                    checked={!!stays.linkToTrip}
                    onChange={(checked) => {
                      setStays((s) => {
                        const next = { ...s, linkToTrip: checked };
                        if (checked) next.nights = tripDays; // sync immediately
                        return next;
                      });
                    }}
                  />
                </div>
                <Row gutter={12}>
                  <Col span={12}>
                    <Text strong>Nights</Text>
                    <InputNumber
                      className="w-full mt-2"
                      min={0}
                      max={365}
                      disabled={!!stays.linkToTrip}
                      value={staysNights}
                      onChange={(v) =>
                        setStays((s) => ({
                          ...s,
                          nights: clamp(parseNum(v, tripDays), 0, 365),
                        }))
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <Text strong>Nightly Rate</Text>
                    <InputNumber
                      className="w-full mt-2"
                      min={0}
                      max={5000}
                      formatter={(v) => `$ ${v}`}
                      parser={(v) => (v ? v.replace(/\$\s?|(,*)/g, "") : "0")}
                      value={stays.nightlyRate}
                      onChange={(v) =>
                        setStays((s) => ({
                          ...s,
                          nightlyRate: clamp(parseNum(v, 0), 0),
                        }))
                      }
                    />
                  </Col>
                </Row>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  Tip: toggle the link to quickly match nights to your trip
                  length of <Text strong>{tripDays}</Text> days.
                </Paragraph>
              </Card>
            </Col>
          )}

          {/* Food */}
          {pickerValue.includes("Food") && (
            <Col xs={24} md={12}>
              <Card
                title="Food"
                extra={<Text type="secondary">${foodTotal}</Text>}
                bordered={false}
              >
                <Text strong className="block mb-2">
                  Plan
                </Text>
                <Radio.Group
                  value={food.plan}
                  onChange={(e) => setFood({ plan: e.target.value })}
                >
                  {Object.keys(STATIC_FOOD_PLAN_PER_DAY).map((p) => (
                    <Radio key={p} value={p}>
                      {p}{" "}
                      <Text type="secondary">
                        (${getFoodRate(p, pricingOverrides)}/day)
                      </Text>
                    </Radio>
                  ))}
                </Radio.Group>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  Uses <Text strong>{tripDays}</Text> days × plan rate.
                </Paragraph>
              </Card>
            </Col>
          )}

          {/* Activities */}
          {pickerValue.includes("Activities") && (
            <Col xs={24} md={12}>
              <Card
                title="Activities"
                extra={<Text type="secondary">${activitiesTotal}</Text>}
                bordered={false}
              >
                <Text strong className="block mb-2">
                  Activity level
                </Text>
                <Radio.Group
                  value={activities.level}
                  onChange={(e) => setActivities({ level: e.target.value })}
                >
                  {Object.keys(STATIC_ACTIVITY_PER_DAY).map((lvl) => (
                    <Radio key={lvl} value={lvl}>
                      {lvl}{" "}
                      <Text type="secondary">
                        (${getActivityRate(lvl, pricingOverrides)}/day)
                      </Text>
                    </Radio>
                  ))}
                </Radio.Group>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  Uses <Text strong>{tripDays}</Text> days × level rate.
                </Paragraph>
              </Card>
            </Col>
          )}

          {/* Other categories */}
          {Object.entries(others).map(([k, v]) =>
            pickerValue.includes(k) ? (
              <Col xs={24} md={12} key={k}>
                <Card
                  title={k}
                  bordered={false}
                  extra={<Text type="secondary">${v}</Text>}
                >
                  <Slider
                    min={0}
                    max={Math.max(totalBudget, v)}
                    value={v}
                    onChange={(val) => setOtherValue(k, val)}
                    tooltip={{ formatter: (val) => `$${val}` }}
                  />
                </Card>
              </Col>
            ) : null
          )}
        </Row>

        {/* Remaining + progress */}
        <div className="text-center mt-8">
          <Text type={remaining >= 0 ? "success" : "danger"}>
            Remaining: ${remaining}
          </Text>
          <Progress
            className="mt-2"
            percent={Math.min((totalUsed / (totalBudget || 1)) * 100, 100)}
            status={remaining >= 0 ? "active" : "exception"}
          />
        </div>

        {/* Donut Chart */}
        <div className="mt-10">
          <Title level={4} className="text-center">
            📊 Budget Allocation Breakdown
          </Title>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={`${entry.name}-${i}`}
                    fill={entry.fill ?? COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
