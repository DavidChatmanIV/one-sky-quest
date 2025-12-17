import React from "react";
import { Card, Typography, Tag, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ListingCard({ listing, status, onAdd }) {
  const { title, subtitle, image, badges = [] } = listing || {};

  return (
    <Card
      className="listing-card"
      variant="elevated" 
      bodyStyle={{ padding: 16 }}
      cover={
        image ? (
          <img
            src={image}
            alt={title}
            style={{ height: 220, objectFit: "cover" }}
          />
        ) : null
      }
    >
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Title level={3} style={{ margin: 0 }}>
          {title}
        </Title>
        {subtitle && (
          <Text type="secondary" style={{ display: "block" }}>
            {subtitle}
          </Text>
        )}

        <Space size={[8, 8]} wrap style={{ marginTop: 6 }}>
          {badges.map((b) => (
            <Tag key={b}>{b}</Tag>
          ))}
          {status && (
            <Tag color={status.type === "within" ? "green" : "red"}>
              {status.label}
            </Tag>
          )}
        </Space>

        <div style={{ marginTop: 8 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Add to plan
          </Button>
        </div>
      </Space>
    </Card>
  );
}
