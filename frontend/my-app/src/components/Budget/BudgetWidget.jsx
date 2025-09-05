import React, { useMemo, useState } from "react";
import {
  Card,
  Typography,
  Segmented,
  Progress,
  Button,
  Space,
  List,
  Tag,
  Modal,
  Form,
  InputNumber,
  Radio,
  Tooltip,
} from "antd";
import {
  CheckCircleFilled,
  DeleteOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const fmt = (n) =>
  (Number.isFinite(n) ? n : 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function BudgetWidget({
  mode,
  setMode,
  soloBudget,
  setSoloBudget,
  group,
  setGroup,
  planned,
  plannedTotal,
  budgetTotal,
  onRemovePlan,
}) {
  const [open, setOpen] = useState(false);

  const percent = useMemo(() => {
    if (!budgetTotal || budgetTotal <= 0) return 0;
    return Math.min(100, Math.round((plannedTotal / budgetTotal) * 100));
  }, [plannedTotal, budgetTotal]);

  const delta = (budgetTotal || 0) - (plannedTotal || 0);
  const within = delta >= 0;

  return (
    <Card className="budget-card" bordered={false} bodyStyle={{ padding: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        {/* Header */}
        <div
          className="budget-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Budget
          </Title>
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setOpen(true)}
          >
            Adjust
          </Button>
        </div>

        {/* Solo / Group */}
        <Segmented
          block
          value={mode}
          onChange={setMode}
          options={[
            { label: "Solo", value: "solo" },
            { label: "Group", value: "group" },
          ]}
        />

        {/* Status + progress */}
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircleFilled
              style={{ color: within ? "#16a34a" : "#ef4444" }}
            />
            <Text>
              {within
                ? `You're still ${fmt(Math.abs(delta))} under`
                : `You're ${fmt(Math.abs(delta))} over`}
              {mode === "solo" ? " your budget" : " the group budget"}
            </Text>
            <Tooltip title="Add items from the left to see this fill up. Prices marked 'pp' are per person.">
              <InfoCircleOutlined style={{ opacity: 0.7 }} />
            </Tooltip>
          </div>

          <Progress percent={percent} showInfo={false} />
          <Text type="secondary">
            {fmt(Math.max(0, Math.round(plannedTotal)))} of{" "}
            {fmt(Math.round(budgetTotal || 0))}
          </Text>
        </Space>

        {/* Planned items */}
        <List
          size="small"
          header={<Text strong>Planned items</Text>}
          dataSource={planned}
          locale={{ emptyText: "Nothing added yet" }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="remove"
                  size="small"
                  type="text"
                  onClick={() => onRemovePlan?.(item.id)}
                  icon={<DeleteOutlined />}
                />,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <>
                    {fmt(item.price)}{" "}
                    {item.priceUnit === "perPerson" ? "pp" : "total"}
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Space>

      {/* Adjust modal */}
      <AdjustBudgetModal
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        setMode={setMode}
        soloBudget={soloBudget}
        setSoloBudget={setSoloBudget}
        group={group}
        setGroup={setGroup}
      />
    </Card>
  );
}

/** Adjust Budget Modal */
function AdjustBudgetModal({
  open,
  onClose,
  mode,
  setMode,
  soloBudget,
  setSoloBudget,
  group,
  setGroup,
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      title="Adjust Budget"
      okText="Save"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          mode,
          soloBudget,
          groupSize: group.size,
          groupKind: group.kind, // "perPerson" | "total"
          perPerson: group.budgetPerPerson,
          totalBudget: group.totalBudget,
        }}
        onFinish={(v) => {
          setMode(v.mode);
          setSoloBudget(v.soloBudget ?? 0);
          setGroup({
            size: v.groupSize ?? 1,
            kind: v.groupKind,
            budgetPerPerson: v.perPerson ?? 0,
            totalBudget: v.totalBudget ?? 0,
          });
          onClose();
        }}
      >
        <Form.Item label="Mode" name="mode">
          <Segmented
            options={[
              { label: "Solo", value: "solo" },
              { label: "Group", value: "group" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Solo budget (USD)" name="soloBudget">
          <InputNumber min={0} step={50} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Group size" name="groupSize">
          <InputNumber min={1} max={50} step={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Group budget type" name="groupKind">
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            style={{ display: "flex", gap: 8 }}
          >
            <Radio.Button value="perPerson">Per person</Radio.Button>
            <Radio.Button value="total">Total</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Show both budget inputs (clear which one is used via note). Keeps it simple & avoids Form watch logic */}
        <Form.Item label="Budget per person (USD)" name="perPerson">
          <InputNumber min={0} step={50} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Total group budget (USD)" name="totalBudget">
          <InputNumber min={0} step={100} style={{ width: "100%" }} />
        </Form.Item>

        <Tag style={{ marginTop: 8 }}>
          Tip: If your package pricing is per person, choose “Per person” for
          the smoothest math.
        </Tag>
      </Form>
    </Modal>
  );
}
