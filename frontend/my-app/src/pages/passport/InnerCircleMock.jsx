import React, { useMemo } from "react";
import { Card, Typography, Tag } from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function InnerCircleMock({ items = [] }) {
  const padded = useMemo(() => {
    const base = Array.isArray(items) ? items.slice(0, 8) : [];
    while (base.length < 8) base.push({ locked: true });
    return base;
  }, [items]);

  return (
    <Card className="osq-surface ic-wrap" bordered={false}>
      <div className="ic-head">
        <div>
          <Title level={5} style={{ margin: 0 }}>
            Your Inner Circle
          </Title>
          <Text type="secondary">Top 8 Friends</Text>
        </div>

        <div className="ic-meta">
          <Text type="secondary">{items?.length || 0} / 8</Text>
        </div>
      </div>

      <div className="ic-grid">
        {padded.map((it, idx) =>
          it.locked ? (
            <div className="ic-slot ic-locked" key={`locked-${idx}`}>
              <LockOutlined />
              <span>Locked</span>
            </div>
          ) : (
            <div
              className="ic-slot ic-card"
              key={it._id || it.userId || idx}
              style={{
                backgroundImage: `url(${it.imageUrl || defaultImage(idx)})`,
              }}
            >
              <div className="ic-overlay">
                <div className="ic-title">
                  {it.city || it.name || "Explorer"}
                </div>
                <Tag className="ic-tag">Passport Pick</Tag>
              </div>
            </div>
          )
        )}
      </div>

      <Text type="secondary" className="ic-foot">
        Order is locked.
      </Text>
    </Card>
  );
}

function defaultImage(i) {
  const imgs = [
    "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=800&auto=format&fit=crop", // Tokyo
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", // Paris
    "https://images.unsplash.com/photo-1528701800489-20be4a1f9b3c?q=80&w=800&auto=format&fit=crop", // Dubai
    "https://images.unsplash.com/photo-1507878866276-a947ef722fee?q=80&w=800&auto=format&fit=crop", // fallback
  ];
  return imgs[i % imgs.length];
}