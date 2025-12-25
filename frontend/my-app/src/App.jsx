import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import SkyStreamPage from "./pages/SkyStreamPage";
import DigitalPassportPage from "./pages/DigitalPassportPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <main className="app-main">
      <Routes>
        {/* Discover */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Core */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/skystream" element={<SkyStreamPage />} />

        {/* Passport ✅ (support both paths to avoid 404) */}
        <Route path="/passport" element={<DigitalPassportPage />} />
        <Route path="/digital-passport" element={<DigitalPassportPage />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}
// deploy-bump
