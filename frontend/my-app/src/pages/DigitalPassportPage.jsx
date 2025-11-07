import React, { useMemo, useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Avatar,
  Tag,
  Button,
  QRCode,
  Segmented,
  Progress,
  Tooltip,
  Modal,
  Input,
  message,
  Empty,
} from "antd";
import {
  UserOutlined,
  GiftOutlined,
  CrownOutlined,
  CopyOutlined,
  ShareAltOutlined,
  QrcodeOutlined,
  CameraOutlined,
  PlayCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import "../styles/profile-passport.css";

const { Title, Text } = Typography;

/* ----------------- Mock Data ----------------- */
const usePassportData = () =>
  useMemo(
    () => ({
      user: {
        name: "David",
        username: "@onesky.david",
        tagline: "An avid traveler exploring new horizons",
        status: "New Explorer",
        level: 1,
        home: "New Jersey, USA",
        memberSince: "2024",
        passportNo: "OSQ-4J2M-6K9",
        tier: "Free",
      },
      stats: {
        countriesVisited: 12,
        favoriteStyle: "Beach + City",
        nextBadgeTarget: "Globetrotter",
      },
      badges: [
        { id: "early", label: "Early Explorer", icon: <GiftOutlined /> },
        { id: "planner", label: "Itinerary Pro", icon: "🧭" },
        { id: "foodie", label: "Foodie Traveler", icon: "🍝" },
      ],
      stamps: [
        { id: 1, title: "Tokyo", code: "JP", date: "2025-07-12", icon: "🗼" },
        { id: 2, title: "Lisbon", code: "PT", date: "2025-06-02", icon: "⛵" },
        { id: 3, title: "Miami", code: "US", date: "2025-05-18", icon: "🏖️" },
        {
          id: 4,
          title: "Reykjavík",
          code: "IS",
          date: "2024-12-22",
          icon: "❄️",
        },
      ],
      visas: [
        {
          id: "jp",
          country: "Japan",
          type: "eVisa",
          status: "Approved",
          expiry: "2026-07-30",
        },
        {
          id: "pt",
          country: "Portugal",
          type: "Schengen",
          status: "Approved",
          expiry: "2026-05-14",
        },
      ],
      trips: [
        {
          id: "TKO",
          title: "Tokyo Summer",
          range: "Jul 9–15, 2025",
          status: "Booked",
          notes: ["Shibuya stay", "Team Travel: 4"],
        },
        {
          id: "LIS",
          title: "Lisbon Weekend",
          range: "Jun 1–4, 2025",
          status: "Completed",
          notes: ["Alfama tour", "Under budget +XP"],
        },
      ],
      top8: {
        places: [
          "Paris",
          "Rome",
          "New York",
          "Bali",
          "London",
          "Tokyo",
          "Sydney",
          "Rio",
        ],
        friends: [
          { id: "em", name: "Emily", xp: 420, badges: ["🍝"] },
          { id: "jo", name: "Jordan", xp: 380, badges: ["🌍"] },
          { id: "li", name: "Liam", xp: 260, badges: ["🏝️"] },
          { id: "av", name: "Ava", xp: 300, badges: ["🗺️"] },
        ],
      },
      referral: { code: "OSQ-DAVID-2025", reward: "+250 miles" },
      miles: { current: 1200, nextLevel: 5000 },
    }),
    []
  );

/* ----------------- Reusable ----------------- */
function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <Title level={4} className="!m-0">
        {children}
      </Title>
      {right}
    </div>
  );
}

function SoftCard({ children, className = "", style }) {
  return (
    <Card
      className={`osq-surface ${className}`}
      style={{
        borderRadius: 16,
        boxShadow: "var(--shadow)",
        background: "var(--surface)",
        color: "var(--text)",
        ...style,
      }}
      variant="borderless"
      styles={{ body: { padding: 16 } }}
    >
      {children}
    </Card>
  );
}

/* ----------------- Travel Pass Header (merged, AntD v5-safe) ----------------- */
function TravelPassHeader({ data, top8Mode, onTop8Mode, onShowQR }) {
  const { user, stats, top8, miles } = data;
  const pct = Math.min(
    100,
    Math.round((miles.current / miles.nextLevel) * 100)
  );
  const friends = top8.friends || [];
  const showFriends = top8Mode === "Top 8 Friends" && friends.length > 0;

  const profileUrl = `https://onesky.quest/u/${
    (user.username || "").replace(/^@/, "").trim() || "david"
  }`;

  const copyProfile = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      message.success("Profile link copied!");
    } catch {
      message.error("Could not copy link");
    }
  };

  return (
    <Card
      variant="borderless"
      className="tp-card"
      styles={{ body: { padding: 16 } }}
    >
      <div className="tp-top">
        <Text className="tp-title">DIGITAL PASSPORT</Text>
        <Tag color="gold">{user.tier || "Free"} Tier</Tag>
      </div>

      <div className="tp-id">
        <Avatar
          size={84}
          icon={<UserOutlined />}
          className="tp-avatar"
          alt={`${user.name} avatar`}
        />
        <div className="tp-identity">
          <Title
            level={2}
            className="!m-0 tp-name"
            style={{ color: "var(--text)" }}
          >
            {user.name}
          </Title>
          <div className="tp-tagline" style={{ color: "var(--text)" }}>
            {user.tagline}
          </div>
          <div className="tp-chips">
            <Tag color="blue">Level {user.level}</Tag>
            <Tag color="geekblue">{user.status}</Tag>
            <Tag color="purple">{user.username}</Tag>
          </div>
        </div>

        <Space>
          <Tooltip title="Copy profile link">
            <Button icon={<ShareAltOutlined />} onClick={copyProfile} />
          </Tooltip>
          <Tooltip title="Show QR">
            <Button icon={<QrcodeOutlined />} onClick={onShowQR} />
          </Tooltip>
        </Space>
      </div>

      <div className="tp-actions">
        <Button type="primary" icon={<SendOutlined />}>
          Share Memory
        </Button>
        <Space size={8} aria-label="Quick actions">
          <Button shape="circle" aria-label="Music">
            <PlayCircleOutlined />
          </Button>
          <Button shape="circle" aria-label="Photo">
            <CameraOutlined />
          </Button>
          <Button shape="circle" aria-label="Trip">
            ✈️
          </Button>
        </Space>
        <div className="tp-miles">
          <Text className="muted">Miles</Text>
          <div className="tp-mile-row">
            <Text strong style={{ color: "var(--text)" }}>
              {miles.current.toLocaleString()} /{" "}
              {miles.nextLevel.toLocaleString()}
            </Text>
          </div>
          <Progress
            percent={pct}
            size="small"
            showInfo={false}
            aria-label={`Miles progress ${pct}%`}
          />
        </div>
      </div>

      <div className="tp-divider">MEMORIES</div>
      <div className="tp-memo" style={{ color: "var(--text)" }}>
        <Text style={{ color: "var(--text)" }}>
          ✈️ Visited {stats.countriesVisited} countries • Loves{" "}
          {stats.favoriteStyle}. Next badge: {stats.nextBadgeTarget}.
        </Text>
        <Tag> Music</Tag>
      </div>

      <div className="tp-divider">
        <Space align="center">
          TOP 8
          <Segmented
            size="small"
            value={top8Mode}
            onChange={onTop8Mode}
            options={["Top 8 Places", "Top 8 Friends"]}
          />
        </Space>
      </div>

      {/* Top 8 */}
      {!showFriends ? (
        <Row gutter={[12, 12]}>
          {(top8.places || []).slice(0, 8).map((city) => (
            <Col xs={12} sm={8} md={6} key={city}>
              <div
                className="tp-tile"
                role="img"
                aria-label={`Top place ${city}`}
              >
                <div className="tp-tile-art" />
                <div className="tp-tile-label">{city.toUpperCase()}</div>
              </div>
            </Col>
          ))}
          {(!top8.places || top8.places.length === 0) && (
            <Col span={24}>
              <Empty description="Add your favorite places" />
            </Col>
          )}
        </Row>
      ) : (
        <Row gutter={[12, 12]}>
          {(friends || []).slice(0, 8).map((f) => (
            <Col xs={12} sm={8} md={6} key={f.id}>
              <div className="top8-card friend" aria-label={`Friend ${f.name}`}>
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="stamp-frame"
                />
                <div className="top8-title">{f.name}</div>
                <div className="top8-sub">
                  XP {f.xp} · {(f.badges || []).join(" ")}
                </div>
              </div>
            </Col>
          ))}
          {(!friends || friends.length === 0) && (
            <Col span={24}>
              <Empty description="Add friends to your Top 8" />
            </Col>
          )}
        </Row>
      )}

      <div className="tp-promo">
        Share your promo: <span className="line" />{" "}
        <span className="xp-bonus">XP BONUS</span>
      </div>
    </Card>
  );
}

/* ----------------- Stamps ----------------- */
function Stamp({ title, code, date, icon }) {
  return (
    <div className="stamp" role="group" aria-label={`Stamp ${title}`}>
      <div className="stamp__ring" />
      <div className="stamp__content">
        <div className="stamp__title">
          {title} <span className="stamp__icon">{icon}</span>
        </div>
        <div className="stamp__meta">
          {code} · {new Date(date).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
function StampsGrid({ stamps }) {
  return (
    <SoftCard>
      <SectionTitle right={<Button size="small">Add Stamp</Button>}>
        Passport Stamps
      </SectionTitle>
      {stamps?.length ? (
        <Row gutter={[12, 12]}>
          {stamps.map((s) => (
            <Col xs={12} sm={8} md={6} key={s.id}>
              <Stamp {...s} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No stamps yet" />
      )}
    </SoftCard>
  );
}

/* ----------------- Visas ----------------- */
function VisaCard({ country, type, status, expiry }) {
  return (
    <div className="visa" role="group" aria-label={`Visa ${country}`}>
      <div className="visa__row">
        <div className="visa__title">{country}</div>
        <Tag color={status === "Approved" ? "green" : "orange"}>{status}</Tag>
      </div>
      <div className="visa__type">{type}</div>
      <div className="visa__exp">
        Expires: {new Date(expiry).toLocaleDateString()}
      </div>
    </div>
  );
}
function VisasList({ visas }) {
  return (
    <SoftCard>
      <SectionTitle right={<Button size="small">Add Visa</Button>}>
        Visas
      </SectionTitle>
      {visas?.length ? (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {visas.map((v) => (
            <VisaCard key={v.id} {...v} />
          ))}
        </Space>
      ) : (
        <Empty description="No visas added" />
      )}
    </SoftCard>
  );
}

/* ----------------- Trips ----------------- */
function TripCard({ title, range, status, notes }) {
  return (
    <div className="trip" role="group" aria-label={`Trip ${title}`}>
      <div className="trip__row">
        <div className="trip__title">{title}</div>
        <Tag color={status === "Booked" ? "blue" : "default"}>{status}</Tag>
      </div>
      <div className="trip__range">{range}</div>
      <div className="trip__notes">
        {(notes || []).map((n, i) => (
          <Tag key={i}>{n}</Tag>
        ))}
      </div>
    </div>
  );
}
function TripsPanel({ trips }) {
  return (
    <SoftCard>
      <SectionTitle right={<Button size="small">Add Trip</Button>}>
        Trips
      </SectionTitle>
      {trips?.length ? (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {trips.map((t) => (
            <TripCard key={t.id} {...t} />
          ))}
        </Space>
      ) : (
        <Empty description="No trips yet" />
      )}
    </SoftCard>
  );
}

/* ----------------- Invite & Earn (merged version) ----------------- */
function ReferralBox({ referral }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral.code);
      setCopied(true);
      message.success(`Copied! Share to earn ${referral.reward}`);
    } catch {
      message.error("Could not copy code");
    }
  };

  const onApply = () => message.success("Referral code applied!");

  return (
    <SoftCard className="invite-card">
      <SectionTitle
        right={
          <Tag color="gold">
            <CrownOutlined /> Rewards
          </Tag>
        }
      >
        Invite & Earn
      </SectionTitle>

      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Text>Share your code to earn miles.</Text>

        {/* Copy existing code */}
        <Input.Group compact>
          <Input
            style={{ width: "70%" }}
            value={referral.code}
            readOnly
            aria-label="Referral code"
          />
          <Button type="primary" icon={<CopyOutlined />} onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </Input.Group>

        {/* Or apply a code you received */}
        <div style={{ marginTop: 12 }}>
          <Space.Compact block>
            <Input placeholder="Enter referral code" allowClear />
            <Button type="primary" onClick={onApply}>
              Apply
            </Button>
          </Space.Compact>
        </div>

        <Text className="reward">Reward: {referral.reward}</Text>
      </Space>
    </SoftCard>
  );
}

/* ----------------- Root Page ----------------- */
export default function DigitalPassportPage() {
  const data = usePassportData();

  // Sync tab with ?tab= in the URL
  const [params, setParams] = useSearchParams();
  const tabFromUrl = (params.get("tab") || "Overview").toString();
  const [tab, setTab] = useState(tabFromUrl);
  const [qrOpen, setQrOpen] = useState(false);
  const [top8Mode, setTop8Mode] = useState("Top 8 Places");

  useEffect(() => {
    const allowed = ["Overview", "Stamps", "Visas", "Trips", "Badges"];
    if (!allowed.includes(tabFromUrl)) {
      params.set("tab", "Overview");
      setParams(params, { replace: true });
      setTab("Overview");
    } else {
      setTab(tabFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

  const onTabChange = (val) => {
    setTab(val);
    const next = new URLSearchParams(params);
    next.set("tab", val);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    const prev = document.title;
    document.title = `One Sky Quest • Digital Passport`;
    return () => (document.title = prev);
  }, []);

  return (
    <PageLayout fullBleed={false} maxWidth={1180}>
      <div className="passport-wrap">
        {/* Travel Pass header */}
        <TravelPassHeader
          data={data}
          top8Mode={top8Mode}
          onTop8Mode={setTop8Mode}
          onShowQR={() => setQrOpen(true)}
        />

        {/* Tabs row */}
        <div className="flex items-center justify-between mb-3 mt-2">
          <Segmented
            value={tab}
            onChange={onTabChange}
            options={["Overview", "Stamps", "Visas", "Trips", "Badges"]}
          />
        </div>

        {/* Overview — Trips directly under Stamps */}
        {tab === "Overview" && (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={14}>
              <StampsGrid stamps={data.stamps} />
              <div style={{ height: 12 }} />
              <TripsPanel trips={data.trips} />
            </Col>
            <Col xs={24} md={10}>
              <VisasList visas={data.visas} />
              <div style={{ height: 12 }} />
              <ReferralBox referral={data.referral} />
            </Col>
          </Row>
        )}

        {/* Dedicated tabs */}
        {tab === "Stamps" && (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <StampsGrid stamps={data.stamps} />
            </Col>
          </Row>
        )}
        {tab === "Visas" && (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <VisasList visas={data.visas} />
            </Col>
          </Row>
        )}
        {tab === "Trips" && (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <TripsPanel trips={data.trips} />
            </Col>
          </Row>
        )}
        {tab === "Badges" && (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <SoftCard>
                <SectionTitle>Visa Stickers</SectionTitle>
                <div className="visa-stickers-grid">
                  {(data.badges || []).map((b) => (
                    <div
                      key={b.id}
                      className="visa-sticker small"
                      role="img"
                      aria-label={b.label}
                    >
                      <div className="visa-sticker__head">
                        <span className="visa-sticker__flag">{b.icon}</span>
                        <span className="visa-sticker__title">{b.label}</span>
                      </div>
                      <div className="visa-sticker__meta">Achievement</div>
                    </div>
                  ))}
                  {(!data.badges || data.badges.length === 0) && (
                    <Empty description="No badges yet" />
                  )}
                </div>
              </SoftCard>
            </Col>
          </Row>
        )}

        {/* QR Modal */}
        <Modal
          title="Share your Digital Passport"
          open={qrOpen}
          onCancel={() => setQrOpen(false)}
          footer={null}
        >
          <div
            className="flex flex-col items-center gap-2"
            style={{ display: "grid", placeItems: "center", gap: 8 }}
          >
            <QRCode
              value={`https://onesky.quest/u/${(
                data.user?.username || "david"
              ).replace(/^@/, "")}`}
              size={192}
            />
            <Text type="secondary">Scan to view profile</Text>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}
