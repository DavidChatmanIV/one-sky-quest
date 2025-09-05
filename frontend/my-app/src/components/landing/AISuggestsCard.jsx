import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function AISuggestsCard() {
  const navigate = useNavigate();
  return (
    <Card className="osq-card" styles={{ body: { padding: 16 } }}>
      <h3 style={{ marginBottom: 8 }}>AI Suggests</h3>
      <p style={{ marginBottom: 12 }}>
        A weekend getaway to Bangkok might be perfect for you! ✈️
      </p>
      <div
        className="ai-cta-row"
        style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <Button
          className="btn-orange"
          onClick={() => navigate("/booking?aiPlan=bangkok")}
        >
          See AI plan
        </Button>
        <Button
          className="btn-orange"
          onClick={() => navigate("/booking?tab=deals")}
        >
          View all deals
        </Button>
        <Button className="btn-orange" onClick={() => navigate("/profile")}>
          Create / Edit Profile
        </Button>
      </div>
    </Card>
  );
}
