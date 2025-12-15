import React, { useMemo, useState } from "react";
import { Layout } from "antd";
import SkyStreamHeader from "../components/skystream/SkyStreamHeader";
import SkyStreamCard from "../components/skystream/SkyStreamCard";
import TrendingPanel from "../components/skystream/TrendingPanel";
import HotspotsPanel from "../components/skystream/HotspotsPanel";
import "../styles/skystream.css";

const { Content } = Layout;

export default function SkyStreamPage() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [search, setSearch] = useState("");

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const hay = `${p.title} ${p.body} ${p.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, search]);

  const handlePost = () => {
    // later: open modal
    console.log("Post clicked");
  };

  return (
    <Layout className="skystream-page">
      <Content className="skystream-content">
        <div className="skystream-shell">
          <SkyStreamHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            search={search}
            setSearch={setSearch}
            onPost={handlePost}
          />

          <div className="skystream-grid">
            <div className="skystream-feed">
              <div className="skystream-feed-stack">
                {filtered.map((p) => (
                  <SkyStreamCard key={p.id} post={p} />
                ))}
              </div>
            </div>

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