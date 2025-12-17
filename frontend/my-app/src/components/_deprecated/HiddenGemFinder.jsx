import React, { useMemo, useRef, useState } from "react";
import { Typography, Card, Row, Col, Button, Input, message } from "antd";

const { Title, Paragraph } = Typography;

const gems = [
  {
    title: "Giethoorn, Netherlands 🇳🇱",
    desc: "No roads, just canals. A peaceful village where you paddle to dinner.",
    image: "/images/gem-giethoorn.jpg",
  },
  {
    title: "Chefchaouen, Morocco 🇲🇦",
    desc: "A hidden mountain town painted entirely in shades of blue.",
    image: "/images/gem-chefchaouen.jpg",
  },
];

const cardStyle = {
  borderRadius: 12,
  transition: "transform .15s ease, box-shadow .15s ease",
};
const coverStyle = {
  width: "100%",
  aspectRatio: "4 / 3", // keeps a clean, consistent layout
  objectFit: "cover",
  display: "block",
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
};

const HiddenGemFinder = () => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return gems;
    return gems.filter((g) =>
      (g.title + " " + g.desc).toLowerCase().includes(q)
    );
  }, [query]);

  const handleSubmit = () => {
    const val = inputRef.current?.resizableTextArea?.textArea?.value?.trim();
    if (!val) return message.warning("Tell us a little about the gem first.");
    message.success("Thanks! Your hidden gem was submitted.");
    // Clear input
    if (inputRef.current?.resizableTextArea?.textArea) {
      inputRef.current.resizableTextArea.textArea.value = "";
    }
  };

  return (
    <section className="py-10 px-4" style={{ background: "#f9f9f9" }}>
      <Title level={2} className="text-center" style={{ marginBottom: 8 }}>
        🗺️ Hidden Gem Finder
      </Title>
      <Paragraph
        className="text-center"
        style={{ maxWidth: 600, margin: "0 auto 1.5rem" }}
      >
        Uncover secret spots loved by locals. Submit your own hidden gem too!
      </Paragraph>

      {/* Simple search */}
      <div style={{ maxWidth: 520, margin: "0 auto 1.5rem" }}>
        <Input.Search
          allowClear
          size="large"
          placeholder="Search by place or description…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Cards */}
      <Row gutter={[24, 24]} justify="center">
        {filtered.map((gem, index) => (
          <Col xs={24} sm={12} md={10} key={index}>
            <Card
              hoverable
              style={cardStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
              cover={
                <img
                  src={gem.image}
                  alt={gem.title}
                  loading="lazy"
                  style={coverStyle}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop";
                  }}
                />
              }
            >
              <Title level={4} style={{ marginBottom: 8 }}>
                {gem.title}
              </Title>
              <Paragraph style={{ margin: 0 }}>{gem.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Submit box */}
      <div
        style={{
          marginTop: "2.5rem",
          maxWidth: 520,
          marginInline: "auto",
          textAlign: "center",
        }}
      >
        <Title level={4} style={{ marginBottom: 8 }}>
          Know a Hidden Gem?
        </Title>
        <Input.TextArea
          ref={inputRef}
          placeholder="Type the location and what makes it special..."
          rows={3}
          maxLength={220}
          showCount
        />
        <Button type="primary" style={{ marginTop: 12 }} onClick={handleSubmit}>
          Submit Hidden Gem
        </Button>
      </div>
    </section>
  );
};

export default HiddenGemFinder;
