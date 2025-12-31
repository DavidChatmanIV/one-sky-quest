import React, { useMemo } from "react";
import { Card, Typography, Space, Button, Divider, Tag, Alert } from "antd";
import { useNavigate } from "react-router-dom";

import "../styles/CheckoutPage.css";

const { Title, Text } = Typography;

function readSelected() {
  try {
    const raw = sessionStorage.getItem("skyrio_checkout_flight_v1");
    return raw ? JSON.parse(raw) : null;
  } catch (_err) {
    return null;
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const flight = useMemo(() => readSelected(), []);

  const totalLabel = useMemo(() => {
    if (!flight?.price) return "—";
    const currency = flight.price.currency || "USD";
    const total = Number(flight.price.total || 0).toFixed(2);
    return `${currency} ${total}`;
  }, [flight]);

  return (
    <div className="sk-checkoutPage">
      <div className="sk-checkoutWrap">
        <Space direction="vertical" style={{ width: "100%" }} size={14}>
          {/* Header */}
          <div className="sk-checkoutHeader">
            <div>
              <Title level={3} className="sk-checkoutTitle">
                Checkout
              </Title>
              <Text className="sk-checkoutSub">
                Soft launch flow: search → save → checkout
              </Text>
            </div>

            <Space>
              <Button className="sk-ghostBtn" onClick={() => navigate(-1)}>
                Back
              </Button>
            </Space>
          </div>

          {/* Soft-launch alert */}
          <Alert
            className="sk-checkoutAlert"
            type="info"
            showIcon
            message="Payment coming soon"
            description="For soft launch, we’re validating search + save + checkout flow. You’ll be able to pay when Skyrio payments go live."
          />

          {/* Main card */}
          <Card className="sk-checkoutCard" bordered={false}>
            <div className="sk-cardTop">
              <Title level={5} className="sk-cardTitle">
                Your flight
              </Title>
              <Text className="sk-cardHint">
                Review the details before checkout.
              </Text>
            </div>

            {!flight ? (
              <div className="sk-emptyState">
                <Text type="secondary">
                  No flight selected. Go back and pick a flight.
                </Text>

                <Space style={{ marginTop: 12 }}>
                  <Button
                    type="primary"
                    className="sk-cta"
                    onClick={() => navigate("/booking?tab=flights")}
                  >
                    Find flights
                  </Button>
                  <Button className="sk-ghostBtn" onClick={() => navigate(-1)}>
                    Back
                  </Button>
                </Space>
              </div>
            ) : (
              <>
                <div className="sk-flightSummary">
                  <div>
                    <Text className="sk-label">Route</Text>
                    <div className="sk-route">
                      {flight.origin} <span className="sk-arrow">→</span>{" "}
                      {flight.destination}
                    </div>
                    <Text className="sk-muted">
                      {flight.airline || "Airline"} ·{" "}
                      {flight.flightNumber || "—"} ·{" "}
                      {String(flight.cabin || "ECONOMY")}
                    </Text>

                    <div className="sk-metaRow">
                      <div className="sk-metaItem">
                        <Text className="sk-label">Depart</Text>
                        <div className="sk-metaValue">
                          {flight.departAt || "—"}
                        </div>
                      </div>
                      <div className="sk-metaItem">
                        <Text className="sk-label">Arrive</Text>
                        <div className="sk-metaValue">
                          {flight.arriveAt || "—"}
                        </div>
                      </div>
                      <div className="sk-metaItem">
                        <Text className="sk-label">Stops</Text>
                        <div className="sk-metaValue">
                          {flight.stops === 0
                            ? "Nonstop"
                            : `${flight.stops || 0} stop(s)`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sk-priceBox">
                    <Text className="sk-label">Total</Text>
                    <div className="sk-total">{totalLabel}</div>

                    <div className="sk-badges">
                      {(flight.badges || []).slice(0, 3).map((b) => (
                        <Tag key={b} className="sk-tag">
                          {b}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                <Divider className="sk-divider" />

                <Title level={5} className="sk-cardTitle">
                  Traveler details
                </Title>
                <Text className="sk-muted">
                  (Soft launch) This becomes a traveler form + seats + bags
                  later.
                </Text>

                <Divider className="sk-divider" />

                <div className="sk-checkoutActions">
                  <Button disabled className="sk-ghostBtn">
                    Pay now
                  </Button>
                  <Button type="primary" disabled className="sk-cta">
                    Confirm (disabled)
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* What happens next */}
          <Card className="sk-checkoutCard sk-nextCard" bordered={false}>
            <Title level={5} className="sk-cardTitle">
              What happens next?
            </Title>

            <ul className="sk-nextList">
              <li>We’ll activate payments after sandbox validation.</li>
              <li>
                You can still save trips and plan your itinerary right now.
              </li>
              <li>
                Next upgrade: baggage/fees breakdown + seats + traveler
                profiles.
              </li>
            </ul>
          </Card>
        </Space>
      </div>
    </div>
  );
}