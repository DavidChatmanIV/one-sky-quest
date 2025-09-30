import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Space,
  Segmented,
  Badge,
  Divider,
  message,
  Select,
  Popconfirm,
  Collapse,
  List,
} from "antd";
import {
  EnvironmentOutlined,
  HomeOutlined,
  ShareAltOutlined,
  CopyOutlined,
  SendOutlined,
  TeamOutlined,
  CompassOutlined,
  DownloadOutlined,
  LinkOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import GlassCard from "../../components/GlassCard";
import CTAButton from "../../components/CTAButton";
import { CATEGORIES } from "../../constants/travel";
import { useSavedVenues } from "../../hooks/useSavedVenues";
import {
  buildAppleDirectionsUrl,
  buildGoogleDirectionsUrl,
  buildNearbyHotelUrl,
  buildNearbySearchUrl,
  buildPlaceUrl,
} from "../../utils/maps";
import AddVenueModal from "./AddVenueModal";
import ShareDrawer from "./ShareDrawer";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const pageWrapStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(1200px 800px at 10% -20%, #2b1e4b 0%, transparent 60%), " +
    "radial-gradient(1200px 800px at 90% -20%, #3a2430 0%, transparent 60%), " +
    "linear-gradient(180deg, #130e24 0%, #2a1b45 40%, #3a2430 100%)",
};
const innerWrapStyle = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "16px 12px 28px",
};

export default function TeamTravelPage() {
  // FORM STATE
  const [venue, setVenue] = useState("");
  const [hotel, setHotel] = useState("");
  const [mode, setMode] = useState("DRIVING");
  const [category, setCategory] = useState("family");
  const [shareOpen, setShareOpen] = useState(false);

  // SAVED VENUES
  const [savedVenues, setSavedVenues] = useSavedVenues();
  const [addOpen, setAddOpen] = useState(false);

  // Memos
  const categoryObj = useMemo(
    () => CATEGORIES.find((c) => c.key === category) || CATEGORIES[0],
    [category]
  );
  const gDirections = useMemo(
    () => buildGoogleDirectionsUrl(hotel, venue, mode),
    [hotel, venue, mode]
  );
  const aDirections = useMemo(
    () => buildAppleDirectionsUrl(hotel, venue, mode),
    [hotel, venue, mode]
  );
  const nearbyHotels = useMemo(() => buildNearbyHotelUrl(venue), [venue]);
  const quickSearches = useMemo(
    () =>
      (categoryObj.types || [])
        .slice(0, 8)
        .map((t) => ({ label: t, url: buildNearbySearchUrl(venue, t) })),
    [venue, categoryObj]
  );

  // Handlers
  const handleAddVenue = (values) => {
    const value = (values.address || "").trim();
    const label = (values.name || value).trim();
    if (!value) return;
    setSavedVenues((prev) => {
      const others = prev.filter((v) => v.value !== value);
      return [...others, { label, value }];
    });
    setVenue(value);
    setAddOpen(false);
    message.success("Venue added to saved list");
  };

  const handleRemoveVenue = (value) => {
    const next = savedVenues.filter((v) => v.value !== value);
    setSavedVenues(next);
    if (venue === value) setVenue("");
    message.success("Removed saved venue");
  };

  const shareBody = `Team Travel Plan
Venue: ${venue || "—"}
Hotel/Home: ${hotel || "—"}
Mode: ${mode}

Google Directions:
${gDirections}

Apple Maps:
${aDirections}

Hotels near venue:
${nearbyHotels}`;

  return (
    <div style={pageWrapStyle}>
      <div style={innerWrapStyle}>
        {/* Header */}
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space align="center">
            <TeamOutlined style={{ color: "#ffa94d" }} />
            <Title level={2} style={{ color: "#f4f6fb", margin: 0 }}>
              Team Travel Planner — Lite
            </Title>
          </Space>
          <Link to="/">
            <CTAButton icon={<HomeOutlined />}>Home</CTAButton>
          </Link>
        </div>

        {/* MAIN */}
        <Row gutter={[12, 12]} wrap align="top">
          {/* LEFT: FORM */}
          <Col xs={24} lg={14} style={{ display: "flex" }}>
            <GlassCard title="Venue & Hotel" style={{ flex: 1 }}>
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                {/* Saved Venues */}
                <Select
                  placeholder="Choose saved venue"
                  style={{ width: "100%" }}
                  options={savedVenues}
                  onChange={setVenue}
                  value={venue || undefined}
                  allowClear
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider
                        style={{
                          margin: "8px 0",
                          borderColor: "rgba(255,255,255,.10)",
                        }}
                      />
                      <Space
                        style={{
                          padding: 8,
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <CTAButton
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => setAddOpen(true)}
                        >
                          Add venue
                        </CTAButton>
                        {venue && (
                          <Popconfirm
                            title="Remove saved venue?"
                            okText="Remove"
                            okButtonProps={{ danger: true, size: "small" }}
                            cancelText="Cancel"
                            onConfirm={() => handleRemoveVenue(venue)}
                          >
                            <Button
                              size="small"
                              icon={<DeleteOutlined />}
                              danger
                            >
                              Remove selected
                            </Button>
                          </Popconfirm>
                        )}
                      </Space>
                    </div>
                  )}
                />

                {/* Inputs */}
                <Row gutter={[10, 10]}>
                  <Col xs={24} md={12}>
                    <Input
                      size="middle"
                      prefix={<EnvironmentOutlined />}
                      placeholder="Sports venue address"
                      allowClear
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                    />
                    <Space size={6} style={{ marginTop: 6 }}>
                      <Button
                        size="small"
                        icon={<LinkOutlined />}
                        href={buildPlaceUrl(venue)}
                        target="_blank"
                        disabled={!venue}
                      >
                        Open Venue in Maps
                      </Button>
                    </Space>
                  </Col>
                  <Col xs={24} md={12}>
                    <Input
                      size="middle"
                      prefix={<EnvironmentOutlined />}
                      placeholder="Your hotel or home address"
                      allowClear
                      value={hotel}
                      onChange={(e) => setHotel(e.target.value)}
                    />
                    <Space size={6} style={{ marginTop: 6 }}>
                      <Button
                        size="small"
                        icon={<LinkOutlined />}
                        href={buildPlaceUrl(hotel)}
                        target="_blank"
                        disabled={!hotel}
                      >
                        Open Hotel in Maps
                      </Button>
                    </Space>
                  </Col>
                </Row>

                <Row gutter={[8, 8]} align="middle">
                  <Col flex="auto">
                    <Segmented
                      value={mode}
                      onChange={setMode}
                      options={[
                        { label: "Drive", value: "DRIVING" },
                        { label: "Transit", value: "TRANSIT" },
                        { label: "Walk", value: "WALKING" },
                      ]}
                    />
                  </Col>
                  <Col>
                    <Button
                      icon={<HomeOutlined />}
                      href={nearbyHotels}
                      target="_blank"
                      disabled={!venue}
                    >
                      Hotels near venue
                    </Button>
                  </Col>
                </Row>

                <Divider style={{ borderColor: "rgba(255,255,255,.10)" }} />

                {/* Directions */}
                <Row gutter={[8, 8]}>
                  <Col xs={24} md={12}>
                    <CTAButton
                      block
                      icon={<SendOutlined />}
                      href={gDirections}
                      target="_blank"
                      disabled={!venue || !hotel}
                    >
                      Open in Google Maps
                    </CTAButton>
                  </Col>
                  <Col xs={24} md={12}>
                    <Button
                      block
                      icon={<SendOutlined />}
                      href={aDirections}
                      target="_blank"
                      disabled={!venue || !hotel}
                    >
                      Open in Apple Maps
                    </Button>
                  </Col>
                </Row>

                {/* Nearby */}
                <Divider style={{ borderColor: "rgba(255,255,255,.10)" }} />
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Segmented
                    block
                    options={CATEGORIES.map((c) => ({
                      label: c.label,
                      value: c.key,
                    }))}
                    value={category}
                    onChange={setCategory}
                  />
                  <List
                    grid={{ gutter: 8, xs: 2, sm: 3, md: 3, lg: 4 }}
                    dataSource={quickSearches}
                    locale={{
                      emptyText: venue
                        ? "No quick links"
                        : "Enter a venue address to enable",
                    }}
                    renderItem={(it) => (
                      <List.Item>
                        <Button
                          block
                          size="small"
                          href={it.url}
                          target="_blank"
                          disabled={!venue}
                        >
                          {it.label}
                        </Button>
                      </List.Item>
                    )}
                  />
                </Space>

                {/* Tips */}
                <Collapse ghost style={{ marginTop: 4 }}>
                  <Panel
                    header={<span style={{ color: "#f4f6fb" }}>Tips</span>}
                    key="tips"
                  >
                    <ul style={{ color: "#c9cbe3", marginLeft: 18 }}>
                      <li>
                        Paste full street addresses for the most accurate
                        directions.
                      </li>
                      <li>
                        Use <b>Saved Venues</b> to speed up planning for repeat
                        tournaments.
                      </li>
                      <li>
                        Tap <b>Hotels near venue</b> to quickly shortlist stays.
                      </li>
                    </ul>
                  </Panel>
                </Collapse>
              </Space>
            </GlassCard>
          </Col>

          {/* RIGHT: PREVIEW */}
          <Col xs={24} lg={10} style={{ display: "flex" }}>
            <GlassCard
              title={
                <span>
                  <CompassOutlined /> Plan Preview
                </span>
              }
              extra={
                venue && hotel ? (
                  <Badge
                    color="#ff8a2a"
                    text={
                      <span style={{ color: "#f4f6fb" }}>Ready to share</span>
                    }
                  />
                ) : null
              }
              style={{ flex: 1 }}
            >
              <div style={{ lineHeight: 1.5 }}>
                <Text style={{ color: "#c9cbe3" }}>
                  <b>Venue:</b> {venue || "—"}
                  <br />
                  <b>Hotel/Home:</b> {hotel || "—"}
                  <br />
                  <b>Mode:</b> {mode}
                </Text>
                <Divider style={{ borderColor: "rgba(255,255,255,.10)" }} />
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12}>
                    <CTAButton
                      block
                      icon={<ShareAltOutlined />}
                      onClick={() => setShareOpen(true)}
                      disabled={!venue}
                    >
                      Share plan
                    </CTAButton>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Button
                      block
                      icon={<CopyOutlined />}
                      onClick={async () => {
                        const text = `Team Travel Plan
Venue: ${venue}
Hotel/Home: ${hotel}
Mode: ${mode}
Google Directions: ${gDirections}
Apple Directions: ${aDirections}
Hotels near venue: ${nearbyHotels}`;
                        try {
                          await navigator.clipboard.writeText(text);
                          message.success("Plan copied");
                        } catch {
                          message.error("Copy failed");
                        }
                      }}
                      disabled={!venue}
                    >
                      Copy
                    </Button>
                  </Col>
                  <Col xs={24}>
                    <CTAButton
                      block
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        const rows = [
                          ["Field", "Value"],
                          ["Venue", venue],
                          ["Hotel/Home", hotel],
                          ["Mode", mode],
                          ["Google Directions", gDirections],
                          ["Apple Directions", aDirections],
                          ["Hotels Near Venue", nearbyHotels],
                        ];
                        const csv = rows
                          .map((r) =>
                            r
                              .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                              .join(",")
                          )
                          .join("\n");
                        const blob = new Blob([csv], {
                          type: "text/csv;charset=utf-8;",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "team-travel-plan.csv";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      disabled={!venue}
                    >
                      Export CSV
                    </CTAButton>
                  </Col>
                </Row>
              </div>
            </GlassCard>
          </Col>
        </Row>
      </div>

      <AddVenueModal
        open={addOpen}
        initialAddress={venue}
        onCancel={() => setAddOpen(false)}
        onSubmit={handleAddVenue}
      />
      <ShareDrawer
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        body={shareBody}
      />
    </div>
  );
}
