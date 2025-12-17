import React, { useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Rate,
  Space,
  Select,
  Divider,
  Tooltip,
} from "antd";
import {
  RocketOutlined,
  HomeOutlined,
  CarOutlined,
  GiftOutlined,
  StarOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

/** ---- Mock catalogs (replace with live API later) ---- */
// prices are per traveler except where noted
const FLIGHTS = [
  { from: "EWR", to: "MIA", airline: "United", price: 240, nonstop: true },
  { from: "EWR", to: "MIA", airline: "JetBlue", price: 210, nonstop: false },
  { from: "EWR", to: "LAS", airline: "United", price: 310, nonstop: true },
];

const HOTELS = [
  { city: "MIA", name: "Seabreeze Resort", rating: 4.5, pricePerNight: 180 },
  { city: "MIA", name: "Downtown Loft Hotel", rating: 4.2, pricePerNight: 150 },
  { city: "LAS", name: "Stripline Suites", rating: 4.6, pricePerNight: 220 },
];

const CARS = [
  { city: "MIA", vendor: "Hertz", class: "Compact", pricePerDay: 45 },
  { city: "MIA", vendor: "Avis", class: "SUV", pricePerDay: 70 },
  { city: "LAS", vendor: "Budget", class: "Compact", pricePerDay: 40 },
];

/** Combine flight/hotel/car into bundle offers and compute savings. */
function buildPackages(criteria) {
  const {
    bundleType = "flight_hotel",
    origin = "EWR",
    destination = "MIA",
    travelers = 2,
    rooms = 1,
    dates,
  } = criteria || {};

  // fallback: assume 4 nights, 4 car-days if no dates chosen (demo)
  const nights =
    dates?.[0] && dates?.[1]
      ? Math.max(
          1,
          Math.round(
            (dates[1].endOf("day") - dates[0].startOf("day")) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 4;
  const days = nights;

  const flightChoices = FLIGHTS.filter(
    (f) => f.from === origin && f.to === destination
  );
  const hotelChoices = HOTELS.filter((h) => h.city === destination);
  const carChoices = CARS.filter((c) => c.city === destination);

  const results = [];

  flightChoices.forEach((f) => {
    hotelChoices.forEach((h) => {
      // separate pricing
      const separate = f.price * travelers + h.pricePerNight * nights * rooms;

      // base bundle discount (varies a bit by airline/hotel)
      const baseDiscount = f.nonstop ? 0.12 : 0.08; // 12% vs 8%
      let bundlePrice = Math.round(separate * (1 - baseDiscount));

      let includes = ["Round-trip flights", `${nights}-night stay`];

      if (bundleType === "flight_hotel_car") {
        carChoices.forEach((c) => {
          const separateWithCar = separate + c.pricePerDay * days;
          const carDiscount = 0.15; // more savings when adding car
          const price = Math.round(
            separateWithCar * (1 - (baseDiscount + carDiscount))
          );
          results.push({
            id: `${f.airline}-${h.name}-${c.vendor}`,
            title: `${destination} Getaway — ${h.name}`,
            hotelRating: h.rating,
            price,
            crossed: Math.round(separateWithCar),
            savings: Math.round(separateWithCar - price),
            flight: f,
            hotel: h,
            car: c,
            includes: [...includes, `${days}-day ${c.class} car`],
            perks: ["Free Wi-Fi", "Flexible cancellation"],
          });
        });
        return;
      }

      if (bundleType === "hotel_car") {
        carChoices.forEach((c) => {
          const hotelCarSeparate =
            h.pricePerNight * nights * rooms + c.pricePerDay * days;
          const price = Math.round(hotelCarSeparate * 0.88); // 12% off
          results.push({
            id: `${h.name}-${c.vendor}`,
            title: `${destination} Drive-n-Stay — ${h.name}`,
            hotelRating: h.rating,
            price,
            crossed: Math.round(hotelCarSeparate),
            savings: Math.round(hotelCarSeparate - price),
            flight: null,
            hotel: h,
            car: c,
            includes: [`${nights}-night stay`, `${days}-day ${c.class} car`],
            perks: ["Late checkout on request"],
          });
        });
        return;
      }

      // flight + hotel
      results.push({
        id: `${f.airline}-${h.name}`,
        title: `${destination} City Break — ${h.name}`,
        hotelRating: h.rating,
        price: bundlePrice,
        crossed: Math.round(separate),
        savings: Math.round(separate - bundlePrice),
        flight: f,
        hotel: h,
        car: null,
        includes,
        perks: ["Breakfast credit", "Reward XP boost"],
      });
    });
  });

  if (!results.length) {
    return [
      {
        id: "default-miami",
        title: "Miami Intro Bundle — Seabreeze Resort",
        hotelRating: 4.5,
        price: 999,
        crossed: 1180,
        savings: 181,
        flight: { airline: "Any", price: 0, nonstop: true },
        hotel: { name: "Seabreeze Resort" },
        car: null,
        includes: ["Round-trip flights", "4-night stay"],
        perks: ["Free Wi-Fi"],
      },
    ];
  }

  return results;
}

export default function PackageDeals({ criteria }) {
  const [sort, setSort] = useState("price_asc");

  const data = useMemo(() => {
    const list = buildPackages(criteria);
    const sorted = [...list];
    switch (sort) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "savings_desc":
        sorted.sort((a, b) => b.savings - a.savings);
        break;
      case "rating_desc":
        sorted.sort((a, b) => (b.hotelRating || 0) - (a.hotelRating || 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [criteria, sort]);

  const book = (pkg) => {
    toast.success(`Package reserved: ${pkg.title}`, { id: "pkg" });
  };

  const save = (pkg) => {
    const key = "osq_saved_trips";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(
      key,
      JSON.stringify([{ type: "package", ...pkg }, ...prev].slice(0, 50))
    );
    toast.success("Saved to your trips");
  };

  return (
    <Card
      bordered={false}
      className="osq-search-card"
      style={{ background: "var(--surface, #141628)" }}
      bodyStyle={{ padding: 16 }}
    >
      <Row align="middle" style={{ marginBottom: 8 }}>
        {/* ---- header area (fixed colors for dark mode) ---- */}
        <Col flex="auto">
          <Title level={4} style={{ color: "var(--text, #f4f6fb)", margin: 0 }}>
            Package Deals
          </Title>
          <Text style={{ color: "var(--muted, #c9cbe3)" }}>
            Showing smart bundles for your selections
          </Text>
        </Col>

        <Col>
          <Space>
            <Text style={{ color: "var(--muted, #c9cbe3)" }}>Sort</Text>
            <Select
              value={sort}
              onChange={setSort}
              options={[
                { value: "price_asc", label: "Price (low → high)" },
                { value: "price_desc", label: "Price (high → low)" },
                { value: "savings_desc", label: "Biggest savings" },
                { value: "rating_desc", label: "Hotel rating" },
              ]}
              style={{ width: 190 }}
            />
          </Space>
        </Col>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      <Row gutter={[12, 12]}>
        {data.map((pkg) => (
          <Col xs={24} md={12} lg={8} key={pkg.id}>
            <Card
              hoverable
              style={{
                background: "var(--surface-2, #1b1e31)",
                borderRadius: 16,
                height: "100%",
              }}
              bodyStyle={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Space size={8} wrap>
                <Tag color="gold" icon={<GiftOutlined />}>
                  Save ${pkg.savings}
                </Tag>
                {pkg.hotelRating ? (
                  <Tag icon={<StarOutlined />}>
                    {pkg.hotelRating.toFixed(1)}★
                  </Tag>
                ) : null}
                <Tag icon={<ThunderboltOutlined />}>XP +200</Tag>
              </Space>

              <Title
                level={5}
                style={{ marginTop: 8, color: "var(--text, #fff)" }}
              >
                {pkg.title}
              </Title>

              <div style={{ color: "var(--muted, #c9cbe3)" }}>
                <ul style={{ margin: "6px 0 0 18px" }}>
                  {pkg.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              {pkg.hotelRating ? (
                <div style={{ marginTop: 8 }}>
                  <Rate disabled defaultValue={Math.round(pkg.hotelRating)} />
                </div>
              ) : null}

              <div style={{ marginTop: "auto" }}>
                <Space size={10} align="baseline">
                  <Title
                    level={3}
                    style={{ color: "var(--text, #fff)", margin: 0 }}
                  >
                    ${pkg.price}
                  </Title>
                  <Text delete type="secondary">
                    ${pkg.crossed}
                  </Text>
                </Space>

                <Space style={{ marginTop: 10 }}>
                  <Tooltip title="Save to Saved Trips">
                    <Button icon={<SaveOutlined />} onClick={() => save(pkg)}>
                      Save
                    </Button>
                  </Tooltip>
                  <Button
                    type="primary"
                    onClick={() => book(pkg)}
                    icon={<DollarOutlined />}
                  >
                    Book Package
                  </Button>
                </Space>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <Space wrap size={6} style={{ color: "var(--muted, #c9cbe3)" }}>
                {pkg.flight && (
                  <Tag>
                    <RocketOutlined /> {pkg.flight.airline}
                    {pkg.flight.nonstop ? " • Nonstop" : " • 1+ stops"}
                  </Tag>
                )}
                {pkg.hotel && (
                  <Tag>
                    <HomeOutlined /> {pkg.hotel.name}
                  </Tag>
                )}
                {pkg.car && (
                  <Tag>
                    <CarOutlined /> {pkg.car.vendor} {pkg.car.class}
                  </Tag>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
