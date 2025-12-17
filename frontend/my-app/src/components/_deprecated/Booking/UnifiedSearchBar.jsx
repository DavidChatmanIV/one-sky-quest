import React, { useMemo, useState, useEffect } from "react";
import {
  Tabs,
  Input,
  DatePicker,
  Select,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Tooltip,
  Tag,
  Switch,
} from "antd";
import {
  SearchOutlined,
  InfoCircleOutlined,
  CompassOutlined,
  HomeOutlined,
  CarOutlined,
  GlobalOutlined, // cruises icon (works in @ant-design/icons)
  CoffeeOutlined,
  SendOutlined,
  GiftOutlined, // packages icon
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Text } = Typography;

function RowControls({
  placeholder = "Where to?",
  extraRight = null,
  onSearch,
  size = "large",
}) {
  // lightweight object; we don't need re-render while typing
  const [form] = React.useState({
    destination: "",
    dates: null,
    guests: 2,
    rooms: 1,
  });
  const set = (k, v) => (form[k] = v);

  const handleSearch = () =>
    onSearch?.({
      destination: form.destination,
      dates: form.dates,
      guests: form.guests,
      rooms: form.rooms,
    });

  return (
    <Row gutter={[8, 8]} align="middle" wrap>
      <Col xs={24} flex="1 1 auto">
        <Input
          size={size}
          allowClear
          prefix={<CompassOutlined />}
          placeholder={placeholder}
          onChange={(e) => set("destination", e.target.value)}
          onPressEnter={handleSearch}
        />
      </Col>

      <Col xs={24} sm={12}>
        <RangePicker
          size={size}
          style={{ width: "100%" }}
          onChange={(vals) => set("dates", vals)}
        />
      </Col>

      <Col xs={12} sm={6}>
        <Select
          size={size}
          defaultValue={2}
          style={{ width: "100%" }}
          onChange={(v) => set("guests", v)}
          options={[1, 2, 3, 4, 5, 6].map((n) => ({
            label: `${n} guest${n > 1 ? "s" : ""}`,
            value: n,
          }))}
          popupClassName="osq-dark-dropdown"
        />
      </Col>

      <Col xs={12} sm={6}>
        <Select
          size={size}
          defaultValue={1}
          style={{ width: "100%" }}
          onChange={(v) => set("rooms", v)}
          options={[1, 2, 3, 4].map((n) => ({
            label: `${n} room${n > 1 ? "s" : ""}`,
            value: n,
          }))}
          popupClassName="osq-dark-dropdown"
        />
      </Col>

      {extraRight && <Col xs={24}>{extraRight}</Col>}

      <Col xs={24}>
        <Button
          size={size}
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Col>
    </Row>
  );
}

export default function UnifiedSearchBar({ activeKey, onChangeTab, onSearch }) {
  // controlled/uncontrolled support
  const [innerKey, setInnerKey] = useState(activeKey ?? "stays");
  useEffect(() => {
    if (activeKey !== undefined) setInnerKey(activeKey);
  }, [activeKey]);

  // Smart Plan AI
  const [smartOn, setSmartOn] = useState(true);
  const suggestions = [
    { label: "Beach Weekend", value: "beach" },
    { label: "Adventure Escape", value: "adventure" },
    { label: "City Vibes", value: "city" },
    { label: "Events Nearby", value: "nearby" },
    { label: "Romantic Getaway", value: "romantic" },
  ];
  const handleChip = (s) => {
    const map = {
      beach: "Playa Del Carmen",
      adventure: "Bali",
      city: "Lisbon",
      nearby: "Weekend",
      romantic: "Santorini",
    };
    onSearch?.({ type: innerKey, destination: map[s] ?? s });
  };

  const tabs = useMemo(
    () => [
      {
        key: "stays",
        label: (
          <span>
            <HomeOutlined /> Stays
          </span>
        ),
        children: (
          <RowControls
            placeholder="Where to? (city, landmark, region)"
            onSearch={(payload) => onSearch?.({ type: "stays", ...payload })}
          />
        ),
      },
      {
        key: "flights",
        label: (
          <span>
            <SendOutlined /> Flights
          </span>
        ),
        children: (
          <RowControls
            placeholder="From / To (e.g., EWR → LIS)"
            onSearch={(payload) => onSearch?.({ type: "flights", ...payload })}
            extraRight={
              <Select
                size="large"
                defaultValue="economy"
                options={[
                  { value: "economy", label: "Economy" },
                  { value: "premium", label: "Premium" },
                  { value: "business", label: "Business" },
                ]}
                style={{ minWidth: 140 }}
                popupClassName="osq-dark-dropdown"
              />
            }
          />
        ),
      },
      {
        key: "cars",
        label: (
          <span>
            <CarOutlined /> Cars
          </span>
        ),
        children: (
          <RowControls
            placeholder="Pickup location (airport or city)"
            onSearch={(payload) => onSearch?.({ type: "cars", ...payload })}
            extraRight={
              <Select
                size="large"
                defaultValue="compact"
                options={[
                  { value: "compact", label: "Compact" },
                  { value: "suv", label: "SUV" },
                  { value: "luxury", label: "Luxury" },
                ]}
                style={{ minWidth: 140 }}
                popupClassName="osq-dark-dropdown"
              />
            }
          />
        ),
      },
      {
        key: "cruises",
        label: (
          <span>
            <GlobalOutlined /> Cruises
          </span>
        ),
        children: (
          <RowControls
            placeholder="Departure port or region"
            onSearch={(payload) => onSearch?.({ type: "cruises", ...payload })}
          />
        ),
      },
      {
        key: "excursions",
        label: (
          <span>
            <CoffeeOutlined /> Excursions
          </span>
        ),
        children: (
          <RowControls
            placeholder="City or attraction (e.g., food tour, museum)"
            onSearch={(payload) =>
              onSearch?.({ type: "excursions", ...payload })
            }
          />
        ),
      },
      {
        key: "packages",
        label: (
          <span>
            <GiftOutlined /> Packages
          </span>
        ),
        children: (
          <RowControls
            placeholder="Destination (bundle flights + hotel)"
            onSearch={(payload) => onSearch?.({ type: "packages", ...payload })}
            extraRight={
              <Select
                size="large"
                defaultValue="fh"
                options={[
                  { value: "fh", label: "Flight + Hotel" },
                  { value: "hc", label: "Hotel + Car" },
                  { value: "fhc", label: "Flight + Hotel + Car" },
                ]}
                style={{ minWidth: 200 }}
                popupClassName="osq-dark-dropdown"
              />
            }
          />
        ),
      },
    ],
    [onSearch]
  );

  const handleChange = (k) => {
    onChangeTab?.(k);
    if (activeKey === undefined) setInnerKey(k);
  };

  return (
    <div className="unified-search">
      <div className="us-header">
        <Space size={8} align="center">
          <Text type="secondary">Smart Plan AI</Text>
          <Switch size="small" checked={smartOn} onChange={setSmartOn} />
          <Tooltip title="Let OSQ suggest routes & budget-friendly picks based on your profile.">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      </div>

      <Tabs
        className="unified-tabs"
        items={tabs}
        activeKey={innerKey}
        onChange={handleChange}
        animated
        tabBarGutter={8}
      />

      {smartOn && (
        <Space size={[8, 8]} wrap className="us-smart-row">
          {suggestions.map((s) => (
            <Tag
              key={s.value}
              className="pkg-chip"
              onClick={() => handleChip(s.value)}
              style={{ cursor: "pointer" }}
            >
              {s.label}
            </Tag>
          ))}
        </Space>
      )}
    </div>
  );
}
