import React, { useState } from "react";
import { Row, Col, Typography, Spin } from "antd";
import SearchForm from "./components/SearchForm";
import StayCard from "./components/StayCard";
import SortBar from "./components/SortBar";

const { Title } = Typography;

const BookingPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("recommended");

  const handleSearch = (searchParams) => {
    setLoading(true);

    // Simulated API call (replace later with real data)
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "🌴 Beachfront Paradise",
          price: 250,
          rating: 4.7,
          location: "Bahamas",
          image: "/images/beach.jpg",
        },
        {
          id: 2,
          name: "⛰️ Mountain Escape",
          price: 180,
          rating: 4.3,
          location: "Swiss Alps",
          image: "/images/mountain.jpg",
        },
      ];
      setResults(mockData);
      setLoading(false);
    }, 1000);
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (sortOption) {
      case "priceLow":
        return a.price - b.price;
      case "priceHigh":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title level={2}>🔍 Search Your Stay</Title>
      <SearchForm onSearch={handleSearch} />
      <SortBar onChange={setSortOption} />

      {loading ? (
        <div className="text-center mt-10">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className="mt-6">
          {sortedResults.map((stay) => (
            <Col xs={24} sm={12} md={8} key={stay.id}>
              <StayCard stay={stay} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BookingPage;
