import { Drawer, Divider, Typography } from "antd";
const { Text } = Typography;

export default function ShareDrawer({ open, onClose, body }) {
  return (
    <Drawer
      title={<span style={{ color: "#f4f6fb" }}>Share Team Travel Plan</span>}
      placement="right"
      width={420}
      open={open}
      onClose={onClose}
      styles={{
        body: {
          background: "linear-gradient(180deg,#130e24,#2a1b45,#3a2430)",
          color: "#f4f6fb",
        },
      }}
    >
      <Text style={{ color: "#c9cbe3" }}>
        Share this in your team chat or post on QuestFeed. Links open in your
        maps app/browser.
      </Text>
      <Divider style={{ borderColor: "rgba(255,255,255,.10)" }} />
      <pre
        style={{
          whiteSpace: "pre-wrap",
          color: "#f4f6fb",
          background: "rgba(255,255,255,.06)",
          padding: 12,
          borderRadius: 12,
        }}
      >
        {body}
      </pre>
    </Drawer>
  );
}
