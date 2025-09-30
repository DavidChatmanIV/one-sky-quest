import React from "react";
import { Card, Typography, Tag, Button, Space } from "antd";
import {
  PlusOutlined,
  SendOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function FlightCard({ item, status, onAdd }) {
  const { title, subtitle, image, badges = [], price } = item || {};
  return (
    <Card
      variant="elevated"
      bodyStyle={{ padding: 16 }}
      cover={
        image ? (
          <img
            src={image}
            alt={title}
            style={{ height: 180, objectFit: "cover" }}
          />
        ) : null
      }
    >
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Title level={3} style={{ margin: 0 }}>
          <SendOutlined /> {title}
        </Title>
        {subtitle && (
          <Text type="secondary">
            <FieldTimeOutlined /> {subtitle}
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
          {price != null && (
            <Tag className="pkg-chip pkg-chip--xp">${price} pp</Tag>
          )}
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{ marginTop: 8 }}
        >
          Add to plan
        </Button>
      </Space>
    </Card>
  );
}
