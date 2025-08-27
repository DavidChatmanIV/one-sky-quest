import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ---------- PAGES (top-level) ---------- */
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import DmPage from "./pages/DmPage";
import QuestFeed from "./pages/QuestFeed";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MembershipPage from "./pages/MembershipPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import TeamTravelPage from "./pages/TeamTravelPage";

/* ---------- FEATURE SECTIONS (component-based) ---------- */
import UniqueStays from "./components/UniqueStays.jsx";
import LastMinute from "./components/LastMinuteAndUniqueStays.jsx";
// ⬇️ Replaced BuildTripAI with TravelAssistant
import TravelAssistant from "./components/TravelAssistant.jsx";

/* ---------- EXTRAS ---------- */
import SavedExcursions from "./components/excursions/SavedExcursions";
import NotFound from "./pages/NotFound";

/* ---------- ROUTES ---------- */
const AppRoutes = () => (
  <Routes>
    {/* Core */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/booking" element={<BookingPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/questfeed" element={<QuestFeed />} />
    <Route path="/dm" element={<DmPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/membership" element={<MembershipPage />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/about" element={<About />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/team-travel" element={<TeamTravelPage />} />

    {/* Feature routes used by the navbar */}
    <Route path="/unique-stays" element={<UniqueStays />} />
    <Route path="/last-minute" element={<LastMinute />} />
    {/* New canonical path */}
    <Route path="/build-trip" element={<TravelAssistant />} />
    {/* Backward-compat for old links */}
    <Route
      path="/build-trip-ai"
      element={<Navigate to="/build-trip" replace />}
    />

    {/* Tools / saved items */}
    <Route path="/saved-excursions" element={<SavedExcursions />} />

    {/* Redirect legacy index.html to root */}
    <Route path="/index.html" element={<Navigate to="/" replace />} />

    {/* 404 fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
