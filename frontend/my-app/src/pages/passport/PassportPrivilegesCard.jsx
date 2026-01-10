import React, { useMemo, useState } from "react";
import { Button, Drawer, Typography, Space, Tag } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PassportUnlocksDrawer() {
  const [open, setOpen] = useState(false);

  const unlocks = useMemo(
    () => [
      {
        icon: "✅",
        label: "Verify your identity once to earn a trusted badge",
      },
      { icon: "🔒", label: "Unlock Passport-only profile controls & privacy" },
      {
        icon: "🛂",
        label: "Access verified-only features & gated communities",
      },
      { icon: "⚡", label: "Get priority access to new drops & beta features" },
      { icon: "🎁", label: "Claim renewal rewards and exclusive perk bundles" },
      {
        icon: "🌍",
        label: "Travel with higher trust for hosts, groups, and meetups",
      },
    ],
    []
  );

  return (
    <>
      {/* ✅ Small inline trigger (fits the flow, doesn’t dominate the page) */}
      <div className="pp-unlocksInline">
        <Tag className="pp-activeTag" icon={<CheckCircleFilled />}>
          Passport Active
        </Tag>

        <Button
          type="link"
          className="pp-unlocksLink"
          onClick={() => setOpen(true)}
        >
          What does Passport unlock?
        </Button>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        width={420}
        title={
          <Title level={5} style={{ margin: 0 }}>
            Passport Unlocks
          </Title>
        }
      >
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          {unlocks.map((u) => (
            <div className="pp-pill pp-perkTile" key={u.label}>
              <span className="pp-pillIcon">{u.icon}</span>
              <span className="pp-pillText">{u.label}</span>
            </div>
          ))}

          <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
            Your Passport upgrades your account into a verified identity layer
            and unlocks trusted access now—while keeping your profile ready for
            future tier upgrades as Skyrio evolves.
          </Text>
        </Space>
      </Drawer>
    </>
  );
}