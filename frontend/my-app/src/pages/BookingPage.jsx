import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Tabs,
  message,
  Progress,
  Row,
  Col,
  Button,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../styles/BookingPage.css";

/* 🔹 Booking Forms */
import StaySearchForm from "../components/booking/StaySearchForm";
import FlightSearchForm from "../components/booking/FlightSearchForm";
import PackageFilterForm from "../components/booking/PackageFilterForm";

/* 🔹 Booking Results */
import HotelListings from "../components/booking/HotelListings";
import PackageListings from "../components/booking/PackageListings";
import FlightListings from "../components/booking/FlightListings";
import CarListings from "../components/booking/CarListings";
import CruiseListings from "../components/booking/CruiseListings";
import SavedTrips from "../components/booking/SavedTrips";

/* 🔹 Data */
import mockListings from "../data/mockListings";

/* 🔹 Styles */
import "../styles/booking.css";

const { Title, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const filterByType = (type) => mockListings.filter((i) => i.type === type);

const badgeMap = {
  2: "Explorer",
  3: "Wanderer",
  4: "Jet Setter",
  5: "Globetrotter",
};

const perks = [
  { level: 3, label: "🆓 Free Cancellations" },
  { level: 5, label: "🚀 Priority Support" },
  { level: 7, label: "💸 10% Off All Trips" },
];

const BookingPage = () => {
  const navigate = useNavigate();

  // ✅ Back/Home handler with safe fallback
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  // Search + XP state
  const [searchQuery, setSearchQuery] = useState("");
  const [dates, setDates] = useState(null);
  const [guests, setGuests] = useState(1);
  const [, contextHolder] = message.useMessage();

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);

  // Load XP/level on mount
  useEffect(() => {
    const storedXp = localStorage.getItem("xp");
    const storedLevel = localStorage.getItem("level");
    const storedBadges = JSON.parse(localStorage.getItem("badges") || "[]");
    if (storedXp) setXp(parseInt(storedXp, 10));
    if (storedLevel) setLevel(parseInt(storedLevel, 10));
    setBadges(storedBadges);
  }, []);

  // Persist XP/level/badges
  useEffect(() => {
    localStorage.setItem("xp", String(xp));
    localStorage.setItem("level", String(level));
    localStorage.setItem("badges", JSON.stringify(badges));
  }, [xp, level, badges]);

  const getXpByType = (t) =>
    ({ flight: 30, hotel: 20, package: 40, cruise: 50, car: 15 }[t] ?? 10);

  const toast = (text, type = "info") =>
    message.open({ type, content: text, duration: 2 });

  const unlockBadge = (newLevel) => {
    const badge = badgeMap[newLevel];
    if (badge && !badges.includes(badge)) {
      setBadges((prev) => [...prev, badge]);
      toast(`🏅 New Badge Unlocked: ${badge}`, "success");
    }
  };

  const handleBook = (listing) => {
    const saved = JSON.parse(localStorage.getItem("savedBookings") || "[]");
    localStorage.setItem("savedBookings", JSON.stringify([...saved, listing]));

    const gained = getXpByType(listing.type);
    setXp((prev) => {
      const next = prev + gained;
      if (next >= 100) {
        setLevel((lv) => {
          const nl = lv + 1;
          unlockBadge(nl);
          return nl;
        });
        toast("🎉 You leveled up!", "success");
        return next - 100;
      }
      toast(`+${gained} XP for booking a ${listing.type}`, "info");
      return next;
    });
  };

  const unlockedPerks = perks.filter((p) => p.level <= level);

  return (
    <Layout className="section" style={{ minHeight: "100vh" }}>
      {/* 🔒 Fixed, always-visible Home button */}
      <div className="booking-topbar">
        <Button
          size="large"
          icon={<LeftOutlined />}
          onClick={handleBack}
          className="back-home-btn shadow-soft"
          aria-label="Back to Home"
          type="primary"
        >
          Home
        </Button>
      </div>

      <Content>
        <div className="booking-wrapper shadow-soft rounded border">
          {/* Header (centered title, XP) */}
          <Row align="middle" justify="center" className="header-row">
            <Col span={24} style={{ textAlign: "center" }}>
              <Title level={2} className="booking-title">
                Book Your Next Adventure
              </Title>
              <div className="xp-wrap">
                <Text strong>
                  Level {level} – XP: {xp}/100
                </Text>
                <Progress
                  percent={(xp / 100) * 100}
                  showInfo={false}
                  /* Let token.colorSuccess style the progress bar */
                />
              </div>
            </Col>
          </Row>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="badges-wrap">
              <Title level={4}>Unlocked Badges</Title>
              <Row gutter={[12, 12]}>
                {badges.map((b, i) => (
                  <Col key={i}>
                    <div className="badge-chip">🏅 {b}</div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Perks */}
          {unlockedPerks.length > 0 && (
            <div className="perks-wrap">
              <Title level={4}>Unlocked Perks</Title>
              {unlockedPerks.map((p, i) => (
                <Text key={i} className="perk-line">
                  {p.label}
                </Text>
              ))}
            </div>
          )}

          {/* Booking Tabs */}
          <Tabs defaultActiveKey="1" className="booking-tabs">
            <TabPane tab="🏨 Hotels" key="1">
              <StaySearchForm
                query={searchQuery}
                setQuery={setSearchQuery}
                dates={dates}
                setDates={setDates}
                guests={guests}
                setGuests={setGuests}
                onSearch={() => toast("Search complete!", "success")}
              />
              <HotelListings
                listings={filterByType("hotel")}
                onBook={handleBook}
              />
            </TabPane>

            <TabPane tab="✈️ Flights" key="2">
              <FlightSearchForm />
              <FlightListings
                listings={filterByType("flight")}
                onBook={handleBook}
              />
            </TabPane>

            <TabPane tab="🎁 Packages" key="3">
              <PackageFilterForm />
              <PackageListings
                listings={filterByType("package")}
                onBook={handleBook}
              />
            </TabPane>

            <TabPane tab="🚗 Cars" key="4">
              <CarListings listings={filterByType("car")} onBook={handleBook} />
            </TabPane>

            <TabPane tab="🛳️ Cruises" key="5">
              <CruiseListings
                listings={filterByType("cruise")}
                onBook={handleBook}
              />
            </TabPane>

            <TabPane tab="📌 Saved Trips" key="6">
              <SavedTrips />
            </TabPane>
          </Tabs>
        </div>

        {contextHolder}
      </Content>
    </Layout>
  );
};

export default BookingPage;
