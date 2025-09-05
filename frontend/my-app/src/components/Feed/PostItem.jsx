import React from "react";
import { Typography, Space, Avatar, Tag, Tooltip } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function PostItem({
  data,
  compact = false,
  edgeToEdgeMedia = false,
}) {
  const { user, time, location, text, media, trip, tags, xp, likes } = data;

  return (
    <article className={`qf-post qf-card ${compact ? "is-compact" : ""}`}>
      {/* header */}
      <div className="qf-post-head">
        <Avatar size={40} className="qf-avatar">
          {user.name?.[0]}
        </Avatar>
        <div className="qf-meta">
          <div className="qf-name-row">
            <span className="qf-name">{user.name}</span>
            {user.verified && <span className="qf-verified">✓</span>}
            <span className="qf-handle">{user.handle}</span>
            <span className="qf-dot">•</span>
            <span className="qf-time">{time}</span>
          </div>
          <div className="qf-location">{location}</div>
        </div>
      </div>

      {/* body */}
      <div className="qf-post-body">
        {text && <p className="qf-text">{text}</p>}

        {media?.url && (
          <div className={`qf-media ${edgeToEdgeMedia ? "edge" : ""}`}>
            <img src={media.url} alt="" loading="lazy" />
          </div>
        )}

        {trip && (
          <div className="qf-trippill">
            <div className="qf-triptitle">{trip.title}</div>
            <div className="qf-tripmeta">{trip.dates}</div>
            <div className="qf-tripchips">
              {typeof trip.priceFrom === "number" && (
                <span className="qf-chip">From ${trip.priceFrom}</span>
              )}
              {trip.perks?.map((p) => (
                <span key={p} className="qf-chip">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {!!tags?.length && (
          <div className="qf-tags">
            {tags.map((t) => (
              <Tag
                key={t}
                className="qf-tag"
                onClick={() => {}}
                style={{ cursor: "pointer" }}
              >
                #{t}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* actions */}
      <div className="qf-actions">
        <Space size={16}>
          <button className="qf-iconbtn">
            <HeartOutlined />
            <span>{likes ?? 0}</span>
          </button>
          <button className="qf-iconbtn">
            <MessageOutlined />
            <span>Reply</span>
          </button>
          <button className="qf-iconbtn">
            <RetweetOutlined />
            <span>Re-share</span>
          </button>
          <button className="qf-iconbtn">
            <ShareAltOutlined />
            <span>Share</span>
          </button>
        </Space>
        <span className="qf-xp">+{xp ?? 0} XP</span>
      </div>
    </article>
  );
}
