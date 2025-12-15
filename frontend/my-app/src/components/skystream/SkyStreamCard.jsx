import React, { useMemo, useState } from "react";
import { Button } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  SmileOutlined,
  BookOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

function compactNumber(n = 0) {
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
}

export default function SkyStreamCard({
  post,
  onDMClick,
  onEmojiClick,
  onSaveClick,
  onShareClick,
  onXp,
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const tags = useMemo(() => post?.tags || [], [post]);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    if (next) onXp?.(2, "Liked a post");
  };

  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    onSaveClick?.(post, next);
    if (next) onXp?.(3, "Saved to Trip");
  };

  const initial = (
    post?.userInitial ||
    post?.username?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <div className="skystream-card">
      <div className="skystream-row">
        <div className="skystream-avatar">{initial}</div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 className="skystream-cardtitle">{post?.title || "Post"}</h3>
            <div className="skystream-xp">+{post?.xp ?? 0} XP</div>
          </div>

          <p className="skystream-cardbody">{post?.body || post?.content}</p>

          {!!tags.length && (
            <div className="skystream-chips">
              {tags.map((t) => (
                <span className="skystream-chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="skystream-actions">
            <div className="skystream-actions-left">
              <div className="meta">
                <Button
                  type="text"
                  icon={liked ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleLike}
                />
                {compactNumber(
                  (post?.meta?.likes ?? post?.likes ?? 0) + (liked ? 1 : 0)
                )}
              </div>

              <div className="meta">
                <Button
                  type="text"
                  icon={<MessageOutlined />}
                  onClick={onDMClick}
                />
                {compactNumber(post?.meta?.comments ?? post?.comments ?? 0)}
              </div>

              <Button
                type="text"
                icon={<SmileOutlined />}
                onClick={onEmojiClick}
              />

              <Button
                type="text"
                icon={<BookOutlined />}
                onClick={handleSave}
                style={{ opacity: saved ? 1 : 0.85 }}
              />
            </div>

            <Button
              type="text"
              icon={<ShareAltOutlined />}
              onClick={() => onShareClick?.(post)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}