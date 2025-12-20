import React from "react";
import { Typography } from "antd";
const { Text } = Typography;

export default function BoardingPassToast({
  name = "Explorer",
  routeFrom = "Home",
  routeTo = "Dashboard",
  subtitle = "Enjoy your XP boost for today’s check-in ✨",
}) {
  return (
    <div style={styles.wrap}>
      {/* Side perforation dots */}
      <div style={{ ...styles.perf, left: -6 }} aria-hidden />
      <div style={{ ...styles.perf, right: -6 }} aria-hidden />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.chip} aria-hidden />
          <Text style={styles.headerTitle}>Skyrio Boarding Pass</Text>
        </div>
        <Text style={styles.headerIcon} aria-hidden>
          ✈️
        </Text>
      </div>

      {/* Route */}
      <div style={styles.route}>
        <div>
          <Text style={styles.label}>FROM</Text>
          <div style={styles.value}>{routeFrom}</div>
        </div>

        <div style={styles.arrow} aria-hidden>
          →{/* keep clean; can swap for ✈️ later */}
        </div>

        <div style={{ textAlign: "right" }}>
          <Text style={styles.label}>TO</Text>
          <div style={styles.value}>{routeTo}</div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} aria-hidden />

      {/* Passenger */}
      <div style={styles.passenger}>
        <Text style={styles.label}>PASSENGER</Text>
        <div style={styles.value}>{name}</div>
        <div style={styles.sub}>{subtitle}</div>
      </div>

      {/* Barcode */}
      <div style={styles.barcode} aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.bar,
              height: [14, 22, 18, 26, 16][i % 5],
              opacity: 0.75,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    padding: 0,
    width: 320,

    border: "1px dashed rgba(255,255,255,.22)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.06))",
    backdropFilter: "blur(10px)",
    boxShadow: "0 14px 40px rgba(0,0,0,.28)",
  },

  // perforation column (small dots)
  perf: {
    position: "absolute",
    top: 14,
    bottom: 14,
    width: 12,
    borderRadius: 999,
    background:
      "radial-gradient(circle, rgba(255,255,255,.22) 2px, transparent 3px)",
    backgroundSize: "10px 12px",
    opacity: 0.65,
    pointerEvents: "none",
  },

  header: {
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px dashed rgba(255,255,255,.18)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  chip: {
    width: 26,
    height: 16,
    borderRadius: 6,
    background: "linear-gradient(90deg, #6f68ff, #c661ff, #ff8fcf)",
    boxShadow: "0 0 16px rgba(198,97,255,.35)",
  },
  headerTitle: {
    color: "rgba(255,255,255,.92)",
    fontWeight: 800,
    letterSpacing: 0.2,
  },
  headerIcon: {
    color: "rgba(255,255,255,.88)",
    fontWeight: 700,
  },

  route: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    gap: 10,
    alignItems: "center",
    padding: 12,
  },
  label: {
    color: "rgba(255,255,255,.62)",
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: 700,
  },
  value: {
    color: "rgba(255,255,255,.94)",
    fontWeight: 800,
    marginTop: 2,
  },
  arrow: {
    color: "rgba(255,255,255,.85)",
    fontSize: 18,
    lineHeight: "1",
    textAlign: "center",
  },

  divider: {
    height: 1,
    background: "rgba(255,255,255,.14)",
    margin: "0 12px",
  },

  passenger: {
    padding: "10px 12px 12px",
  },
  sub: {
    marginTop: 6,
    color: "rgba(255,255,255,.76)",
    fontSize: 12,
  },

  barcode: {
    display: "grid",
    gridTemplateColumns: "repeat(14, 1fr)",
    gap: 5,
    alignItems: "end",
    padding: "10px 12px 12px",
    borderTop: "1px dashed rgba(255,255,255,.16)",
  },
  bar: {
    width: "100%",
    borderRadius: 6,
    background: "rgba(255,255,255,.22)",
  },
};