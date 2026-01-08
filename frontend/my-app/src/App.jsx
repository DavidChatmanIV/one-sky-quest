import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";
import SkyStreamPage from "./pages/SkyStreamPage";
import DigitalPassportPage from "./pages/DigitalPassportPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app-shell">
      {!hideNavbar && <Navbar />}

      <main className="app-main" id="main">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/booking" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/skystream" element={<SkyStreamPage />} />

          <Route path="/passport" element={<DigitalPassportPage />} />
          <Route path="/digital-passport" element={<DigitalPassportPage />} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}