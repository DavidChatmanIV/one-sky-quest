import React, { useState } from "react";
import { Typography, Tabs, Row, Col, Divider, Space, FloatButton } from "antd";
import {
  HomeOutlined,
  CarOutlined,
  ExperimentOutlined,
  HeartOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import BookingForm from "../components/Booking/BookingForm";
import FlightSearchForm from "../components/Booking/FlightSearchForm";
import StaySearchForm from "../components/Booking/StaySearchForm";
import CruiseSearchForm from "../components/Booking/CruiseSearchForm";
import CarSearchForm from "../components/Booking/CarSearchForm";
import SavedTrips from "../components/Booking/SavedTrips";
import ListingsSection from "../components/Booking/ListingsSection";
import TripPerks from "../components/Booking/TripPerks";
import BookingBadges from "../components/Booking/BookingBadges";
import BookingXPBar from "../components/Booking/BookingXPBar";
import MultiRoomBooking from "../components/Booking/MultiRoomBooking";
import toast from "react-hot-toast";
import "../styles/BookingPage.css";

const { Title, Paragraph } = Typography;

const BookingPage = () => {
  const [selectedTab, setSelectedTab] = useState("hotels");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [guests, setGuests] = useState(1);

  const unlockBadge = (level) => {
    if (level === 2)
      toast("🏅 You earned the 'Rookie Planner' badge!", {
        icon: "🥇",
      });
    if (level === 3)
      toast("🏅 You earned the 'Group Travel Hero' badge!", {
        icon: "🏆",
      });
  };

  const handleSearch = () => {
    toast.success("🚀 Search submitted!");
    const earned = 10;
    setXp((prev) => {
      const next = prev + earned;
      if (next >= 100) {
        setLevel((lv) => {
          const nl = lv + 1;
          unlockBadge(nl);
          return nl;
        });
        toast.success("🎉 You leveled up!");
        return next - 100;
      }
      toast(`+${earned} XP for booking`, { icon: "✨" });
      return next;
    });
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <Title level={2}>Book Your Next Adventure</Title>
        <Paragraph>
          Compare prices, plan smart, and enjoy every moment. Earn XP and unlock
          travel badges along the way.
        </Paragraph>
      </div>

      <BookingXPBar xp={xp} level={level} />

      <Tabs
        activeKey={selectedTab}
        onChange={setSelectedTab}
        centered
        items={[
          {
            key: "flights",
            label: "✈️ Flights",
            children: <FlightSearchForm onSearch={handleSearch} />,
          },
          {
            key: "hotels",
            label: "🏨 Hotels",
            children: (
              <>
                <StaySearchForm
                  onSearch={handleSearch}
                  guests={guests}
                  onGuestsChange={setGuests}
                />
                {guests > 3 && (
                  <div className="mt-6 mb-6">
                    <MultiRoomBooking
                      totalGuests={guests}
                      onConfirm={() => {
                        toast.success("✅ Group room plan saved!");
                        const bonus = 10;
                        setXp((prev) => {
                          const next = prev + bonus;
                          if (next >= 100) {
                            setLevel((lv) => {
                              const nl = lv + 1;
                              unlockBadge(nl);
                              return nl;
                            });
                            toast.success("🎉 You leveled up from planning!");
                            return next - 100;
                          }
                          toast.info(`+${bonus} XP for organizing group rooms`);
                          return next;
                        });
                      }}
                    />
                  </div>
                )}
              </>
            ),
          },
          {
            key: "cruises",
            label: "🚢 Cruises",
            children: <CruiseSearchForm onSearch={handleSearch} />,
          },
          {
            key: "cars",
            label: "🚗 Car Rentals",
            children: <CarSearchForm onSearch={handleSearch} />,
          },
          {
            key: "packages",
            label: "📦 Packages",
            children: <BookingForm onSearch={handleSearch} />,
          },
          {
            key: "saved",
            label: "💾 Saved Trips",
            children: <SavedTrips />,
          },
        ]}
      />

      <Divider />

      <Row gutter={24}>
        <Col xs={24} md={16}>
          <ListingsSection tab={selectedTab} />
        </Col>
        <Col xs={24} md={8}>
          <TripPerks />
          <BookingBadges level={level} />
        </Col>
      </Row>

      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          icon={<HomeOutlined />}
          tooltip="Top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <FloatButton
          icon={<SaveOutlined />}
          tooltip="Saved Trips"
          href="#saved"
        />
        <FloatButton icon={<HeartOutlined />} tooltip="Perks" href="#perks" />
        <FloatButton
          icon={<CarOutlined />}
          tooltip="Cars"
          onClick={() => setSelectedTab("cars")}
        />
        <FloatButton
          icon={<ExperimentOutlined />}
          tooltip="Cruises"
          onClick={() => setSelectedTab("cruises")}
        />
      </FloatButton.Group>
    </div>
  );
};

export default BookingPage;
