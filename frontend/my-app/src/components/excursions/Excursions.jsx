import React, { useState } from "react";
import { Card, Tag, Select, Input, Row, Col } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const MotionSection = motion.section; // ✅ JSX-compatible motion component
const { Option } = Select;

const mockExcursions = [
  {
    id: 1,
    title: "Tokyo Night Food Tour 🍜",
    location: "Tokyo, Japan",
    image: "/images/tokyo-food-tour.jpg",
    type: "Food & Drink",
    tags: ["Foodie Favorite", "Nightlife"],
  },
  {
    id: 2,
    title: "Eiffel Tower Skip-the-Line 🗼",
    location: "Paris, France",
    image: "/images/paris-eiffel.jpg",
    type: "Cultural",
    tags: ["Must-See", "Guided Tour"],
  },
  {
    id: 3,
    title: "Scuba Dive in Great Barrier Reef 🤿",
    location: "Cairns, Australia",
    image: "/images/scuba-dive.jpg",
    type: "Adventure",
    tags: ["Adrenaline Rush", "Nature"],
  },
];

const Excursions = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [savedTrips, setSavedTrips] = useState(() => {
    const stored = localStorage.getItem("savedExcursions");
    return stored ? JSON.parse(stored) : [];
  });

  const handleSave = (trip) => {
    if (savedTrips.some((t) => t.id === trip.id)) return;
    const updated = [...savedTrips, trip];
    setSavedTrips(updated);
    localStorage.setItem("savedExcursions", JSON.stringify(updated));
  };

  const filteredExcursions = mockExcursions.filter((item) => {
    const matchesType = filter === "All" || item.type === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <MotionSection
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="px-4 md:px-12 py-12 bg-gray-50 dark:bg-[#1e293b] border-t border-gray-200 dark:border-slate-700 shadow-inner"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        🌍 Excursions
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <Input
          placeholder="🔍 Search by name or location"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Select
          defaultValue="All"
          onChange={(value) => setFilter(value)}
          className="w-full md:w-1/4"
        >
          <Option value="All">All Types</Option>
          <Option value="Food & Drink">🍽 Food & Drink</Option>
          <Option value="Cultural">🏛 Cultural</Option>
          <Option value="Adventure">🏞 Adventure</Option>
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {filteredExcursions.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.id}>
            <Card
              hoverable
              className="transition-all duration-300 hover:scale-[1.02] shadow-md"
              cover={
                <img
                  alt={item.title}
                  src={item.image}
                  className="h-48 w-full object-cover rounded-t-md"
                />
              }
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-2">
                <EnvironmentOutlined /> {item.location}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
              <button
                onClick={() => handleSave(item)}
                className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
              >
                💾 Save to Trip
              </button>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredExcursions.length === 0 && (
        <div className="text-center mt-10 text-gray-500 dark:text-gray-300">
          No excursions match your search.
        </div>
      )}
    </MotionSection>
  );
};

export default Excursions;
