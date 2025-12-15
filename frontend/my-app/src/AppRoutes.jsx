import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

// Public pages
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import SkyStreamPage from "./pages/SkyStreamPage"; 
import ProfilePage from "./pages/DigitalPassportPage";
import MembershipPage from "./pages/Membership";
import TeamTravelPage from "./pages/TeamTravelPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Protected pages
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Layout wrapper for all site pages */}
      <Route element={<AppLayout />}>
        {/* ---------- Public ---------- */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="booking" element={<BookingPage />} />

        {/* 🔥 SkyStream (new feed) */}
        <Route path="feed" element={<SkyStreamPage />} />
        <Route path="skystream" element={<SkyStreamPage />} />

        <Route path="profile" element={<ProfilePage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="team-travel" element={<TeamTravelPage />} />

        {/* legacy / aliases */}
        <Route path="book" element={<Navigate to="/booking" replace />} />

        {/* ---------- Protected ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* add other protected pages here */}
        </Route>

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}