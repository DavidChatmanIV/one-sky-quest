import React, { useEffect, useState } from "react";
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
  { key: "deals", label: "Deals" },
];

export default function SkyStreamHeader({
  activeTab = "forYou",
  onTabChange,

  // if parent passes these, we’ll sync to them
  search,
  onSearchChange,

  xpToday = 0,
  onCompose,
  onPost,
}) {
  useAuth(); // reserved for future personalization

  // ✅ Local state so typing ALWAYS works
  const [localSearch, setLocalSearch] = useState(search ?? "");

  // ✅ If parent changes `search`, reflect it
  useEffect(() => {
    if (typeof search === "string") setLocalSearch(search);
  }, [search]);

  const handlePost = () => {
    if (onCompose) return onCompose();
    if (onPost) return onPost();
  };

  const handleSearchChange = (e) => {
    const next = e.target.value;
    setLocalSearch(next); // ✅ keeps typing responsive
    onSearchChange?.(next); // ✅ still informs parent if wired
  };

  return (
    <header className="skystream-hero">
      <div className="skystream-hero-inner">
        {/* TOP ROW */}
        <div className="skystream-top">
          <div className="skystream-titleblock">
            <h1 className="skystream-title">SkyStream</h1>

            <div className="skystream-subtitle">
              Live travel moments across Skyrio
            </div>

            {/* XP + PRO */}
            <div className="skystream-subbadges">
              <Tooltip title="XP earned today">
                <Badge count={xpToday} overflowCount={999}>
                  <Tag
                    className="skystream-pill"
                    icon={<ThunderboltOutlined />}
                  >
                    XP
                  </Tag>
                </Badge>
              </Tooltip>

              <Tooltip title="Premium perks">
                <Tag className="skystream-pill" icon={<StarOutlined />}>
                  Pro
                </Tag>
              </Tooltip>
            </div>
          </div>

          <Button
            className="skystream-post"
            icon={<PlusOutlined />}
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
            placeholder="Search SkyStream"
            value={localSearch}
            onChange={handleSearchChange}
            allowClear
          />
        </div>

        {/* TABS */}
        <nav className="skystream-tabs">
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