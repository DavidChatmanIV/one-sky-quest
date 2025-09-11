import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import QuestFeedPage from "./pages/QuestFeed";
import SkyVaultPage from "./pages/SkyVault";
import MembershipPage from "./pages/Membership";
import DigitalPassportPage from "./pages/DigitalPassportPage";
import TeamTravelPage from "./pages/TeamTravelPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/booking" element={<BookingPage />} />

      <Route path="/feed" element={<QuestFeedPage />} />
      <Route path="/sky-vault" element={<SkyVaultPage />} />
      <Route path="/membership" element={<MembershipPage />} />
      <Route path="/profile" element={<DigitalPassportPage />} />
      <Route path="/team-travel" element={<TeamTravelPage />} />

      {/* Legacy aliases */}
      <Route path="/book" element={<Navigate to="/booking" replace />} />
      <Route path="/book/*" element={<Navigate to="/booking" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
