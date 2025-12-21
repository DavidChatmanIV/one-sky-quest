import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

// ---------- Public Pages ----------
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import SkyStreamPage from "./pages/SkyStreamPage";

// Passport pages moved into /pages/passport
import DigitalPassportPage from "./pages/passport/DigitalPassportPage";

// Auth + misc
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// ---------- Optional / Legacy ----------
// Membership moved into /pages/passport (based on your screenshot)
import MembershipPage from "./pages/passport/Membership";

// If TeamTravel is still in ./pages/TeamTravelPage keep this:
import TeamTravelPage from "./pages/TeamTravelPage";

// ---------- Protected ----------
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* App shell */}
      <Route element={<AppLayout />}>
        {/* ---------- Public ---------- */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* ---------- Core ---------- */}
        <Route path="booking" element={<BookingPage />} />

        {/* SkyStream */}
        <Route path="skystream" element={<SkyStreamPage />} />
        <Route path="feed" element={<Navigate to="/skystream" replace />} />

        {/* ---------- Passport ---------- */}
        <Route path="passport" element={<DigitalPassportPage />} />
        <Route
          path="digital-passport"
          element={<Navigate to="/passport" replace />}
        />

        {/* ---------- Optional / Legacy ---------- */}
        <Route path="membership" element={<MembershipPage />} />
        <Route path="team-travel" element={<TeamTravelPage />} />

        {/* ---------- Protected ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
