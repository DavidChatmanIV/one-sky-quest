import React from "react";
import { Card, Typography, Button, Input, Tooltip, message } from "antd";
import { CopyOutlined, GiftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ReferralBox = ({ user }) => {
  const referralLink = `${window.location.origin}/invite/${user.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    message.success("Referral link copied!");
  };

  return (
    <Card className="rounded-xl shadow-md p-4">
      <Title level={4}>🎁 Invite Friends & Earn XP</Title>
      <Text>Your Referral Code:</Text>
      <Input
        value={user.referralCode}
        readOnly
        className="my-2 font-mono"
        addonAfter={
          <Tooltip title="Copy invite link">
            <Button icon={<CopyOutlined />} onClick={copyToClipboard} />
          </Tooltip>
        }
      />
      <Button
        type="primary"
        icon={<GiftOutlined />}
        onClick={copyToClipboard}
        className="mt-2"
      >
        Copy Invite Link
      </Button>
    </Card>
  );
};

export default ReferralBox;
