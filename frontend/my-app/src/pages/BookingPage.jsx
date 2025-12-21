import React, { useMemo, useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Segmented,
  Button,
  Tag,
  Space,
  Input,
  DatePicker,
  Dropdown,
  Menu,
  Modal,
  InputNumber,
  Drawer,
  Divider,
  Select,
  Switch,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  CopyOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import "../styles/bookingPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const TAB_OPTIONS = [
  { key: "stays", label: "Stays" },
  { key: "flights", label: "Flights" },
  { key: "cars", label: "Cars" },
  { key: "cruises", label: "Cruises" },
  { key: "excursions", label: "Excursions" },
  { key: "packages", label: "Packages" },
  { key: "lastMinute", label: "Last-Minute" },
];

const QUICK_TAGS = [
  "Beach Weekend",
  "Adventure Escape",
  "City Vibes",
  "Events Nearby",
  "Romantic Getaway",
];

function GuestsDropdown({ value, onChange }) {
  const menu = (
    <Menu
      items={[
        { key: "1a1r", label: "1 adult • 1 room" },
        { key: "2a1r", label: "2 adults • 1 room" },
        { key: "2a2r", label: "2 adults • 2 rooms" },
        { key: "4a2r", label: "4 adults • 2 rooms" },
      ]}
      onClick={(info) => onChange?.(info.key)}
    />
  );

  const labelMap = {
    "1a1r": "1 adult • 1 room",
    "2a1r": "2 adults • 1 room",
    "2a2r": "2 adults • 2 rooms",
    "4a2r": "4 adults • 2 rooms",
  };

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button className="sk-inputBtn" icon={<UserOutlined />}>
        {labelMap[value] || "2 adults • 1 room"}
      </Button>
    </Dropdown>
  );
}

function StayCard() {
  return (
    <div className="sk-stayCard">
      <div className="sk-stayMedia" />
      <div className="sk-stayMeta">
        <div className="sk-stayTitleRow">
          <div>
            <div className="sk-stayTitle">Lisbon, Portugal</div>
            <div className="sk-stayPrice">From $1,120</div>
          </div>
          <Button className="sk-cta" size="middle">
            + Add to Plan
          </Button>
        </div>

        <Space size={8} wrap className="sk-stayTags">
          <Tag className="sk-tag">City</Tag>
          <Tag className="sk-tag">Europe</Tag>
          <Tag className="sk-tag">Within Budget</Tag>
          <Tag className="sk-tag">★ Popular</Tag>
        </Space>
      </div>
    </div>
  );
}

/**
 * Team Travel Drawer (Premium)
 * - Soft launch: stores to localStorage
 */
function TeamTravelDrawer({ open, onClose, team, onSave }) {
  const [draft, setDraft] = useState(team);

  useEffect(() => {
    setDraft(team);
  }, [team]);

  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const genInvite = () => {
    const code =
      "SKY-" +
      Math.random().toString(16).slice(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(16).slice(2, 6).toUpperCase();
    update({ inviteCode: code });
    message.success("Invite code generated");
  };

  const copyInvite = async () => {
    if (!draft?.inviteCode)
      return message.info("Generate an invite code first");
    try {
      await navigator.clipboard.writeText(draft.inviteCode);
      message.success("Invite code copied");
    } catch {
      message.error("Couldn’t copy—try again");
    }
  };

  return (
    <Drawer
      title={
        <Space size={10}>
          <TeamOutlined />
          <span>Team Travel Setup</span>
          <Tag className="sk-tag sk-tagPremium">Premium</Tag>
        </Space>
      }
      placement="right"
      width={420}
      open={open}
      onClose={onClose}
      className="sk-teamDrawer"
      extra={
        <Button
          icon={<SaveOutlined />}
          className="sk-cta"
          onClick={() => onSave?.(draft)}
        >
          Save
        </Button>
      }
    >
      <div className="sk-drawerSection">
        <div className="sk-sectionTitle">Step 1 — Team Basics</div>

        <div className="sk-field">
          <div className="sk-fieldLabel">Team name</div>
          <Input
            value={draft.teamName}
            onChange={(e) => update({ teamName: e.target.value })}
            placeholder="Example: Bloomfield Eagles"
            allowClear
          />
        </div>

        <div className="sk-field">
          <div className="sk-fieldLabel">Event type</div>
          <Select
            value={draft.eventType}
            onChange={(v) => update({ eventType: v })}
            style={{ width: "100%" }}
            options={[
              { value: "Tournament", label: "Tournament" },
              { value: "Away Game", label: "Away Game" },
              { value: "Camp", label: "Camp" },
              { value: "Showcase", label: "Showcase" },
              { value: "Other", label: "Other" },
            ]}
          />
        </div>

        <Divider className="sk-divider" />

        <div className="sk-sectionTitle">Step 2 — Rooms</div>

        <div className="sk-fieldRow">
          <div className="sk-field">
            <div className="sk-fieldLabel">Athletes</div>
            <InputNumber
              min={0}
              value={draft.athletes}
              onChange={(v) => update({ athletes: Number(v || 0) })}
              style={{ width: "100%" }}
            />
          </div>
          <div className="sk-field">
            <div className="sk-fieldLabel">Adults</div>
            <InputNumber
              min={0}
              value={draft.adults}
              onChange={(v) => update({ adults: Number(v || 0) })}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="sk-field">
          <div className="sk-fieldLabel">Room preference</div>
          <Select
            value={draft.roomType}
            onChange={(v) => update({ roomType: v })}
            style={{ width: "100%" }}
            options={[
              { value: "2 Queen", label: "2 Queen" },
              { value: "King", label: "King" },
              { value: "Suite", label: "Suite" },
              { value: "Mix", label: "Mix" },
            ]}
          />
        </div>

        <div className="sk-toggleRow">
          <div>
            <div className="sk-fieldLabel">Auto-fill rooms</div>
            <div className="sk-miniHelp">
              Skyrio suggests the best room split.
            </div>
          </div>
          <Switch
            checked={draft.autoFillRooms}
            onChange={(v) => update({ autoFillRooms: v })}
          />
        </div>

        <div className="sk-toggleRow">
          <div>
            <div className="sk-fieldLabel">Keep team together</div>
            <div className="sk-miniHelp">Prioritize same hotel + floors.</div>
          </div>
          <Switch
            checked={draft.keepTogether}
            onChange={(v) => update({ keepTogether: v })}
          />
        </div>

        <Divider className="sk-divider" />

        <div className="sk-sectionTitle">Step 3 — Invite</div>

        <Space wrap>
          <Button className="sk-ghostBtn" onClick={genInvite}>
            Generate code
          </Button>
          <Button
            className="sk-ghostBtn"
            icon={<CopyOutlined />}
            onClick={copyInvite}
          >
            Copy
          </Button>
        </Space>

        <div className="sk-inviteBox">
          <div className="sk-inviteLabel">Invite code</div>
          <div className="sk-inviteValue">{draft.inviteCode || "—"}</div>
          <div className="sk-miniHelp">
            Soft launch uses a simple code. Post-launch: real invite links +
            roster.
          </div>
        </div>
      </div>
    </Drawer>
  );
}

/**
 * Budget panel (Budget only — no Team Travel here)
 */
function BudgetPanel() {
  const [mode, setMode] = useState("Solo");

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("sk_budget");
    return saved ? Number(saved) : 2500;
  });

  const planTotal = 1150;
  const underBy = Math.max(0, budget - planTotal);

  const [open, setOpen] = useState(false);
  const [draftBudget, setDraftBudget] = useState(budget);

  const saveBudget = () => {
    setBudget(draftBudget);
    localStorage.setItem("sk_budget", String(draftBudget));
    setOpen(false);
  };

  return (
    <div className="sk-budgetCard">
      <div className="sk-budgetHeader">
        <div className="sk-budgetTitle">Budget</div>

        <Space size={8}>
          <Button
            className="sk-ghostBtn"
            icon={<SettingOutlined />}
            onClick={() => {
              setDraftBudget(budget);
              setOpen(true);
            }}
          >
            Set Budget
          </Button>

          <Segmented
            size="small"
            options={["Solo", "Group"]}
            value={mode}
            onChange={setMode}
          />
        </Space>
      </div>

      <div className="sk-budgetStat">
        <div className="sk-budgetValue">
          ${underBy.toLocaleString()} under your budget.
        </div>
        <div className="sk-budgetSub">
          Budget: ${budget.toLocaleString()} • Planned: $
          {planTotal.toLocaleString()}
        </div>
      </div>

      <div className="sk-budgetBlock">
        <div className="sk-budgetBlockTitle">Planned items</div>
        <div className="sk-budgetEmpty">No items added yet</div>
      </div>

      <Modal
        title="Set your trip budget"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={saveBudget}
        okText="Save"
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ color: "rgba(255,255,255,0.75)" }}>
            Choose a budget that Skyrio will help you stay under.
          </div>

          <InputNumber
            style={{ width: "100%" }}
            min={100}
            step={50}
            value={draftBudget}
            onChange={(v) => setDraftBudget(Number(v || 0))}
            formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => String(v).replace(/\$\s?|(,*)/g, "")}
          />
        </div>
      </Modal>
    </div>
  );
}

/**
 * Standalone Team Travel Card (Premium, NOT inside budget)
 */
function TeamTravelCard({ team, onEdit }) {
  const title = team?.teamName?.trim() ? team.teamName : "Team Trip";
  const sub = `${team?.eventType || "Tournament"} • ${
    team?.roomType || "2 Queen"
  } • ${team?.athletes ?? 0} athletes, ${team?.adults ?? 0} adults`;

  return (
    <div className="sk-teamCard">
      <div className="sk-teamCardHeader">
        <div>
          <div className="sk-teamTitleRow">
            <div className="sk-teamTitle">{title}</div>
            <Tag className="sk-tag sk-tagPremium">Premium</Tag>
          </div>
          <div className="sk-teamSub">{sub}</div>
        </div>

        <Button className="sk-ghostBtn" onClick={onEdit}>
          Edit
        </Button>
      </div>

      <div className="sk-teamHint">
        Team mode keeps everyone aligned and optimizes room splits.
      </div>
    </div>
  );
}

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState("stays");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState(null);
  const [guests, setGuests] = useState("2a1r");

  // Team Travel mode (separate from budget)
  const [teamMode, setTeamMode] = useState(false);

  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem("sk_team_trip");
    return saved
      ? JSON.parse(saved)
      : {
          teamName: "",
          eventType: "Tournament",
          athletes: 12,
          adults: 6,
          roomType: "2 Queen",
          autoFillRooms: true,
          keepTogether: true,
          inviteCode: "",
        };
  });

  const [teamOpen, setTeamOpen] = useState(false);

  const headerPills = useMemo(
    () => [{ label: "XP 60" }, { label: "0 saved trips" }, { label: "1 new" }],
    []
  );

  const onSearch = () => {
    console.log({ activeTab, destination, dates, guests, teamMode, team });
  };

  const openTeam = () => setTeamOpen(true);

  const saveTeam = (next) => {
    setTeam(next);
    localStorage.setItem("sk_team_trip", JSON.stringify(next));
    setTeamOpen(false);
    message.success("Team travel saved");
  };

  // If user enables Team Mode and hasn't named a team yet, open setup once
  useEffect(() => {
    if (teamMode && !team?.teamName && !teamOpen) {
      setTeamOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamMode]);

  return (
    <Layout className="sk-bookingPage">
      <Content className="sk-wrap">
        {/* HERO */}
        <div className="sk-hero">
          <Title level={1} className="sk-heroTitle">
            Book Your Next Adventure ✨
          </Title>

          <div className="sk-pillRow">
            {headerPills.map((p) => (
              <div key={p.label} className="sk-pill">
                {p.label}
              </div>
            ))}
          </div>

          <Text className="sk-heroHint">
            Smart Plan AI will optimize this trip for budget &amp; XP.
          </Text>
        </div>

        {/* GRID */}
        <div className="sk-grid">
          {/* LEFT */}
          <div className="sk-left">
            <div className="sk-glass">
              {/* Tabs */}
              <div className="sk-tabs">
                {TAB_OPTIONS.map((t) => (
                  <button
                    key={t.key}
                    className={`sk-tab ${
                      activeTab === t.key ? "isActive" : ""
                    }`}
                    onClick={() => setActiveTab(t.key)}
                    type="button"
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Search Row */}
              <div className="sk-searchRow">
                <Input
                  className="sk-input"
                  prefix={<EnvironmentOutlined />}
                  placeholder="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  allowClear
                />

                <DatePicker.RangePicker
                  className="sk-input"
                  suffixIcon={<CalendarOutlined />}
                  value={dates}
                  onChange={(val) => setDates(val)}
                />

                <GuestsDropdown value={guests} onChange={setGuests} />

                <Button
                  className="sk-searchBtn"
                  icon={<SearchOutlined />}
                  onClick={onSearch}
                >
                  Search +50 XP
                </Button>
              </div>

              {/* Quick Tags */}
              <div className="sk-quickTags">
                {QUICK_TAGS.map((tag) => (
                  <button className="sk-chip" key={tag} type="button">
                    {tag}
                  </button>
                ))}
              </div>

              {/* Premium hint + team toggle */}
              <div className="sk-premiumHintRow">
                <Text className="sk-premiumHint">
                  Tip: Switch to <b>Team Travel</b> for tournaments + parents.
                </Text>

                <Button
                  className="sk-ghostBtn"
                  icon={<TeamOutlined />}
                  onClick={() => setTeamMode(true)}
                >
                  Team Travel
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="sk-results">
              <StayCard />
            </div>
          </div>

          {/* RIGHT */}
          <div className="sk-right">
            <div className="sk-sticky">
              <BudgetPanel />

              {teamMode && <TeamTravelCard team={team} onEdit={openTeam} />}

              {teamMode && (
                <Button
                  className="sk-ghostBtn sk-teamOffBtn"
                  onClick={() => setTeamMode(false)}
                >
                  Turn off Team Travel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Team Drawer */}
        <TeamTravelDrawer
          open={teamOpen}
          onClose={() => setTeamOpen(false)}
          team={team}
          onSave={saveTeam}
        />
      </Content>
    </Layout>
  );
}