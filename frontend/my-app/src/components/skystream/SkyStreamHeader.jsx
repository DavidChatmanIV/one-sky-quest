import React, { useMemo } from "react";
import { Row, Col, Typography, Space, Button, Input, Segmented, Tag } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SkyStreamHeader({
  brand = "Skyrio",
  activeTab = "forYou",
  onTabChange,
  tabOptions = [],
  search = "",
  onSearchChange,
  xpToday = 0,
  onCompose,
}) {
  const options = useMemo(() => {
    // Supports either [{key,label}] or segmented-ready [{value,label}]
    if (!tabOptions?.length) return [];
    if (tabOptions[0]?.value) return tabOptions;
    return tabOptions.map((t) => ({ value: t.key, label: t.label }));
  }, [tabOptions]);

  return (
    <div className="sk-header glass">
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={14}>
          <Title level={2} style={{ margin: 0 }}>
            SkyStream
          </Title>
          <Text className="sk-muted">Live travel moments across {brand}</Text>
        </Col>

        <Col xs={24} md={10} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Space wrap>
            <Tag icon={<ThunderboltOutlined />}>XP Today: {xpToday}</Tag>
            <Button
              type="primary"
              className="btn-orange"
              icon={<PlusOutlined />}
              onClick={onCompose}
            >
              Post
            </Button>
          </Space>
        </Col>

        {/* Tabs */}
        <Col xs={24} md={14}>
          <Segmented
            options={options}
            value={activeTab}
            onChange={(v) => onTabChange?.(v)}
            block
          />
        </Col>

        {/* ✅ SINGLE SEARCH INPUT (only one) */}
        <Col xs={24} md={10}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search SkyStream..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </Col>
      </Row>
    </div>
  );
}