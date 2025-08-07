import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  Tag,
  Input,
  Row,
  Col,
  Empty,
  message,
  Segmented,
  Skeleton,
} from "antd";
import {
  EnvironmentOutlined,
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { motion, useReducedMotion } from "framer-motion";

const MotionSection = motion.section;

const CATEGORIES = ["All", "Food & Drink", "Cultural", "Adventure"];

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
  const [debounced, setDebounced] = useState("");
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedExcursions")) || [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem("savedExcursions", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    return mockExcursions.filter((x) => {
      const typeMatch = filter === "All" || x.type === filter;
      const q = debounced;
      const textMatch =
        !q ||
        x.title.toLowerCase().includes(q) ||
        x.location.toLowerCase().includes(q);
      return typeMatch && textMatch;
    });
  }, [filter, debounced]);

  const isSaved = (id) => saved.some((s) => s.id === id);

  const handleSave = (item) => {
    if (isSaved(item.id)) {
      setSaved((prev) => prev.filter((s) => s.id !== item.id));
      message.info("Removed from saved.");
      return;
    }
    setSaved((prev) => [...prev, item]);
    message.success("Saved to trip!");
  };

  const sectionMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        viewport: { once: true, amount: 0.2 },
      };

  const cardMotion = prefersReducedMotion
    ? {}
    : {
        whileHover: {
          y: -4,
          scale: 1.01,
          transition: { type: "spring", stiffness: 300, damping: 24 },
        },
      };

  return (
    <MotionSection
      {...sectionMotion}
      className="bg-gray-50 py-12" // light gray band
      aria-label="Excursions"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-3 text-center text-gray-900">
          🌍 Excursions
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Handpicked activities—quick to scan, easy to book.
        </p>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 mb-8">
          <Input
            allowClear
            size="large"
            placeholder="Search Tokyo, Paris, scuba..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:flex-1"
            aria-label="Search excursions"
          />
          <Segmented
            size="large"
            options={CATEGORIES}
            value={filter}
            onChange={(v) => setFilter(v)}
            className="w-full md:w-auto"
            aria-label="Filter by category"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <Row gutter={[16, 16]}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Col xs={24} sm={12} md={8} key={i}>
                <Card className="bg-white rounded-xl shadow">
                  <Skeleton.Image
                    style={{ width: "100%", height: 192, borderRadius: 12 }}
                    active
                  />
                  <Skeleton active className="mt-4" />
                </Card>
              </Col>
            ))}
          </Row>
        ) : filtered.length ? (
          <Row gutter={[16, 16]}>
            {filtered.map((item) => (
              <Col xs={24} sm={12} md={8} key={item.id}>
                <motion.div {...cardMotion}>
                  <Card
                    hoverable
                    className="bg-white rounded-xl shadow-md transition-transform" // white cards
                    cover={
                      <img
                        alt={item.title}
                        src={item.image}
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.jpg";
                        }}
                        className="h-48 w-full object-cover rounded-t-xl"
                      />
                    }
                    bodyStyle={{ padding: 16 }}
                  >
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                      <EnvironmentOutlined /> {item.location}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag) => (
                        <Tag key={tag} color="blue">
                          {tag}
                        </Tag>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSave(item)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
                      aria-pressed={isSaved(item.id)}
                      aria-label={
                        isSaved(item.id) ? "Remove from saved" : "Save to trip"
                      }
                    >
                      {isSaved(item.id) ? <HeartFilled /> : <HeartOutlined />}{" "}
                      {isSaved(item.id) ? "Saved" : "Save"}
                    </button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="bg-white rounded-xl shadow p-12">
            {" "}
            {/* white empty state */}
            <Empty
              description="No excursions match your search."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>
    </MotionSection>
  );
};

export default Excursions;
