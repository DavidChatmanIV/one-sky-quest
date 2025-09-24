import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import FeedPage from "./pages/FeedPage"; 
import ProfilePage from "./pages/DigitalPassportPage"; 
import MembershipPage from "./pages/Membership";
import TeamTravelPage from "./pages/TeamTravelPage";
import NotFound from "./pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/team-travel" element={<TeamTravelPage />} />

        {/* legacy/aliases */}
        <Route path="/book" element={<Navigate to="/booking" replace />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
