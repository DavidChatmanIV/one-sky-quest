import React, { useState, useEffect } from "react";
import { Layout, Divider } from "antd";
import BookingForm from "../components/booking/BookingForm";
import FlightSearchForm from "../components/booking/FlightSearchForm";
import StaySearchForm from "../components/booking/StaySearchForm";
import StayTypeSelector from "../components/booking/StayTypeSelector";
import ResultsList from "../components/booking/ResultsList";
import PackageFilterForm from "../components/booking/PackageFilterForm";
import SavedTrips from "../components/booking/SavedTrips";
import ToastNotification from "../components/common/ToastNotification";

const { Content } = Layout;

const Booking = () => {
  // 💾 State for results
  const [stayType, setStayType] = useState("hotel");
  const [stayResults, setStayResults] = useState([]);
  const [flightResults, setFlightResults] = useState([]);
  const [packageResults, setPackageResults] = useState([]);
  const [carResults, setCarResults] = useState([]);
  const [cruiseResults, setCruiseResults] = useState([]);

  // ✅ Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // 🔔 Show toast utility
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // 🚗🚢 Auto-load cars and cruises on mount
  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((cars) => setCarResults(cars))
      .catch(() => showToast("Failed to load cars.", "error"));

    fetch("/api/cruises")
      .then((res) => res.json())
      .then((cruises) => setCruiseResults(cruises))
      .catch(() => showToast("Failed to load cruises.", "error"));
  }, []);

  return (
    <Layout style={{ background: "#f9fafb" }}>
      <Content style={{ padding: "30px 20px" }}>
        {/* 📝 Booking form */}
        <BookingForm showToast={showToast} selectedType={stayType} />
        <Divider />

        {/* ✈️ Flights */}
        <FlightSearchForm
          setFlightResults={setFlightResults}
          showToast={showToast}
        />
        <ResultsList
          title="✈️ Flight Results"
          results={flightResults}
          type="flight"
        />
        <Divider />

        {/* 🏨 Stay Search */}
        <StaySearchForm
          setStayResults={setStayResults}
          selectedType={stayType}
          showToast={showToast}
        />
        <StayTypeSelector onTypeSelect={setStayType} />
        <ResultsList
          title={`🏡 ${stayType.toUpperCase()} Stays`}
          results={stayResults}
          type="stay"
        />
        <SavedTrips />
        <Divider />

        {/* 📦 Travel Packages */}
        <PackageFilterForm
          setPackageResults={setPackageResults}
          showToast={showToast}
        />
        <ResultsList
          title="📦 Travel Packages"
          results={packageResults}
          type="package"
        />
        <Divider />

        {/* 🚗 Rental Cars */}
        <ResultsList
          title="🚗 Available Rental Cars"
          results={carResults}
          type="car"
        />
        <Divider />

        {/* 🚢 Cruise Deals */}
        <ResultsList
          title="🚢 Cruise Deals"
          results={cruiseResults}
          type="cruise"
        />

        {/* 🔔 Toast */}
        <ToastNotification
          type={toastType}
          message={toastMessage}
          visible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      </Content>
    </Layout>
  );
};

export default Booking;
