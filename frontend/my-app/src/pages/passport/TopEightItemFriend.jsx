import React from "react";
import { Avatar, Tag, Typography } from "antd";
import { CheckCircleFilled, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function TopEightItemFriend({
  name = "Explorer",
  username = "user",
  vibe = "",
  verified = false,
  mutuals,
  isDragging = false,
}) {
  return (
    <div
      className={`top-eight__item ${isDragging ? "isDragging" : ""}`}
      aria-label={`Top 8 friend: ${name}`}
    >
      {/* Optional pin label (only show when dragging, feels “premium”) */}
      {isDragging ? <div className="top-eight__pin">Reordering</div> : null}

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* Avatar ring (CSS handles the glow/ring) */}
        <div className="top-eight__avatar">
          <div className="top-eight__avatarInner">
            <Avatar size={44} icon={<UserOutlined />} />
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          {/* Name + verified */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Text className="top-eight__name" ellipsis>
              {name}
            </Text>

            {verified ? (
              <CheckCircleFilled
                style={{ color: "rgba(167, 139, 250, 0.95)" }}
              />
            ) : null}
          </div>

          {/* Handle */}
          <Text className="top-eight__handle" ellipsis>
            @{username}
          </Text>

          {/* Chips */}
          <div
            style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}
          >
            {vibe ? (
              <Tag className="top-eight__chip" style={{ marginInlineEnd: 0 }}>
                {vibe}
              </Tag>
            ) : null}

            {typeof mutuals === "number" ? (
              <Tag className="top-eight__chip" style={{ marginInlineEnd: 0 }}>
                {mutuals}+ mutuals
              </Tag>
            ) : null}

            {verified ? (
              <Tag className="top-eight__chip" style={{ marginInlineEnd: 0 }}>
                Verified
              </Tag>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}