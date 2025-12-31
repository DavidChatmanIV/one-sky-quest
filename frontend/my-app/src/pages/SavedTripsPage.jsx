import React from "react";
import { Typography, Space, Button, Card, Empty, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useSavedFlights } from "../hooks/useSavedFlights";
import FlightCard from "../components/flights/FlightCard";

const { Title, Text } = Typography;

export default function SavedTripsPage() {
  const navigate = useNavigate();
  const { saved, savedCount, removeFlight, clearSaved } = useSavedFlights();

  return (
    <div style={{ padding: 20 }}>
      <Space direction="vertical" style={{ width: "100%" }} size={14}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Saved Trips
            </Title>
            <Text type="secondary">
              Your intentional list — keep options here, compare later, checkout
              when ready.
            </Text>
          </div>

          <Space>
            <Button onClick={() => navigate("/booking")}>Find more</Button>
            <Button danger disabled={!savedCount} onClick={clearSaved}>
              Clear all
            </Button>
          </Space>
        </Space>

        <Card style={{ borderRadius: 18 }} bodyStyle={{ padding: 16 }}>
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <div>
              <Text type="secondary">Saved items</Text>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{savedCount}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Text type="secondary">Tip</Text>
              <div style={{ fontWeight: 700 }}>
                Save 2–3 options, then checkout the best one.
              </div>
            </div>
          </Space>
        </Card>

        <Divider style={{ opacity: 0.25 }} />

        {!savedCount ? (
          <Empty description="No saved flights yet. Go to Booking and tap Save ❤️." />
        ) : (
          <Space direction="vertical" style={{ width: "100%" }} size={12}>
            {saved.map((f) => (
              <FlightCard
                key={f.id}
                flight={f}
                saved={true}
                onUnsave={removeFlight}
                onCheckout={(flight) => {
                  sessionStorage.setItem(
                    "skyrio_checkout_flight_v1",
                    JSON.stringify(flight)
                  );
                  navigate("/checkout");
                }}
              />
            ))}
          </Space>
        )}
      </Space>
    </div>
  );
}
