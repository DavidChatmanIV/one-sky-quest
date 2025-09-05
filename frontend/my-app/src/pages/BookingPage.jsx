import React, { useMemo, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Tag,
  Space,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import {
  StarOutlined,
  SaveOutlined,
  BellOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import BudgetWidget from "../components/Budget/BudgetWidget";
// ⬇️ swap generic card for per-tab cards
import {
  StaysCard,
  FlightCard,
  CarCard,
  CruiseCard,
  ExcursionCard,
  PackageCard,
} from "../components/Booking/cards";

import UnifiedSearchBar from "../components/Booking/UnifiedSearchBar";
import "../styles/BookingPage.css";

const { Content } = Layout;
const { Title } = Typography;

/* -------------------------
   Mock data per vertical
   ------------------------- */
const MOCK_STAYS = [
  {
    id: "lisbon",
    title: "Lisbon",
    subtitle: "From 1120",
    image:
      "https://images.unsplash.com/photo-1520975922313-552d4b6438b9?q=80&w=1200&auto=format&fit=crop",
    price: 1120,
    priceUnit: "perPerson",
    badges: ["City", "Europe"],
  },
  {
    id: "playa",
    title: "Playa Del Carmen",
    subtitle: "All-inclusive · 4 nights",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
    price: 1400,
    priceUnit: "perPerson",
    badges: ["Beach", "All-inclusive"],
  },
  {
    id: "bali",
    title: "Bali",
    subtitle: "From 5556",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
    price: 5556,
    priceUnit: "perPerson",
    badges: ["Island", "Asia"],
  },
];

const MOCK_FLIGHTS = [
  {
    id: "ewr-lis",
    title: "EWR → LIS",
    subtitle: "Round-trip · 6 nights",
    image:
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200&auto=format&fit=crop",
    price: 680,
    priceUnit: "perPerson",
    badges: ["Nonstop", "TAP"],
  },
  {
    id: "atl-par",
    title: "ATL → CDG",
    subtitle: "Round-trip · 5 nights",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop",
    price: 520,
    priceUnit: "perPerson",
    badges: ["1 stop", "Delta/Air France"],
  },
];

const MOCK_CARS = [
  {
    id: "car-lis-compact",
    title: "Compact — Lisbon Airport",
    subtitle: "Unlimited miles · Free cancel",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
    price: 45,
    priceUnit: "total", // daily total
    badges: ["Compact", "A/C"],
  },
  {
    id: "car-lis-suv",
    title: "SUV — Lisbon Airport",
    subtitle: "Pay at pickup",
    image:
      "https://images.unsplash.com/photo-1549921296-3ecf9c4d8d49?q=80&w=1200&auto=format&fit=crop",
    price: 72,
    priceUnit: "total",
    badges: ["SUV", "Automatic"],
  },
];

const MOCK_CRUISES = [
  {
    id: "med-7n",
    title: "Mediterranean · 7 nights",
    subtitle: "Rome → Barcelona · Balcony",
    image:
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=1200&auto=format&fit=crop",
    price: 1200,
    priceUnit: "perPerson",
    badges: ["All meals", "Entertainment"],
  },
];

const MOCK_EXCURSIONS = [
  {
    id: "sintra-day",
    title: "Sintra & Cascais Day Tour",
    subtitle: "Small group · 8 hours",
    image:
      "https://images.unsplash.com/photo-1565361850078-5a0d1b5e5d20?q=80&w=1200&auto=format&fit=crop",
    price: 95,
    priceUnit: "perPerson",
    badges: ["Guided", "Top rated"],
  },
  {
    id: "bali-temple",
    title: "Uluwatu Temple Sunset",
    subtitle: "Cultural show · 3 hours",
    image:
      "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200&auto=format&fit=crop",
    price: 49,
    priceUnit: "perPerson",
    badges: ["Skip-the-line", "Transport"],
  },
];

const MOCK_PACKAGES = [
  {
    id: "lisbon-bundle",
    title: "Lisbon City Break (Flight + Hotel)",
    subtitle: "4 nights · breakfast · central stay",
    image:
      "https://images.unsplash.com/photo-1532051041000-59d56f858b9c?q=80&w=1200&auto=format&fit=crop",
    price: 999,
    priceUnit: "perPerson",
    badges: ["Bundle", "Best value"],
  },
  {
    id: "cancun-ai",
    title: "Cancun All-Inclusive (Flight + Resort)",
    subtitle: "5 nights · transfers included",
    image:
      "https://images.unsplash.com/photo-1519821172141-b5d8b2f6d0e8?q=80&w=1200&auto=format&fit=crop",
    price: 1290,
    priceUnit: "perPerson",
    badges: ["All-inclusive", "Bundle"],
  },
];

const DATASETS = {
  stays: MOCK_STAYS,
  flights: MOCK_FLIGHTS,
  cars: MOCK_CARS,
  cruises: MOCK_CRUISES,
  excursions: MOCK_EXCURSIONS,
  packages: MOCK_PACKAGES,
};

export default function BookingPage() {
  const navigate = useNavigate();

  // Unified search tabs + query
  const [searchTab, setSearchTab] = useState("stays");
  const [query, setQuery] = useState("");

  // Filter active dataset by the current query
  const activeItems = useMemo(() => {
    const list = DATASETS[searchTab] || [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.subtitle || "").toLowerCase().includes(q) ||
        (l.badges || []).some((b) => b.toLowerCase().includes(q))
    );
  }, [searchTab, query]);

  // Budget widget state
  const [mode, setMode] = useState("solo");
  const [soloBudget, setSoloBudget] = useState(1500);
  const [group, setGroup] = useState({
    size: 4,
    kind: "perPerson",
    budgetPerPerson: 1000,
    totalBudget: 4000,
  });

  // Plan basket
  const [planned, setPlanned] = useState([]);
  const addToPlan = (listing) => {
    setPlanned((cur) => {
      if (cur.find((x) => x.id === listing.id)) {
        message.info("Already added to your plan");
        return cur;
      }
      message.success(`Added ${listing.title} to your plan`);
      return [
        ...cur,
        {
          id: listing.id,
          title: listing.title,
          price: listing.price,
          priceUnit: listing.priceUnit,
        },
      ];
    });
  };
  const removeFromPlan = (id) =>
    setPlanned((cur) => cur.filter((x) => x.id !== id));

  // Totals
  const budgetTotal =
    mode === "solo"
      ? soloBudget
      : group.kind === "perPerson"
      ? group.budgetPerPerson * group.size
      : group.totalBudget;

  const plannedTotal = useMemo(() => {
    return planned.reduce((sum, item) => {
      if (mode === "solo") return sum + item.price;
      if (group.kind === "perPerson") return sum + item.price * group.size;
      return (
        sum +
        (item.priceUnit === "total" ? item.price : item.price * group.size)
      );
    }, 0);
  }, [planned, mode, group]);

  // Per-card budget chip
  const budgetStatus = (listing) => {
    if (mode === "solo") {
      const diff = soloBudget - listing.price;
      return diff >= 0
        ? { type: "within", label: "Within budget" }
        : { type: "over", label: `$${Math.abs(diff)} over your budget` };
    }
    const listingTotal =
      group.kind === "perPerson" ? listing.price * group.size : listing.price;
    const cap =
      group.kind === "perPerson"
        ? group.budgetPerPerson * group.size
        : group.totalBudget;
    const diff = cap - listingTotal;
    return diff >= 0
      ? { type: "within", label: "Within budget" }
      : { type: "over", label: `$${Math.abs(diff)} over your budget` };
  };

  // Pick card component per tab
  const CardByType = {
    stays: StaysCard,
    flights: FlightCard,
    cars: CarCard,
    cruises: CruiseCard,
    excursions: ExcursionCard,
    packages: PackageCard,
  };

  return (
    <Layout className="booking-layout">
      <Content className="booking-content">
        {/* Header */}
        <div className="booking-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <Title level={2} className="greeting" style={{ marginBottom: 4 }}>
                Good evening, David 📚
              </Title>
              <h1 className="hero-title">Book Your Next Adventure ✨</h1>
            </div>

            <Button
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              shape="round"
            >
              Home
            </Button>
          </div>

          <div className="quick-actions" style={{ marginTop: 12 }}>
            <Tag className="chip">
              <StarOutlined /> XP $60
            </Tag>
            <Tag className="chip">
              <SaveOutlined /> Saved trips
            </Tag>
            <Tag className="chip">1 New</Tag>
          </div>

          {/* Unified search */}
          <UnifiedSearchBar
            activeKey={searchTab}
            onChangeTab={setSearchTab}
            onSearch={(payload) => {
              if (payload?.type) setSearchTab(payload.type);
              if (payload?.destination) setQuery(payload.destination);
            }}
          />
        </div>

        <Row gutter={[24, 24]} align="top">
          {/* Left: results tied to active tab */}
          <Col xs={24} lg={16}>
            <div className="results-wrap">
              <div className="crumbs" style={{ marginBottom: 8 }}>
                Showing {activeItems.length} {searchTab}
                {activeItems.length === 1 ? "" : " options"}
              </div>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {activeItems.map((item) => {
                  const Card = CardByType[searchTab] || StaysCard;
                  return (
                    <Card
                      key={`${searchTab}-${item.id}`}
                      item={item}
                      status={budgetStatus(item)}
                      onAdd={() => addToPlan(item)}
                    />
                  );
                })}
              </Space>
            </div>
          </Col>

          {/* Right: sticky budget */}
          <Col xs={24} lg={8}>
            <BudgetWidget
              mode={mode}
              setMode={setMode}
              soloBudget={soloBudget}
              setSoloBudget={setSoloBudget}
              group={group}
              setGroup={setGroup}
              planned={planned}
              plannedTotal={plannedTotal}
              budgetTotal={budgetTotal}
              onRemovePlan={removeFromPlan}
            />
            <Divider />
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button block icon={<BellOutlined />}>
                Subscribe to price drops
              </Button>
            </Space>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
