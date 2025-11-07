import { Card, Progress, Typography } from "antd";

export default function XPLevelCard({ level = 3, xp = 420, next = 600 }) {
  const pct = Math.min(100, Math.round((xp / next) * 100));

  return (
    <Card
      variant="outlined" 
      hoverable
      styles={{
        body: { padding: 16 },
      }}
    >
      <Typography.Title level={4} style={{ marginBottom: 8 }}>
        Level {level}
      </Typography.Title>
      <Progress percent={pct} />
      <Typography.Text type="secondary">
        {xp} / {next} XP
      </Typography.Text>
    </Card>
  );
}
