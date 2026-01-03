import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar"; 

// Pages
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";
import SkyStreamPage from "./pages/SkyStreamPage";
import DigitalPassportPage from "./pages/DigitalPassportPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app-shell">
      {/* ✅ Always visible */}
      <Navbar />

      {/* ✅ Main app content */}
      <main className="app-main" id="main">
        <Routes>
          {/* Discover */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Core */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/skystream" element={<SkyStreamPage />} />

          {/* Passport ✅ */}
          <Route path="/passport" element={<DigitalPassportPage />} />
          <Route path="/digital-passport" element={<DigitalPassportPage />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}