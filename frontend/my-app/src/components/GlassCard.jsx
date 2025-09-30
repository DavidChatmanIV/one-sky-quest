import { Card } from "antd";

export default function GlassCard({
  title,
  extra,
  children,
  style,
  bodyStyle,
}) {
  return (
    <Card
      size="small"
      title={<span style={{ color: "#f4f6fb" }}>{title}</span>}
      extra={extra}
      bordered={false}
      style={{
        background: "rgba(255,255,255,.07)",
        border: "1px solid rgba(255,255,255,.10)",
        boxShadow: "0 10px 22px rgba(0,0,0,.22)",
        borderRadius: 14,
        color: "#f4f6fb",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
      headStyle={{
        borderBottom: "1px solid rgba(255,255,255,.08)",
        padding: "10px 14px",
      }}
      bodyStyle={{
        padding: 14,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        ...bodyStyle,
      }}
    >
      {children}
    </Card>
  );
}
