import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";
import SkyStreamPage from "./pages/SkyStreamPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// ✅ Passport gate (members only; blocks guest + logged-out)
import RequireMember from "./auth/RequireMember";

// ✅ Use your existing page path (since your current import is ./pages/DigitalPassportPage)
import DigitalPassportPage from "./pages/DigitalPassportPage";

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

          {/* ✅ Members-only Passport routes */}
          <Route
            path="/passport"
            element={
              <RequireMember>
                <DigitalPassportPage />
              </RequireMember>
            }
          />
          <Route
            path="/digital-passport"
            element={
              <RequireMember>
                <DigitalPassportPage />
              </RequireMember>
            }
          />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}