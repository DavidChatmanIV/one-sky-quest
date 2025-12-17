import React, { useMemo, useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Select,
  Input,
  Button,
  Tag,
  Divider,
  Space,
  Rate,
  Drawer,
  Grid,
  Badge,
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const mockResults = [
  {
    title: "🏖️ Oceanview Hotel, Miami",
    price: 189,
    rating: 4,
    tags: ["Beach", "Free Wifi"],
    image: "https://source.unsplash.com/800x500/?miami,hotel",
  },
  {
    title: "🏔️ Alpine Lodge, Switzerland",
    price: 299,
    rating: 5,
    tags: ["Mountain", "Breakfast included"],
    image: "https://source.unsplash.com/800x500/?swiss,lodge",
  },
  {
    title: "🏙️ City Apartment, Tokyo",
    price: 120,
    rating: 3,
    tags: ["Urban", "Central Location"],
    image: "https://source.unsplash.com/800x500/?tokyo,apartment",
  },
];

const tagColor = (t) => {
  const k = t.toLowerCase();
  if (k.includes("beach")) return "blue";
  if (k.includes("mountain")) return "green";
  if (k.includes("urban")) return "purple";
  if (k.includes("breakfast")) return "gold";
  if (k.includes("wifi") || k.includes("wi-fi")) return "geekblue";
  if (k.includes("central")) return "volcano";
  return "default";
};

const SearchResults = () => {
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // filters
  const [sortBy, setSortBy] = useState("recommended");
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    let data = [...mockResults];

    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "priceLow":
        data.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        data.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        data.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // recommended: slight mix of rating then price
        data.sort((a, b) => b.rating - a.rating || a.price - b.price);
    }
    return data;
  }, [sortBy, keyword]);

  const resetFilters = () => {
    setSortBy("recommended");
    setKeyword("");
  };

  const FilterContent = (
    <div style={{ padding: 12 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <Text type="secondary">Sort by</Text>
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: "100%", marginTop: 6 }}
          >
            <Option value="recommended">Recommended</Option>
            <Option value="priceLow">Price: Low to High</Option>
            <Option value="priceHigh">Price: High to Low</Option>
            <Option value="rating">Guest Rating</Option>
          </Select>
        </div>

        <div>
          <Text type="secondary">Keyword</Text>
          <Input
            allowClear
            placeholder="e.g. WiFi, pool, beach"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ marginTop: 6 }}
          />
        </div>

        <Space>
          <Button onClick={resetFilters}>Reset</Button>
          <Button type="primary" onClick={() => setDrawerOpen(false)}>
            Apply
          </Button>
        </Space>
      </Space>
    </div>
  );

  return (
    <section className="py-12 px-4" style={{ backgroundColor: "#fff" }}>
      <Title level={2} className="text-center" style={{ marginBottom: 8 }}>
        🔍 Search Results
      </Title>

      {/* Toolbar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 0 4px",
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Space size="small" wrap>
          <Badge
            count={filtered.length}
            style={{ backgroundColor: "#1677ff" }}
            offset={[8, -2]}
          >
            <Text strong>Results</Text>
          </Badge>
          {keyword && (
            <Tag closable onClose={resetFilters}>
              Keyword: {keyword}
            </Tag>
          )}
        </Space>

        {/* Desktop controls inline; Mobile uses a drawer */}
        {screens.md ? (
          <Space size="middle" wrap>
            <Input
              allowClear
              placeholder="Search keyword (e.g., beach, wifi)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 260 }}
            />
            <Select value={sortBy} onChange={setSortBy} style={{ width: 220 }}>
              <Option value="recommended">Recommended</Option>
              <Option value="priceLow">Price: Low to High</Option>
              <Option value="priceHigh">Price: High to Low</Option>
              <Option value="rating">Guest Rating</Option>
            </Select>
            <Button onClick={resetFilters}>Reset</Button>
          </Space>
        ) : (
          <Button onClick={() => setDrawerOpen(true)}>Filters</Button>
        )}
      </div>

      <Divider style={{ margin: "12px auto 24px", maxWidth: 1200 }} />

      {/* Results grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[16, 16]}>
          {filtered.map((item, i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <Card
                hoverable
                style={{ borderRadius: 12, overflow: "hidden" }}
                cover={
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "62.5%", // 16:10 ratio
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                }
              >
                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                  <Title level={4} style={{ marginBottom: 0 }}>
                    {item.title}
                  </Title>

                  <Space
                    align="center"
                    style={{ justifyContent: "space-between" }}
                  >
                    <Space>
                      <Rate disabled value={item.rating} allowHalf={false} />
                      <Text type="secondary">{item.rating}.0</Text>
                    </Space>
                    <Text strong style={{ fontSize: 18 }}>
                      ${item.price}
                      <Text type="secondary"> / night</Text>
                    </Text>
                  </Space>

                  <Space wrap>
                    {item.tags.map((t) => (
                      <Tag key={t} color={tagColor(t)}>
                        {t}
                      </Tag>
                    ))}
                  </Space>

                  <Button type="primary" block>
                    View details
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Mobile filter drawer */}
      <Drawer
        title="Filters"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
      >
        {FilterContent}
      </Drawer>
    </section>
  );
};

export default SearchResults;
