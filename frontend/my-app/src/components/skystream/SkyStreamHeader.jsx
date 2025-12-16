import React from "react";
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
  search = "",
  onSearchChange,
  xpToday = 0,
  onCompose,
  onPost,
}) {
  useAuth(); // keep hook for future personalization

  const handlePost = () => {
    if (onCompose) return onCompose();
    if (onPost) return onPost();
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
            <div className="skystream-actions-left">
              <Tooltip title="XP Today">
                <Badge count={xpToday} color="gold">
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
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
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