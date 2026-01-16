import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Typography, Empty, Spin } from "antd";
import ResultCard from "./ResultCard";

const { Title, Text } = Typography;

export default function BookingResults({
  results = [],
  loading = false,
  onSaveTrip, // optional callback (trip) => void or async
}) {
  const [localResults, setLocalResults] = useState(results);

  useEffect(() => {
    setLocalResults(results);
  }, [results]);

  const hasResults = useMemo(
    () => Array.isArray(localResults) && localResults.length > 0,
    [localResults]
  );

  async function handleSaveTrip(trip) {
    // You can plug real API here later.
    // This callback keeps BookingResults reusable.
    if (onSaveTrip) return onSaveTrip(trip);

    // default: local no-op
    return true;
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <Title level={3} style={{ margin: 0 }}>
          Search Results
        </Title>
        <Text type="secondary">
          Compare stays, save your favorites, and build your trip.
        </Text>
      </div>

      {loading ? (
        <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
          <Spin />
        </div>
      ) : !hasResults ? (
        <Empty description="No results yet. Try searching above." />
      ) : (
        <Row gutter={[16, 16]}>
          {localResults.map((trip) => (
            <Col key={trip.id || trip._id || trip.name} xs={24} md={12} xl={8}>
              <ResultCard trip={trip} onSaveTrip={handleSaveTrip} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}