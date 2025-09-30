import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Typography,
  Segmented,
  Progress,
  Modal,
  message,
  Tooltip,
  Badge,
  Space,
  Input,
} from "antd";
import {
  GiftOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  LockOutlined,
  StarOutlined,
  SearchOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../styles/SkyVault.css";

const { Title, Text, Paragraph } = Typography;

/* ---------- Small label component for Segmented ---------- */
function SegmentLabel({ icon, text, count }) {
  return (
    <div className="sv-tab">
      <span className="sv-tab-ic">{icon}</span>
      <span className="sv-tab-t">{text}</span>
      <span className="sv-tab-count">{count}</span>
    </div>
  );
}

/* ---------- Mock data (replace with real API later) ---------- */
const ALL_ITEMS = [
  // Boosts
  {
    id: "boost-1",
    kind: "Boost",
    name: "Weekend XP Boost (+2x)",
    desc: "Earn double XP on bookings made Fri–Sun.",
    cost: 250,
    levelReq: 1,
    icon: <ThunderboltOutlined />,
    tag: "Popular",
  },
  {
    id: "boost-2",
    kind: "Boost",
    name: "Review Streak (+1.5x)",
    desc: "Leave 3 verified reviews this month for extra XP.",
    cost: 180,
    levelReq: 1,
    icon: <ThunderboltOutlined />,
  },

  // Badges
  {
    id: "badge-1",
    kind: "Badge",
    name: "Globetrotter",
    desc: "Unlocked at XP Level 5 or buy to fast-track.",
    cost: 400,
    levelReq: 3,
    icon: <TrophyOutlined />,
    tag: "New",
  },
  {
    id: "badge-2",
    kind: "Badge",
    name: "Hidden Gem Hunter",
    desc: "Discover 3 non-touristy stays.",
    cost: 320,
    levelReq: 2,
    icon: <TrophyOutlined />,
  },

  // Perks
  {
    id: "perk-1",
    kind: "Perk",
    name: "Priority Support (30 days)",
    desc: "Skip the line for account & booking help.",
    cost: 500,
    levelReq: 2,
    icon: <GiftOutlined />,
    tag: "Limited",
  },
  {
    id: "perk-2",
    kind: "Perk",
    name: "Late Checkout Voucher",
    desc: "Eligible stays only • Subject to availability.",
    cost: 220,
    levelReq: 1,
    icon: <GiftOutlined />,
  },
];

export default function SkyVault() {
  // Replace with real profile fetch later
  const [xp, setXp] = useState(860);
  const [level] = useState(5);
  const nextLevelPct = 80;

  // UI state
  const [segment, setSegment] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  // Filtered list
  const filtered = useMemo(() => {
    const byKind =
      segment === "All"
        ? ALL_ITEMS
        : ALL_ITEMS.filter((i) => i.kind === segment);
    const byQuery = query.trim()
      ? byKind.filter(
          (i) =>
            i.name.toLowerCase().includes(query.toLowerCase()) ||
            i.desc.toLowerCase().includes(query.toLowerCase())
        )
      : byKind;
    return byQuery;
  }, [segment, query]);

  // Counts for tabs
  const counts = useMemo(
    () => ({
      All: ALL_ITEMS.length,
      Boost: ALL_ITEMS.filter((i) => i.kind === "Boost").length,
      Badge: ALL_ITEMS.filter((i) => i.kind === "Badge").length,
      Perk: ALL_ITEMS.filter((i) => i.kind === "Perk").length,
    }),
    []
  );

  // Options for Segmented (icon + text + count)
  const tabOptions = useMemo(
    () => [
      {
        value: "All",
        label: (
          <SegmentLabel icon={<StarOutlined />} text="All" count={counts.All} />
        ),
      },
      {
        value: "Boost",
        label: (
          <SegmentLabel
            icon={<ThunderboltOutlined />}
            text="Boost"
            count={counts.Boost}
          />
        ),
      },
      {
        value: "Badge",
        label: (
          <SegmentLabel
            icon={<TrophyOutlined />}
            text="Badge"
            count={counts.Badge}
          />
        ),
      },
      {
        value: "Perk",
        label: (
          <SegmentLabel
            icon={<GiftOutlined />}
            text="Perk"
            count={counts.Perk}
          />
        ),
      },
    ],
    [counts]
  );

  const onRedeem = (item) => {
    if (level < item.levelReq) {
      return message.warning(
        `Requires Level ${item.levelReq}. You’re Level ${level}.`
      );
    }
    if (xp < item.cost) {
      return message.error("Not enough XP yet. Keep exploring ✈️");
    }
    Modal.confirm({
      title: `Redeem ${item.name}?`,
      centered: true,
      content: (
        <div className="sv-confirm">
          <Paragraph type="secondary">
            This will spend <b>{item.cost} XP</b>. You’ll receive{" "}
            <b>{item.kind}</b>: <i>{item.name}</i>.
          </Paragraph>
        </div>
      ),
      okText: "Redeem",
      okButtonProps: { className: "sv-cta" },
      onOk: () => {
        setXp((x) => x - item.cost);
        message.success(`Redeemed: ${item.name}`);
      },
    });
  };

  return (
    <div className="sv-wrap">
      {/* Sticky header strip (minimal scroll, quick actions) */}
      <div className="sv-header glass">
        <Row gutter={[16, 16]} align="middle" wrap={false}>
          {/* Home button */}
          <Col flex="none">
            <Button
              className="sv-home-btn"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </Col>

          <Col flex="none">
            <div className="sv-level">
              <Badge count={`Lv ${level}`} color="#ffa94d">
                <div className="sv-ring">
                  <Progress
                    type="circle"
                    percent={nextLevelPct}
                    format={() => ""}
                    size={56}
                  />
                </div>
              </Badge>
            </div>
          </Col>

          <Col flex="auto">
            <Title level={3} className="sv-title">
              Sky Vault
            </Title>
            <Text className="sv-sub">
              Trade XP for boosts, badges, and perks.
            </Text>
          </Col>

          <Col flex="none">
            <div className="sv-balance">
              <Text className="muted">Balance</Text>
              <div className="sv-xp">
                <StarOutlined />
                <b>{xp.toLocaleString()} XP</b>
              </div>
            </div>
          </Col>
        </Row>

        {/* Controls */}
        <Row gutter={[12, 12]} className="sv-controls">
          <Col xs={24} md="auto">
            {/* wrapper class enables the CSS you added */}
            <div className={`sv-segment seg--${segment.toLowerCase()}`}>
              <Segmented
                options={tabOptions}
                value={segment}
                onChange={(v) => setSegment(v)}
                block
                aria-label="Filter Sky Vault items by category"
              />
            </div>

            {/* Live helper for screen-readers + quick glance */}
            <div className="sv-active-label" aria-live="polite">
              Showing <b>{segment}</b> • {filtered.length} item
              {filtered.length !== 1 ? "s" : ""}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search boosts, badges, perks…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sv-search"
            />
          </Col>

          <Col xs={24} md="auto">
            <Tooltip title="Coming soon: filter by level, price, owned">
              <Button disabled>More filters</Button>
            </Tooltip>
          </Col>
        </Row>
      </div>

      {/* Content grid (3 columns on desktop) */}
      <div className="sv-grid">
        <Row gutter={[16, 16]}>
          {filtered.map((item) => {
            const locked = level < item.levelReq;
            const afford = xp >= item.cost;
            return (
              <Col key={item.id} xs={24} sm={12} lg={8}>
                <Card
                  className="sv-card glass"
                  hoverable
                  onClick={() => setSelected(item)}
                >
                  <Space size={12} align="start">
                    <div className={`sv-icon ${item.kind.toLowerCase()}`}>
                      {item.icon}
                    </div>
                    <div className="sv-body">
                      <Space size={8} align="center" wrap>
                        <Tag className={`sv-kind ${item.kind.toLowerCase()}`}>
                          {item.kind}
                        </Tag>
                        {item.tag && <Tag color="gold">{item.tag}</Tag>}
                        <Tag className="sv-req">Lvl {item.levelReq}+</Tag>
                      </Space>
                      <Title level={5} className="sv-name">
                        {item.name}
                      </Title>
                      <Paragraph className="sv-desc">{item.desc}</Paragraph>
                      <div className="sv-footer">
                        <div className="sv-cost">
                          <StarOutlined />
                          {item.cost} XP
                        </div>
                        <div className="sv-cta-row">
                          <Button
                            className="sv-cta"
                            type="primary"
                            disabled={locked || !afford}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRedeem(item);
                            }}
                          >
                            {locked ? (
                              <>
                                <LockOutlined /> Locked
                              </>
                            ) : afford ? (
                              "Redeem"
                            ) : (
                              "Not enough XP"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        onOk={() => {
          if (selected) onRedeem(selected);
          setSelected(null);
        }}
        okButtonProps={{
          className: "sv-cta",
          disabled: selected
            ? level < selected.levelReq || xp < selected.cost
            : true,
        }}
        centered
        title={selected?.name || "Details"}
      >
        {selected && (
          <div className="sv-modal">
            <Space size={8} align="center" wrap>
              <Tag className={`sv-kind ${selected.kind.toLowerCase()}`}>
                {selected.kind}
              </Tag>
              <Tag className="sv-req">Lvl {selected.levelReq}+</Tag>
            </Space>
            <Paragraph style={{ marginTop: 8 }}>{selected.desc}</Paragraph>
            <div className="sv-modal-cost">
              <StarOutlined /> <b>{selected.cost} XP</b>
            </div>
            <Text type="secondary">
              Tip: XP refills by booking, reviewing trips, and inviting friends.
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
}
