import React from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Input,
  Button,
  Space,
  Tag,
  Progress,
} from "antd";
import {
  SearchOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  TagsOutlined,
  ReloadOutlined,
  StarOutlined,
} from "@ant-design/icons";

import "../styles/skyhub.css";

const { Title, Text } = Typography;

const trendTags = ["#Japan", "#Kyoto", "#HiddenGem", "#Weekend", "#deals"];

const hotspots = [
  { label: "Kyoto", pct: 42 },
  { label: "Santorini", pct: 31 },
  { label: "Puerto Rico", pct: 28 },
  { label: "Seoul", pct: 18 },
];

export default function SkyHubPage() {
  return (
    <div className="ss-page">
      <div className="ss-overlay" />

      <div className="ss-container">
        <div className="ss-hero">
          <Title className="ss-title" level={1}>
            SkyHub
          </Title>
          <Text className="ss-subtitle">Where travel stories live</Text>
        </div>

        <Row gutter={[18, 18]} align="start">
          {/* LEFT */}
          <Col xs={24} lg={6}>
            <Card bordered={false} className="ss-card ss-side">
              <div className="ss-sideItem active">🏠 Home</div>
              <div className="ss-sideItem">
                🔥 Explore <span className="ss-badge">5</span>
              </div>
              <div className="ss-sideItem">🔔 Alerts</div>
              <div className="ss-sideItem">💬 DMs</div>

              <div className="ss-divider" />

              <div className="ss-sideItem">🧭 Feeds</div>
              <div className="ss-sideItem">👥 Circles</div>
              <div className="ss-sideItem">💾 Saved</div>
              <div className="ss-sideItem">🛂 Passport</div>

              <div className="ss-divider" />

              <div className="ss-sideGroupTitle">Feeds</div>
              <div className="ss-pill active">For You (Passport)</div>
              <div className="ss-pill">Near Me</div>
            </Card>
          </Col>

          {/* CENTER */}
          <Col xs={24} lg={12}>
            <Card bordered={false} className="ss-card ss-topbar">
              <div className="ss-topbarRow">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search SkyHub"
                  className="ss-input"
                />
                <Button className="ss-pillBtn">For You (Passport) ▾</Button>
                <Button className="ss-iconBtn" icon={<StarOutlined />} />
              </div>
            </Card>

            <Card bordered={false} className="ss-card ss-composer">
              <div className="ss-composeRow">
                <Input
                  placeholder="Share your latest SkyStory..."
                  className="ss-input"
                />
                <Button className="ss-cta">Post SkyStory</Button>
              </div>

              <Space wrap size={10} style={{ marginTop: 10 }}>
                <Button className="ss-chip" icon={<PictureOutlined />}>
                  Photo
                </Button>
                <Button className="ss-chip" icon={<VideoCameraOutlined />}>
                  Video
                </Button>
                <Button className="ss-chip" icon={<EnvironmentOutlined />}>
                  Location
                </Button>
                <Button className="ss-chip" icon={<TagsOutlined />}>
                  Travel Tags
                </Button>
                <Button className="ss-chip">Save</Button>
              </Space>
            </Card>

            <div className="ss-feedTabs">
              <Button className="ss-tab active">For You</Button>
              <Button className="ss-tab">
                Following <span className="ss-dot">0</span>
              </Button>
              <Button className="ss-tab">Deals</Button>
              <Button className="ss-tab">News</Button>

              <Button className="ss-reset" icon={<ReloadOutlined />}>
                Reset Filters
              </Button>
            </div>

            <Card bordered={false} className="ss-card ss-notice">
              <Text>
                SkyHub is in demo mode (API not available). Showing sample
                SkyStories.
              </Text>
            </Card>

            <Card bordered={false} className="ss-card ss-post">
              <div className="ss-postHeader">
                <div className="ss-avatar" />
                <div style={{ flex: 1 }}>
                  <div className="ss-nameRow">
                    <Text className="ss-name">Peter Chen</Text>
                    <Text className="ss-handle">@petertravels</Text>
                    <Tag className="ss-verify">verified</Tag>
                  </div>
                  <Text className="ss-role">Skyrio Traveler</Text>
                </div>
                <Button className="ss-iconBtn">⋯</Button>
              </div>

              <Text className="ss-postText">
                SkyStory: Hidden gem! 🌸 Discover this secret trail in Kyoto away
                from the crowd! Peaceful and beautiful.
              </Text>

              <div className="ss-tags">
                <Tag className="ss-tag">#Kyoto</Tag>
                <Tag className="ss-tag">#HiddenGem</Tag>
              </div>

              <div className="ss-photoMock" />
            </Card>
          </Col>

          {/* RIGHT */}
          <Col xs={24} lg={6}>
            <Card bordered={false} className="ss-card ss-right">
              <Title level={5} className="ss-rightTitle">
                Trending
              </Title>

              <div className="ss-tagCloud">
                {trendTags.map((t) => (
                  <span key={t} className="ss-trendTag">
                    {t}
                  </span>
                ))}
              </div>
            </Card>

            <Card
              bordered={false}
              className="ss-card ss-right"
              style={{ marginTop: 18 }}
            >
              <Title level={5} className="ss-rightTitle">
                Today's hotspots
              </Title>

              {hotspots.map((h) => (
                <div key={h.label} className="ss-hotspotPill">
                  <div className="ss-hotspotTop">
                    <span>
                      {h.label}
                      {h.pct}%
                    </span>
                  </div>
                  <Progress percent={h.pct} showInfo={false} />
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}