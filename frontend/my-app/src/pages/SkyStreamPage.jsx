import React, { useMemo, useState } from "react";
import { Layout } from "antd";
import SkyStreamHeader from "../components/skystream/SkyStreamHeader";
import SkyStreamCard from "../components/skystream/SkyStreamCard";
import TrendingPanel from "../components/skystream/TrendingPanel";
import HotspotsPanel from "../components/skystream/HotspotsPanel";
import "../styles/skystream.css";

const { Content } = Layout;

export default function SkyStreamPage() {
  // ---------------------------
  // STATE (owned by the page)
  // ---------------------------
  const [activeTab, setActiveTab] = useState("forYou");
  const [search, setSearch] = useState("");

  // ---------------------------
  // MOCK POSTS (replace with API later)
  // ---------------------------
  const posts = useMemo(
    () => [
      {
        id: 1,
        userInitial: "D",
        title: "Just Landed",
        body: "Where are you off to? ✈️",
        tags: ["#welcome", "#announcements"],
        xp: 10,
        meta: { likes: 10, comments: 20, action: "Restart" },
      },
      {
        id: 2,
        userInitial: "U",
        title: "Budget-friendly",
        body: "Welcome to Skyrio! Drop your dream trip below",
        tags: ["#europe", "#announcements"],
        xp: 10,
        meta: { likes: 28, comments: 12, action: "Reshare" },
      },
      {
        id: 3,
        userInitial: "U",
        title: "Tokyo in fall hits different 🍁",
        body: "...any must-try ramen spots?",
        tags: ["#Japan", "#HiddenGem"],
        xp: 26,
        meta: { likes: 92, comments: 31, action: "Reply" },
      },
    ],
    []
  );

  // ---------------------------
  // SEARCH FILTER (simple & fast)
  // ---------------------------
  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;

    return posts.filter((p) => {
      const haystack = `${p.title} ${p.body} ${p.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, search]);

  // ---------------------------
  // POST ACTION (modal later)
  // ---------------------------
  const handlePost = () => {
    console.log("Post clicked");
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <Layout className="skystream-page">
      <Content className="skystream-content">
        <div className="skystream-shell">
          {/* HEADER */}
          <SkyStreamHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            search={search}
            onSearchChange={setSearch}
            xpToday={12}
            onPost={handlePost}
          />

          {/* GRID */}
          <div className="skystream-grid">
            {/* FEED */}
            <div className="skystream-feed">
              <div className="skystream-feed-stack">
                {filteredPosts.map((post) => (
                  <SkyStreamCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* ASIDE */}
            <aside className="skystream-aside">
              <TrendingPanel />
              <HotspotsPanel />
            </aside>
          </div>
        </div>
      </Content>
    </Layout>
  );
}