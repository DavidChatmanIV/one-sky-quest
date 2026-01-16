import React, { useMemo } from "react";
import { Space, Typography, Tag } from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  StarFilled,
} from "@ant-design/icons";

const { Text } = Typography;

function fmtMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return null;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function TripMeta({
  destination, // "Tokyo"
  country, // "Japan"
  city, // optional
  datesLabel, // "Mar 12–18"
  nights, // 6
  travelers, // 2
  rating, // 4.7
  tags = [], // ["Last Minute", "Best Value"]
  price, // 1299
  currencyLabel, // optional override
}) {
  const money = useMemo(() => fmtMoney(price), [price]);

  return (
    <div className="sk-tripMeta">
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Text className="sk-tripMetaLine">
          <EnvironmentOutlined />{" "}
          <strong>
            {destination}
            {country ? `, ${country}` : ""}
          </strong>
          {city ? <Text type="secondary"> · {city}</Text> : null}
        </Text>

        {(datesLabel || nights || travelers) && (
          <Text type="secondary" className="sk-tripMetaLine">
            <CalendarOutlined /> {datesLabel ? datesLabel : null}
            {nights ? `${datesLabel ? " · " : ""}${nights} nights` : ""}
            {travelers ? ` · ${travelers} travelers` : ""}
          </Text>
        )}

        {(Number.isFinite(Number(rating)) || money) && (
          <Text type="secondary" className="sk-tripMetaLine">
            {Number.isFinite(Number(rating)) && (
              <>
                <StarFilled /> {Number(rating).toFixed(1)}
              </>
            )}
            {money ? (
              <>
                {Number.isFinite(Number(rating)) ? " · " : ""}
                <strong>{money}</strong>
                {currencyLabel ? ` ${currencyLabel}` : ""}{" "}
                <Text type="secondary">est.</Text>
              </>
            ) : null}
          </Text>
        )}

        {Array.isArray(tags) && tags.length > 0 && (
          <Space wrap size={[6, 6]}>
            {tags.slice(0, 4).map((t) => (
              <Tag key={t} className="sk-tripTag">
                {t}
              </Tag>
            ))}
          </Space>
        )}
      </Space>
    </div>
  );
}