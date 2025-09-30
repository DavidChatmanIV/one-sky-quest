import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Space,
  Tag,
  Button,
  Divider,
  Empty,
} from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  StarFilled,
} from "@ant-design/icons";

// ✅ Your layout + styles (optional)
import PageLayout from "../components/PageLayout";
import "../styles/TeamTravelPage.css";

// ✅ FIXED IMPORT PATH
import TeamTravelCard from "../components/landing/TeamTravelCard";

const { Title, Text } = Typography;

export default function TeamTravelPage() {
  // set page title
  useEffect(() => {
    const prev = document.title;
    document.title = "One Sky Quest • Team Travel";
    return () => (document.title = prev);
  }, []);

  // state for query & demo results
  const [query, setQuery] = useState(null);
  const [picks, setPicks] = useState([]);

  const handleStart = useCallback((payload) => {
    setQuery(payload);

    // TODO: replace with real fetch based on:
    // payload.venue, payload.radiusKm, payload.focus, payload.dates, payload.teamSize
    setPicks([
      {
        id: "h1",
        kind: "Stay",
        name: "Riverside Suites",
        distanceKm: 1.2,
        badge: "Family",
        price: "$128",
        rating: 4.5,
      },
      {
        id: "h2",
        kind: "Stay",
        name: "Arena View Hotel",
        distanceKm: 0.6,
        badge: "Closest",
        price: "$149",
        rating: 4.2,
      },
      {
        id: "r1",
        kind: "Food",
        name: "Parkside Kitchen",
        distanceKm: 0.9,
        badge: "Kids menu",
        price: "$$",
        rating: 4.4,
      },
    ]);
  }, []);

  const handleOpenMap = useCallback((venue) => {
    // Hook up to your real map modal/page later
    console.log("Open map for:", venue);
  }, []);

  const headerNote = useMemo(() => {
    if (!query)
      return "Enter a venue to see hotels, food, and kid/adult options nearby.";
    const start = query.dates?.[0]?.format?.("MMM D");
    const end = query.dates?.[1]?.format?.("MMM D");
    return [
      query.venue,
      start && end ? `${start}–${end}` : null,
      query.teamSize ? `~${query.teamSize} people` : null,
      query.focus,
      query.radiusKm ? `${query.radiusKm} km radius` : null,
    ]
      .filter(Boolean)
      .join(" • ");
  }, [query]);

  return (
    <PageLayout fullBleed={false} maxWidth={1180} className="team-travel-page">
      {/* Header */}
      <header className="tt-head">
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Title level={2} className="title-white" style={{ margin: 0 }}>
            Team Travel
          </Title>
          <Link to="/" aria-label="Back to Home">
            <Button icon={<HomeOutlined />} type="primary">
              Home
            </Button>
          </Link>
        </Space>
        <Text type="secondary">{headerNote}</Text>
      </header>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={14} xl={16}>
          {/* Start card */}
          <TeamTravelCard onStart={handleStart} onOpenMap={handleOpenMap} />

          {/* Mini-map preview (placeholder — swap for your real map) */}
          <Card
            className="osq-card tt-map"
            bordered={false}
            bodyStyle={{ padding: 0 }}
            style={{ marginTop: 16 }}
            aria-label="Mini map"
          >
            <div className="tt-map-placeholder">
              <EnvironmentOutlined />
              <span>Mini-map preview (connect your Map component here)</span>
            </div>
          </Card>

          {/* Results */}
          <Card
            className="osq-card"
            bordered={false}
            bodyStyle={{ padding: 16 }}
            style={{ marginTop: 16 }}
          >
            <Space
              align="baseline"
              style={{ justifyContent: "space-between", width: "100%" }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Nearby Picks
              </Title>
              <Space>
                <Tag>Stays</Tag>
                <Tag>Food</Tag>
                <Tag>Family</Tag>
              </Space>
            </Space>

            <Divider style={{ margin: "12px 0" }} />

            {picks.length === 0 ? (
              <Empty description="No results yet. Start a team trip above." />
            ) : (
              <Row gutter={[12, 12]}>
                {picks.map((p) => (
                  <Col xs={24} md={12} key={p.id}>
                    <Card className="tt-pick" bordered hoverable>
                      <Space
                        direction="vertical"
                        size={6}
                        style={{ width: "100%" }}
                      >
                        <Space
                          align="center"
                          style={{
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Tag color={p.kind === "Stay" ? "blue" : "magenta"}>
                            {p.kind}
                          </Tag>
                          <Space size={6}>
                            <StarFilled style={{ color: "#faad14" }} />
                            <Text strong>{p.rating}</Text>
                          </Space>
                        </Space>

                        <Text strong>{p.name}</Text>

                        <Text type="secondary">
                          <CompassOutlined /> {p.distanceKm} km •{" "}
                          <Tag>{p.badge}</Tag>
                        </Text>

                        <Space
                          align="center"
                          style={{
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Text strong>{p.price}</Text>
                          <Button type="primary" size="small">
                            Add to plan
                          </Button>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={10} xl={8}>
          <Card
            className="osq-card"
            bordered={false}
            bodyStyle={{ padding: 16 }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Filters
            </Title>
            <Divider style={{ margin: "12px 0" }} />
            <Space direction="vertical" size={10} style={{ width: "100%" }}>
              <Space wrap>
                <Tag>Free breakfast</Tag>
                <Tag>Pool</Tag>
                <Tag>Kitchen</Tag>
                <Tag>Walkable</Tag>
                <Tag>Parking</Tag>
              </Space>
              <Divider style={{ margin: "8px 0" }} />
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Text type="secondary">Tip</Text>
                <Text>
                  Use a <b>small radius</b> for early games, or expand to find
                  better <b>adult unwind</b> options after the tournament.
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  );
}
