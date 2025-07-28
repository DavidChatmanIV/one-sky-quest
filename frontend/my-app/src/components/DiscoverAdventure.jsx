import React from "react";
import { Typography, Button, Input, DatePicker, Space } from "antd";
import { CompassOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/DiscoverAdventure.css"; // Optional custom styles

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const categories = ["Flights", "Hotels", "Packages", "Cars", "Cruises"];

const DiscoverAdventure = () => {
  return (
    <section className="discover-wrapper bg-gradient-to-br from-sky-50 via-white to-indigo-100 py-20 px-6 text-center">
      <div className="discover-content max-w-5xl mx-auto">
        {/* 🌍 Hero Title (Styled to Match Original Font) */}
        <Title
          level={1}
          className="text-[3.2rem] font-bold mb-4 text-[#4338ca] drop-shadow-sm leading-tight"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          🌍 Discover Your Next Adventure
        </Title>

        {/* Subtitle */}
        <Paragraph className="text-xl text-gray-700 mb-6 leading-relaxed">
          Book smarter. Travel freer. Earn XP as you explore the world.
          <br />
          Plan smarter. Travel better. One Sky, Endless Adventures.
        </Paragraph>

        {/* ✈️ Start Quest CTA */}
        <Link to="/booking">
          <Button
            size="large"
            type="primary"
            className="mb-10 bg-indigo-600 hover:bg-indigo-700"
          >
            ✈️ Start Your Quest
          </Button>
        </Link>

        {/* 🌐 Category Filters */}
        <div className="flex justify-center flex-wrap gap-3 mb-6">
          {categories.map((label, idx) => (
            <Button
              key={idx}
              type="primary"
              icon={<CompassOutlined />}
              className="min-w-[110px]"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* 🔍 Search Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Space direction="horizontal" size="middle" wrap>
            <Input
              placeholder="e.g. JFK"
              className="min-w-[160px]"
              allowClear
            />
            <Input
              placeholder="e.g. LAX"
              className="min-w-[160px]"
              allowClear
            />
            <RangePicker className="date-picker" />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
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
