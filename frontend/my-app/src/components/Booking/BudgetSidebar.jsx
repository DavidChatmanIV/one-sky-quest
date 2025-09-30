import React, { useState } from "react";
import {
  Card,
  Segmented,
  Typography,
  Space,
  Progress,
  InputNumber,
  Row,
  Col,
  Button,
  Divider,
  Tag,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { useBudget } from "../../context/useBudget";
import AdjustBudgetModal from "./AdjustBudgetModal";

const { Title, Text } = Typography;

export default function BudgetSidebar() {
  const {
    mode,
    setMode,
    travelers,
    setTravelers,
    personalCap,
    setPersonalCap,
    groupCap,
    setGroupCap,
    currentTotal,
    effectiveCap,
  } = useBudget();

  const [open, setOpen] = useState(false);

  const percent =
    effectiveCap > 0 ? Math.min((currentTotal / effectiveCap) * 100, 100) : 0;

  return (
    <>
      <Card
        className="rounded-2xl bg-[#1e2039] text-white sticky top-12"
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" size={14} className="w-full">
          <div className="flex items-center justify-between">
            <Title level={4} className="!text-white !mb-0">
              Budget
            </Title>
            <PieChartOutlined className="text-white/70" />
          </div>

          <Segmented
            value={mode}
            onChange={(v) => setMode(v)}
            options={[
              {
                label: (
                  <span className="flex items-center gap-1">
                    <UserOutlined /> Personal
                  </span>
                ),
                value: "personal",
              },
              {
                label: (
                  <span className="flex items-center gap-1">
                    <TeamOutlined /> Group
                  </span>
                ),
                value: "group",
              },
            ]}
            className="!bg-[#101226] !text-white"
          />

          {mode === "personal" ? (
            <div className="space-y-3">
              <LabelLine label="Your budget">
                <CurrencyInput value={personalCap} onChange={setPersonalCap} />
              </LabelLine>
            </div>
          ) : (
            <div className="space-y-3">
              <Row gutter={8}>
                <Col span={14}>
                  <LabelLine label="Total group budget">
                    <CurrencyInput value={groupCap} onChange={setGroupCap} />
                  </LabelLine>
                </Col>
                <Col span={10}>
                  <LabelLine label="Travelers">
                    <InputNumber
                      min={1}
                      max={16}
                      value={travelers}
                      onChange={(v) => setTravelers(v || 1)}
                      className="w-full !bg-[#101226] !text-white"
                    />
                  </LabelLine>
                </Col>
              </Row>
            </div>
          )}

          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6aa8ff"
            trailColor="#2a2c4b"
          />
          <Text className="!text-white/80">
            {currency(currentTotal)} of {currency(effectiveCap || 0)}
          </Text>

          <Tag color={currentTotal <= (effectiveCap || 0) ? "green" : "red"}>
            {currentTotal <= (effectiveCap || 0)
              ? "You're under budget"
              : "Over budget"}
          </Tag>

          <Button type="primary" block onClick={() => setOpen(true)}>
            Adjust Budget
          </Button>
        </Space>
      </Card>

      <AdjustBudgetModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function CurrencyInput({ value, onChange }) {
  return (
    <InputNumber
      min={0}
      value={value}
      onChange={(v) => onChange(v || 0)}
      parser={(v) => Number(String(v).replace(/[^0-9]/g, ""))}
      prefix={<DollarOutlined />}
      className="w-full !bg-[#101226] !text-white"
    />
  );
}

function LabelLine({ label, children }) {
  return (
    <div>
      <Text className="!text-white/80">{label}</Text>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const currency = (n) => `$${Number(n ?? 0).toLocaleString()}`;
