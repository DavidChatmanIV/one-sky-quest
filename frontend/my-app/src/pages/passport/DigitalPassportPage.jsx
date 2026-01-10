import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
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

/* Top 8 */
import TopEight from "./TopEight";
import TopEightItemFriend from "./TopEightItemFriend";
import TopEightItemPlace from "./TopEightItemPlace";

/* ✅ Privileges */
import PassportPrivilegesCard from "./PassportPrivilegesCard";

/* ✅ NEW: Exchange preview card (for Summary) */
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

/* ✅ Mock-style tabs (icon + label) */
const PASSPORT_TABS = [
  { key: "summary", label: "Passport Summary", icon: <IdcardOutlined /> },
  { key: "journeys", label: "Your Journeys", icon: <CompassOutlined /> },
  { key: "borders", label: "Access & Borders", icon: <GlobalOutlined /> },
  { key: "vault", label: "Rewards Vault", icon: <GiftOutlined /> },
];

export default function DigitalPassportPage() {
  const auth = useAuth();
  const rewardsOptIn = useRewardsOptInPrompt();

  // ✅ Passport is member-only (handled by RequireAuth/RequireMember at route level)
  const isAdmin = auth?.user?.role === "admin";

  const [musicOpen, setMusicOpen] = useState(false);
  const [profileMusic, setProfileMusic] = useState(null);

  // ✅ tabs renamed to match mock
  const [segment, setSegment] = useState("summary");

  // API fields can vary — keep flexible
  const [xp, setXp] = useState(0);
  const [xpToNextBadge, setXpToNextBadge] = useState(0);
  const [nextBadgeName, setNextBadgeName] = useState("Wanderer");

  const [passportStats, setPassportStats] = useState({
    followers: 0,
    following: 0,
  });
  const [followOpen, setFollowOpen] = useState(false);
  const [followMode, setFollowMode] = useState("following"); // "following" | "followers"

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

  const top8Friends = useMemo(
    () => [
      {
        id: "f1",
        name: "David (CEO)",
        username: "skyrio_ceo",
        verified: true,
        vibe: "Founder Energy",
      },
      {
        id: "f2",
        name: "Skyrio Explorer",
        username: "explorer_01",
        verified: false,
        vibe: "Chill",
      },
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

  /* ---------- profile music ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SKYRIO_PROFILE_MUSIC_KEY);
      if (raw) setProfileMusic(JSON.parse(raw));
    } catch {
      // ignore (soft launch)
    }
  }, []);

  /* ---------- profile data (SAFE) ---------- */
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

    return () => {
      s.off("social:counts:update", handler);
    };
  }, [myId]);

  // ✅ ring goal = current + remaining (fallback to 100)
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

  /* ✅ YourInnerCircle = TopEight Friends */
  const YourInnerCircle = useMemo(() => {
    return (
      <TopEight
        title="Your Inner Circle"
        subtitle="Top 8 Friends"
        canEdit={canEditTop8}
        storageKey={`skyrio_top8_friends_${auth?.user?.id || "member"}`}
        defaultItems={top8Friends}
        renderItem={(item, ctx) => (
          <TopEightItemFriend {...item} isDragging={ctx.isDragging} />
        )}
      />
    );
  }, [auth?.user?.id, canEditTop8, top8Friends]);

  const PassportContent = (
    <>
      <RewardsOptInPrompt
        open={rewardsOptIn.open}
        onClose={rewardsOptIn.close}
        onConfirm={rewardsOptIn.confirm}
      />

      <div className="passport-wrap">
        {/* =========================
           TIER 1 — PASSPORT HERO
           ========================= */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card className="passport-hero passport-heroV2" bordered={false}>
              <div className="pp-heroGrid">
                {/* Left: Avatar + identity */}
                <div className="pp-heroLeft">
                  <div className="pp-avatarGlow">
                    <Avatar size={72} icon={<UserOutlined />} />
                  </div>

                  <div className="pp-idBlock">
                    <Title level={2} className="pp-name" style={{ margin: 0 }}>
                      {displayName}
                    </Title>

                    <Text className="pp-handle">
                      {handle} · Explorer · Level {levelNumber}
                    </Text>

                    <div className="pp-socialRow">
                      <button
                        className="passport-socialBtn"
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
                        className="passport-socialBtn"
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

                    <div className="pp-chipsRow">
                      <Tag className="pp-chip">Passport Holder</Tag>

                      {profileMusic && (
                        <Tag className="pp-chip" icon={<SoundOutlined />}>
                          Music On
                        </Tag>
                      )}

                      {isAdmin && (
                        <Tag
                          className="pp-chip pp-chipAdmin"
                          icon={<CrownOutlined />}
                        >
                          Admin
                        </Tag>
                      )}
                    </div>

                    <PassportIdentity user={auth?.user} variant="inline" />
                  </div>
                </div>

                {/* Center: XP Ring */}
                <div className="pp-heroCenter">
                  <div className="pp-xpRingWrap">
                    <Progress
                      type="circle"
                      percent={xpPercent}
                      size={150}
                      strokeWidth={9}
                      className="pp-xpRing"
                      format={() => ""}
                    />
                    <div className="pp-xpOverlay">
                      <Text className="pp-nextTier">{nextBadgeName}</Text>
                      <div className="pp-levelBig">Level {levelNumber}</div>
                      <Text className="pp-xpSmall">
                        {xp} / {xpGoal} XP
                      </Text>
                    </div>
                  </div>

                  <Text className="pp-mutedLine">
                    {xpToNextBadge} XP to next badge — {nextBadgeName}
                  </Text>
                </div>

                {/* Right: Membership + actions */}
                <div className="pp-heroRight">
                  <div className="pp-membershipBox">
                    <Tag className="pp-membershipTag" icon={<CrownOutlined />}>
                      {membershipLabel}
                    </Tag>
                    <Text className="pp-expireTextSmall">
                      Passport Expires: {passportExpiresLabel}
                    </Text>
                  </div>

                  <Space wrap>
                    <Button
                      className="pp-ghostBtn"
                      icon={<PlayCircleOutlined />}
                      onClick={() => setMusicOpen(true)}
                    >
                      Profile Music
                    </Button>

                    <Button
                      className="pp-ghostBtn"
                      icon={<CopyOutlined />}
                      onClick={copyPassportLink}
                    >
                      Copy Link
                    </Button>

                    <Button
                      className="pp-ctaBtn"
                      icon={<ShareAltOutlined />}
                      onClick={() =>
                        antdMessage.info("Sharing enabled post-launch")
                      }
                    >
                      Share
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* =========================
           TIER 1.5 — MOCK TAB RAIL
           ========================= */}
        <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
          <Col span={24}>
            <div className="ppTabRail">
              {PASSPORT_TABS.map((t, idx) => (
                <div className="ppTabItemWrap" key={t.key}>
                  <button
                    type="button"
                    className={`ppTabItem ${
                      segment === t.key ? "isActive" : ""
                    }`}
                    onClick={() => setSegment(t.key)}
                  >
                    <span className="ppTabIcon">{t.icon}</span>
                    <span className="ppTabLabel">{t.label}</span>
                  </button>

                  {idx !== PASSPORT_TABS.length - 1 && (
                    <span className="ppTabDivider" />
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {/* =========================
           TIER 2–4 — CONTENT
           ========================= */}
        {segment === "summary" && (
          <>
            <div className="ppSummaryGrid" style={{ marginTop: 12 }}>
              <div className="ppSummaryLeft">
                <PassportHighlights />

                <div style={{ marginTop: 16 }}>
                  <PassportPrivilegesCard />
                </div>
              </div>

              <div className="ppSummaryRight">{YourInnerCircle}</div>
            </div>

            <StampStrip />

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} lg={12}>
                <TopEight
                  title="Places That Define You"
                  subtitle="Top 8 Locations"
                  canEdit={canEditTop8}
                  storageKey={`skyrio_top8_places_${
                    auth?.user?.id || "member"
                  }`}
                  defaultItems={top8Places}
                  renderItem={(item, ctx) => (
                    <TopEightItemPlace {...item} isDragging={ctx.isDragging} />
                  )}
                />
              </Col>

              {/* ✅ UPDATED: Exchange preview module (replaces placeholder Card) */}
              <Col xs={24} lg={12}>
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
                <Input
                  value={referralCode}
                  readOnly
                  style={{ minWidth: 280 }}
                />
                <Button icon={<CopyOutlined />} onClick={copyReferral} />
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={() =>
                    antdMessage.info("Sharing enabled post-launch")
                  }
                />
              </Space>
            </Card>
          </>
        )}

        <PassportFooter />
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

  return <div className="passport-scope">{PassportContent}</div>;
}