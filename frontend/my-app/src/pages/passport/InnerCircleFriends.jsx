import React, { useMemo } from "react";
import { Card, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function InnerCircleFriends({
  title = "Your Inner Circle",
  subtitle = "Top 8 Friends",
  items = [],
}) {
  const filled = useMemo(() => {
    const base = Array.isArray(items) ? items.slice(0, 8) : [];
    while (base.length < 8) base.push({ locked: true });
    return base;
  }, [items]);

  return (
    <Card bordered={false} className="pp-ic-surface">
      <div className="pp-ic-head">
        <div>
          <Title level={5} className="pp-ic-title">
            {title}
          </Title>
          <Text className="pp-ic-sub">{subtitle}</Text>
        </div>

        <Text className="pp-ic-xp">0 XP</Text>
      </div>

      {/* ✅ show 3 big cards like the mock */}
      <div className="pp-ic-grid">
        {filled.slice(0, 3).map((it, idx) =>
          it.locked ? (
            <div key={idx} className="pp-ic-card pp-ic-locked">
              <LockOutlined />
            </div>
          ) : (
            <div
              key={it.id || it.userId || idx}
              className="pp-ic-card pp-ic-photo"
              style={{
                backgroundImage: `url(${
                  it.coverUrl || it.avatarUrl || fallbackCover(idx)
                })`,
              }}
            >
              <div className="pp-ic-overlay">
                <div className="pp-ic-name">{it.name}</div>
                <div className="pp-ic-pill">Inner Circle</div>
              </div>
            </div>
          )
        )}
      </div>

      <Text type="secondary" className="pp-ic-foot">
        Order is locked.
      </Text>
    </Card>
  );
}

function fallbackCover(i) {
  const imgs = [
    "https://images.unsplash.com/photo-1520975693411-6b6c66d29257?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520976086842-7b4a6df9a9b8?q=80&w=1000&auto=format&fit=crop",
  ];
  return imgs[i % imgs.length];
}