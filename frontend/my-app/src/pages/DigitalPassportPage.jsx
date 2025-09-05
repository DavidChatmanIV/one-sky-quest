import React, { useMemo, useState } from "react";
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
} from "antd";
import {
  UserOutlined,
  GiftOutlined,
  CrownOutlined,
  CopyOutlined,
} from "@ant-design/icons";
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
      styles={{ body: { padding: 16 } }}
    >
      {children}
    </Card>
  );
}

/* ----------------- Travel Pass Header ----------------- */
function TravelPassHeader({ data, top8Mode, onTop8Mode, onShowQR }) {
  const { user, stats, top8, miles } = data;
  const pct = Math.min(
    100,
    Math.round((miles.current / miles.nextLevel) * 100)
  );
  const friends = top8.friends || [];
  const showFriends = top8Mode === "Top 8 Friends" && friends.length > 0;

  return (
    <Card bordered={false} className="tp-card">
      <div className="tp-top">
        <Text className="tp-title">TRAVEL PASS</Text>
        <span className="tp-camera" aria-hidden>
          📷
        </span>
      </div>

      <div className="tp-id">
        <Avatar size={84} icon={<UserOutlined />} className="tp-avatar" />
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
        <Tooltip title="Share Digital Passport">
          <Button type="default" onClick={onShowQR}>
            QR
          </Button>
        </Tooltip>
      </div>

      <div className="tp-actions">
        <Button type="primary">Share Memory</Button>
        <Space size={8}>
          <Button shape="circle" aria-label="Music">
            🎵
          </Button>
          <Button shape="circle" aria-label="Photo">
            📷
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
          <Progress percent={pct} size="small" showInfo={false} />
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

      {!showFriends ? (
        <Row gutter={[12, 12]}>
          {top8.places.slice(0, 8).map((city) => (
            <Col xs={12} sm={8} md={6} key={city}>
              <div className="tp-tile">
                <div className="tp-tile-art" />
                <div className="tp-tile-label">{city.toUpperCase()}</div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[12, 12]}>
          {friends.slice(0, 8).map((f) => (
            <Col xs={12} sm={8} md={6} key={f.id}>
              <div className="top8-card friend">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="stamp-frame"
                />
                <div className="top8-title">{f.name}</div>
                <div className="top8-sub">
                  XP {f.xp} · {f.badges.join(" ")}
                </div>
              </div>
            </Col>
          ))}
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
    <div className="stamp">
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
      <Row gutter={[12, 12]}>
        {stamps.map((s) => (
          <Col xs={12} sm={8} md={6} key={s.id}>
            <Stamp {...s} />
          </Col>
        ))}
      </Row>
    </SoftCard>
  );
}

/* ----------------- Visas ----------------- */
function VisaCard({ country, type, status, expiry }) {
  return (
    <div className="visa">
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
      <Space direction="vertical" size={12} className="w-full">
        {visas.map((v) => (
          <VisaCard key={v.id} {...v} />
        ))}
      </Space>
    </SoftCard>
  );
}

/* ----------------- Trips ----------------- */
function TripCard({ title, range, status, notes }) {
  return (
    <div className="trip">
      <div className="trip__row">
        <div className="trip__title">{title}</div>
        <Tag color={status === "Booked" ? "blue" : "default"}>{status}</Tag>
      </div>
      <div className="trip__range">{range}</div>
      <div className="trip__notes">
        {notes?.map((n, i) => (
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
      <Space direction="vertical" size={12} className="w-full">
        {trips.map((t) => (
          <TripCard key={t.id} {...t} />
        ))}
      </Space>
    </SoftCard>
  );
}

/* ----------------- Invite & Earn (styled) ----------------- */
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
      <Space direction="vertical" size={8} className="w-full">
        <Text>Share your code to earn miles.</Text>
        <Input.Group compact>
          <Input style={{ width: "70%" }} value={referral.code} readOnly />
          <Button type="primary" icon={<CopyOutlined />} onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </Input.Group>
        <Text className="reward">Reward: {referral.reward}</Text>
      </Space>
    </SoftCard>
  );
}

/* ----------------- Root Page ----------------- */
export default function DigitalPassportPage() {
  const data = usePassportData();
  const [tab, setTab] = useState("Overview");
  const [qrOpen, setQrOpen] = useState(false);
  const [top8Mode, setTop8Mode] = useState("Top 8 Places");

  const tabOpts = useMemo(
    () => ["Overview", "Stamps", "Visas", "Trips", "Badges"],
    []
  );

  return (
    <PageLayout pageKey="profile">
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
          <Segmented value={tab} onChange={setTab} options={tabOpts} />
        </div>

        {/* Overview — Trips directly under Stamps */}
        {tab === "Overview" && (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={14}>
              <StampsGrid stamps={data.stamps} />
              <div className="h-3" />
              <TripsPanel trips={data.trips} />
            </Col>
            <Col xs={24} md={10}>
              <VisasList visas={data.visas} />
              <div className="h-3" />
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
                  {data.badges.map((b) => (
                    <div key={b.id} className="visa-sticker small">
                      <div className="visa-sticker__head">
                        <span className="visa-sticker__flag">{b.icon}</span>
                        <span className="visa-sticker__title">{b.label}</span>
                      </div>
                      <div className="visa-sticker__meta">Achievement</div>
                    </div>
                  ))}
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
          <div className="flex flex-col items-center gap-2">
            <QRCode
              value={`https://onesky.quest/u/${
                data.user?.username?.replace(/^@/, "") || "david"
              }`}
            />
            <Text type="secondary">Scan to view profile</Text>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}
