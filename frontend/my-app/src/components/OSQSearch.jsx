import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Tabs,
  AutoComplete,
  DatePicker,
  Button,
  Switch,
  Popover,
  Space,
  Divider,
  Tag,
  Typography,
  Input,
} from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  CarOutlined,
  GiftOutlined,
  CompassOutlined, // NEW: for Excursions
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import PlaneDepartureOutlined from "../icons/PlaneDepartureOutlined"; // custom icon

const { RangePicker } = DatePicker;
const { Text } = Typography;

/* Mock Places API (replace with real service later) */
const PLACES = [
  { label: "Paris, France (PAR)", value: "Paris, France" },
  { label: "Tokyo, Japan (TYO)", value: "Tokyo, Japan" },
  { label: "Lisbon, Portugal (LIS)", value: "Lisbon, Portugal" },
  { label: "Bali, Indonesia (DPS)", value: "Bali, Indonesia" },
  { label: "Miami, Florida (MIA)", value: "Miami, Florida" },
  { label: "Los Angeles, California (LAX)", value: "Los Angeles, California" },
  { label: "Newark, New Jersey (EWR)", value: "Newark, New Jersey" },
  { label: "Playa del Carmen, Mexico", value: "Playa del Carmen, Mexico" },
  { label: "London, United Kingdom (LON)", value: "London, United Kingdom" },
  { label: "Toronto, Canada (YYZ)", value: "Toronto, Canada" },
];

// fake async search with latency
function fetchPlaces(q) {
  return new Promise((res) => {
    const n = q.trim().toLowerCase();
    const out = !n
      ? PLACES.slice(0, 6)
      : PLACES.filter((p) => p.label.toLowerCase().includes(n)).slice(0, 8);
    setTimeout(() => res(out), 180);
  });
}

const QuickPick = ({ label, onClick }) => (
  <Tag className="osq-quickpick" onClick={onClick}>
    {label}
  </Tag>
);

export default function OSQSearch({ onSearch }) {
  const navigate = useNavigate();

  const [tab, setTab] = useState("stays");
  const [where, setWhere] = useState("");
  const [whereOpts, setWhereOpts] = useState([]);
  const [leavingFrom, setLeavingFrom] = useState(""); // flights
  const [dates, setDates] = useState(null);
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [smart, setSmart] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const fieldsForTab = useMemo(() => {
    return {
      placeholder: {
        stays: "Where to? (city, landmark, or address)",
        flights: "Where to? (airport or city)",
        cars: "Pick-up location",
        packages: "Where to? (bundle stays + flights)",
        excursions: "Destination or activity", // RENAMED
      }[tab],
      showLeavingFrom: tab === "flights",
    };
  }, [tab]);

  // typeahead debounce
  const debounceRef = useRef();
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoadingPlaces(true);
      const data = await fetchPlaces(where);
      setWhereOpts(data);
      setLoadingPlaces(false);
    }, 180);
    return () => clearTimeout(debounceRef.current);
  }, [where]);

  // travelers popover
  const travelerContent = (
    <div className="osq-travelers-pop">
      <div className="row">
        <span>Adults</span>
        <Space>
          <Button onClick={() => setAdults(Math.max(1, adults - 1))}>−</Button>
          <span className="count">{adults}</span>
          <Button onClick={() => setAdults(adults + 1)}>+</Button>
        </Space>
      </div>
      <div className="row">
        <span>{tab === "stays" ? "Rooms" : "Seats/Groups"}</span>
        <Space>
          <Button onClick={() => setRooms(Math.max(1, rooms - 1))}>−</Button>
          <span className="count">{rooms}</span>
          <Button onClick={() => setRooms(rooms + 1)}>+</Button>
        </Space>
      </div>
      <Divider style={{ margin: "8px 0" }} />
      <div className="hint">Tip: Booking today earns extra XP ✨</div>
    </div>
  );

  const submit = () => {
    const payload = {
      tab,
      where,
      leavingFrom: fieldsForTab.showLeavingFrom ? leavingFrom : undefined,
      start: dates?.[0]?.format?.("YYYY-MM-DD"),
      end: dates?.[1]?.format?.("YYYY-MM-DD"),
      adults,
      rooms,
      smart,
    };
    onSearch?.(payload);
    const qs = new URLSearchParams(
      Object.entries(payload).filter(([, v]) => v != null && v !== "")
    );
    navigate(`/search/${tab}?${qs.toString()}`); // now supports /search/excursions
  };

  const applyQuickPick = (q) => {
    setWhere(q.replace(/^[^ ]+ /, "")); // strip emoji
    setDates([dayjs().add(14, "day"), dayjs().add(17, "day")]); // long weekend
  };

  const rowClass =
    "osq-search-row hero-search " +
    (fieldsForTab.showLeavingFrom ? "is-5cols" : "is-4cols");

  return (
    <div className="osq-search-card osq-card">
      <Tabs
        activeKey={tab}
        onChange={setTab}
        size="large"
        items={[
          {
            key: "stays",
            label: (
              <span>
                <HomeOutlined /> Stays
              </span>
            ),
          },
          {
            key: "flights",
            label: (
              <span>
                <PlaneDepartureOutlined /> Flights
              </span>
            ),
          },
          {
            key: "cars",
            label: (
              <span>
                <CarOutlined /> Cars
              </span>
            ),
          },
          {
            key: "packages",
            label: (
              <span>
                <GiftOutlined /> Packages
              </span>
            ),
          },
          {
            key: "excursions", // RENAMED
            label: (
              <span>
                <CompassOutlined /> Excursions
              </span>
            ),
          },
        ]}
        className="osq-search-tabs"
      />

      <div className={rowClass}>
        {/* WHERE with typeahead */}
        <AutoComplete
          aria-label="Destination"
          value={where}
          onChange={setWhere}
          options={whereOpts}
          notFoundContent={loadingPlaces ? "Searching..." : "No matches"}
          filterOption={false}
        >
          <Input
            size="large"
            className="osq-where"
            prefix={<EnvironmentOutlined />}
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder={fieldsForTab.placeholder}
          />
        </AutoComplete>

        {/* DATES */}
        <RangePicker
          aria-label="Dates"
          size="large"
          className="osq-date"
          onChange={setDates}
          allowClear
          disabledDate={(cur) => cur && cur < dayjs().startOf("day")}
          presets={[
            { label: "This weekend", value: [dayjs().day(5), dayjs().day(7)] },
            {
              label: "Next week",
              value: [
                dayjs().add(1, "week").startOf("week"),
                dayjs().add(1, "week").endOf("week"),
              ],
            },
          ]}
        />

        {/* LEAVING FROM (flights only) */}
        {fieldsForTab.showLeavingFrom && (
          <AutoComplete
            aria-label="Departure airport or city"
            value={leavingFrom}
            onChange={setLeavingFrom}
            options={whereOpts}
            filterOption={false}
          >
            <Input
              size="large"
              className="osq-where"
              prefix={<PlaneDepartureOutlined />}
              value={leavingFrom}
              onChange={(e) => setLeavingFrom(e.target.value)}
              placeholder="Leaving from"
            />
          </AutoComplete>
        )}

        {/* TRAVELERS */}
        <Popover trigger="click" content={travelerContent} placement="bottom">
          <Button
            size="large"
            className="osq-travelers-btn"
            icon={<TeamOutlined />}
          >
            {adults} {adults === 1 ? "adult" : "adults"} · {rooms}{" "}
            {rooms === 1
              ? tab === "stays"
                ? "room"
                : "group"
              : tab === "stays"
              ? "rooms"
              : "groups"}
          </Button>
        </Popover>

        {/* SEARCH */}
        <Button
          size="large"
          type="primary"
          icon={<SearchOutlined />}
          onClick={submit}
          className="osq-search-btn"
        >
          Search • Earn +50 XP
        </Button>
      </div>

      {/* SECOND ROW: ONLY Smart Plan + Quick Picks */}
      <div className="osq-search-options">
        <Space wrap>
          <span className="ai-toggle">
            ⚡ Smart Plan AI <Switch checked={smart} onChange={setSmart} />
          </span>
        </Space>

        <Space wrap className="osq-quickpicks">
          {[
            "🌴 Beach Weekend",
            "🏔 Adventure Escape",
            "🏙 City Vibes",
            "🎟️ Events Nearby",
          ].map((q) => (
            <QuickPick key={q} label={q} onClick={() => applyQuickPick(q)} />
          ))}
        </Space>
      </div>
    </div>
  );
}
