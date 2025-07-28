import React from "react";
import { Layout, Typography, Divider } from "antd";
import MembershipPlans from "../components/MembershipPlans";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const MembershipPage = () => {
  return (
    <Layout className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-indigo-100 p-4">
      <Content className="max-w-6xl mx-auto">
        <Title level={2} className="text-center text-indigo-700">
          🛡️ One Sky Quest Membership
        </Title>
        <Paragraph className="text-center mb-4 text-gray-700">
          Unlock premium perks, boost your XP, and get exclusive travel tools by
          upgrading your membership.
        </Paragraph>

        <Divider />
        <MembershipPlans />
      </Content>
    </Layout>
  );
};

export default MembershipPage;
