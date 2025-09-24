import React, { useEffect, useState } from "react";
import { Typography, Space, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

import PageLayout from "../components/PageLayout";
import ErrorBoundary from "../components/ErrorBoundary";

import QuestFeedHeader from "../components/Feed/QuestFeedHeader";
import FeedComposer from "../components/Feed/FeedComposer";
import PostList from "../components/Feed/PostList";
import TrendingSidebar from "../components/Feed/TrendingSidebar";

import "../styles/FeedPage.css";
import "../styles/questfeed.css";

const { Title, Paragraph } = Typography;

export default function FeedPage({ initialPosts = [] }) {
  const [profile, setProfile] = useState(null);

  // Fetch user profile (name, etc.)
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) setProfile(data);
      } catch (err) {
      
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Page title
  useEffect(() => {
    const prev = document.title;
    document.title = "One Sky Quest • Quest Feed";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <PageLayout fullBleed={false} maxWidth={1180} className="feed-page">
      {/* Static page header (title + Home) */}
      <header style={{ marginBottom: 8 }}>
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            Quest Feed
          </Title>
          <Link to="/" aria-label="Back to Home">
            <Button icon={<HomeOutlined />} type="primary">
              Home
            </Button>
          </Link>
        </Space>
        <Paragraph style={{ color: "rgba(255,255,255,0.75)", marginBottom: 0 }}>
          See travel updates, tips, and wins from the community.
        </Paragraph>
      </header>

      {/* Grid: Feed + Sidebar */}
      <div className="feed-wrap">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16} lg={17}>
            {/* ErrorBoundary protects the whole feed column */}
            <ErrorBoundary>
              <QuestFeedHeader
                userName={profile?.name || "Traveler"}
                subtitle="Your personalized travel feed is here."
              />
              <FeedComposer />
              <PostList initialPosts={initialPosts} />
            </ErrorBoundary>
          </Col>

          <Col xs={24} md={8} lg={7}>
            <TrendingSidebar />
          </Col>
        </Row>
      </div>
    </PageLayout>
  );
}
