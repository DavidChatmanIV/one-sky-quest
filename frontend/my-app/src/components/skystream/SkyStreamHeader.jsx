import React, { useMemo } from "react";
import { Button, Input, Badge, Tooltip, Tag } from "antd";
import {
  ThunderboltOutlined,
  StarOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

const TAB_OPTIONS = [
  { key: "forYou", label: "For You" },
  { key: "following", label: "Following" },
  { key: "trending", label: "Trending" },
  { key: "news", label: "News" },
];

export default function SkyStreamHeader({
  activeTab = "forYou",
  onTabChange,

  search = "",
  onSearchChange,

  xpToday = 0,
  onCompose,
  onPost, // fallback
}) {
  const auth = useAuth();

  const displayName = useMemo(() => {
    const fromAuth =
      auth?.user?.name ||
      auth?.user?.username ||
      (auth?.user?.email ? auth.user.email.split("@")[0] : "");

    if (fromAuth) return fromAuth;

    try {
      const raw = localStorage.getItem("user");
      if (!raw) return "Traveler";
      const u = JSON.parse(raw);
      return (
        u?.name ||
        u?.username ||
        (u?.email ? u.email.split("@")[0] : "Traveler")
      );
    } catch {
      return "Traveler";
    }
  }, [auth?.user]);

  const handlePost = () => {
    if (typeof onCompose === "function") return onCompose();
    if (typeof onPost === "function") return onPost();
  };

  return (
    <header className="skystream-hero" role="banner">
      <div className="skystream-hero-inner">
        {/* TOP ROW */}
        <div className="skystream-top">
          <div className="skystream-titleblock">
            {/* Title row + pills inline (mock feel) */}
            <div className="skystream-titleline">
              <h1 className="skystream-title">
                SkyStream{" "}
                <span className="skystream-for">• For {displayName}</span>
              </h1>

              <div className="skystream-actions-left" aria-label="XP and Pro">
                <Tooltip title="XP Today">
                  <Badge count={xpToday} color="gold" overflowCount={999}>
                    <Tag
                      className="skystream-pill"
                      icon={<ThunderboltOutlined />}
                    >
                      XP
                    </Tag>
                  </Badge>
                </Tooltip>

                <Tooltip title="Premium Perks">
                  <Tag className="skystream-pill" icon={<StarOutlined />}>
                    Pro
                  </Tag>
                </Tooltip>
              </div>
            </div>

            <div className="skystream-subtitle">
              Live travel moments across Skyrio
            </div>
          </div>

          <Button
            className="skystream-post"
            icon={<PlusOutlined />}
            size="large"
            onClick={handlePost}
          >
            Post
          </Button>
        </div>

        {/* SEARCH */}
        <div className="skystream-searchrow">
          <Input
            className="skystream-search"
            prefix={<SearchOutlined />}
            placeholder="Search SkyStream..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            allowClear
          />
        </div>

        {/* TABS */}
        <nav className="skystream-tabs" aria-label="SkyStream tabs">
          {TAB_OPTIONS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onTabChange?.(t.key)}
              className={`skystream-tab ${
                activeTab === t.key ? "is-active" : ""
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}