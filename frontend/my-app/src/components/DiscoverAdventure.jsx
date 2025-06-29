import React from "react";
import { Typography, Button, Input, DatePicker, Space } from "antd";
import { CompassOutlined, SearchOutlined } from "@ant-design/icons";
import "../styles/DiscoverAdventure.css"; 

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const DiscoverAdventure = () => {
  const categories = ["Flights", "Hotels", "Packages", "Cars", "Cruises"];

  return (
    <section className="discover-wrapper">
      <div className="discover-content">
        <Title level={1}>Discover Your Next Adventure</Title>
        <Paragraph className="subtitle">
          🌍 Plan Smarter. Travel Better. One Sky, Endless Adventures.
        </Paragraph>

        <div className="category-buttons">
          {categories.map((label, idx) => (
            <Button
              key={idx}
              type="primary"
              icon={<CompassOutlined />}
              className="category-btn"
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="search-form">
          <Space direction="horizontal" size="middle" wrap>
            <Input placeholder="e.g. JFK" className="search-input" />
            <Input placeholder="e.g. LAX" className="search-input" />
            <RangePicker className="date-picker" />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className="search-btn"
            >
              Search
            </Button>
          </Space>
        </div>
      </div>
    </section>
  );
};

export default DiscoverAdventure;
