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
  Tabs,
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
  SoundOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../hooks/useAuth";
import "../styles/profile-passport.css";

const { Title, Text } = Typography;

/* =========================================================
   Soft Launch Settings
   ========================================================= */
const SOFT_LAUNCH = true; // <- keep true for friends/family testing

/* ----------------- Soft Launch Data (dynamic user + demo content) ----------------- */
function usePassportData() {
  const auth = useAuth();

  return useMemo(() => {
    const u = auth?.user || null;

    const baseHandle =
      (u?.username || "").replace(/^@/, "").trim() ||
      (u?.email ? u.email.split("@")[0] : "") ||
      "explorer";

    const username = `@${baseHandle}`;
    const name = (u?.name || "").trim() || "Explorer";
    const year = new Date().getFullYear();

    const referralCode = `SKYRIO-${baseHandle.toUpperCase()}-${year}`;

    // Soft launch miles: force 0
    const milesCurrent = SOFT_LAUNCH
      ? 0
      : Number.isFinite(Number(u?.miles))
      ? Number(u.miles)
      : 0;

    const milesNext = Number.isFinite(Number(u?.milesGoal))
      ? Number(u.milesGoal)
      : 5000;

    return {
      user: {
        name,
        username,
        tagline: u?.tagline || "An avid traveler exploring new horizons",
        status: u?.status || "New Explorer",
        level: Number.isFinite(Number(u?.level)) ? Number(u.level) : 1,
        tier: u?.tier || "Free",
      },
      stats: {
        countriesVisited: Number.isFinite(Number(u?.countriesVisited))
          ? Number(u.countriesVisited)
          : 12,
        favoriteStyle: u?.favoriteStyle || "Beach + City",
        nextBadgeTarget: u?.nextBadgeTarget || "Globetrotter",
      },

      // Demo content (replace with API later)
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

      referral: { code: referralCode, reward: "+250 miles" },
      miles: { current: milesCurrent, nextLevel: milesNext },
      music: {
        // soft launch defaults
        provider: "spotify",
        url: "",
        muted: true,
      },
    };
  }, [auth?.user]);
}

/* ----------------- Reusable ----------------- */
function SectionTitle({ children, right }) {
  return (
    <div className="sk-row sk-row-between sk-mb-2">
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

/* =========================================================
   Music (Apple Music / Spotify) — Soft Launch version
   Notes:
   - True autoplay is blocked by browsers unless user interacts.
   - We support “auto play after user enables once” + “mute default”.
   ========================================================= */
function toSpotifyEmbed(url) {
  if (!url) return "";
  // Accept either open.spotify.com/... or spotify:...
  if (url.includes("open.spotify.com")) {
    const u = new URL(url);
    // Spotify embed expects /embed/...
    return `${u.origin}/embed${u.pathname}?utm_source=generator`;
  }
  return "";
}

function toAppleMusicEmbed(url) {
  if (!url) return "";
  // Apple Music share links often contain /album/ or /playlist/
  // Apple embed typically works by adding ?app=music and using the same URL in an iframe.
  // Not perfect for every link, but good for soft launch.
  return url;
}

function ProfileMusicModal({ open, onClose, initial }) {
  const [provider, setProvider] = useState(initial?.provider || "spotify");
  const [url, setUrl] = useState(initial?.url || "");
  const [muted, setMuted] = useState(initial?.muted ?? true);

  useEffect(() => {
    if (!open) return;
    setProvider(initial?.provider || "spotify");
    setUrl(initial?.url || "");
    setMuted(initial?.muted ?? true);
  }, [open, initial]);

  const save = () => {
    const payload = { provider, url, muted };
    localStorage.setItem("skyrio_profile_music", JSON.stringify(payload));
    message.success("Music saved to this browser (soft launch).");
    onClose();
  };

  const embedSrc =
    provider === "spotify" ? toSpotifyEmbed(url) : toAppleMusicEmbed(url);

  return (
    <Modal
      title="Profile Music"
      open={open}
      onCancel={onClose}
      onOk={save}
      okText="Save"
    >
      <Text type="secondary">
        Soft launch note: browsers block true autoplay. We keep{" "}
        <b>Muted ON by default</b>, and you can enable play after a tap.
      </Text>

      <div style={{ marginTop: 12 }}>
        <Tabs
          activeKey={provider}
          onChange={(k) => setProvider(k)}
          items={[
            { key: "spotify", label: "Spotify" },
            { key: "apple", label: "Apple Music" },
          ]}
        />
      </div>

      <Space direction="vertical" style={{ width: "100%" }} size={10}>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={
            provider === "spotify"
              ? "Paste a Spotify track/playlist URL"
              : "Paste an Apple Music song/album/playlist URL"
          }
        />

        <div className="sk-row sk-row-between">
          <Text>Muted by default (MySpace vibe)</Text>
          <Button
            size="small"
            onClick={() => setMuted((m) => !m)}
            className={muted ? "" : "is-on"}
          >
            {muted ? "Muted" : "Sound On"}
          </Button>
        </div>

        {embedSrc ? (
          <div className="music-embed">
            {provider === "spotify" ? (
              <iframe
                title="Spotify embed"
                src={embedSrc}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            ) : (
              <iframe
                title="Apple Music embed"
                src={embedSrc}
                width="100%"
                height="175"
                frameBorder="0"
                allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                loading="lazy"
              />
            )}
          </div>
        ) : (
          <div className="music-empty">
            <Text type="secondary">
              Paste a link to preview the embed here.
            </Text>
          </div>
        )}
      </Space>
    </Modal>
  );
}

/* ----------------- Travel Pass Header ----------------- */
function TravelPassHeader({ data, top8Mode, onTop8Mode, onShowQR }) {
  const { user, stats, top8, miles } = data;
  const pct =
    miles.nextLevel > 0
      ? Math.min(100, Math.round((miles.current / miles.nextLevel) * 100))
      : 0;

  const friends = top8.friends || [];
  const showFriends = top8Mode === "Top 8 Friends" && friends.length > 0;

  const [musicOpen, setMusicOpen] = useState(false);

  const handle = (user.username || "").replace(/^@/, "").trim() || "explorer";
  const profileUrl = `https://skyrio.app/u/${handle}`;

  const copyProfile = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      message.success("Profile link copied!");
    } catch {
      message.error("Could not copy link");
    }
  };

  return (
    <>
      <Card
        variant="borderless"
        className="tp-card"
        styles={{ body: { padding: 16 } }}
      >
        <div className="tp-top">
          <Text className="tp-title">DIGITAL PASSPORT</Text>
          <Tag className="tp-tier">{user.tier || "Free"} Tier</Tag>
        </div>

        <div className="tp-id">
          <Avatar size={84} icon={<UserOutlined />} className="tp-avatar" />
          <div className="tp-identity">
            <Title level={2} className="!m-0 tp-name">
              {user.name}
            </Title>
            <div className="tp-tagline">{user.tagline}</div>
            <div className="tp-chips">
              <Tag className="chip">Level {user.level}</Tag>
              <Tag className="chip">{user.status}</Tag>
              <Tag className="chip">{user.username}</Tag>
            </div>
          </div>

          <Space>
            <Tooltip title="Copy profile link">
              <Button
                className="icon-btn"
                icon={<ShareAltOutlined />}
                onClick={copyProfile}
              />
            </Tooltip>
            <Tooltip title="Show QR">
              <Button
                className="icon-btn"
                icon={<QrcodeOutlined />}
                onClick={onShowQR}
              />
            </Tooltip>
          </Space>
        </div>

        <div className="tp-actions">
          <Button type="primary" className="cta" icon={<SendOutlined />}>
            Share Memory
          </Button>

          <Space size={8} aria-label="Quick actions">
            <Tooltip title="Profile music">
              <Button
                className="icon-btn"
                shape="circle"
                onClick={() => setMusicOpen(true)}
                aria-label="Music"
              >
                <SoundOutlined />
              </Button>
            </Tooltip>

            <Tooltip title="Photo">
              <Button className="icon-btn" shape="circle" aria-label="Photo">
                <CameraOutlined />
              </Button>
            </Tooltip>

            <Tooltip title="Trip">
              <Button className="icon-btn" shape="circle" aria-label="Trip">
                ✈️
              </Button>
            </Tooltip>
          </Space>

          <div className="tp-miles">
            <Text className="muted">Miles</Text>
            <div className="tp-mile-row">
              <Text strong>
                {miles.current.toLocaleString()} /{" "}
                {miles.nextLevel.toLocaleString()}
              </Text>
            </div>
            <Progress percent={pct} size="small" showInfo={false} />
          </div>
        </div>

        <div className="tp-divider">MEMORIES</div>
        <div className="tp-memo">
          <Text>
            ✈️ Visited {stats.countriesVisited} countries • Loves{" "}
            {stats.favoriteStyle}. Next badge: <b>{stats.nextBadgeTarget}</b>.
          </Text>
          <Tag className="chip"> Music</Tag>
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
                <div
                  className="top8-card friend"
                  aria-label={`Friend ${f.name}`}
                >
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

      <ProfileMusicModal
        open={musicOpen}
        onClose={() => setMusicOpen(false)}
        initial={(() => {
          try {
            return (
              JSON.parse(
                localStorage.getItem("skyrio_profile_music") || "null"
              ) || data.music
            );
          } catch {
            return data.music;
          }
        })()}
      />
    </>
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
      <SectionTitle
        right={
          <Button size="small" className="subtle-btn">
            Add Stamp
          </Button>
        }
      >
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
  const statusKey = (status || "").toLowerCase().includes("approved")
    ? "approved"
    : "pending";
  return (
    <div className="visa" role="group" aria-label={`Visa ${country}`}>
      <div className="visa__row">
        <div className="visa__title">{country}</div>
        <Tag className={`status-tag ${statusKey}`}>{status}</Tag>
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
      <SectionTitle
        right={
          <Button size="small" className="subtle-btn">
            Add Visa
          </Button>
        }
      >
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
  const statusKey = (status || "").toLowerCase(); // booked / completed / etc
  return (
    <div className="trip" role="group" aria-label={`Trip ${title}`}>
      <div className="trip__row">
        <div className="trip__title">{title}</div>
        <Tag className={`status-tag ${statusKey}`}>{status}</Tag>
      </div>
      <div className="trip__range">{range}</div>
      <div className="trip__notes">
        {(notes || []).map((n, i) => (
          <Tag key={i} className="note-tag">
            {n}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function TripsPanel({ trips }) {
  return (
    <SoftCard>
      <SectionTitle
        right={
          <Button size="small" className="subtle-btn">
            Add Trip
          </Button>
        }
      >
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

/* ----------------- Invite & Earn ----------------- */
function ReferralBox({ referral }) {
  const [copied, setCopied] = useState(false);
  const [applyCode, setApplyCode] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral.code);
      setCopied(true);
      message.success(`Copied! Share to earn ${referral.reward}`);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      message.error("Could not copy code");
    }
  };

  const onApply = () => {
    if (!applyCode.trim()) return message.info("Enter a code first.");
    message.success("Referral code applied!");
    setApplyCode("");
  };

  return (
    <SoftCard className="invite-card">
      <SectionTitle
        right={
          <Tag className="rewards-chip">
            <CrownOutlined /> Rewards
          </Tag>
        }
      >
        Invite & Earn
      </SectionTitle>

      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Text className="muted">Share your code to earn miles.</Text>

        {/* 1) Your code row (no “double bar”) */}
        <div className="invite-row">
          <Input value={referral.code} readOnly aria-label="Referral code" />
          <Button
            type="primary"
            className={`reward-copy-btn ${copied ? "is-copied" : ""}`}
            icon={<CopyOutlined />}
            onClick={copy}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {/* 2) Apply received code row */}
        <div className="invite-row">
          <Input
            value={applyCode}
            onChange={(e) => setApplyCode(e.target.value)}
            placeholder="Enter referral code"
            allowClear
            aria-label="Enter referral code"
          />
          <Button type="primary" className="apply-btn" onClick={onApply}>
            Apply
          </Button>
        </div>

        <Text className="reward">Reward: {referral.reward}</Text>
      </Space>
    </SoftCard>
  );
}

/* ----------------- Root Page ----------------- */
export default function DigitalPassportPage() {
  const data = usePassportData();

  const [params, setParams] = useSearchParams();
  const tabFromUrl = (params.get("tab") || "Overview").toString();
  const [tab, setTab] = useState(tabFromUrl);
  const [qrOpen, setQrOpen] = useState(false);
  const [top8Mode, setTop8Mode] = useState("Top 8 Places");

  useEffect(() => {
    const allowed = ["Overview", "Stamps", "Visas", "Trips", "Badges"];
    if (!allowed.includes(tabFromUrl)) {
      const next = new URLSearchParams(params);
      next.set("tab", "Overview");
      setParams(next, { replace: true });
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
    document.title = `Skyrio • Digital Passport`;
    return () => (document.title = prev);
  }, []);

  return (
    <PageLayout fullBleed={false} maxWidth={1180}>
      <div className="passport-wrap">
        <TravelPassHeader
          data={data}
          top8Mode={top8Mode}
          onTop8Mode={setTop8Mode}
          onShowQR={() => setQrOpen(true)}
        />

        <div className="tabs-row">
          <Segmented
            value={tab}
            onChange={onTabChange}
            options={["Overview", "Stamps", "Visas", "Trips", "Badges"]}
          />
        </div>

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

        <Modal
          title="Share your Digital Passport"
          open={qrOpen}
          onCancel={() => setQrOpen(false)}
          footer={null}
        >
          <div style={{ display: "grid", placeItems: "center", gap: 8 }}>
            <QRCode
              value={`https://skyrio.app/u/${(
                data.user?.username || "@explorer"
              )
                .replace(/^@/, "")
                .trim()}`}
              size={192}
            />
            <Text type="secondary">Scan to view profile</Text>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}
