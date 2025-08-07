import React, { useMemo, useState, useEffect } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Checkbox,
  Select,
  Input,
  Button,
  Space,
  Divider,
  Progress,
  Empty,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

/**
 * Lightweight country knowledge base (expand anytime or replace with API later)
 */
const COUNTRY_DEFAULTS = {
  "United States": [
    "Passport / ID",
    "Book flights & hotel",
    "Travel insurance",
    "Backup charger & adapter",
    "Print or download itinerary",
  ],
  Japan: [
    "Check visa requirements",
    "Purchase JR Pass (if needed)",
    "SUICA / PASMO card setup",
    "Travel insurance",
    "Download offline maps",
  ],
  France: [
    "Check visa requirements",
    "Book museum passes",
    "Travel insurance",
    "Currency exchanged or card enabled for EU",
    "Download offline maps",
  ],
  Mexico: [
    "Check visa / FMM form",
    "Travel insurance",
    "Notify bank of travel",
    "Sunscreen & insect repellent",
    "Download offline maps",
  ],
};

// Fallback starter list used when no country is selected
const BASE_STARTER = [
  "Passport / ID",
  "Book flights & hotel",
  "Currency exchanged",
  "Travel insurance",
  "Backup charger & adapter",
  "Print or download itinerary",
];

// ---- Utilities ----
const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const toItems = (arr) =>
  arr.map((label) => ({ id: uuid(), label, done: false }));

// LocalStorage helpers
const STORAGE_KEY = "osq_travel_checklist_v1";
const loadStorage = () => {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch (err) {
    console.warn("Failed to read checklist from localStorage:", err);
    return {};
  }
};
const saveStorage = (data) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Failed to save checklist to localStorage:", err);
  }
};

// Format YYYY-MM-DD string to a friendly label
const prettyDate = (yyyyMMdd) => {
  if (!yyyyMMdd) return "";
  const d = new Date(yyyyMMdd);
  return isNaN(d.getTime()) ? "" : d.toDateString();
};

const todayYMD = () => new Date().toISOString().slice(0, 10);

const TravelCalendarChecklist = () => {
  const [country, setCountry] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  // store as "YYYY-MM-DD" for simplicity and native date input
  const [value, setValue] = useState(() => todayYMD());

  // Load per-country saved list
  useEffect(() => {
    const store = loadStorage();
    const key = country || "__default";
    if (store[key]?.length) {
      setItems(store[key]);
    } else {
      const defaults = country
        ? COUNTRY_DEFAULTS[country] || BASE_STARTER
        : BASE_STARTER;
      setItems(toItems(defaults));
    }
  }, [country]);

  // Persist whenever items change
  useEffect(() => {
    const store = loadStorage();
    const key = country || "__default";
    store[key] = items;
    saveStorage(store);
  }, [country, items]);

  const completed = useMemo(() => items.filter((i) => i.done).length, [items]);
  const percent = items.length
    ? Math.round((completed / items.length) * 100)
    : 0;

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );
  };

  const addItem = () => {
    const label = newItem.trim();
    if (!label) return;
    setItems((prev) => [{ id: uuid(), label, done: false }, ...prev]);
    setNewItem("");
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetToDefaults = () => {
    const defaults = country
      ? COUNTRY_DEFAULTS[country] || BASE_STARTER
      : BASE_STARTER;
    setItems(toItems(defaults));
    message.success("Checklist reset to country defaults");
  };

  const onDateChange = (e) => {
    setValue(e.target.value); // "YYYY-MM-DD"
  };

  return (
    <section className="py-10 px-4" style={{ background: "#f0f2f5" }}>
      <Title level={2} className="text-center">
        🧳 Travel Calendar & Checklist
      </Title>
      <Paragraph
        className="text-center"
        style={{ maxWidth: 720, margin: "0 auto 2rem" }}
      >
        Stay organized with a simple date picker, country-aware requirements,
        and a customizable packing & prep list.
      </Paragraph>

      <Row gutter={[24, 24]} justify="center">
        {/* Left: Date selection (native) */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space align="center" size={12}>
                <span role="img" aria-label="calendar">
                  🗓️
                </span>
                <Text strong>Travel Date</Text>
              </Space>
            }
            style={{ borderRadius: 12 }}
            styles={{ body: { padding: 16 } }} // updated from bodyStyle
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <div>
                <Text type="secondary">Select a date</Text>
                <input
                  type="date"
                  className="ant-input"
                  value={value}
                  onChange={onDateChange}
                  style={{ marginTop: 6 }}
                />
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <Space wrap>
                <Text type="secondary">Selected date:</Text>
                <Text>{prettyDate(value)}</Text>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* Right: Checklist */}
        <Col xs={24} md={10}>
          <Card
            title={
              <Space align="center">
                <span role="img" aria-label="check">
                  ✔️
                </span>
                <Text strong>Trip Checklist</Text>
              </Space>
            }
            style={{ borderRadius: 12 }}
            styles={{ body: { paddingTop: 16 } }} // updated from bodyStyle
            extra={
              <Space>
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={resetToDefaults}
                >
                  Reset
                </Button>
              </Space>
            }
          >
            {/* Country selector */}
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <div>
                <Text type="secondary">Destination country</Text>
                <Select
                  allowClear
                  placeholder="Select a country"
                  value={country || undefined}
                  onChange={(v) => setCountry(v || "")}
                  style={{ width: "100%", marginTop: 6 }}
                  options={Object.keys(COUNTRY_DEFAULTS).map((c) => ({
                    label: c,
                    value: c,
                  }))}
                />
              </div>

              {/* Progress */}
              <div>
                <Space
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Text>Progress</Text>
                  <Text type="secondary">
                    {completed}/{items.length}
                  </Text>
                </Space>
                <Progress percent={percent} size="small" />
              </div>

              {/* Add custom item */}
              <Input.Group compact>
                <Input
                  placeholder="Add your own item (e.g., 'Refill prescriptions')"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onPressEnter={addItem}
                  style={{ width: "calc(100% - 96px)" }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addItem}
                  style={{ width: 96 }}
                >
                  Add
                </Button>
              </Input.Group>

              <Divider style={{ margin: "12px 0" }} />

              {/* Checklist items */}
              <div>
                {items.length === 0 ? (
                  <Empty description="No checklist items" />
                ) : (
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={10}
                  >
                    {items.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 8px",
                          borderRadius: 8,
                          background: it.done ? "#f6ffed" : "#fff",
                          border: it.done
                            ? "1px solid #b7eb8f"
                            : "1px solid #f0f0f0",
                        }}
                      >
                        <Checkbox
                          checked={it.done}
                          onChange={() => toggleItem(it.id)}
                        >
                          {it.label}
                        </Checkbox>
                        <Popconfirm
                          title="Remove this item?"
                          okText="Remove"
                          cancelText="Cancel"
                          onConfirm={() => deleteItem(it.id)}
                        >
                          <Button
                            size="small"
                            type="text"
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </div>
                    ))}
                  </Space>
                )}
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default TravelCalendarChecklist;
