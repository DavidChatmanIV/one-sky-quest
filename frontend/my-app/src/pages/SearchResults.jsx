import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, Typography, Descriptions } from "antd";

const { Title, Text } = Typography;

function useQueryObject() {
  const { search } = useLocation();
  return React.useMemo(
    () => Object.fromEntries(new URLSearchParams(search)),
    [search]
  );
}

export default function SearchResults() {
  const { tab } = useParams();
  const q = useQueryObject();

  // Pretty display for boolean-like params
  const smartText =
    q.smart === undefined
      ? "-"
      : String(q.smart).toLowerCase() === "true"
      ? "On"
      : "Off";

  const bundleText =
    q.bundle === undefined
      ? "-"
      : String(q.bundle).toLowerCase() === "true"
      ? "Enabled"
      : "Disabled";

  return (
    <Card className="osq-card" style={{ margin: 24 }}>
      <Title level={3} style={{ marginTop: 0 }}>
        Search Results
      </Title>
      <Text type="secondary">
        Route: <code>/search/{tab}</code>
      </Text>

      <Descriptions bordered size="small" column={1} style={{ marginTop: 12 }}>
        <Descriptions.Item label="Tab">{tab}</Descriptions.Item>
        <Descriptions.Item label="Where">{q.where || "-"}</Descriptions.Item>
        <Descriptions.Item label="Leaving From">
          {q.leavingFrom || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Start">{q.start || "-"}</Descriptions.Item>
        <Descriptions.Item label="End">{q.end || "-"}</Descriptions.Item>
        <Descriptions.Item label="Adults">{q.adults || "-"}</Descriptions.Item>
        <Descriptions.Item label="Rooms/Groups">
          {q.rooms || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Smart Plan">{smartText}</Descriptions.Item>
        <Descriptions.Item label="Bundle">{bundleText}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
