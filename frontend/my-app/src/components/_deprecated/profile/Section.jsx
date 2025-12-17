import React from "react";
import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Section({
  className,
  title,
  subtitle,
  extra,
  children,
  style,
  ...rest
}) {
  return (
    <Card
      className={`osq-surface ${className || ""}`}
      data-surface={rest["data-surface"] ?? "2"}
      styles={{ body: { padding: 12 } }}
      style={{ borderRadius: 12, marginBottom: 16, ...(style || {}) }}
      {...rest}
    >
      {(title || subtitle || extra) && (
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <Title level={4} style={{ margin: 0 }}>
                {title}
              </Title>
            )}
            {subtitle && (
              <Paragraph type="secondary" style={{ margin: 0 }}>
                {subtitle}
              </Paragraph>
            )}
          </div>
          {extra}
        </div>
      )}
      {children}
    </Card>
  );
}
