import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Avatar,
  Button,
  Progress,
  Input,
  Tag,
  Segmented,
  message as antdMessage,
} from "antd";
import {
  UserOutlined,
  CopyOutlined,
  ShareAltOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  CrownOutlined,
  IdcardOutlined,
  CompassOutlined,
  GlobalOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { io } from "socket.io-client";

/* ✅ IMPORTANT: load Passport CSS on this route */
import "../../styles/profile-passport.css";

/* ✅ Galaxy BG (Vite-safe import) */
import galaxyBg from "../../assets/DigitalPassport/galaxy-sunset.png";

import ProfileMusicModal, {
  SKYRIO_PROFILE_MUSIC_KEY,
} from "./music/ProfileMusicModal";

import PassportFooter from "./PassportFooter";
import PassportHighlights from "./PassportHighlights";
import PassportIdentity from "./PassportIdentity";
import StampStrip from "./StampStrip";
import TravelHistory from "./TravelHistory";
import TripList from "./TripList";
import VisaList from "./VisaList";
import SkyrioExchange from "./SkyrioExchange";
import Membership from "./Membership";

/* Followers/Following Modal */
import FollowersModal from "./FollowersModal";

/* Top 8 (Places only here) */
import TopEight from "./TopEight";
import TopEightItemPlace from "./TopEightItemPlace";

/* ✅ Inner Circle (MySpace Top 8) */
import InnerCircleFriends from "./InnerCircleFriends";

/* ✅ Privileges */
import PassportPrivilegesCard from "./PassportPrivilegesCard";

/* ✅ Exchange preview card (for Summary) */
import SkyrioExchangePreviewCard from "./SkyrioExchangePreviewCard";

/* ✅ Use ONE auth hook consistently across the app (match Navbar usage) */
import { useAuth } from "../../auth/useAuth";

/* Rewards opt-in prompt */
import RewardsOptInPrompt from "../../components/rewards/RewardsOptInPrompt";
import useRewardsOptInPrompt from "../../hooks/useRewardsOptInPrompt";

/* ✅ Admin controls (admin-only panels inside Passport, NOT a gate) */
import AdminQuickControls from "./AdminQuickControls";

const { Title, Text } = Typography;

function safeEmailPrefix(email) {
  if (!email) return "";
  const idx = email.indexOf("@");
  return idx > 0 ? email.slice(0, idx) : email;
}

function makeReferralCode(user) {
  const base =
    user?.username || user?.name || safeEmailPrefix(user?.email) || "EXPLORER";
  return `SKYRIO-${String(base)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")}-001`;
}

/* ✅ Tabs (keep your keys so logic doesn’t break) */
const PASSPORT_TABS = [
  { key: "summary", label: "Passport Summary", icon: <IdcardOutlined /> },
  { key: "journeys", label: "Your Journeys", icon: <CompassOutlined /> },
  { key: "borders", label: "Access & Borders", icon: <GlobalOutlined /> },
  { key: "vault", label: "Rewards Vault", icon: <GiftOutlined /> },
];

export default function DigitalPassportPage() {
  const location = useLocation();
  const auth = useAuth();
  const rewardsOptIn = useRewardsOptInPrompt();

  const isAdmin = auth?.user?.role === "admin";

  const [musicOpen, setMusicOpen] = useState(false);
  const [profileMusic, setProfileMusic] = useState(null);

  const [segment, setSegment] = useState("summary");

  const [xp, setXp] = useState(0);
  const [xpToNextBadge, setXpToNextBadge] = useState(0);
  const [nextBadgeName, setNextBadgeName] = useState("Wanderer");

  const [passportStats, setPassportStats] = useState({
    followers: 0,
    following: 0,
  });
  const [followOpen, setFollowOpen] = useState(false);
  const [followMode, setFollowMode] = useState("following");

  const socketRef = useRef(null);

  const rewardsEnabled = !!auth?.user?.settings?.rewardsEnabled;

  const displayName = useMemo(() => {
    const u = auth?.user;
    if (!u) return "Explorer";
    return (
      u.username || u.name || (u.email ? safeEmailPrefix(u.email) : "Explorer")
    );
  }, [auth?.user]);

  const handle = useMemo(() => {
    const u = auth?.user;
    if (!u) return "@explorer";
    const base = u.username || safeEmailPrefix(u.email) || "explorer";
    return `@${String(base).toLowerCase()}`;
  }, [auth?.user]);

  const levelNumber = useMemo(
    () => Number(auth?.user?.level ?? 1),
    [auth?.user]
  );

  const membershipLabel = useMemo(() => {
    return auth?.user?.membership?.tier
      ? String(auth.user.membership.tier)
      : "Free Explorer";
  }, [auth?.user]);

  const passportExpiresLabel = useMemo(() => "Dec 31, 2026", []);

  const referralCode = useMemo(
    () => makeReferralCode(auth?.user),
    [auth?.user]
  );

  const myId = useMemo(() => {
    const u = auth?.user;
    return u?._id || u?.id || null;
  }, [auth?.user]);

  const canEditTop8 = !!auth?.user;

  // ✅ Inner Circle preview (you can wire real data later)
  const innerCircleFriends = useMemo(
    () => [
      { id: "ic1", name: "Savid", coverUrl: "/images/circle/friend1.jpg" },
      {
        id: "ic2",
        name: "Skyrio Explorer",
        coverUrl: "/images/circle/friend2.jpg",
      },
      { id: "ic3", name: "LoneApp", coverUrl: "/images/circle/friend3.jpg" },
    ],
    []
  );

  const top8Places = useMemo(
    () => [
      { id: "p1", name: "Tokyo", country: "Japan", badge: "Dream Trip" },
      { id: "p2", name: "Paris", country: "France", badge: "Favorite" },
      { id: "p3", name: "Dubai", country: "UAE", badge: "Luxury" },
      { id: "p4", name: "Honolulu", country: "USA", badge: "Beach" },
    ],
    []
  );

  /* ✅ transition toast after auth redirect */
  useEffect(() => {
    const fromAuth = !!location?.state?.fromAuth;
    if (!fromAuth) return;

    antdMessage.success({
      content: `Welcome aboard${
        auth?.user?.name ? `, ${auth.user.name}` : ""
      } ✈️`,
      duration: 2,
    });

    try {
      window.history.replaceState({}, document.title);
    } catch {
      // ignore
    }
  }, [location?.state?.fromAuth, auth?.user?.name]);

  /* ---------- profile music ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SKYRIO_PROFILE_MUSIC_KEY);
      if (raw) setProfileMusic(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  /* ---------- profile data ---------- */
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch("/api/profile/me", { credentials: "include" });
        if (!res.ok) throw new Error("profile fetch failed");
        const data = await res.json();
        if (ignore) return;

        setXp(Number(data?.xp ?? 0));
        setXpToNextBadge(Number(data?.xpToNextBadge ?? 0));
        setNextBadgeName(String(data?.nextBadgeName ?? "Wanderer"));
      } catch {
        if (!ignore) {
          setXp(0);
          setXpToNextBadge(0);
          setNextBadgeName("Wanderer");
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  /* load passport stats (followers/following) */
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch("/api/passport/stats", {
          credentials: "include",
        });
        const data = await res.json();

        if (ignore) return;
        if (data?.ok) {
          setPassportStats({
            followers: Number(data?.stats?.followers ?? 0),
            following: Number(data?.stats?.following ?? 0),
          });
        }
      } catch {
        if (!ignore) setPassportStats({ followers: 0, following: 0 });
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  /* socket live sync for counts */
  useEffect(() => {
    if (!myId) return;

    if (!socketRef.current) {
      socketRef.current = io("/", { transports: ["websocket"] });
    }

    const s = socketRef.current;
    s.emit("auth:join", { userId: myId });

    const handler = (payload) => {
      if (!payload) return;
      setPassportStats((prev) => ({
        ...prev,
        followers:
          typeof payload.followers === "number"
            ? payload.followers
            : prev.followers,
        following:
          typeof payload.following === "number"
            ? payload.following
            : prev.following,
      }));
    };

    s.on("social:counts:update", handler);
    return () => s.off("social:counts:update", handler);
  }, [myId]);

  const xpGoal = useMemo(() => {
    const current = Number(xp || 0);
    const remaining = Number(xpToNextBadge || 0);
    const goal = remaining > 0 ? current + remaining : 100;
    return Math.max(1, goal);
  }, [xp, xpToNextBadge]);

  const xpPercent = useMemo(() => {
    const current = Number(xp || 0);
    return Math.max(0, Math.min(100, Math.round((current / xpGoal) * 100)));
  }, [xp, xpGoal]);

  const copyReferral = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      antdMessage.success("Referral code copied");
    } catch {
      antdMessage.error("Copy failed");
    }
  }, [referralCode]);

  const copyPassportLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      antdMessage.success("Passport link copied");
    } catch {
      antdMessage.error("Copy failed");
    }
  }, []);

  /* ✅ Segmented options built from your existing tab list */
  const segmentedOptions = useMemo(
    () =>
      PASSPORT_TABS.map((t) => ({
        label: (
          <span className="ppSegLabel">
            <span className="ppSegIcon">{t.icon}</span>
            <span className="ppSegText">{t.label}</span>
          </span>
        ),
        value: t.key,
      })),
    []
  );

  const PassportContent = (
    <>
      <RewardsOptInPrompt
        open={rewardsOptIn.open}
        onClose={rewardsOptIn.close}
        onConfirm={rewardsOptIn.confirm}
      />

      {/* ✅ NEW: mock layout shell wrapper */}
      <div className="pp-page">
        <div className="pp-shell pp-shell--mock">
          {/* =========================
             HERO ROW (3 cards)
          ========================= */}
          <Row gutter={[16, 16]} className="pp-heroRow">
            {/* Left: identity */}
            <Col xs={24} lg={9}>
              <Card bordered={false} className="pp-card pp-card--hero">
                <Space align="start" size={14} style={{ width: "100%" }}>
                  <div className="pp-avatarGlow">
                    <Avatar size={74} icon={<UserOutlined />} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <Title level={3} className="pp-title" style={{ margin: 0 }}>
                      {displayName}
                    </Title>
                    <Text className="pp-muted">
                      {handle} · Explorer · Level {levelNumber}
                    </Text>

                    <div style={{ marginTop: 10 }}>
                      <Tag className="pp-tag">Passport Holder</Tag>
                      {profileMusic && (
                        <Tag className="pp-tag" icon={<SoundOutlined />}>
                          Music On
                        </Tag>
                      )}
                      {isAdmin && (
                        <Tag className="pp-tag" icon={<CrownOutlined />}>
                          Admin
                        </Tag>
                      )}
                    </div>

                    <div className="pp-kv" style={{ marginTop: 10 }}>
                      <Text className="pp-kvLabel">Issued—Expires:</Text>
                      <Text className="pp-kvValue">{passportExpiresLabel}</Text>
                    </div>

                    {/* Keep your identity block (inline) */}
                    <div style={{ marginTop: 10 }}>
                      <PassportIdentity user={auth?.user} variant="inline" />
                    </div>

                    {/* Follow counts row (keeps your modal logic) */}
                    <div className="pp-followRow">
                      <button
                        className="ppFollowBtn"
                        onClick={() => {
                          setFollowMode("following");
                          setFollowOpen(true);
                        }}
                        type="button"
                      >
                        <strong>{passportStats.following}</strong>
                        <span>Following</span>
                      </button>

                      <button
                        className="ppFollowBtn"
                        onClick={() => {
                          setFollowMode("followers");
                          setFollowOpen(true);
                        }}
                        type="button"
                      >
                        <strong>{passportStats.followers}</strong>
                        <span>Followers</span>
                      </button>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Center: XP ring */}
            <Col xs={24} lg={6}>
              <Card
                bordered={false}
                className="pp-card pp-card--hero pp-card--center"
              >
                <div className="pp-levelWrap">
                  <Progress
                    type="dashboard"
                    percent={xpPercent}
                    strokeWidth={10}
                    className="pp-levelRing"
                    format={() => (
                      <div className="pp-levelText">
                        <div className="pp-levelRole">{nextBadgeName}</div>
                        <div className="pp-levelNum">Level {levelNumber}</div>
                        <div className="pp-levelXp">
                          {xp} / {xpGoal} XP
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <Text className="pp-muted" style={{ fontSize: 12 }}>
                    {xpToNextBadge} XP to next badge — {nextBadgeName}
                  </Text>
                </div>
              </Card>
            </Col>

            {/* Right: membership + actions */}
            <Col xs={24} lg={9}>
              <Card bordered={false} className="pp-card pp-card--hero">
                <div className="pp-membershipTop">
                  <Space align="center">
                    <CrownOutlined />
                    <Text className="pp-muted">{membershipLabel}</Text>
                  </Space>

                  <Space>
                    <Button className="pp-ghost-btn" size="small">
                      ⋯
                    </Button>
                    <Button className="pp-cta-btn" size="small">
                      ＋
                    </Button>
                  </Space>
                </div>

                <Text className="pp-muted" style={{ fontSize: 12 }}>
                  Issued—Expires: {passportExpiresLabel}
                </Text>

                <div className="pp-membershipCard">
                  <div className="pp-membershipBadge" />
                  <div style={{ flex: 1 }}>
                    <Title level={5} style={{ margin: 0 }} className="pp-title">
                      Passport Holder
                    </Title>
                    <Text className="pp-muted" style={{ fontSize: 12 }}>
                      Passport Expires: {passportExpiresLabel}
                    </Text>
                  </div>

                  <Button className="pp-ghost-btn" size="small">
                    ⋯
                  </Button>
                </div>

                <div style={{ marginTop: 12 }}>
                  <Space wrap>
                    <Button
                      className="pp-ghost-btn"
                      icon={<PlayCircleOutlined />}
                      onClick={() => setMusicOpen(true)}
                    >
                      Profile Music
                    </Button>

                    <Button
                      className="pp-ghost-btn"
                      icon={<CopyOutlined />}
                      onClick={copyPassportLink}
                    >
                      Copy Link
                    </Button>

                    <Button
                      className="pp-cta-btn"
                      icon={<ShareAltOutlined />}
                      onClick={() =>
                        antdMessage.info("Sharing enabled post-launch")
                      }
                    >
                      Share
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>

          {/* =========================
             TAB BAR (Segmented)
          ========================= */}
          <Card bordered={false} className="pp-card pp-card--tabs">
            <Segmented
              value={segment}
              onChange={setSegment}
              options={segmentedOptions}
              block
              className="pp-tabs"
            />
          </Card>

          {/* =========================
             CONTENT (by segment)
          ========================= */}
          {segment === "summary" && (
            <>
              {/* Main grid: Highlights + Inner Circle */}
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={14}>
                  <Card bordered={false} className="pp-card pp-card--panel">
                    <div className="pp-panelHeader">
                      <Title level={4} className="pp-title" style={{ margin: 0 }}>
                        Highlights
                      </Title>
                      <Text className="pp-muted">
                        A quiet flex — clean and meaningful.
                      </Text>
                    </div>

                    <PassportHighlights />

                    <div style={{ marginTop: 16 }}>
                      <PassportPrivilegesCard />
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={10}>
                  <Card bordered={false} className="pp-card pp-card--panel">
                    <div className="pp-panelHeaderRow">
                      <Title level={4} className="pp-title" style={{ margin: 0 }}>
                        Your Inner Circle
                      </Title>
                      <Text className="pp-muted">0 XP</Text>
                    </div>

                    <InnerCircleFriends
                      items={innerCircleFriends}
                      title=""
                      subtitle=""
                    />
                  </Card>
                </Col>
              </Row>

              {/* Keep stamps strip exactly where it was */}
              <div style={{ marginTop: 16 }}>
                <StampStrip />
              </div>

              {/* Bottom grid: TopEight + Exchange Preview */}
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={14}>
                  <TopEight
                    title="Places That Define You"
                    subtitle="Top 8 Locations"
                    canEdit={canEditTop8}
                    storageKey={`skyrio_top8_places_${auth?.user?.id || "member"}`}
                    defaultItems={top8Places}
                    renderItem={(item, ctx) => (
                      <TopEightItemPlace {...item} isDragging={ctx.isDragging} />
                    )}
                  />
                </Col>

                <Col xs={24} lg={10}>
                  <SkyrioExchangePreviewCard
                    level={levelNumber}
                    balanceXp={xp}
                    nextLevelGoal={250}
                    featuredDrop="Priority Support Week"
                    ctaLabel="Open Exchange"
                  />
                </Col>
              </Row>

              <AdminQuickControls isAdmin={isAdmin} />
            </>
          )}

          {segment === "journeys" && (
            <>
              <TripList />
              <TravelHistory />
            </>
          )}

          {segment === "borders" && <VisaList />}

          {segment === "vault" && (
            <>
              <Membership />
              <SkyrioExchange showSearch={false} />

              {rewardsEnabled ? (
                <Card
                  style={{ marginTop: 16 }}
                  bordered={false}
                  className="osq-surface"
                >
                  <Title level={5} style={{ marginBottom: 6 }}>
                    Seasonal Rewards
                  </Title>

                  <Text type="secondary">
                    Limited-time XP missions and rewards. You control when seasons
                    go live.
                  </Text>

                  <div style={{ marginTop: 12 }}>
                    <Tag color="gold">Soft Launch</Tag>
                    <Tag color="purple">Coming Soon</Tag>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Button type="primary" disabled style={{ marginRight: 8 }}>
                      View Season Rewards
                    </Button>

                    <Button
                      onClick={() =>
                        antdMessage.info(
                          "Seasonal rewards go live when you turn on a season."
                        )
                      }
                    >
                      How it works
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card
                  style={{ marginTop: 16 }}
                  bordered={false}
                  className="osq-surface"
                >
                  <Title level={5} style={{ marginBottom: 6 }}>
                    Rewards are off
                  </Title>

                  <Text type="secondary">
                    Turn on Rewards to unlock XP missions, badges, and seasonal
                    rewards.
                  </Text>

                  <div style={{ marginTop: 12 }}>
                    <Button
                      type="primary"
                      onClick={() => rewardsOptIn.confirm(true)}
                    >
                      Turn on Rewards
                    </Button>
                  </div>
                </Card>
              )}

              <Card
                style={{ marginTop: 16 }}
                bordered={false}
                className="osq-surface"
              >
                <Title level={5}>Invite & Earn</Title>
                <Space wrap>
                  <Input value={referralCode} readOnly style={{ minWidth: 280 }} />
                  <Button icon={<CopyOutlined />} onClick={copyReferral} />
                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={() => antdMessage.info("Sharing enabled post-launch")}
                  />
                </Space>
              </Card>
            </>
          )}

          <PassportFooter />
        </div>
      </div>

      <FollowersModal
        open={followOpen}
        onClose={() => setFollowOpen(false)}
        mode={followMode}
      />

      <ProfileMusicModal
        open={musicOpen}
        onClose={() => setMusicOpen(false)}
        onSave={setProfileMusic}
      />
    </>
  );

  /* ✅ keep your existing background wrapper */
  return (
    <div className="sk-passportPage" style={{ "--passport-bg": `url(${galaxyBg})` }}>
      <div className="passport-scope">{PassportContent}</div>
    </div>
  );
}