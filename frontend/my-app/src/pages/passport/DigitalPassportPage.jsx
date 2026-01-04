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
  Segmented,
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

/* Auth */
import { useAuth } from "../../hooks/useAuth";

/* Rewards opt-in prompt */
import RewardsOptInPrompt from "../../components/rewards/RewardsOptInPrompt";
import useRewardsOptInPrompt from "../../hooks/useRewardsOptInPrompt";

/* ✅ Soft-block gate + guest banner */
import RequireAuthBlock from "../../auth/RequireAuthBlock";
import GuestBanner from "../../components/GuestBanner";

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

export default function DigitalPassportPage() {
  const auth = useAuth();
  const rewardsOptIn = useRewardsOptInPrompt();

  const [musicOpen, setMusicOpen] = useState(false);
  const [profileMusic, setProfileMusic] = useState(null);
  const [segment, setSegment] = useState("overview");

  // API fields can vary — we keep them flexible:
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
    if (!u) return "Guest";
    return (
      u.username || u.name || (u.email ? safeEmailPrefix(u.email) : "Explorer")
    );
  }, [auth?.user]);

  const levelLabel = useMemo(() => {
    const lvl = auth?.user?.level ?? 1;
    return `Explorer • Level ${lvl}`;
  }, [auth?.user]);

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

    // create once
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
      // do NOT force disconnect here if other pages reuse the socket later
    };
  }, [myId]);

  /**
   * ✅ XP percent:
   * Your API currently gives xp + xpToNextBadge (remaining).
   * We estimate progress with a soft goal so the bar stays meaningful.
   */
  const xpPercent = useMemo(() => {
    const remaining = Number(xpToNextBadge || 0);
    const current = Number(xp || 0);

    // If we have remaining, infer goal ≈ current + remaining
    const inferredGoal = remaining > 0 ? current + remaining : 1000;

    if (inferredGoal <= 0) return 0;

    return Math.max(
      0,
      Math.min(100, Math.round((current / inferredGoal) * 100))
    );
  }, [xp, xpToNextBadge]);

  const segments = useMemo(
    () => [
      { label: "Overview", value: "overview" },
      { label: "Trips", value: "trips" },
      { label: "Visas", value: "visas" },
      { label: "Rewards", value: "rewards" },
    ],
    []
  );

  const copyReferral = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      antdMessage.success("Referral code copied");
    } catch {
      antdMessage.error("Copy failed");
    }
  }, [referralCode]);

  const PassportContent = (
    <>
      <RewardsOptInPrompt
        open={rewardsOptIn.open}
        onClose={rewardsOptIn.close}
        onConfirm={rewardsOptIn.confirm}
      />

      <div className="passport-wrap">
        {/* HEADER */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card className="passport-hero" bordered={false}>
              <Space align="center" size={16} style={{ width: "100%" }}>
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="tp-avatar"
                />

                <div style={{ minWidth: 260 }}>
                  <Title level={3} style={{ margin: 0 }}>
                    {displayName}
                  </Title>

                  <Text type="secondary">{levelLabel}</Text>

                  <div className="passport-social" style={{ marginTop: 10 }}>
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

                  {profileMusic && (
                    <div style={{ marginTop: 10 }}>
                      <Tag icon={<SoundOutlined />} color="purple">
                        Music On
                      </Tag>
                      <Text style={{ marginLeft: 8, opacity: 0.8 }}>
                        {profileMusic?.title || "Selected track"}
                      </Text>
                    </div>
                  )}
                </div>

                <div style={{ marginLeft: "auto" }}>
                  <Button
                    icon={<PlayCircleOutlined />}
                    onClick={() => setMusicOpen(true)}
                  >
                    Profile Music
                  </Button>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* SEGMENTS */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Segmented
              block
              options={segments}
              value={segment}
              onChange={setSegment}
            />
          </Col>
        </Row>

        {/* OVERVIEW */}
        {segment === "overview" && (
          <>
            <PassportIdentity />
            <PassportHighlights />

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} lg={12}>
                <TopEight
                  title="Top 8 Friends"
                  subtitle="Your inner circle"
                  canEdit={canEditTop8}
                  storageKey={`skyrio_top8_friends_${
                    auth?.user?.id || "guest"
                  }`}
                  defaultItems={top8Friends}
                  renderItem={(item, ctx) => (
                    <TopEightItemFriend {...item} isDragging={ctx.isDragging} />
                  )}
                />
              </Col>

              <Col xs={24} lg={12}>
                <TopEight
                  title="Top 8 Locations"
                  subtitle="Favorites & dream trips"
                  canEdit={canEditTop8}
                  storageKey={`skyrio_top8_places_${auth?.user?.id || "guest"}`}
                  defaultItems={top8Places}
                  renderItem={(item, ctx) => (
                    <TopEightItemPlace {...item} isDragging={ctx.isDragging} />
                  )}
                />
              </Col>
            </Row>

            <Card
              style={{ marginTop: 16 }}
              bordered={false}
              className="osq-surface"
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Title level={5}>XP Progress</Title>
                <Progress
                  percent={xpPercent}
                  status={xpPercent > 0 ? "active" : "normal"}
                />
                <Text type="secondary">
                  {xpToNextBadge} XP to next badge — {nextBadgeName}
                </Text>
              </Space>
            </Card>

            <StampStrip />
          </>
        )}

        {/* TRIPS */}
        {segment === "trips" && (
          <>
            <TripList />
            <TravelHistory />
          </>
        )}

        {/* VISAS */}
        {segment === "visas" && <VisaList />}

        {/* REWARDS */}
        {segment === "rewards" && (
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

  return (
    <div className="passport-scope">
      <GuestBanner />
      <RequireAuthBlock feature="your Passport">
        {PassportContent}
      </RequireAuthBlock>
    </div>
  );
}
