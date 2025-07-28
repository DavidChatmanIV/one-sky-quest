import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Tabs,
  DatePicker,
  message,
  Progress,
  Row,
  Col,
} from "antd";

// 🔹 Booking Forms
import StaySearchForm from "../components/booking/StaySearchForm";
import FlightSearchForm from "../components/booking/FlightSearchForm";
import PackageFilterForm from "../components/booking/PackageFilterForm";

// 🔹 Booking Results
import HotelListings from "../components/booking/HotelListings";
import PackageListings from "../components/booking/PackageListings";
import FlightListings from "../components/booking/FlightListings";
import CarListings from "../components/booking/CarListings";
import CruiseListings from "../components/booking/CruiseListings";
import SavedTrips from "../components/booking/SavedTrips";

// 🔹 Data
import mockListings from "../data/mockListings";

const { Title, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const filterByType = (type) =>
  mockListings.filter((item) => item.type === type);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [dates, setDates] = useState(null);
  const [guests, setGuests] = useState(1);
  const [, contextHolder] = message.useMessage(); // ✅ toast not needed

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);

  // 🔹 Load XP & level from localStorage on mount
  useEffect(() => {
    const storedXp = localStorage.getItem("xp");
    const storedLevel = localStorage.getItem("level");
    const storedBadges = JSON.parse(localStorage.getItem("badges")) || [];

    if (storedXp) setXp(parseInt(storedXp));
    if (storedLevel) setLevel(parseInt(storedLevel));
    setBadges(storedBadges);
  }, []);

  // 🔹 Save XP & level on change
  useEffect(() => {
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("badges", JSON.stringify(badges));
  }, [xp, level, badges]);

  const getXpByType = (type) => {
    switch (type) {
      case "flight":
        return 30;
      case "hotel":
        return 20;
      case "package":
        return 40;
      case "cruise":
        return 50;
      case "car":
        return 15;
      default:
        return 10;
    }
  };

  const showXpToast = (text, type = "info") => {
    message.open({
      type,
      content: text,
      duration: 2,
      style: {
        fontSize: "16px",
        animation: "slide-in 0.3s ease",
      },
    });
  };

  const unlockBadge = (newLevel) => {
    const badge = badgeMap[newLevel];
    if (badge && !badges.includes(badge)) {
      setBadges((prev) => [...prev, badge]);
      showXpToast(`🏅 New Badge Unlocked: ${badge}`, "success");
    }
  };

  const handleBook = (listing) => {
    const saved = JSON.parse(localStorage.getItem("savedBookings")) || [];
    saved.push(listing);
    localStorage.setItem("savedBookings", JSON.stringify(saved));

    const xpGained = getXpByType(listing.type);
    setXp((prevXp) => {
      const newXp = prevXp + xpGained;
      if (newXp >= 100) {
        setLevel((prev) => prev + 1);
        unlockBadge(level + 1);
        showXpToast("🎉 You leveled up!", "success");
        return newXp - 100;
      }
      showXpToast(`+${xpGained} XP for booking a ${listing.type}`, "info");
      return newXp;
    });
  };

  const unlockedPerks = perks.filter((p) => p.level <= level);

  return (
    <Layout>
      <Content style={{ padding: "24px", maxWidth: 1200, margin: "auto" }}>
        <Title level={2}>Book Your Next Adventure</Title>
        {contextHolder}

        {/* XP + Level Display */}
        <div style={{ marginTop: 16 }}>
          <Text strong>
            Level {level} – XP: {xp}/100
          </Text>
          <Progress
            percent={(xp / 100) * 100}
            showInfo={false}
            strokeColor="#52c41a"
            style={{ maxWidth: 300, marginTop: 8 }}
          />
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>Unlocked Badges</Title>
            <Row gutter={[12, 12]}>
              {badges.map((badge, idx) => (
                <Col key={idx}>
                  <div
                    style={{
                      padding: "8px 16px",
                      background: "#f0f2f5",
                      borderRadius: "12px",
                      fontWeight: 500,
                    }}
                  >
                    🏅 {badge}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Perks */}
        {unlockedPerks.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>Unlocked Perks</Title>
            {unlockedPerks.map((p, i) => (
              <Text key={i} style={{ display: "block" }}>
                {p.label}
              </Text>
            ))}
          </div>
        )}

        {/* Booking Tabs */}
        <Tabs defaultActiveKey="1" style={{ marginTop: 32 }}>
          <TabPane tab="🏨 Hotels" key="1">
            <StaySearchForm
              query={searchQuery}
              setQuery={setSearchQuery}
              dates={dates}
              setDates={setDates}
              guests={guests}
              setGuests={setGuests}
              onSearch={() => showXpToast("Search complete!", "success")}
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
      </Content>
    </Layout>
  );
};

export default BookingPage;
