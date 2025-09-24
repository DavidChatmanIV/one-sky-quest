import React from "react";
import { Card, Space, Typography, Button, Image, Row, Col, Tag } from "antd";

const { Title, Text } = Typography;

/**
 * UniqueStaysCard
 * Props:
 * - items: [{ id, title, image, badge }]
 * - onBrowse: () => void
 * - onSelect: (item) => void
 * - loading: boolean
 */
export default function UniqueStaysCard({
  items = [
    {
      id: "tree",
      title: "Treehouse",
      image: "/img/treehouse.jpg",
      badge: "Eco",
    },
    {
      id: "igloo",
      title: "Glass Igloo",
      image: "/img/igloo.jpg",
      badge: "Aurora",
    },
    {
      id: "villa",
      title: "Cliff Villa",
      image: "/img/villa.jpg",
      badge: "Ocean",
    },
  ],
  onBrowse,
  onSelect,
  loading = false,
}) {
  return (
    <Card
      // bordered={false}                  // ❌ deprecated
      variant="borderless" // ✅ v5 replacement
      styles={{ body: { padding: 16 } }} // ✅ replace bodyStyle with styles.body
      className="card glass unique"
      loading={loading}
      style={{ height: "100%" }}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Text className="card-eyebrow">✨ Unique Stays</Text>
        <Title
          level={4}
          style={{ margin: 0, color: "var(--text-1)", lineHeight: 1.15 }}
        >
          Stay Different. Stay Unique.
        </Title>

        <Row gutter={8} style={{ marginTop: 4 }}>
          {items.slice(0, 3).map((it) => (
            <Col key={it.id} span={8}>
              <div
                role="button"
                aria-label={`View ${it.title}`}
                tabIndex={0}
                onClick={() => onSelect && onSelect(it)}
                onKeyDown={(e) => e.key === "Enter" && onSelect && onSelect(it)}
                className="unique-thumb"
                style={{
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "var(--glass)",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={it.image}
                  alt={it.title}
                  preview={false}
                  height={68}
                  width="100%"
                  style={{ objectFit: "cover" }}
                />

                {it.badge && (
                  <Tag
                    color="purple"
                    style={{
                      position: "absolute",
                      top: 6,
                      left: 6,
                      backdropFilter: "blur(6px)",
                      border: "none",
                    }}
                  >
                    {it.badge}
                  </Tag>
                )}

                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: 8,
                    right: 8,
                    fontSize: 12,
                    color: "var(--text-1)",
                    textShadow: "0 1px 2px rgba(0,0,0,.45)",
                  }}
                >
                  {it.title}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Button type="primary" block onClick={onBrowse} disabled={loading}>
          Browse Unique Stays
        </Button>
      </Space>
    </Card>
  );
}
