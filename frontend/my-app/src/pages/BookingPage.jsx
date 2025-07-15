import React, { useState } from "react";
import {
  Layout,
  Typography,
  Divider,
  message,
  Tabs,
  Input,
  DatePicker,
  Select,
  Button,
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
import ResultsList from "../components/booking/ResultsList";
import SavedTrips from "../components/booking/SavedTrips";

const { Title } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const BookingPage = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dates, setDates] = useState(null);
  const [guests, setGuests] = useState(1);
  const [toast, contextHolder] = message.useMessage();

  const handleSearch = () => {
    // Placeholder results for now
    setResults([
      {
        id: 1,
        name: "Bali Beach Resort",
        price: "$120/night",
        rating: 4.5,
      },
    ]);
    toast.success("Search complete!");
  };

  return (
    <Layout className="min-h-screen bg-gray-50 p-4">
      {contextHolder}
      <Content className="max-w-6xl mx-auto">
        <Title level={2}>📍 Book Your Next Adventure</Title>
        <Divider />

        {/* 🔍 Universal Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Input
                placeholder="Where are you going?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={8}>
              <RangePicker
                style={{ width: "100%" }}
                onChange={(values) => setDates(values)}
              />
            </Col>
            <Col xs={24} md={4}>
              <Select
                defaultValue={1}
                style={{ width: "100%" }}
                onChange={(value) => setGuests(value)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Select.Option key={n} value={n}>
                    {n} Guest{n > 1 ? "s" : ""}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <Button
                type="primary"
                block
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Search
              </Button>
            </Col>
          </Row>
        </div>

        {/* 📋 Search Tabs */}
        <Tabs defaultActiveKey="hotels" centered>
          <TabPane tab="🏨 Hotels" key="hotels">
            <StaySearchForm onSearch={handleSearch} />
            <HotelListings query={searchQuery} dates={dates} guests={guests} />
          </TabPane>
          <TabPane tab="🌎 Packages" key="packages">
            <PackageFilterForm onSearch={handleSearch} />
            <PackageListings
              query={searchQuery}
              dates={dates}
              guests={guests}
            />
          </TabPane>
          <TabPane tab="✈️ Flights" key="flights">
            <FlightSearchForm onSearch={handleSearch} />
            <FlightListings query={searchQuery} dates={dates} guests={guests} />
          </TabPane>
          <TabPane tab="🚗 Cars" key="cars">
            <CarListings query={searchQuery} dates={dates} guests={guests} />
          </TabPane>
          <TabPane tab="🛳️ Cruises" key="cruises">
            <CruiseListings query={searchQuery} dates={dates} guests={guests} />
          </TabPane>
        </Tabs>

        <Divider />

        {/* 📊 Results Preview */}
        <ResultsList data={results} />

        <Divider />

        {/* 💾 Saved Trips */}
        <SavedTrips />
      </Content>
    </Layout>
  );
};

export default BookingPage;
