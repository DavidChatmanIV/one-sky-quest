import React from "react";
import { Typography, List } from "antd";

const { Title } = Typography;

const policies = [
  "📄 Terms of Service",
  "🔐 Privacy Policy",
  "❌ Cancellation Policy",
  "📰 Newsroom & Updates",
  "📬 Contact & Support",
];

const InfoPolicies = () => {
  return (
    <section style={{ background: "#f0f2f5", padding: "60px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          📚 Info & Policies
        </Title>
        <List
          dataSource={policies}
          renderItem={(item) => (
            <List.Item style={{ justifyContent: "center", fontSize: 16 }}>
              {item}
            </List.Item>
          )}
        />
      </div>
    </section>
  );
};

export default InfoPolicies;
