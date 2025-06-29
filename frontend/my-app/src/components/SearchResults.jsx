import React from "react";
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
} from "antd";

const { Title } = Typography;
const { Option } = Select;

const mockResults = [
  {
    title: "🏖️ Oceanview Hotel, Miami",
    price: "$189/night",
    tags: ["Beach", "4★", "Free Wifi"],
    image: "https://source.unsplash.com/400x250/?miami,hotel",
  },
  {
    title: "🏔️ Alpine Lodge, Switzerland",
    price: "$299/night",
    tags: ["Mountain", "5★", "Breakfast included"],
    image: "https://source.unsplash.com/400x250/?swiss,lodge",
  },
  {
    title: "🏙️ City Apartment, Tokyo",
    price: "$120/night",
    tags: ["Urban", "3★", "Central Location"],
    image: "https://source.unsplash.com/400x250/?tokyo,apartment",
  },
];

const SearchResults = () => {
  return (
    <section className="py-12 px-4" style={{ backgroundColor: "#fff" }}>
      <Title level={2} className="text-center">
        🔍 Search Results
      </Title>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        {/* Filter Sidebar */}
        <Col xs={24} md={6}>
          <div
            style={{ padding: "1rem", background: "#fafafa", borderRadius: 12 }}
          >
            <Title level={4}>Filter</Title>

            <Divider />

            <p>Sort By</p>
            <Select defaultValue="recommended" style={{ width: "100%" }}>
              <Option value="recommended">Recommended</Option>
              <Option value="priceLow">Price: Low to High</Option>
              <Option value="priceHigh">Price: High to Low</Option>
              <Option value="rating">Guest Rating</Option>
            </Select>

            <Divider />

            <p>Keyword</p>
            <Input placeholder="e.g. WiFi, pool" />

            <Divider />

            <Button type="primary" block>
              Apply Filters
            </Button>
          </div>
        </Col>

        {/* Results */}
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]}>
            {mockResults.map((item, i) => (
              <Col xs={24} md={12} key={i}>
                <Card
                  hoverable
                  cover={<img alt={item.title} src={item.image} />}
                >
                  <Title level={4}>{item.title}</Title>
                  <p>{item.price}</p>
                  <div>
                    {item.tags.map((tag, i) => (
                      <Tag key={i} color="blue">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default SearchResults;
